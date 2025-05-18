'use strict';

const Submission = require('../models/Submission');
const enqueueSubmission = require('../queue');

/**
 * Get submission status and results
 * Returns the evaluation status and results (if available)
 *
 * id String 
 * returns inline_response_200_3
 **/
exports.getSubmissionStatus = function(id) {
  return new Promise(async function(resolve, reject) {
    try {
      const submission = await Submission.findById(id);
      if (!submission) {
        return reject({ message: 'Submission not found' });
      }
      resolve({
        status: submission.status,
        results: submission.status === 'DONE' ? submission.results : null
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Submit a new code solution
 * Accepts userId, exerciseId, and sourceCode. Queues the submission for evaluation.
 *
 * body Submission_body 
 * returns inline_response_202
 **/
exports.submitSolution = function(body) {
  return new Promise(async function(resolve, reject) {
    try {
      const { userId, exerciseId, sourceCode } = body;
      const submission = new Submission({ userId, exerciseId, sourceCode });
      await submission.save();
      await enqueueSubmission(submission);
      resolve({ message: 'Submission received', submissionId: submission._id });
    } catch (err) {
      reject(err);
    }
  });
}
