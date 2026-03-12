import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'RESILIA | Kurumsal Dayanıklılık Platformu',
  description: 'İTÜ AYM iş birliğiyle geliştirilen, çok sektörlü kurumsal dayanıklılık ve iş sürekliliği yönetimi platformu.',
  keywords:    'BCM, ISO 22301, dayanıklılık, iş sürekliliği, afet yönetimi, İTÜ AYM, RESILIA',
  authors:     [{ name: 'RESILIA · İTÜ AYM' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
