import Link from 'next/link'

const C = { navy950: '#060D1A', white: '#FFFFFF', dim: '#64748B', border: '#1E3A5F' }
const F = "'Plus Jakarta Sans', sans-serif"

const PLATFORM = [
  { label: 'omniRISK',   href: '/platform/omnirisk' },
  { label: 'omniIMPACT', href: '/platform/omniimpact' },
  { label: 'omniPLAN',   href: '/platform/omniplan' },
  { label: 'omniCRISIS', href: '/platform/omnicrisis' },
  { label: 'omniAUDIT',  href: '/platform/omniaudit' },
  { label: 'omniVENDOR', href: '/platform/omnivendor' },
  { label: 'omniHRO',    href: '/platform/omni-hro' },
  { label: 'omniPIPE',   href: '/platform/omnipipe' },
]
const SOLUTIONS = [
  { label: 'Banking',       href: '/solutions/banking' },
  { label: 'Healthcare',    href: '/solutions/health' },
  { label: 'Energy',        href: '/solutions/energy' },
  { label: 'Industrial',    href: '/solutions/industrial' },
  { label: 'Manufacturing', href: '/solutions/manufacturing' },
  { label: 'Insurance',     href: '/solutions/insurance' },
  { label: 'Telecom',       href: '/solutions/telecom' },
  { label: 'Government',    href: '/solutions/government' },
  { label: 'Public Sector', href: '/solutions/public-sector' },
  { label: 'Education',     href: '/solutions/education' },
]
const COMPANY = [
  { label: 'About',       href: '/about' },
  { label: 'Methodology', href: '/methodology' },
  { label: 'Pricing',     href: '/pricing' },
  { label: 'Resources',   href: '/resources' },
  { label: 'Contact',     href: '/login' },
]

export default function Footer() {
  return (
    <footer style={{ background: C.navy950, borderTop: `1px solid ${C.border}`, padding: '64px 0 32px', fontFamily: F }}>
      <style>{`.ft-link{font-size:13px;color:#64748B;display:block;margin-bottom:8px;text-decoration:none;transition:color .15s}.ft-link:hover{color:#94A3B8}`}</style>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 0.8fr', gap: 48 }}>

          {/* Col 1 — Brand */}
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: -0.5 }}>OMNIVERSEL</div>
            <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>Urban Resilience Platform</div>
            <p style={{ fontSize: 13, color: C.dim, lineHeight: 1.6, marginTop: 16, maxWidth: 220 }}>
              An academically grounded, operationally tested platform for multi-hazard organizational risk management.
            </p>
            <p style={{ fontSize: 12, color: '#475569', marginTop: 24 }}>© 2026 Omniversel. All rights reserved.</p>
          </div>

          {/* Col 2 — Platform */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 16 }}>Platform</div>
            {PLATFORM.map(l => <Link key={l.href} href={l.href} className="ft-link">{l.label}</Link>)}
          </div>

          {/* Col 3 — Solutions */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 16 }}>Solutions</div>
            {SOLUTIONS.map(l => <Link key={l.href} href={l.href} className="ft-link">{l.label}</Link>)}
          </div>

          {/* Col 4 — Company */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 16 }}>Company</div>
            {COMPANY.map(l => <Link key={l.href} href={l.href} className="ft-link">{l.label}</Link>)}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 48, paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#475569' }}>Omniversel · Urban Resilience Platform · Istanbul, Turkey</span>
          <span style={{ fontSize: 12, color: '#475569' }}>ITU AYM Academic Partner</span>
        </div>
      </div>
    </footer>
  )
}
