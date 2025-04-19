import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import scenarios from '../data/scenarios';
import './SimulationPage.css';

function SimulationPage() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const scenario = scenarios.find(s => s.id === parseInt(scenarioId, 10));
  const [step, setStep] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [hasChosen, setHasChosen] = useState(false);

  if (!scenario) {
    return (
      <div className="simulation-wrapper">
        <div className="simulation-container">
          <h2>❌ Scenario not found</h2>
          <p>Please go back and select a valid scenario.</p>
        </div>
      </div>
    );
  }

  const steps = scenario.steps || [];
  if (steps.length === 0) {
    return (
      <div className="simulation-wrapper">
        <div className="simulation-container">
          <h2>⚠️ No steps available for this scenario.</h2>
          <p>We're working on adding content. Try a different one for now.</p>
        </div>
      </div>
    );
  }

  const currentStep = steps[step];
  const lastIndex = steps.length - 1;

  const handleDecision = choice => {
    const isCorrect = choice === currentStep.bestDecision;
    const feedbackMsg = isCorrect
      ? `✅ Correct! ${currentStep.lesson}`
      : `❌ Wrong. The better choice was "${currentStep.bestDecision}". ${currentStep.lesson}`;

    setFeedback(feedbackMsg);
    setHasChosen(true);
    setDecisions(prev => [...prev, {
      step,
      userChoice: choice,
      isCorrect,
      correctChoice: currentStep.bestDecision,
      explanation: currentStep.lesson,
    }]);
  };

  const handleNext = () => {
    setFeedback(null);
    setHasChosen(false);
    if (step < lastIndex) {
      setStep(step + 1);
    } else {
      navigate('/summary', { state: { decisions, scenarioTitle: scenario.title } });
    }
  };

  return (
    <div className="simulation-wrapper">
      <div className="simulation-container">
        <div className="timeline">
          {step === lastIndex && <div className="timeline-bar-complete" />}
          {steps.map((s, idx) => (
            <div key={idx} className={`timeline-item ${idx <= step ? 'active' : ''}`}>
              <div className="dot" />
              <span className="label">{idx === step ? s.date : ''}</span>
            </div>
          ))}
        </div>

        

        <div className="news-section">
          <h3>📰 Market News:</h3>
          <ul>
            {Array.isArray(currentStep.news)
              ? currentStep.news.map((item, idx) => <li key={idx}>{item}</li>)
              : <li>{currentStep.news}</li>}
          </ul>
        </div>

        <div className="decision-panel">
          <h3>📊 Your Decision:</h3>
          <div className="decision-buttons">
            {currentStep.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleDecision(option)}
                className="decision-button"
                disabled={hasChosen}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {feedback && (
          <div className="feedback-popup">
            {feedback}<br />
            <button onClick={handleNext} className="next-button">Next ➡️</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimulationPage;