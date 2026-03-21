import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Insights, research and guidance on organizational resilience, disaster risk management and business continuity from Omniversel and ITU AYM.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
