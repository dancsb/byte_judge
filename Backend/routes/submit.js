const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const enqueueSubmission = require('../queue');

router.post('/submit', async (req, res) => {
  const { userId, exerciseId, sourceCode } = req.body;
  const submission = new Submission({ userId, exerciseId, sourceCode });
  await submission.save();
  await enqueueSubmission(submission);
  res.status(202).json({ message: 'Submission received', submissionId: submission._id });
});

module.exports = router;
