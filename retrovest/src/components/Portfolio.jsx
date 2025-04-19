// frontend/src/components/Portfolio.jsx

import React from 'react';
import './Portfolio.css';

export default function Portfolio({ data }) {
  // Compute aggregates
  const totalQty      = data.reduce((sum, item) => sum + item.quantity, 0);
  const totalInvested = data.reduce((sum, item) => sum + item.avgPrice * item.quantity, 0);
  const totalPL       = data.reduce((sum, item) => {
    const plNum = parseFloat(item.profitLoss);
    return sum + (isNaN(plNum) ? 0 : plNum);
  }, 0);

  // pick a color: green for profit, red for loss, white for zero
  const plColor = totalPL > 0
    ? 'lightgreen'
    : totalPL < 0
      ? 'salmon'
      : 'white';

  return (
    <div className="portfolio">
      <div
        className="portfolio-header"
      >
        <h2>📊 Portfolio Overview</h2>
        <div className="portfolio-totals">
          <span><strong>Total Qty:</strong> {totalQty}</span>
          <span><strong>Invested:</strong> ₹{totalInvested.toFixed(2)}</span>
          <span style={{ color: plColor }}><strong>P/L:</strong> ₹{totalPL.toFixed(2)}</span>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="no-holdings">No holdings yet.</p>
      ) : (
        <div className="portfolio-table-wrapper">
          <table className="portfolio-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Avg Price (₹)</th>
                <th>Current Price (₹)</th>
                <th>P/L (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => {
                const { symbol, name, quantity, avgPrice, currentPrice, profitLoss } = item;
                return (
                  <tr key={symbol} className="fade-item">
                    <td>{name}</td>
                    <td>{quantity}</td>
                    <td>{avgPrice.toFixed(2)}</td>
                    <td>{currentPrice != null ? currentPrice.toFixed(2) : avgPrice.toFixed(2)}</td>
                    <td>{profitLoss}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
