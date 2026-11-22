import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'omniPLAN',
  description: 'ISO 22301 continuity planning.',
}

export default function Page() {
  return (
    <Leaf
      kicker='omniPLAN'
      statement='Plans that start from the score, move through a draft, and stay current after the exercise.'
      groups={[{ heading: 'The plan', points: [{ title: 'ISO 22301', text: 'Clause by clause, with the gaps named.' }, { title: 'Exercises', text: 'Drills on a calendar, not a binder.' }, { title: 'Lifecycle', text: 'Draft, review, approved, due again.' }] }]}
      next={{ href: '/platform/omnicrisis', label: 'Crisis command' }}
    />
  )
}
