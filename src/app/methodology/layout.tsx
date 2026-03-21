import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Methodology',
  description: 'A multi-parameter, academically grounded approach to organizational resilience — URI scoring, ISO 22301, FEMA Core Capabilities.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
