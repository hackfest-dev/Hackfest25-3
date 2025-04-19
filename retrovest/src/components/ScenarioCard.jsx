import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ScenarioCard.css';

const ScenarioCard = ({ scenario }) => {
  const navigate = useNavigate();

  return (
    <div className="scenario-card">
      <h2>{scenario.title}</h2>
      <p className="years">{scenario.years}</p>
      <p className="description">{scenario.description}</p>
      <button onClick={() => navigate(`/simulate/${scenario.id}`)}>
        Start Simulation
      </button>
    </div>
  );
};

export default ScenarioCard;
