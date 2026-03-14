'use client'

import Link from 'next/link'
import { useState } from 'react'

const N  = '#0A1628'
const T  = '#6ABFB8'
const G  = '#E8C97A'
const MG = '#8FA3B8'
const BG = '#FFFFFF'
const GR = '#F7F8FA'

const PRODUCT_COLOR = '#E8C97A'

export default function OmniImpactPage() {
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
      title: 'Kritik Süreç Tespiti',
      desc: 'İş süreçlerini kritiklik matrisine göre otomatik sıralayan BIA motoru.',
      path: 'M1 9 L5 1 L9 9 M3 6 L7 6',
    },
    {
      title: 'RTO / RPO Hesaplama',
      desc: 'Kurtarma süresi ve noktası hedefleri sektör karşılaştırmasıyla belirlenir.',
      path: 'M1 1 L9 1 L9 9 L1 9 Z M1 5 L9 5',
    },
    {
      title: 'Bağımlılık Haritası',
      desc: 'Süreç, sistem, tedarikçi ve insan bağımlılıklarını görsel grafikle sunar.',
      path: 'M2 2 L8 2 M5 2 L5 8 M2 8 L8 8',
    },
    {
      title: 'Finansal Etki Modeli',
      desc: 'Kesinti başına saatlik kayıp hesabı ve senaryo bazlı toplam maliyet.',
      path: 'M1 8 L3 4 L5 6 L7 2 L9 5',
    },
    {
      title: 'Sektörel Karşılaştırma',
      desc: 'Aynı sektördeki kurumlarla anonim BIA kıyaslaması.',
      path: 'M2 5 A3 3 0 1 1 2 4.9 M5 1 L5 5 L8 7',
    },
    {
      title: 'Otomatik BIA Raporu',
      desc: 'ISO 22301 uyumlu BIA çıktısı, tek tıkla PDF formatında.',
      path: 'M2 1 L8 1 L8 9 L2 9 Z M4 4 L6 4 M4 6 L7 6',
    },
  ]

  const sectors = ['Bankacılık & Finans', 'Sağlık', 'Sanayi', 'Lojistik', 'Eğitim']

  const standards = [
    { code: 'ISO 22301',  desc: 'İş sürekliliği yönetim sistemi standardı' },
    { code: 'ISO 31000',  desc: 'Risk yönetimi ilkeleri ve kılavuzları' },
    { code: 'Sendai SF-2', desc: 'Afet riski azaltma sürekliliği çerçevesi' },
    { code: 'HFER-720',   desc: '720 parametreli etki hesaplama motoru' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${BG};color:${N};font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        .impact-nav-link{color:${MG};font-size:14px;font-weight:500;transition:color .18s;cursor:pointer}
        .impact-nav-link:hover{color:${N}}
        .impact-btn-navy{display:inline-block;background:${N};color:#fff;font-weight:600;font-size:14px;padding:11px 26px;border-radius:6px;transition:background .18s,transform .12s;cursor:pointer;border:none;font-family:'DM Sans',sans-serif}
        .impact-btn-navy:hover{background:#142340;transform:translateY(-1px)}
        .impact-feat-card{background:${BG};border-radius:16px;border:1px solid #E8EDF3;padding:32px;transition:box-shadow .2s,transform .2s}
        .impact-feat-card:hover{box-shadow:0 8px 32px rgba(10,22,40,.09);transform:translateY(-3px)}
        .impact-sector-pill{display:inline-block;padding:6px 18px;border-radius:20px;font-size:13px;font-weight:600;background:${PRODUCT_COLOR}18;color:${PRODUCT_COLOR};border:1px solid ${PRODUCT_COLOR}40;margin:4px}
        .impact-std-card{background:${BG};border-radius:12px;border:1px solid #E8EDF3;padding:24px;flex:1}
        .impact-input{border:1px solid #E2E8F0;border-radius:10px;padding:12px 16px;width:100%;font-size:14px;font-family:'DM Sans',sans-serif;color:${N};outline:none;transition:border-color .2s}
        .impact-input:focus{border-color:${PRODUCT_COLOR}}
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
            <a href="#" className="impact-nav-link">Ürünler</a>
            <a href="#" className="impact-nav-link">Çözümler</a>
            <a href="#" className="impact-nav-link">Hakkımızda</a>
            <Link href="/login" className="impact-btn-navy">Demo Talep</Link>
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
            }}>omniIMPACT</div>
            <h1 style={{ fontSize: 'clamp(38px, 5vw, 64px)', fontWeight: 700,
                         lineHeight: 1.1, color: N, marginBottom: 24, whiteSpace: 'pre-line' }}>
              {'Hangi süreç durduğunda\nne kaybedersiniz?'}
            </h1>
            <p style={{ color: MG, fontSize: 17, lineHeight: 1.8, maxWidth: 500, marginBottom: 40 }}>
              Kritik süreçlerinizi, RTO/RPO hedeflerinizi ve finansal etki modelinizi otomatik olarak oluşturun.
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
              <rect x="80" y="16" width="140" height="12" rx="4" fill="#ffffff" fillOpacity="0.08"/>
              {/* KPI row */}
              <rect x="20" y="60" width="140" height="80" rx="8" fill="#ffffff" fillOpacity="0.06"/>
              <rect x="172" y="60" width="140" height="80" rx="8" fill="#ffffff" fillOpacity="0.06"/>
              <rect x="324" y="60" width="156" height="80" rx="8" fill="#ffffff" fillOpacity="0.06"/>
              <text x="90" y="100" fill={PRODUCT_COLOR} fontSize="18" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">4 saat</text>
              <text x="90" y="118" fill="#ffffff" fontSize="9" fontFamily="DM Sans,sans-serif" textAnchor="middle" fillOpacity="0.5">RTO Hedefi</text>
              <text x="242" y="100" fill="#6ABFB8" fontSize="18" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">2 saat</text>
              <text x="242" y="118" fill="#ffffff" fontSize="9" fontFamily="DM Sans,sans-serif" textAnchor="middle" fillOpacity="0.5">RPO Hedefi</text>
              <text x="402" y="100" fill="#f87171" fontSize="18" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">₺2.4M</text>
              <text x="402" y="118" fill="#ffffff" fontSize="9" fontFamily="DM Sans,sans-serif" textAnchor="middle" fillOpacity="0.5">Etki/Gün</text>
              {/* process table */}
              <rect x="20" y="156" width="460" height="164" rx="8" fill="#ffffff" fillOpacity="0.04"/>
              <rect x="36" y="172" width="80" height="10" rx="3" fill="#ffffff" fillOpacity="0.3"/>
              <rect x="160" y="172" width="60" height="10" rx="3" fill="#ffffff" fillOpacity="0.3"/>
              <rect x="280" y="172" width="60" height="10" rx="3" fill="#ffffff" fillOpacity="0.3"/>
              <rect x="400" y="172" width="60" height="10" rx="3" fill="#ffffff" fillOpacity="0.3"/>
              <line x1="36" y1="190" x2="464" y2="190" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1"/>
              {[0,1,2,3].map(row => (
                <g key={row}>
                  <rect x="36" y={200 + row * 26} width={70 + row * 10} height="10" rx="3" fill="#ffffff" fillOpacity={0.15 - row * 0.02}/>
                  <rect x="160" y={200 + row * 26} width="50" height="10" rx="3" fill={PRODUCT_COLOR} fillOpacity={0.5 - row * 0.08}/>
                  <rect x="280" y={200 + row * 26} width="55" height="10" rx="3" fill="#6ABFB8" fillOpacity={0.4 - row * 0.05}/>
                  <rect x="400" y={200 + row * 26} width="60" height="10" rx="3" fill="#ffffff" fillOpacity={0.1}/>
                </g>
              ))}
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
              omniIMPACT ile Neler Yapabilirsiniz?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="impact-feat-card">
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
              <span key={s} className="impact-sector-pill">{s}</span>
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
              <div key={s.code} className="impact-std-card">
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
            omniIMPACT Arayüzü
          </h2>
          <svg width="100%" viewBox="0 0 900 400" style={{ maxWidth: 900, borderRadius: 12 }}>
            <rect width="900" height="400" rx="12" fill="#0D1E36"/>
            <rect x="0" y="0" width="900" height="50" rx="0" fill="#ffffff" fillOpacity="0.05"/>
            <rect x="20" y="17" width="100" height="16" rx="4" fill="#ffffff" fillOpacity="0.2"/>
            <rect x="140" y="17" width="70" height="16" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="780" y="17" width="100" height="16" rx="4" fill={PRODUCT_COLOR} fillOpacity="0.5"/>
            {/* sidebar */}
            <rect x="0" y="50" width="180" height="350" fill="#ffffff" fillOpacity="0.03"/>
            <rect x="16" y="72" width="148" height="12" rx="4" fill="#ffffff" fillOpacity="0.15"/>
            <rect x="16" y="96" width="120" height="12" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="16" y="120" width="132" height="12" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="16" y="144" width="100" height="12" rx="4" fill={PRODUCT_COLOR} fillOpacity="0.4"/>
            {/* KPI cards */}
            <rect x="200" y="68" width="220" height="80" rx="8" fill="#ffffff" fillOpacity="0.06"/>
            <rect x="436" y="68" width="220" height="80" rx="8" fill="#ffffff" fillOpacity="0.06"/>
            <rect x="672" y="68" width="208" height="80" rx="8" fill="#ffffff" fillOpacity="0.06"/>
            <text x="310" y="108" fill={PRODUCT_COLOR} fontSize="22" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">4 Saat</text>
            <text x="546" y="108" fill="#6ABFB8" fontSize="22" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">2 Saat</text>
            <text x="776" y="108" fill="#f87171" fontSize="22" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">₺2.4M</text>
            {/* bar chart */}
            <rect x="200" y="164" width="320" height="220" rx="8" fill="#ffffff" fillOpacity="0.03"/>
            <rect x="218" y="345" width="24" height="28" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.4"/>
            <rect x="256" y="310" width="24" height="63" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.6"/>
            <rect x="294" y="280" width="24" height="93" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.8"/>
            <rect x="332" y="298" width="24" height="75" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.7"/>
            <rect x="370" y="318" width="24" height="55" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.5"/>
            <rect x="408" y="292" width="24" height="81" rx="3" fill={PRODUCT_COLOR}/>
            <rect x="446" y="305" width="24" height="68" rx="3" fill={PRODUCT_COLOR} fillOpacity="0.6"/>
            {/* line chart */}
            <rect x="536" y="164" width="344" height="220" rx="8" fill="#ffffff" fillOpacity="0.03"/>
            <polyline points="556,355 596,325 636,340 676,300 716,318 756,280 796,290 856,262 876,268"
                      fill="none" stroke={PRODUCT_COLOR} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      strokeOpacity="0.8"/>
            <circle cx="876" cy="268" r="5" fill={PRODUCT_COLOR} fillOpacity="0.8"/>
            <line x1="200" y1="384" x2="880" y2="384" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1"/>
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
              omniIMPACT&apos;i kurum ortamınızda deneyin. Uzmanımız 24 saat içinde sizi arar.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                placeholder="Ad Soyad"
                value={adSoyad}
                onChange={e => setAdSoyad(e.target.value)}
                required
                className="impact-input"
              />
              <input
                type="text"
                placeholder="Kurum"
                value={kurum}
                onChange={e => setKurum(e.target.value)}
                required
                className="impact-input"
              />
              <input
                type="email"
                placeholder="E-posta"
                value={eposta}
                onChange={e => setEposta(e.target.value)}
                required
                className="impact-input"
              />
              <textarea
                placeholder="Mesaj"
                value={mesaj}
                onChange={e => setMesaj(e.target.value)}
                rows={4}
                className="impact-input"
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
