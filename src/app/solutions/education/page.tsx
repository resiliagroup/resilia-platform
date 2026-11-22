import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'Education',
  description: 'A campus plan, a drill, and a score the school can repeat next year.',
}

export default function Page() {
  return (
    <Leaf
      kicker='Education'
      statement='A campus plan, a drill, and a score the school can repeat next year.'
      groups={[{ heading: 'The campus', points: [{ title: 'Plan', text: 'Who moves, where, and who decides.' }, { title: 'Drill', text: 'On the calendar, with a record.' }, { title: 'The score', text: 'Sendai, applied to a school rather than a slogan.' }] }]}
      next={{ href: '/solutions/public-sector', label: 'Back to the work' }}
    />
  )
}
