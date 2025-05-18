'use strict';

var utils = require('../utils/writer.js');
var Exercise = require('../service/ExerciseService');
var verifyToken = require('../utils/verifyToken.js');

module.exports.createExercise = function createExercise (req, res, next, body) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  Exercise.createExercise(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getExercise = function getExercise (req, res, next, id) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  Exercise.getExercise(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.listExercises = function listExercises (req, res, next) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  Exercise.listExercises()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
