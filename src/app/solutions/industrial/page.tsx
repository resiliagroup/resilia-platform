import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'Industry',
  description: 'When a natural hazard starts an industrial accident.',
}

export default function Page() {
  return (
    <Leaf
      kicker='Industry'
      statement='When a natural hazard starts an industrial accident.'
      groups={[{ heading: 'NATECH', points: [{ title: 'Cascade', text: 'Flood, quake or fire, then the process.' }, { title: 'SEVESO', text: 'The inventory and the scenario in one record.' }, { title: 'The chain', text: 'Suppliers that fail with the weather.' }] }]}
      next={{ href: '/solutions', label: 'Back to the work' }}
    />
  )
}
