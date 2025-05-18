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
      const results = await runSubmission(submission);
      submission.status = 'DONE';
      submission.results = results;
    } catch (err) {
      submission.status = 'ERROR';
      console.error('Error running submission:', err);
    }

    await submission.save();
  });
}

module.exports = enqueueSubmission;
