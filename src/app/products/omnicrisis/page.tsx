'use client'

import Link from 'next/link'
import { useState } from 'react'

const N  = '#0A1628'
const T  = '#6ABFB8'
const G  = '#E8C97A'
const MG = '#8FA3B8'
const BG = '#FFFFFF'
const GR = '#F7F8FA'

const PRODUCT_COLOR = '#f87171'

export default function OmniCrisisPage() {
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
      title: 'EOC Dashboard',
      desc: 'Acil operasyon merkezi panosu; tüm aktif olayları ve ekipleri tek ekranda.',
      path: 'M1 1 L9 1 L9 7 L1 7 Z M3 4 L7 4 M5 1 L5 4',
    },
    {
      title: 'Anlık Görev Atama',
      desc: 'Kriz rolü bazlı görev listesi; onay beklemeyen hızlı aksiyon protokolü.',
      path: 'M1 5 L3 7 L9 1',
    },
    {
      title: 'Kaynak Yönetimi',
      desc: 'Araç, ekipman ve personel tahsisi; gerçek zamanlı envanter takibi.',
      path: 'M1 8 L9 8 M1 5 L7 5 M1 2 L5 2',
    },
    {
      title: 'Halk İletişimi',
      desc: 'Çok kanallı uyarı yayını: SMS, e-posta, dijital pano entegrasyonu.',
      path: 'M1 1 L9 1 L9 7 L5 7 L3 9 L3 7 L1 7 Z',
    },
    {
      title: 'Kriz Takvimi',
      desc: 'Olay zaman çizelgesi, karar kayıtları ve kriz günlüğü otomatik tutulur.',
      path: 'M1 2 L9 2 L9 9 L1 9 Z M1 2 L1 5 L9 5 M4 2 L4 0 M7 2 L7 0',
    },
    {
      title: 'Kriz Sonrası Rapor',
      desc: 'After Action Review şablonu; öğrenilen dersler ve iyileştirme planı.',
      path: 'M2 1 L8 1 L8 9 L2 9 Z M4 4 L6 4 M4 6 L7 6 M4 2 L7 2',
    },
  ]

  const sectors = ['Kamu & Belediye', 'Sağlık & Hastane', 'Kritik Altyapı', 'Sanayi', 'Turizm']

  const standards = [
    { code: 'ISO 22320',  desc: 'Acil durum yönetimi ve komuta standardı' },
    { code: 'Sendai SF-4', desc: 'Kriz müdahale ve dayanıklılık çerçevesi' },
    { code: 'NIMS/ICS',   desc: 'ABD ulusal olay yönetim sistemi' },
    { code: 'HFER-720',   desc: '720 parametreli kriz etki hesaplama motoru' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${BG};color:${N};font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        .crisis-nav-link{color:${MG};font-size:14px;font-weight:500;transition:color .18s;cursor:pointer}
        .crisis-nav-link:hover{color:${N}}
        .crisis-btn-navy{display:inline-block;background:${N};color:#fff;font-weight:600;font-size:14px;padding:11px 26px;border-radius:6px;transition:background .18s,transform .12s;cursor:pointer;border:none;font-family:'DM Sans',sans-serif}
        .crisis-btn-navy:hover{background:#142340;transform:translateY(-1px)}
        .crisis-feat-card{background:${BG};border-radius:16px;border:1px solid #E8EDF3;padding:32px;transition:box-shadow .2s,transform .2s}
        .crisis-feat-card:hover{box-shadow:0 8px 32px rgba(10,22,40,.09);transform:translateY(-3px)}
        .crisis-sector-pill{display:inline-block;padding:6px 18px;border-radius:20px;font-size:13px;font-weight:600;background:${PRODUCT_COLOR}18;color:${PRODUCT_COLOR};border:1px solid ${PRODUCT_COLOR}40;margin:4px}
        .crisis-std-card{background:${BG};border-radius:12px;border:1px solid #E8EDF3;padding:24px;flex:1}
        .crisis-input{border:1px solid #E2E8F0;border-radius:10px;padding:12px 16px;width:100%;font-size:14px;font-family:'DM Sans',sans-serif;color:${N};outline:none;transition:border-color .2s}
        .crisis-input:focus{border-color:${PRODUCT_COLOR}}
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
            <a href="#" className="crisis-nav-link">Ürünler</a>
            <a href="#" className="crisis-nav-link">Çözümler</a>
            <a href="#" className="crisis-nav-link">Hakkımızda</a>
            <Link href="/login" className="crisis-btn-navy">Demo Talep</Link>
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
            }}>omniCRISIS</div>
            <h1 style={{ fontSize: 'clamp(38px, 5vw, 64px)', fontWeight: 700,
                         lineHeight: 1.1, color: N, marginBottom: 24, whiteSpace: 'pre-line' }}>
              {'Kriz anında saniyeler\nhayat kurtarır.'}
            </h1>
            <p style={{ color: MG, fontSize: 17, lineHeight: 1.8, maxWidth: 500, marginBottom: 40 }}>
              Gerçek zamanlı kriz komuta merkezi, anlık görev atama, kaynak yönetimi ve halk iletişim modülü tek platformda.
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
              {/* live alert badge */}
              <circle cx="400" cy="22" r="5" fill={PRODUCT_COLOR} fillOpacity="0.9"/>
              <rect x="412" y="16" width="68" height="12" rx="4" fill={PRODUCT_COLOR} fillOpacity="0.3"/>
              {/* left panel: active events */}
              <rect x="20" y="58" width="220" height="262" rx="8" fill="#ffffff" fillOpacity="0.04"/>
              <rect x="36" y="74" width="140" height="10" rx="3" fill="#ffffff" fillOpacity="0.2"/>
              {[0,1,2,3].map(r => (
                <g key={r}>
                  <rect x="36" y={96 + r * 50} width="188" height="36" rx="6" fill="#ffffff" fillOpacity={0.06 - r * 0.01}/>
                  <circle cx="52" cy={114 + r * 50} r="6" fill={r === 0 ? PRODUCT_COLOR : r === 1 ? '#E8C97A' : '#6ABFB8'} fillOpacity="0.8"/>
                  <rect x="64" y={107 + r * 50} width={100 - r * 10} height="8" rx="3" fill="#ffffff" fillOpacity="0.2"/>
                  <rect x="64" y={120 + r * 50} width={70 - r * 8} height="6" rx="3" fill="#ffffff" fillOpacity="0.1"/>
                </g>
              ))}
              {/* right panel: tasks */}
              <rect x="252" y="58" width="228" height="262" rx="8" fill="#ffffff" fillOpacity="0.04"/>
              <rect x="268" y="74" width="100" height="10" rx="3" fill="#ffffff" fillOpacity="0.2"/>
              {[0,1,2,3,4].map(r => (
                <g key={r}>
                  <rect x="268" y={96 + r * 40} width="196" height="28" rx="5" fill="#ffffff" fillOpacity={0.05 - r * 0.005}/>
                  <rect x="280" y={104 + r * 40} width={120 - r * 10} height="8" rx="3" fill="#ffffff" fillOpacity="0.18"/>
                  <rect x="420" y={104 + r * 40} width="32" height="8" rx="3" fill={r % 2 === 0 ? PRODUCT_COLOR : '#6ABFB8'} fillOpacity="0.5"/>
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
              omniCRISIS ile Neler Yapabilirsiniz?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="crisis-feat-card">
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
              <span key={s} className="crisis-sector-pill">{s}</span>
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
              <div key={s.code} className="crisis-std-card">
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
            omniCRISIS Arayüzü
          </h2>
          <svg width="100%" viewBox="0 0 900 400" style={{ maxWidth: 900, borderRadius: 12 }}>
            <rect width="900" height="400" rx="12" fill="#0D1E36"/>
            <rect x="0" y="0" width="900" height="50" fill="#ffffff" fillOpacity="0.05"/>
            <rect x="20" y="17" width="100" height="16" rx="4" fill="#ffffff" fillOpacity="0.2"/>
            <rect x="140" y="17" width="70" height="16" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            {/* live indicator */}
            <circle cx="820" cy="25" r="6" fill={PRODUCT_COLOR} fillOpacity="0.9"/>
            <rect x="832" y="18" width="50" height="14" rx="4" fill={PRODUCT_COLOR} fillOpacity="0.25"/>
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
            <text x="300" y="108" fill={PRODUCT_COLOR} fontSize="22" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">3 Aktif</text>
            <text x="516" y="108" fill="#E8C97A" fontSize="22" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">12 Görev</text>
            <text x="756" y="108" fill="#6ABFB8" fontSize="22" fontWeight="700" fontFamily="DM Sans,sans-serif" textAnchor="middle">48 Personel</text>
            {/* event timeline */}
            <rect x="200" y="164" width="430" height="220" rx="8" fill="#ffffff" fillOpacity="0.03"/>
            <line x1="236" y1="180" x2="236" y2="370" stroke={PRODUCT_COLOR} strokeOpacity="0.3" strokeWidth="2" strokeDasharray="4 4"/>
            {[0,1,2,3,4].map(r => (
              <g key={r}>
                <circle cx="236" cy={195 + r * 38} r="5" fill={r === 0 ? PRODUCT_COLOR : r === 1 ? '#E8C97A' : '#6ABFB8'} fillOpacity={0.9 - r * 0.1}/>
                <rect x="252" y={187 + r * 38} width={160 + (r % 3) * 20} height="10" rx="3" fill="#ffffff" fillOpacity={0.2 - r * 0.02}/>
                <rect x="252" y={203 + r * 38} width="80" height="8" rx="3" fill="#ffffff" fillOpacity="0.1"/>
              </g>
            ))}
            {/* task panel */}
            <rect x="648" y="164" width="232" height="220" rx="8" fill="#ffffff" fillOpacity="0.03"/>
            <rect x="664" y="180" width="100" height="10" rx="3" fill="#ffffff" fillOpacity="0.2"/>
            {[0,1,2,3,4].map(r => (
              <g key={r}>
                <rect x="664" y={202 + r * 34} width="200" height="24" rx="5" fill="#ffffff" fillOpacity={0.05 - r * 0.005}/>
                <rect x="676" y={210 + r * 34} width={100 - r * 8} height="8" rx="3" fill="#ffffff" fillOpacity="0.18"/>
                <rect x="836" y={210 + r * 34} width="20" height="8" rx="3" fill={r % 2 === 0 ? PRODUCT_COLOR : '#6ABFB8'} fillOpacity="0.5"/>
              </g>
            ))}
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
              omniCRISIS&apos;i kurum ortamınızda deneyin. Uzmanımız 24 saat içinde sizi arar.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                placeholder="Ad Soyad"
                value={adSoyad}
                onChange={e => setAdSoyad(e.target.value)}
                required
                className="crisis-input"
              />
              <input
                type="text"
                placeholder="Kurum"
                value={kurum}
                onChange={e => setKurum(e.target.value)}
                required
                className="crisis-input"
              />
              <input
                type="email"
                placeholder="E-posta"
                value={eposta}
                onChange={e => setEposta(e.target.value)}
                required
                className="crisis-input"
              />
              <textarea
                placeholder="Mesaj"
                value={mesaj}
                onChange={e => setMesaj(e.target.value)}
                rows={4}
                className="crisis-input"
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
