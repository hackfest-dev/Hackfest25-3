// src/components/RiskProfiler.jsx
import React, { useState } from 'react';
import './RiskProfiler.css';

const questions = [
  {
    q: 'What is your age group?',
    options: [
      { text: 'Under 25', score: 3 },
      { text: '25 - 40', score: 2 },
      { text: 'Above 40', score: 1 },
    ],
  },
  {
    q: 'What’s your primary goal for investing?',
    options: [
      { text: 'High growth in short-term', score: 3 },
      { text: 'Wealth creation over long-term', score: 2 },
      { text: 'Capital preservation', score: 1 },
    ],
  },
  {
    q: 'What would you do if your portfolio dropped 20% in a month?',
    options: [
      { text: 'Buy more — it’s an opportunity!', score: 3 },
      { text: 'Wait and watch', score: 2 },
      { text: 'Sell everything!', score: 1 },
    ],
  },
  {
    q: 'How long can you keep your money invested without needing it?',
    options: [
      { text: '5+ years', score: 3 },
      { text: '2–5 years', score: 2 },
      { text: 'Less than 2 years', score: 1 },
    ],
  },
  {
    q: 'What percentage of your income can you comfortably invest monthly?',
    options: [
      { text: 'More than 30%', score: 3 },
      { text: '10–30%', score: 2 },
      { text: 'Less than 10%', score: 1 },
    ],
  },
  {
    q: 'Which type of assets are you most comfortable with?',
    options: [
      { text: 'Stocks / Crypto', score: 3 },
      { text: 'Mutual Funds / SIPs', score: 2 },
      { text: 'FDs / Gold / Bonds', score: 1 },
    ],
  },
  {
    q: 'What is your reaction to market volatility?',
    options: [
      { text: 'I thrive on it!', score: 3 },
      { text: 'Neutral', score: 2 },
      { text: 'Makes me nervous', score: 1 },
    ],
  },
  {
    q: 'If you earned a big bonus, you would…',
    options: [
      { text: 'Invest in small cap stocks or crypto', score: 3 },
      { text: 'Put into mutual funds / ETFs', score: 2 },
      { text: 'Save or repay debt', score: 1 },
    ],
  }
];

function RiskProfiler() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (score) => {
    const updatedAnswers = [...answers];
    updatedAnswers[step] = score;
    setAnswers(updatedAnswers);
  };

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const getProfile = () => {
    const total = answers.reduce((a, b) => a + b, 0);
    const avg = total / answers.length;
    if (avg >= 2.5) {
      return {
        label: '🚀 High Risk Taker',
        advice: [
          "You're comfortable with volatility and seek aggressive growth.",
          "Allocate ~60-70% to stocks (focus on small-cap, emerging sectors, and thematic ETFs).",
          "~15-20% to mutual funds (equity-oriented or sectoral).",
          "~5-10% in gold ETFs for long-term stability.",
          "Limit FDs or debt funds to <10%."
        ]
      };
    }

    if (avg >= 1.8) {
      return {
        label: '🧘 Moderate Risk Taker',
        advice: [
          "You prefer a balanced portfolio with moderate growth.",
          "Allocate ~40-50% to stocks (mid-cap, large-cap).",
          "~20-30% to mutual funds (diversified equity + hybrid funds).",
          "~10-15% in FDs or debt mutual funds for stability.",
          "~10% in gold (sovereign bonds or ETFs)."
        ]
      };
    }

    return {
      label: '🛡️ Low Risk Taker',
      advice: [
        "You value capital preservation over high returns.",
        "Allocate ~40-50% to FDs and debt mutual funds.",
        "~20-30% in SIPs of balanced or conservative hybrid funds.",
        "~10% in gold (digital gold or ETFs) as a hedge.",
        "Limit stock exposure to <10%, preferably large-cap or blue-chip."
      ]
    };
  };

  const profile = getProfile();

  const submitToGemini = async () => {
    const payload = questions.map((q, i) => ({
      q: q.q,
      a: q.options.find(opt => opt.score === answers[i])?.text || 'N/A'
    }));

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/risk/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payload }),
      });

      const text = await res.text();
      console.log('Gemini raw response:', text);
      const data = JSON.parse(text);
      setAnalysis(data.analysis);
    } catch (err) {
      console.error('Error fetching Gemini analysis:', err);
    }
    setLoading(false);
  };

  return (
    <div className="risk-profiler-container">
      <h2>🧠 Risk Profiling Analysis</h2>
      {step < questions.length ? (
        <div className="question-card">
          <p><strong>Q{step + 1}: {questions[step].q}</strong></p>
          {questions[step].options.map((opt, idx) => (
            <button
              key={idx}
              className={`option-button ${answers[step] === opt.score ? 'selected' : ''}`}
              onClick={() => handleAnswer(opt.score)}>
              {opt.text}
            </button>
          ))}
          <div className="nav-buttons">
            {step > 0 && <button onClick={prev}>⬅️ Back</button>}
            {answers[step] !== null && <button onClick={next}>Next ➡️</button>}
          </div>
        </div>
      ) : (
        <div className="result-card">
          <h3>Your Profile: {profile.label}</h3>
          <ul>
            {profile.advice.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
          {!analysis && !loading && (
            <button onClick={submitToGemini}>🔎 Generate AI Investment Portfolio</button>
          )}
          {loading && <p>🌀 Generating AI analysis...</p>}
          {analysis && (
            <div className="ai-report">
              <h3>📊 Gemini AI Portfolio Suggestion</h3>
              <p>{analysis}</p>
            </div>
          )}
          <button onClick={() => { setStep(0); setAnswers(Array(questions.length).fill(null)); setAnalysis(null); }}>🔁 Restart</button>
        </div>
      )}
    </div>
  );
}

export default RiskProfiler;
