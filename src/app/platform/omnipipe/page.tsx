import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'omniPIPE',
  description: 'Pipeline and energy risk.',
}

export default function Page() {
  return (
    <Leaf
      kicker='omniPIPE'
      statement='For lines, terminals and the distributors who cannot treat a release as a generic outage.'
      groups={[{ heading: 'On the line', points: [{ title: 'Consequence', text: 'Gas release, not a red-amber-green box.' }, { title: 'Integrity', text: 'A score along the segment.' }, { title: 'Control room', text: 'Ready for the data the operators already have.' }] }]}
      next={{ href: '/solutions/energy', label: 'Energy' }}
    />
  )
}
