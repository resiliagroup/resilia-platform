import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'Insurance',
  description: 'A portfolio of risks that can be compared, not described.',
}

export default function Page() {
  return (
    <Leaf
      kicker='Insurance'
      statement='A portfolio of risks that can be compared, not described.'
      groups={[{ heading: 'The book', points: [{ title: 'Exposure', text: 'What is actually on the schedule.' }, { title: 'Accumulation', text: 'Where many policies fail together.' }, { title: 'Evidence', text: 'A score an underwriter can file.' }] }]}
      next={{ href: '/solutions/banking', label: 'Back to the work' }}
    />
  )
}
