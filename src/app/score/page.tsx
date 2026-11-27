'use client'

import { useState } from 'react'
import Link from 'next/link'
import './score.css'

type Fac = {
  id: string
  name: string
  sector: string
  place: string
  H: number
  F: number
  E: number
  B: number
  C: number
  k: number
  hro: number
}

const FACILITIES: Fac[] = [
  { id: 'kadikoy', name: 'Kadıköy branch', sector: 'Banking', place: 'Istanbul', H: 78, F: 70, E: 66, B: 80, C: 36, k: 1.2, hro: 42 },
  { id: 'ambarli', name: 'Ambarlı terminal', sector: 'Energy', place: 'Istanbul', H: 72, F: 66, E: 70, B: 74, C: 42, k: 1.15, hro: 48 },
  { id: 'hospital', name: 'District hospital', sector: 'Healthcare', place: 'Istanbul', H: 68, F: 55, E: 72, B: 60, C: 58, k: 1.1, hro: 62 },
  { id: 'plant', name: 'Process unit', sector: 'Industry', place: 'Gebze', H: 48, F: 40, E: 44, B: 36, C: 76, k: 0.9, hro: 78 },
]

function score(p: Fac) {
  const hazard = (p.H / 100) * (p.F / 100) * (p.E / 100) * (p.B / 100)
  const absorb = (1 + p.k * (p.C / 100) ** 2) * (0.55 + p.hro / 180)
  const uri = Math.round(Math.min(100, Math.max(0, (hazard / absorb) * 260)))
  const edeks = 1200 - uri * 10
  const band = edeks < 450 ? 'Critical' : edeks < 650 ? 'High' : edeks < 850 ? 'Moderate' : edeks < 1050 ? 'Good' : 'Strong'
  return { uri, edeks, band }
}

const ROWS: { key: keyof Fac, label: string }[] = [
  { key: 'H', label: 'Hazard' },
  { key: 'F', label: 'Fragility' },
  { key: 'E', label: 'Exposure' },
  { key: 'B', label: 'Bottleneck' },
  { key: 'C', label: 'Capacity' },
  { key: 'hro', label: 'HRO' },
]

export default function ScorePage() {
  const [id, setId] = useState(FACILITIES[0].id)
  const fac = FACILITIES.find(f => f.id === id) ?? FACILITIES[0]
  const s = score(fac)

  return (
    <div className="score-app">
      <header className="score-top">
        <div className="who">
          <strong>Omniversel</strong>
          <span>Score</span>
        </div>
        <Link className="back" href="/">Home</Link>
      </header>
      <div className="score-body">
        <nav className="score-list">
          {FACILITIES.map(item => {
            const band = score(item).band
            return (
              <button key={item.id} type="button" className={item.id === fac.id ? 'on' : ''} onClick={() => setId(item.id)}>
                {item.name}
                <small>{item.sector} · {band}</small>
              </button>
            )
          })}
        </nav>
        <main className="score-main">
          <p className="score-note">Worked example. Not a live account. Higher URI is more risk. Higher EDEKS is more resilient.</p>
          <div className="score-grid">
            <section className="panel">
              <h1>{fac.name}</h1>
              <p className="place">{fac.sector} · {fac.place}</p>
              <div className="pair">
                <div>
                  <b>{s.uri}</b>
                  <span>URI · 0–100 · risk</span>
                </div>
                <div>
                  <b>{s.edeks}</b>
                  <span>EDEKS · 200–1200</span>
                </div>
              </div>
              <div className="band">{s.band}</div>
            </section>
            <section className="panel">
              <ul className="rows">
                {ROWS.map(row => {
                  const value = fac[row.key] as number
                  return (
                    <li key={row.key}>
                      <div className="lab"><span>{row.label}</span><span>{value}</span></div>
                      <i><b style={{ width: `${value}%` }} /></i>
                    </li>
                  )
                })}
                <li>
                  <div className="lab"><span>k(s,t)</span><span>{fac.k.toFixed(2)}</span></div>
                </li>
              </ul>
            </section>
            <p className="formula">Hazard, fragility, exposure, bottleneck, capacity, sector weight, and HRO. The same record opens impact, the plan, and the crisis log.</p>
          </div>
        </main>
      </div>
    </div>
  )
}
