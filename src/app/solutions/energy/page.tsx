import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'Energy & utilities',
  description: 'Consequence beyond the fence. EPDK, pipeline integrity, a network that cascades.',
}

export default function Page() {
  return (
    <Leaf
      kicker='Energy & utilities'
      statement='Consequence beyond the fence. EPDK, pipeline integrity, a network that cascades.'
      groups={[{ heading: 'The asset', points: [{ title: 'Consequence', text: 'Fire, explosion, a toxic cloud, a NATECH release.' }, { title: 'The licence', text: 'A number a regulator will accept.' }, { title: 'The cascade', text: 'One node, then the region.' }] }, { heading: 'The work', points: [{ title: 'Contours', text: 'Impact zones, not a colour on a slide.' }, { title: 'The line', text: 'Integrity along the segment.' }, { title: 'Control', text: 'What the control room already knows, scored.' }] }]}
      next={{ href: '/platform/omnipipe', label: 'Back to the work' }}
    />
  )
}
