'use client'
import { useState, useEffect, useRef } from 'react'

// ── Renk Paleti ─────────────────────────────────────────────────────────────
const NAVY   = '#0A1628'
const TEAL   = '#009B8D'
const TEAL2  = '#00C9B1'
const AMBER  = '#D97706'
const RED    = '#DC2626'
const GREEN  = '#16A34A'
const WARM   = '#F8F6F3'
const AK_BLUE = '#003087'  // Akbank lacivert
const IB_RED  = '#C8102E'  // İş Bankası kırmızı

// ── Demo Veri: 200 Akbank + 200 İş Bankası şubesi ───────────────────────────
const BANKA_DATA = {
  akbank: {
    id: 'akbank',
    ad: 'Akbank A.Ş.',
    renk: AK_BLUE,
    renk2: '#0052CC',
    toplam: 200,
    ort_skor: 55.6,
    kritik: 35,
    orta: 109,
    guclu: 56,
    bia: {
      gunluk_gelir: 3.2,   // M TL
      rto_kritik: 4,        // saat
      rpo: 1,               // saat
      eal_yillik: 14.8,     // M TL
      kesinti_maliyet_gun: 3.2,
    },
    il_dagilim: [
      { il: 'İstanbul', sube: 44, ort: 48, dep: 1, lat: 41.015, lng: 28.979 },
      { il: 'Ankara',   sube: 17, ort: 62, dep: 2, lat: 39.920, lng: 32.854 },
      { il: 'İzmir',    sube: 12, ort: 49, dep: 1, lat: 38.418, lng: 27.129 },
      { il: 'Bursa',    sube: 10, ort: 51, dep: 1, lat: 40.193, lng: 29.061 },
      { il: 'Kocaeli',  sube:  9, ort: 44, dep: 1, lat: 40.765, lng: 29.941 },
      { il: 'Antalya',  sube:  7, ort: 64, dep: 2, lat: 36.897, lng: 30.713 },
      { il: 'Adana',    sube:  7, ort: 50, dep: 1, lat: 37.002, lng: 35.329 },
      { il: 'Gaziantep',sube:  7, ort: 52, dep: 1, lat: 37.067, lng: 37.384 },
      { il: 'Hatay',    sube:  5, ort: 31, dep: 1, lat: 36.202, lng: 36.160 },
      { il: 'Mersin',   sube:  6, ort: 49, dep: 1, lat: 36.801, lng: 34.641 },
      { il: 'Şanlıurfa',sube:  5, ort: 51, dep: 2, lat: 37.168, lng: 38.795 },
      { il: 'Konya',    sube:  8, ort: 60, dep: 3, lat: 37.874, lng: 32.493 },
      { il: 'Kayseri',  sube:  5, ort: 58, dep: 3, lat: 38.732, lng: 35.487 },
      { il: 'Trabzon',  sube:  4, ort: 62, dep: 3, lat: 41.005, lng: 39.722 },
      { il: 'Samsun',   sube:  5, ort: 57, dep: 2, lat: 41.286, lng: 36.330 },
      { il: 'Erzurum',  sube:  3, ort: 38, dep: 1, lat: 39.905, lng: 41.268 },
      { il: 'K.maraş',  sube:  4, ort: 29, dep: 1, lat: 37.585, lng: 36.937 },
      { il: 'Diğer (13 il)', sube: 43, ort: 57, dep: 2, lat: 39.0, lng: 35.0 },
    ],
    en_kritik: [
      { kod: '3401', ad: 'Akbank İstanbul Fatih Karma Şubesi', il: 'İstanbul', skor: 19, dep: 1 },
      { kod: '4601', ad: 'Akbank K.maraş Şehitkamil Bireysel Şubesi', il: 'K.maraş', skor: 22, dep: 1 },
      { kod: '3101', ad: 'Akbank Hatay Merkez Ticari Şubesi', il: 'Hatay', skor: 24, dep: 1 },
      { kod: '3402', ad: 'Akbank İstanbul Esenler Bireysel Şubesi', il: 'İstanbul', skor: 26, dep: 1 },
      { kod: '4102', ad: 'Akbank Kocaeli Gebze Kurumsal Şubesi', il: 'Kocaeli', skor: 27, dep: 1 },
      { kod: '3403', ad: 'Akbank İstanbul Bağcılar Expres Şubesi', il: 'İstanbul', skor: 28, dep: 1 },
      { kod: '2501', ad: 'Akbank Erzurum Merkez Bireysel Şubesi', il: 'Erzurum', skor: 29, dep: 1 },
    ],
    senaryo_eal: [
      { senaryo: 'Deprem', eal: 9.2, etki: 'Kritik — 44 şube risk altında', pct: 62 },
      { senaryo: 'Siber Saldırı', eal: 4.1, etki: 'Yüksek — Core Banking kesintisi', pct: 28 },
      { senaryo: 'Sel', eal: 2.8, etki: 'Orta — 12 kıyı şubesi risk altında', pct: 19 },
      { senaryo: 'Yangın', eal: 1.4, etki: 'Düşük — Sigorta kapsamlı', pct: 9 },
      { senaryo: 'Elektrik Kesintisi', eal: 0.9, etki: 'Düşük — Jeneratör eksikliği var', pct: 6 },
    ],
  },
  isbank: {
    id: 'isbank',
    ad: 'Türkiye İş Bankası A.Ş.',
    renk: IB_RED,
    renk2: '#991820',
    toplam: 200,
    ort_skor: 52.3,
    kritik: 52,
    orta: 111,
    guclu: 37,
    bia: {
      gunluk_gelir: 3.8,
      rto_kritik: 3,
      rpo: 0.5,
      eal_yillik: 17.6,
      kesinti_maliyet_gun: 3.8,
    },
    il_dagilim: [
      { il: 'İstanbul', sube: 44, ort: 46, dep: 1, lat: 41.015, lng: 28.979 },
      { il: 'Ankara',   sube: 17, ort: 59, dep: 2, lat: 39.920, lng: 32.854 },
      { il: 'İzmir',    sube: 12, ort: 47, dep: 1, lat: 38.418, lng: 27.129 },
      { il: 'Bursa',    sube: 10, ort: 49, dep: 1, lat: 40.193, lng: 29.061 },
      { il: 'Kocaeli',  sube:  9, ort: 41, dep: 1, lat: 40.765, lng: 29.941 },
      { il: 'Antalya',  sube:  7, ort: 61, dep: 2, lat: 36.897, lng: 30.713 },
      { il: 'Adana',    sube:  7, ort: 47, dep: 1, lat: 37.002, lng: 35.329 },
      { il: 'Gaziantep',sube:  7, ort: 49, dep: 1, lat: 37.067, lng: 37.384 },
      { il: 'Hatay',    sube:  5, ort: 28, dep: 1, lat: 36.202, lng: 36.160 },
      { il: 'Mersin',   sube:  6, ort: 46, dep: 1, lat: 36.801, lng: 34.641 },
      { il: 'Diyarbakır',sube: 4, ort: 43, dep: 2, lat: 37.914, lng: 40.230 },
      { il: 'Konya',    sube:  8, ort: 58, dep: 3, lat: 37.874, lng: 32.493 },
      { il: 'Kayseri',  sube:  5, ort: 55, dep: 3, lat: 38.732, lng: 35.487 },
      { il: 'Trabzon',  sube:  4, ort: 60, dep: 3, lat: 41.005, lng: 39.722 },
      { il: 'Samsun',   sube:  5, ort: 54, dep: 2, lat: 41.286, lng: 36.330 },
      { il: 'Erzurum',  sube:  3, ort: 35, dep: 1, lat: 39.905, lng: 41.268 },
      { il: 'K.maraş',  sube:  4, ort: 26, dep: 1, lat: 37.585, lng: 36.937 },
      { il: 'Diğer (13 il)', sube: 44, ort: 54, dep: 2, lat: 39.0, lng: 35.5 },
    ],
    en_kritik: [
      { kod: 'IB4601', ad: 'İş Bankası K.maraş Şehitkamil Ticari Şubesi', il: 'K.maraş', skor: 14, dep: 1 },
      { kod: 'IB3101', ad: 'İş Bankası Hatay Antakya Bireysel Şubesi', il: 'Hatay', skor: 17, dep: 1 },
      { kod: 'IB3401', ad: 'İş Bankası İstanbul Esenyurt Karma Şubesi', il: 'İstanbul', skor: 21, dep: 1 },
      { kod: 'IB2501', ad: 'İş Bankası Erzurum Merkez Şubesi', il: 'Erzurum', skor: 23, dep: 1 },
      { kod: 'IB3402', ad: 'İş Bankası İstanbul Gaziosmanpaşa Şubesi', il: 'İstanbul', skor: 25, dep: 1 },
      { kod: 'IB4102', ad: 'İş Bankası Kocaeli Darıca Bireysel Şubesi', il: 'Kocaeli', skor: 26, dep: 1 },
      { kod: 'IB0101', ad: 'İş Bankası Adana Seyhan Kurumsal Şubesi', il: 'Adana', skor: 27, dep: 1 },
    ],
    senaryo_eal: [
      { senaryo: 'Deprem', eal: 11.4, etki: 'Kritik — 52 şube risk altında', pct: 65 },
      { senaryo: 'Siber Saldırı', eal: 3.8, etki: 'Yüksek — DR planı yetersiz', pct: 22 },
      { senaryo: 'Sel', eal: 3.1, etki: 'Orta — Kıyı şubeleri risk altında', pct: 18 },
      { senaryo: 'Yangın', eal: 1.6, etki: 'Düşük', pct: 9 },
      { senaryo: 'Elektrik Kesintisi', eal: 1.1, etki: 'Orta — Jeneratör eksikliği', pct: 6 },
    ],
  },
}

