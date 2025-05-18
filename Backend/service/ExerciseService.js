'use strict';

const Exercise = require('../models/Exercise');

/**
 * Create a new exercise
 *
 * body Exercise_body 
 * returns inline_response_201_1
 **/
exports.createExercise = function(body) {
  return new Promise(async function(resolve, reject) {
    try {
      const newExercise = new Exercise(body);
      await newExercise.save();
      resolve({ exerciseId: newExercise._id });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Get details of a single exercise
 *
 * id String 
 * returns inline_response_200_5
 **/
exports.getExercise = function(id) {
  return new Promise(async function(resolve, reject) {
    try {
      const exercise = await Exercise.findById(id);
      if (!exercise) {
        return reject({ message: 'Exercise not found' });
      }
      resolve(exercise);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * List all exercises
 *
 * returns List
 **/
exports.listExercises = function() {
  return new Promise(async function(resolve, reject) {
    try {
      const exercises = await Exercise.find();
      resolve(exercises);
    } catch (err) {
      reject(err);
    }
  });
}
