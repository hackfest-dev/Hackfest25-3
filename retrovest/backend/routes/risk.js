const express = require('express');
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;
const riskRoutes = require('./routes/risk');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Needed to parse JSON bodies

// Routes
app.use('/api/risk', riskRoutes); // Gemini risk analysis route

app.get('/api/quote', async (req, res) => {
  const symbols = req.query.symbols;
  if (!symbols) {
    return res.status(400).json({ error: 'Missing symbols query parameter.' });
  }

  const symbolArray = symbols.split(',');
  try {
    const result = await yahooFinance.quote(symbolArray);
    res.json({ quoteResponse: { result } });
  } catch (error) {
    console.error('Error fetching data from yahoo-finance2:', error);
    res.status(500).json({ error: 'Failed to fetch data from Yahoo Finance.' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});




// YOU FUCKED UP CORRECT IT