import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'omniHRO — Reliability Culture',
  description: 'Near-miss analysis and HRO culture measurement. Coming Q3 2026.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
