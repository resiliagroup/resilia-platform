import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'omniVENDOR',
  description: 'Third-party risk.',
}

export default function Page() {
  return (
    <Leaf
      kicker='omniVENDOR'
      statement='Suppliers scored, tiered, and watched for the cascade that does not start inside your fence.'
      groups={[{ heading: 'The chain', points: [{ title: 'Score', text: 'Disruption risk, not a questionnaire average.' }, { title: 'Map', text: 'Who you depend on, and who they depend on.' }, { title: 'Cascade', text: 'Natural hazard on their site, cyber on their network.' }] }]}
      next={{ href: '/solutions', label: 'Sectors' }}
    />
  )
}
