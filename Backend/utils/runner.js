const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Exercise = require('../models/Exercise');
const docker = new Docker();

module.exports = async function runSubmission(submission) {
  const exercise = await Exercise.findById(submission.exerciseId);
  const submissionId = uuidv4();
  const submissionPath = path.join(__dirname, 'submissions', submissionId);
  fs.mkdirSync(submissionPath, { recursive: true });

  fs.writeFileSync(path.join(submissionPath, 'main.c'), submission.sourceCode);

  const inputsPath = path.join(submissionPath, 'inputs');
  fs.mkdirSync(inputsPath);

  exercise.testCases.forEach((testCase, i) => {
    fs.writeFileSync(path.join(inputsPath, `t${i}.txt`), testCase.input);
  });

  const container = await docker.createContainer({
    Image: 'bytejudge-c-runner',
    Cmd: ['/runner/run.sh'],
    WorkingDir: '/app',
    Env: [`TIME_LIMIT=${exercise.timeLimit}s`],
    HostConfig: {
      Binds: [`${submissionPath}:/app`],
      Memory: exercise.memoryLimitMB * 1024 * 1024,
      CpuShares: 128,
      NetworkMode: 'none',
      AutoRemove: true
    }
  });

  const stream = await container.attach({ stream: true, stdout: true, stderr: true });
  await container.start();

  let output = '';
  stream.on('data', chunk => output += chunk.toString());
  await container.wait();

  if (output.includes('COMPILATION_ERROR')) {
    const compilationError = output.split('COMPILATION_ERROR')[1].trim();
    return { compilationError };
  }

  const results = [];
  exercise.testCases.forEach((testCase, i) => {
    const outPath = path.join(submissionPath, 'outputs', `t${i}.txt`);
    const userOutput = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8').trim() : '';
    const timeUsed = parseFloat(output.match(new RegExp(`TIME:(\\d+\\.\\d+)`, 'g'))[i].split(':')[1]);
    const memoryUsed = parseInt(output.match(new RegExp(`MEM:(\\d+)`, 'g'))[i].split(':')[1]);

    if (output.includes(`RUNTIME_ERROR:t${i}`)) {
      const runtimeError = output.split(`RUNTIME_ERROR:t${i}`)[1].trim();
      results.push({
        input: testCase.input,
        expected: testCase.output,
        actual: userOutput,
        passed: false,
        error: runtimeError,
        timeUsed,
        memoryUsed
      });
    } else {
      results.push({
        input: testCase.input,
        expected: testCase.output,
        actual: userOutput,
        passed: userOutput === testCase.output.trim(),
        timeUsed,
        memoryUsed
      });
    }
  });

  fs.rmdirSync(submissionPath, { recursive: true });

  return { results };
};
