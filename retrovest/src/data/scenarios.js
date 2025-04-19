const scenarios = [
  {
    id: 1,
    title: "Dot-Com Boom & Bust (1999–2003)",
    steps: [
      {
        date: "January 1999",
        portfolioValue: 100000,
        holdings: ["Infosys", "Wipro"],
        news: [
          "IT stocks are soaring! Infosys, Wipro, and Satyam see record-high P/E ratios.",
          "Experts call this a 'new economic era.'"
        ],
        lesson: "Excessive optimism signals a potential bubble.",
        options: ["Buy IT stocks", "Diversify", "Avoid IT stocks"],
        bestDecision: "Diversify"
      },
      {
        date: "February 2000",
        portfolioValue: 160000,
        holdings: ["Infosys", "Wipro", "TCS"],
        news: ["Infosys reports 100% revenue growth.", "Analysts say IT will dominate for decades."],
        lesson: "Growth can be real, but valuations matter.",
        options: ["Buy more", "Hold", "Sell partially"],
        bestDecision: "Sell partially"
      },
      {
        date: "June 2000",
        portfolioValue: 140000,
        holdings: ["Infosys", "TCS"],
        news: ["U.S. dot-com companies start collapsing.", "Indian IT stocks drop 20% in a week."],
        lesson: "Global events impact Indian markets.",
        options: ["Panic sell", "Hold", "Buy more"],
        bestDecision: "Hold"
      },
      {
        date: "March 2001",
        portfolioValue: 80000,
        holdings: ["Infosys"],
        news: ["The dot-com bubble bursts—Infosys drops 80% from its peak."],
        lesson: "Overvaluation leads to harsh corrections.",
        options: ["Exit", "Hold for recovery", "Buy the dip"],
        bestDecision: "Buy the dip (but selectively)"
      },
      {
        date: "December 2003",
        portfolioValue: 150000,
        holdings: ["Infosys", "Wipro", "TCS"],
        news: ["IT stocks recover. Infosys grows into a global giant."],
        lesson: "Strong companies bounce back.",
        options: ["Long-term hold", "Take profits", "Reinvest"],
        bestDecision: "Long-term hold"
      }
    ]
  },
  {
    id: 2,
    title: "Global Financial Crisis (2007–2010)",
    steps: [
      {
        date: "October 2007",
        portfolioValue: 120000,
        holdings: ["HDFC Bank", "Reliance"],
        news: ["Sensex crosses 20,000 for the first time!", "Analysts predict another 5 years of growth."],
        lesson: "Market peaks create overconfidence.",
        options: ["Invest aggressively", "Hold", "Book some profits"],
        bestDecision: "Book some profits"
      },
      {
        date: "February 2008",
        portfolioValue: 100000,
        holdings: ["HDFC Bank"],
        news: ["Lehman Brothers faces financial issues."],
        lesson: "Early warning signs appear before major crashes.",
        options: ["Reduce exposure", "Hold", "Ignore global news"],
        bestDecision: "Reduce exposure"
      },
      {
        date: "September 2008",
        portfolioValue: 60000,
        holdings: ["HDFC Bank", "Infosys", "ITC"],
        news: ["Lehman collapses. Sensex crashes 40%."],
        lesson: "Crashes test investor patience.",
        options: ["Panic sell", "Hold", "Buy quality stocks"],
        bestDecision: "Buy quality stocks"
      },
      {
        date: "June 2009",
        portfolioValue: 85000,
        holdings: ["HDFC Bank", "Infosys", "ITC", "L&T"],
        news: ["Indian economy recovers faster than expected."],
        lesson: "Markets rebound sharply after a crash.",
        options: ["Buy more", "Hold", "Stay cautious"],
        bestDecision: "Buy more"
      },
      {
        date: "December 2010",
        portfolioValue: 130000,
        holdings: ["HDFC Bank", "Infosys", "ITC", "L&T", "TCS"],
        news: ["Stocks hit new highs."],
        lesson: "Staying invested in tough times pays off.",
        options: ["Learn patience", "Sell", "Reinvest"],
        bestDecision: "Learn patience"
      }
    ]
  },
  {
    id: 3,
    title: "Demonetization Shock (2016–2017)",
    steps: [
      {
        date: "November 2016",
        portfolioValue: 100000,
        holdings: ["HDFC Bank", "ICICI Bank"],
        news: ["₹500 & ₹1000 notes no longer legal tender.", "Chaos as people scramble to exchange cash."],
        lesson: "Policy shocks create market uncertainty.",
        options: ["Sell stocks", "Hold", "Buy banking & fintech stocks"],
        bestDecision: "Buy banking & fintech stocks"
      },
      {
        date: "November 2016",
        portfolioValue: 110000,
        holdings: ["HDFC Bank", "ICICI Bank", "Infosys"],
        news: ["ATM lines stretch for hours.", "Online transactions up 300%."],
        lesson: "Consumer behavior shifts fast when forced.",
        options: ["Invest more in fintech", "Sell IT stocks", "Buy gold"],
        bestDecision: "Invest more in fintech"
      },
      {
        date: "December 2016",
        portfolioValue: 125000,
        holdings: ["HDFC Bank", "Infosys", "Kotak Mahindra Bank"],
        news: ["UPI adoption skyrockets!", "Banks launch new payment apps."],
        lesson: "Government support fuels sectoral growth.",
        options: ["Buy banks", "Buy consumer stocks", "Hold cash"],
        bestDecision: "Buy banks"
      },
      {
        date: "January 2017",
        portfolioValue: 140000,
        holdings: ["HDFC Bank", "Kotak Mahindra Bank", "Infosys", "Axis Bank"],
        news: ["Stock market rebounds as digital adoption grows."],
        lesson: "Market adapts faster than expected.",
        options: ["Sell for profit", "Hold for long term", "Shift to other sectors"],
        bestDecision: "Hold for long term"
      },
      {
        date: "December 2017",
        portfolioValue: 165000,
        holdings: ["HDFC Bank", "Kotak Mahindra Bank", "Axis Bank", "Infosys"],
        news: ["Paytm, Google Pay, PhonePe dominate UPI ecosystem."],
        lesson: "Early bets on emerging trends create wealth.",
        options: ["Sell for gains", "Hold for future growth", "Invest in IPOs"],
        bestDecision: "Hold for future growth"
      }
    ]
  },
  {
    id: 4,
    title: "COVID-19 Market Crash & Recovery (2020–2021)",
    steps: [
      {
        date: "March 2020",
        portfolioValue: 100000,
        holdings: ["HDFC Bank", "Infosys", "Reliance"],
        news: ["Nifty 50 crashes 30% amid COVID-19 panic."],
        lesson: "Uncertainty creates panic selling.",
        options: ["Sell everything", "Hold", "Buy during panic"],
        bestDecision: "Buy during panic"
      },
      {
        date: "June 2020",
        portfolioValue: 125000,
        holdings: ["HDFC Bank", "Infosys", "Reliance", "ITC"],
        news: ["Markets recover as lockdowns ease and liquidity rises."],
        lesson: "Policy response drives market sentiment.",
        options: ["Sell rebound", "Buy quality stocks", "Wait for second crash"],
        bestDecision: "Buy quality stocks"
      },
      {
        date: "November 2020",
        portfolioValue: 145000,
        holdings: ["HDFC Bank", "Infosys", "Reliance", "ITC", "Sun Pharma"],
        news: ["Vaccine progress lifts markets. Pharma stocks rally."],
        lesson: "News and sentiment drive short-term rallies.",
        options: ["Invest in pharma", "Ignore hype", "Buy gold"],
        bestDecision: "Invest in pharma"
      },
      {
        date: "February 2021",
        portfolioValue: 160000,
        holdings: ["HDFC Bank", "Infosys", "Reliance", "ITC", "Sun Pharma", "TCS"],
        news: ["Nifty 50 hits all-time high."],
        lesson: "Markets are forward-looking.",
        options: ["Sell all", "Rebalance", "Double down"],
        bestDecision: "Rebalance"
      },
      {
        date: "December 2021",
        portfolioValue: 170000,
        holdings: ["HDFC Bank", "Infosys", "Sun Pharma", "TCS"],
        news: ["Omicron variant causes fresh jitters."],
        lesson: "Markets remain sensitive to fresh uncertainties.",
        options: ["Panic sell", "Buy the dip", "Stay diversified"],
        bestDecision: "Stay diversified"
      }
    ]
  },
  {
    id: 5,
    title: "Adani Stock Rout (2023)",
    steps: [
      {
        date: "January 2023",
        portfolioValue: 120000,
        holdings: ["Adani Enterprises", "Adani Ports"],
        news: ["Hindenburg accuses Adani of fraud.", "Adani stocks crash 20%."],
        lesson: "Corporate governance issues impact valuations.",
        options: ["Sell all Adani stocks", "Hold", "Wait for clarification"],
        bestDecision: "Wait for clarification"
      },
      {
        date: "February 2023",
        portfolioValue: 100000,
        holdings: ["Adani Ports"],
        news: ["Adani cancels FPO. Stocks continue to fall."],
        lesson: "Negative news snowballs quickly.",
        options: ["Short Adani", "Hold quality stocks", "Avoid Adani"],
        bestDecision: "Hold quality stocks"
      },
      {
        date: "March 2023",
        portfolioValue: 95000,
        holdings: ["HDFC Bank", "Infosys"],
        news: ["LIC and SBI exposure to Adani raises public concern."],
        lesson: "Concentration risk affects even large investors.",
        options: ["Exit LIC/SBI", "Monitor developments", "Buy the dip"],
        bestDecision: "Monitor developments"
      },
      {
        date: "May 2023",
        portfolioValue: 98000,
        holdings: ["HDFC Bank", "Infosys", "ITC"],
        news: ["Adani to reduce debt and improve governance."],
        lesson: "Recovery depends on credible actions.",
        options: ["Re-enter Adani", "Wait longer", "Ignore the noise"],
        bestDecision: "Wait longer"
      },
      {
        date: "December 2023",
        portfolioValue: 115000,
        holdings: ["HDFC Bank", "Infosys", "ITC", "Adani Ports"],
        news: ["Adani partially recovers as investor confidence returns."],
        lesson: "Panic-driven drops may offer long-term entry points.",
        options: ["Buy for long term", "Avoid controversy", "Stay with blue chips"],
        bestDecision: "Buy for long term"
      }
    ]
  }
];

export default scenarios;
