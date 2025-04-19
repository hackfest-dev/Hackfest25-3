import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ScenarioCard.css';

const ScenarioCard = ({ scenario }) => {
  const navigate = useNavigate();

  return (  
    <div className="scenario-card">
      <h2>Challenge {scenario.id}</h2>

      <button onClick={() => navigate(`/simulate/${scenario.id}`)}>
        Start Simulation
      </button>
    </div>
  );
};

export default ScenarioCard;
