'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HeroField } from './hero-field'
import './home-blast.css'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/solutions', label: 'Work' },
  { href: '/resources', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/methodology', label: 'Approach' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/login', label: 'Contact' },
  { href: '/platform/omnirisk', label: 'omniRISK' },
  { href: '/platform/omniplan', label: 'omniPLAN' },
  { href: '/platform/omnicrisis', label: 'omniCRISIS' },
]

const LINES = [
  { a: 'QUANTIFY RISK', ah: '/platform/omnirisk', b: 'ENSURE CONTINUITY', bh: '/platform/omniplan' },
  { a: 'MANAGE CRISES', ah: '/platform/omnicrisis', b: 'MEASURE RESILIENCE', bh: '/methodology' },
  { a: 'BANKING SECTOR', ah: '/solutions/banking', b: 'ENERGY NETWORK', bh: '/solutions/energy' },
  { a: 'READ THE METHOD', ah: '/methodology', b: 'START MEASURING', bh: '/login' },
]
const MODULES = [
  { code: 'omniRISK', href: '/platform/omnirisk', short: 'Quantitative facility risk scoring', image: '/home/workshop.jpg' },
  { code: 'omniIMPACT', href: '/platform/omniimpact', short: 'Business impact analysis and downtime modeling', image: '/home/analysis.jpg' },
  { code: 'omniPLAN', href: '/platform/omniplan', short: 'BCM planning with RTO/RPO tracking', image: '/home/planning.jpg' },
  { code: 'omniCRISIS', href: '/platform/omnicrisis', short: 'Real-time crisis command', image: '/home/command.jpg' },
  { code: 'omniAUDIT', href: '/platform/omniaudit', short: 'Compliance scorecards', image: '/home/audit.jpg' },
  { code: 'omniVENDOR', href: '/platform/omnivendor', short: 'Third-party risk assessment', image: '/home/port.jpg' },
  { code: 'omniHRO', href: '/platform/omni-hro', short: 'Near miss and reliability culture', image: '/home/shopfloor.jpg' },
  { code: 'omniPIPE', href: '/platform/omnipipe', short: 'Pipeline and energy risk', image: '/home/steelworks.jpg' },
]

