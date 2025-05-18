'use strict';

var utils = require('../utils/writer.js');
var Submission = require('../service/SubmissionService');

module.exports.getSubmissionStatus = function getSubmissionStatus (req, res, next, id) {
  Submission.getSubmissionStatus(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.submitSolution = function submitSolution (req, res, next, body) {
  Submission.submitSolution(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
