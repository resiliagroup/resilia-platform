import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'omniIMPACT',
  description: 'Business impact and downtime cost.',
}

export default function Page() {
  return (
    <Leaf
      kicker='omniIMPACT'
      statement='Critical functions, the cost of an hour, and recovery targets that the capacity score can actually meet.'
      groups={[{ heading: 'What it sets', points: [{ title: 'Functions', text: 'Which services stop the organization if they stop.' }, { title: 'Cost of time', text: 'Downtime priced by process, not by a round number.' }, { title: 'RTO and RPO', text: 'Targets checked against capacity, not against a wish.' }] }]}
      next={{ href: '/platform/omniplan', label: 'Continuity plans' }}
    />
  )
}
