// const express = require('express');
// const cors = require('cors');
// const yahooFinance = require('yahoo-finance2').default;
// require('dotenv').config();

// const app = express();

// // ✅ Middleware
// app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));

// // ✅ Safe import of risk routes
// try {
//   const riskRoutes = require('./routes/risk');
//   app.use('/api/risk', riskRoutes);
// } catch (err) {
//   console.error("❌ Failed to load './routes/risk'. Please check for syntax errors.");
//   console.error(err);
// }

// // ✅ Market quote endpoint
// app.get('/api/quote', async (req, res) => {
//   const symbols = req.query.symbols;
//   if (!symbols) {
//     return res.status(400).json({ error: 'Missing symbols query parameter.' });
//   }

//   const symbolArray = symbols.split(',');
//   try {
//     const result = await yahooFinance.quote(symbolArray);
//     res.json({ quoteResponse: { result } });
//   } catch (error) {
//     console.error('Error fetching data from yahoo-finance2:', error);
//     res.status(500).json({ error: 'Failed to fetch data from Yahoo Finance.' });
//   }
// });

// // ✅ Catch-all for invalid routes
// app.all('*', (req, res) => {
//   res.status(404).send(`Invalid API route: ${req.method} ${req.originalUrl}`);
// });

// // ✅ Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });



// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// -------------------- Yahoo Finance Quote API --------------------

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

// -------------------- Time Machine Mode --------------------

const stockData = require('./stockData.json');
let session = {
  year: null,
  shownStocks: [],
  current: null,
  step: 'idle'
};

app.post('/api/timemachine/start', (req, res) => {
  const { year } = req.body;
  const stocks = Object.keys(stockData);
  const unused = stocks.filter(s => !session.shownStocks.includes(s));

  if (!year || unused.length === 0) {
    return res.status(400).json({ error: 'Year not set or no more stocks' });
  }

  const symbol = unused[Math.floor(Math.random() * unused.length)];
  const stock = stockData[symbol];
  const fundamentals = stock[year - 1];
  if (!fundamentals) {
    return res.status(400).json({ error: `No fundamentals for year ${year - 1}` });
  }

  const history = [];
  for (let i = 3; i >= 1; i--) {
    const pastYear = year - i;
    if (stock[pastYear]) {
      const current = stock[year - 1];
      const previous = stock[pastYear];
      const revenueChange = ((current.revenue - previous.revenue) / previous.revenue) * 100;
      const profitChange = ((current.profit - previous.profit) / previous.profit) * 100;
      history.push({
        year: pastYear,
        fundamentals: previous,
        revenueLabel: revenueChange > 5 ? 'Growing Revenue' : revenueChange < -5 ? 'Declining Revenue' : 'Stable Revenue',
        profitLabel: profitChange > 5 ? 'Growing Profit' : profitChange < -5 ? 'Declining Profit' : 'Stable Profit'
      });
    }
  }

  session.shownStocks.push(symbol);
  session.current = { symbol, stock, year };
  session.step = 'shown';

  res.json({
    fundamentals: stock[year - 1],
    history,
    year,
    message: 'Should you buy this stock?'
  });
});

app.post('/api/timemachine/choice', (req, res) => {
  session.choice = req.body.choice;
  res.json({ success: true });
});

app.get('/api/timemachine/reveal', (req, res) => {
  if (!session.current) return res.status(400).json({ error: 'No stock in session' });
  const { stock, symbol, year } = session.current;
  const prev = stock[year - 1];
  const curr = stock[year];
  if (!curr || !prev) return res.status(500).json({ error: 'Missing data for this stock/year' });

  const priceDiff = curr.endPrice - prev.startPrice;
  const profit = ((priceDiff / prev.startPrice) * 100).toFixed(2);
  const verdict = (session.choice === 'buy' && priceDiff > 0) || (session.choice === 'skip' && priceDiff < 0)
    ? 'Good decision!' : 'Bad decision.';

  session.step = 'revealed';

  res.json({
    reveal: curr,
    profit: priceDiff.toFixed(2),
    percent: profit,
    verdict,
    stock: symbol,
    tag: curr.tag,
    reason: curr.reason || ''
  });
});

// -------------------- Challenge Mode --------------------

const CSV_PATH = path.join(__dirname, 'prices_nifty_2008_09.csv');
const raw = fs.readFileSync(CSV_PATH, 'utf8').trim();
const lines = raw.split(/\r?\n/).filter(l => /^\d{4}-\d{2}-\d{2},/.test(l));
const prices = lines.map(line => {
  const [date, close] = line.split(',').map(s => s.trim());
  return { date, basePrice: parseFloat(close) };
});

const STARTING_CASH = 50000;
const MAX_LEVERAGE = 2.0;
const MAINTENANCE_RATIO = 0.25;
const FEE_RATE = 0.002;
const MAX_TRADES = 20;
const EVENT_CHANCE = 0.4;
const SHOCK_RANGE = 0.30;
const FLASH_CRASH_CHANCE = 0.10;
const SLIPPAGE_RATE = 0.05;
const MARGIN_CALL_CHANCE = 0.05;

