'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  ChevronLeft, ChevronRight, Plus, X,
  AlertTriangle, Zap, Target, Clock, TrendingUp, Flame, Download,
} from 'lucide-react'

const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI'
)
const TENANT = '11111111-0000-0000-0000-000000000001'
const NAVY   = '#0A1628'
const TEAL   = '#009B8D'
const LS_KEY = 'omniSPRINT_kartlar'

const SPRINT_BASLANGIC = new Date('2026-03-19')
const SPRINT_BITIS     = new Date('2026-04-03')
const SPRINT_SURE      = 15 // gün

type KanbanSutun  = 'backlog' | 'yapiliyor' | 'incelemede' | 'tamamlandi'
type FemaFaz      = 'Önleme' | 'Koruma' | 'Zarar Azaltma' | 'Müdahale' | 'İyileştirme'
type Oncelik      = 'Kritik' | 'Yüksek' | 'Orta'

interface SprintKarti {
  id: string
  risk_id: string
  tesis_adi: string
  facility_id?: string
  b_degeri: number
  squad: string
  fema_faz: FemaFaz
  oncelik: Oncelik
  uri_etki: number
  sutun: KanbanSutun
  baslama_tarihi?: string
  bitis_tarihi?: string
  near_miss_kaynakli?: boolean
}

const SUTUNLAR: { id: KanbanSutun; label: string; renk: string }[] = [
  { id: 'backlog',     label: 'Backlog',       renk: '#6B7280' },
  { id: 'yapiliyor',  label: 'Yapılıyor',      renk: '#3B82F6' },
  { id: 'incelemede', label: 'İncelemede',     renk: '#F59E0B' },
  { id: 'tamamlandi', label: 'Tamamlandı',     renk: '#22C55E' },
]

const FEMA_RENKLER: Record<FemaFaz, { bg: string; text: string }> = {
  'Önleme':       { bg: '#DCFCE7', text: '#15803D' },
  'Koruma':       { bg: '#CCFBF1', text: '#0F766E' },
  'Zarar Azaltma':{ bg: '#FEF3C7', text: '#92400E' },
  'Müdahale':     { bg: '#FFEDD5', text: '#C2410C' },
  'İyileştirme':  { bg: '#FEE2E2', text: '#B91C1C' },
}
const ONCELIK_RENKLER: Record<Oncelik, { bg: string; text: string; dot: string }> = {
  'Kritik': { bg: '#FEE2E2', text: '#B91C1C', dot: '#EF4444' },
  'Yüksek': { bg: '#FFF7ED', text: '#C2410C', dot: '#F97316' },
  'Orta':   { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' },
}

// ── SVG Pasta Grafiği ──────────────────────────────────────────
function PieChart({ data }: { data: { label: string; value: number; renk: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return (
    <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#E5E3E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 10, color: '#9CA3AF' }}>Veri yok</span>
    </div>
  )
  const r = 40; const cx = 50; const cy = 50
  let startAngle = -Math.PI / 2
  const paths: { d: string; renk: string }[] = []
  for (const d of data) {
    if (d.value === 0) continue
    const angle = (d.value / total) * 2 * Math.PI
    const endAngle = startAngle + angle
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const large = angle > Math.PI ? 1 : 0
    paths.push({ d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, renk: d.renk })
    startAngle = endAngle
  }
  return (
    <svg viewBox="0 0 100 100" style={{ width: 90, height: 90 }}>
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.renk} stroke="white" strokeWidth="1.5" />)}
      <circle cx="50" cy="50" r="24" fill="white" />
    </svg>
  )
}

