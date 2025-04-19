import React, { useRef } from 'react';
import './EducationPage.css';

const educationContent = [
  {
    title: 'Stocks',
    description: `Stocks represent fractional ownership in a company. When you purchase a stock, you’re buying a small piece of that business—becoming a “shareholder.” Companies issue stocks to raise capital for growth, operations, or other strategic initiatives, and in return, investors get a chance to earn returns through capital appreciation or dividends.

Over time, the value of a stock can rise or fall depending on the company’s performance, investor sentiment, and economic conditions. Long-term investors often benefit from compounding growth when they stay invested in fundamentally strong companies.

However, stocks also carry risks, especially during volatile market periods. Understanding how stock prices are affected by earnings, news, and macroeconomic trends is crucial before diving into equity investing.`,
    videoId: 'PbldLCsspgE',
  },
  {
    title: 'Mutual Funds',
    description: `Mutual funds are professionally managed investment vehicles that pool money from multiple investors and invest in a diversified portfolio of assets such as stocks, bonds, or other instruments. This makes them ideal for people who want to invest without having to pick individual securities.

They are especially beginner-friendly, as fund managers actively monitor the market and rebalance portfolios. Investors can choose funds based on their goals—be it growth, income, or tax-saving (like ELSS in India).

One of the key advantages of mutual funds is diversification, which helps reduce risk. They are also relatively liquid, easy to buy/sell, and are available in both active and passive forms.`,
    videoId: 'to3ByoT5Xg4',
  },
  {
    title: 'FD vs Mutual Funds',
    description: `Fixed Deposits (FDs) and Mutual Funds cater to very different investor mindsets. FDs are fixed-income instruments offering assured returns over a specific tenure and are considered virtually risk-free. They’re ideal for conservative investors or short-term financial goals.

On the other hand, mutual funds offer the potential for higher returns by investing in equity, debt, or a mix of assets. However, they also carry market-linked risks. The key difference lies in the risk-return profile—FDs prioritize safety, while mutual funds focus on growth.

It’s essential to evaluate your financial goals, time horizon, and risk appetite before choosing between these two. In many cases, investors use both in different proportions to balance stability and growth.`,
    videoId: 'ySy_XEmLvoE',
  },
  {
    title: 'Handling Market Crashes',
    description: `Market crashes are inevitable parts of the economic cycle. While they can be emotionally challenging, they often present opportunities for disciplined investors. Reacting impulsively to crashes can result in selling low and missing the recovery phase.

During uncertain times, it’s crucial to stay focused on long-term goals rather than daily fluctuations. Historical data shows that markets recover and even thrive post-crashes. A diversified portfolio and systematic investment strategy help in weathering volatility.

Instead of panic-selling, seasoned investors either hold their positions or invest more during downturns—often referred to as “buying the dip.” Patience and financial discipline are your best assets during such periods.`,
    videoId: '1DRq8N7SpYc',
  },
  {
    title: 'What is SIP?',
    description: `A Systematic Investment Plan (SIP) is a method of investing fixed amounts at regular intervals—usually monthly—into mutual funds. It promotes financial discipline and makes investing more accessible for salaried individuals or students starting small.

SIPs work on the principle of rupee-cost averaging. This means you buy more units when prices are low and fewer when prices are high, helping smoothen out market volatility over time.

The best part about SIPs is their simplicity and compounding power. Over years, even small amounts can grow significantly due to the effect of compound interest, making them a powerful tool for long-term wealth creation.`,
    videoId: 'OvoDRnAFNuw',
  },
  {
    title: 'What is an ETF?',
    description: `Exchange-Traded Funds (ETFs) are hybrid instruments that combine the benefits of mutual funds and the trading flexibility of stocks. They track indexes like Nifty 50, Sensex, or sectoral baskets, and can be bought/sold on stock exchanges throughout the day.

ETFs are typically passively managed, which means they aim to replicate the performance of a benchmark rather than outperform it. Because of this, they usually have lower fees compared to actively managed mutual funds.

They are ideal for passive investors looking to diversify with minimal cost and effort. With a single ETF, you can get exposure to an entire market or sector without having to pick individual stocks.`,
    videoId: 'naMBi1BcPN8',
  },
];

// 👇 Only embed selected videos
const embeddableIds = ['PbldLCsspgE', 'OvoDRnAFNuw'];

const EducationPage = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="education-container">
      <h1>📚 Financial Education</h1>
      <div className="education-slider-wrapper">
        <button className="arrow-btn" onClick={() => scroll('left')} aria-label="Scroll left">
          &larr;
        </button>

        <div className="education-slider" ref={scrollRef}>
          {educationContent.map((topic, index) => (
            <div className="education-card" key={index}>
              <h2>{topic.title}</h2>
              <p>{topic.description}</p>

              {embeddableIds.includes(topic.videoId) ? (
                <div className="aspect-w-16 aspect-h-9 small-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${topic.videoId}`}
                    title={topic.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="youtube-thumbnail">
                  <img
                    src={`https://img.youtube.com/vi/${topic.videoId}/0.jpg`}
                    alt={`Thumbnail for ${topic.title}`}
                  />
                  <a
                    className="watch-button"
                    href={`https://www.youtube.com/watch?v=${topic.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ▶ Watch on YouTube
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="arrow-btn" onClick={() => scroll('right')} aria-label="Scroll right">
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default EducationPage;
