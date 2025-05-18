'use strict';


/**
 * Get submission status and results
 * Returns the evaluation status and results (if available)
 *
 * id String 
 * returns inline_response_200_3
 **/
exports.getSubmissionStatus = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "results" : [ {
    "input" : "input",
    "actual" : "actual",
    "expected" : "expected",
    "passed" : true,
    "error" : "error"
  }, {
    "input" : "input",
    "actual" : "actual",
    "expected" : "expected",
    "passed" : true,
    "error" : "error"
  } ],
  "status" : "status"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "submissionId" : "submissionId",
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

