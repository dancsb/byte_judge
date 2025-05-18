const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  input: String,
  output: String
});

const ExerciseSchema = new mongoose.Schema({
  title: String,
  description: String,
  testCases: [TestCaseSchema],
  timeLimit: Number,
  memoryLimitMB: Number
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
