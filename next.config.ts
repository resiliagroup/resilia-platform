import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['fonts.gstatic.com'],
  },
  async rewrites() {
    return [
      { source: '/platform', destination: '/platform/index.html' },
      { source: '/egitim', destination: '/egitim/index.html' },
      { source: '/fiyatlar', destination: '/fiyatlar/index.html' },
      { source: '/sirket', destination: '/sirket/index.html' },
      { source: '/hakkimizda', destination: '/hakkimizda/index.html' },
      { source: '/referanslar', destination: '/referanslar/index.html' },
      { source: '/kariyer', destination: '/kariyer/index.html' },
      { source: '/iletisim', destination: '/iletisim/index.html' },
    ]
  },
}

export default nextConfig
