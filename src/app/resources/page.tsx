'use client'

import Link from 'next/link'
import { Intro, Market } from '@/components/market/Frame'

const NOTES = [
  { cat: 'Method', title: 'The URI model, in one page', text: 'Hazard, fragility, exposure, bottleneck and capacity. Why a single adjective is not a score.' },
  { cat: 'Banking', title: 'Operational resilience and BDDK', text: 'What a Turkish bank can show a supervisor beyond a self-assessment.' },
  { cat: 'Cities', title: 'Sendai, ten years on', text: 'What the framework asks of a municipality that still has to choose where to spend.' },
  { cat: 'Industry', title: 'NATECH, when the hazard starts the accident', text: 'Why a flood model and a process-safety model have to sit in the same room.' },
  { cat: 'Health', title: 'A hospital is not a compliance file', text: 'JCI is a checklist. Continuity is the hour the operating theatre still has power.' },
  { cat: 'Culture', title: 'High-reliability, applied to a city', text: 'Near misses, drills, and the coefficient that moves when people report early.' },
]

export default function ResourcesPage() {
  return (
    <Market>
      <Intro
        kicker="Journal"
        statement="Notes from the advisory team and from ITU AYM. Short, and tied to a decision."
      />
      <section className="mk-block">
        <div className="mk-grid">
          {NOTES.map(note => (
            <article key={note.title} className="mk-card">
              <small>{note.cat}</small>
              <div>
                <strong>{note.title}</strong>
                <p>{note.text}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mk-prose" style={{ marginTop: 28 }}>
          <Link href="/methodology">The method behind the notes →</Link>
        </p>
      </section>
    </Market>
  )
}
