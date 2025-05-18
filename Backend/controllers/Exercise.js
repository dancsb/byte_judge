'use strict';

var utils = require('../utils/writer.js');
var Exercise = require('../service/ExerciseService');

module.exports.createExercise = function createExercise (req, res, next, body) {
  Exercise.createExercise(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getExercise = function getExercise (req, res, next, id) {
  Exercise.getExercise(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.listExercises = function listExercises (req, res, next) {
  Exercise.listExercises()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
