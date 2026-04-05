'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { SORULAR_SANAYI } from '@/lib/sorular-sanayi'

const SUPA_URL = 'https://gqguwgbopgnpwzjwcexl.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI'
const NAVY = '#0A1628'
const TEAL = '#009B8D'

/* ─── Hesaplama yardımcıları ──────────────────────────────────── */
function uriToAdis(u: number) { return Math.round(200 + (u / 100) * 1000) }
function adisLabel(a: number) {
  return a < 450 ? 'Kritik Risk' : a < 650 ? 'Yüksek Risk' : a < 850 ? 'Orta Risk' : a < 1050 ? 'İyi' : 'Güçlü'
}
function adisRenk(a: number) {
  return a < 450 ? '#EF4444' : a < 650 ? '#F97316' : a < 850 ? '#EAB308' : a < 1050 ? '#22C55E' : '#16A34A'
}
function boyutRenk(b: number) {
  return b < 40 ? '#EF4444' : b < 60 ? '#F97316' : b < 75 ? '#EAB308' : '#22C55E'
}
function boyutDurum(b: number) {
  return b >= 70
    ? { ikon: '✓', label: 'İyi', renk: '#22C55E' }
    : b >= 50
    ? { ikon: '⚠', label: 'Orta', renk: '#F97316' }
    : { ikon: '✗', label: 'Kritik', renk: '#EF4444' }
}
function maliyetRenk(m: string) {
  return m === 'ucretsiz' ? '#22C55E' : m === 'dusuk' ? '#009B8D' : m === 'orta' ? '#F97316' : '#EF4444'
}
function maliyetLabel(m: string) {
  return m === 'ucretsiz' ? 'Ücretsiz' : m === 'dusuk' ? 'Düşük' : m === 'orta' ? 'Orta' : 'Yüksek'
}

/* ─── Kategori haritası (mevcut rapor kodundan) ───────────────── */
const KATEGORI_MAP: Record<string, string> = {
  T1:'cevre',T2:'cevre',T3:'cevre',T4:'proses',T5:'cevre',
  T6:'ekonomi',T7:'proses',T8:'proses',T9:'cevre',T10:'cevre',
  T11:'cevre',T12:'ekonomi',T13:'ekonomi',T14:'cevre',T15:'cevre',
  T16:'insan',T17:'cevre',T18:'proses',T19:'cevre',T20:'insan',
  S1:'mekan',S2:'mekan',S3:'insan',S4:'mekan',S5:'cevre',
  S6:'mekan',S7:'proses',S8:'proses',S9:'mekan',S10:'proses',
  S11:'insan',S12:'ekonomi',S13:'ekonomi',S14:'ekonomi',S15:'ekonomi',
  S16:'mekan',S17:'proses',S18:'mekan',S19:'mekan',S20:'proses',
  S21:'mekan',S22:'insan',
  Y1:'proses',Y2:'proses',Y3:'proses',Y4:'proses',Y5:'proses',
  Y6:'proses',Y7:'proses',Y8:'proses',Y9:'proses',Y10:'proses',
  Y11:'proses',Y12:'proses',Y13:'proses',Y14:'proses',Y15:'mekan',
  Y16:'mekan',Y17:'cevre',Y18:'cevre',Y19:'mekan',Y20:'cevre',
  Y21:'mekan',Y22:'mekan',Y23:'mekan',Y24:'mekan',Y25:'insan',
  Y26:'insan',Y27:'insan',Y28:'insan',Y29:'insan',Y30:'insan',
  Y31:'insan',Y32:'ekonomi',Y33:'proses',Y34:'proses',Y35:'proses',
  Y36:'proses',Y37:'proses',Y38:'ekonomi',Y39:'ekonomi',Y40:'ekonomi',
  Y41:'ekonomi',Y42:'ekonomi',Y43:'proses',Y44:'proses',Y45:'insan',
  Y46:'ekonomi',Y47:'proses',Y48:'proses',Y49:'proses',Y50:'insan',
  HRO1:'insan',HRO2:'insan',HRO3:'insan',HRO4:'proses',HRO5:'insan',
  HRO6:'proses',HRO7:'proses',HRO8:'proses',HRO9:'insan',HRO10:'proses',
  HRO11:'proses',HRO12:'insan',
}

const SORU_METIN: Record<string, string> = Object.fromEntries(
  SORULAR_SANAYI.map(s => [s.kod, s.soru])
)

/* ─── Tipler ──────────────────────────────────────────────────── */
interface FormVeri {
  tesis_adi: string
  nace_kodu: string
  ilce: string
  uri_skoru: number
  gonderim_tarihi: string
  envanter: Record<string, unknown>
  puanlar: Record<string, number>
}
interface Cozum {
  baslik: string
  aciklama: string
  tahmini_sure: string
  maliyet_seviyesi: string
  mevzuat_ref: string[] | null
  oncelik: number
  boyut: string | null
}

