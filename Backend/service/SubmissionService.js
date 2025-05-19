'use strict';

const Submission = require('../models/Submission');
const enqueueSubmission = require('../utils/queue');

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
      const submission = await Submission.findById({ _id: id });
      if (!submission) {
        return reject({ status: 404, message: 'Submission not found' });
      }

      const mappedResults = submission.results?.map(result => ({
        status: result.status,
        timeUsed: result.timeUsed,
        memoryUsed: result.memoryUsed,
        runtimeError: result.runtimeError || null
      })) || null;

      resolve({
        status: submission.status,
        results: submission.status === 'DONE' ? mappedResults : null,
        compilationError: submission.compilationError || null
      });
    } catch (err) {
      reject({ status: 500, message: err.message });
    }
  });
}


/**
 * Get all submissions for a specific exercise by a user
 * Returns a list of all submissions for a specific exercise
 *
 * exerciseId String The ID of the exercise
 * returns List
 **/
exports.getSubmissionsByExercise = function(userId, exerciseId) {
  return new Promise(async function(resolve, reject) {
    try {
      const submissions = await Submission.find({ userId, exerciseId });

      const mappedSubmissions = submissions.map(submission => {
        const passedCount = submission.results?.filter(result => result.status === 'PASSED').length || 0;
        const totalCount = submission.results?.length || 0;
        return {
          id: submission._id,
          status: submission.status,
          submittedAt: submission.submittedAt,
          results: `${passedCount}/${totalCount}`
        };
      });
      
      resolve(mappedSubmissions);
    } catch (err) {
      reject({ status: 500, message: err.message });
    }
  });
};


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
      reject({ status: 500, message: 'Internal server error' });
    }
  });
}

