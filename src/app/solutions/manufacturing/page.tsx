import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'Manufacturing',
  description: 'Throughput, the line that stops, and the supplier behind it.',
}

export default function Page() {
  return (
    <Leaf
      kicker='Manufacturing'
      statement='Throughput, the line that stops, and the supplier behind it.'
      groups={[{ heading: 'The plant', points: [{ title: 'Constraint', text: 'The station whose failure stops the shift.' }, { title: 'Supply', text: 'The part that does not arrive.' }, { title: 'People', text: 'The shift that has to leave the building.' }] }]}
      next={{ href: '/solutions/industrial', label: 'Back to the work' }}
    />
  )
}
