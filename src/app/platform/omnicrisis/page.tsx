import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'omniCRISIS',
  description: 'Incident command and live awareness.',
}

export default function Page() {
  return (
    <Leaf
      kicker='omniCRISIS'
      statement='A command structure, named roles, and a picture of the incident that does not wait for the morning meeting.'
      groups={[{ heading: 'In the room', points: [{ title: 'Roles', text: 'Incident command. Authority written down before the night it is needed.' }, { title: 'Escalation', text: 'Who is called, in which order, with what they are allowed to do.' }, { title: 'After', text: 'A debrief that changes the next score.' }] }]}
      next={{ href: '/platform/omniaudit', label: 'The scorecard' }}
    />
  )
}
