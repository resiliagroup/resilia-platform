'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import './home-blast.css'

const NAV = [
  { href: '/platform/omnirisk', label: 'Platform' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/login', label: 'Contact' },
]

const MODULES = [
  { code: 'omniRISK', href: '/platform/omnirisk', short: 'Quantitative facility risk scoring', detail: 'Multi-parameter facility risk scoring — hazard, fragility, exposure and capacity synthesized into a single, auditable resilience index.' },
  { code: 'omniIMPACT', href: '/platform/omniimpact', short: 'Business impact analysis & downtime modeling', detail: 'Identify critical functions, model downtime costs and establish evidence-based RTO/RPO targets for every business unit.' },
  { code: 'omniPLAN', href: '/platform/omniplan', short: 'BCM planning with RTO/RPO tracking', detail: 'Build, test and maintain business continuity plans aligned to ISO 22301 — with lifecycle management from draft to approved.' },
  { code: 'omniCRISIS', href: '/platform/omnicrisis', short: 'Real-time crisis command', detail: 'ICS-based crisis management with real-time incident tracking, role assignments and structured post-incident review.' },
  { code: 'omniAUDIT', href: '/platform/omniaudit', short: 'Compliance scorecards', detail: 'Continuous compliance monitoring across Sendai Framework, ISO 22301, BDDK and Basel III — audit-ready at all times.' },
  { code: 'omniVENDOR', href: '/platform/omnivendor', short: 'Third-party risk assessment', detail: 'Score, monitor and tier critical suppliers against disruption risk — from natural hazard cascades to cyber dependencies.' },
  { code: 'omniHRO', href: '/platform/omni-hro', short: 'Near miss & reliability culture', detail: 'Operational signal intelligence for high-reliability organizations. Near-miss reporting, culture measurement and reliability coefficient scoring.' },
  { code: 'omniPIPE', href: '/platform/omnipipe', short: 'Pipeline & energy risk', detail: 'Purpose-built for pipeline operators, LNG terminals and energy distributors — quantitative consequence modeling and structural integrity assessment.' },
]

const SECTORS = [
  { name: 'Banking & Finance', ref: 'BDDK · Basel III · ISO 22301', href: '/solutions/banking', tone: '#d5dee3' },
  { name: 'Healthcare & Hospital', ref: 'JCI · Kaiser HVA · HEICS', href: '/solutions/health', tone: '#e4e8e3' },
  { name: 'Industrial & Manufacturing', ref: 'NATECH · SEVESO III · ISO 45001', href: '/solutions/industrial', tone: '#d8d3cc' },
  { name: 'Energy & Utilities', ref: 'EPDK · Pipeline Safety · SCADA', href: '/solutions/energy', tone: '#cfd6dc' },
  { name: 'Public Sector', ref: 'AFAD · Sendai Framework · FEMA', href: '/solutions/public-sector', tone: '#e3e8e8' },
  { name: 'Education', ref: 'Campus Safety · Emergency Planning', href: '/solutions/education', tone: '#dce3e4' },
]

function Field() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame = 0
    let alive = true
    const draw = () => {
      if (!alive) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr)
        canvas.height = Math.floor(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(60,80,90,0.16)'
      ctx.lineWidth = 1
      const step = 76
      const drift = (frame % 480) / 480
      for (let x = step / 2; x < w; x += step) {
        for (let y = step / 2; y < h; y += step) {
          const s = 4 + Math.sin((x + y) * 0.01 + drift * Math.PI * 2) * 1.4
          ctx.beginPath()
          ctx.moveTo(x - s, y)
          ctx.lineTo(x + s, y)
          ctx.moveTo(x, y - s)
          ctx.lineTo(x, y + s)
          ctx.stroke()
        }
      }
      frame += 1
      requestAnimationFrame(draw)
    }
    draw()
    return () => { alive = false }
  }, [])
  return <canvas ref={ref} aria-hidden />
}

