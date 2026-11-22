import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'Healthcare',
  description: 'The services that cannot pause, and the building they depend on.',
}

export default function Page() {
  return (
    <Leaf
      kicker='Healthcare'
      statement='The services that cannot pause, and the building they depend on.'
      groups={[{ heading: 'The hour', points: [{ title: 'Patients', text: 'Which services fail first, and who is moved.' }, { title: 'The center', text: 'Emergency operations, with roles already named.' }, { title: 'Standards', text: 'JCI is not the same thing as staying open.' }] }]}
      next={{ href: '/solutions', label: 'Back to the work' }}
    />
  )
}
