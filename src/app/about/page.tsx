'use client'

import Link from 'next/link'
import { Intro, Market } from '@/components/market/Frame'

const MILESTONES = [
  { year: '2001', text: 'ITU AYM established through a tripartite agreement between ITU, the Turkish Prime Ministry Crisis Management Directorate, and FEMA.' },
  { year: '2001–2020', text: 'More than 5,000 local government officials trained. 23 reference volumes published — the disaster management library in Turkish.' },
  { year: '2024', text: 'Omniversel founded to turn that knowledge into a digital platform, validated across field work in metropolitan Istanbul.' },
  { year: '2025–', text: 'The practice now spans platform software, consulting, field assessment and an operational fire testing laboratory.' },
]

const AREAS = [
  { title: 'Platform', text: 'Software for quantitative risk scoring, continuity planning and crisis command.', image: '/market/about-platform.jpg' },
  { title: 'Consulting', text: 'Sector-calibrated facility assessments, continuity plans and exercises.', image: '/market/about-field.jpg' },
  { title: 'Testing', text: 'Fire testing, NATECH field analysis and expert work for regulatory proceedings.', image: '/market/about-lab.jpg' },
  { title: 'Research', text: 'Joint work with ITU AYM, training and capacity development.', image: '/market/about-library.jpg' },
]

export default function AboutPage() {
  return (
    <Market>
      <Intro
        kicker="About"
        image="/market/about-hero.jpg"
        statement="Omniversel is a resilience analytics company. The platform is academically grounded and tested in the field."
      />
      <section className="mk-block">
        <h2>Practice</h2>
        <div className="mk-grid">
          {AREAS.map(item => (
            <article key={item.title} className="mk-card has-img">
              <img src={item.image} alt="" />
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="mk-block">
        <h2>Since 2001</h2>
        <div className="mk-rows">
          {MILESTONES.map(item => (
            <div key={item.year} className="mk-row">
              <b>{item.year}</b>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mk-block">
        <h2>Academic partner</h2>
        <p className="mk-prose">
          Istanbul Technical University Disaster Management Research and Implementation Center. The method sits on peer-reviewed disaster risk science and on urban field work. ITU AYM began in 2001 as a transfer of American and Japanese practice into Turkish institutions.
        </p>
        <p className="mk-prose" style={{ marginTop: 18 }}>
          <Link href="/methodology">Read the approach →</Link>
        </p>
      </section>
    </Market>
  )
}
