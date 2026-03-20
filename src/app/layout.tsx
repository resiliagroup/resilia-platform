import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'OMNI | Resilience Platform',
  description: 'AI-powered resilience platform for enterprise risk management.',
  keywords:    'BCM, ISO 22301, dayanıklılık, iş sürekliliği, afet yönetimi, ITU AYM, OMNI',
  authors:     [{ name: 'OMNI Resilience Platform' }],
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
