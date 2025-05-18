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
      const { title, description, testCases, timeLimit, memoryLimitKB } = body;

      if (!testCases || testCases.length < 2) {
        return reject({ status: 400, message: 'At least 2 input-output pairs are required' });
      }

      const formattedTestCases = testCases.map(testCase => ({
        input: testCase.input,
        output: testCase.output,
      }));

      const newExercise = new Exercise({
        title,
        description,
        testCases: formattedTestCases,
        timeLimit,
        memoryLimitKB,
      });

      await newExercise.save();
      resolve({ exerciseId: newExercise._id });
    } catch (err) {
      reject({ status: 500, message: 'Failed to create exercise', error: err.message });
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
      const exercise = await Exercise.findById({ _id: id });
      if (!exercise) {
        return reject({ status: 404, message: 'Exercise not found' });
      }
      resolve({
        id: exercise._id,
        title: exercise.title,
        description: exercise.description,
        testCases: exercise.testCases.slice(0, 2).map(testCase => ({
          input: testCase.input,
          output: testCase.output
        }))
      });
    } catch (err) {
      reject({ status: 500, message: err.message });
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
      const exercises = await Exercise.find({});
      const exerciseList = exercises.map(exercise => ({
        id: exercise._id,
        title: exercise.title
      }));
      resolve({ exercises: exerciseList });
    } catch (err) {
      reject({ status: 500, message: err.message });
    }
  });
}

