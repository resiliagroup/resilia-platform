import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Score',
  description: 'Facility URI and ADİS band. Higher URI is more risk. Higher ADİS is more resilient.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
