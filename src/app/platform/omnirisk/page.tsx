import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'omniRISK',
  description: 'Unified risk index for every facility.',
}

export default function Page() {
  return (
    <Leaf
      kicker='omniRISK'
      statement='A defensible score for every facility. Hazard, fragility, exposure, the bottleneck, and the capacity to absorb it.'
      groups={[{ heading: 'How it runs', points: [{ title: 'Collect', text: 'Six dimensions: place, structure, operations, supply, near misses, and what is already mitigated.' }, { title: 'Calculate', text: 'URI = (H × F × E × B) / (1 + k(s,t) × C²) × HRO. Each term is scored on its own, then weighted.' }, { title: 'Report', text: 'The score, the breakdown, a peer comparison, and the actions a board can fund.' }] }, { heading: 'Inside the index', points: [{ title: 'Sector weights', text: 'A bank and a hospital do not share a matrix.' }, { title: 'Bottleneck', text: 'The one constraint that would stop throughput.' }, { title: 'Audit trail', text: 'Timestamped. Usable in a hearing, a board pack, or an underwriting file.' }] }]}
      next={{ href: '/methodology', label: 'The approach' }}
    />
  )
}
