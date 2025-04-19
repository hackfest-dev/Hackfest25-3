import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import scenarios from '../data/scenarios';
import './SimulationPage.css';

function SimulationPage() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const scenario = scenarios.find((s) => s.id === parseInt(scenarioId));
  const [step, setStep] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [hasChosen, setHasChosen] = useState(false);

  if (!scenario) {
    return (
      <div className="simulation-container">
        <h2>❌ Scenario not found</h2>
        <p>Please go back and select a valid scenario.</p>
      </div>
    );
  }

  if (!scenario.steps || scenario.steps.length === 0) {
    return (
      <div className="simulation-container">
        <h2>⚠️ No steps available for this scenario.</h2>
        <p>We're working on adding content. Try a different one for now.</p>
      </div>
    );
  }

  const currentStep = scenario.steps[step];

  const handleDecision = (choice) => {
    const isCorrect = choice === currentStep.bestDecision;
    const feedbackMsg = isCorrect
      ? `✅ Correct! ${currentStep.lesson}`
      : `❌ Wrong. The better choice was "${currentStep.bestDecision}". ${currentStep.lesson}`;

    setFeedback(feedbackMsg);
    setHasChosen(true);

    const newDecision = {
      step: step,
      userChoice: choice,
      isCorrect: isCorrect,
      correctChoice: currentStep.bestDecision,
      explanation: currentStep.lesson,
    };

    setDecisions([...decisions, newDecision]);
  };

  const handleNext = () => {
    setFeedback(null);
    setHasChosen(false);
    if (step + 1 < scenario.steps.length) {
      setStep(step + 1);
    } else {
      navigate('/summary', { state: { decisions, scenarioTitle: scenario.title } });
    }
  };

  return (
    <div className="simulation-container">
      <div className="simulation-info">
        <div className="info-block">
          <h3>📅 Date:</h3>
          <p>{currentStep.date}</p>
        </div>
        <div className="info-block">
          <h3>💼 Portfolio Value:</h3>
          <p>${currentStep.portfolioValue.toLocaleString()}</p>
        </div>
        <div className="info-block">
          <h3>📈 Holdings:</h3>
          <ul>
            {Object.entries(currentStep.holdings).map(([ticker, qty]) => (
              <li key={ticker}>{ticker}: {qty} shares</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="news-section">
        <h3>📰 Market News:</h3>
        <ul>
          {Array.isArray(currentStep.news) ? currentStep.news.map((item, index) => (
            <li key={index}>{item}</li>
          )) : <li>{currentStep.news}</li>}
        </ul>
      </div>

      <div className="decision-panel">
        <h3>📊 Your Decision:</h3>
        <div className="decision-buttons">
          {currentStep.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleDecision(option)}
              className="decision-button"
              style={{
                margin: '8px',
                padding: '10px 20px',
                backgroundColor: '#282c34',
                color: '#fff',
                border: '2px solid #61dafb',
                borderRadius: '8px',
                fontFamily: 'Courier New, monospace',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
              disabled={hasChosen}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="feedback-popup">
          {feedback}
          <br />
          <button
            onClick={handleNext}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#61dafb',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontFamily: 'Courier New, monospace',
              cursor: 'pointer',
            }}
          >
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
}

export default SimulationPage;
