import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'Telecom',
  description: 'The network that other sectors assume will still be there.',
}

export default function Page() {
  return (
    <Leaf
      kicker='Telecom'
      statement='The network that other sectors assume will still be there.'
      groups={[{ heading: 'The network', points: [{ title: 'Nodes', text: 'Sites, power, and the backhaul between them.' }, { title: 'Dependence', text: 'Who else stops when you stop.' }, { title: 'Restore', text: 'What comes back first, and in how many hours.' }] }]}
      next={{ href: '/solutions', label: 'Back to the work' }}
    />
  )
}
