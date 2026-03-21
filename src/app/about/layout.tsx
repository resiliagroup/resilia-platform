import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Building resilience through science. Omniversel developed with ITU AYM — academically grounded, operationally tested.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
