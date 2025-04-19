import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import Portfolio from './components/Portfolio';
import './index.css';

export default function App() {
  const [balance, setBalance] = useState(0);
  const [portfolio, setPortfolio] = useState([]);

  const loadBalance = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/balance');
      console.log('Loaded balance:', res.data.balance);
      setBalance(res.data.balance);
    } catch (err) {
      console.error('Failed to load balance:', err);
    }
  };

  const loadPortfolio = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/portfolio');
      console.log('Loaded portfolio:', res.data);
      setPortfolio(res.data);
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    }
  };

  useEffect(() => {
    loadBalance();
    loadPortfolio();
  }, []);

  const handleBuy = async (symbol, name, quantity, price) => {
    console.log('🛒 [App] handleBuy params:', { symbol, name, quantity, price });
    if (!symbol || !name || typeof quantity !== 'number' || typeof price !== 'number') {
      console.error('❌ Invalid buy arguments', { symbol, name, quantity, price });
      return;
    }

    try {
      const res = await axios.post('http://localhost:5002/api/buy', {
        symbol,
        name,
        quantity,
        price,
      });
      console.log('✅ [App] /api/buy response:', res.data);
      setBalance(res.data.balance);
      await loadPortfolio();
    } catch (err) {
      console.error('❌ [App] Buy failed:', err.response?.data || err.message);
    }
  };

  return (
    <>
      {/* Header */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0f0f0f',
        padding: '15px 30px',
        color: 'white',
        fontFamily: "'Courier New', Courier, monospace",
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }}>
        <div style={{ color: '#00ffcc', fontSize: '1.5rem' }}>
          <a href="http://localhost:3000/" style={{ color: '#00ffcc', textDecoration: 'none' }}>
            🌀 RetroVest
          </a>
        </div>
        <ul style={{
          listStyle: 'none',
          display: 'flex',
          gap: '20px',
          margin: 0,
          padding: 0,
        }}>
          <li><a href="http://localhost:3000/Tmm" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Time Machine</a></li>
          <li><a href="http://localhost:3000/challenge" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Challenge</a></li>
          <li><a href="http://localhost:3000/market-analysis" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Market Analysis</a></li>
          <li><a href="http://localhost:3000/education" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Education</a></li>
          <li><a href="http://localhost:3000/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Login/Signup</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '2rem' }}>
        <h1>Paper Trading App</h1>
        <div className="balance">Balance: ₹{balance.toLocaleString()}</div>
        <SearchBar onBuy={handleBuy} />
        <Portfolio data={portfolio} />
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#0f0f0f',
        color: '#ecf0f1',
        padding: '2rem',
        marginTop: '2rem',
        fontFamily: 'Segoe UI, sans-serif',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '2rem',
          maxWidth: '1200px',
          margin: 'auto',
        }}>
          <div>
            <h3 style={{ color: '#00ffcc' }}>🌀 RetroVest</h3>
            <p>Smart Simulations. Smarter Investing.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="/about" style={{ color: '#ccc', textDecoration: 'none' }}>About</a>
            <a href="/risk" style={{ color: '#ccc', textDecoration: 'none' }}>Risk Profiler</a>
            <a href="/market-analysis" style={{ color: '#ccc', textDecoration: 'none' }}>Market Analysis</a>
            <a href="/sip-calculator" style={{ color: '#ccc', textDecoration: 'none' }}>SIP Calculator</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', textDecoration: 'none' }}>LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ccc', textDecoration: 'none' }}>GitHub</a>
            <a href="mailto:contact@retrovest.ai" style={{ color: '#ccc', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          fontSize: '0.9rem',
          borderTop: '1px solid #333',
          paddingTop: '1rem',
        }}>
          <p>© {new Date().getFullYear()} RetroVest. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
