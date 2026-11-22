import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'Government',
  description: 'A ministry or an agency with sites, a duty, and a public that notices the gap.',
}

export default function Page() {
  return (
    <Leaf
      kicker='Government'
      statement='A ministry or an agency with sites, a duty, and a public that notices the gap.'
      groups={[{ heading: 'The duty', points: [{ title: 'Sites', text: 'Which buildings carry the service.' }, { title: 'Mandate', text: 'AFAD and the Sendai priorities, in the budget.' }, { title: 'Continuity', text: 'The service the public still expects on day two.' }] }]}
      next={{ href: '/solutions/public-sector', label: 'Back to the work' }}
    />
  )
}