type BankaKey = 'akbank' | 'isbank' | 'karsilastir'

// ── Yardımcı ─────────────────────────────────────────────────────────────────
const skorRenk = (s: number) => s < 40 ? RED : s < 70 ? AMBER : GREEN
const skorEtiket = (s: number) => s < 40 ? 'KRİTİK' : s < 70 ? 'ORTA' : 'GÜÇLÜ'
const fmt = (n: number, d = 1) => n.toFixed(d)

// ── AnimatedNumber ────────────────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = '', prefix = '', decimals = 0 }: any) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const steps = 40; let step = 0
    const iv = setInterval(() => {
      step++; setDisplay(value * step / steps)
      if (step >= steps) { setDisplay(value); clearInterval(iv) }
    }, 16)
    return () => clearInterval(iv)
  }, [value])
  return <>{prefix}{decimals > 0 ? display.toFixed(decimals) : Math.round(display)}{suffix}</>
}

// ── KPI Kartı ────────────────────────────────────────────────────────────────
function KPIKart({ label, value, sub, color, icon, animate = false }: any) {
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ECEAE8', padding: '16px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, bottom: 0, background: color, borderRadius: '16px 0 0 16px' }} />
      <div style={{ paddingLeft: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: NAVY, lineHeight: 1, marginBottom: 4 }}>
          {animate ? <AnimatedNumber value={typeof value === 'number' ? value : 0} /> : value}
        </div>
        {sub && <div style={{ fontSize: 11, color: '#9CA3AF' }}>{sub}</div>}
        <div style={{ position: 'absolute', right: 16, top: 16, fontSize: 22, opacity: .15 }}>{icon}</div>
      </div>
    </div>
  )
}

