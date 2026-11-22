'use client'

import { useState } from 'react'
import { Intro, Market } from '@/components/market/Frame'

const STEPS = [
  {
    title: 'Risk assessment',
    image: '/market/approach-risk.jpg',
    text: 'Hazard, fragility, exposure, capacity and the bottleneck that would stop throughput. Weights change by sector. A hospital and a bank are not scored the same way. Aligned to FEMA mission areas: prevention, protection, mitigation, response, recovery.',
  },
  {
    title: 'Business continuity',
    image: '/market/approach-continuity.jpg',
    text: 'Recovery objectives come from impact data, not preference. Plans follow ISO 22301. Work runs in 15-day cycles. Scenarios include earthquake, flood, NATECH, cyber and supply chain failure.',
  },
  {
    title: 'Crisis command',
    image: '/market/approach-crisis.jpg',
    text: 'Incident command, named roles, live awareness. Squads with clear authority. Near misses feed the model. Every event ends in a structured debrief.',
  },
  {
    title: 'Compliance',
    image: '/market/approach-standards.jpg',
    text: 'Sendai Framework, ISO 22301, BDDK and Basel III sit in the same scorecard. Evidence is collected as the assessment runs, not assembled afterwards.',
  },
]

export default function MethodologyPage() {
  const [on, setOn] = useState(0)
  const current = STEPS[on]
  return (
    <Market>
      <Intro
        kicker="Approach"
        statement="Organizational resilience can be measured. Description is not a method."
      />
      <section className="mk-block">
        <h2>What we do</h2>
        <div className="mk-services">
          <div className="mk-stage">
            <img src={current.image} alt="" />
            <strong>{current.text}</strong>
          </div>
          <div className="mk-slist">
            {STEPS.map((item, i) => (
              <button key={item.title} type="button" className={i === on ? 'on' : ''} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)}>
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="mk-block">
        <h2>Standards</h2>
        <p className="mk-prose">
          The index is built so an executive can act on it and a regulator can check it. ISO 22301 gives the process. It does not connect exposure to investment. That link is the score. The same record covers BDDK, Basel III, the Sendai Framework and FEMA core capabilities.
        </p>
      </section>
    </Market>
  )
}
