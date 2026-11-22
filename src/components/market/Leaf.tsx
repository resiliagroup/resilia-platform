'use client'

import Link from 'next/link'
import { Intro, Market } from './Frame'

export type Point = { title: string, text: string }

const HERO: Record<string, string> = {
  omniRISK: '/market/mod-risk.jpg',
  omniIMPACT: '/market/mod-impact.jpg',
  omniPLAN: '/market/mod-plan.jpg',
  omniCRISIS: '/market/mod-crisis.jpg',
  omniAUDIT: '/market/mod-audit.jpg',
  omniVENDOR: '/market/mod-vendor.jpg',
  omniHRO: '/market/mod-hro.jpg',
  omniPIPE: '/market/mod-pipe.jpg',
  'Banking & finance': '/market/sector-banking.jpg',
  Healthcare: '/market/sector-health.jpg',
  'Energy & utilities': '/market/sector-energy.jpg',
  Industry: '/market/sector-industrial.jpg',
  Manufacturing: '/market/sector-manufacturing.jpg',
  Education: '/market/sector-education.jpg',
  'Public sector': '/market/sector-public.jpg',
  Government: '/market/sector-government.jpg',
  Insurance: '/market/sector-insurance.jpg',
  Telecom: '/market/sector-telecom.jpg',
}

export function Leaf({
  kicker,
  statement,
  groups,
  next,
}: {
  kicker: string
  statement: string
  groups: { heading: string, points: Point[] }[]
  next?: { href: string, label: string }
}) {
  return (
    <Market>
      <Intro kicker={kicker} statement={statement} image={HERO[kicker]} />
      {groups.map(group => (
        <section key={group.heading} className="mk-block">
          <h2>{group.heading}</h2>
          <div className="mk-grid">
            {group.points.map(point => (
              <article key={point.title} className="mk-card">
                <strong>{point.title}</strong>
                <p>{point.text}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
      {next && (
        <p className="mk-prose"><Link href={next.href}>{next.label} →</Link></p>
      )}
    </Market>
  )
}
