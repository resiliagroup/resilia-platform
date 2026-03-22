'use client'

import { useEffect, useRef } from 'react'
import { Outfit, DM_Mono } from 'next/font/google'

const outfit = Outfit({ subsets: ['latin'], weight: ['300','400','500','600','700','800','900'] })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['300','400','500'], variable: '--font-mono' })

/* ─── DATA ──────────────────────────────────────────────── */
const KPI = [
  { val: '22.846',    lbl: 'Toplam Tesis',      sub: 'İSO kayıtlı',      color: '#2D8A87' },
  { val: '18.712',    lbl: 'Koordinatlı Tesis', sub: '%81.9 kapsama',    color: '#3B82F6' },
  { val: '1.053.058', lbl: 'Toplam Çalışan',    sub: 'Kayıtlı istihdam', color: '#8B5CF6' },
  { val: '193',       lbl: 'Yüksek Riskli',     sub: 'URI ≥ 60 tesis',   color: '#EF4444' },
]

const RISK = [
  { label: 'HIGH',   pct: 0.8,  count: 193,   color: '#EF4444' },
  { label: 'MEDIUM', pct: 16.0, count: 3652,  color: '#F97316' },
  { label: 'LOW',    pct: 83.2, count: 19001, color: '#22C55E' },
]

const SEKTORLER = [
  { ad: 'İlaç ve Eczacılık',  tesis: 142,  uri: 41.9, badge: 'YÜKSEK', bc: '#EF4444' },
  { ad: 'Kimya',              tesis: 835,  uri: 40.1, badge: 'YÜKSEK', bc: '#EF4444' },
  { ad: 'Temel Metal',        tesis: 544,  uri: 39.1, badge: 'YÜKSEK', bc: '#F97316' },
  { ad: 'Motorlu Araç',       tesis: 579,  uri: 33.3, badge: 'ORTA',   bc: '#F97316' },
  { ad: 'Makine ve Ekipman',  tesis: 1749, uri: 30.9, badge: 'ORTA',   bc: '#EAB308' },
  { ad: 'Elektrikli Ekipman', tesis: 1098, uri: 27.8, badge: 'ORTA',   bc: '#EAB308' },
  { ad: 'Metal Ürünleri',     tesis: 2211, uri: 27.0, badge: 'DÜŞÜK',  bc: '#84CC16' },
  { ad: 'Tekstil',            tesis: 1880, uri: 24.0, badge: 'DÜŞÜK',  bc: '#84CC16' },
  { ad: 'Plastik ve Kauçuk',  tesis: 1294, uri: 23.2, badge: 'DÜŞÜK',  bc: '#22C55E' },
  { ad: 'Gıda ve İçecek',     tesis: 1565, uri: 21.0, badge: 'DÜŞÜK',  bc: '#22C55E' },
]

const IS_MODELI = [
  {
    bc: '#2D8A87', icon: '🖥️', baslik: 'Platform SaaS',
    desc: 'Yıllık abonelik bazlı dashboard erişimi. Tesis başına veya kurumsal lisans.',
    detaylar: ['İSO üyelerine ölçekli fiyat', 'Kullanıcı başına ya da tesis paketi', 'API erişimi ek modül'],
    hedef: '₺130M · Y5',
  },
  {
    bc: '#3B82F6', icon: '📊', baslik: 'Danışmanlık Hizmetleri',
    desc: 'Proje bazlı risk analizi, BCP geliştirme ve ISO 22301 uyum danışmanlığı.',
    detaylar: ['Tesis bazlı URI doğrulama', 'BCP hazırlama paketi', 'Sektör bazlı raporlama'],
    hedef: '₺60M · Y5',
  },
  {
    bc: '#8B5CF6', icon: '🔬', baslik: 'Test & Saha Doğrulama',
    desc: 'Fiziksel saha ziyaretleri, tatbikat koordinasyonu ve gerçek zamanlı ölçüm.',
    detaylar: ['193 kritik tesis öncelikli', 'Tatbikat senaryo tasarımı', 'Saha doğrulama raporu'],
    hedef: '₺55M · Y5',
  },
  {
    bc: '#F97316', icon: '🌐', baslik: 'Kurumsal + Uluslararası',
    desc: 'Büyük ölçekli kurumsal lisanslar ve Türkiye modeli ihracatı.',
    detaylar: ['AFAD / Bakanlık entegrasyonu', 'MENA bölgesi genişleme', 'Sigorta sektörü verisi'],
    hedef: '₺35M · Y5',
  },
]

