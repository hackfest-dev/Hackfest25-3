// frontend/src/Challenge.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Challenge.css';

const MAX_TRADES = 20; // must match backend

export default function AdvancedBenchmark() {
  const [prices, setPrices] = useState([]);
  const [day, setDay]       = useState(0);
  const [status, setStatus] = useState(null);
  const [qty, setQty]       = useState(1);

  // Load historical prices & initial status once
  useEffect(() => {
    axios.get('http://localhost:5001/api/challenge/prices')
         .then(r => setPrices(r.data))
         .catch(console.error);

    fetchStatus();
    // eslint-disable-next-line
  }, []);

  // Fetch /status and sync everything
  const fetchStatus = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/challenge/status');
      console.log('🎯 /status →', data);
      setStatus(data);
      if (typeof data.dayIndex === 'number') {
        setDay(data.dayIndex);
      }
    } catch (err) {
      console.error('❌ fetchStatus error:', err);
      alert('Unable to load status. See console.');
    }
  };

  // Buy: place order, then reload status
  const buy = async () => {
    try {
      await axios.post('http://localhost:5001/api/challenge/buy', { quantity: qty });
      await fetchStatus();
    } catch (e) {
      alert(e.response?.data?.error || 'Buy failed');
    }
  };

  // Sell all: place order, then reload status
  const sell = async () => {
    try {
      await axios.post('http://localhost:5001/api/challenge/sell');
      await fetchStatus();
    } catch (e) {
      alert(e.response?.data?.error || 'Sell failed');
    }
  };

  // Advance day: only allowed if no open positions
  const nextDay = async () => {
    try {
      const { data } = await axios.post('http://localhost:5001/api/challenge/next');
      setDay(data.dayIndex);
      await fetchStatus();
    } catch (e) {
      alert(e.response?.data?.error || 'Cannot advance day');
    }
  };

  if (!prices.length || status === null) {
    return <div className="container">Loading…</div>;
  }

  // Destructure everything with safe defaults
  const {
    date           = '—',
    balance        = 0,
    portfolioValue = 0,
    totalValue     = 0,
    tradeCount     = 0,
    status: gameStatus = '…',
    history        = []
  } = status;

  // Force numbers
  const balNum = Number(balance)        || 0;
  const pfvNum = Number(portfolioValue) || 0;
  const totNum = Number(totalValue)     || 0;
  const tcNum  = Number(tradeCount)     || 0;

  const hasOpen = pfvNum > 0;

  return (
    <div className="container">
      <h1>Beat the Benchmark (Advanced)</h1>

      <div style={{ marginBottom: 20 }}>
        <strong>Day:</strong> {day}/{prices.length - 1} 
        <strong>Date:</strong> {date} 
        <strong>Status:</strong> {gameStatus}
      </div>

      <div style={{ marginBottom: 20 }}>
        <strong>Balance:</strong> ₹{balNum.toFixed(2)} 
        <strong>Portfolio:</strong> ₹{pfvNum.toFixed(2)} 
        <strong>Total:</strong> ₹{totNum.toFixed(2)} 
        <strong>Trades:</strong> {tcNum}/{MAX_TRADES}
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="number" min="1"
          value={qty}
          onChange={e => setQty(Number(e.target.value))}
          style={{ width: 80, marginRight: 10 }}
        />
        <button onClick={buy}>Buy</button>
        <button onClick={sell} style={{ marginLeft: 10 }}>Sell All</button>
        <button
          onClick={nextDay}
          disabled={hasOpen}
          title={hasOpen ? 'Sell all positions before next day' : ''}
          style={{
            marginLeft: 10,
            opacity: hasOpen ? 0.5 : 1,
            cursor: hasOpen ? 'not-allowed' : 'pointer'
          }}
        >
          Next Day
        </button>
      </div>

      <input
        type="range"
        min="0"
        max={prices.length - 1}
        value={day}
        disabled={hasOpen}
        onChange={nextDay}
        style={{ width: '100%' }}
      />

      <h2 style={{ marginTop: 30 }}>Recent Events</h2>
      {history.length > 0 ? (
        <ul className="news-list">
          {history.map((evt, i) => (
            <li key={i}>
              Day {evt.day}: {evt.action === 'news' && `News shock ×${evt.effect}`}
              {evt.action === 'flash-crash' && `Flash crash ×${evt.effect}`}
              {evt.action === 'buy' && `Bought ${evt.qty}@₹${Number(evt.price).toFixed(2)} (fee ₹${evt.fee})`}
              {evt.action === 'sell' && `Sold all for ₹${evt.gross} (fee ₹${evt.fee}, slip ₹${evt.slip})`}
              {evt.action === 'margin-call' && `Margin call penalty ₹${evt.penalty}`}
              {evt.action === 'maint-liquidation' && `Maint. liquidation ₹${evt.gross} (fee ₹${evt.fee})`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No events yet.</p>
      )}
    </div>
  );
}
