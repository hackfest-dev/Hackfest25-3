import React from 'react'
import './tmm.css'

export default function Tmm() {
  return (
    <div className="landing-side-by-side">
      <a className="cd" href="/time-machine">
        <div className="cd-title">FiscalFlashback</div>
        <div className="cd-description">
          Step back through real market years—make buy or skip decisions at each turn and immediately see how your choices would have played out.
        </div>
      </a>
      <a className="cd" href="/time-machine-2">
        <div className="cd-title">BackTrack</div>
        <div className="cd-description">
          Test your instincts with real historical stock data and company fundamentals.  
          Make bold decisions and uncover if you had the foresight to win — or a lesson to learn.
        </div>
      </a>
    </div>
  )
}