const PROJ_YILLAR = ['Yıl 1', 'Yıl 2', 'Yıl 3', 'Yıl 4', 'Yıl 5']
const PROJ_DATA = [
  { label: 'Platform SaaS',          color: '#2D8A87', data: [1.5, 10, 28, 65, 130] },
  { label: 'Danışmanlık',            color: '#3B82F6', data: [0.5,  5, 14, 30,  60] },
  { label: 'Test & Saha',            color: '#8B5CF6', data: [1.0,  7, 16, 30,  55] },
  { label: 'Kurumsal+Uluslararası',  color: '#F97316', data: [0.0,  3, 10, 23,  35] },
]
const PROJ_TOPLAM = [3, 25, 68, 148, 280]

const VERI_KALITE = [
  { lbl: 'İSO kayıt no',       pct: 100,  durum: 'ok'   },
  { lbl: 'Sektör kodu (NACE)', pct: 100,  durum: 'ok'   },
  { lbl: 'Koordinat verisi',   pct: 81.9, durum: 'warn' },
  { lbl: 'Çalışan sayısı',     pct: 76.2, durum: 'warn' },
  { lbl: 'Yapı yaşı / türü',   pct: 0,    durum: 'err'  },
  { lbl: 'BCP planı varlığı',  pct: 0,    durum: 'err'  },
  { lbl: 'Tehlikeli madde',    pct: 8.1,  durum: 'err'  },
  { lbl: 'Kritik altyapı',     pct: 0,    durum: 'err'  },
]

const FAZLAR = [
  {
    faz: 'FAZ 1', sure: '0 – 3 Ay', baslik: 'Hızlı Tarama',
    bedel: 'ÜCRETSİZ', bedel_color: '#2D8A87', aktif: true,
    border: '#2D8A87',
    items: ['22.846 tesisin tamamı URI hesaplama','Risk haritası yayımı (herkese açık)','İSO üyelerine dashboard erişimi','Kritik 193 tesise öncelikli bildirim'],
  },
  {
    faz: 'FAZ 2', sure: '3 – 9 Ay', baslik: 'Derinlemesine Analiz',
    bedel: 'Hibe / Kamu', bedel_color: '#3B82F6', aktif: false,
    border: 'rgba(255,255,255,0.08)',
    items: ['Kimya + metal sektörü detay formu','Saha doğrulama (193 kritik tesis)','BCP mevcut durum tespiti','NATECH senaryo modelleme'],
  },
  {
    faz: 'FAZ 3', sure: '9 – 24 Ay', baslik: 'Sürekli İzleme',
    bedel: 'Platform Aboneliği', bedel_color: '#8B5CF6', aktif: false,
    border: 'rgba(255,255,255,0.08)',
    items: ['Canlı URI güncelleme (tatbikat bazlı)','AFAD / Valilik entegrasyonu','Sigorta sektörü veri paylaşımı','ISO 22301 uyum takibi'],
  },
]

