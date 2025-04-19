# RetroVest

![image](https://github.com/user-attachments/assets/3386ca9e-4af9-4cff-be5a-52e6ffc75b42)


## 📖 Overview
RetroVest is a smart investment simulator designed for both historical and live-stock market experiences. Built during a 36‑hour hackathon at NMAMIT, RetroVest gamifies investing by letting users step into the past, paper-trade with real-time data, and earn awards through AI-driven risk profiling.

Key modes:
- **Paper Trading:** Start with a ₹1,00,000 virtual portfolio. Search, buy, and sell Indian stocks with live price quotes.
- **Time Machine:** Choose a year (2013–2025) to evaluate past fundamentals, decide to buy or skip, then see real outcomes and growth charts.
- **Live Market Mode:** Track Nifty flows and sector heatmaps in real time.
- **Education Hub:** Interactive cards teaching investing concepts, plus quizzes and game challenges.

## 🚀 Features
- **Historical & Live Data:** Data fundamentals for 20 Indian stocks (10 red flags, 10 top performers) plus live quotes via Yahoo Finance.
- **Gamification:** Progress tracking, scenario summaries, and learnings.
- **Risk Profiling:** AI-driven suggestions tailored to user actions.
- **Responsive UI:** Web-first, built with React.
- **Hackathon‑Level Delivery:** Full-stack React + Express, in-memory session management—no external database.

## 🛠️ Tech Stack
- **Frontend:** React, React Router, Chart.js
- **Backend:** Node.js, Express, yahoo-finance2, in-memory session storage
- **DevOps:** CORS-enabled server, environment variables via `.env`

## 📂 Repo Structure
```plain
retrovest/
├── backend/
│   ├── server.js
│   ├── stockData.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── index.js
│   └── package.json
├── README.md
└── .gitignore
```

## ⚙️ Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/retrovest.git
   cd retrovest
   ```
2. **Backend setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env if necessary
   npm start
   ```
3. **Frontend setup**:
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
4. **Open** `http://localhost:3000` in your browser.

## 🔧 Configuration
- **backend/.env.example**:
  ```ini
  PORT=5001
  # Optional: credentials for Yahoo Finance if using a session
  ```
- **backend/stockData.json:** Contains historical fundamentals and prices.

## 🎮 Usage
1. **Paper Trading:** Test live-market strategies.
2. **Time Machine:** Simulate historical scenarios.
3. **Education:** Learn investing concepts.
4. **Summary:** Review performance metrics and badges.

## 📸 Screenshots
![image](https://github.com/user-attachments/assets/dea27398-98dd-4a0e-99fd-0b25a55821cb)
![image](https://github.com/user-attachments/assets/bf04a33f-94ca-41b5-9c38-c58e2795c633) ![image](https://github.com/user-attachments/assets/6f134924-6b0d-458d-844b-ad6ba0ecf82e)

<img src="![image](https://github.com/user-attachments/assets/f3dd1463-3da0-40b3-8bb8-83e608c2fc76)" alt="RetroVest Logo" width="200" />


## 🤝 Contribution
We welcome contributions:
1. Fork the repo.
2. Create a branch: `git checkout -b feat/your-feature`.
3. Commit changes: `git commit -m "Add feature"`.
4. Push: `git push origin feat/your-feature`.
5. Open a PR.

🏆 Credit & License
**Team Members:**
- Sharathchandra Patil ([LinkedIn](https://www.linkedin.com/in/sharathchandra-patil/))
- Pruthvi R ([LinkedIn](https://www.linkedin.com/in/pruthvi-r-33a66b254/))
- Sai Shriyank D H ([LinkedIn](https://www.linkedin.com/in/sai-shriyank-d-h-71269525a/))
- Soumyadeep Ghosh ([LinkedIn](https://www.linkedin.com/in/soumyadeep-ghosh-bmsit/))

Built during HackFest 2025 at NMAMIT.

**License:** MIT © 2025 RetroVest Team

