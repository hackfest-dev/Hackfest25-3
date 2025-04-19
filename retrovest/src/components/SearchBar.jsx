// frontend/src/components/SearchBar.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.css';

export default function SearchBar({ onBuy }) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [qty, setQty]         = useState(1);

  const handleInput = async e => {
    const q = e.target.value;
    setQuery(q);
    if (!q) return setResults([]);
    try {
      const res = await axios.get(`http://localhost:5001/api/search?q=${q}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className="search-bar">
      <h3 className="search-bar-title">📈 Search Stocks to Invest In</h3>
      <ul className="search-results">
        {results.map(r => {
          const symbolParam = r.symbol || r.name;
          const quantity    = Number(qty);
          const unitPrice   = Number(r.price);
          const totalPrice  = Number.isFinite(unitPrice)
            ? (unitPrice * quantity).toFixed(2)
            : '—';

          return (
            <li key={symbolParam} className="fade-item search-result-item">
              <div className="search-result-info">
                <span className="search-result-symbol">{symbolParam}</span>
                <span>— ₹{unitPrice.toFixed(2)} each</span>
                <strong>Total: ₹{totalPrice}</strong>
              </div>
              <button onClick={() => onBuy(symbolParam, r.name, quantity, unitPrice)}>
                Buy
              </button>
            </li>
          );
        })}
      </ul>
      <div className="search-inputs">
        <input
          type="text"
          placeholder="Type company or ticker…"
          value={query}
          onChange={handleInput}
        />
        <input
          type="number"
          min="1"
          value={qty}
          onChange={e => setQty(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
