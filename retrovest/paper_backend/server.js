// backend/server.js

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const axios   = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const INDIANAPI_KEY = "sk-live-qmpJWlYexZLo572CxnwdAdaAAcK4lWy49uZCiUVq";
const API_BASE      = "https://stock.indianapi.in";

let balance   = 100000;
const portfolio = [];

/**
 * lookupStock(codeOrName) → { symbol, name, price }
 * Handles both search‐by‐name and lookup‐by‐code.
 */
async function lookupStock(codeOrName) {
  const { data } = await axios.get(`${API_BASE}/stock`, {
    params: { name: codeOrName },
    headers: { 'X-Api-Key': INDIANAPI_KEY }
  });

  const ticker = data.tickerId || data.ticker || data.symbol;
  if (!ticker) throw new Error(`No ticker returned for '${codeOrName}'`);

  const price = parseFloat(data.currentPrice?.NSE);
  if (Number.isNaN(price)) throw new Error(`Invalid price for '${ticker}'`);

  return {
    symbol: `${ticker}.NS`,
    name:   data.companyName || ticker,
    price
  };
}

// GET /api/balance
app.get('/api/balance', (req, res) => {
  res.json({ balance });
});

// GET /api/portfolio
app.get('/api/portfolio', async (req, res) => {
  try {
    const updated = [];

    for (const item of portfolio) {
      try {
        // Pull live price by symbol code (before the ".NS")
        const code = item.symbol.split('.')[0];
        const { price: currentPrice } = await lookupStock(code);

        // Compute P/L
        const profitLoss = ((currentPrice - item.avgPrice) * item.quantity).toFixed(2);

        updated.push({
          symbol:       item.symbol,
          name:         item.name,
          quantity:     item.quantity,
          avgPrice:     item.avgPrice,
          currentPrice,
          profitLoss
        });
      } catch (err) {
        console.error(`Error fetching price for ${item.symbol}:`, err.message);
        // Fallback row on error
        updated.push({
          symbol:       item.symbol,
          name:         item.name,
          quantity:     item.quantity,
          avgPrice:     item.avgPrice,
          currentPrice: null,
          profitLoss:   '—'
        });
      }
    }

    return res.json(updated);
  } catch (err) {
    console.error('Portfolio route error:', err);
    return res.status(500).json({ error: 'Failed to load portfolio' });
  }
});


// GET /api/search?q=…
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  // Treat whatever user typed as a ticker code in uppercase
  const code = q.trim().toUpperCase();

  try {
    // Hit the /stock endpoint directly with the uppercase code
    const { data } = await axios.get(`${API_BASE}/stock`, {
      params: { name: code },
      headers: { 'X-Api-Key': INDIANAPI_KEY }
    });

    // Pull out the company name and NSE price
    const name  = data.companyName;
    const price = parseFloat(data.currentPrice?.NSE);

    if (!name || Number.isNaN(price)) {
      // If for some reason the API returns bad data, fall back to empty
      return res.json([]);
    }

    // Return exactly what you want: name + price
    res.json([{ name, price }]);
  } catch (err) {
    console.error('Search error:', err);
    // On any error (not found, 422, etc.) return an empty array
    res.json([]);
  }
});

// POST /api/buy
// POST /api/buy
app.post('/api/buy', (req, res) => {
  const { symbol, name, quantity, price } = req.body;

  // Basic validation
  if (!symbol || !name || typeof quantity !== 'number' || typeof price !== 'number') {
    return res.status(400).json({ error: 'Invalid buy payload' });
  }

  const cost = price * quantity;
  if (cost > balance) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  // Deduct cost from balance
  balance -= cost;

  // Upsert into portfolio
  const existing = portfolio.find(p => p.symbol === symbol);
  if (existing) {
    // Recompute weighted average price
    const totalQty = existing.quantity + quantity;
    existing.avgPrice = (
      (existing.avgPrice * existing.quantity) + cost
    ) / totalQty;
    existing.quantity = totalQty;
  } else {
    portfolio.push({
      symbol,
      name,
      quantity,
      avgPrice: price
    });
  }

  // Return updated balance
  return res.json({ balance });
});


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
