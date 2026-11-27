import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Score',
  description: 'Facility URI and the EDEKS band. Higher URI is more risk. Higher EDEKS is more resilient.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
