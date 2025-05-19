'use strict';

var utils = require('../utils/writer.js');
var Submission = require('../service/SubmissionService');
var verifyToken = require('../utils/verifyToken.js');

module.exports.getSubmissionStatus = function getSubmissionStatus (req, res, next, id) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  Submission.getSubmissionStatus(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSubmissionsByExercise = function getSubmissionsByExercise (req, res, next, exerciseId) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  Submission.getSubmissionsByExercise(userId, exerciseId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.submitSolution = function submitSolution (req, res, next, body) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  body.userId = userId;

  Submission.submitSolution(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
