'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Loader2, Download, AlertTriangle, TrendingUp, Shield, Zap } from 'lucide-react'
import { createAssessment, type OmniAssessment, RISK_CLASS_TR, RISK_CLASS_COLOR } from '@/lib/api'

const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI'
)
const TENANT = '11111111-0000-0000-0000-000000000001'
const NAVY   = '#0A1628'
const TEAL   = '#009B8D'

interface ExtraData {
  neighborhood?: string
  H_score?: number
  F_score?: number
  X_score?: number
  C_score?: number
  hazmat_flag?: boolean
  natech_risk?: number
  risk_deprem?: number
  risk_sel?: number
  [k: string]: unknown
}
interface Facility {
  id: string
  name: string
  sector: string
  employee_count: number | null
  operates_24h: boolean
  extra_data: ExtraData | null
}
type SkorDurum =
  | { s: 'idle' }
  | { s: 'loading' }
  | { s: 'error'; msg: string }
  | { s: 'ok'; data: OmniAssessment }

type Filtre = 'hepsi' | 'kritik' | 'natech' | 'dusuk_hro'

function uriRenk(uri: number) {
  if (uri < 40) return '#EF4444'
  if (uri < 60) return '#F97316'
  if (uri < 75) return '#F59E0B'
  return '#22C55E'
}
function fazLabel(uri: number, isNatech = false) {
  // NATECH tesisleri bir üst aciliyet seviyesine çekilir
  const effectiveUri = isNatech ? uri - 7 : uri
  if (effectiveUri > 90) return 'Prevention'
  if (effectiveUri > 85) return 'Protection'
  if (effectiveUri > 80) return 'Mitigation'
  if (effectiveUri > 75) return 'Response'
  return 'Recovery'
}
function fazRenk(uri: number, isNatech = false) {
  const label = fazLabel(uri, isNatech)
  if (label === 'Prevention')  return { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' }
  if (label === 'Protection')  return { bg: '#ECFDF5', border: '#A7F3D0', text: '#0F766E' }
  if (label === 'Mitigation')  return { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' }
  if (label === 'Response')    return { bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C' }
  return { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C' }
}
function aksiyonOneri(uri: number, hroAlpha: number, sector: string, bScore: number, isNatech: boolean) {
  // NATECH öncelikli
  if (isNatech && uri < 85) return 'NATECH Emergency Action Plan'
  if (isNatech && uri >= 85) return 'Schedule NATECH Drill'
  // Sektör bazlı
  if (sector === 'HOSPITAL' && uri < 83) return 'Critical Patient Capacity BCP'
  if (sector === 'EDUCATION') return 'Update Evacuation Plan'
  if (sector === 'MUNICIPALITY' && bScore >= 1.5) return 'Conduct Bottleneck Analysis'
  if (sector === 'BANK') return 'Revise RTO/RPO Targets'
  // URI eşikli
  if (uri < 78) return 'Develop Emergency BCP'
  if (uri <= 82) return 'Schedule Drill'
  if (uri <= 86) return 'Evaluate Capacity Investment'
  return 'Periodic Monitoring Sufficient'
}
function sektorCarpan(sector: string) {
  if (sector === 'INDUSTRIAL') return 1.5
  if (sector === 'HOSPITAL')   return 2.0
  if (sector === 'BANK')       return 3.0
  return 1.0
}

// Turkish character transliteration for PDF (helvetica doesn't support Turkish)
const trPdf = (s: string) => String(s ?? '')
  .replace(/ş/g,'s').replace(/Ş/g,'S').replace(/ğ/g,'g').replace(/Ğ/g,'G')
  .replace(/ü/g,'u').replace(/Ü/g,'U').replace(/ö/g,'o').replace(/Ö/g,'O')
  .replace(/ı/g,'i').replace(/İ/g,'I').replace(/ç/g,'c').replace(/Ç/g,'C')

export default function YGGPano() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading]       = useState(true)
  const [skorlar, setSkorlar]       = useState<Record<string, SkorDurum>>({})
  const [filtre, setFiltre]         = useState<Filtre>('hepsi')
  const [autoCalc, setAutoCalc]     = useState(false)
  const [indiriyor, setIndiriyor]   = useState(false)

  useEffect(() => {
    sb.from('facilities')
      .select('id,name,sector,employee_count,operates_24h,extra_data')
      .eq('tenant_id', TENANT)
      .eq('is_active', true)
      .limit(200)
      .then(({ data, error }) => {
        if (!error && data) setFacilities(data as Facility[])
        setLoading(false)
      })
  }, [])

  const hesapla = async (f: Facility) => {
    setSkorlar(p => ({ ...p, [f.id]: { s: 'loading' } }))
    const ex       = f.extra_data ?? {}
    const deprem   = ((ex.risk_deprem ?? ex.H_score ?? 2.5) as number)
    const sel      = ((ex.risk_sel ?? 1.5) as number)
    const natech   = ((ex.natech_risk ?? 1.0) as number)
    const primaryH = natech >= deprem && natech >= sel ? 'natech' : deprem >= sel ? 'deprem' : 'sel'
    try {
      const res = await createAssessment({
        facility_id:      f.id,
        bottleneck_score: ex.hazmat_flag ? 2.5 : 1.2,
        near_miss_count:  0,
        primary_hazard:   primaryH,
        hazard: {
          seismic:      Math.min(100, deprem * 20),
          flood:        Math.min(100, sel    * 20),
          supply_chain: Math.min(100, natech * 20),
        },
        fragility: ex.F_score != null ? {
          building_age_score:   Math.min(100, (ex.F_score as number) * 20),
          construction_quality: Math.min(100, (ex.F_score as number) * 20),
        } : undefined,
        exposure: {
          population_at_risk:         f.employee_count ?? 100,
          asset_criticality:          ex.X_score != null ? Math.min(1, (ex.X_score as number) / 5) : 0.5,
          serves_critical_population: f.operates_24h,
        },
        response: ex.C_score != null ? {
          bcm_plan_exists:          (ex.C_score as number) >= 2,
          plan_tested_last_12m:     (ex.C_score as number) >= 3,
          drill_frequency_per_year: Math.round(ex.C_score as number),
          crisis_team_exists:       (ex.C_score as number) >= 3,
        } : undefined,
      })
      setSkorlar(p => ({ ...p, [f.id]: { s: 'ok', data: res } }))
    } catch (e: unknown) {
      setSkorlar(p => ({ ...p, [f.id]: { s: 'error', msg: e instanceof Error ? e.message : 'Hata' } }))
    }
  }

  const hesaplaHepsi = () => {
    setAutoCalc(true)
    facilities.forEach((f, i) => {
      setTimeout(() => hesapla(f), i * 300)
    })
  }

  async function pdfIndir() {
    setIndiriyor(true)
    try {
      const { jsPDF } = await import('jspdf')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { default: autoTable } = await import('jspdf-autotable') as any
      const doc = new jsPDF('p', 'mm', 'a4')
      const W = 210; const H = 297; const ml = 18; const mr = 18

      // ── KAPAK SAYFASI ──────────────────────────────────────────
      doc.setFillColor(10, 22, 40)
      doc.rect(0, 0, W, H, 'F')
      doc.setFillColor(0, 155, 141)
      doc.rect(0, H / 2 - 45, W, 2.5, 'F')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(30)
      doc.setTextColor(232, 201, 122)
      doc.text('OMNIVERSEL', W / 2, 80, { align: 'center' })

      doc.setFillColor(0, 155, 141)
      doc.rect(65, 88, 80, 1.2, 'F')

      doc.setFontSize(16)
      doc.setTextColor(255, 255, 255)
      doc.text('YGG Yonetici Panosu Raporu', W / 2, 102, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(148, 163, 184)
      doc.text('TOC Darboğaz · HRO Olgunluk · MTPD · FEMA Fazlama · omniRISK HFER-720', W / 2, 113, { align: 'center' })

      doc.setFontSize(11)
      doc.setTextColor(255, 255, 255)
      doc.text(new Date().toLocaleDateString('tr-TR'), W / 2, 140, { align: 'center' })
      doc.setFontSize(8.5)
      doc.setTextColor(100, 116, 139)
      doc.text('Omniversel Platform · omniRISK Motoru', W / 2, 151, { align: 'center' })

      // Kapak alt bandı
      doc.setFillColor(0, 155, 141)
      doc.rect(0, H - 28, W, 28, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(255, 255, 255)
      doc.text('Omniversel · omniRISK Motoru · ISO 22301 · HFER-720', W / 2, H - 14, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(186, 230, 253)
      doc.text(`Olusturma: ${new Date().toLocaleString('tr-TR')}`, W / 2, H - 7, { align: 'center' })

      // ── SAYFA 2: KPI ÖZETİ ──────────────────────────────────
      doc.addPage()

      // Sayfa başlığı
      doc.setFillColor(10, 22, 40)
      doc.rect(0, 0, W, 18, 'F')
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(232, 201, 122)
      doc.text('OMNIVERSEL', ml, 12)
      doc.setFont('helvetica', 'normal'); doc.setTextColor(148, 163, 184)
      doc.text('YGG Yonetici Panosu', W - mr, 12, { align: 'right' })

      let y = 28
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(10, 22, 40)
      doc.text('Portfoy Ozeti', ml, y); y += 3
      doc.setFillColor(0, 155, 141); doc.rect(ml, y, 42, 0.8, 'F'); y += 9

      // KPI kutuları
      const kpiList = [
        { label: 'Portfoy URI', value: `${kpi.avgUri}`, sub: `${hesaplanan}/${toplam} hesaplandi` },
        { label: 'Kritik Darboğaz', value: `${kpi.kritikB}`, sub: 'B > 2.0 tesis' },
        { label: 'Toplam MTPD', value: `${(kpi.toplamMtpd / 1e6).toFixed(1)}M`, sub: 'TL gunluk koruma' },
        { label: 'HRO Uyarisi', value: `${kpi.dusukHro}`, sub: 'Dusuk HRO (α<1.0)' },
      ]
      const kW = 40; const kH = 26; const kGap = 5
      kpiList.forEach((item, i) => {
        const x = ml + i * (kW + kGap)
        doc.setFillColor(248, 249, 250)
        doc.roundedRect(x, y, kW, kH, 2, 2, 'F')
        doc.setFillColor(0, 155, 141)
        doc.rect(x, y, kW, 2.5, 'F')
        doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(10, 22, 40)
        doc.text(trPdf(item.value), x + kW / 2, y + 16, { align: 'center' })
        doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(107, 114, 128)
        doc.text(trPdf(item.label), x + kW / 2, y + 21, { align: 'center' })
        doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(156, 163, 175)
        doc.text(trPdf(item.sub), x + kW / 2, y + 25, { align: 'center' })
      })
      y += kH + 14

      // ── Tesis Tablosu ────────────────────────────────────────
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(10, 22, 40)
      doc.text('Tesis Degerlendirme Tablosu', ml, y); y += 3
      doc.setFillColor(0, 155, 141); doc.rect(ml, y, 55, 0.8, 'F'); y += 5

      const tableRows = satirlar
        .filter(f => skorlar[f.id]?.s === 'ok')
        .map(f => {
          const sk = skorlar[f.id] as Extract<SkorDurum, { s: 'ok' }>
          const uri = Math.round(sk.data.uri_score)
          const isNatech = !!f.extra_data?.hazmat_flag
          const mtpd = ((f.employee_count ?? 0) * 850 * 8 * sektorCarpan(f.sector) / 1_000_000).toFixed(1)
          return [
            trPdf(f.name),
            uri.toString(),
            trPdf(sk.data.risk_class || '—'),
            `${mtpd}M`,
            trPdf(fazLabel(uri, isNatech)),
            trPdf(aksiyonOneri(uri, sk.data.hro_alpha ?? 0.8, f.sector, sk.data.bottleneck_score ?? 1, isNatech)),
          ]
        })

      if (tableRows.length === 0) {
        doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(156, 163, 175)
        doc.text('Hesaplanmis tesis bulunamadi. Once portfoyu hesaplayin.', ml, y + 8)
      } else {
        autoTable(doc, {
          startY: y,
          margin: { left: ml, right: mr },
          head: [['Tesis Adi', 'URI', 'Risk Sinifi', 'MTPD', 'FEMA Fazi', 'Onerilen Aksiyon']],
          body: tableRows,
          headStyles: { fillColor: [10, 22, 40], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
          bodyStyles: { fontSize: 7.5, cellPadding: 2.5 },
          alternateRowStyles: { fillColor: [248, 249, 250] },
          styles: { font: 'helvetica', overflow: 'linebreak' },
          columnStyles: {
            0: { cellWidth: 38 },
            1: { cellWidth: 11, halign: 'center' },
            2: { cellWidth: 24 },
            3: { cellWidth: 16, halign: 'right' },
            4: { cellWidth: 18 },
            5: { cellWidth: 'auto' },
          },
        })
      }

      // Alt bilgi tüm sayfalara
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pc = (doc as any).getNumberOfPages()
      for (let i = 2; i <= pc; i++) {
        doc.setPage(i)
        doc.setFontSize(7); doc.setTextColor(156, 163, 175)
        doc.text('Omniversel · omniRISK · ISO 22301 · HFER-720', W / 2, H - 8, { align: 'center' })
        doc.text(`Sayfa ${i}/${pc}`, W - mr, H - 8, { align: 'right' })
        doc.text(new Date().toLocaleDateString('tr-TR'), ml, H - 8)
      }

      doc.save(`YGG-Raporu-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setIndiriyor(false)
    }
  }

  const satirlar = useMemo(() => {
    return facilities.filter(f => {
      const sk = skorlar[f.id]
      const uri  = sk?.s === 'ok' ? sk.data.uri_score  : null
      const hro  = sk?.s === 'ok' ? (sk.data.hro_alpha ?? 0.8) : null
      const b    = sk?.s === 'ok' ? (sk.data.bottleneck_score ?? 1.0) : null
      if (filtre === 'kritik')    return uri !== null && uri < 50
      if (filtre === 'natech')    return !!f.extra_data?.hazmat_flag
      if (filtre === 'dusuk_hro') return hro !== null && hro < 1.0
      return true
    })
  }, [facilities, skorlar, filtre])

  const okSkorlar = useMemo(() =>
    facilities.map(f => skorlar[f.id]).filter(s => s?.s === 'ok') as Extract<SkorDurum, { s: 'ok' }>[],
  [facilities, skorlar])

  const kpi = useMemo(() => {
    const urilar = okSkorlar.map(s => s.data.uri_score)
    const avgUri = urilar.length ? urilar.reduce((a, b) => a + b, 0) / urilar.length : 0
    const kritikB = okSkorlar.filter(s => (s.data.bottleneck_score ?? 1) > 2.0).length
    const toplamMtpd = facilities.reduce((sum, f) => sum + (f.employee_count ?? 0) * 850 * 8 * sektorCarpan(f.sector), 0)
    const dusukHro = okSkorlar.filter(s => (s.data.hro_alpha ?? 0.8) < 1.0).length
    return { avgUri: Math.round(avgUri), kritikB, toplamMtpd, dusukHro }
  }, [okSkorlar, facilities])

  const hesaplanan = okSkorlar.length
  const toplam     = facilities.length

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ background: NAVY, padding: '20px 32px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>Executive Dashboard (YGG)</h1>
            <p style={{ color: '#94A3B8', fontSize: 11, marginTop: 3 }}>
              Facility-based URI Score · FEMA Phase Mapping · Action Recommendations
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {loading ? (
              <span style={{ color: '#94A3B8', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Loader2 style={{ width: 14, height: 14 }} className="animate-spin"/> Loading…
              </span>
            ) : (
              <span style={{ color: '#4ADE80', fontSize: 12, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 8, padding: '4px 12px' }}>
                {toplam} tesis · {hesaplanan} skorlandı
              </span>
            )}
            <button
              onClick={hesaplaHepsi}
              disabled={loading || autoCalc}
              style={{ background: TEAL, color: 'white', border: 'none', borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: loading || autoCalc ? 'not-allowed' : 'pointer', opacity: autoCalc ? 0.7 : 1 }}
            >
              {autoCalc ? '⏳ Calculating…' : ' Auto Calculate'}
            </button>
            <button
              onClick={pdfIndir}
              disabled={indiriyor}
              style={{ background: 'transparent', color: '#E8C97A', border: '1px solid rgba(232,201,122,.3)', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: indiriyor ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: indiriyor ? 0.7 : 1 }}
            >
              <Download style={{ width: 14, height: 14 }}/> {indiriyor ? 'Preparing…' : 'PDF Report'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 32px' }}>

        {/* KPI Kartları */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { icon: <TrendingUp style={{ width: 18, height: 18 }}/>, label: 'Portfolio URI Average', val: hesaplanan ? `${kpi.avgUri}` : '—', sub: `${hesaplanan}/${toplam} scored`, renk: uriRenk(kpi.avgUri), bg: '#F0FDF4' },
            { icon: <AlertTriangle style={{ width: 18, height: 18 }}/>, label: 'Critical Bottleneck (B>2)', val: `${kpi.kritikB}`, sub: 'High TOC multiplier facility', renk: '#F97316', bg: '#FFF7ED' },
            { icon: <Zap style={{ width: 18, height: 18 }}/>, label: 'Total Daily MTPD', val: kpi.toplamMtpd.toLocaleString('tr-TR') + ' ₺', sub: 'Sector-weighted', renk: '#6366F1', bg: '#EEF2FF' },
            { icon: <Shield style={{ width: 18, height: 18 }}/>, label: 'Low HRO Warning', val: `${kpi.dusukHro}`, sub: 'Facilities with α < 1.0', renk: '#EF4444', bg: '#FEF2F2' },
          ].map(k => (
            <div key={k.label} style={{ background: 'white', borderRadius: 16, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #F1F0EF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ background: k.bg, color: k.renk, padding: 8, borderRadius: 10 }}>{k.icon}</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</span>
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, color: k.renk, margin: '0 0 4px', fontFamily: 'monospace' }}>{k.val}</p>
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Filtre bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
          {([
            { key: 'hepsi',    label: 'All' },
            { key: 'kritik',   label: ' Critical (URI<50)' },
            { key: 'natech',   label: '⚠ NATECH' },
            { key: 'dusuk_hro', label: '🛡 Low HRO (α<1.0)' },
          ] as { key: Filtre; label: string }[]).map(f => (
            <button key={f.key} onClick={() => setFiltre(f.key)}
              style={{
                fontSize: 12, padding: '6px 14px', borderRadius: 20,
                border: `1px solid ${filtre === f.key ? TEAL : '#E5E3E1'}`,
                background: filtre === f.key ? TEAL : 'white',
                color: filtre === f.key ? 'white' : '#6B7280',
                fontWeight: filtre === f.key ? 700 : 400, cursor: 'pointer',
              }}>
              {f.label}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9CA3AF' }}>{satirlar.length} facilities shown</span>
        </div>

        {/* Ana Tablo */}
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #F1F0EF', overflow: 'hidden' }}>

          {/* Tablo başlığı */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 90px 130px 90px 110px 110px 160px 140px', padding: '10px 20px', background: '#F8F9FA', borderBottom: '1px solid #F1F0EF', gap: 8 }}>
            {['Facility','HRO Signal','MTPD (Daily)','Bottleneck B','URI Score','FEMA Phase','Action','Recovered Value'].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>

          {loading && (
            <div style={{ padding: 48, textAlign: 'center', color: '#9CA3AF' }}>
              <Loader2 style={{ width: 24, height: 24, margin: '0 auto 8px' }} className="animate-spin"/>
              <p style={{ fontSize: 13 }}>Loading facility data…</p>
            </div>
          )}

          {!loading && satirlar.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
              No facilities match the selected filter.
            </div>
          )}

          <div>
            {satirlar.map(f => {
              const sk      = skorlar[f.id]
              const isOk    = sk?.s === 'ok'
              const uri     = isOk ? (sk as Extract<SkorDurum,{s:'ok'}>).data.uri_score     : null
              const hro     = isOk ? ((sk as Extract<SkorDurum,{s:'ok'}>).data.hro_alpha ?? 0.8) : null
              const bScore  = isOk ? ((sk as Extract<SkorDurum,{s:'ok'}>).data.bottleneck_score ?? 1.0) : null
              const rClass  = isOk ? (sk as Extract<SkorDurum,{s:'ok'}>).data.risk_class  : null
              const isNatech = !!f.extra_data?.hazmat_flag
              const carpan   = sektorCarpan(f.sector)
              const mtpd     = (f.employee_count ?? 0) * 850 * 8 * carpan
              const kurtarilan = isOk && uri !== null ? Math.round(mtpd * (1 - uri / 100) * 0.1) : null

              return (
                <div key={f.id}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 90px 130px 90px 110px 110px 160px 140px', padding: '14px 20px', borderBottom: '1px solid #F9F8F7', gap: 8, alignItems: 'center' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F9F8F7')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Kısıt Noktası */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{f.name}</span>
                      {f.extra_data?.hazmat_flag && (
                        <span style={{ fontSize: 10, background: '#FFF7ED', border: '1px solid #FED7AA', color: '#C2410C', padding: '1px 6px', borderRadius: 4 }}>⚠ NATECH</span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>{f.extra_data?.neighborhood ?? '—'} · {f.sector}</span>
                  </div>

                  {/* HRO Sinyali */}
                  <div>
                    {sk?.s === 'loading' ? (
                      <Loader2 style={{ width: 14, height: 14, color: '#6366F1' }} className="animate-spin"/>
                    ) : hro !== null ? (
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: hro >= 1.0 ? '#16A34A' : '#DC2626' }}>
                          α {hro.toFixed(2)}
                        </span>
                        <div style={{ fontSize: 10, color: hro >= 1.0 ? '#16A34A' : '#DC2626' }}>
                          {hro >= 1.3 ? '● Mature' : hro >= 1.0 ? '● Good' : '● Warning'}
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => hesapla(f)}
                        style={{ fontSize: 11, color: '#6366F1', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}>
                        Calculate
                      </button>
                    )}
                  </div>

                  {/* MTPD */}
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', fontFamily: 'monospace' }}>
                      {mtpd.toLocaleString('tr-TR')} ₺
                    </span>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>{f.employee_count ?? 0} employees</div>
                  </div>

                  {/* Darboğaz B */}
                  <div>
                    {bScore !== null ? (
                      <span style={{
                        fontSize: 12, fontWeight: 700, fontFamily: 'monospace',
                        color: bScore > 2.0 ? '#DC2626' : bScore > 1.5 ? '#D97706' : '#16A34A',
                      }}>
                        {bScore.toFixed(1)}×
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: '#D1D5DB' }}>—</span>
                    )}
                  </div>

                  {/* URI Skoru */}
                  <div>
                    {uri !== null && rClass ? (
                      <div>
                        <span style={{
                          fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                          background: uriRenk(uri) + '18', border: `1px solid ${uriRenk(uri)}40`,
                          color: uriRenk(uri),
                        }}>
                          {uri.toFixed(1)}
                        </span>
                        <div style={{ fontSize: 10, color: RISK_CLASS_COLOR[rClass], marginTop: 2 }}>
                          {RISK_CLASS_TR[rClass]}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: '#D1D5DB' }}>—</span>
                    )}
                  </div>

                  {/* FEMA Fazı */}
                  <div>
                    {uri !== null ? (() => {
                      const faz = fazRenk(uri, isNatech)
                      return (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: faz.bg, border: `1px solid ${faz.border}`, color: faz.text }}>
                          {fazLabel(uri, isNatech)}
                        </span>
                      )
                    })() : <span style={{ fontSize: 12, color: '#D1D5DB' }}>—</span>}
                  </div>

                  {/* Önerilen Aksiyon */}
                  <div>
                    {uri !== null && hro !== null ? (
                      <span style={{ fontSize: 11, color: '#374151', background: '#F3F4F6', borderRadius: 6, padding: '3px 8px', display: 'inline-block' }}>
                        {aksiyonOneri(uri, hro, f.sector, bScore ?? 1.0, isNatech)}
                      </span>
                    ) : <span style={{ fontSize: 12, color: '#D1D5DB' }}>—</span>}
                  </div>

                  {/* Kurtarılan Değer */}
                  <div>
                    {kurtarilan !== null ? (
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#16A34A', fontFamily: 'monospace' }}>
                        +{kurtarilan.toLocaleString('tr-TR')} ₺
                      </span>
                    ) : <span style={{ fontSize: 12, color: '#D1D5DB' }}>—</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
