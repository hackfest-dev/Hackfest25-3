// routes/risk.js
const express = require('express');
const router = express.Router();
const { getRiskAnalysis } = require('../gemini');

router.post('/analyze', async (req, res) => {
  const questionAnswers = req.body.answers;

  if (!Array.isArray(questionAnswers)) {
    return res.status(400).json({ error: 'Invalid input format' });
  }

  try {
    const result = await getRiskAnalysis(questionAnswers);
    res.json({ analysis: result });
  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: 'Gemini API call failed' });
  }
});

module.exports = router;
