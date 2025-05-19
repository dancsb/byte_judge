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

  const fileName = submission.language === 'Python' ? 'main.py' : 'main.c';
  fs.writeFileSync(path.join(submissionPath, fileName), submission.sourceCode);

  const inputsPath = path.join(submissionPath, 'inputs');
  fs.mkdirSync(inputsPath);

  exercise.testCases.forEach((testCase, i) => {
    fs.writeFileSync(path.join(inputsPath, `t${i}.txt`), testCase.input);
  });

  const image = submission.language === 'Python' ? 'bytejudge-python-runner' : 'bytejudge-c-runner';

  const container = await docker.createContainer({
    Image: image,
    Cmd: ['/runner/run.sh'],
    WorkingDir: '/app',
    Env: [`TIME_LIMIT=${exercise.timeLimit}s`],
    HostConfig: {
      Binds: [`${submissionPath}:/app`],
      Memory: 100 * 1024 * 1024,
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

  try {
    if (output.includes('COMPILATION_ERROR')) {
      const compilationError = output.split('COMPILATION_ERROR')[1].trim();
      return { compilationError };
    }

    const results = [];
    exercise.testCases.forEach((testCase, i) => {
      const outPath = path.join(submissionPath, 'outputs', `t${i}.txt`);
      const userOutput = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8').trim() : '';
      const timeUsed = parseFloat(output.match(new RegExp(`TIME:(\\d+\\.\\d+)`, 'g'))[i]?.split(':')[1] || 0);
      const memoryUsed = parseInt(output.match(new RegExp(`MEM:(\\d+)`, 'g'))[i]?.split(':')[1] || 0);

      let status;
      let runtimeError = null;

      if (output.includes(`RUNTIME_ERROR:t${i}`)) {
        status = 'RUNTIME_ERROR';
        runtimeError = output.split(`RUNTIME_ERROR:t${i}`)[1]?.trim();
      } else if (output.includes(`TIME_LIMIT_EXCEEDED:t${i}`)) {
        status = 'TIME_LIMIT_EXCEEDED';
      } else if (output.includes(`MEMORY_LIMIT_EXCEEDED:t${i}`)) {
        status = 'MEMORY_LIMIT_EXCEEDED';
      } 
      
      else if (userOutput === testCase.output.trim()) {
        if (timeUsed > exercise.timeLimit) {
          status = 'TIME_LIMIT_EXCEEDED';
        } else if (memoryUsed > exercise.memoryLimitKB * 1024) {
          status = 'MEMORY_LIMIT_EXCEEDED';
        } else {
          status = 'PASSED';
        }
      } else {
        status = 'FAILED';
      }

      results.push({
        input: testCase.input,
        expected: testCase.output,
        actual: userOutput,
        status,
        timeUsed,
        memoryUsed,
        runtimeError
      });
    });

    return { results };
  } finally {
    fs.rmSync(submissionPath, { recursive: true, force: true });
  }
};
