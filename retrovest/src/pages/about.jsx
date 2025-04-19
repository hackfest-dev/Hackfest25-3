import React from 'react';
import './about.css';
import { FaLinkedin } from 'react-icons/fa';

const team = [
  {
    name: 'Sai Shriyank DH',
    image: '/images/dev1.jpg', // replace with real paths
    linkedin: 'https://www.linkedin.com/in/sai-shriyank-d-h-71269525a/'
  },
  {
    name: 'Pruthvi R',
    image: '/images/dev2.jpg',
    linkedin: 'https://www.linkedin.com/in/pruthvi-r-33a66b254/'
  },
  {
    name: 'Sharathchandra Patil',
    image: '/images/dev3.jpg',
    linkedin: 'https://www.linkedin.com/in/sharathchandra-patil/'
  },
  {
    name: 'Soumyadeep Ghosh',
    image: 'retrovest/src/images/soumyadeep.png',
    linkedin: 'https://www.linkedin.com/in/soumyadeep-ghosh-bmsit/'
  }
];

export default function About() {
  return (
    <div className="about-container">
      <h1>About RetroVest</h1>
      <p>
        RetroVest is an innovative investment simulator platform built during HackFest a 36-hour hackathon at NMAMIT. 
        It allows users to explore financial markets historically and in real time, empowering them with tools like 
        AI-based risk profiling, gamified learning, and SIP vs FD comparisons to make smarter investment decisions. 
        RetroVest bridges the gap between education and real-world investing by simulating strategies, analyzing 
        sector-wise news trends, and comparing returns across asset classes such as stocks, fixed deposits, and gold.
      </p>

      <h2>Meet the Developers</h2>
      <div className="developer-cards">
        {team.map((dev, index) => (
          <div key={index} className="dev-card">
            <img src={dev.image} alt={dev.name} />
            <h3>{dev.name}</h3>
            <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}