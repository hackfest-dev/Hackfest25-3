import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-hero">
        <h1>RetroVest</h1>
        <p>⏳ Time Travel Through Markets. Invest Smart. Learn From History.</p>
        <button onClick={() => navigate("/time-machine")}>
          Enter the Time Machine
        </button>
      </div>

      <div className="landing-side-by-side">
        <div className="sip-block">
          <h2>Ready to Plan Your SIP?</h2>
          <p>
            See how systematic investments stack up against a fixed deposit at
            7% p.a..
          </p>
          <button
            className="sip-btn"
            onClick={() => navigate("/sip-calculator")}
          >
            Try the SIP Calculator →
          </button>
        </div>

        <div className="education-block">
          <h2>📘 Educate Yourself About the Stock Market</h2>
          <p>
            Learn about stocks, SIPs, ETFs, market crashes and more with
            interactive content.
          </p>
          <button
            className="education-btn"
            onClick={() => navigate("/education")}
          >
            Start Learning →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
