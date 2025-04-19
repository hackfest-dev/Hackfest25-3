import React, { useState, useEffect } from 'react'
import { Doughnut, Line } from 'react-chartjs-2'
import './SIPCalculator.css'

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

ChartJS.register(
  ArcElement, Tooltip, Legend,
  LineElement, CategoryScale, LinearScale, PointElement
)

export default function SIPCalculator() {
  const [mode, setMode] = useState('SIP')
  const [monthly, setMonthly] = useState(10000)
  const [lumpsum, setLumpsum] = useState(100000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)

  const [invested, setInvested] = useState(0)
  const [returnsAmt, setReturnsAmt] = useState(0)
  const [futureValue, setFutureValue] = useState(0)

  const FD_RATE = 0.07
  const GOLD_RATE = 0.08
  const [fdValue, setFdValue] = useState(0)
  const [fdReturns, setFdReturns] = useState(0)
  const [goldValue, setGoldValue] = useState(0)
  const [goldReturns, setGoldReturns] = useState(0)

  const [growthLabels, setGrowthLabels] = useState([])
  const [growthMF, setGrowthMF] = useState([])
  const [growthFD, setGrowthFD] = useState([])
  const [growthGold, setGrowthGold] = useState([])

  useEffect(() => {
    const labels = []
    const mf = []
    const fd = []
    const gold = []

    if (mode === 'SIP') {
      const rMonthly = rate / 100 / 12
      let value = 0
      for (let yr = 1; yr <= years; yr++) {
        const n = yr * 12
        value = monthly * (Math.pow(1 + rMonthly, n) - 1) / rMonthly
        labels.push(`${yr} Yr`)
        mf.push(value)
        fd.push(monthly * n * Math.pow(1 + FD_RATE, yr))
        gold.push(monthly * n * Math.pow(1 + GOLD_RATE, yr))
      }
      setInvested(monthly * 12 * years)
      setFutureValue(value)
      setReturnsAmt(value - (monthly * 12 * years))
    } else {
      const principal = lumpsum
      const rAnnual = rate / 100
      for (let yr = 1; yr <= years; yr++) {
        labels.push(`${yr} Yr`)
        mf.push(principal * Math.pow(1 + rAnnual, yr))
        fd.push(principal * Math.pow(1 + FD_RATE, yr))
        gold.push(principal * Math.pow(1 + GOLD_RATE, yr))
      }
      const fv = principal * Math.pow(1 + rAnnual, years)
      setFutureValue(fv)
      setReturnsAmt(fv - principal)
      setInvested(principal)
      setFdValue(fd[years - 1])
      setFdReturns(fd[years - 1] - principal)
      setGoldValue(gold[years - 1])
      setGoldReturns(gold[years - 1] - principal)
    }

    setGrowthLabels(labels)
    setGrowthMF(mf)
    setGrowthFD(fd)
    setGrowthGold(gold)
  }, [mode, monthly, lumpsum, rate, years])

  const chartData = {
    labels: ['Invested', 'Returns'],
    datasets: [{
      data: [invested, returnsAmt],
      backgroundColor: ['#e6e6e6', '#3f51b5']
    }]
  }

  const lineChartData = {
    labels: growthLabels,
    datasets: [
      {
        label: 'Mutual Fund (You)',
        data: growthMF,
        borderColor: '#3f51b5',
        fill: false
      },
      {
        label: 'Fixed Deposit (7%)',
        data: growthFD,
        borderColor: '#009688',
        fill: false
      },
      {
        label: 'Gold (8%)',
        data: growthGold,
        borderColor: '#f9a825',
        fill: false
      }
    ]
  }

  return (
    <div className="sip-container">
      <h1>SIP Calculator</h1>

      <div className="tabs">
        <button className={mode === 'SIP' ? 'active' : ''} onClick={() => setMode('SIP')}>SIP</button>
        <button className={mode === 'Lumpsum' ? 'active' : ''} onClick={() => setMode('Lumpsum')}>Lumpsum</button>
      </div>

      <div className="sip-controls">
        {mode === 'SIP' ? (
          <div className="control">
            <label>Monthly investment</label>
            <input type="range" min="1000" max="100000" step="500" value={monthly} onChange={e => setMonthly(+e.target.value)} />
            <div className="value">₹{monthly.toLocaleString()}</div>
          </div>
        ) : (
          <div className="control">
            <label>Lumpsum amount</label>
            <input type="range" min="10000" max="2000000" step="10000" value={lumpsum} onChange={e => setLumpsum(+e.target.value)} />
            <div className="value">₹{lumpsum.toLocaleString()}</div>
          </div>
        )}

        <div className="control">
          <label>Expected Return (p.a.)</label>
          <input type="range" min="5" max="20" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} />
          <div className="value">{rate.toFixed(1)}%</div>
        </div>

        <div className="control">
          <label>Time period</label>
          <input type="range" min="1" max="30" step="1" value={years} onChange={e => setYears(+e.target.value)} />
          <div className="value">{years} Yr</div>
        </div>
      </div>

      <div className="sip-results">
        <div className="numbers">
          <div className="row"><span>Invested amount</span><strong>₹{invested.toLocaleString()}</strong></div>
          <div className="row"><span>{mode === 'SIP' ? 'Est. SIP Returns' : 'Est. Lumpsum Returns'}</span><strong>₹{returnsAmt.toLocaleString()}</strong></div>
          <div className="row total"><span>Total value</span><strong>₹{futureValue.toLocaleString()}</strong></div>

          {mode === 'Lumpsum' && (
            <>
              <hr />
              <div className="row"><span>FD @ 7% Value</span><strong>₹{fdValue.toLocaleString()}</strong></div>
              <div className="row"><span>FD Returns</span><strong>₹{fdReturns.toLocaleString()}</strong></div>
              <div className="row difference"><span>Difference (Your – FD)</span><strong>₹{(futureValue - fdValue).toLocaleString()}</strong></div>

              <div className="row"><span>Gold @ 8% Value</span><strong>₹{goldValue.toLocaleString()}</strong></div>
              <div className="row"><span>Gold Returns</span><strong>₹{goldReturns.toLocaleString()}</strong></div>
              <div className="row difference"><span>Difference (Your – Gold)</span><strong>₹{(futureValue - goldValue).toLocaleString()}</strong></div>
            </>
          )}
        </div>

        <div className="chart">
          <Doughnut data={chartData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
        </div>
      </div>

      {mode === 'Lumpsum' && (
        <div className="line-chart">
          <h3>Growth Over Time</h3>
          <Line
            data={lineChartData}
            options={{
              plugins: { legend: { labels: { color: '#000' } } },
              scales: {
                x: { ticks: { color: '#000' }, grid: { color: '#eee' } },
                y: { ticks: { color: '#000' }, grid: { color: '#eee' } }
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
