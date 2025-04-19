// src/components/MarketAnalysis.jsx
import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './MarketAnalysis.css';

const indexSymbols = [
  { symbol: '^BSESN', name: 'Sensex' },
  { symbol: '^NSEI', name: 'Nifty 50' },
  { symbol: '^NSEBANK', name: 'Bank Nifty' }
];

const sectorTickers = {
  'Information Technology': ['TCS.NS', 'INFY.NS', 'WIPRO.NS'],
  Pharmaceuticals: ['SUNPHARMA.NS', 'CIPLA.NS', 'DRREDDY.NS'],
  'Financial Services': ['HDFCBANK.NS', 'ICICIBANK.NS', 'KOTAKBANK.NS'],
  'Consumer Goods': ['HINDUNILVR.NS', 'ITC.NS', 'DMART.NS'],
  Energy: ['ONGC.NS', 'GAIL.NS', 'POWERGRID.NS']
};

const NEWS_URL = 'https://stock.indianapi.in/news';
const NEWS_KEY = 'sk-live-pGAvnWFvvM9x0AaCYFq9t6NrtvUidytlbzTx2bZc';

function fetchData(symbols, cb) {
  fetch(`/api/quote?symbols=${symbols.join(',')}`)
    .then(r => r.json())
    .then(j => cb(j.quoteResponse?.result || []))
    .catch(err => {
      console.error('Quote fetch error', err);
      cb([]);
    });
}

function Indices() {
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    function load() {
      fetchData(indexSymbols.map(i => i.symbol), raw => {
        setIndices(
          raw.map(item => ({
            ...item,
            displayName: indexSymbols.find(i => i.symbol === item.symbol)?.name || item.symbol
          }))
        );
      });
    }
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="indices-container">
      {indices.map(idx => {
        const ch = idx.regularMarketChangePercent || 0;
        const cls = `card ${ch < 0 ? 'negative' : 'positive'}`;
        return (
          <div key={idx.symbol} className={cls}>
            <h3>{idx.displayName}</h3>
            <p><strong>Price:</strong> {idx.regularMarketPrice?.toFixed(2)}</p>
            <p>
              {ch < 0 ? <FaArrowDown style={{ verticalAlign: 'middle' }} /> : <FaArrowUp style={{ verticalAlign: 'middle' }} />} {Math.abs(ch).toFixed(2)}%
            </p>
          </div>
        );
      })}
    </div>
  );
}

function NewsInsights() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(NEWS_URL, {
      headers: { 'x-api-key': NEWS_KEY }
    })
      .then(r => r.json())
      .then(arr => setNews(arr.slice(0, 6)))
      .catch(err => {
        console.error('News fetch error', err);
        setNews([]);
      });
  }, []);

  if (!news.length) return null;

  return (
    <div className="news-insights-container">
      <h2 className="news-insights-title">News Insights</h2>
      <div className="news-marquee-container">
        <div className="news-marquee">
          {news.map((art, i) => (
            <div key={i} className="news-marquee-card">
              <a href={art.url} target="_blank" rel="noopener noreferrer">
                {art.title}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectorSection({ sector, tickers }) {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    function loadQuotes() {
      fetchData(tickers, setStocks);
    }
    loadQuotes();
    const iv = setInterval(loadQuotes, 30000);
    return () => clearInterval(iv);
  }, [tickers]);

  return (
    <section className="sector-section">
      <h2 className="sector-title">{sector}</h2>
      <div className="company-cards">
        {stocks.map(co => {
          const ch = co.regularMarketChangePercent || 0;
          const cls = `card ${ch < 0 ? 'negative' : 'positive'}`;
          return (
            <div key={co.symbol} className={cls}>
              <h3>{co.shortName || co.symbol}</h3>
              <p><strong>LTP:</strong> {co.regularMarketPrice?.toFixed(2)}</p>
              <p>
                {ch < 0 ? <FaArrowDown style={{ verticalAlign: 'middle' }} /> : <FaArrowUp style={{ verticalAlign: 'middle' }} />} {Math.abs(ch).toFixed(2)}%
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function MarketAnalysis() {
  return (
    <div className="market-analysis-container">
      <h1>Indian Market Sector Analysis</h1>
      <Indices />
      <NewsInsights />
      {Object.entries(sectorTickers).map(([sec, ticks]) => (
        <SectorSection key={sec} sector={sec} tickers={ticks} />
      ))}
    </div>
  );
}