// ── Burndown SVG ───────────────────────────────────────────────
function BurndownChart({ toplamKart, tamamlananSayisi }: { toplamKart: number; tamamlananSayisi: number }) {
  const W = 400; const H = 160
  const ml = 44; const mr = 12; const mt = 12; const mb = 28
  const pw = W - ml - mr; const ph = H - mt - mb
  const maxY = Math.max(toplamKart, 1)
  const bugun = Math.min(SPRINT_SURE, Math.max(0,
    Math.floor((Date.now() - SPRINT_BASLANGIC.getTime()) / 86400000)
  ))

  const xPx = (d: number) => ml + (d / SPRINT_SURE) * pw
  const yPx = (v: number) => mt + (1 - v / maxY) * ph

  // İdeal çizgi: (0, toplamKart) → (SPRINT_SURE, 0)
  const idealD = `M ${xPx(0)} ${yPx(toplamKart)} L ${xPx(SPRINT_SURE)} ${yPx(0)}`

  // Gerçek çizgi: (0, toplamKart) → (bugun, toplamKart - tamamlananSayisi)
  const gercekD = bugun > 0
    ? `M ${xPx(0)} ${yPx(toplamKart)} L ${xPx(bugun)} ${yPx(toplamKart - tamamlananSayisi)}`
    : `M ${xPx(0)} ${yPx(toplamKart)}`

  // Grid
  const gridLines: { x?: number; y?: number }[] = []
  for (let d = 0; d <= SPRINT_SURE; d += 5) gridLines.push({ x: xPx(d) })
  for (let v = 0; v <= maxY; v += Math.ceil(maxY / 4)) gridLines.push({ y: yPx(v) })

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, height: H }}>
      {/* Grid */}
      {gridLines.map((g, i) =>
        g.x !== undefined
          ? <line key={i} x1={g.x} y1={mt} x2={g.x} y2={mt + ph} stroke="#F1F0EF" strokeWidth="1" />
          : <line key={i} x1={ml} y1={g.y!} x2={ml + pw} y2={g.y!} stroke="#F1F0EF" strokeWidth="1" />
      )}
      {/* Axes */}
      <line x1={ml} y1={mt} x2={ml} y2={mt + ph} stroke="#E5E3E1" strokeWidth="1.5" />
      <line x1={ml} y1={mt + ph} x2={ml + pw} y2={mt + ph} stroke="#E5E3E1" strokeWidth="1.5" />
      {/* İdeal */}
      <path d={idealD} fill="none" stroke="#E5E3E1" strokeWidth="1.5" strokeDasharray="5,3" />
      {/* Gerçek */}
      <path d={gercekD} fill="none" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" />
      {/* Bugün noktası */}
      {bugun > 0 && (
        <circle
          cx={xPx(bugun)} cy={yPx(toplamKart - tamamlananSayisi)}
          r="5" fill={TEAL} stroke="white" strokeWidth="2"
        />
      )}
      {/* X eksen etiketleri */}
      {[0, 5, 10, 15].map(d => (
        <text key={d} x={xPx(d)} y={H - 6} textAnchor="middle" fontSize="9" fill="#9CA3AF">G{d}</text>
      ))}
      {/* Y eksen */}
      <text x={ml - 6} y={yPx(toplamKart) + 4} textAnchor="end" fontSize="9" fill="#9CA3AF">{toplamKart}</text>
      <text x={ml - 6} y={yPx(0) + 4} textAnchor="end" fontSize="9" fill="#9CA3AF">0</text>
    </svg>
  )
}

