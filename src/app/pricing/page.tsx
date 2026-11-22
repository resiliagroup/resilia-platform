'use client'

import Link from 'next/link'
import { Intro, Market } from '@/components/market/Frame'

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    note: 'One facility. No card.',
    href: '/login',
    cta: 'Start',
    items: ['1 facility assessment', 'Resilience score and report', 'PDF export', '14-day access', 'Email support'],
  },
  {
    name: 'Professional',
    price: 'On request',
    note: 'Up to 50 facilities. Annual.',
    href: 'mailto:info@omniversel.com',
    cta: 'Write to us',
    items: ['All six modules', 'Sprint board', 'Near-miss tracking', 'Continuity templates', 'Crisis command', 'Onboarding and a quarterly review'],
  },
  {
    name: 'Enterprise',
    price: 'On request',
    note: 'Unlimited. Your contract.',
    href: 'mailto:enterprise@omniversel.com',
    cta: 'Enterprise',
    items: ['Pipeline and HRO modules', 'White-label and API', 'Dedicated manager', 'On-site training', 'Regulatory package'],
  },
]

export default function PricingPage() {
  return (
    <Market>
      <Intro
        kicker="Pricing"
        image="/market/pricing-hero.jpg"
        statement="Start with one facility. The program grows when the first score is useful."
      />
      <section className="mk-block">
        <div className="mk-plans">
          {PLANS.map(plan => (
            <article key={plan.name} className="mk-plan">
              <small style={{ letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8d989e' }}>{plan.name}</small>
              <b>{plan.price}</b>
              <p>{plan.note}</p>
              <ul>
                {plan.items.map(item => <li key={item}>{item}</li>)}
              </ul>
              <Link href={plan.href}>{plan.cta} →</Link>
            </article>
          ))}
        </div>
      </section>
    </Market>
  )
}
