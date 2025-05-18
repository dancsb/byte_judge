const PQueue = require('p-queue').default;
const runSubmission = require('./runner');

const concurrency = process.env.MAX_CONTAINERS || 3;
const queue = new PQueue({ concurrency });

async function enqueueSubmission(submission) {
  submission.status = 'QUEUED';
  await submission.save();

  queue.add(async () => {
    submission.status = 'RUNNING';
    await submission.save();

    try {
      const result = await runSubmission(submission);
      if (result.compilationError) {
        submission.status = 'ERROR';
        submission.compilationError = result.compilationError;
        submission.results = [];
      } else {
        submission.status = 'DONE';
        submission.results = result.results;
        submission.compilationError = undefined;
      }
    } catch (err) {
      submission.status = 'ERROR';
      submission.runtimeError = err.message;
      console.error('Error running submission:', err);
    }

    await submission.save();
  });
}

module.exports = enqueueSubmission;
