'use client'

import Link from 'next/link'
import { useState } from 'react'

const N  = '#0A1628'
const T  = '#6ABFB8'
const G  = '#E8C97A'
const MG = '#8FA3B8'
const BG = '#FFFFFF'
const GR = '#F7F8FA'

const PRODUCT_COLOR = '#6ABFB8'

export default function OmniRiskPage() {
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
      title: 'HFER-720 Motoru',
      desc: '720 analiz parametresi, 39 ilçe kapsama, gerçek zamanlı hesaplama motoru.',
      path: 'M2 8 L8 8 M2 5 L8 5 M2 2 L8 2',
    },
    {
      title: 'Çok Tehlike Analizi',
      desc: 'Deprem, sel, NATECH, iklim krizi ve toplumsal olayları tek modelde birleştirir.',
      path: 'M5 1 L9 9 L1 9 Z',
    },
    {
      title: 'Mahalle Bazlı URI',
      desc: 'İlçe ve mahalle düzeyinde Birleşik Risk Endeksi skoru otomatik üretilir.',
      path: 'M5 1 A4 4 0 1 1 4.99 1 M5 5 L5 3',
    },
    {
      title: 'CBS Entegrasyonu',
      desc: 'PostGIS tabanlı coğrafi analiz; ısı haritası ve tesis katmanı.',
      path: 'M1 9 L5 2 L9 9 M3 6 L7 6',
    },
    {
      title: 'F-N Eğrisi Analizi',
      desc: 'ALARP metodolojisi ile frekans-nüfus risk değerlendirmesi.',
      path: 'M1 9 Q5 1 9 5',
    },
    {
      title: 'Otomatik Raporlama',
      desc: 'Yöneticiye özel PDF raporu, denetim için kanıt paketi.',
      path: 'M2 1 L8 1 L8 9 L2 9 Z M4 4 L6 4 M4 6 L6 6',
    },
  ]

  const sectors = ['Kamu & Belediye', 'Sanayi & Üretim', 'Kritik Altyapı', 'Bankacılık', 'Sağlık']

  const standards = [
    { code: 'ISO 31000',      desc: 'Risk yönetimi ilkeleri ve kılavuzları' },
    { code: 'Sendai 2015–2030', desc: 'Uluslararası afet riski azaltma çerçevesi' },
    { code: 'HFER-720',       desc: '720 parametreli tehlike-frekans etki motoru' },
    { code: 'RAPID-N',        desc: 'NATECH risk değerlendirme metodolojisi' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${BG};color:${N};font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        .risk-nav-link{color:${MG};font-size:14px;font-weight:500;transition:color .18s;cursor:pointer}
        .risk-nav-link:hover{color:${N}}
        .risk-btn-navy{display:inline-block;background:${N};color:#fff;font-weight:600;font-size:14px;padding:11px 26px;border-radius:6px;transition:background .18s,transform .12s;cursor:pointer;border:none;font-family:'DM Sans',sans-serif}
        .risk-btn-navy:hover{background:#142340;transform:translateY(-1px)}
        .risk-btn-outline{display:inline-block;border:1.5px solid ${N};color:${N};font-weight:600;font-size:14px;padding:10px 26px;border-radius:6px;transition:background .18s;cursor:pointer;font-family:'DM Sans',sans-serif}
        .risk-btn-outline:hover{background:${GR}}
        .risk-feat-card{background:${BG};border-radius:16px;border:1px solid #E8EDF3;padding:32px;transition:box-shadow .2s,transform .2s}
        .risk-feat-card:hover{box-shadow:0 8px 32px rgba(10,22,40,.09);transform:translateY(-3px)}
        .risk-sector-pill{display:inline-block;padding:6px 18px;border-radius:20px;font-size:13px;font-weight:600;background:${PRODUCT_COLOR}18;color:${PRODUCT_COLOR};border:1px solid ${PRODUCT_COLOR}40;margin:4px}
        .risk-std-card{background:${BG};border-radius:12px;border:1px solid #E8EDF3;padding:24px;flex:1}
        .risk-input{border:1px solid #E2E8F0;border-radius:10px;padding:12px 16px;width:100%;font-size:14px;font-family:'DM Sans',sans-serif;color:${N};outline:none;transition:border-color .2s}
        .risk-input:focus{border-color:${PRODUCT_COLOR}}
        .risk-sector-card{background:${BG};border:1px solid #E8EDF3;border-radius:16px;padding:32px;transition:box-shadow .2s,transform .2s}
        .risk-sector-card:hover{box-shadow:0 8px 32px rgba(10,22,40,.09);transform:translateY(-3px)}
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
            <a href="#" className="risk-nav-link">Ürünler</a>
            <a href="#" className="risk-nav-link">Çözümler</a>
            <a href="#" className="risk-nav-link">Hakkımızda</a>
            <Link href="/login" className="risk-btn-navy">Demo Talep</Link>
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
            }}>omniRISK</div>
            <h1 style={{ fontSize: 'clamp(38px, 5vw, 64px)', fontWeight: 700,
                         lineHeight: 1.1, color: N, marginBottom: 24, whiteSpace: 'pre-line' }}>
              {'Riski ölçemeyen,\nyönetemez.'}
            </h1>
            <p style={{ color: MG, fontSize: 17, lineHeight: 1.8, maxWidth: 500, marginBottom: 40 }}>
              720 parametreli HFER motoru ile çok tehlike risk modellemesi — depremden NATECH&apos;e, iklim krizinden toplumsal olaylara.
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
              <rect x="80" y="16" width="120" height="12" rx="4" fill="#ffffff" fillOpacity="0.08"/>
              {/* card row 1 */}
              <rect x="20" y="60" width="140" height="72" rx="8" fill="#ffffff" fillOpacity="0.06"/>
              <rect x="172" y="60" width="140" height="72" rx="8" fill="#ffffff" fillOpacity="0.06"/>
              <rect x="324" y="60" width="156" height="72" rx="8" fill="#ffffff" fillOpacity="0.06"/>
              <text x="90" y="90" fill="#6ABFB8" fontSize="20" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">720</text>
              <text x="90" y="108" fill="#ffffff" fontSize="9" fontFamily="DM Sans,sans-serif" textAnchor="middle" fillOpacity="0.5">Parametre</text>
              <text x="242" y="90" fill="#E8C97A" fontSize="20" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">39</text>
              <text x="242" y="108" fill="#ffffff" fontSize="9" fontFamily="DM Sans,sans-serif" textAnchor="middle" fillOpacity="0.5">İlçe</text>
              <text x="402" y="90" fill="#f87171" fontSize="20" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">%98</text>
              <text x="402" y="108" fill="#ffffff" fontSize="9" fontFamily="DM Sans,sans-serif" textAnchor="middle" fillOpacity="0.5">Uptime</text>
              {/* bar chart */}
              <rect x="20" y="148" width="200" height="130" rx="8" fill="#ffffff" fillOpacity="0.04"/>
              <rect x="36" y="240" width="18" height="28" rx="2" fill="#6ABFB8" fillOpacity="0.5"/>
              <rect x="62" y="220" width="18" height="48" rx="2" fill="#6ABFB8" fillOpacity="0.7"/>
              <rect x="88" y="200" width="18" height="68" rx="2" fill="#6ABFB8" fillOpacity="0.9"/>
              <rect x="114" y="215" width="18" height="53" rx="2" fill="#6ABFB8" fillOpacity="0.6"/>
              <rect x="140" y="230" width="18" height="38" rx="2" fill="#6ABFB8" fillOpacity="0.4"/>
              <rect x="166" y="208" width="18" height="60" rx="2" fill="#6ABFB8"/>
              {/* line chart */}
              <rect x="232" y="148" width="248" height="130" rx="8" fill="#ffffff" fillOpacity="0.04"/>
              <polyline points="248,258 280,240 312,248 344,220 376,232 408,210 440,218 464,205"
                        fill="none" stroke="#E8C97A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="464" cy="205" r="4" fill="#E8C97A"/>
              <line x1="248" y1="148" x2="248" y2="278" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1"/>
              <line x1="248" y1="278" x2="480" y2="278" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1"/>
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
              omniRISK ile Neler Yapabilirsiniz?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="risk-feat-card">
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
              <span key={s} className="risk-sector-pill">{s}</span>
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
              <div key={s.code} className="risk-std-card">
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
            omniRISK Arayüzü
          </h2>
          <svg width="100%" viewBox="0 0 900 400" style={{ maxWidth: 900, borderRadius: 12 }}>
            <rect width="900" height="400" rx="12" fill="#0D1E36"/>
            {/* header */}
            <rect x="0" y="0" width="900" height="50" rx="0" fill="#ffffff" fillOpacity="0.05"/>
            <rect x="20" y="17" width="80" height="16" rx="4" fill="#ffffff" fillOpacity="0.2"/>
            <rect x="120" y="17" width="60" height="16" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="200" y="17" width="60" height="16" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="780" y="17" width="100" height="16" rx="4" fill={PRODUCT_COLOR} fillOpacity="0.5"/>
            {/* sidebar */}
            <rect x="0" y="50" width="180" height="350" fill="#ffffff" fillOpacity="0.03"/>
            <rect x="16" y="72" width="148" height="12" rx="4" fill="#ffffff" fillOpacity="0.15"/>
            <rect x="16" y="96" width="120" height="12" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="16" y="120" width="132" height="12" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="16" y="144" width="100" height="12" rx="4" fill={PRODUCT_COLOR} fillOpacity="0.4"/>
            {/* KPI cards */}
            <rect x="200" y="68" width="200" height="80" rx="8" fill="#ffffff" fillOpacity="0.06"/>
            <rect x="416" y="68" width="200" height="80" rx="8" fill="#ffffff" fillOpacity="0.06"/>
            <rect x="632" y="68" width="248" height="80" rx="8" fill="#ffffff" fillOpacity="0.06"/>
            <text x="300" y="108" fill={PRODUCT_COLOR} fontSize="24" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">720</text>
            <text x="516" y="108" fill="#E8C97A" fontSize="24" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">39</text>
            <text x="756" y="108" fill="#f87171" fontSize="24" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">%4.2</text>
            {/* bar chart group */}
            <rect x="200" y="164" width="300" height="216" rx="8" fill="#ffffff" fillOpacity="0.03"/>
            <rect x="218" y="340" width="22" height="30" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.4"/>
            <rect x="252" y="310" width="22" height="60" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.6"/>
            <rect x="286" y="280" width="22" height="90" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.8"/>
            <rect x="320" y="300" width="22" height="70" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.7"/>
            <rect x="354" y="320" width="22" height="50" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.5"/>
            <rect x="388" y="295" width="22" height="75" rx="3" fill={PRODUCT_COLOR}/>
            <rect x="422" y="315" width="22" height="55" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.6"/>
            <rect x="456" y="290" width="22" height="80" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.8"/>
            {/* line chart */}
            <rect x="516" y="164" width="364" height="216" rx="8" fill="#ffffff" fillOpacity="0.03"/>
            <polyline points="536,350 580,320 620,335 660,295 700,310 740,275 780,285 840,255 860,260"
                      fill="none" stroke="#E8C97A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      strokeOpacity="0.8"/>
            <polyline points="536,360 580,345 620,350 660,330 700,340 740,315 780,322 840,300 860,305"
                      fill="none" stroke={PRODUCT_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      strokeOpacity="0.4"/>
            <circle cx="860" cy="260" r="5" fill="#E8C97A" fillOpacity="0.8"/>
            <line x1="200" y1="380" x2="880" y2="380" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1"/>
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
              omniRISK&apos;i kurum ortamınızda deneyin. Uzmanımız 24 saat içinde sizi arar.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                placeholder="Ad Soyad"
                value={adSoyad}
                onChange={e => setAdSoyad(e.target.value)}
                required
                className="risk-input"
              />
              <input
                type="text"
                placeholder="Kurum"
                value={kurum}
                onChange={e => setKurum(e.target.value)}
                required
                className="risk-input"
              />
              <input
                type="email"
                placeholder="E-posta"
                value={eposta}
                onChange={e => setEposta(e.target.value)}
                required
                className="risk-input"
              />
              <textarea
                placeholder="Mesaj"
                value={mesaj}
                onChange={e => setMesaj(e.target.value)}
                rows={4}
                className="risk-input"
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