export default function HomePage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mod, setMod] = useState(0)
  const current = MODULES[mod]

  return (
    <div className="blast">
      <header className="blast-nav">
        <Link href="/" className="blast-mark" aria-label="Omniversel">
          <svg width="16" height="20" viewBox="0 0 16 20" aria-hidden>
            <rect x="0.7" y="0.7" width="14.6" height="18.6" fill="none" stroke="#3C505A" strokeWidth="1.2" />
            <path d="M4.5 10h7M8 6.5v7" stroke="#3C505A" strokeWidth="1.1" />
          </svg>
          OMNIVERSEL
        </Link>
        <button className="blast-menu-btn" type="button" onClick={() => setOpen(v => !v)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <nav className={open ? 'blast-links open' : 'blast-links'}>
          {NAV.map(item => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
        </nav>
      </header>

      <section className="blast-hero">
        <Field />
        <p>
          <Link href="/platform/omnirisk"><span className="blast-ul">Quantify</span> Risk.</Link>
          <Link href="/platform/omniplan"><span className="blast-ul">Ensure</span> Continuity.</Link>
          <Link href="/platform/omnicrisis"><span className="blast-ul">Manage</span> Crises.</Link>
        </p>
      </section>

      <section className="blast-statement">
        <div className="blast-statement-grid">
          <h2>
            An integrated platform for organizational resilience — disaster risk assessment, business continuity and crisis management in one workspace.
          </h2>
          <div className="blast-note-row">
            <span>ISO 22301 Aligned</span>
            <span>FEMA Core Capabilities</span>
            <span>ITU AYM Validated</span>
          </div>
        </div>
      </section>

      <div className="blast-rule" aria-hidden><span /></div>

      <section className="blast-wrap" id="platform">
        <h2 className="blast-kicker">One Platform. Every Risk.</h2>
        <p className="blast-sub">Six integrated modules covering the complete resilience lifecycle — from first assessment to live crisis command.</p>
        <div className="blast-services">
          <Link href={current.href} className="blast-stage">
            <div className="blast-stage-inner">
              <small>{current.code}</small>
              <strong>{current.detail}</strong>
            </div>
          </Link>
          <div className="blast-slist">
            {MODULES.map((item, i) => (
              <button
                key={item.code}
                type="button"
                className={i === mod ? 'on' : ''}
                onMouseEnter={() => setMod(i)}
                onFocus={() => setMod(i)}
                onClick={() => router.push(item.href)}
              >
                {item.code}
                <span>{item.short}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="blast-wrap" id="sectors" style={{ paddingTop: 0 }}>
        <h2 className="blast-kicker">Purpose-Built for Every Sector</h2>
        <p className="blast-sub">Sector-specific risk models, regulatory frameworks and compliance requirements — built in.</p>
        <div className="blast-bento">
          {SECTORS.map(item => (
            <Link key={item.name} href={item.href} className="blast-card wide" style={{ background: item.tone }}>
              <i />
              <div>
                <small>{item.ref}</small>
                <strong>{item.name}</strong>
              </div>
              <em>VIEW</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="blast-wrap" style={{ paddingTop: 10 }}>
        <h2 className="blast-kicker">Real Deployments. Measurable Outcomes.</h2>
        <div className="blast-news">
          <article className="blast-story">
            <small>Metropolitan deployment</small>
            <div>
              <b>782</b>
              <p>Facilities assessed across 10 neighborhoods and 6 sectors in metropolitan Istanbul. 103 critical risk points identified.</p>
            </div>
          </article>
          <article className="blast-story">
            <small>Banking sector</small>
            <div>
              <b>94%</b>
              <p>Operational resilience compliance rate achieved across multi-branch assessment. BDDK requirements fully mapped and verified.</p>
            </div>
          </article>
        </div>
      </section>

      <footer className="blast-foot">
        <div className="blast-foot-grid">
          <div>
            <b>OMNIVERSEL</b>
            Urban Resilience Platform.
            <br />An academically grounded, operationally tested platform for multi-hazard organizational risk management.
          </div>
          <div>
            <b>PLATFORM</b>
            <Link href="/platform/omnirisk">omniRISK</Link>
            <Link href="/platform/omniimpact">omniIMPACT</Link>
            <Link href="/platform/omniplan">omniPLAN</Link>
            <Link href="/platform/omnicrisis">omniCRISIS</Link>
          </div>
          <div>
            <b>COMPANY</b>
            <Link href="/about">About</Link>
            <Link href="/methodology">Methodology</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Start measuring resilience.</Link>
          </div>
          <div>
            <div className="blast-count">
              782
              <span>FACILITIES ASSESSED</span>
            </div>
          </div>
        </div>
        <div className="blast-legal">Omniversel · Urban Resilience Platform · Istanbul, Turkey · ITU AYM Academic Partner</div>
      </footer>
    </div>
  )
}
