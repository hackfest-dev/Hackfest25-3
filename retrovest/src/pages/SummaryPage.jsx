import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SummaryPage.css';

function SummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { decisions = [], scenarioTitle = '' } = location.state || {};

  const handleGenerateNew = async () => {
    try {
      const response = await fetch('http://localhost:5000/generate-scenario', {
        method: 'POST',
      });
      const data = await response.json();
      const newScenario = JSON.parse(data.scenario);

      // You would update this based on how your app stores scenarios (context/global state recommended)
      console.log('Generated Scenario:', newScenario);

      navigate('/');
    } catch (error) {
      console.error('Error generating new scenario:', error);
      alert('Failed to generate new scenario. Please try again.');
    }
  };

  return (
    <div className="summary-container">
      <h2>📘 Summary Report: {scenarioTitle}</h2>
      {decisions.length === 0 ? (
        <p>No decisions recorded. Please try a scenario first.</p>
      ) : (
        <div className="decision-log">
          {decisions.map((decision, index) => (
            <div
              key={index}
              className={`decision-entry ${decision.isCorrect ? 'correct' : 'wrong'}`}
            >
              <div className="step-header">
                <span className="step-number">Step {decision.step + 1}</span>
                <span className={`status-tag ${decision.isCorrect ? 'correct' : 'wrong'}`}>
                  {decision.isCorrect ? '✅ Correct' : '❌ Wrong'}
                </span>
              </div>
              <p><strong>Your Choice:</strong> {decision.userChoice}</p>
              <p><strong>Correct Choice:</strong> {decision.correctChoice}</p>
              <p><strong>Explanation:</strong> {decision.explanation}</p>
            </div>
          ))}
        </div>
      )}

      <div className="summary-buttons">
        <button onClick={() => navigate('/')} className="retro-button">🏠 Back to Home</button>
        <button onClick={handleGenerateNew} className="retro-button generate">🎲 Try Another Scenario</button>
      </div>
    </div>
  );
}

export default SummaryPage;
