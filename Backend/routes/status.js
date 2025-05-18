const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

router.get('/submission/:id', async (req, res) => {
  const submission = await Submission.findById(req.params.id);
  if (!submission) return res.status(404).send('Not found');
  res.json({
    status: submission.status,
    results: submission.status === 'DONE' ? submission.results : null
  });
});

module.exports = router;