/* ─── Radar (Pentagon) SVG ────────────────────────────────────── */
function RadarSVG({ boyutlar }: { boyutlar: { ad: string; puan: number }[] }) {
  const SIZE = 260, cx = SIZE / 2, cy = SIZE / 2, maxR = 90, n = boyutlar.length
  function getPoint(i: number, r: number) {
    const a = (i * 2 * Math.PI) / n - Math.PI / 2
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  }
  function pts(ps: { x: number; y: number }[]) {
    return ps.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  }
  const dataPolygon = boyutlar.map((b, i) => getPoint(i, maxR * Math.max(0.06, b.puan / 100)))
  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ display: 'block' }}>
      {/* Background fill */}
      <polygon points={pts(boyutlar.map((_, i) => getPoint(i, maxR)))} fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1.0].map((lv, gi) => (
        <polygon key={gi} points={pts(boyutlar.map((_, i) => getPoint(i, maxR * lv)))}
          fill="none" stroke={gi < 3 ? '#E2E8F0' : '#CBD5E1'} strokeWidth={gi === 3 ? 1.2 : 0.8} />
      ))}
      {/* Axis lines */}
      {boyutlar.map((_, i) => {
        const p = getPoint(i, maxR)
        return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="#E2E8F0" strokeWidth="1" />
      })}
      {/* Data polygon */}
      <polygon points={pts(dataPolygon)} fill={TEAL + '38'} stroke={TEAL} strokeWidth="2" strokeLinejoin="round" />
      {/* Data dots */}
      {dataPolygon.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill={boyutRenk(boyutlar[i].puan)} stroke="white" strokeWidth="2" />
      ))}
      {/* Labels */}
      {boyutlar.map((b, i) => {
        const p = getPoint(i, maxR + 26)
        return (
          <text key={i} x={p.x.toFixed(1)} y={p.y.toFixed(1)} textAnchor="middle"
            dominantBaseline="middle" fontSize="11" fontWeight="700" fill={NAVY}>
            {b.ad}
          </text>
        )
      })}
      {/* Puan labels */}
      {boyutlar.map((b, i) => {
        const r = maxR * Math.max(0.06, b.puan / 100) + 14
        const p = getPoint(i, r)
        return (
          <text key={`s${i}`} x={p.x.toFixed(1)} y={p.y.toFixed(1)} textAnchor="middle"
            dominantBaseline="middle" fontSize="9.5" fontWeight="800" fill={boyutRenk(b.puan)}>
            {b.puan}
          </text>
        )
      })}
    </svg>
  )
}

