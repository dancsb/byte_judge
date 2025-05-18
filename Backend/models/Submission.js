const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  input: String,
  expected: String,
  actual: String,
  status: { type: String, enum: ['PASSED', 'FAILED', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED'], required: true },
  timeUsed: Number,
  memoryUsed: Number,
  runtimeError: String
});

const SubmissionSchema = new mongoose.Schema({
  userId: String,
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  sourceCode: String,
  status: { type: String, enum: ['QUEUED', 'RUNNING', 'DONE', 'ERROR'], default: 'QUEUED' },
  results: [ResultSchema],
  createdAt: { type: Date, default: Date.now },
  compilationError: String
});

module.exports = mongoose.model('Submission', SubmissionSchema);
