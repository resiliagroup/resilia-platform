import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Omniversel — Enterprise Resilience Platform',
    template: '%s | Omniversel',
  },
  description: 'An integrated platform for organizational resilience — disaster risk assessment, business continuity and crisis management. Developed with ITU AYM, validated across 782+ facilities in metropolitan Istanbul.',
  keywords: ['resilience platform', 'business continuity', 'disaster risk', 'BCM software', 'omniRISK', 'crisis management', 'ISO 22301', 'BDDK compliance', 'AFAD', 'Turkey'],
  authors: [{ name: 'Omniversel' }],
  creator: 'Omniversel',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.omniversel.com',
    siteName: 'Omniversel',
    title: 'Omniversel — Enterprise Resilience Platform',
    description: 'Quantify risk. Ensure continuity. Manage crises. An enterprise resilience platform developed with ITU AYM, validated across 782 facilities in metropolitan Istanbul.',
    images: [
      {
        url: 'https://www.omniversel.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Omniversel — Enterprise Resilience Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omniversel — Enterprise Resilience Platform',
    description: 'Quantify Risk. Enable Resilience. Save Lives.',
    images: ['https://www.omniversel.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
