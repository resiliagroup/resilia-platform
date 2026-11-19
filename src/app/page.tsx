'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import './home-blast.css'

const NAV = [
  { href: '/', label: 'Ana sayfa' },
  { href: '#calismalar', label: 'Çalışmalar' },
  { href: '#gunluk', label: 'Günlük' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/metodoloji', label: 'Yaklaşım' },
  { href: '#sektorler', label: 'Sektörler' },
  { href: 'mailto:info@omniversel.com', label: 'İletişim' },
]

const WORK = [
  { href: '/solutions/banking', kicker: 'DenizBank', title: 'Şube ağını tek notada okumak', tone: '#d5dee3', wide: true, tall: true },
  { href: '/solutions/industrial', kicker: 'Sanayi', title: 'Tehlike sınıfından sürekliliğe', tone: '#c9d4d2', wide: true },
  { href: '/solutions/health', kicker: 'Sağlık', title: 'Hastanenin ayakta kalma hesabı', tone: '#e4e8e3' },
  { href: '/solutions/energy', kicker: 'Enerji', title: 'Hat, terminal, ardışık etki', tone: '#d8d3cc', wide: true },
  { href: '/solutions/education', kicker: 'Üniversite', title: 'Kampüsün ortak riski', tone: '#cfd6dc' },
]

const SERVICES = [
  { href: '/platform/omnirisk', name: 'Risk ölçümü', line: 'Tehlike, kırılganlık ve kapasite tek notada.' },
  { href: '/platform/omniimpact', name: 'Etki analizi', line: 'Hangi işlev durursa kurum durur.' },
  { href: '/platform/omniplan', name: 'Süreklilik planı', line: 'ISO 22301 boyunca taslaktan onaylı plana.' },
  { href: '/platform/omnicrisis', name: 'Kriz yönetimi', line: 'Olay komuta ile operasyon merkezi aynı masada.' },
  { href: '/platform/omniaudit', name: 'Denetim', line: 'BDDK, Basel ve ISO için iz bırakır.' },
  { href: '/platform/omnivendor', name: 'Tedarik riski', line: 'Tek tedarikçinin zinciri koparması.' },
  { href: '/platform/omni-hro', name: 'Güvenilirlik kültürü', line: 'Ramak kala, öğrenen kurum.' },
  { href: '/solutions/public-sector', name: 'Saha ve komuta', line: 'Belediye, kampüs, tesis ağı.' },
]

const NOTES = [
  { href: '/metodoloji', date: '12.11.2026', title: 'Masa başı tatbikat, alarm tatbikatı değildir' },
  { href: '/methodology', date: '06.11.2026', title: 'Finansal dayanıklılık, operasyon notunun yanına gelir' },
  { href: '/hakkimizda', date: '19.04.2026', title: 'Bir tesis, üç eksen, tek skor' },
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
        canvas.width = w * dpr
        canvas.height = h * dpr
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(60,80,90,0.16)'
      ctx.lineWidth = 1
      const step = 76
      const drift = (frame % 480) / 480
      for (let x = step / 2; x < w; x += step) {
        for (let y = step / 2; y < h; y += step) {
          const n = Math.sin((x + y) * 0.01 + drift * Math.PI * 2)
          const s = 4 + n * 1.5
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
  const [svc, setSvc] = useState(0)
  const current = SERVICES[svc]

  return (
    <div className="blast">
      <header className="blast-nav">
        <Link href="/" className="blast-mark" aria-label="Omniversel ana sayfa">
          <svg width="18" height="22" viewBox="0 0 18 22" aria-hidden>
            <rect x="1" y="1" width="16" height="20" rx="1" fill="none" stroke="#3C505A" strokeWidth="1.4" />
            <path d="M5 11h8M9 7v8" stroke="#3C505A" strokeWidth="1.2" />
          </svg>
          OMNIVERSEL
        </Link>
        <button className="blast-menu-btn" type="button" onClick={() => setOpen(v => !v)}>
          {open ? 'Kapat' : 'Menü'}
        </button>
        <nav className={open ? 'blast-links open' : 'blast-links'}>
          {NAV.map(item => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
        </nav>
      </header>

      <section className="blast-hero">
        <Field />
        <div className="blast-hero-copy">
          <p>
            <Link href="/platform/omnirisk"><span className="blast-ul">Ölçün</span> ötesini</Link>
            <span className="blast-slash">/</span>
            <Link href="/metodoloji"><span className="blast-ul">Keşfedin</span> dayanıklılığı</Link>
          </p>
        </div>
      </section>

      <section className="blast-statement">
        <div className="blast-statement-grid">
          <h2>
            Tesis, şube, hastane ve kampüs için tek okuma. Afet, iş sürekliliği, kriz ve güvenilirlik kültürü aynı notanın içinde durur.
          </h2>
        </div>
      </section>

      <div className="blast-rule" aria-hidden><span /></div>

      <section className="blast-wrap" id="calismalar">
        <h2 className="blast-kicker">Seçilen işler</h2>
        <div className="blast-bento">
          {WORK.map(item => (
            <Link
              key={item.title}
              href={item.href}
              className={`blast-card${item.wide ? ' wide' : ''}${item.tall ? ' tall' : ''}`}
              style={{ background: item.tone }}
            >
              <i />
              <div>
                <small>{item.kicker}</small>
                <strong>{item.title}</strong>
              </div>
              <em>GÖR</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="blast-wrap" id="sektorler" style={{ paddingTop: 0 }}>
        <h2 className="blast-kicker">Ne yapıyoruz</h2>
        <div className="blast-services">
          <Link href={current.href} className="blast-stage" style={{ ['--stage' as string]: '#e3e8e8' }}>
            <div className="blast-stage-inner">
              <small>0{svc + 1}</small>
              <strong>{current.line}</strong>
            </div>
          </Link>
          <div className="blast-slist">
            {SERVICES.map((item, i) => (
              <button
                key={item.name}
                type="button"
                className={i === svc ? 'on' : ''}
                onMouseEnter={() => setSvc(i)}
                onFocus={() => setSvc(i)}
                onClick={() => router.push(item.href)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="blast-wrap" id="gunluk" style={{ paddingTop: 10 }}>
        <h2 className="blast-kicker">Günlük</h2>
        <div className="blast-news">
          {NOTES.map(note => (
            <Link key={note.title} href={note.href} className="blast-note">
              <time>{note.date}</time>
              <strong>{note.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      <footer className="blast-foot">
        <div>
          <b>OMNIVERSEL</b>
          Kentsel dayanıklılık platformu.
          <br />İTÜ AYM akademik ortağı.
        </div>
        <div>
          <b>İLETİŞİM</b>
          <a href="mailto:info@omniversel.com">info@omniversel.com</a>
          <br />İstanbul
        </div>
        <div>
          <b>GİRİŞ</b>
          <Link href="/login">Değerlendirme</Link>
          <br />
          <Link href="/pricing">Fiyatlandırma</Link>
        </div>
        <div>
          <div className="blast-count">
            782
            <span>ÖLÇÜLEN TESİS</span>
          </div>
        </div>
        <div className="blast-legal">© 2026 OMNIVERSEL · İstanbul</div>
      </footer>
    </div>
  )
}