export default function HomePage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(false)
  const [mod, setMod] = useState(0)
  const [line, setLine] = useState(0)
  const [aCount, setACount] = useState(0)
  const [bCount, setBCount] = useState(0)
  const [phase, setPhase] = useState<'a' | 'b' | 'hold' | 'clear'>('a')
  const cursor = useRef<HTMLDivElement>(null)
  const [fine, setFine] = useState(false)
  const current = MODULES[mod]
  const phrase = LINES[line]

  useEffect(() => {
    const onScroll = () => setLight(window.scrollY > window.innerHeight - 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setFine(mq.matches)
    if (!mq.matches) return
    const move = (e: MouseEvent) => {
      const el = cursor.current
      if (!el) return
      el.style.transform = `translate3d(${e.clientX - 7}px, ${e.clientY - 7}px, 0)`
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setACount(phrase.a.length)
      setBCount(phrase.b.length)
      return
    }
    let timer = 0
    if (phase === 'a') {
      timer = window.setTimeout(() => {
        if (aCount < phrase.a.length) setACount(aCount + 1)
        else setPhase('b')
      }, aCount < phrase.a.length ? 55 : 220)
    } else if (phase === 'b') {
      timer = window.setTimeout(() => {
        if (bCount < phrase.b.length) setBCount(bCount + 1)
        else setPhase('hold')
      }, bCount < phrase.b.length ? 55 : 180)
    } else if (phase === 'hold') {
      timer = window.setTimeout(() => setPhase('clear'), 2200)
    } else if (bCount > 0) {
      timer = window.setTimeout(() => setBCount(bCount - 1), 16)
    } else if (aCount > 0) {
      timer = window.setTimeout(() => setACount(aCount - 1), 16)
    } else {
      setLine((line + 1) % LINES.length)
      setPhase('a')
    }
    return () => window.clearTimeout(timer)
  }, [phase, aCount, bCount, line, phrase.a.length, phrase.b.length])

  return (
    <div className={fine ? 'site fine' : 'site'}>
      <div ref={cursor} className="cursor" aria-hidden />
      <header className={light || open ? 'bar light' : 'bar'}>
        <Link href="/" className={light && !open ? 'markbox' : 'word'} aria-label="Omniversel" onClick={() => setOpen(false)}>
          {light && !open ? 'o' : 'omniversel'}
        </Link>
        <button className="menu-btn" type="button" onClick={() => setOpen(v => !v)}>
          {open ? 'CLOSE' : 'MENU'}
        </button>
      </header>

      {open && (
        <nav className="sheet">
          {NAV.map((item, i) => (
            <span key={item.href}>
              {i === 7 && <span className="sheet-split" />}
              <Link href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
            </span>
          ))}
        </nav>
      )}

      <div className="hero">
        <HeroField />
        <div className="pill">
          <Link href={phrase.ah}>{phrase.a.slice(0, aCount)}</Link>
          {(phase !== 'a' || aCount === phrase.a.length) && bCount + aCount > 0 && <span className="slash">/</span>}
          <Link href={phrase.bh}>{phrase.b.slice(0, bCount)}</Link>
          <i className="caret" aria-hidden />
        </div>
      </div>

      <div className="speak">
        <h1>
          An integrated platform for organizational resilience — disaster risk assessment, business continuity and crisis management in one workspace.
        </h1>
        <div className="rule" aria-hidden />
      </div>

      <div className="slab" id="deployments">
        <h2>Real Deployments.</h2>
        <div className="mosaic">
          <Link href="/platform/omnirisk" className="tile a">
            <img className="rise" src="/home/risk-board.jpg" alt="Risk workshop around a planning table" />
            <span className="big">Quantify<br />Risk</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
          <Link href="/solutions/banking" className="tile b">
            <img className="rise" src="/home/bank-district.jpg" alt="Financial district, early morning" />
            <span className="cap">Banking sector<br />94% compliance rate</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
          <Link href="/platform/omniplan" className="tile c">
            <span className="big">Continuity</span>
          </Link>
          <Link href="/solutions/energy" className="tile d">
            <img className="rise" src="/home/grid.jpg" alt="Transmission lines over open country" />
            <span className="cap">Energy & utilities<br />EPDK · Pipeline safety</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
          <Link href="/solutions" className="tile e">
            <img className="rise" src="/home/city.jpg" alt="Dense city where facilities are scored" />
            <span className="cap">Metropolitan deployment<br />782 facilities assessed</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
        </div>
      </div>

      <div className="slab" id="platform">
        <h2>One Platform. Every Risk.</h2>
        <p className="count">Six core modules. Two specialized: omniHRO, omniPIPE.</p>
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

      <div className="slab" id="index">
        <h2>The index.</h2>
        <div className="index">
          <div>
            <p className="formula">URI = (H × F × E × B) / (1 + k(s,t) × C²) × HRO</p>
            <p className="plain">
              Hazard, fragility, exposure, the bottleneck, and the capacity to absorb it. Weights change by sector. A questionnaire average is not a score.
            </p>
            <p className="plain">
              The board reads ADİS, from 200 to 1200. Higher is more resilient. URI, from 0 to 100, runs the other way: higher is more risk.
            </p>
          </div>
          <div className="sheet-card" aria-label="Illustrative score card">
            <span className="eyebrow">Illustrative facility · not a live account</span>
            <ol>
              <li><b>H</b> Hazard</li>
              <li><b>F</b> Fragility</li>
              <li><b>E</b> Exposure</li>
              <li><b>B</b> Bottleneck</li>
              <li><b>C</b> Capacity</li>
            </ol>
            <p>Same record feeds impact, the plan, and the crisis log.</p>
          </div>
        </div>
        <div className="bands">
          <div><b>Kritik</b><span>200–449</span></div>
          <div><b>Yüksek</b><span>450–649</span></div>
          <div><b>Orta</b><span>650–849</span></div>
          <div><b>İyi</b><span>850–1049</span></div>
          <div><b>Güçlü</b><span>1050–1200</span></div>
        </div>
      </div>

      <div className="slab">
        <h2>Measurable Outcomes.</h2>
        <div className="mosaic">
          <Link href="/solutions" className="tile a">
            <img className="rise" src="/home/refinery.jpg" alt="Process plant assessed for cascade risk" />
            <span className="cap">103 critical risk points<br />Identified across industrial clusters</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
          <Link href="/login" className="tile b">
            <img className="rise" src="/home/ops-floor.jpg" alt="Operations floor during an incident" />
            <span className="big">Manage<br />Crises</span>
          </Link>
        </div>
      </div>

      <footer className="foot">
        <div>
          Omniversel
          <br />Enterprise resilience platform
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
