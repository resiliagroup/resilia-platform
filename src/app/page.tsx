'use client'

import { useEffect, useState } from 'react'
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
  { code: 'omniRISK', href: '/platform/omnirisk', short: 'Quantitative facility risk scoring', image: '/home/office.jpg' },
  { code: 'omniIMPACT', href: '/platform/omniimpact', short: 'Business impact analysis and downtime modeling', image: '/home/command.jpg' },
  { code: 'omniPLAN', href: '/platform/omniplan', short: 'BCM planning with RTO/RPO tracking', image: '/home/office.jpg' },
  { code: 'omniCRISIS', href: '/platform/omnicrisis', short: 'Real-time crisis command', image: '/home/command.jpg' },
  { code: 'omniAUDIT', href: '/platform/omniaudit', short: 'Compliance scorecards', image: '/home/field.jpg' },
  { code: 'omniVENDOR', href: '/platform/omnivendor', short: 'Third-party risk assessment', image: '/home/plant.jpg' },
  { code: 'omniHRO', href: '/platform/omni-hro', short: 'Near miss and reliability culture', image: '/home/plant.jpg' },
  { code: 'omniPIPE', href: '/platform/omnipipe', short: 'Pipeline and energy risk', image: '/home/field.jpg' },
]

export default function HomePage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(false)
  const [mod, setMod] = useState(0)
  const current = MODULES[mod]

  useEffect(() => {
    const onScroll = () => setLight(window.scrollY > window.innerHeight - 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="site">
      <header className={light || open ? 'bar light' : 'bar'}>
        <Link href="/" className="word" onClick={() => setOpen(false)}>omniversel</Link>
        <button className="menu-btn" type="button" onClick={() => setOpen(v => !v)}>
          {open ? 'CLOSE' : 'MENU'}
        </button>
      </header>

      {open && (
        <nav className="sheet">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
        </nav>
      )}

      <div className="hero" style={{ backgroundImage: 'url(/home/hero.jpg)' }}>
        <i className="spark" aria-hidden />
        <div className="pill">
          <Link href="/platform/omnirisk">QUANTIFY RISK</Link>
          <span>/</span>
          <Link href="/platform/omniplan">ENSURE CONTINUITY</Link>
        </div>
      </div>

      <div className="speak">
        <h1>
          An integrated platform for organizational resilience — disaster risk assessment, business continuity and crisis management in one workspace.
        </h1>
        <div className="rule" aria-hidden />
      </div>

      <div className="slab">
        <h2>Real Deployments.</h2>
        <div className="mosaic">
          <Link href="/platform/omnirisk" className="tile a">
            <img src="/home/office.jpg" alt="Professionals reviewing a facility risk assessment" />
            <span className="big">Quantify<br />Risk</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
          <Link href="/solutions/banking" className="tile b">
            <img src="/home/command.jpg" alt="Operations room during a continuity exercise" />
            <span className="cap">Banking sector<br />94% compliance rate</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
          <Link href="/platform/omniplan" className="tile c">
            <span className="big">Continuity</span>
          </Link>
          <Link href="/solutions/energy" className="tile d">
            <img src="/home/plant.jpg" alt="Engineer walking a utilities plant" />
            <span className="cap">Energy & utilities<br />EPDK · Pipeline safety</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
          <Link href="/solutions" className="tile e">
            <img src="/home/field.jpg" alt="Abstract map of assessed facilities" />
            <span className="cap">Metropolitan deployment<br />782 facilities assessed</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
        </div>
      </div>

      <div className="slab" id="platform">
        <h2>One Platform. Every Risk.</h2>
        <div className="services">
          <Link href={current.href} className="stage">
            <img src={current.image} alt="" />
            <strong>{current.short}</strong>
          </Link>
          <div>
            <div className="mark" aria-hidden />
            <div className="slist">
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
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="slab">
        <h2>Measurable Outcomes.</h2>
        <div className="mosaic">
          <Link href="/solutions" className="tile a">
            <img src="/home/plant.jpg" alt="Industrial site included in a metropolitan assessment" />
            <span className="cap">103 critical risk points<br />Identified across industrial clusters</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
          <Link href="/login" className="tile b">
            <img src="/home/office.jpg" alt="Team preparing a resilience assessment" />
            <span className="big">Manage<br />Crises</span>
          </Link>
        </div>
      </div>

      <footer className="foot">
        <div>
          Omniversel
          <br />Urban resilience platform
          <br />Istanbul, Turkey
        </div>
        <div>
          ITU AYM
          <br />Academic partner
          <br />ISO 22301 aligned
        </div>
        <div>
          <Link href="/methodology">Methodology</Link>
          <Link href="/about">About</Link>
          <Link href="/pricing">Pricing</Link>
        </div>
        <div>
          <Link href="/login">Start measuring resilience →</Link>
          <Link href="/solutions">Purpose-built for every sector</Link>
        </div>
      </footer>
    </div>
  )
}
