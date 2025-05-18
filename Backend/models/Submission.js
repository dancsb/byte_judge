const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  input: String,
  expected: String,
  actual: String,
  passed: Boolean,
  error: String
});

const SubmissionSchema = new mongoose.Schema({
  userId: String,
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  sourceCode: String,
  status: { type: String, enum: ['QUEUED', 'RUNNING', 'DONE', 'ERROR'], default: 'QUEUED' },
  results: [ResultSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