let state = {
  dayIndex: 0,
  balance: STARTING_CASH,
  positions: [],
  history: [],
  tradeCount: 0
};

function getTodayPrice() {
  const base = prices[state.dayIndex].basePrice;
  if (Math.random() < FLASH_CRASH_CHANCE) {
    const factor = Math.random() * 0.8 + 0.1;
    state.history.push({ action: 'flash-crash', day: state.dayIndex, effect: factor.toFixed(2) });
    return base * factor;
  }
  if (Math.random() < EVENT_CHANCE) {
    const factor = 1 + (Math.random() * 2 * SHOCK_RANGE - SHOCK_RANGE);
    state.history.push({ action: 'news', day: state.dayIndex, effect: factor.toFixed(2) });
    return base * factor;
  }
  return base;
}

function portfolioValue() {
  const price = getTodayPrice();
  return state.positions.reduce((sum, p) => sum + p.quantity * price, 0);
}

function enforceMaintenanceMargin() {
  const pv = portfolioValue();
  const borrowed = Math.max(0, pv - state.balance);
  const equity = state.balance + pv - borrowed;
  if (borrowed > 0 && equity / borrowed < MAINTENANCE_RATIO) {
    const price = getTodayPrice();
    const gross = state.positions.reduce((s, p) => s + p.quantity * price, 0);
    const fee = gross * FEE_RATE;
    state.history.push({ action: 'maint-liquidation', day: state.dayIndex, gross: gross.toFixed(2), fee: fee.toFixed(2) });
    state.balance += gross - fee;
    state.positions = [];
    state.tradeCount++;
  }
}

function checkMarginCall() {
  if (Math.random() < MARGIN_CALL_CHANCE && state.positions.length) {
    const price = getTodayPrice();
    const gross = state.positions.reduce((s, p) => s + p.quantity * price, 0);
    const penalty = gross * 0.10;
    state.history.push({ action: 'margin-call', day: state.dayIndex, penalty: penalty.toFixed(2) });
    state.balance += gross - penalty;
    state.positions = [];
    state.tradeCount++;
  }
}

app.get('/api/challenge/status', (req, res) => {
  const dayIdx = state.dayIndex;
  const date = prices[dayIdx].date;
  const pv = portfolioValue();
  const bal = state.balance;
  const tot = bal + pv;
  res.json({
    dayIndex: dayIdx,
    date,
    balance: +bal.toFixed(2),
    portfolioValue: +pv.toFixed(2),
    totalValue: +tot.toFixed(2),
    tradeCount: state.tradeCount,
    status: tot <= 0 ? 'Liquidated' : 'Alive',
    history: state.history
  });
});

app.post('/api/challenge/buy', (req, res) => {
  if (state.tradeCount >= MAX_TRADES) return res.status(400).json({ error: 'Max trades reached' });
  const qty = Number(req.body.quantity);
  const price = getTodayPrice();
  const cost = qty * price * (1 + FEE_RATE);
  if (cost > state.balance) return res.status(400).json({ error: 'Insufficient funds' });

  state.balance -= cost;
  state.positions.push({ quantity: qty, avgPrice: price });
  state.history.push({ action: 'buy', day: state.dayIndex++, qty, price: price.toFixed(2), fee: (qty * price * FEE_RATE).toFixed(2) });
  state.tradeCount++;
  res.json({ balance: +state.balance.toFixed(2), tradeCount: state.tradeCount });
});

app.post('/api/challenge/sell', (req, res) => {
  if (state.positions.length === 0) return res.status(400).json({ error: 'Nothing to sell' });
  const price = getTodayPrice();
  const gross = state.positions.reduce((s, p) => s + p.quantity * price, 0);
  const fee = gross * FEE_RATE;
  const slip = gross * SLIPPAGE_RATE;
  state.balance += gross - fee - slip;
  state.history.push({ action: 'sell', day: state.dayIndex++, gross: gross.toFixed(2), fee: fee.toFixed(2), slip: slip.toFixed(2) });
  state.positions = [];
  state.tradeCount++;
  res.json({ balance: +state.balance.toFixed(2), tradeCount: state.tradeCount });
});

app.post('/api/challenge/next', (req, res) => {
  if (state.positions.length > 0) return res.status(400).json({ error: 'You have open positions—sell all before moving to the next day' });
  enforceMaintenanceMargin();
  checkMarginCall();
  if (state.dayIndex < prices.length - 1) state.dayIndex++;
  res.json({ dayIndex: state.dayIndex, date: prices[state.dayIndex].date });
});

app.get('/api/challenge/prices', (req, res) => {
  res.json(prices);
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Merged server running on http://localhost:${PORT}`));
