import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for the Omniversel resilience platform. Start free, scale with your program.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
