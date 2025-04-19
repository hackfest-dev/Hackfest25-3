import React from 'react';
import scenarios from '../data/scenarios';
import ScenarioCard from '../components/ScenarioCard';
import './ScenarioSelect.css'; // We'll make a matching container style

function ScenarioSelect() {
  return (
    <div className="page scenario-select">
      <h2>🕰️ Choose Your Market Moment</h2>
      <div className="card-grid">
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </div>
  );
}

export default ScenarioSelect;