/* ─── SVG DONUT ─────────────────────────────────────────── */
function Donut() {
  const r = 54, stroke = 14, cx = 72, cy = 72
  const circ = 2 * Math.PI * r
  let acc = 0
  const slices = RISK.map(d => {
    const len = (d.pct / 100) * circ
    const dashoffset = circ - acc
    acc += len
    return { ...d, len, dashoffset }
  })
  return (
    <svg width={144} height={144} viewBox="0 0 144 144">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      {slices.map(s => (
        <circle key={s.label} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth={stroke}
          strokeDasharray={`${s.len} ${circ - s.len}`}
          strokeDashoffset={s.dashoffset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#fff"
        fontSize={24} fontWeight={800} fontFamily="Outfit,sans-serif">193</text>
      <text x={cx} y={cx + 8} textAnchor="middle" fill="#EF4444"
        fontSize={10} fontWeight={700} letterSpacing={1} fontFamily="Outfit,sans-serif">YÜKSEK</text>
      <text x={cx} y={cx + 22} textAnchor="middle" fill="rgba(255,255,255,0.3)"
        fontSize={9} fontFamily="Outfit,sans-serif">RİSK</text>
    </svg>
  )
}

/* ─── URI BAR ────────────────────────────────────────────── */
function UriBar({ uri }: { uri: number }) {
  const pct = (uri / 50) * 100
  const c = uri >= 40 ? '#EF4444' : uri >= 30 ? '#F97316' : uri >= 25 ? '#EAB308' : '#22C55E'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: c, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: c, minWidth: 34, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{uri}</span>
    </div>
  )
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function IsoBrifingV3() {
  const sectorCanvasRef = useRef<HTMLCanvasElement>(null)
  const projCanvasRef   = useRef<HTMLCanvasElement>(null)
  const sectorChart     = useRef<unknown>(null)
  const projChart       = useRef<unknown>(null)

  useEffect(() => {
    const buildCharts = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const C = (window as any).Chart
      if (!C || !sectorCanvasRef.current || !projCanvasRef.current) return

      const gridColor = 'rgba(255,255,255,0.05)'
      const tickColor = 'rgba(255,255,255,0.3)'
      const baseFont  = { family: 'Outfit, sans-serif', size: 11 }

      /* Sector bar chart */
      if (sectorChart.current) (sectorChart.current as { destroy(): void }).destroy()
      sectorChart.current = new C(sectorCanvasRef.current, {
        type: 'bar',
        data: {
          labels: SEKTORLER.map(s => s.ad.length > 14 ? s.ad.slice(0, 13) + '…' : s.ad),
          datasets: [{
            label: 'URI Skoru',
            data: SEKTORLER.map(s => s.uri),
            backgroundColor: SEKTORLER.map(s =>
              s.uri >= 40 ? '#EF444455' : s.uri >= 30 ? '#F9731655' : s.uri >= 25 ? '#EAB30855' : '#22C55E55'),
            borderColor: SEKTORLER.map(s =>
              s.uri >= 40 ? '#EF4444' : s.uri >= 30 ? '#F97316' : s.uri >= 25 ? '#EAB308' : '#22C55E'),
            borderWidth: 1,
            borderRadius: 5,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0D1B2E',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              titleColor: '#fff',
              bodyColor: 'rgba(255,255,255,0.5)',
              callbacks: { label: (ctx: { raw: number }) => ` URI: ${ctx.raw}` },
            },
          },
          scales: {
            x: { ticks: { color: tickColor, font: baseFont }, grid: { color: gridColor } },
            y: { min: 0, max: 55, ticks: { color: tickColor, font: baseFont, stepSize: 10 }, grid: { color: gridColor } },
          },
        },
      })

      /* Projection stacked bar chart */
      if (projChart.current) (projChart.current as { destroy(): void }).destroy()
      projChart.current = new C(projCanvasRef.current, {
        type: 'bar',
        data: {
          labels: PROJ_YILLAR,
          datasets: PROJ_DATA.map(d => ({
            label: d.label,
            data: d.data,
            backgroundColor: d.color + '99',
            borderColor: d.color,
            borderWidth: 1,
            borderRadius: 4,
          })),
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: 'rgba(255,255,255,0.5)', font: baseFont, boxWidth: 12, boxHeight: 12 } },
            tooltip: {
              backgroundColor: '#0D1B2E',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              titleColor: '#fff',
              bodyColor: 'rgba(255,255,255,0.6)',
              callbacks: { label: (ctx: { dataset: { label: string }; raw: number }) => ` ${ctx.dataset.label}: ₺${ctx.raw}M` },
            },
          },
          scales: {
            x: { stacked: true, ticks: { color: tickColor, font: baseFont }, grid: { color: gridColor } },
            y: { stacked: true, ticks: { color: tickColor, font: baseFont, callback: (v: number) => `₺${v}M` }, grid: { color: gridColor } },
          },
        },
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Chart) {
      buildCharts()
    } else {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
      s.async = true
      s.onload = buildCharts
      document.head.appendChild(s)
    }
    return () => {
      if (sectorChart.current) (sectorChart.current as { destroy(): void }).destroy()
      if (projChart.current)   (projChart.current as { destroy(): void }).destroy()
    }
  }, [])

  const glass = {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
  } as const

  return (
    <div className={`${outfit.className} ${dmMono.variable}`}
      style={{ background: '#0D1B2E', minHeight: '100vh', color: '#fff' }}>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #0D1B2E; }
        .v3-wrap  { max-width: 1100px; margin: 0 auto; padding: 0 28px 96px; }
        .v3-g4    { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
        .v3-g2    { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .v3-g3    { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .v3-g2x4  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .v3-hr    { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 60px 0; }
        .v3-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.3);
                    letter-spacing: .18em; text-transform: uppercase; margin-bottom: 20px; }
        @media (max-width: 900px) {
          .v3-g4 { grid-template-columns: repeat(2,1fr); }
          .v3-g3 { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .v3-wrap { padding: 0 16px 64px; }
          .v3-g4   { grid-template-columns: repeat(2,1fr); }
          .v3-g2   { grid-template-columns: 1fr; }
          .v3-g3   { grid-template-columns: 1fr; }
          .v3-g2x4 { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ══ 1. HERO + KPI ══════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(150deg, #0B2A28 0%, #0D1B2E 45%, #0F1540 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '72px 28px 0',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decoration */}
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, #2D8A8710 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '35%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #3B82F608 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          {/* top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(45,138,135,0.15)', border: '1px solid rgba(45,138,135,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏭</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2D8A87', letterSpacing: '.14em', textTransform: 'uppercase' }}>OMNIVERSEL × İSTANBUL SANAYİ ODASI</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Sanayi Tesisleri Risk Brifing · Mart 2026</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['GİZLİ', 'v3.0'].map(t => (
                <span key={t} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: '#2D8A87', background: 'rgba(45,138,135,0.1)', border: '1px solid rgba(45,138,135,0.25)', borderRadius: 20, padding: '3px 11px' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* headline */}
          <div style={{ maxWidth: 660, marginBottom: 56 }}>
            <h1 style={{ fontSize: 'clamp(38px,6vw,68px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-2.5px', marginBottom: 24 }}>
              Veri var.<br />
              <span style={{ color: '#2D8A87' }}>İçgörü yok.</span>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              İstanbul&apos;un <strong style={{ color: '#fff' }}>22.846</strong> sanayi tesisi kayıt altında. Afet direnci, iş sürekliliği ve kritik altyapı bağımlılıkları sistematik olarak ölçülmemiştir.
            </p>
          </div>

          {/* KPI grid — overlapping hero bottom */}
          <div className="v3-g4" style={{ paddingBottom: 0, marginBottom: '-1px' }}>
            {KPI.map(k => (
              <div key={k.lbl} style={{ ...glass, padding: '22px 18px', position: 'relative', overflow: 'hidden', borderBottom: `3px solid ${k.color}` }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderRadius: '0 0 0 60px', background: k.color + '0C' }} />
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 10 }}>{k.lbl}</div>
                <div style={{ fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 800, color: k.color, letterSpacing: '-0.8px', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>{k.val}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="v3-wrap" style={{ paddingTop: 60 }}>

        {/* ══ 2. RİSK DAĞILIMI ═══════════════════════════════════ */}
        <div className="v3-label">URI Risk Dağılımı — 22.846 Tesis</div>
        <div className="v3-g2">
          <div style={{ ...glass, padding: '28px 24px' }}>
            {RISK.map(d => (
              <div key={d.label} style={{ marginBottom: 26 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: d.color, letterSpacing: '.08em' }}>{d.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>{d.count.toLocaleString('tr-TR')}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>tesis</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: d.color, fontFamily: 'var(--font-mono)' }}>%{d.pct}</span>
                  </div>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${d.pct}%`, minWidth: d.pct < 2 ? 14 : 0, height: '100%', background: d.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14, marginTop: 4 }}>
              Metodoloji: FEMA HMA + NATECH katsayısı
            </div>
          </div>
          <div style={{ ...glass, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <Donut />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              {RISK.map(d => (
                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{d.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: d.color, fontFamily: 'var(--font-mono)' }}>%{d.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="v3-hr" />

        {/* ══ 3. SECTOR CHART ════════════════════════════════════ */}
        <div className="v3-label">Sektörel URI Karşılaştırması</div>
        <div style={{ ...glass, padding: '28px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>10 Sektör · Ortalama URI Skoru</div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {[{ c: '#EF4444', l: '≥40 Yüksek' }, { c: '#F97316', l: '30–40 Orta' }, { c: '#22C55E', l: '<25 Düşük' }].map(x => (
                <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{x.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', height: 260 }}>
            <canvas id="sectorChart" ref={sectorCanvasRef} />
          </div>
        </div>

        <hr className="v3-hr" />

        {/* ══ 4. SEKTÖR TABLOSU ══════════════════════════════════ */}
        <div className="v3-label">Sektörel Analiz — Risk Sıralaması</div>
        <div style={{ ...glass, padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto auto auto', gap: '0 16px', padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
            <span>#</span><span>Sektör</span><span style={{ justifySelf: 'end' }}>URI</span><span style={{ justifySelf: 'end' }}>Tesis</span><span style={{ justifySelf: 'end' }}>Risk</span>
          </div>
          {SEKTORLER.map((s, i) => (
            <div key={s.ad} style={{
              display: 'grid', gridTemplateColumns: '36px 1fr auto auto auto',
              alignItems: 'center', gap: '0 16px', padding: '13px 20px',
              borderBottom: i < SEKTORLER.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{i + 1}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{s.ad}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: s.bc, fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{s.uri}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{s.tesis.toLocaleString('tr-TR')}</span>
              <span style={{ fontSize: 9, fontWeight: 800, color: s.bc, background: s.bc + '18', border: `1px solid ${s.bc}44`, borderRadius: 20, padding: '2px 9px', letterSpacing: '.08em', textAlign: 'center', whiteSpace: 'nowrap' }}>{s.badge}</span>
            </div>
          ))}
        </div>

        <hr className="v3-hr" />

        {/* ══ 5. KİMYA UYARI ═════════════════════════════════════ */}
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderLeft: '4px solid #EF4444', borderRadius: 14, padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>⚠️</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#EF4444', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Kritik Bulgu — Kimya Sektörü</div>
            <p style={{ fontSize: 14, color: 'rgba(255,200,200,0.8)', lineHeight: 1.75 }}>
              835 kimya tesisinin <strong style={{ color: '#fff' }}>95&apos;i (%11.4)</strong> URI eşiğinin üzerinde.{' '}
              Bu tesislerin <strong style={{ color: '#fff' }}>%78&apos;inin aktif BCP planı bulunmuyor.</strong>{' '}
              NATECH senaryosunda deprem + kimyasal yayılım + yangın üst üste geldiğinde etkilenen nüfus tahmini: <strong style={{ color: '#EF4444' }}>240.000+</strong>
            </p>
          </div>
        </div>

        <hr className="v3-hr" />

        {/* ══ 6. İŞ MODELİ ═══════════════════════════════════════ */}
        <div className="v3-label">İş Modeli — 4 Gelir Akışı</div>
        <div className="v3-g2">
          {IS_MODELI.map(m => (
            <div key={m.baslik} style={{ ...glass, padding: '22px 20px', borderLeft: `3px solid ${m.bc}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{m.baslik}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: m.bc, fontFamily: 'var(--font-mono)', background: m.bc + '18', border: `1px solid ${m.bc}40`, borderRadius: 6, padding: '2px 8px', whiteSpace: 'nowrap' }}>{m.hedef}</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: 14 }}>{m.desc}</p>
              {m.detaylar.map(d => (
                <div key={d} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: m.bc, flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{d}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <hr className="v3-hr" />

        {/* ══ 7. 5 YIL PROJEKSİYON ══════════════════════════════ */}
        <div className="v3-label">5 Yıl Gelir Projeksiyonu (₺M)</div>
        <div className="v3-g2">
          <div style={{ ...glass, padding: '28px 24px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Stacked Gelir Dağılımı</div>
            <div style={{ position: 'relative', height: 240 }}>
              <canvas id="projChart" ref={projCanvasRef} />
            </div>
          </div>
          <div style={{ ...glass, padding: '28px 24px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Yıllık Büyüme Tablosu</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Yıl', 'Toplam', 'Büyüme', 'Öncü Kanal'].map(h => (
                    <th key={h} style={{ padding: '8px 0', textAlign: h === 'Yıl' ? 'left' : 'right', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROJ_YILLAR.map((y, i) => {
                  const prev = i === 0 ? null : PROJ_TOPLAM[i - 1]
                  const growth = prev ? Math.round(((PROJ_TOPLAM[i] - prev) / prev) * 100) : null
                  const maxIdx = PROJ_DATA.reduce((best, d, di) => d.data[i] > PROJ_DATA[best].data[i] ? di : best, 0)
                  return (
                    <tr key={y} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 0', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{y}</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 800, color: '#2D8A87', fontFamily: 'var(--font-mono)' }}>₺{PROJ_TOPLAM[i]}M</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: growth ? '#22C55E' : 'rgba(255,255,255,0.3)' }}>
                        {growth ? `+%${growth}` : '—'}
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right', color: PROJ_DATA[maxIdx].color, fontSize: 11 }}>{PROJ_DATA[maxIdx].label.split('+')[0].trim()}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '10px 0', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>5Y Toplam</td>
                  <td colSpan={3} style={{ padding: '10px 0', textAlign: 'right', fontSize: 14, fontWeight: 900, color: '#2D8A87', fontFamily: 'var(--font-mono)' }}>₺{PROJ_TOPLAM.reduce((a, b) => a + b, 0)}M</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <hr className="v3-hr" />

        {/* ══ 8. VERİ KALİTESİ ═══════════════════════════════════ */}
        <div className="v3-label">Veri Kalitesi Değerlendirmesi</div>
        <div className="v3-g2x4">
          {VERI_KALITE.map(v => {
            const c = v.durum === 'ok' ? '#22C55E' : v.durum === 'warn' ? '#EAB308' : '#EF4444'
            const icon = v.durum === 'ok' ? '✓' : v.durum === 'warn' ? '~' : '✗'
            return (
              <div key={v.lbl} style={{ ...glass, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: c + '18', border: `1px solid ${c}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: c, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>{icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.lbl}</div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${v.pct}%`, minWidth: v.pct > 0 ? 4 : 0, height: '100%', background: c, borderRadius: 2 }} />
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                  {v.pct === 0 ? 'YOK' : `%${v.pct}`}
                </div>
              </div>
            )
          })}
        </div>

        <hr className="v3-hr" />

        {/* ══ 9. 3 FAZLI PROGRAM ═════════════════════════════════ */}
        <div className="v3-label">Önerilen Program — 3 Faz</div>
        <div className="v3-g3">
          {FAZLAR.map((f) => (
            <div key={f.faz} style={{
              ...glass,
              padding: '24px 20px',
              border: `1px solid ${f.aktif ? f.border : 'rgba(255,255,255,0.08)'}`,
              borderTop: `3px solid ${f.border}`,
              position: 'relative',
              background: f.aktif ? 'rgba(45,138,135,0.06)' : 'rgba(255,255,255,0.03)',
            }}>
              {f.aktif && (
                <div style={{ position: 'absolute', top: -1, right: 16, background: '#2D8A87', color: '#fff', fontSize: 8, fontWeight: 900, letterSpacing: '.12em', padding: '3px 12px', borderRadius: '0 0 8px 8px' }}>
                  BAŞLANGIÇ NOKTASI
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: f.aktif ? '#2D8A87' : 'rgba(255,255,255,0.25)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 5 }}>{f.faz} · {f.sure}</div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{f.baslik}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: f.bedel_color, background: f.bedel_color + '18', border: `1px solid ${f.bedel_color}44`, borderRadius: 20, padding: '3px 11px', letterSpacing: '.08em', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                  {f.bedel}
                </span>
              </div>
              {f.items.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 9 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: f.bedel_color, flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <hr className="v3-hr" />

        {/* ══ 10. CTA + FOOTER ═══════════════════════════════════ */}
        <div style={{ background: 'linear-gradient(135deg, rgba(45,138,135,0.12) 0%, rgba(13,27,46,0.8) 100%)', border: '1px solid rgba(45,138,135,0.2)', borderRadius: 20, padding: '60px 40px', textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#2D8A87', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 16 }}>Bir Sonraki Adım</div>
          <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 18, lineHeight: 1.15 }}>
            Faz 1 başlatmak için<br />
            <span style={{ color: '#2D8A87' }}>ortak olmaya hazır mısınız?</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 40, lineHeight: 1.75, maxWidth: 500, margin: '0 auto 40px' }}>
            22.846 tesisin tamamı için otomatik URI hesaplama ve risk haritası — 90 gün içinde, <strong style={{ color: '#2D8A87' }}>ücretsiz</strong>.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:info@omniversel.com" style={{ textDecoration: 'none', background: '#2D8A87', color: '#fff', fontWeight: 700, fontSize: 14, padding: '14px 36px', borderRadius: 10, display: 'inline-block' }}>
              İletişime Geç →
            </a>
            <a href="/hub" style={{ textDecoration: 'none', background: 'transparent', color: '#2D8A87', fontWeight: 700, fontSize: 14, padding: '14px 36px', borderRadius: 10, border: '1px solid #2D8A87', display: 'inline-block' }}>
              ← Hub&apos;a Dön
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-.2px', marginBottom: 2 }}>OMNIVERSEL</div>
            <div style={{ fontSize: 11, color: '#2D8A87' }}>Urban Resilience Platform</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.15)', lineHeight: 1.7 }}>
            <div>© 2026 Omniversel · omniversel.com</div>
            <div>Bu belge gizlidir. İzinsiz dağıtılamaz.</div>
          </div>
        </div>

      </div>
    </div>
  )
}
