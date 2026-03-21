import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Omniversel workspace or request demo access.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