// ── Yeni Kart Modal ────────────────────────────────────────────
function YeniKartModal({
  onEkle, onKapat, facilities,
}: {
  onEkle: (k: Omit<SprintKarti, 'id'>) => void
  onKapat: () => void
  facilities: { id: string; name: string }[]
}) {
  const [form, setForm] = useState({
    tesis_adi: '', facility_id: '',
    b_degeri: 1.2, squad: 'A',
    fema_faz: 'Zarar Azaltma' as FemaFaz,
    oncelik: 'Orta' as Oncelik,
    uri_etki: 5,
    near_miss_kaynakli: false,
  })
  const f = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(p => ({ ...p, [k]: v }))
  const inp: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '8px 10px',
    borderRadius: 8, border: '1px solid #E5E3E1', fontSize: 13,
    fontFamily: "'DM Sans',sans-serif", outline: 'none', background: 'white',
  }
  const sel: React.CSSProperties = { ...inp, cursor: 'pointer' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }

  function gonder() {
    const ad = form.tesis_adi || facilities.find(f => f.id === form.facility_id)?.name || 'Yeni Tesis'
    const riskId = `R-${String(Date.now()).slice(-4)}`
    onEkle({
      risk_id: riskId,
      tesis_adi: ad,
      facility_id: form.facility_id || undefined,
      b_degeri: form.b_degeri,
      squad: form.squad,
      fema_faz: form.fema_faz,
      oncelik: form.oncelik,
      uri_etki: form.uri_etki,
      sutun: 'backlog',
      near_miss_kaynakli: form.near_miss_kaynakli,
    })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 24, width: 420, maxWidth: '94vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Yeni Sprint Kartı</h3>
          <button onClick={onKapat} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={lbl}>Tesis</label>
            <select style={sel} value={form.facility_id}
              onChange={e => { f('facility_id', e.target.value); f('tesis_adi', facilities.find(fc => fc.id === e.target.value)?.name || '') }}>
              <option value="">— Manuel gir —</option>
              {facilities.map(fc => <option key={fc.id} value={fc.id}>{fc.name}</option>)}
            </select>
          </div>
          {!form.facility_id && (
            <div>
              <label style={lbl}>Tesis Adı</label>
              <input style={inp} value={form.tesis_adi} onChange={e => f('tesis_adi', e.target.value)} placeholder="Tesis adı giriniz" />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={lbl}>TOC Darboğaz (B)</label>
              <input style={inp} type="number" step="0.1" min="1" max="3" value={form.b_degeri}
                onChange={e => f('b_degeri', parseFloat(e.target.value) || 1.2)} />
            </div>
            <div>
              <label style={lbl}>URI Etkisi (+puan)</label>
              <input style={inp} type="number" min="1" max="30" value={form.uri_etki}
                onChange={e => f('uri_etki', parseInt(e.target.value) || 5)} />
            </div>
            <div>
              <label style={lbl}>Squad</label>
              <select style={sel} value={form.squad} onChange={e => f('squad', e.target.value)}>
                {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>Squad {s}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Öncelik</label>
              <select style={sel} value={form.oncelik} onChange={e => f('oncelik', e.target.value as Oncelik)}>
                {(['Kritik', 'Yüksek', 'Orta'] as Oncelik[]).map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={lbl}>FEMA Yetkinlik Fazı</label>
            <select style={sel} value={form.fema_faz} onChange={e => f('fema_faz', e.target.value as FemaFaz)}>
              {(['Önleme', 'Koruma', 'Zarar Azaltma', 'Müdahale', 'İyileştirme'] as FemaFaz[]).map(fz => <option key={fz}>{fz}</option>)}
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.near_miss_kaynakli}
              onChange={e => f('near_miss_kaynakli', e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer' }} />
            Near Miss kaynaklı aksiyon
          </label>

          <button onClick={gonder}
            style={{ width: '100%', padding: '12px', borderRadius: 12, background: TEAL, color: 'white', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
            Kartı Ekle
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Ana Sayfa ─────────────────────────────────────────────────
export default function OmniSprintPage() {
  const [kartlar,     setKartlar]     = useState<SprintKarti[]>([])
  const [facilities,  setFacilities]  = useState<{ id: string; name: string }[]>([])
  const [yukleniyor,  setYukleniyor]  = useState(true)
  const [modalAcik,   setModalAcik]   = useState(false)
  const [sprintHedef, setSprintHedef] = useState('Yakuplu NATECH darboğazlarını azalt')
  const [hedefDuzenle,setHedefDuzenle]= useState(false)
  const [indiriyor,   setIndiriyor]   = useState(false)

  // localStorage'dan yükle
  useEffect(() => {
    const kayitli = localStorage.getItem(LS_KEY)
    if (kayitli) {
      try { setKartlar(JSON.parse(kayitli)) } catch { /* ignore */ }
    }
    const hedefKayit = localStorage.getItem('omniSPRINT_hedef')
    if (hedefKayit) setSprintHedef(hedefKayit)
  }, [])

  // Supabase'den NATECH tesisleri çek
  useEffect(() => {
    async function yukle() {
      setYukleniyor(true)
      const { data } = await sb.from('facilities')
        .select('id,name,extra_data')
        .eq('tenant_id', TENANT)
        .eq('is_active', true)
        .order('name')

      const tumFac = (data ?? []) as { id: string; name: string; extra_data: Record<string, unknown> | null }[]
      setFacilities(tumFac.map(f => ({ id: f.id, name: f.name })))

      // NATECH tesisleri: extra_data.hazmat_flag === true
      const natechFac = tumFac.filter(f => f.extra_data?.hazmat_flag === true)

      // localStorage'dan mevcut kartları al
      const kayitli = localStorage.getItem(LS_KEY)
      const mevcutKartlar: SprintKarti[] = kayitli ? JSON.parse(kayitli) : []
      const mevcutFacIds = new Set(mevcutKartlar.map(k => k.facility_id).filter(Boolean))

      // Yeni NATECH tesisleri için backlog kartı oluştur
      const yeniKartlar: SprintKarti[] = natechFac
        .filter(f => !mevcutFacIds.has(f.id))
        .map((f, idx) => ({
          id: `natech-${f.id.slice(0, 8)}`,
          risk_id: `NATECH-${String(idx + 1).padStart(3, '0')}`,
          tesis_adi: f.name,
          facility_id: f.id,
          b_degeri: 2.5,
          squad: 'A',
          fema_faz: 'Zarar Azaltma' as FemaFaz,
          oncelik: 'Kritik' as Oncelik,
          uri_etki: 8,
          sutun: 'backlog' as KanbanSutun,
          near_miss_kaynakli: false,
        }))

      if (yeniKartlar.length > 0) {
        const guncellenmis = [...mevcutKartlar, ...yeniKartlar]
        setKartlar(guncellenmis)
        localStorage.setItem(LS_KEY, JSON.stringify(guncellenmis))
      } else {
        setKartlar(mevcutKartlar)
      }
      setYukleniyor(false)
    }
    yukle()
  }, [])

  // localStorage'a kaydet
  const kaydet = useCallback((guncel: SprintKarti[]) => {
    setKartlar(guncel)
    localStorage.setItem(LS_KEY, JSON.stringify(guncel))
  }, [])

  // Sütun değiştir
  function tasiFn(id: string, yon: 'ileri' | 'geri') {
    const sirali: KanbanSutun[] = ['backlog', 'yapiliyor', 'incelemede', 'tamamlandi']
    kaydet(kartlar.map(k => {
      if (k.id !== id) return k
      const i = sirali.indexOf(k.sutun)
      const yeniI = yon === 'ileri' ? Math.min(3, i + 1) : Math.max(0, i - 1)
      const yeniSutun = sirali[yeniI]
      return {
        ...k,
        sutun: yeniSutun,
        baslama_tarihi: yeniSutun === 'yapiliyor' && !k.baslama_tarihi ? new Date().toISOString() : k.baslama_tarihi,
        bitis_tarihi:   yeniSutun === 'tamamlandi' ? new Date().toISOString() : k.bitis_tarihi,
      }
    }))
  }

  function kartSil(id: string) {
    kaydet(kartlar.filter(k => k.id !== id))
  }

  function kartEkle(yeni: Omit<SprintKarti, 'id'>) {
    const k: SprintKarti = { ...yeni, id: `kart-${Date.now()}` }
    kaydet([...kartlar, k])
    setModalAcik(false)
  }

  async function pdfIndir() {
    setIndiriyor(true)
    try {
      const { jsPDF } = await import('jspdf')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { default: autoTable } = await import('jspdf-autotable') as any
      const doc = new jsPDF('p', 'mm', 'a4')
      const W = 210; const H = 297; const ml = 18; const mr = 18
      const trP = (s: string) => String(s ?? '')
        .replace(/ş/g,'s').replace(/Ş/g,'S').replace(/ğ/g,'g').replace(/Ğ/g,'G')
        .replace(/ü/g,'u').replace(/Ü/g,'U').replace(/ö/g,'o').replace(/Ö/g,'O')
        .replace(/ı/g,'i').replace(/İ/g,'I').replace(/ç/g,'c').replace(/Ç/g,'C')

      // ── KAPAK ────────────────────────────────────────────────
      doc.setFillColor(10, 22, 40); doc.rect(0, 0, W, H, 'F')
      doc.setFillColor(139, 92, 246); doc.rect(0, H / 2 - 40, W, 2, 'F')

      doc.setFont('helvetica', 'bold'); doc.setFontSize(30); doc.setTextColor(232, 201, 122)
      doc.text('OMNIVERSEL', W / 2, 80, { align: 'center' })
      doc.setFillColor(139, 92, 246); doc.rect(65, 87, 80, 1.2, 'F')

      doc.setFontSize(16); doc.setTextColor(255, 255, 255)
      doc.text('omniSPRINT Agile Dayaniklilik Raporu', W / 2, 100, { align: 'center' })
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(148, 163, 184)
      doc.text('TOC Darboğaz · HRO · FEMA Fazlama · Kanban Sprint Panosu', W / 2, 111, { align: 'center' })

      doc.setFontSize(11); doc.setTextColor(255, 255, 255)
      doc.text('Sprint 1 — 19 Mart · 3 Nisan 2026', W / 2, 135, { align: 'center' })
      doc.setFontSize(9); doc.setTextColor(148, 163, 184)
      doc.text(`Hedef: "${trP(sprintHedef)}"`, W / 2, 147, { align: 'center' })
      doc.text(new Date().toLocaleDateString('tr-TR'), W / 2, 160, { align: 'center' })

      doc.setFillColor(139, 92, 246); doc.rect(0, H - 26, W, 26, 'F')
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255)
      doc.text('Omniversel · omniRISK Motoru · ISO 22301 · HFER-720', W / 2, H - 13, { align: 'center' })
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(221, 214, 254)
      doc.text(`Olusturma: ${new Date().toLocaleString('tr-TR')}`, W / 2, H - 7, { align: 'center' })

      // ── SAYFA 2: SPRINT DURUMU ───────────────────────────────
      doc.addPage()
      doc.setFillColor(10, 22, 40); doc.rect(0, 0, W, 18, 'F')
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(232, 201, 122)
      doc.text('OMNIVERSEL', ml, 12)
      doc.setFont('helvetica', 'normal'); doc.setTextColor(148, 163, 184)
      doc.text('omniSPRINT Raporu', W - mr, 12, { align: 'right' })

      let y = 28
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(10, 22, 40)
      doc.text('Sprint Ozeti', ml, y); y += 3
      doc.setFillColor(139, 92, 246); doc.rect(ml, y, 35, 0.8, 'F'); y += 9

      // Sprint bilgi kutuları
      const sutunSayilari = SUTUNLAR.map(s => ({
        label: s.label,
        value: kartlar.filter(k => k.sutun === s.id).length,
      }))
      const kW = 35; const kH = 24; const kGap = 5
      const sprintInfo = [
        { label: 'Toplam Aksiyon', value: `${kartlar.length}`, sub: 'Tum kartlar' },
        { label: 'Tamamlandi', value: `${tamamlananlar.length}`, sub: `%${kartlar.length ? Math.round(tamamlananlar.length/kartlar.length*100) : 0} velocity` },
        { label: 'WIP Durumu', value: `${yapiliyorlar.length}/3`, sub: wipIhlal ? 'IHLAL!' : 'Normal' },
        { label: 'Kalan Gun', value: `${Math.max(0, SPRINT_SURE - bugunSprintGunu)}`, sub: `${SPRINT_SURE} gunluk sprint` },
      ]
      sprintInfo.forEach((item, i) => {
        const x = ml + i * (kW + kGap)
        const isAlert = item.label === 'WIP Durumu' && wipIhlal
        doc.setFillColor(isAlert ? 254 : 248, isAlert ? 226 : 249, isAlert ? 226 : 250)
        doc.roundedRect(x, y, kW, kH, 2, 2, 'F')
        doc.setFillColor(isAlert ? 239 : 139, isAlert ? 68 : 92, isAlert ? 68 : 246)
        doc.rect(x, y, kW, 2.5, 'F')
        doc.setFont('helvetica', 'bold'); doc.setFontSize(16)
        doc.setTextColor(isAlert ? 185 : 10, isAlert ? 28 : 22, isAlert ? 28 : 40)
        doc.text(trP(item.value), x + kW / 2, y + 14, { align: 'center' })
        doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(107, 114, 128)
        doc.text(trP(item.label), x + kW / 2, y + 19.5, { align: 'center' })
        doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(156, 163, 175)
        doc.text(trP(item.sub), x + kW / 2, y + 23, { align: 'center' })
      })
      y += kH + 12

      // Kanban dağılımı tablosu
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(10, 22, 40)
      doc.text('Kanban Sutun Durumu', ml, y); y += 3
      doc.setFillColor(139, 92, 246); doc.rect(ml, y, 48, 0.8, 'F'); y += 5

      autoTable(doc, {
        startY: y,
        margin: { left: ml, right: mr },
        head: [['Sutun', 'Kart Sayisi', 'Kritik', 'Yuksek', 'Orta']],
        body: SUTUNLAR.map(s => {
          const sc = kartlar.filter(k => k.sutun === s.id)
          return [
            trP(s.label),
            sc.length.toString(),
            sc.filter(k => k.oncelik === 'Kritik').length.toString(),
            sc.filter(k => k.oncelik === 'Yüksek').length.toString(),
            sc.filter(k => k.oncelik === 'Orta').length.toString(),
          ]
        }),
        headStyles: { fillColor: [10, 22, 40], textColor: [255, 255, 255], fontSize: 9 },
        bodyStyles: { fontSize: 8.5, cellPadding: 3 },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        styles: { font: 'helvetica' },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 25, halign: 'center' },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 20, halign: 'center' },
        },
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const afterKanban = (doc as any).lastAutoTable?.finalY ?? y + 30
      y = afterKanban + 12

      // Burndown verisi tablosu
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(10, 22, 40)
      if (y > H - 80) { doc.addPage(); y = 28 }
      doc.text('Burndown Ozeti', ml, y); y += 3
      doc.setFillColor(0, 155, 141); doc.rect(ml, y, 36, 0.8, 'F'); y += 5

      autoTable(doc, {
        startY: y,
        margin: { left: ml, right: mr },
        head: [['Metrik', 'Deger']],
        body: [
          ['Sprint Suresi', `${SPRINT_SURE} gun`],
          ['Bugun Sprint Gunu', `${bugunSprintGunu}. gun`],
          ['Baslagic Kart Sayisi', kartlar.length.toString()],
          ['Tamamlanan', tamamlananlar.length.toString()],
          ['Kalan', (kartlar.length - tamamlananlar.length).toString()],
          ['Ort. Cycle Time', ortCycleTime !== null ? `${ortCycleTime} gun` : 'Veri yok'],
          ['Near Miss → Sprint', `%${donusumOrani} (${nearMissKarti}/${kartlar.length} kart)`],
        ],
        headStyles: { fillColor: [10, 22, 40], textColor: [255, 255, 255], fontSize: 9 },
        bodyStyles: { fontSize: 8.5, cellPadding: 3 },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        styles: { font: 'helvetica' },
        columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 'auto' } },
      })

      // ── SAYFA 3: TAMAMLANAN AKSİYONLAR ──────────────────────
      if (tamamlananlar.length > 0) {
        doc.addPage()
        doc.setFillColor(10, 22, 40); doc.rect(0, 0, W, 18, 'F')
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(232, 201, 122)
        doc.text('OMNIVERSEL', ml, 12)
        doc.setFont('helvetica', 'normal'); doc.setTextColor(148, 163, 184)
        doc.text('Tamamlanan Aksiyonlar', W - mr, 12, { align: 'right' })

        let y3 = 28
        doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(10, 22, 40)
        doc.text('Tamamlanan Aksiyonlar Listesi', ml, y3); y3 += 3
        doc.setFillColor(34, 197, 94); doc.rect(ml, y3, 55, 0.8, 'F'); y3 += 5

        autoTable(doc, {
          startY: y3,
          margin: { left: ml, right: mr },
          head: [['Risk ID', 'Tesis', 'FEMA Fazi', 'Squad', 'URI Etkisi', 'Bitis Tarihi']],
          body: tamamlananlar.map(k => [
            k.risk_id,
            trP(k.tesis_adi),
            trP(k.fema_faz),
            k.squad,
            `+${k.uri_etki} puan`,
            k.bitis_tarihi ? new Date(k.bitis_tarihi).toLocaleDateString('tr-TR') : '—',
          ]),
          headStyles: { fillColor: [10, 22, 40], textColor: [255, 255, 255], fontSize: 8 },
          bodyStyles: { fontSize: 7.5, cellPadding: 2.5 },
          alternateRowStyles: { fillColor: [240, 253, 244] },
          styles: { font: 'helvetica' },
        })
      }

      // Alt bilgi
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pc = (doc as any).getNumberOfPages()
      for (let i = 2; i <= pc; i++) {
        doc.setPage(i)
        doc.setFontSize(7); doc.setTextColor(156, 163, 175)
        doc.text('Omniversel · omniRISK · ISO 22301 · HFER-720', W / 2, H - 8, { align: 'center' })
        doc.text(`Sayfa ${i}/${pc}`, W - mr, H - 8, { align: 'right' })
        doc.text(new Date().toLocaleDateString('tr-TR'), ml, H - 8)
      }

      doc.save(`omniSPRINT-Raporu-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setIndiriyor(false)
    }
  }

  // ── Metrikler ─────────────────────────────────────────────
  const tamamlananlar  = kartlar.filter(k => k.sutun === 'tamamlandi')
  const yapiliyorlar   = kartlar.filter(k => k.sutun === 'yapiliyor')
  const wipIhlal       = yapiliyorlar.length > 3

  // Ortalama cycle time (gün)
  const cycleTimeler = tamamlananlar
    .filter(k => k.baslama_tarihi && k.bitis_tarihi)
    .map(k => (new Date(k.bitis_tarihi!).getTime() - new Date(k.baslama_tarihi!).getTime()) / 86400000)
  const ortCycleTime = cycleTimeler.length > 0
    ? Math.round(cycleTimeler.reduce((a, b) => a + b, 0) / cycleTimeler.length * 10) / 10
    : null

  // Near miss → sprint dönüşüm oranı
  const nearMissKarti = kartlar.filter(k => k.near_miss_kaynakli).length
  const donusumOrani  = kartlar.length > 0 ? Math.round((nearMissKarti / kartlar.length) * 100) : 0

  // FEMA dağılımı (bu sprint tüm kartlar)
  const femaDagilim: Record<FemaFaz, number> = { 'Önleme': 0, 'Koruma': 0, 'Zarar Azaltma': 0, 'Müdahale': 0, 'İyileştirme': 0 }
  for (const k of kartlar) femaDagilim[k.fema_faz]++
  const femaRenkler: Record<FemaFaz, string> = {
    'Önleme': '#22C55E', 'Koruma': '#14B8A6', 'Zarar Azaltma': '#F59E0B', 'Müdahale': '#F97316', 'İyileştirme': '#EF4444',
  }
  const femaData = Object.entries(femaDagilim).map(([label, value]) => ({
    label, value, renk: femaRenkler[label as FemaFaz],
  }))

  // Sprint günü
  const bugunSprintGunu = Math.min(SPRINT_SURE, Math.max(0,
    Math.floor((Date.now() - SPRINT_BASLANGIC.getTime()) / 86400000)
  ))
  const sprintIlerlemePct = Math.round((bugunSprintGunu / SPRINT_SURE) * 100)

  const kart: React.CSSProperties = {
    background: 'white', borderRadius: 16, padding: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F1F0EF',
  }
  const kTitre: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif", padding: 20 }}>

      {modalAcik && (
        <YeniKartModal facilities={facilities} onEkle={kartEkle} onKapat={() => setModalAcik(false)} />
      )}

      {/* ── BAŞLIK ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Zap size={18} color={TEAL} />
            <h1 style={{ fontSize: 20, fontWeight: 800, color: NAVY, letterSpacing: '-0.02em' }}>omniSPRINT</h1>
            <span style={{ fontSize: 11, background: '#DCFCE7', color: '#15803D', borderRadius: 99, padding: '3px 10px', fontWeight: 700 }}>Sprint 1 Aktif</span>
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF' }}>Çevik Dayanıklılık Sprint Panosu — TOC · HRO · FEMA</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={pdfIndir} disabled={indiriyor}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'transparent', color: '#6B7280', border: '1px solid #E5E3E1', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: indiriyor ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif", opacity: indiriyor ? 0.7 : 1 }}>
            <Download size={14} /> {indiriyor ? 'Hazirlaniyor…' : 'Sprint Raporu'}
          </button>
          <button onClick={() => setModalAcik(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: TEAL, color: 'white', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
            <Plus size={15} /> Kart Ekle
          </button>
        </div>
      </div>

      {/* ── BÖLÜM 1: SPRINT PLANLAMA ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14, marginBottom: 20 }}>

        {/* Sprint bilgisi */}
        <div style={kart}>
          <p style={kTitre}>Aktif Sprint</p>
          <p style={{ fontSize: 16, fontWeight: 800, color: NAVY, marginBottom: 8 }}>
            Sprint 1 — 19 Mart · 3 Nisan 2026
          </p>

          {hedefDuzenle ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={sprintHedef} onChange={e => setSprintHedef(e.target.value)}
                style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: `1px solid ${TEAL}`, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: 'none' }}
                autoFocus
              />
              <button onClick={() => { localStorage.setItem('omniSPRINT_hedef', sprintHedef); setHedefDuzenle(false) }}
                style={{ padding: '7px 14px', background: TEAL, color: 'white', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>
                Kaydet
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setHedefDuzenle(true)}>
              <Target size={13} color={TEAL} />
              <span style={{ fontSize: 13, color: '#374151', fontStyle: 'italic' }}>&quot;{sprintHedef}&quot;</span>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>(düzenle)</span>
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6B7280', marginBottom: 5 }}>
              <span>Sprint İlerlemesi</span>
              <span>Gün {bugunSprintGunu} / {SPRINT_SURE} — %{sprintIlerlemePct}</span>
            </div>
            <div style={{ height: 6, background: '#F1F0EF', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${sprintIlerlemePct}%`, background: TEAL, borderRadius: 99, transition: 'width .3s' }} />
            </div>
          </div>
        </div>

        {/* Velocity */}
        <div style={{ ...kart, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p style={kTitre}>Velocity</p>
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: TEAL }}>{tamamlananlar.length}</span>
            <span style={{ fontSize: 18, color: '#9CA3AF' }}>/{kartlar.length}</span>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Aksiyon tamamlandı</p>
          </div>
          <div style={{ background: '#F8F9FA', borderRadius: 10, padding: '8px 12px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#6B7280' }}>Yapılıyor</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: wipIhlal ? '#EF4444' : '#374151' }}>
              {yapiliyorlar.length} {wipIhlal ? '⚠' : ''}
            </span>
          </div>
        </div>

        {/* FEMA Dağılımı */}
        <div style={kart}>
          <p style={kTitre}>FEMA Faz Dağılımı</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <PieChart data={femaData} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
              {femaData.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.renk, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#374151' }}>{d.label}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: NAVY }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── WIP İhlal Uyarısı ──────────────────────────────────── */}
      {wipIhlal && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={16} color="#B91C1C" />
          <span style={{ fontSize: 13, color: '#B91C1C', fontWeight: 600 }}>
            WIP İhlali: &quot;Yapılıyor&quot; sütununda {yapiliyorlar.length} kart var (limit: 3). Lütfen bir aksiyon tamamlayın veya geri alın.
          </span>
        </div>
      )}

      {/* ── BÖLÜM 2: KANBAN BOARD ───────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {SUTUNLAR.map(sutun => {
          const sutunKartlar = kartlar.filter(k => k.sutun === sutun.id)
          const isWipSutun   = sutun.id === 'yapiliyor'
          const wipAsiyor    = isWipSutun && sutunKartlar.length > 3
          return (
            <div key={sutun.id}>
              {/* Sütun başlığı */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 10, padding: '8px 12px',
                background: wipAsiyor ? '#FEF2F2' : 'white',
                borderRadius: 10, border: `1px solid ${wipAsiyor ? '#FECACA' : '#E5E3E1'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: sutun.renk }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{sutun.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {isWipSutun && (
                    <span style={{ fontSize: 10, color: wipAsiyor ? '#B91C1C' : '#9CA3AF', fontWeight: 600 }}>
                      WIP {sutunKartlar.length}/3
                    </span>
                  )}
                  <span style={{ fontSize: 11, background: '#F1F0EF', color: '#6B7280', borderRadius: 99, padding: '2px 8px', fontWeight: 600 }}>
                    {sutunKartlar.length}
                  </span>
                </div>
              </div>

              {/* Kartlar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
                {yukleniyor && sutunKartlar.length === 0 && sutun.id === 'backlog' && (
                  <div style={{ background: 'white', borderRadius: 12, padding: 12, textAlign: 'center', color: '#9CA3AF', fontSize: 12, border: '1px solid #E5E3E1' }}>
                    Yükleniyor...
                  </div>
                )}
                {sutunKartlar.map(krt => {
                  const onc = ONCELIK_RENKLER[krt.oncelik]
                  const fema = FEMA_RENKLER[krt.fema_faz]
                  const sirali: KanbanSutun[] = ['backlog', 'yapiliyor', 'incelemede', 'tamamlandi']
                  const pos = sirali.indexOf(krt.sutun)
                  return (
                    <div key={krt.id} style={{
                      background: 'white', borderRadius: 12, padding: 12,
                      border: '1px solid #E5E3E1', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'box-shadow .15s',
                    }}>
                      {/* Başlık satırı */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ flex: 1, marginRight: 6 }}>
                          <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>{krt.risk_id}</span>
                          <p style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginTop: 1, lineHeight: 1.35 }}>{krt.tesis_adi}</p>
                        </div>
                        <button onClick={() => kartSil(krt.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E5E3E1', padding: 2, lineHeight: 1, flexShrink: 0 }}>
                          <X size={12} />
                        </button>
                      </div>

                      {/* Badge satırı */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: onc.bg, color: onc.text }}>
                          <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: onc.dot, marginRight: 3, verticalAlign: 'middle' }} />
                          {krt.oncelik}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 6, background: fema.bg, color: fema.text }}>
                          {krt.fema_faz}
                        </span>
                        {krt.near_miss_kaynakli && (
                          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 6, background: '#FFF7ED', color: '#C2410C' }}>
                            NM
                          </span>
                        )}
                      </div>

                      {/* Metrikler */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 8 }}>
                        <div style={{ background: '#F8F9FA', borderRadius: 6, padding: '4px 7px' }}>
                          <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600 }}>TOC / B</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: krt.b_degeri >= 2 ? '#EF4444' : '#374151' }}>{krt.b_degeri.toFixed(1)}</div>
                        </div>
                        <div style={{ background: '#F8F9FA', borderRadius: 6, padding: '4px 7px' }}>
                          <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600 }}>Squad</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{krt.squad}</div>
                        </div>
                      </div>

                      {/* URI etkisi */}
                      <div style={{ background: '#F0FDFA', borderRadius: 6, padding: '4px 8px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <TrendingUp size={10} color={TEAL} />
                        <span style={{ fontSize: 10, color: TEAL, fontWeight: 700 }}>URI +{krt.uri_etki} puan</span>
                        <span style={{ fontSize: 10, color: '#6B7280' }}>tamamlanırsa</span>
                      </div>

                      {/* Taşı butonları */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                        <button onClick={() => tasiFn(krt.id, 'geri')} disabled={pos === 0}
                          style={{ flex: 1, padding: '5px 0', borderRadius: 7, border: '1px solid #E5E3E1', background: 'white', cursor: pos === 0 ? 'not-allowed' : 'pointer', color: pos === 0 ? '#D1D5DB' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ChevronLeft size={13} />
                        </button>
                        <button onClick={() => tasiFn(krt.id, 'ileri')} disabled={pos === 3}
                          style={{ flex: 1, padding: '5px 0', borderRadius: 7, border: `1px solid ${pos === 3 ? '#E5E3E1' : TEAL}`, background: pos === 3 ? 'white' : '#F0FDFA', cursor: pos === 3 ? 'not-allowed' : 'pointer', color: pos === 3 ? '#D1D5DB' : TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  )
                })}

                {/* Boş sütun placeholder */}
                {sutunKartlar.length === 0 && !yukleniyor && (
                  <div style={{ border: '2px dashed #E5E3E1', borderRadius: 12, padding: '20px 12px', textAlign: 'center', color: '#D1D5DB', fontSize: 11 }}>
                    Kart yok
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── BÖLÜM 3: SPRINT METRİKLERİ ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>

        {/* Burndown */}
        <div style={kart}>
          <p style={kTitre}>Burndown Chart — Sprint 1 (15 Gün)</p>
          <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="#E5E3E1" strokeWidth="1.5" strokeDasharray="4,2" /></svg>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>İdeal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={TEAL} strokeWidth="2" /></svg>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>Gerçek</span>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 10, color: '#6B7280' }}>
              Gün {bugunSprintGunu} / {SPRINT_SURE} · {kartlar.length - tamamlananlar.length} aksiyon kaldı
            </div>
          </div>
          <BurndownChart toplamKart={kartlar.length} tamamlananSayisi={tamamlananlar.length} />
        </div>

        {/* KPI Kartları */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          <div style={{ ...kart, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Clock size={14} color="#6B7280" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ort. Cycle Time</span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: NAVY }}>
              {ortCycleTime !== null ? `${ortCycleTime} gün` : '—'}
            </p>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
              {cycleTimeler.length > 0 ? `${cycleTimeler.length} tamamlanan kart ortalaması` : 'Henüz tamamlanan kart yok'}
            </p>
          </div>

          <div style={{ ...kart, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Flame size={14} color="#F97316" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Near Miss → Sprint</span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: NAVY }}>%{donusumOrani}</p>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
              {nearMissKarti} near-miss kaynaklı kart / {kartlar.length} toplam
            </p>
          </div>

          <div style={{ ...kart, padding: 16, background: wipIhlal ? '#FEF2F2' : 'white', borderColor: wipIhlal ? '#FECACA' : '#F1F0EF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <AlertTriangle size={14} color={wipIhlal ? '#B91C1C' : '#6B7280'} />
              <span style={{ fontSize: 11, fontWeight: 700, color: wipIhlal ? '#B91C1C' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>WIP Durumu</span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: wipIhlal ? '#B91C1C' : '#22C55E' }}>
              {wipIhlal ? 'İHLAL' : 'Normal'}
            </p>
            <p style={{ fontSize: 11, color: wipIhlal ? '#B91C1C' : '#9CA3AF', marginTop: 2 }}>
              {yapiliyorlar.length}/3 WIP limiti {wipIhlal ? 'aşıldı' : 'uygun'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
