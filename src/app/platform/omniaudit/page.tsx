import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'omniAUDIT',
  description: 'Compliance scorecards.',
}

export default function Page() {
  return (
    <Leaf
      kicker='omniAUDIT'
      statement='Sendai, ISO 22301, BDDK and Basel III on one card. The evidence is collected while the work happens.'
      groups={[{ heading: 'The card', points: [{ title: 'Frameworks', text: 'More than one standard, without a second project.' }, { title: 'Evidence', text: 'Attached to the control, not to a folder nobody opens.' }, { title: 'Gaps', text: 'Named, owned, and dated.' }] }]}
      next={{ href: '/platform/omnivendor', label: 'Suppliers' }}
    />
  )
}
