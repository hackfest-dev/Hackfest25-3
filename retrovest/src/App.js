// // frontend/src/App.js
// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import LandingPage from './pages/LandingPage';
// import ScenarioSelect from './pages/ScenarioSelect';
// import SimulationPage from './pages/SimulationPage';
// import SummaryPage from './pages/SummaryPage';
// import SignupPage from './pages/SignupPage';
// import MarketAnalysis from './components/MarketAnalysis';
// import SIPCalculator from './components/SIPCalculator';
// import EducationPage from './components/EducationPage';
// import Login from './pages/Login';
// import RiskProfiler from './components/RiskProfiler';
// import About from './pages/about';
// import Footer from './components/Footer';
// import TimeMachine from './components/TimeMachine';
// import AdvancedBenchmark from './components/Challenge';
// import Tmm from './pages/tmm'
// export default function App() {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/footer" element={<Footer />} />

//         <Route path="/" element={<LandingPage />} />
//         <Route path="/risk" element={<RiskProfiler />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/time-machine" element={<ScenarioSelect />} />
//         <Route path="/simulate/:scenarioId" element={<SimulationPage />} />
//         <Route path="/summary" element={<SummaryPage />} />
//         <Route path="/SignupPage" element={<SignupPage />} />
//         <Route path="/market-analysis" element={<MarketAnalysis />} />
//         <Route path="/sip-calculator" element={<SIPCalculator />} />
//         <Route path="/education" element={<EducationPage />} />

//         <Route path="/time-machine-2" element={<TimeMachine />} />
//         <Route path="/challenge" element={<AdvancedBenchmark />} />
//         <Route path="/tmm" element={<Tmm/>} />

//         <Route path="/port" element={<Tmm/>} />

//       </Routes>
//       <Footer />

//     </>
//   );
// }



// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import Portfolio from './components/Portfolio';
import LandingPage from './pages/LandingPage';
import ScenarioSelect from './pages/ScenarioSelect';
import SimulationPage from './pages/SimulationPage';
import SummaryPage from './pages/SummaryPage';
import SignupPage from './pages/SignupPage';
import MarketAnalysis from './components/MarketAnalysis';
import SIPCalculator from './components/SIPCalculator';
import EducationPage from './components/EducationPage';
import Login from './pages/Login';
import RiskProfiler from './components/RiskProfiler';
import About from './pages/about';
import Footer from './components/Footer';
import TimeMachine from './components/TimeMachine';
import AdvancedBenchmark from './components/Challenge';
import Tmm from './pages/tmm';

import './index.css';

export default function App() {
  const [balance, setBalance] = useState(0);
  const [portfolio, setPortfolio] = useState([]);

  const loadBalance = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/balance');
      console.log('Loaded balance:', res.data.balance);
      setBalance(res.data.balance);
    } catch (err) {
      console.error('Failed to load balance:', err);
    }
  };

  const loadPortfolio = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/portfolio');
      console.log('Loaded portfolio:', res.data);
      setPortfolio(res.data);
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    }
  };

  useEffect(() => {
    loadBalance();
    loadPortfolio();
  }, []);

  const handleBuy = async (symbol, name, quantity, price) => {
    console.log('🛒 [App] handleBuy params:', { symbol, name, quantity, price });
    if (!symbol || !name || typeof quantity !== 'number' || typeof price !== 'number') {
      console.error('❌ Invalid buy arguments', { symbol, name, quantity, price });
      return;
    }

    try {
      const res = await axios.post('http://localhost:5002/api/buy', {
        symbol,
        name,
        quantity,
        price
      });
      console.log('✅ [App] /api/buy response:', res.data);
      setBalance(res.data.balance);
      await loadPortfolio();
    } catch (err) {
      console.error('❌ [App] Buy failed:', err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/risk" element={<RiskProfiler />} />
        <Route path="/about" element={<About />} />
        <Route path="/time-machine" element={<ScenarioSelect />} />
        <Route path="/simulate/:scenarioId" element={<SimulationPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/SignupPage" element={<SignupPage />} />
        <Route path="/market-analysis" element={<MarketAnalysis />} />
        <Route path="/sip-calculator" element={<SIPCalculator />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/time-machine-2" element={<TimeMachine />} />
        <Route path="/challenge" element={<AdvancedBenchmark />} />
        <Route path="/tmm" element={<Tmm />} />

        {/* Paper Trading View */}
        <Route path="/port" element={
          <div className="container">
            <h1>Paper Trading App</h1>
            <div className="balance">Balance: ₹{balance.toLocaleString()}</div>
            <SearchBar onBuy={handleBuy} />
            <Portfolio data={portfolio} />
          </div>
        } />
      </Routes>
      <Footer />
    </>
  );
}
