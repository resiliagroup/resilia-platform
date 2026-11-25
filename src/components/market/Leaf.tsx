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

const CARD: Record<string, string> = {
  'Banking & finance::Scrutiny': '/market/c-scrutiny.jpg',
  'Banking & finance::Dependence': '/market/c-dependence.jpg',
  'Banking & finance::Hazards together': '/market/c-hazards.jpg',
  'Healthcare::Patients': '/market/c-patients.jpg',
  'Healthcare::The center': '/market/c-eoc.jpg',
  'Energy & utilities::Consequence': '/market/c-wind.jpg',
  'Energy & utilities::The line': '/market/c-line.jpg',
  'Public sector::Stock': '/market/c-stock.jpg',
  'Public sector::Framework': '/market/c-framework.jpg',
  'Education::Plan': '/market/c-campus-plan.jpg',
  'omniRISK::Collect': '/market/c-collect.jpg',
  'omniRISK::Report': '/market/c-report.jpg',
  'omniRISK::Sector weights': '/market/c-weights.jpg',
  'omniRISK::Audit trail': '/market/c-trail.jpg',
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
            {group.points.map(point => {
              const shot = CARD[`${kicker}::${point.title}`]
              return (
                <article key={point.title} className={shot ? 'mk-card has-img' : 'mk-card'}>
                  {shot && <img src={shot} alt="" />}
                  <strong>{point.title}</strong>
                  <p>{point.text}</p>
                </article>
              )
            })}
          </div>
        </section>
      ))}
      {next && (
        <p className="mk-prose"><Link href={next.href}>{next.label} →</Link></p>
      )}
    </Market>
  )
}
