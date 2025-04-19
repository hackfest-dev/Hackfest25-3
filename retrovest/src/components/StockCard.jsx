// frontend/src/components/StockCard.jsx
import React from 'react';
import './StockCard.css';

function percentChange(current, prev) {
  if (typeof current !== 'number' || typeof prev !== 'number' || prev === 0) return '';
  const diff = ((current - prev) / Math.abs(prev)) * 100;
  return diff.toFixed(1);
}

export default function StockCard({
  title,
  fundamentals,
  previousFundamentals,
  showTag,
  tag,
  startPrice,
  endPrice
}) {
  const showDelta = (field) =>
    previousFundamentals && percentChange(fundamentals[field], previousFundamentals[field]) !== ''
      ? (
        <span style={{ color: fundamentals[field] > previousFundamentals[field] ? 'green' : 'red' }}>
          {' '}
          ({percentChange(fundamentals[field], previousFundamentals[field])}%)
        </span>
      )
      : null;

  const renderPrice = () => {
    const price = endPrice || fundamentals.price;
    if (!startPrice || !endPrice) return <>₹{price}</>;
    const diff = percentChange(endPrice, startPrice);
    const color = endPrice > startPrice ? 'green' : endPrice < startPrice ? 'red' : 'white';
    return (
      <>
        ₹{price}
        <span style={{ color }}> ({diff}%)</span>
      </>
    );
  };

  return (
    <div className="stock-card">
      <h3>{title}</h3>
      <ul>
        <li><strong>Revenue:</strong> ₹{fundamentals.revenue} Cr{showDelta('revenue')}</li>
        <li><strong>Profit:</strong> ₹{fundamentals.profit} Cr{showDelta('profit')}</li>
        <li><strong>EPS:</strong> ₹{fundamentals.eps}{showDelta('eps')}</li>
        <li><strong>Debt:</strong> ₹{fundamentals.debt} Cr{showDelta('debt')}</li>
        <li><strong>PE Ratio:</strong> {fundamentals.pe}{showDelta('pe')}</li>
        <li><strong>Price:</strong> {renderPrice()}</li>
      </ul>

      {showTag && (
        <div className="tag-label">
          {tag === 'red-flag' && <span className="red-flag">🚩 Red Flag</span>}
          {tag === 'top-performer' && <span className="top-performer">🚀 Top Performer</span>}
        </div>
      )}
    </div>
  );
}
