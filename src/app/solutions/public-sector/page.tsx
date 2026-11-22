import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'Public sector',
  description: 'Urban vulnerability, and the investments that should come first.',
}

export default function Page() {
  return (
    <Leaf
      kicker='Public sector'
      statement='Urban vulnerability, and the investments that should come first.'
      groups={[{ heading: 'The city', points: [{ title: 'Stock', text: 'Facilities, not a single citywide adjective.' }, { title: 'Priority', text: 'Where the next lira reduces the most harm.' }, { title: 'Framework', text: 'Sendai and AFAD, in the same table.' }] }]}
      next={{ href: '/solutions', label: 'Back to the work' }}
    />
  )
}
