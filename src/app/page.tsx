'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ─── palette ───────────────────────────────────────────────── */
const N  = '#0A1628'   // navy
const G  = '#E8C97A'   // gold
const G2 = '#C9A84C'   // gold dark
const W  = '#F0EDE8'   // warm white
const S  = '#8FA3C0'   // slate blue

/* ─── counter hook ──────────────────────────────────────────── */
function useCounter(target: number, duration = 1800, trigger: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [trigger, target, duration])
  return val
}

/* ─── intersection observer hook ───────────────────────────── */
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ─── animated risk gauge SVG ───────────────────────────────── */
function RiskGauge() {
  const [angle, setAngle] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAngle(112), 600)
    return () => clearTimeout(t)
  }, [])

  const r = 90, cx = 120, cy = 120
  const toXY = (deg: number) => ({
    x: cx + r * Math.cos((deg - 180) * Math.PI / 180),
    y: cy + r * Math.sin((deg - 180) * Math.PI / 180),
  })
  const arcPath = (startDeg: number, endDeg: number) => {
    const s = toXY(startDeg), e = toXY(endDeg)
    const lg = endDeg - startDeg > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${lg} 1 ${e.x} ${e.y}`
  }
  const needleRad = ((angle - 180) * Math.PI) / 180
  const nx = cx + (r - 10) * Math.cos(needleRad)
  const ny = cy + (r - 10) * Math.sin(needleRad)
  const score = Math.round((angle / 180) * 100)
  const riskLabel = score < 40 ? 'DÜŞÜK' : score < 70 ? 'ORTA' : 'YÜKSEK'
  const riskColor = score < 40 ? '#22c55e' : score < 70 ? G : '#ef4444'

  return (
    <svg viewBox="0 0 240 160" style={{ width: '100%', maxWidth: 320 }}>
      <defs>
        <linearGradient id="arc-g" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#22c55e" />
          <stop offset="50%"  stopColor={G} />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      {/* track */}
      <path d={arcPath(0, 180)} fill="none" stroke="#1e3a5f" strokeWidth="14" strokeLinecap="round" />
      {/* coloured arc */}
      <path d={arcPath(0, angle)} fill="none" stroke="url(#arc-g)" strokeWidth="14" strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1.2s ease' }} />
      {/* needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny}
            stroke={G} strokeWidth="3" strokeLinecap="round"
            style={{ transition: 'all 1.4s cubic-bezier(.34,1.56,.64,1)' }} />
      <circle cx={cx} cy={cy} r="6" fill={G} />
      {/* labels */}
      <text x={cx} y={cy + 28} textAnchor="middle" fill={riskColor}
            style={{ fontSize: 18, fontWeight: 700, transition: 'fill 1s' }}>{score}</text>
      <text x={cx} y={cy + 44} textAnchor="middle" fill={S} style={{ fontSize: 9 }}>RİSK SKORU</text>
      <text x={cx} y={cy + 58} textAnchor="middle" fill={riskColor}
            style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2 }}>{riskLabel}</text>
      <text x={16}  y={cy + 16} fill="#22c55e" style={{ fontSize: 8 }}>0</text>
      <text x={214} y={cy + 16} fill="#ef4444"  style={{ fontSize: 8 }}>100</text>
    </svg>
  )
}

/* ─── mini dashboard preview ────────────────────────────────── */
function MiniDashboard() {
  const bars = [62, 45, 78, 55, 88, 40, 70]
  const labels = ['PAZ','PZT','SAL','ÇAR','PER','CUM','CMT']
  return (
    <div style={{ background: '#0d1f3c', borderRadius: 16, padding: '20px 24px',
                  border: `1px solid #1e3a5f`, width: '100%', maxWidth: 480 }}>
      {/* top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ color: S, fontSize: 10, letterSpacing: 1 }}>TOPLAM RİSK İNDEKSİ</div>
          <div style={{ color: G, fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>72.4</div>
          <div style={{ color: '#22c55e', fontSize: 11 }}>↑ 3.2 geçen haftadan</div>
        </div>
        <RiskGauge />
      </div>
      {/* bar chart */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 56 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', height: `${h}%`, background: i === 4 ? G : '#1e3a5f',
                          borderRadius: 3, transition: `height 1s ${i * 0.08}s ease` }} />
            <span style={{ color: S, fontSize: 8 }}>{labels[i]}</span>
          </div>
        ))}
      </div>
      {/* pill tags */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        {['ISO 22301 ✓', 'BCM Uyumlu', 'AI Analiz'].map(t => (
          <span key={t} style={{ background: '#152a4e', color: G, fontSize: 10,
                                  padding: '3px 10px', borderRadius: 20, border: `1px solid ${G2}` }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── stat card ─────────────────────────────────────────────── */
function StatCard({ target, suffix, label, trigger }: { target: number; suffix: string; label: string; trigger: boolean }) {
  const val = useCounter(target, 2000, trigger)
  return (
    <div style={{ textAlign: 'center', padding: '0 32px' }}>
      <div style={{ color: G, fontSize: 52, fontWeight: 700, lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>
        {val}{suffix}
      </div>
      <div style={{ color: S, fontSize: 13, letterSpacing: 2, marginTop: 6, textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

/* ─── sector card ───────────────────────────────────────────── */
const sectors = [
  { icon: '🏦', name: 'Bankacılık',  desc: 'Operasyonel risk modelleme ve BDDK uyumu' },
  { icon: '🏥', name: 'Sağlık',      desc: 'Tesis sürekliliği ve pandemi hazırlık planları' },
  { icon: '🏭', name: 'Sanayi',      desc: 'Tedarik zinciri dayanıklılığı ve NATECH analizi' },
  { icon: '🎓', name: 'Eğitim',      desc: 'Kampüs güvenliği ve kriz iletişim protokolleri' },
  { icon: '⚡', name: 'Altyapı',     desc: 'Kritik altyapı güvenliği ve servis sürekliliği' },
  { icon: '🏛️', name: 'Kamu',        desc: 'İlçe bazlı risk haritası ve E-Devlet entegrasyonu' },
]

/* ─── steps ─────────────────────────────────────────────────── */
const steps = [
  { n: '01', title: 'Kayıt',   desc: 'Kurumunuzu tanımlayın, sektör profilinizi oluşturun.' },
  { n: '02', title: 'Ölçüm',  desc: 'HFER-720 algoritması 720 parametreyi analiz eder.' },
  { n: '03', title: 'Harita', desc: 'İlçe bazlı risk dağılımını interaktif haritada görün.' },
  { n: '04', title: 'Plan',   desc: 'ISO 22301 uyumlu BCP raporunuzu otomatik üretin.' },
]

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const statsSection  = useInView(0.3)
  const stepsSection  = useInView(0.2)
  const formulaSection = useInView(0.3)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${N}; color: ${W}; font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        a { text-decoration: none; color: inherit; }
        .gold-btn {
          display: inline-block;
          background: ${G};
          color: ${N};
          font-weight: 700;
          padding: 14px 36px;
          border-radius: 6px;
          font-size: 15px;
          letter-spacing: 0.5px;
          transition: background 0.2s, transform 0.15s;
          cursor: pointer;
          border: none;
        }
        .gold-btn:hover { background: ${G2}; transform: translateY(-1px); }
        .ghost-btn {
          display: inline-block;
          border: 1.5px solid ${G};
          color: ${G};
          font-weight: 600;
          padding: 13px 32px;
          border-radius: 6px;
          font-size: 15px;
          transition: background 0.2s;
          cursor: pointer;
        }
        .ghost-btn:hover { background: rgba(232,201,122,0.08); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.7s ease both; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 48px',
        background: scrolled ? 'rgba(10,22,40,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(232,201,122,0.12)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 72,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="36" height="36" viewBox="0 0 36 36">
            <polygon points="18,2 34,28 2,28" fill="none" stroke={G} strokeWidth="2.5" />
            <polygon points="18,10 28,26 8,26" fill={G} opacity="0.2" />
            <circle cx="18" cy="20" r="3" fill={G} />
          </svg>
          <span className="serif" style={{ color: G, fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
            OMNIVERSEL
          </span>
        </div>

        {/* Menu */}
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {[['Özellikler','#features'],['Nasıl Çalışır','#how'],['Sektörler','#sectors'],['Formül','#formula']].map(([lbl, href]) => (
            <a key={lbl} href={href} style={{ color: S, fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
               onMouseEnter={e => (e.currentTarget.style.color = G)}
               onMouseLeave={e => (e.currentTarget.style.color = S)}>{lbl}</a>
          ))}
          <Link href="/login" className="gold-btn" style={{ padding: '9px 26px', fontSize: 14 }}>Giriş Yap</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
                        padding: '120px 64px 80px', maxWidth: 1280, margin: '0 auto', gap: 64 }}>
        {/* left */}
        <div style={{ flex: 1 }} className="fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
                        background: 'rgba(232,201,122,0.08)', border: `1px solid ${G2}`,
                        borderRadius: 20, padding: '6px 16px' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
                           boxShadow: '0 0 6px #22c55e', display: 'inline-block' }} />
            <span style={{ color: G, fontSize: 12, letterSpacing: 1 }}>HFER-720 Motor Aktif</span>
          </div>

          <h1 className="serif" style={{ fontSize: 'clamp(42px, 5vw, 72px)', fontWeight: 700,
                                         lineHeight: 1.08, marginBottom: 28, color: W }}>
            Kurumsal Dayanıklılık<br />
            <span style={{ color: G }}>Yapay Zeka</span> ile<br />
            Yeniden Tanımlandı
          </h1>

          <p style={{ color: S, fontSize: 17, lineHeight: 1.75, maxWidth: 480, marginBottom: 40 }}>
            Omniversel, ISO 22301 uyumlu risk modelleme, 39 ilçe bazlı harita
            analizi ve 720 parametreli HFER algoritmasıyla kurumunuzun her
            kriz senaryosuna hazır olmasını sağlar.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/login" className="gold-btn">Ücretsiz Başlayın</Link>
            <a href="#how" className="ghost-btn">Nasıl Çalışır?</a>
          </div>

          {/* trust badges */}
          <div style={{ display: 'flex', gap: 24, marginTop: 48, flexWrap: 'wrap' }}>
            {['ISO 22301','BCM Uyumlu','AFAD Entegrasyonu'].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="7" fill="none" stroke={G} strokeWidth="1.5"/>
                  <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke={G} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
                <span style={{ color: S, fontSize: 13 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* right */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center',
                      animation: 'float 5s ease-in-out infinite' }}>
          <MiniDashboard />
          {/* floating metric chips */}
          <div style={{ display: 'flex', gap: 12 }}>
            {[{v:'99.7%',l:'Uptime'},{v:'<2s',l:'Yanıt Süresi'},{v:'256-bit',l:'Şifreleme'}].map(c => (
              <div key={c.l} style={{ background: '#0d1f3c', border: `1px solid #1e3a5f`,
                                      borderRadius: 10, padding: '10px 18px', textAlign: 'center' }}>
                <div style={{ color: G, fontSize: 18, fontWeight: 700 }}>{c.v}</div>
                <div style={{ color: S, fontSize: 10, letterSpacing: 1 }}>{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div ref={statsSection.ref} id="features"
           style={{ background: '#0d1f3c', borderTop: `1px solid #1e3a5f`, borderBottom: `1px solid #1e3a5f`,
                    padding: '56px 64px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex',
                      justifyContent: 'space-around', flexWrap: 'wrap', gap: 40 }}>
          <StatCard target={720} suffix="+"  label="Analiz Parametresi" trigger={statsSection.inView} />
          <div style={{ width: 1, background: '#1e3a5f', alignSelf: 'stretch' }} />
          <StatCard target={39}  suffix=""   label="İlçe Kapsamı"       trigger={statsSection.inView} />
          <div style={{ width: 1, background: '#1e3a5f', alignSelf: 'stretch' }} />
          <StatCard target={6}   suffix=""   label="Sektör Desteği"     trigger={statsSection.inView} />
          <div style={{ width: 1, background: '#1e3a5f', alignSelf: 'stretch' }} />
          <StatCard target={98}  suffix="%"  label="BCM Uyum Oranı"     trigger={statsSection.inView} />
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" ref={stepsSection.ref} style={{ padding: '100px 64px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ color: G, fontSize: 12, letterSpacing: 3, marginBottom: 16 }}>SÜREÇ</p>
          <h2 className="serif" style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 700, color: W }}>
            Nasıl Çalışır?
          </h2>
          <p style={{ color: S, marginTop: 16, fontSize: 16 }}>Dört adımda kurumsal dayanıklılık</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              background: '#0d1f3c', borderRadius: 16, padding: 32,
              border: `1px solid #1e3a5f`,
              opacity: stepsSection.inView ? 1 : 0,
              transform: stepsSection.inView ? 'translateY(0)' : 'translateY(30px)',
              transition: `all 0.6s ease ${i * 0.12}s`,
            }}>
              <div className="serif" style={{ color: G, fontSize: 48, fontWeight: 700,
                                              opacity: 0.25, lineHeight: 1, marginBottom: 16 }}>{s.n}</div>
              {/* connector arrow */}
              {i < 3 && (
                <div style={{ position: 'absolute', right: -12, top: '50%',
                               transform: 'translateY(-50%)', color: G, fontSize: 20, zIndex: 2 }}>›</div>
              )}
              <h3 style={{ color: W, fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ color: S, fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORMULA ── */}
      <section id="formula" ref={formulaSection.ref}
               style={{ padding: '100px 64px', background: '#060f1d' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: G, fontSize: 12, letterSpacing: 3, marginBottom: 16 }}>ALGORITMA</p>
          <h2 className="serif" style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 700, color: W, marginBottom: 16 }}>
            HFER-720 Formülü
          </h2>
          <p style={{ color: S, fontSize: 15, marginBottom: 56, lineHeight: 1.7 }}>
            Tehlike, Frekans, Maruziyet ve Dinamik değişkenleri birleştiren
            patent bekleyen yapay zeka destekli risk motoru.
          </p>

          {/* Formula box */}
          <div style={{
            background: '#0d1f3c', border: `2px solid ${G}`,
            borderRadius: 20, padding: '48px 64px', marginBottom: 48,
            opacity: formulaSection.inView ? 1 : 0,
            transition: 'opacity 0.9s ease',
          }}>
            <div className="serif" style={{ fontSize: 'clamp(28px, 5vw, 64px)', color: G,
                                             fontWeight: 600, letterSpacing: 2 }}>
              HFER =
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
                          gap: 0, margin: '16px 0' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="serif" style={{ fontSize: 'clamp(22px, 3.5vw, 48px)', color: W,
                                                fontWeight: 600, borderBottom: `2px solid ${G}`,
                                                paddingBottom: 12, marginBottom: 12, letterSpacing: 2 }}>
                  H × F × X × D
                </div>
                <div className="serif" style={{ fontSize: 'clamp(18px, 3vw, 40px)', color: W,
                                                fontWeight: 600, letterSpacing: 2 }}>
                  1 + k · C²
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { sym: 'H', lbl: 'Hazard (Tehlike)', desc: 'Doğal ve insan kaynaklı tehlike skoru' },
              { sym: 'F', lbl: 'Frequency (Frekans)', desc: 'Olayın tarihsel gerçekleşme sıklığı' },
              { sym: 'X', lbl: 'Exposure (Maruziyet)', desc: 'Etkilenen varlık ve nüfus büyüklüğü' },
              { sym: 'D', lbl: 'Dynamics (Dinamik)', desc: 'Değişken çevresel koşul faktörleri' },
              { sym: 'k', lbl: 'Kalibrasyoncu', desc: 'Sektöre özel ağırlıklandırma katsayısı' },
              { sym: 'C', lbl: 'Kapasite', desc: 'Kurumsal hazırlık ve kapasite endeksi' },
            ].map(l => (
              <div key={l.sym} style={{ background: '#0d1f3c', borderRadius: 12,
                                        padding: '20px 24px', border: '1px solid #1e3a5f', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span className="serif" style={{ color: G, fontSize: 24, fontWeight: 700 }}>{l.sym}</span>
                  <span style={{ color: W, fontSize: 13, fontWeight: 600 }}>{l.lbl}</span>
                </div>
                <p style={{ color: S, fontSize: 12, lineHeight: 1.6 }}>{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTORS ── */}
      <section id="sectors" style={{ padding: '100px 64px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ color: G, fontSize: 12, letterSpacing: 3, marginBottom: 16 }}>SEKTÖRLER</p>
          <h2 className="serif" style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 700, color: W }}>
            Her Sektör İçin Özelleştirilmiş Çözümler
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {sectors.map((s, i) => (
            <div key={i} style={{
              background: '#0d1f3c', borderRadius: 16, padding: 32,
              border: '1px solid #1e3a5f', cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = G
                el.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = '#1e3a5f'
                el.style.transform = 'translateY(0)'
              }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
              <h3 style={{ color: W, fontSize: 20, fontWeight: 600, marginBottom: 10 }}>{s.name}</h3>
              <p style={{ color: S, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>
              <span style={{ color: G, fontSize: 13, fontWeight: 600 }}>Detaylı İncele →</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 64px', background: 'linear-gradient(135deg, #0d1f3c 0%, #0A1628 100%)',
                        borderTop: `1px solid #1e3a5f` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: G, fontSize: 12, letterSpacing: 3, marginBottom: 20 }}>BAŞLAYIN</p>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700,
                                          color: W, marginBottom: 24, lineHeight: 1.1 }}>
            Kurumunuzun Dayanıklılığını<br />
            <span style={{ color: G }}>Bugün Ölçün</span>
          </h2>
          <p style={{ color: S, fontSize: 17, lineHeight: 1.75, marginBottom: 48 }}>
            14 günlük ücretsiz deneme. Kredi kartı gerekmez. ISO 22301 uyumlu
            raporunuzu ilk gün alın.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" className="gold-btn" style={{ fontSize: 16, padding: '16px 48px' }}>
              Ücretsiz Demo Talep Et
            </Link>
            <a href="mailto:info@omniversel.com" className="ghost-btn" style={{ fontSize: 16 }}>
              Bize Yazın
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#060f1d', borderTop: `1px solid #1e3a5f`, padding: '56px 64px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            {/* brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <svg width="28" height="28" viewBox="0 0 36 36">
                  <polygon points="18,2 34,28 2,28" fill="none" stroke={G} strokeWidth="2.5" />
                  <circle cx="18" cy="20" r="3" fill={G} />
                </svg>
                <span className="serif" style={{ color: G, fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>OMNIVERSEL</span>
              </div>
              <p style={{ color: S, fontSize: 14, lineHeight: 1.8, maxWidth: 280 }}>
                Yapay zeka destekli kurumsal dayanıklılık platformu. İTÜ AYM iş birliğiyle geliştirilmiştir.
              </p>
            </div>
            {/* links */}
            {[
              { title: 'Platform', links: ['Özellikler','Sektörler','Formül','Fiyatlar'] },
              { title: 'Şirket',   links: ['Hakkımızda','Blog','Kariyer','İletişim'] },
              { title: 'Yasal',    links: ['Gizlilik','KVKK','Kullanım Şartları','Güvenlik'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ color: W, fontSize: 14, fontWeight: 600, marginBottom: 20, letterSpacing: 0.5 }}>
                  {col.title}
                </div>
                {col.links.map(l => (
                  <div key={l} style={{ marginBottom: 12 }}>
                    <a href="#" style={{ color: S, fontSize: 14, transition: 'color 0.2s' }}
                       onMouseEnter={e => (e.currentTarget.style.color = G)}
                       onMouseLeave={e => (e.currentTarget.style.color = S)}>{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid #1e3a5f`, paddingTop: 28,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexWrap: 'wrap', gap: 16 }}>
            <span style={{ color: S, fontSize: 13 }}>
              © {new Date().getFullYear()} Omniversel. Tüm hakları saklıdır.
            </span>
            <div style={{ display: 'flex', gap: 24 }}>
              {['ISO 22301:2019','BCM','AFAD'].map(b => (
                <span key={b} style={{ color: G2, fontSize: 12, letterSpacing: 1 }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
