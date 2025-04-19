// frontend/src/components/TimeMachine.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StockCard from './StockCard';
import './TimeMachine.css';

function labelTrend(current, previous) {
  if (typeof current !== 'number' || typeof previous !== 'number') return 'Stable';
  const change = ((current - previous) / Math.abs(previous)) * 100;
  if (change > 5) return 'Growing';
  if (change < -5) return 'Declining';
  return 'Stable';
}

export default function TimeMachine() {
  const [year, setYear] = useState(2013);
  const [phase, setPhase] = useState('start');
  const [data, setData] = useState(null);
  const [reveal, setReveal] = useState(null);
  const [verdict, setVerdict] = useState('');
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    if (phase === 'show') {
      axios.post('http://localhost:5001/api/timemachine/start', { year })
        .then(res => setData(res.data))
        .catch(e => alert(e.response?.data?.error || 'Error loading stock'));
    }
  }, [phase, year]);

  const handleBuy = () => {
    axios.post('http://localhost:5001/api/timemachine/choice', { choice: 'buy' })
      .then(() => {
        setPhase('reveal');
        fetchReveal();
      });
  };

  const handleSkip = () => {
    axios.post('http://localhost:5001/api/timemachine/choice', { choice: 'skip' })
      .then(() => {
        setPhase('reveal');
        fetchReveal();
      });
  };

  const fetchReveal = () => {
    axios.get('http://localhost:5001/api/timemachine/reveal')
      .then(res => {
        setReveal(res.data);
        setVerdict(res.data.verdict);
        setShowNext(true);
      });
  };

  const handleNext = () => {
    setPhase('show');
    setReveal(null);
    setVerdict('');
    setShowNext(false);
  };

  return (
    <div className="time-machine">
      <h1>🕰️ Time Machine Mode</h1>

      {phase === 'start' && (
        <div className="year-select">
          <label>Select a year: </label>
          <select value={year} onChange={e => setYear(Number(e.target.value))}>
            {Array.from({ length: 2025 - 2013 + 1 }, (_, i) => 2013 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button onClick={() => setPhase('show')}>Start</button>
        </div>
      )}

      {phase === 'show' && data && (
        <div className="stock-phase">
          <h2>📈 Evaluate this opportunity</h2>
          <div className="history-wrapper">
            {data.history?.map((yearData, idx, arr) => {
              const prev = idx > 0 ? arr[idx - 1] : null;
              const revenueLabel = prev ? labelTrend(yearData.fundamentals.revenue, prev.fundamentals.revenue) : 'Stable';
              const profitLabel = prev ? labelTrend(yearData.fundamentals.profit, prev.fundamentals.profit) : 'Stable';

              const labelClass =
                revenueLabel === 'Growing' && profitLabel === 'Growing' ? 'growing' :
                revenueLabel === 'Declining' && profitLabel === 'Declining' ? 'declining' :
                'stable';

              return (
                <div key={yearData.year} className={`history-card ${labelClass}`}>
                  <div className="fundamental-labels">
                    <div className="revenue">{revenueLabel} Revenue</div>
                    <div className="profit">{profitLabel} Profit</div>
                  </div>
                  <StockCard
                    title={yearData.year}
                    fundamentals={yearData.fundamentals}
                  />
                </div>
              );
            })}
          </div>
          <div className="action-buttons">
            <button onClick={handleBuy}>Buy</button>
            <button onClick={handleSkip}>Skip</button>
          </div>
        </div>
      )}

      {phase === 'reveal' && reveal && (
        <div className="stock-phase">
          <h2>🎯 Outcome</h2>
          <StockCard
            title={`End of ${year} Fundamentals`}
            fundamentals={reveal.reveal}
            previousFundamentals={data.fundamentals}
            showTag={true}
            tag={reveal.tag}
            startPrice={data.fundamentals?.startPrice}
            endPrice={reveal.reveal?.endPrice}
          />
          <p><strong>Verdict:</strong> {verdict}</p>
          <p><strong>Actual Stock:</strong> {reveal.stock}</p>
          <p><strong>Reason:</strong> {reveal.reason}</p>
          {showNext && (
            <button onClick={handleNext} className="next-button">Next Stock</button>
          )}
        </div>
      )}
    </div>
  );
}
