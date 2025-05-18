'use strict';


/**
 * Create a new exercise
 *
 * body Exercise_body 
 * returns inline_response_201_1
 **/
exports.createExercise = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "exerciseId" : "exerciseId"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "timeLimit" : 0.8008281904610115,
  "testCases" : [ {
    "input" : "input",
    "expected" : "expected"
  }, {
    "input" : "input",
    "expected" : "expected"
  } ],
  "memoryLimitMB" : 6.027456183070403,
  "description" : "description",
  "id" : "id",
  "title" : "title"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * List all exercises
 *
 * returns List
 **/
exports.listExercises = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "description" : "description",
  "id" : "id",
  "title" : "title"
}, {
  "description" : "description",
  "id" : "id",
  "title" : "title"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