/* ─── Öncelik Matrisi SVG ─────────────────────────────────────── */
function MatrisSVG({ cozumler }: { cozumler: Cozum[] }) {
  const W = 310, H = 230
  const pL = 32, pB = 28, pT = 22, pR = 12
  const pW = W - pL - pR, pH = H - pT - pB
  const midX = pL + pW / 2, midY = pT + pH / 2
  const xMap: Record<string, number> = { ucretsiz: 0.86, dusuk: 0.64, orta: 0.32, yuksek: 0.11 }
  const top = cozumler.slice(0, 12)
  function dotX(c: Cozum) { return pL + (xMap[c.maliyet_seviyesi] ?? 0.5) * pW }
  function dotY(i: number) { return pT + ((i + 0.5) / Math.max(top.length, 1)) * pH }
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {/* Quadrant BGs */}
      <rect x={pL} y={pT} width={pW / 2} height={pH / 2} fill="#FFF7ED" />
      <rect x={midX} y={pT} width={pW / 2} height={pH / 2} fill="#F0FDF4" />
      <rect x={pL} y={midY} width={pW / 2} height={pH / 2} fill="#F8FAFC" />
      <rect x={midX} y={midY} width={pW / 2} height={pH / 2} fill="#EFF6FF" />
      {/* Borders */}
      <rect x={pL} y={pT} width={pW} height={pH} fill="none" stroke="#CBD5E1" strokeWidth="1" />
      <line x1={midX} y1={pT} x2={midX} y2={pT + pH} stroke="#CBD5E1" strokeWidth="0.8" strokeDasharray="4,3" />
      <line x1={pL} y1={midY} x2={pL + pW} y2={midY} stroke="#CBD5E1" strokeWidth="0.8" strokeDasharray="4,3" />
      {/* Quadrant labels */}
      <text x={pL + pW * 0.25} y={pT + 14} textAnchor="middle" fontSize="8.5" fill="#EA580C" fontWeight="700">Stratejik</text>
      <text x={pL + pW * 0.75} y={pT + 14} textAnchor="middle" fontSize="8.5" fill="#16A34A" fontWeight="700">Hızlı Kazanım</text>
      <text x={pL + pW * 0.25} y={pT + pH - 7} textAnchor="middle" fontSize="7.5" fill="#94A3B8" fontWeight="600">Yeniden Değerlendir</text>
      <text x={pL + pW * 0.75} y={pT + pH - 7} textAnchor="middle" fontSize="7.5" fill="#0284C7" fontWeight="600">Doldurucu</text>
      {/* Axis labels */}
      <text x={pL + pW / 2} y={H - 3} textAnchor="middle" fontSize="7.5" fill="#64748B">← Zor   Uygulama Kolaylığı   Kolay →</text>
      <text x={9} y={pT + pH / 2} textAnchor="middle" fontSize="7.5" fill="#64748B" transform={`rotate(-90,9,${pT + pH / 2})`}>↑ Etki ↓</text>
      {/* Dots */}
      {top.map((c, i) => {
        const x = dotX(c), y = dotY(i)
        const renk = maliyetRenk(c.maliyet_seviyesi)
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="9" fill={renk} fillOpacity="0.88" stroke="white" strokeWidth="1.5" />
            <text x={x} y={y + 0.4} textAnchor="middle" dominantBaseline="middle" fontSize="7.5" fill="white" fontWeight="800">{i + 1}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── QR Placeholder ──────────────────────────────────────────── */
function QRPlaceholder({ token, size = 76 }: { token: string; size: number }) {
  const cells = 10, cs = size / cells
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <rect width={size} height={size} fill="white" />
      {Array.from({ length: cells }, (_, r) =>
        Array.from({ length: cells }, (_, c) => {
          const idx = (r * 7 + c * 3 + 2) % Math.max(token.length, 1)
          const filled = token.charCodeAt(idx) % 3 !== 0
          return filled ? (
            <rect key={`${r}-${c}`} x={c * cs + 0.5} y={r * cs + 0.5}
              width={cs - 1} height={cs - 1} fill={NAVY} rx="0.5" />
          ) : null
        })
      )}
    </svg>
  )
}

/* ─── Sayfa başlık bandı ──────────────────────────────────────── */
function SayfaBandi({ baslik, sayfaNo }: { baslik: string; sayfaNo: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 10, borderBottom: `2px solid ${NAVY}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ background: NAVY, color: 'white', fontWeight: 900, fontSize: 10, padding: '3px 9px', borderRadius: 3, letterSpacing: 1.5 }}>ADİS</div>
        <div style={{ width: 1, height: 18, background: '#CBD5E1' }} />
        <div style={{ fontSize: 14, fontWeight: 800, color: NAVY, letterSpacing: '-0.3px' }}>{baslik}</div>
      </div>
      <div style={{ fontSize: 9, color: '#94A3B8', fontFamily: 'monospace' }}>{sayfaNo}</div>
    </div>
  )
}

/* ─── Ana Bileşen ─────────────────────────────────────────────── */
export default function RaporPage() {
  const { token } = useParams<{ token: string }>()
  const [form, setForm] = useState<FormVeri | null>(null)
  const [cozumler, setCozumler] = useState<Cozum[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    async function yukle() {
      try {
        const h = { apikey: SUPA_KEY }
        const r1 = await fetch(
          `${SUPA_URL}/rest/v1/iso_tesis_formlari?token=eq.${token}&select=*&limit=1`,
          { headers: h }
        )
        const forms = await r1.json()
        if (!forms[0]) return
        setForm(forms[0])
        const r2 = await fetch(
          `${SUPA_URL}/rest/v1/cozum_bankasi?aktif=eq.true&order=oncelik.asc&limit=15` +
          `&select=baslik,aciklama,tahmini_sure,maliyet_seviyesi,mevzuat_ref,oncelik,boyut`,
          { headers: h }
        )
        const c = await r2.json()
        if (Array.isArray(c)) setCozumler(c)
      } catch (e) { console.error(e) }
      finally { setYukleniyor(false) }
    }
    yukle()
  }, [token])

  useEffect(() => {
    if (form) document.title = `ADİS Raporu — ${form.tesis_adi}`
  }, [form])

  if (yukleniyor) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'DM Sans, Arial, sans-serif', background: '#F8FAFC' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, fontWeight: 900, color: NAVY, letterSpacing: '-1px' }}>ADİS</div>
        <div style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>Rapor hazırlanıyor…</div>
      </div>
    </div>
  )
  if (!form) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#EF4444', fontFamily: 'Arial' }}>
      Rapor verisi bulunamadı.
    </div>
  )

  /* ── Hesaplamalar ── */
  const adis = uriToAdis(form.uri_skoru)
  const aRenk = adisRenk(adis)
  const aLabel = adisLabel(adis)
  const tarih = new Date(form.gonderim_tarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })
  const refNo = token.slice(0, 16).toUpperCase()
  const gecerlilikD = new Date(form.gonderim_tarihi)
  gecerlilikD.setFullYear(gecerlilikD.getFullYear() + 1)
  const gecerlilik = gecerlilikD.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })

  const p: Record<string, number> = form.puanlar || {}

  function kategoriPuan(kat: string): number {
    const sorular = Object.entries(p).filter(([k]) => KATEGORI_MAP[k] === kat)
    if (!sorular.length) return 50
    return Math.round((sorular.reduce((s, [, v]) => s + v, 0) / sorular.length / 5) * 100)
  }

  const boyutlar = [
    { ad: 'İnsan',   key: 'insan',   puan: kategoriPuan('insan'),   aciklama: 'Çalışan güvenliği, eğitim, tahliye, psikolojik hazırlık' },
    { ad: 'Mekan',   key: 'mekan',   puan: kategoriPuan('mekan'),   aciklama: 'Yapısal dayanıklılık, yangın sistemleri, kaçış yolları' },
    { ad: 'Proses',  key: 'proses',  puan: kategoriPuan('proses'),  aciklama: 'İş sürekliliği, BCP/DRP, siber güvenlik, tedarik zinciri' },
    { ad: 'Çevre',   key: 'cevre',   puan: kategoriPuan('cevre'),   aciklama: 'Doğal tehlikeler, NATECH riski, iklim uyumu' },
    { ad: 'Ekonomi', key: 'ekonomi', puan: kategoriPuan('ekonomi'), aciklama: 'Sigorta, finansal rezerv, tedarikçi riski, mevzuat uyumu' },
  ]

  const kritikBoyutlar = boyutlar.filter(b => b.puan < 50)
  const dikkatBoyutlar = boyutlar.filter(b => b.puan >= 50 && b.puan < 70)
  const gucluBoyutlar  = boyutlar.filter(b => b.puan >= 70)
  const kritikSoruSayisi = Object.entries(p).filter(([k, v]) => KATEGORI_MAP[k] && v <= 2).length

  const bantlar = [
    { label: 'Güçlü',  aralik: '1050–1200', renk: '#16A34A', lo: 1050, hi: 1200 },
    { label: 'İyi',    aralik: '850–1049',  renk: '#22C55E', lo: 850,  hi: 1049 },
    { label: 'Orta',   aralik: '650–849',   renk: '#EAB308', lo: 650,  hi: 849  },
    { label: 'Yüksek', aralik: '450–649',   renk: '#F97316', lo: 450,  hi: 649  },
    { label: 'Kritik', aralik: '200–449',   renk: '#EF4444', lo: 200,  hi: 449  },
  ]

  const sayfa: React.CSSProperties = {
    fontFamily: "'DM Sans', Arial, Helvetica, sans-serif",
    width: '210mm',
    minHeight: '297mm',
    margin: '0 auto',
    boxSizing: 'border-box',
    position: 'relative',
    background: 'white',
  }

  const adisSkoru = ((adis - 200) / 1000) * 100

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { font-family: 'DM Sans', Arial, Helvetica, sans-serif; background: #94A3B8; color: #0A1628; font-size: 12px; }
        @page { size: A4; margin: 0; }
        @media print {
          html, body { background: white; }
          .no-print { display: none !important; }
          .sayfa { page-break-after: always; box-shadow: none !important; margin: 0 !important; }
          .son-sayfa { page-break-after: avoid !important; }
          body, html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .sayfa { box-shadow: 0 6px 32px rgba(0,0,0,.16); margin-bottom: 20px; }
        table { border-collapse: collapse; width: 100%; }
        td, th { vertical-align: top; }
      `}</style>

      {/* ─── NO-PRINT BAR ─────────────────────────────────────────── */}
      <div className="no-print" style={{ background: NAVY, padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ color: TEAL, fontWeight: 700, fontSize: 13 }}>ADİS Dayanıklılık Raporu — 6 Sayfa Önizleme</div>
        <button onClick={() => window.print()} style={{ background: TEAL, color: 'white', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
          ⬇ PDF Olarak Kaydet
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SAYFA 1 — KAPAK
      ══════════════════════════════════════════════════════════ */}
      <div className="sayfa" style={{ ...sayfa, background: NAVY, display: 'flex', flexDirection: 'column', padding: 0 }}>
        {/* Header */}
        <div style={{ padding: '26px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: TEAL, color: 'white', fontWeight: 900, fontSize: 14, padding: '4px 12px', borderRadius: 4, letterSpacing: 2 }}>ADİS</div>
            <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,.18)' }} />
            <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 10, fontWeight: 600, letterSpacing: '.12em' }}>AFET DAYANIKLILIK İNDEKSİ SİSTEMİ</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 8, marginBottom: 2, letterSpacing: '.1em' }}>REFERANS NO</div>
            <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 10, fontFamily: 'Courier New, monospace', fontWeight: 700 }}>{refNo}</div>
          </div>
        </div>

        {/* Gradient line */}
        <div style={{ margin: '18px 32px 0', height: 2, background: `linear-gradient(90deg, ${TEAL}, ${TEAL}44, transparent)` }} />

        {/* Center */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 32px' }}>
          {/* Score arc */}
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <svg width="210" height="210" viewBox="0 0 210 210">
              <circle cx="105" cy="105" r="92" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="18" />
              <circle cx="105" cy="105" r="92" fill="none" stroke={aRenk} strokeWidth="15"
                strokeDasharray={`${(adisSkoru / 100) * 578.1} 578.1`} strokeLinecap="round"
                transform="rotate(-90 105 105)" />
              <circle cx="105" cy="105" r="75" fill={aRenk + '1A'} />
              <circle cx="105" cy="105" r="75" fill="none" stroke={aRenk + '44'} strokeWidth="1" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 56, fontWeight: 900, color: 'white', lineHeight: 1 }}>{adis}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>/1200</div>
            </div>
          </div>

          {/* Score badge */}
          <div style={{ background: aRenk, color: 'white', fontWeight: 800, fontSize: 15, padding: '8px 30px', borderRadius: 30, letterSpacing: '.08em', marginBottom: 28 }}>
            {aLabel}
          </div>

          {/* Title block */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: 10, color: TEAL, fontWeight: 700, letterSpacing: '.18em', marginBottom: 12 }}>
              DAYANIKLILIK DEĞERLENDİRME RAPORU
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'white', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 10 }}>
              {form.tesis_adi}
            </div>
            {form.nace_kodu && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)' }}>
                NACE {form.nace_kodu}  •  {form.ilce || 'İstanbul'}
              </div>
            )}
          </div>

          {/* Info cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, width: '100%', maxWidth: '440px' }}>
            {[
              { label: 'Değerlendirme Tarihi', value: tarih },
              { label: 'URI Skoru',            value: `${Math.round(form.uri_skoru)} / 100` },
              { label: 'Geçerlilik Tarihi',    value: gecerlilik },
            ].map(m => (
              <div key={m.label} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: '12px', border: '1px solid rgba(255,255,255,.08)', textAlign: 'center' }}>
                <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,.35)', marginBottom: 4, fontWeight: 600 }}>{m.label}</div>
                <div style={{ fontSize: 10.5, color: 'white', fontWeight: 700, lineHeight: 1.4 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Score bar */}
        <div style={{ padding: '0 32px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,.3)' }}>200 — Kritik</span>
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,.3)' }}>1200 — Güçlü</span>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,.08)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${adisSkoru}%`, background: `linear-gradient(90deg,#EF4444 0%,#F97316 25%,#EAB308 50%,#22C55E 75%,#16A34A 100%)`, borderRadius: 3 }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 32px 22px', borderTop: '1px solid rgba(255,255,255,.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,.28)' }}>Bu rapor ADİS metodolojisi ile otomatik üretilmiştir</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)', fontWeight: 700, letterSpacing: '.05em' }}>Omniversel × İTÜ-AYM</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SAYFA 2 — YÖNETİCİ ÖZETİ
      ══════════════════════════════════════════════════════════ */}
      <div className="sayfa" style={{ ...sayfa, padding: '24px 28px' }}>
        <SayfaBandi baslik="YÖNETİCİ ÖZETİ" sayfaNo="Sayfa 2 / 6" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          {/* Sol: Skor kartı */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: '#64748B', letterSpacing: '.1em', marginBottom: 8 }}>ADİS DAYANIKLILIK SKORU</div>
            <div style={{ fontSize: 60, fontWeight: 900, color: aRenk, lineHeight: 1 }}>{adis}</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 10 }}>/1200</div>
            <div style={{ display: 'inline-block', background: aRenk, color: 'white', borderRadius: 20, padding: '6px 22px', fontSize: 13, fontWeight: 800, marginBottom: 14 }}>{aLabel}</div>
            <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 5 }}>
              <div style={{ height: '100%', width: `${adisSkoru}%`, background: aRenk, borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8.5, color: '#94A3B8', marginBottom: 14 }}>
              <span>200</span><span>1200</span>
            </div>
            <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.65, textAlign: 'left', padding: '10px 12px', background: 'white', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              {adis >= 1050 && 'Tesisiniz afet dayanıklılığı açısından çok güçlü bir konumdadır. Mevcut düzeyi koruyun.'}
              {adis >= 850 && adis < 1050 && 'Tesisiniz iyi bir dayanıklılık seviyesinde. Tespit edilen açıkların giderilmesiyle güçlü banta ulaşılabilir.'}
              {adis >= 650 && adis < 850 && 'Orta risk seviyesi. İyileştirme gerektiren boyutlara odaklanılması kritik önemdedir.'}
              {adis >= 450 && adis < 650 && 'Yüksek risk seviyesi. Acil aksiyon planı oluşturulması ve öncelikli yatırımlar gerekmektedir.'}
              {adis < 450 && 'Kritik risk. Derhal kapsamlı müdahale planı hazırlanmalı ve yasal gereklilikler gözden geçirilmelidir.'}
            </div>
          </div>

          {/* Sağ: Bant tablosu */}
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: '#64748B', letterSpacing: '.1em', marginBottom: 10 }}>SKOR BANTLARI</div>
            {bantlar.map(b => {
              const aktif = adis >= b.lo && adis <= b.hi
              return (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, padding: '8px 10px', background: aktif ? b.renk + '18' : '#F8FAFC', borderRadius: 8, border: aktif ? `1.5px solid ${b.renk}` : '1px solid #E2E8F0' }}>
                  <div style={{ width: 11, height: 11, borderRadius: 3, background: b.renk, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 11, fontWeight: aktif ? 800 : 500, color: aktif ? b.renk : '#374151' }}>{b.label}</div>
                  <div style={{ fontSize: 9.5, color: '#94A3B8', fontFamily: 'monospace' }}>{b.aralik}</div>
                  {aktif && <div style={{ fontSize: 8.5, fontWeight: 800, color: b.renk, letterSpacing: '.04em' }}>◄ MEVCUT</div>}
                </div>
              )
            })}
            <div style={{ marginTop: 12, padding: '10px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 9, color: '#64748B', lineHeight: 1.7 }}>
                <b>Metodoloji:</b> HIFYEA (H·F×E·Y·A)<br />
                URI Skoru: <b>{Math.round(form.uri_skoru)}/100</b> → ADİS: <b>{adis}/1200</b><br />
                ISO 22301 · ISO 31000 · AFAD AADY 2025
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: '#E2E8F0', marginBottom: 18 }} />

        {/* 3 bulgu kutusu */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
          {[
            { title: 'KRİTİK BULGULAR', items: kritikBoyutlar, renk: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
            { title: 'DİKKAT GEREKEN', items: dikkatBoyutlar, renk: '#F97316', bg: '#FFF7ED', border: '#FED7AA' },
            { title: 'GÜÇLÜ YÖNLER',   items: gucluBoyutlar,  renk: '#22C55E', bg: '#F0FDF4', border: '#BBF7D0' },
          ].map(box => (
            <div key={box.title} style={{ border: `1px solid ${box.border}`, borderRadius: 10, padding: '12px', background: box.bg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: box.renk }} />
                <div style={{ fontSize: 9.5, fontWeight: 800, color: box.renk }}>{box.title}</div>
              </div>
              {box.items.length === 0 ? (
                <div style={{ fontSize: 9.5, color: '#94A3B8', fontStyle: 'italic' }}>—</div>
              ) : box.items.map(b => (
                <div key={b.key} style={{ fontSize: 10, color: '#374151', marginBottom: 4, padding: '4px 7px', background: box.renk + '10', borderRadius: 5, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{b.ad}</span>
                  <span style={{ fontWeight: 700, color: box.renk }}>{b.puan}/100</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 4 metrik kartı */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'Toplam Soru',         value: '104', sub: 'T · S · Y · HRO bölümleri',           renk: NAVY  },
            { label: 'Değerlendirilen Boyut', value: '5', sub: 'İnsan·Mekan·Proses·Çevre·Ekonomi',   renk: TEAL  },
            { label: 'Kritik Risk Sayısı',  value: String(kritikSoruSayisi), sub: 'Puan ≤ 2/5 soru', renk: '#EF4444' },
            { label: 'Önerilen Aksiyon',    value: String(cozumler.length), sub: 'Öncelikli çözüm',  renk: '#22C55E' },
          ].map(m => (
            <div key={m.label} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px', borderTop: `3px solid ${m.renk}`, textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: m.renk, lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: '#374151', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 8.5, color: '#94A3B8' }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SAYFA 3 — RİSK BOYUTLARI
      ══════════════════════════════════════════════════════════ */}
      <div className="sayfa" style={{ ...sayfa, padding: '24px 28px' }}>
        <SayfaBandi baslik="RİSK BOYUTU ANALİZİ" sayfaNo="Sayfa 3 / 6" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* Sol: Radar */}
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: '#64748B', letterSpacing: '.08em', marginBottom: 10 }}>BOYUT RADAR ANALİZİ</div>
            <div style={{ display: 'flex', justifyContent: 'center', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0', padding: '14px' }}>
              <RadarSVG boyutlar={boyutlar} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10, justifyContent: 'center' }}>
              {boyutlar.map(b => (
                <div key={b.key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9 }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: boyutRenk(b.puan) }} />
                  <span style={{ color: '#374151' }}>{b.ad}</span>
                  <span style={{ fontWeight: 700, color: boyutRenk(b.puan) }}>({b.puan})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ: Bar chart */}
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: '#64748B', letterSpacing: '.08em', marginBottom: 10 }}>BOYUT PUAN DAĞILIMI</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {boyutlar.map(b => {
                const durum = boyutDurum(b.puan)
                return (
                  <div key={b.key} style={{ background: '#F8FAFC', borderRadius: 10, padding: '11px 13px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{b.ad}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 900, color: durum.renk }}>{b.puan}</span>
                        <span style={{ fontSize: 9, color: '#94A3B8' }}>/100</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: durum.renk, background: durum.renk + '18', padding: '2px 8px', borderRadius: 12 }}>
                          {durum.ikon} {durum.label}
                        </span>
                      </div>
                    </div>
                    <div style={{ height: 7, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 5 }}>
                      <div style={{ height: '100%', width: `${b.puan}%`, background: `linear-gradient(90deg, ${boyutRenk(b.puan)}CC, ${boyutRenk(b.puan)})`, borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 9, color: '#64748B', lineHeight: 1.5 }}>{b.aciklama}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Alt not */}
        <div style={{ marginTop: 18, padding: '12px 16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 15, flexShrink: 0, color: '#3B82F6' }}>ℹ</div>
          <div style={{ fontSize: 9.5, color: '#1D4ED8', lineHeight: 1.7 }}>
            <b>Radar Analiz Yorumu:</b> Pentagon grafiği 5 boyuttaki performansı görsel olarak göstermektedir. İdeal durum; tüm boyutların dışa yayıldığı, simetrik ve geniş bir pentagon oluşturmasıdır. Herhangi bir boyutun çöküşü, o alandaki zayıflığa işaret eder. Düşük puanlı boyutlar için Sayfa 4&apos;teki detaylı bulgular incelenmelidir.
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SAYFA 4 — DETAYLI BULGULAR
      ══════════════════════════════════════════════════════════ */}
      <div className="sayfa" style={{ ...sayfa, padding: '24px 28px' }}>
        <SayfaBandi baslik="DETAYLI BULGULAR" sayfaNo="Sayfa 4 / 6" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {boyutlar.map((boyut, bi) => {
            const durum = boyutDurum(boyut.puan)
            const kritikSorular = Object.entries(p)
              .filter(([k]) => KATEGORI_MAP[k] === boyut.key)
              .map(([k, v]) => ({ kod: k, ham: v, puan: Math.round((v / 5) * 100) }))
              .sort((a, b) => a.ham - b.ham)
              .slice(0, 3)
            return (
              <div key={boyut.key} style={{ background: 'white', border: `1px solid ${durum.renk}33`, borderTop: `3px solid ${durum.renk}`, borderRadius: 10, padding: '13px', ...(bi === 4 ? { gridColumn: '1 / -1' } : {}) }}>
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: NAVY }}>{boyut.ad}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 56, height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${boyut.puan}%`, background: boyutRenk(boyut.puan) }} />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 900, color: durum.renk }}>{boyut.puan}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: durum.renk }}>{durum.ikon}</span>
                  </div>
                </div>

                {/* Sorular */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, color: '#64748B', marginBottom: 6, letterSpacing: '.07em' }}>EN KRİTİK SORULAR</div>
                  {kritikSorular.length === 0 ? (
                    <div style={{ fontSize: 9.5, color: '#94A3B8', fontStyle: 'italic' }}>Bu boyut için değerlendirme verisi mevcut değil.</div>
                  ) : (
                    kritikSorular.map((s, i) => {
                      const metin = SORU_METIN[s.kod] || s.kod
                      const sRenk = s.puan < 40 ? '#EF4444' : s.puan < 60 ? '#F97316' : '#EAB308'
                      return (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, padding: '6px 8px', background: sRenk + '0D', borderRadius: 6, border: `1px solid ${sRenk}22` }}>
                          <div style={{ fontSize: 8.5, fontWeight: 800, color: 'white', background: sRenk, padding: '2px 6px', borderRadius: 4, flexShrink: 0, alignSelf: 'flex-start', marginTop: 1 }}>{s.kod}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 9, color: '#374151', lineHeight: 1.5, marginBottom: 2 }}>
                              {metin.slice(0, 105)}{metin.length > 105 ? '…' : ''}
                            </div>
                            <div style={{ fontSize: 9, fontWeight: 800, color: sRenk }}>{s.puan}/100</div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Footer */}
                <div style={{ fontSize: 8.5, color: '#64748B', padding: '6px 8px', background: '#F8FAFC', borderRadius: 6, lineHeight: 1.5, borderLeft: `3px solid ${durum.renk}` }}>
                  <b>Etki alanı:</b> {boyut.aciklama}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SAYFA 5 — AKSİYON PLANI
      ══════════════════════════════════════════════════════════ */}
      <div className="sayfa" style={{ ...sayfa, padding: '24px 28px' }}>
        <SayfaBandi baslik="AKSİYON PLANI" sayfaNo="Sayfa 5 / 6" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20, alignItems: 'start' }}>
          {/* Matris */}
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: '#64748B', letterSpacing: '.08em', marginBottom: 8 }}>ÖNCELİK MATRİSİ</div>
            <div style={{ background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', padding: '10px', display: 'flex', justifyContent: 'center' }}>
              <MatrisSVG cozumler={cozumler} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {[
                { label: 'Ücretsiz',       renk: '#22C55E' },
                { label: 'Düşük Maliyet',  renk: TEAL     },
                { label: 'Orta Maliyet',   renk: '#F97316' },
                { label: 'Yüksek Maliyet', renk: '#EF4444' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9 }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: l.renk }} />
                  <span style={{ color: '#374151' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Matris yorumu */}
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: '#64748B', letterSpacing: '.08em', marginBottom: 8 }}>MATRİS YORUMU</div>
            {[
              { q: 'Hızlı Kazanım', d: 'Kolay ve etkili aksiyonlar. İlk 30 gün içinde hayata geçirilmelidir.', renk: '#16A34A', bg: '#F0FDF4' },
              { q: 'Stratejik',     d: 'Yüksek etki, zor uygulama. Uzun vadeli plana alınmalı ve kaynak tahsis edilmelidir.', renk: '#EA580C', bg: '#FFF7ED' },
              { q: 'Doldurucu',     d: 'Kolay ama sınırlı etki. Kapasite boş olduğunda değerlendirin.', renk: '#0284C7', bg: '#EFF6FF' },
              { q: 'Yeniden Değerlendir', d: 'Zor ve düşük etki. Alternatif çözümler araştırılmalıdır.', renk: '#94A3B8', bg: '#F8FAFC' },
            ].map(item => (
              <div key={item.q} style={{ padding: '8px 10px', background: item.bg, borderRadius: 8, borderLeft: `3px solid ${item.renk}`, marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: item.renk, marginBottom: 2 }}>{item.q}</div>
                <div style={{ fontSize: 9, color: '#374151', lineHeight: 1.5 }}>{item.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Aksiyon tablosu */}
        <div style={{ fontSize: 9.5, fontWeight: 700, color: '#64748B', letterSpacing: '.08em', marginBottom: 8 }}>ÖNCELİKLİ AKSİYONLAR</div>
        <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr style={{ background: NAVY }}>
                {['#', 'Aksiyon', 'Süre', 'Maliyet', 'Mevzuat'].map((h, i) => (
                  <th key={h} style={{ padding: '7px 9px', textAlign: i === 0 ? 'center' : 'left', fontSize: 8.5, fontWeight: 700, color: 'white', width: i === 0 ? 28 : i === 2 ? 72 : i === 3 ? 72 : i === 4 ? 88 : undefined }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cozumler.map((c, i) => {
                const mRenk = maliyetRenk(c.maliyet_seviyesi)
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? '#FFF' : '#F8FAFC' }}>
                    <td style={{ padding: '6px 9px', textAlign: 'center' }}>
                      <div style={{ width: 18, height: 18, background: NAVY, color: 'white', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 800, margin: '0 auto' }}>{i + 1}</div>
                    </td>
                    <td style={{ padding: '6px 9px' }}>
                      <div style={{ fontWeight: 700, color: NAVY, fontSize: 9.5, marginBottom: 1 }}>{c.baslik}</div>
                      <div style={{ color: '#64748B', fontSize: 8.5, lineHeight: 1.4 }}>{(c.aciklama || '').slice(0, 80)}{(c.aciklama?.length || 0) > 80 ? '…' : ''}</div>
                    </td>
                    <td style={{ padding: '6px 9px', fontSize: 9, color: '#374151' }}>{c.tahmini_sure || '—'}</td>
                    <td style={{ padding: '6px 9px' }}>
                      <span style={{ fontWeight: 700, color: mRenk, background: mRenk + '18', padding: '2px 7px', borderRadius: 5, fontSize: 8.5 }}>
                        {maliyetLabel(c.maliyet_seviyesi)}
                      </span>
                    </td>
                    <td style={{ padding: '6px 9px', fontSize: 8, color: '#64748B' }}>{c.mevzuat_ref?.[0] || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SAYFA 6 — SERTİFİKA & YASAL DAYANAK
      ══════════════════════════════════════════════════════════ */}
      <div className="sayfa son-sayfa" style={{ ...sayfa, padding: '24px 28px' }}>
        <SayfaBandi baslik="SERTİFİKA & YASAL DAYANAK" sayfaNo="Sayfa 6 / 6" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 22 }}>
          {/* Sertifika */}
          <div style={{ border: `2px solid ${NAVY}`, borderRadius: 14, padding: '22px', background: '#F8FAFC', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Watermark */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-28deg)', fontSize: 88, fontWeight: 900, color: aRenk + '07', pointerEvents: 'none', whiteSpace: 'nowrap', letterSpacing: 8 }}>
              ADİS
            </div>

            <div style={{ fontSize: 8.5, fontWeight: 700, color: '#64748B', letterSpacing: '.16em', marginBottom: 10 }}>DAYANIKLILIK SERTİFİKASI</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div style={{ background: NAVY, color: 'white', fontWeight: 900, fontSize: 12, padding: '3px 10px', borderRadius: 4, letterSpacing: 1.5 }}>ADİS</div>
              <div style={{ width: 1, height: 18, background: '#CBD5E1' }} />
              <div style={{ fontSize: 9, color: '#64748B', fontWeight: 600 }}>Omniversel × İTÜ-AYM</div>
            </div>

            <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, lineHeight: 1.3, marginBottom: 6 }}>{form.tesis_adi}</div>
            <div style={{ fontSize: 9.5, color: '#64748B', marginBottom: 16 }}>
              {form.nace_kodu ? `NACE: ${form.nace_kodu}  •  ` : ''}{form.ilce || 'İstanbul'}
            </div>

            {/* Skor kutusu */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: aRenk + '15', border: `2px solid ${aRenk}`, borderRadius: 12, padding: '12px 22px', marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 38, fontWeight: 900, color: aRenk, lineHeight: 1 }}>{adis}</div>
                <div style={{ fontSize: 9, color: '#94A3B8' }}>/1200</div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: aRenk }}>{aLabel}</div>
                <div style={{ fontSize: 8.5, color: '#64748B' }}>ADİS Skoru</div>
              </div>
            </div>

            {/* QR + Tarihler */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 8, color: '#94A3B8', marginBottom: 2 }}>Değerlendirme Tarihi</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>{tarih}</div>
                <div style={{ fontSize: 8, color: '#94A3B8', marginTop: 7, marginBottom: 2 }}>Geçerlilik Tarihi</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>{gecerlilik}</div>
              </div>
              <div style={{ border: `2px solid ${NAVY}`, borderRadius: 6, padding: 4, background: 'white' }}>
                <QRPlaceholder token={token} size={72} />
              </div>
            </div>

            <div style={{ fontSize: 8, color: '#94A3B8', lineHeight: 1.6, borderTop: '1px solid #E2E8F0', paddingTop: 10 }}>
              Referans: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{refNo}</span><br />
              Bu belge ADİS metodolojisi ile otomatik üretilmiştir. Hukuki bağlayıcılığı bulunmamaktadır.
            </div>
          </div>

          {/* Yasal dayanak */}
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: '#64748B', letterSpacing: '.08em', marginBottom: 12 }}>YASAL DAYANAK VE STANDARTLAR</div>
            {[
              { kod: 'ISO 22301:2019+A1:2024', baslik: 'İş Sürekliliği Yönetim Sistemi',             renk: '#0284C7' },
              { kod: 'ISO 31000:2018',          baslik: 'Risk Yönetimi — İlkeler ve Kılavuz',          renk: '#0284C7' },
              { kod: 'ISO 45001:2023',           baslik: 'İş Sağlığı ve Güvenliği Yönetim Sistemi',    renk: '#7C3AED' },
              { kod: 'ISO 27001/27031',          baslik: 'Bilgi Güvenliği ve BT İş Sürekliliği',       renk: '#7C3AED' },
              { kod: 'AFAD AADY 2025',           baslik: 'Afet Acil Durum Yönetim Yönetmeliği',        renk: '#EF4444' },
              { kod: '6331 İSG Kanunu',          baslik: 'İş Sağlığı ve Güvenliği Kanunu',             renk: '#EF4444' },
              { kod: 'BYKHY',                    baslik: 'Binaların Yangından Korunması Yönetmeliği',  renk: '#F97316' },
              { kod: 'Sendai 2015–2030',         baslik: 'Afet Risk Azaltma Uluslararası Çerçevesi',   renk: '#16A34A' },
              { kod: 'Seveso III Direktifi',     baslik: 'Büyük Endüstriyel Kazaların Önlenmesi',      renk: '#EA580C' },
            ].map(item => (
              <div key={item.kod} style={{ display: 'flex', gap: 10, padding: '7px 10px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', alignItems: 'center', marginBottom: 7 }}>
                <div style={{ fontSize: 8.5, fontWeight: 800, color: item.renk, background: item.renk + '14', padding: '3px 7px', borderRadius: 4, whiteSpace: 'nowrap', flexShrink: 0 }}>{item.kod}</div>
                <div style={{ fontSize: 9.5, color: '#374151' }}>{item.baslik}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: TEAL, marginBottom: 3 }}>OMNIVERSEL — Urban Resilience Platform</div>
            <div style={{ fontSize: 8.5, color: '#64748B' }}>İTÜ Afet Yönetimi Araştırma ve Uygulama Merkezi (İTÜ-AYM) akademik iş birliği ile geliştirilmiştir.</div>
            <div style={{ fontSize: 8.5, color: '#94A3B8', marginTop: 2 }}>omniversel.com  •  info@omniversel.com  •  İstanbul, Türkiye</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8.5, color: '#94A3B8' }}>Rapor No</div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: NAVY, fontFamily: 'monospace' }}>{refNo}</div>
            <div style={{ fontSize: 8.5, color: '#94A3B8', marginTop: 2 }}>{tarih}</div>
          </div>
        </div>
      </div>
    </>
  )
}
