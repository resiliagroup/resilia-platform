'use client'

import Link from 'next/link'
import { useState } from 'react'

const N  = '#0A1628'
const T  = '#6ABFB8'
const G  = '#E8C97A'
const MG = '#8FA3B8'
const BG = '#FFFFFF'
const GR = '#F7F8FA'

const PRODUCT_COLOR = '#7B9FD4'

export default function OmniPlanPage() {
  const [scrolled] = useState(false)
  const [adSoyad, setAdSoyad]   = useState<string>('')
  const [kurum, setKurum]       = useState<string>('')
  const [eposta, setEposta]     = useState<string>('')
  const [mesaj, setMesaj]       = useState<string>('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    alert('Talebiniz alındı.')
  }

  const features = [
    {
      title: 'BCM Plan Üretici',
      desc: 'Yapay zeka destekli plan taslağı; kuruma özel BCP 20 dakikada hazır.',
      path: 'M2 1 L8 1 L8 9 L2 9 Z M4 3 L6 3 M4 5 L6 5 M4 7 L6 7',
    },
    {
      title: 'Senaryo Tatbikatı',
      desc: 'Masa üstü ve saha tatbikatları için senaryo motoru ve değerlendirme şablonu.',
      path: 'M5 1 L9 9 L1 9 Z M5 4 L5 7 M5 8 L5 8.5',
    },
    {
      title: 'Protokol Kütüphanesi',
      desc: '500+ AFAD ve ISO uyumlu acil durum protokolü, aranabilir formatta.',
      path: 'M1 2 L4 2 L4 8 L1 8 Z M5 2 L9 2 M5 5 L9 5 M5 8 L8 8',
    },
    {
      title: 'Dijital Plan Arşivi',
      desc: 'Versiyon kontrolü, onay akışı ve revizyondaki değişiklik takibi.',
      path: 'M2 1 L8 1 L8 9 L2 9 Z M2 4 L8 4 M4 1 L4 4',
    },
    {
      title: 'Görev Matrisi',
      desc: 'Kriz rollerini ve görev dağılımını otomatik atayan sorumluluk çizelgesi.',
      path: 'M1 1 L9 1 L9 9 L1 9 Z M1 4 L9 4 M1 7 L9 7 M4 1 L4 9',
    },
    {
      title: 'Uyum İzleme',
      desc: 'ISO 22301 gereksinimlerini anlık izleyen uyum panosu ve denetim kaydı.',
      path: 'M2 5 A3 3 0 1 1 2 4.9 M6 3 L9 3 M6 5 L9 5 M6 7 L9 7',
    },
  ]

  const sectors = ['Kamu & Belediye', 'Sağlık', 'Bankacılık', 'Eğitim', 'Turizm']

  const standards = [
    { code: 'ISO 22301',        desc: 'İş sürekliliği yönetim sistemi standardı' },
    { code: 'AFAD UDAP',        desc: 'AFAD ulusal deprem ve afet planı direktifleri' },
    { code: 'Sendai SF-2',      desc: 'Afet riski azaltma sürekliliği çerçevesi' },
    { code: 'BCM Good Practice', desc: 'BCI uluslararası iyi uygulama kılavuzu' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${BG};color:${N};font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        .plan-nav-link{color:${MG};font-size:14px;font-weight:500;transition:color .18s;cursor:pointer}
        .plan-nav-link:hover{color:${N}}
        .plan-btn-navy{display:inline-block;background:${N};color:#fff;font-weight:600;font-size:14px;padding:11px 26px;border-radius:6px;transition:background .18s,transform .12s;cursor:pointer;border:none;font-family:'DM Sans',sans-serif}
        .plan-btn-navy:hover{background:#142340;transform:translateY(-1px)}
        .plan-feat-card{background:${BG};border-radius:16px;border:1px solid #E8EDF3;padding:32px;transition:box-shadow .2s,transform .2s}
        .plan-feat-card:hover{box-shadow:0 8px 32px rgba(10,22,40,.09);transform:translateY(-3px)}
        .plan-sector-pill{display:inline-block;padding:6px 18px;border-radius:20px;font-size:13px;font-weight:600;background:${PRODUCT_COLOR}18;color:${PRODUCT_COLOR};border:1px solid ${PRODUCT_COLOR}40;margin:4px}
        .plan-std-card{background:${BG};border-radius:12px;border:1px solid #E8EDF3;padding:24px;flex:1}
        .plan-input{border:1px solid #E2E8F0;border-radius:10px;padding:12px 16px;width:100%;font-size:14px;font-family:'DM Sans',sans-serif;color:${N};outline:none;transition:border-color .2s}
        .plan-input:focus{border-color:${PRODUCT_COLOR}}
      `}</style>

      {/* NAV */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 68, background: BG,
        borderBottom: scrolled ? '1px solid #E8EDF3' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 16px rgba(10,22,40,.06)' : 'none',
        transition: 'box-shadow .25s, border-color .25s',
        display: 'flex', alignItems: 'center', padding: '0 48px',
      }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill={N}/>
              <polygon points="16,7 25,22 7,22" fill="none" stroke={T} strokeWidth="2"/>
              <polygon points="16,12 21,20 11,20" fill={T} fillOpacity="0.4"/>
              <circle cx="16" cy="18" r="2" fill={G}/>
            </svg>
            <span style={{ color: N, fontSize: 18, fontWeight: 700, letterSpacing: 0.5 }}>
              omni<span style={{ color: T }}>versel</span>
            </span>
          </Link>
          <nav style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
            <a href="#" className="plan-nav-link">Ürünler</a>
            <a href="#" className="plan-nav-link">Çözümler</a>
            <a href="#" className="plan-nav-link">Hakkımızda</a>
            <Link href="/login" className="plan-btn-navy">Demo Talep</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ padding: '140px 48px 100px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{
              display: 'inline-block', padding: '5px 16px', borderRadius: 20,
              background: `${PRODUCT_COLOR}18`, border: `1px solid ${PRODUCT_COLOR}40`,
              color: PRODUCT_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase', marginBottom: 28,
            }}>omniPLAN</div>
            <h1 style={{ fontSize: 'clamp(38px, 5vw, 64px)', fontWeight: 700,
                         lineHeight: 1.1, color: N, marginBottom: 24, whiteSpace: 'pre-line' }}>
              {'Plan yoksa\nhazırlık yoktur.'}
            </h1>
            <p style={{ color: MG, fontSize: 17, lineHeight: 1.8, maxWidth: 500, marginBottom: 40 }}>
              ISO 22301 uyumlu iş sürekliliği planları, senaryo bazlı tatbikat yönetimi ve AFAD uyumlu protokol kütüphanesi.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#demo" style={{
                display: 'inline-block', background: N, color: '#fff', fontWeight: 600,
                fontSize: 15, padding: '13px 32px', borderRadius: 6, cursor: 'pointer',
              }}>Demo Talep Et</a>
              <Link href="/login" style={{
                display: 'inline-block', border: `1.5px solid ${N}`, color: N, fontWeight: 600,
                fontSize: 15, padding: '12px 32px', borderRadius: 6,
              }}>Platforma Giriş</Link>
            </div>
          </div>

          {/* Right: mock dashboard SVG */}
          <div>
            <svg width="500" height="340" viewBox="0 0 500 340"
                 style={{ borderRadius: 16, width: '100%', maxWidth: 500 }}>
              <rect width="500" height="340" rx="16" fill="#0A1628"/>
              {/* top bar */}
              <rect x="0" y="0" width="500" height="44" rx="0" fill="#0D1E36"/>
              <circle cx="20" cy="22" r="5" fill="#f87171" fillOpacity="0.7"/>
              <circle cx="36" cy="22" r="5" fill="#E8C97A" fillOpacity="0.7"/>
              <circle cx="52" cy="22" r="5" fill="#6ABFB8" fillOpacity="0.7"/>
              <rect x="80" y="16" width="130" height="12" rx="4" fill="#ffffff" fillOpacity="0.08"/>
              {/* sidebar */}
              <rect x="0" y="44" width="160" height="296" fill="#ffffff" fillOpacity="0.03"/>
              <rect x="14" y="62" width="132" height="10" rx="4" fill="#ffffff" fillOpacity="0.15"/>
              <rect x="14" y="82" width="110" height="10" rx="4" fill="#ffffff" fillOpacity="0.1"/>
              <rect x="14" y="102" width="120" height="10" rx="4" fill="#ffffff" fillOpacity="0.1"/>
              <rect x="14" y="122" width="90" height="10" rx="4" fill={PRODUCT_COLOR} fillOpacity="0.4"/>
              {/* plan cards */}
              <rect x="175" y="58" width="148" height="100" rx="8" fill="#ffffff" fillOpacity="0.06"/>
              <rect x="335" y="58" width="148" height="100" rx="8" fill="#ffffff" fillOpacity="0.06"/>
              <rect x="175" y="170" width="308" height="80" rx="8" fill="#ffffff" fillOpacity="0.04"/>
              {[0,1,2].map(r => (
                <rect key={r} x="191" y={185 + r * 18} width={180 - r * 30} height="10" rx="3" fill="#ffffff" fillOpacity={0.2 - r * 0.04}/>
              ))}
              <text x="249" y="108" fill={PRODUCT_COLOR} fontSize="14" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">BCP Aktif</text>
              <text x="409" y="108" fill="#E8C97A" fontSize="14" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">Tatbikat</text>
              {/* progress bars */}
              <rect x="175" y="264" width="308" height="60" rx="8" fill="#ffffff" fillOpacity="0.03"/>
              <rect x="191" y="278" width="276" height="8" rx="4" fill="#ffffff" fillOpacity="0.1"/>
              <rect x="191" y="278" width={276 * 0.72} height="8" rx="4" fill={PRODUCT_COLOR} fillOpacity="0.7"/>
              <rect x="191" y="298" width="276" height="8" rx="4" fill="#ffffff" fillOpacity="0.1"/>
              <rect x="191" y="298" width={276 * 0.88} height="8" rx="4" fill="#6ABFB8" fillOpacity="0.6"/>
            </svg>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 48px', background: GR }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: PRODUCT_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                        textTransform: 'uppercase', marginBottom: 12 }}>Özellikler</p>
            <h2 style={{ color: N, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.15 }}>
              omniPLAN ile Neler Yapabilirsiniz?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="plan-feat-card">
                <div style={{ marginBottom: 20 }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="24" fill={`${PRODUCT_COLOR}18`}/>
                    <g transform="translate(19,19)">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d={f.path} stroke={PRODUCT_COLOR} strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </g>
                  </svg>
                </div>
                <div style={{ color: N, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{f.title}</div>
                <p style={{ color: MG, fontSize: 14, lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section style={{ padding: '60px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: PRODUCT_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                      textTransform: 'uppercase', marginBottom: 12 }}>Sektörler</p>
          <h2 style={{ color: N, fontSize: 28, fontWeight: 700, marginBottom: 28 }}>
            Hangi Sektörlere Hitap Eder?
          </h2>
          <div>
            {sectors.map(s => (
              <span key={s} className="plan-sector-pill">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* STANDARDS */}
      <section style={{ padding: '60px 48px', background: GR }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: PRODUCT_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                      textTransform: 'uppercase', marginBottom: 12 }}>Standartlar</p>
          <h2 style={{ color: N, fontSize: 28, fontWeight: 700, marginBottom: 32 }}>
            Uyum Referansları
          </h2>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {standards.map(s => (
              <div key={s.code} className="plan-std-card">
                <div style={{ color: PRODUCT_COLOR, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{s.code}</div>
                <div style={{ color: MG, fontSize: 13, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD WIREFRAME */}
      <section style={{ padding: '80px 48px', background: '#0A1628', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: PRODUCT_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                      textTransform: 'uppercase', marginBottom: 12 }}>Platform</p>
          <h2 style={{ color: BG, fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, marginBottom: 48 }}>
            omniPLAN Arayüzü
          </h2>
          <svg width="100%" viewBox="0 0 900 400" style={{ maxWidth: 900, borderRadius: 12 }}>
            <rect width="900" height="400" rx="12" fill="#0D1E36"/>
            <rect x="0" y="0" width="900" height="50" fill="#ffffff" fillOpacity="0.05"/>
            <rect x="20" y="17" width="100" height="16" rx="4" fill="#ffffff" fillOpacity="0.2"/>
            <rect x="140" y="17" width="70" height="16" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="780" y="17" width="100" height="16" rx="4" fill={PRODUCT_COLOR} fillOpacity="0.5"/>
            {/* sidebar */}
            <rect x="0" y="50" width="180" height="350" fill="#ffffff" fillOpacity="0.03"/>
            <rect x="16" y="72" width="148" height="12" rx="4" fill="#ffffff" fillOpacity="0.15"/>
            <rect x="16" y="96" width="120" height="12" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="16" y="120" width="132" height="12" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="16" y="144" width="100" height="12" rx="4" fill={PRODUCT_COLOR} fillOpacity="0.4"/>
            {/* plan list */}
            <rect x="200" y="68" width="480" height="300" rx="8" fill="#ffffff" fillOpacity="0.04"/>
            {[0,1,2,3,4,5].map(r => (
              <g key={r}>
                <rect x="220" y={90 + r * 42} width={200 + (r % 3) * 30} height="12" rx="3" fill="#ffffff" fillOpacity={0.2 - r * 0.02}/>
                <rect x="440" y={90 + r * 42} width="80" height="12" rx="3" fill={PRODUCT_COLOR} fillOpacity={0.5 - r * 0.06}/>
                <rect x="540" y={90 + r * 42} width="60" height="12" rx="3" fill="#ffffff" fillOpacity="0.1"/>
                <rect x="620" y={90 + r * 42} width="40" height="12" rx="3" fill="#6ABFB8" fillOpacity={0.4 - r * 0.04}/>
                <line x1="220" y1={110 + r * 42} x2="660" y2={110 + r * 42} stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1"/>
              </g>
            ))}
            {/* right panel */}
            <rect x="700" y="68" width="180" height="300" rx="8" fill="#ffffff" fillOpacity="0.04"/>
            <rect x="716" y="86" width="148" height="10" rx="3" fill="#ffffff" fillOpacity="0.2"/>
            <rect x="716" y="106" width="148" height="60" rx="4" fill={PRODUCT_COLOR} fillOpacity="0.15"/>
            <rect x="716" y="176" width="100" height="8" rx="3" fill="#ffffff" fillOpacity="0.15"/>
            <rect x="716" y="195" width="148" height="8" rx="3" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="716" y="214" width="120" height="8" rx="3" fill="#ffffff" fillOpacity="0.1"/>
          </svg>
        </div>
      </section>

      {/* CTA / DEMO FORM */}
      <section id="demo" style={{ padding: '100px 48px', background: BG }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{
            background: BG, borderRadius: 20, padding: '56px 48px',
            boxShadow: '0 8px 48px rgba(10,22,40,.08)', border: '1px solid #E8EDF3',
          }}>
            <p style={{ color: PRODUCT_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                        textTransform: 'uppercase', marginBottom: 12 }}>Demo</p>
            <h2 style={{ color: N, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Demo Talep Et</h2>
            <p style={{ color: MG, fontSize: 14, marginBottom: 36, lineHeight: 1.7 }}>
              omniPLAN&apos;ı kurum ortamınızda deneyin. Uzmanımız 24 saat içinde sizi arar.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                placeholder="Ad Soyad"
                value={adSoyad}
                onChange={e => setAdSoyad(e.target.value)}
                required
                className="plan-input"
              />
              <input
                type="text"
                placeholder="Kurum"
                value={kurum}
                onChange={e => setKurum(e.target.value)}
                required
                className="plan-input"
              />
              <input
                type="email"
                placeholder="E-posta"
                value={eposta}
                onChange={e => setEposta(e.target.value)}
                required
                className="plan-input"
              />
              <textarea
                placeholder="Mesaj"
                value={mesaj}
                onChange={e => setMesaj(e.target.value)}
                rows={4}
                className="plan-input"
                style={{ resize: 'vertical' }}
              />
              <button type="submit" style={{
                background: N, color: '#fff', fontWeight: 700, fontSize: 15,
                padding: '13px 32px', borderRadius: 8, border: 'none',
                cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              }}>
                Gönder
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: N, padding: '48px', textAlign: 'center' }}>
        <p style={{ color: '#607899', fontSize: 13 }}>
          © {new Date().getFullYear()} Omniversel Teknoloji A.Ş. Tüm hakları saklıdır.
        </p>
      </footer>
    </>
  )
}
