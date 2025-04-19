// src/components/Challenge.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Challenge.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const MAX_TRADES = 20;

export default function AdvancedBenchmark() {
  const [prices, setPrices] = useState([]);
  const [day, setDay] = useState(0);
  const [status, setStatus] = useState(null);
  const [qty, setQty] = useState(1);
  const [valueHistory, setValueHistory] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/challenge/prices')
         .then(r => setPrices(r.data))
         .catch(console.error);
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/challenge/status');
      setStatus(data);
      if (typeof data.dayIndex === 'number') {
        setDay(data.dayIndex);
      }
      setValueHistory(prev => {
        const updated = [...prev, { x: `Day ${data.dayIndex}`, y: data.totalValue }];
        return updated.slice(-50); // keep recent 50
      });
    } catch (err) {
      console.error('❌ fetchStatus error:', err);
      alert('Unable to load status. See console.');
    }
  };

  const buy = async () => {
    try {
      await axios.post('http://localhost:5001/api/challenge/buy', { quantity: qty });
      await fetchStatus();
    } catch (e) {
      alert(e.response?.data?.error || 'Buy failed');
    }
  };

  const sell = async () => {
    try {
      await axios.post('http://localhost:5001/api/challenge/sell');
      await fetchStatus();
    } catch (e) {
      alert(e.response?.data?.error || 'Sell failed');
    }
  };

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

  const {
    date           = '—',
    balance        = 0,
    portfolioValue = 0,
    totalValue     = 0,
    tradeCount     = 0,
    status: gameStatus = '…',
    history        = []
  } = status;

  const balNum = Number(balance) || 0;
  const pfvNum = Number(portfolioValue) || 0;
  const totNum = Number(totalValue) || 0;
  const tcNum  = Number(tradeCount) || 0;
  const hasOpen = pfvNum > 0;

  // show "Dead" if not explicitly "Alive"
  const displayStatus = gameStatus === 'Alive' ? 'Alive' : 'Dead';

  const chartData = {
    labels: valueHistory.map((pt) => pt.x),
    datasets: [
      {
        label: 'Total Value',
        data: valueHistory,
        backgroundColor: 'white',
        tension: 0.4,
        fill: false,
        pointRadius: 3,
        borderWidth: 2,
        segment: {
          borderColor: ctx => {
            const up = ctx.p1.parsed.y > ctx.p0.parsed.y;
            return up ? 'green' : 'red';
          }
        }
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 500,
      easing: 'easeInOutQuart',
    },
    scales: {
      y: {
        ticks: { color: '#ccc' },
        grid: { color: '#333' }
      },
      x: {
        ticks: { color: '#ccc' },
        grid: { color: '#333' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#ccc' },
      },
    }
  };

  return (
    <div className="advanced-benchmark">
      <div className="left-panel">
        <h1>Beat the Benchmark (Advanced)</h1>
        <div>
          <strong>Day:</strong> {day}/{prices.length - 1} &emsp;
          <strong>Date:</strong> {date} &emsp;
          <strong>Status:</strong> {displayStatus}
        </div>

        <div style={{ marginTop: 10 }}>
          <strong>Balance:</strong> ₹{balNum.toFixed(2)} &emsp;
          <strong>Portfolio:</strong> ₹{pfvNum.toFixed(2)} &emsp;
          <strong>Total:</strong> ₹{totNum.toFixed(2)} &emsp;
          <strong>Trades:</strong> {tcNum}/{MAX_TRADES}
        </div>

        <div className="controls">
          <input
            type="number"
            min="1"
            value={qty}
            onChange={e => setQty(Number(e.target.value))}
          />
          <button onClick={buy}>Buy</button>
          <button onClick={sell}>Sell All</button>
          <button
            onClick={nextDay}
            disabled={hasOpen}
            style={{
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
          style={{ marginTop: 20 }}
        />
      </div>

      <div className="right-panel">
        <Line data={chartData} options={chartOptions} />

        {/* ==== RECENT EVENTS BELOW CHART ==== */}
        <h2 style={{ color: '#eee', marginTop: '30px' }}>Recent Events</h2>
        {history.length > 0 ? (
          <ul className="news-list">
            {history.map((evt, i) => (
              <li key={i}>
                Day {evt.day}:&nbsp;
                {evt.action === 'news' && `News shock ×${evt.effect}`}
                {evt.action === 'flash-crash' && `Flash crash ×${evt.effect}`}
                {evt.action === 'buy' && `Bought ${evt.qty}@₹${Number(evt.price).toFixed(2)} (fee ₹${evt.fee})`}
                {evt.action === 'sell' && `Sold all for ₹${evt.gross} (fee ₹${evt.fee}, slip ₹${evt.slip})`}
                {evt.action === 'margin-call' && `Margin call penalty ₹${evt.penalty}`}
                {evt.action === 'maint-liquidation' && `Maint. liquidation ₹${evt.gross} (fee ₹${evt.fee})`}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#aaa', marginTop: '10px' }}>No events yet.</p>
        )}
      </div>
    </div>
  );
}
