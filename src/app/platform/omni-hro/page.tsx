import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'omniHRO',
  description: 'Near miss and reliability culture.',
}

export default function Page() {
  return (
    <Leaf
      kicker='omniHRO'
      statement='The reports people make before the accident. A coefficient for whether the culture is actually reliable.'
      groups={[{ heading: 'Signals', points: [{ title: 'Near miss', text: 'A form people will finish.' }, { title: 'Alpha', text: 'The reliability coefficient, moved by drills and early reports.' }, { title: 'Survey', text: 'Culture measured, then compared with the score.' }] }]}
      next={{ href: '/platform/omnirisk', label: 'The index' }}
    />
  )
}
