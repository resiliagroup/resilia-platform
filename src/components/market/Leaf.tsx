'use client'

import Link from 'next/link'
import { Intro, Market } from './Frame'

export type Point = { title: string, text: string }

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
      <Intro kicker={kicker} statement={statement} />
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
