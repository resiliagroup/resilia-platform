import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'omniPIPE — Pipeline Risk',
  description: 'Pipeline, LNG and energy infrastructure risk assessment. Coming Q4 2026.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
