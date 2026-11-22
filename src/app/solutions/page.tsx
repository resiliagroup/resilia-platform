'use client'

import Link from 'next/link'
import { Intro, Market } from '@/components/market/Frame'

const WORK = [
  { href: '/solutions/banking', image: '/market/work-banking.jpg', k: 'BDDK · Basel III · ISO 22301', t: 'Banking & finance', d: 'Branch scores, continuity plans and reports a supervisor can read.' },
  { href: '/solutions/health', image: '/market/work-health.jpg', k: 'JCI · HEICS', t: 'Healthcare', d: 'Patient services, the operations center and the hours that cannot stop.' },
  { href: '/solutions/energy', image: '/market/work-energy.jpg', k: 'EPDK · Pipeline safety', t: 'Energy & utilities', d: 'Terminals, networks and the consequence of a loss of containment.' },
  { href: '/solutions/industrial', image: '/market/work-industrial.jpg', k: 'NATECH · SEVESO', t: 'Industry', d: 'Cascade scenarios, when a natural hazard starts an industrial accident.' },
  { href: '/solutions/public-sector', image: '/market/work-public.jpg', k: 'AFAD · Sendai', t: 'Public sector', d: 'Urban vulnerability and where a municipality should spend first.' },
  { href: '/solutions/education', image: '/market/work-education.jpg', k: 'Campus safety', t: 'Education', d: 'School plans, drills and a score the campus can repeat.' },
]

const CLIENTS = ['Banking', 'Healthcare', 'Energy', 'Industry', 'Public sector', 'Education', 'Insurance', 'Telecom']

export default function SolutionsPage() {
  return (
    <Market>
      <Intro
        kicker="Work"
        statement="Sector models, the regulation that applies, and a score for every facility."
      />
      <section className="mk-block">
        <h2>Sectors</h2>
        <div className="mk-grid">
          {WORK.map(item => (
            <Link key={item.href} href={item.href} className="mk-card has-img">
              <img src={item.image} alt="" />
              <small>{item.k}</small>
              <div>
                <strong>{item.t}</strong>
                <p>{item.d}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="mk-block">
        <h2>Clients</h2>
        <div className="mk-slist">
          {CLIENTS.map(name => (
            <div key={name} style={{ color: '#8d989e', fontSize: 'clamp(26px, 3vw, 40px)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>{name}</div>
          ))}
        </div>
      </section>
    </Market>
  )
}
