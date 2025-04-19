import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>🌀 RetroVest</h3>
          <p>Smart Simulations. Smarter Investing.</p>
        </div>

        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/risk">Risk Profiler</a>
          <a href="/market-analysis">Market Analysis</a>
          <a href="/sip-calculator">SIP Calculator</a>
        </div>

        <div className="footer-social">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="mailto:contact@retrovest.ai">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} RetroVest. All rights reserved.</p>
      </div>
    </footer>
  );
}
