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

const LINES = [
  { a: 'QUANTIFY RISK', ah: '/platform/omnirisk', b: 'ENSURE CONTINUITY', bh: '/platform/omniplan' },
  { a: 'MANAGE CRISES', ah: '/platform/omnicrisis', b: 'MEASURE RESILIENCE', bh: '/methodology' },
  { a: 'BANKING SECTOR', ah: '/solutions/banking', b: 'ENERGY NETWORK', bh: '/solutions/energy' },
  { a: 'READ THE METHOD', ah: '/methodology', b: 'START MEASURING', bh: '/login' },
]

const SPOTS = [
  { left: '18%', top: '44%' },
  { left: '47%', top: '74%' },
  { left: '72%', top: '36%' },
  { left: '32%', top: '68%' },
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

const POOLS = {
  office: ['/home/office.jpg', '/home/command.jpg', '/home/plant.jpg'],
  command: ['/home/command.jpg', '/home/field.jpg', '/home/office.jpg'],
  plant: ['/home/plant.jpg', '/home/office.jpg', '/home/field.jpg'],
  field: ['/home/field.jpg', '/home/plant.jpg', '/home/command.jpg'],
}

function Field() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame = 0
    let alive = true
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const paint = () => {
      if (!alive) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr)
        canvas.height = Math.floor(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const t = frame * 0.004
      const g = ctx.createLinearGradient(0, h, w, 0)
      g.addColorStop(0, '#1a0c10')
      g.addColorStop(0.45, '#3a140e')
      g.addColorStop(1, '#140818')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      const blobs = [
        { x: w * (0.28 + Math.sin(t) * 0.18), y: h * (0.62 + Math.cos(t * 0.8) * 0.12), r: w * 0.55, c: 'rgba(196,72,24,0.55)' },
        { x: w * (0.72 + Math.cos(t * 0.7) * 0.16), y: h * (0.38 + Math.sin(t * 0.9) * 0.14), r: w * 0.48, c: 'rgba(92,28,120,0.45)' },
        { x: w * (0.5 + Math.sin(t * 0.5) * 0.2), y: h * (0.5 + Math.cos(t * 1.1) * 0.1), r: w * 0.36, c: 'rgba(180,70,30,0.28)' },
      ]
      for (const b of blobs) {
        const rg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        rg.addColorStop(0, b.c)
        rg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = rg
        ctx.fillRect(0, 0, w, h)
      }
      frame += reduce ? 0 : 1
      if (!reduce) requestAnimationFrame(paint)
    }
    paint()
    return () => { alive = false }
  }, [])
  return <canvas ref={ref} aria-hidden />
}

function Shot({ frames, beat, alt }: { frames: string[], beat: number, alt: string }) {
  const src = frames[beat % frames.length]
  return <img key={src + beat} className="rise" src={src} alt={alt} />
}

export default function HomePage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(false)
  const [mod, setMod] = useState(0)
  const [line, setLine] = useState(0)
  const [aCount, setACount] = useState(0)
  const [bCount, setBCount] = useState(0)
  const [phase, setPhase] = useState<'a' | 'b' | 'hold' | 'clear'>('a')
  const [beat, setBeat] = useState(0)
  const current = MODULES[mod]
  const phrase = LINES[line]
  const spot = SPOTS[line]

  useEffect(() => {
    const onScroll = () => setLight(window.scrollY > window.innerHeight - 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const timer = window.setInterval(() => setBeat(b => b + 1), 5200)
    const mosaic = document.getElementById('deployments')
    if (!mosaic) return () => window.clearInterval(timer)
    const seen = { value: false }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !seen.value) {
        seen.value = true
        setBeat(b => b + 1)
      }
    }, { threshold: 0.35 })
    io.observe(mosaic)
    return () => {
      window.clearInterval(timer)
      io.disconnect()
    }
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

      <div className="hero">
        <Field />
        <i className="spark" style={{ left: spot.left, top: spot.top }} aria-hidden />
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
            <Shot frames={POOLS.office} beat={beat} alt="Professionals reviewing a facility risk assessment" />
            <span className="big">Quantify<br />Risk</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
          <Link href="/solutions/banking" className="tile b">
            <Shot frames={POOLS.command} beat={beat + 1} alt="Operations room during a continuity exercise" />
            <span className="cap">Banking sector<br />94% compliance rate</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
          <Link href="/platform/omniplan" className="tile c">
            <span className="big">Continuity</span>
          </Link>
          <Link href="/solutions/energy" className="tile d">
            <Shot frames={POOLS.plant} beat={beat} alt="Engineer walking a utilities plant" />
            <span className="cap">Energy & utilities<br />EPDK · Pipeline safety</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
          <Link href="/solutions" className="tile e">
            <Shot frames={POOLS.field} beat={beat + 2} alt="Abstract map of assessed facilities" />
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
            <Shot frames={POOLS.plant} beat={beat + 1} alt="Industrial site included in a metropolitan assessment" />
            <span className="cap">103 critical risk points<br />Identified across industrial clusters</span>
            <span className="actions"><span className="plus">+</span><span className="view">VIEW</span></span>
          </Link>
          <Link href="/login" className="tile b">
            <Shot frames={POOLS.office} beat={beat + 2} alt="Team preparing a resilience assessment" />
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
