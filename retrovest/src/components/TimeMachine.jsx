import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StockCard from './StockCard';
import './TimeMachine.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin);

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
              const revenueLabel = prev
                ? labelTrend(yearData.fundamentals.revenue, prev.fundamentals.revenue)
                : 'Stable';
              const profitLabel = prev
                ? labelTrend(yearData.fundamentals.profit, prev.fundamentals.profit)
                : 'Stable';

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
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '30px', marginBottom: '20px' }}>
            <StockCard
              title={`End of ${year} Fundamentals`}
              fundamentals={reveal.reveal}
              previousFundamentals={data.fundamentals}
              showTag={true}
              tag={reveal.tag}
              startPrice={data.fundamentals?.startPrice}
              endPrice={reveal.reveal?.endPrice}
            />

            {/* 📊 MULTI-YEAR END PRICE CHART */}
            <div className="price-compare-chart" style={{ flex: 1, maxWidth: 600, height: 300 }}>
              {(() => {
                const endPriceData = data.history?.map(h => ({
                  year: h.year,
                  price: h.fundamentals?.endPrice || 0
                })) || [];
                endPriceData.push({ year, price: reveal.reveal?.endPrice || 0 });

                const labels = endPriceData.map(pt => pt.year.toString());
                const values = endPriceData.map(pt => pt.price);
                const annotations = [];

                for (let i = 1; i < endPriceData.length; i++) {
                  const prev = endPriceData[i - 1].price;
                  const curr = endPriceData[i].price;
                  const change = ((curr - prev) / prev * 100).toFixed(1);
                  annotations.push({
                    type: 'label',
                    xValue: labels[i],
                    yValue: curr,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    content: `${change > 0 ? '+' : ''}${change}%`,
                    color: '#fff',
                    font: { size: 10 },
                  });
                }

                const maxPrice = Math.max(...values);

                const chartData = {
                  labels,
                  datasets: [{
                    label: 'End Price',
                    data: values,
                    backgroundColor: 'white',
                    fill: false,
                    tension: 0.3,
                    pointRadius: 5,
                    borderWidth: 3,
                    segment: {
                      borderColor: ctx => ctx.p1.parsed.y > ctx.p0.parsed.y ? 'green' : 'red'
                    }
                  }]                  
                };

                const chartOptions = {
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: { color: '#ccc' },
                      grid: { color: '#333' }
                    },
                    x: {
                      ticks: { color: '#ccc' },
                      grid: { color: '#333' }
                    }
                  },
                  plugins: {
                    legend: { labels: { color: '#ccc' } },
                    annotation: {
                      annotations: {
                        ...annotations.reduce((acc, ann, i) => {
                          acc[`label${i}`] = ann;
                          return acc;
                        }, {}),
                        maxLine: {
                          type: 'line',
                          yMin: maxPrice,
                          yMax: maxPrice,
                          borderColor: 'green',
                          borderDash: [6, 6],
                          borderWidth: 2,
                          label: {
                            display: true,
                            content: 'Max Price',
                            color: '#0f0',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                          }
                        }
                      }
                    }
                  }
                };

                return <Line data={chartData} options={chartOptions} />;
              })()}
            </div>
          </div>

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