// ── Mini Bar ─────────────────────────────────────────────────────────────────
function MiniBar({ value, max, color }: any) {
  const pct = Math.min(100, Math.round(value / max * 100))
  return (
    <div style={{ height: 5, background: '#F1F0EF', borderRadius: 99, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width .6s ease' }} />
    </div>
  )
}

// ── Dağılım Bar ──────────────────────────────────────────────────────────────
function DagilimBar({ kritik, orta, guclu, toplam, renk }: any) {
  const kPct = Math.round(kritik / toplam * 100)
  const oPct = Math.round(orta / toplam * 100)
  const gPct = Math.round(guclu / toplam * 100)
  return (
    <div>
      <div style={{ display: 'flex', height: 12, borderRadius: 99, overflow: 'hidden', gap: 1 }}>
        <div style={{ width: `${kPct}%`, background: RED }} />
        <div style={{ width: `${oPct}%`, background: AMBER }} />
        <div style={{ width: `${gPct}%`, background: GREEN }} />
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        {[['KRİTİK', kritik, kPct, RED], ['ORTA', orta, oPct, AMBER], ['GÜÇLÜ', guclu, gPct, GREEN]].map(([l, n, p, c]) => (
          <div key={l as string} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c as string, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#6B7280' }}>{l}: <strong style={{ color: NAVY }}>{n} ({p}%)</strong></span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── İl Tablosu ───────────────────────────────────────────────────────────────
function IlTablosu({ data, renk }: any) {
  const [sort, setSort] = useState<'sube'|'ort'>('sube')
  const sorted = [...data].sort((a, b) => sort === 'sube' ? b.sube - a.sube : a.ort - b.ort)
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {(['sube', 'ort'] as const).map(s => (
          <button key={s} onClick={() => setSort(s)}
            style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              background: sort === s ? renk : '#F1F0EF', color: sort === s ? 'white' : '#6B7280' }}>
            {s === 'sube' ? 'Şube Sayısı ↓' : 'Risk Skor ↑'}
          </button>
        ))}
      </div>
      <div style={{ maxHeight: 340, overflowY: 'auto' }}>
        {sorted.map((il: any, i: number) => (
          <div key={il.il} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F1F0EF' }}>
            <div style={{ width: 22, fontSize: 10, color: '#9CA3AF', textAlign: 'center', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: NAVY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{il.il}</span>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: '#6B7280' }}>{il.sube} şube</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: skorRenk(il.ort) }}>{il.ort}</span>
                  <span style={{ fontSize: 9, padding: '2px 5px', borderRadius: 4, background: skorRenk(il.ort) + '18', color: skorRenk(il.ort), fontWeight: 700 }}>
                    {il.dep === 1 ? '●D1' : il.dep === 2 ? '◐D2' : '○D3'}
                  </span>
                </div>
              </div>
              <MiniBar value={il.ort} max={100} color={skorRenk(il.ort)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Kritik Şubeler ───────────────────────────────────────────────────────────
function KritikSubeListesi({ subeler, renk }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {subeler.map((s: any, i: number) => (
        <div key={s.kod} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: i === 0 ? '#FEF2F2' : '#FFFBF5', borderRadius: 12, border: `1px solid ${i === 0 ? '#FECACA' : '#FDE68A'}` }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: i === 0 ? RED : AMBER, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, flexShrink: 0 }}>
            {s.skor}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.ad}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
              <span style={{ fontSize: 10, color: '#6B7280' }}> {s.il}</span>
              <span style={{ fontSize: 10, color: '#6B7280' }}> Deprem Bölgesi {s.dep}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: RED }}>DERHAL MÜDAHALE</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── BIA Tablosu ──────────────────────────────────────────────────────────────
function BIATablosu({ senaryolar, renk }: any) {
  const maxEal = Math.max(...senaryolar.map((s: any) => s.eal))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {senaryolar.map((s: any) => (
        <div key={s.senaryo} style={{ background: '#F8F6F3', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{s.senaryo}</span>
              <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 8 }}>{s.etki}</span>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: renk }}>₺{s.eal}M</span>
              <div style={{ fontSize: 9, color: '#9CA3AF' }}>EAL/yıl</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ flex: 1, height: 6, background: '#E5E3E1', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${s.pct}%`, background: renk, borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 10, color: '#9CA3AF', width: 28, textAlign: 'right' }}>%{s.pct}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Karşılaştırma View ───────────────────────────────────────────────────────
function KarsilastirView() {
  const ak = BANKA_DATA.akbank; const ib = BANKA_DATA.isbank
  const satirlar = [
    { l: 'Toplam Şube', ak: '200', ib: '200', unit: '' },
    { l: 'Ort. Dayanıklılık Skoru', ak: '55.6', ib: '52.3', unit: '/100', iyiAk: true },
    { l: 'Kritik Şube (<40)', ak: '35', ib: '52', unit: ' şube', iyiAk: true },
    { l: 'Güçlü Şube (≥70)', ak: '56', ib: '37', unit: ' şube', iyiAk: true },
    { l: 'Toplam EAL/Yıl', ak: '₺14.8M', ib: '₺17.6M', unit: '', iyiAk: true },
    { l: 'Günlük Gelir Kaybı Riski', ak: '₺3.2M', ib: '₺3.8M', unit: '/gün', iyiAk: true },
    { l: 'RTO Hedefi (Kritik)', ak: '4 saat', ib: '3 saat', unit: '', iyiAk: false },
    { l: 'RPO Hedefi', ak: '1 saat', ib: '30 dk', unit: '', iyiAk: false },
    { l: '1. Dep. Bölgesi Şube Oranı', ak: '%74', ib: '%74', unit: '', iyiAk: null },
    { l: 'En Düşük Skor (Kritik)', ak: '19', ib: '14', unit: '', iyiAk: true },
    { l: 'Hatay+K.maraş Şube', ak: '9', ib: '9', unit: ' şube', iyiAk: null },
  ]
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[ak, ib].map(b => (
          <div key={b.id} style={{ background: b.renk, borderRadius: 20, padding: '20px 22px', color: 'white' }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: .7, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>{b.id === 'akbank' ? 'Akbank' : 'İş Bankası'}</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{b.ort_skor}</div>
            <div style={{ fontSize: 12, opacity: .8 }}>Ortalama Skor · 200 Şube</div>
            <DagilimBar kritik={b.kritik} orta={b.orta} guclu={b.guclu} toplam={200} renk="white" />
          </div>
        ))}
      </div>
      <div style={{ borderRadius: 16, border: '1px solid #ECEAE8', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', background: NAVY, padding: '10px 16px' }}>
          {['Metrik', 'Akbank', 'İş Bankası'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: '.06em', textAlign: h === 'Metrik' ? 'left' : 'center' }}>{h}</div>
          ))}
        </div>
        {satirlar.map((r, i) => (
          <div key={r.l} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', padding: '10px 16px', background: i % 2 === 0 ? 'white' : '#FAFAFA', borderBottom: '1px solid #F1F0EF' }}>
            <div style={{ fontSize: 12, color: '#374151' }}>{r.l}</div>
            <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'center', color: r.iyiAk === true ? GREEN : r.iyiAk === false ? RED : NAVY }}>{r.ak}{r.unit}</div>
            <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'center', color: r.iyiAk === true ? RED : r.iyiAk === false ? GREEN : NAVY }}>{r.ib}{r.unit}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, background: '#FFF8E7', border: '1px solid #FDE68A', borderRadius: 14, padding: '14px 18px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 6 }}>⚠ Sektörel Değerlendirme</div>
        <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.7, margin: 0 }}>
          Her iki banka da Türkiye'nin deprem riski en yüksek illerinde yoğun şube ağına sahip.
          Akbank, ortalama skorda 3.3 puan önde ancak kritik şube sayısı (35) İş Bankası'na (52) göre daha yönetilebilir.
          Hatay ve Kahramanmaraş'taki toplam 18 şube için <strong>acil BCP güncelleme ve yapısal güçlendirme</strong> önceliklendirilmeli.
          Sektör genelinde EAL toplamı <strong>₺32.4M/yıl</strong>'ı aşmakta olup deprem riski tek başına %63 pay almaktadır.
        </p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ANA BİLEŞEN
// ══════════════════════════════════════════════════════════════════════════════
export default function BoardCokBankaDashboard() {
  const [aktifBanka, setAktifBanka] = useState<BankaKey>('akbank')
  const [aktifSekme, setAktifSekme] = useState<'ozet'|'iller'|'kritik'|'bia'>('ozet')
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const banka = aktifBanka !== 'karsilastir' ? BANKA_DATA[aktifBanka] : null
  const renk = banka?.renk || TEAL

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'DM Sans',sans-serif;background:${WARM}}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:#F1F0EF}
    ::-webkit-scrollbar-thumb{background:#D1CEC9;border-radius:99px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    .fu{animation:fadeUp .35s ease forwards}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    .pulse{animation:pulse 2s infinite}
  `

  return (
    <div style={{ minHeight: '100vh', background: WARM, fontFamily: "'DM Sans',sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: '0 28px', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 20, color: 'white', letterSpacing: '-.01em' }}>
            OMNI
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,.15)' }} />
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Çok Banka Dayanıklılık Dashboard
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: TEAL2 }} className="pulse" />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>400 Şube · Canlı Demo</span>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* ── Banka Seçici ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { key: 'akbank', label: 'Akbank A.Ş.', sub: '200 Şube · Özel', renk: AK_BLUE, icon: '' },
            { key: 'isbank', label: 'İş Bankası A.Ş.', sub: '200 Şube · Özel', renk: IB_RED, icon: '' },
            { key: 'karsilastir', label: 'Karşılaştır', sub: 'Akbank vs İş Bankası', renk: TEAL, icon: '⚖️' },
          ].map(b => {
            const aktif = aktifBanka === b.key
            return (
              <button key={b.key} onClick={() => { setAktifBanka(b.key as BankaKey); setAktifSekme('ozet') }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderRadius: 16,
                  border: `2px solid ${aktif ? b.renk : '#ECEAE8'}`,
                  background: aktif ? b.renk : 'white', cursor: 'pointer',
                  fontFamily: "'DM Sans',sans-serif", transition: 'all .2s', flex: 1, minWidth: 180 }}>
                <span style={{ fontSize: 24 }}>{b.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: aktif ? 'white' : NAVY }}>{b.label}</div>
                  <div style={{ fontSize: 10, color: aktif ? 'rgba(255,255,255,.7)' : '#9CA3AF' }}>{b.sub}</div>
                </div>
                {aktif && <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.6)' }} />}
              </button>
            )
          })}
        </div>

        {/* ── Karşılaştır Modu ─────────────────────────────────────────── */}
        {aktifBanka === 'karsilastir' && (
          <div className="fu">
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 900, color: NAVY, marginBottom: 4 }}>Akbank vs İş Bankası</div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 24 }}>400 şube · Türkiye geneli · HFE-360 metodolojisi</div>
            <KarsilastirView />
          </div>
        )}

        {/* ── Tek Banka Modu ───────────────────────────────────────────── */}
        {banka && (
          <div className="fu">
            {/* Başlık */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color: NAVY, marginBottom: 2 }}>
                  {banka.ad}
                </div>
                <div style={{ fontSize: 13, color: '#9CA3AF' }}>
                  {banka.toplam} şube · Türkiye geneli · HFE-360 değerlendirmesi
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { l: 'Özet', v: 'ozet' }, { l: 'İller', v: 'iller' },
                  { l: 'Kritik Şubeler', v: 'kritik' }, { l: 'BIA', v: 'bia' }
                ].map(s => (
                  <button key={s.v} onClick={() => setAktifSekme(s.v as any)}
                    style={{ fontSize: 12, fontWeight: 600, padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .15s',
                      background: aktifSekme === s.v ? renk : '#F1F0EF',
                      color: aktifSekme === s.v ? 'white' : '#6B7280' }}>
                    {s.l}
                  </button>
                ))}
              </div>
            </div>

            {/* ── ÖZET SEKMESİ ────────────────────────────────────────── */}
            {aktifSekme === 'ozet' && (
              <div>
                {/* Ana KPI grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                  <KPIKart label="Ortalama Dayanıklılık" value={banka.ort_skor} sub="Türkiye geneli" color={renk} icon="" animate={mounted} />
                  <KPIKart label="Kritik Şube" value={banka.kritik} sub="Skor < 40, derhal müdahale" color={RED} icon="" animate={mounted} />
                  <KPIKart label="Orta Riskli" value={banka.orta} sub="Skor 40–69, yakın takip" color={AMBER} icon="" animate={mounted} />
                  <KPIKart label="Güçlü Şube" value={banka.guclu} sub="Skor ≥ 70, model şube" color={GREEN} icon="" animate={mounted} />
                </div>

                {/* Dağılım bar */}
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ECEAE8', padding: '20px 22px', marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
                    Dayanıklılık Dağılımı — {banka.toplam} Şube
                  </div>
                  <DagilimBar kritik={banka.kritik} orta={banka.orta} guclu={banka.guclu} toplam={banka.toplam} renk={renk} />
                </div>

                {/* İkinci satır: BIA özeti + Senaryo */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  {/* BIA */}
                  <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ECEAE8', padding: '20px 22px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 16 }}>
                      İş Etki Analizi (BIA)
                    </div>
                    {[
                      ['Yıllık Beklenen Kayıp (EAL)', `₺${banka.bia.eal_yillik}M`, RED],
                      ['Günlük Gelir Riski', `₺${banka.bia.gunluk_gelir}M/gün`, AMBER],
                      ['RTO Kritik Sistem', `${banka.bia.rto_kritik} saat`, renk],
                      ['RPO Core Banking', `${banka.bia.rpo} saat`, renk],
                    ].map(([l, v, c]) => (
                      <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F1F0EF' }}>
                        <span style={{ fontSize: 12, color: '#6B7280' }}>{l}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: c as string }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  {/* Senaryo özeti */}
                  <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ECEAE8', padding: '20px 22px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 16 }}>
                      Top 3 Kritik Senaryo
                    </div>
                    {banka.senaryo_eal.slice(0, 3).map((s: any) => (
                      <div key={s.senaryo} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{s.senaryo}</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: renk }}>₺{s.eal}M</span>
                        </div>
                        <div style={{ height: 5, background: '#F1F0EF', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${s.pct}%`, background: renk, borderRadius: 99 }} />
                        </div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3 }}>{s.etki}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alarm kutusu */}
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 16, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#991B1B', marginBottom: 6 }}>
                      Öncelikli Aksiyon Gerektiren {banka.kritik} Kritik Şube
                    </div>
                    <p style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.7, margin: 0 }}>
                      Hatay ve Kahramanmaraş şubeleri 6 Şubat 2023 depreminin ardından yapısal hasar riski taşımaktadır.
                      İstanbul şubelerinin %{Math.round(banka.il_dagilim[0].sube / banka.toplam * 100)}'i 1. Derece Deprem Bölgesi'nde konumlanmakta.
                      En düşük skorlu {Math.min(3, banka.kritik)} şube için derhal <strong>acil yapısal değerlendirme ve BCP güncellemesi</strong> yapılmalıdır.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── İLLER SEKMESİ ───────────────────────────────────────── */}
            {aktifSekme === 'iller' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ECEAE8', padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
                    İl Bazlı Risk Tablosu · {banka.il_dagilim.length} İl
                  </div>
                  <IlTablosu data={banka.il_dagilim} renk={renk} />
                </div>
                <div>
                  <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ECEAE8', padding: '20px 22px', marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
                      Deprem Bölgesi Dağılımı
                    </div>
                    {[
                      { bölge: '1. Derece Deprem Bölgesi', sub: 'Çok Yüksek Risk', sayi: Math.round(banka.toplam * 0.74), renk: RED, icon: '' },
                      { bölge: '2. Derece Deprem Bölgesi', sub: 'Yüksek Risk', sayi: Math.round(banka.toplam * 0.15), renk: AMBER, icon: '' },
                      { bölge: '3. Derece Deprem Bölgesi', sub: 'Orta Risk', sayi: Math.round(banka.toplam * 0.11), renk: GREEN, icon: '' },
                    ].map(d => (
                      <div key={d.bölge} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F1F0EF' }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{d.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{d.bölge}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF' }}>{d.sub}</div>
                        </div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 700, color: d.renk }}>{d.sayi}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 16, padding: '16px 20px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1E40AF', marginBottom: 8 }}> Coğrafi Konsantrasyon</div>
                    <p style={{ fontSize: 12, color: '#1E3A8A', lineHeight: 1.7 }}>
                      Şubelerin <strong>%{Math.round(banka.il_dagilim[0].sube/banka.toplam*100)}'i İstanbul</strong>,
                      %{Math.round((banka.il_dagilim[0].sube+banka.il_dagilim[1].sube)/banka.toplam*100)}'i İstanbul+Ankara'da.
                      Bu yoğunlaşma operasyonel sürekliliği etkiler; tek bir büyük afet tüm portföy skorunu 8-12 puan aşağı çekebilir.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── KRİTİK ŞUBELER SEKMESİ ──────────────────────────────── */}
            {aktifSekme === 'kritik' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ECEAE8', padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
                    En Kritik {banka.en_kritik.length} Şube — Derhal Müdahale
                  </div>
                  <KritikSubeListesi subeler={banka.en_kritik} renk={renk} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ECEAE8', padding: '20px 22px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
                      Kritik Şube Analizi
                    </div>
                    {[
                      { l: 'Toplam kritik şube (< 40)', v: banka.kritik, c: RED },
                      { l: 'Deprem Bölgesi 1\'de kritik', v: Math.round(banka.kritik * .85), c: RED },
                      { l: 'Hatay/K.maraş kritik', v: banka.id === 'akbank' ? 4 : 5, c: RED },
                      { l: 'İstanbul kritik şube', v: Math.round(banka.kritik * .35), c: AMBER },
                      { l: 'Acil BCP gereken', v: Math.round(banka.kritik * .60), c: AMBER },
                    ].map(r => (
                      <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F0EF' }}>
                        <span style={{ fontSize: 12, color: '#6B7280' }}>{r.l}</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: r.c }}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 16, padding: '16px 20px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#991B1B', marginBottom: 8 }}> Önerilen Aksiyon Planı</div>
                    {['30 Gün: Hatay + K.maraş şubeleri yapısal ekspertiz', '60 Gün: İstanbul alt %10\'u için acil BCP', '90 Gün: Tüm kritik şubeler için fiziksel müdahale planı', '6 Ay: Jeneratör ve UPS kurulumu (kritik şubeler)', '12 Ay: ISO 22301 sertifika süreci başlatılması'].map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#7F1D1D' }}>
                        <span style={{ color: RED, flexShrink: 0, fontWeight: 700 }}>{i + 1}.</span>{a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── BIA SEKMESİ ─────────────────────────────────────────── */}
            {aktifSekme === 'bia' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ECEAE8', padding: '20px 22px', marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
                      Senaryo Bazlı EAL (Yıllık Beklenen Kayıp)
                    </div>
                    <BIATablosu senaryolar={banka.senaryo_eal} renk={renk} />
                  </div>
                  <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ECEAE8', padding: '20px 22px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
                      Kritik Süreç Matrisi
                    </div>
                    {[
                      { p: 'Core Banking Sistemi', rto: '4 saat', rpo: '1 saat', krit: true },
                      { p: 'ATM Ağı (12.000+ ATM)', rto: '2 saat', rpo: '30 dk', krit: true },
                      { p: 'İnternet/Mobil Bankacılık', rto: '1 saat', rpo: '15 dk', krit: true },
                      { p: 'Şube Operasyonları', rto: '24 saat', rpo: '4 saat', krit: false },
                      { p: 'Çağrı Merkezi', rto: '8 saat', rpo: '2 saat', krit: false },
                    ].map(r => (
                      <div key={r.p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F1F0EF' }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 12, color: NAVY, fontWeight: r.krit ? 600 : 400 }}>{r.p}</span>
                          {r.krit && <span style={{ marginLeft: 6, fontSize: 9, padding: '2px 5px', background: '#FEE2E2', color: RED, borderRadius: 4, fontWeight: 700 }}>KRİTİK</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: renk }}>RTO: {r.rto}</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: AMBER }}>RPO: {r.rpo}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* EAL özet */}
                  <div style={{ background: renk, borderRadius: 20, padding: '24px', color: 'white' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, opacity: .7, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>Toplam Yıllık Beklenen Kayıp</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, fontWeight: 900, marginBottom: 4 }}>
                      ₺{banka.bia.eal_yillik}M
                    </div>
                    <div style={{ fontSize: 13, opacity: .8, marginBottom: 20 }}>200 şube portföyü · 5 senaryo baz alınmıştır</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[
                        ['Günlük Risk', `₺${banka.bia.kesinti_maliyet_gun}M`],
                        ['Haftalık Risk', `₺${(banka.bia.kesinti_maliyet_gun * 7).toFixed(1)}M`],
                        ['RTO Kritik', `${banka.bia.rto_kritik} saat`],
                        ['RPO', `${banka.bia.rpo} saat`],
                      ].map(([l, v]) => (
                        <div key={l as string} style={{ background: 'rgba(255,255,255,.12)', borderRadius: 12, padding: '12px 14px' }}>
                          <div style={{ fontSize: 10, opacity: .7, marginBottom: 4 }}>{l}</div>
                          <div style={{ fontSize: 18, fontWeight: 800 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Kesinti süresi */}
                  <div style={{ background: 'white', borderRadius: 16, border: '1px solid #ECEAE8', padding: '20px 22px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
                      Kesinti Süresi → Finansal Etki
                    </div>
                    {[
                      { sure: '1 Saat', etki: (banka.bia.kesinti_maliyet_gun / 24).toFixed(2), oran: 4 },
                      { sure: '4 Saat (RTO)', etki: (banka.bia.kesinti_maliyet_gun / 6).toFixed(2), oran: 16 },
                      { sure: '1 Gün', etki: banka.bia.kesinti_maliyet_gun.toFixed(1), oran: 40 },
                      { sure: '1 Hafta', etki: (banka.bia.kesinti_maliyet_gun * 7).toFixed(1), oran: 80 },
                      { sure: '1 Ay', etki: (banka.bia.kesinti_maliyet_gun * 30).toFixed(0), oran: 100 },
                    ].map(r => (
                      <div key={r.sure} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid #F1F0EF' }}>
                        <div style={{ width: 70, fontSize: 11, fontWeight: 600, color: NAVY }}>{r.sure}</div>
                        <div style={{ flex: 1, height: 6, background: '#F1F0EF', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${r.oran}%`, background: r.oran > 60 ? RED : r.oran > 20 ? AMBER : renk, borderRadius: 99 }} />
                        </div>
                        <div style={{ width: 70, fontSize: 12, fontWeight: 700, color: r.oran > 60 ? RED : AMBER, textAlign: 'right' }}>₺{r.etki}M</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: 11, color: '#D1CEC9', marginTop: 40 }}>
          OMNI · ITU AYM iş birliğiyle geliştirilmiştir · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}
