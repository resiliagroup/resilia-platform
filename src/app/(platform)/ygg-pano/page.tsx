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
  if (effectiveUri > 85) return 'Önleme'
  if (effectiveUri > 80) return 'Azaltma'
  if (effectiveUri > 75) return 'Hazırlık'
  return 'Müdahale'
}
function fazRenk(uri: number, isNatech = false) {
  const label = fazLabel(uri, isNatech)
  if (label === 'Önleme')  return { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' }
  if (label === 'Azaltma') return { bg: '#ECFDF5', border: '#A7F3D0', text: '#047857' }
  if (label === 'Hazırlık') return { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' }
  return { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C' }
}
function aksiyonOneri(uri: number, hroAlpha: number, sector: string, bScore: number, isNatech: boolean) {
  // NATECH öncelikli
  if (isNatech && uri < 85) return 'NATECH Acil Eylem Planı'
  if (isNatech && uri >= 85) return 'NATECH Tatbikat Planla'
  // Sektör bazlı
  if (sector === 'HOSPITAL' && uri < 83) return 'Kritik Hasta Kapasitesi BCP'
  if (sector === 'EDUCATION') return 'Tahliye Planı Güncelle'
  if (sector === 'MUNICIPALITY' && bScore >= 1.5) return 'Darboğaz Analizi Yap'
  if (sector === 'BANK') return 'RTO/RPO Hedef Revizyonu'
  // URI eşikli
  if (uri < 78) return 'Acil BCP Geliştir'
  if (uri <= 82) return 'Tatbikat Planla'
  if (uri <= 86) return 'Kapasite Yatırımı Değerlendir'
  return 'Periyodik İzleme Yeterli'
}
function sektorCarpan(sector: string) {
  if (sector === 'INDUSTRIAL') return 1.5
  if (sector === 'HOSPITAL')   return 2.0
  if (sector === 'BANK')       return 3.0
  return 1.0
}

export default function YGGPano() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading]       = useState(true)
  const [skorlar, setSkorlar]       = useState<Record<string, SkorDurum>>({})
  const [filtre, setFiltre]         = useState<Filtre>('hepsi')
  const [autoCalc, setAutoCalc]     = useState(false)

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
            <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>YGG Yönetici Panosu</h1>
            <p style={{ color: '#94A3B8', fontSize: 11, marginTop: 3 }}>
              TOC Darboğaz · HRO Olgunluk · MTPD · FEMA Fazlama — omniRISK HFER-720
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {loading ? (
              <span style={{ color: '#94A3B8', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Loader2 style={{ width: 14, height: 14 }} className="animate-spin"/> Yükleniyor…
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
              {autoCalc ? '⏳ Hesaplanıyor…' : '⚡ Tüm Portföyü Hesapla'}
            </button>
            <button
              onClick={() => alert('PDF raporu yakında — YGG raporlama modülü geliştiriliyor.')}
              style={{ background: 'transparent', color: '#E8C97A', border: '1px solid rgba(232,201,122,.3)', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download style={{ width: 14, height: 14 }}/> YGG Raporu İndir
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 32px' }}>

        {/* KPI Kartları */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { icon: <TrendingUp style={{ width: 18, height: 18 }}/>, label: 'Portföy URI Ortalaması', val: hesaplanan ? `${kpi.avgUri}` : '—', sub: `${hesaplanan}/${toplam} hesaplandı`, renk: uriRenk(kpi.avgUri), bg: '#F0FDF4' },
            { icon: <AlertTriangle style={{ width: 18, height: 18 }}/>, label: 'Kritik Darboğaz (B>2)', val: `${kpi.kritikB}`, sub: 'TOC çarpanı yüksek tesis', renk: '#F97316', bg: '#FFF7ED' },
            { icon: <Zap style={{ width: 18, height: 18 }}/>, label: 'Toplam Günlük MTPD', val: kpi.toplamMtpd.toLocaleString('tr-TR') + ' ₺', sub: 'Sektöre göre ağırlıklı', renk: '#6366F1', bg: '#EEF2FF' },
            { icon: <Shield style={{ width: 18, height: 18 }}/>, label: 'Düşük HRO Uyarısı', val: `${kpi.dusukHro}`, sub: 'α < 1.0 olan tesis', renk: '#EF4444', bg: '#FEF2F2' },
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
            { key: 'hepsi',    label: 'Tümü' },
            { key: 'kritik',   label: '🔴 Kritik (URI<50)' },
            { key: 'natech',   label: '⚠ NATECH' },
            { key: 'dusuk_hro', label: '🛡 Düşük HRO (α<1.0)' },
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
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9CA3AF' }}>{satirlar.length} tesis gösteriliyor</span>
        </div>

        {/* Ana Tablo */}
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #F1F0EF', overflow: 'hidden' }}>

          {/* Tablo başlığı */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 90px 130px 90px 110px 110px 160px 140px', padding: '10px 20px', background: '#F8F9FA', borderBottom: '1px solid #F1F0EF', gap: 8 }}>
            {['Kısıt Noktası','HRO Sinyali','MTPD (Günlük)','Darboğaz B','URI Skoru','FEMA Fazı','Önerilen Aksiyon','Kurtarılan Değer'].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>

          {loading && (
            <div style={{ padding: 48, textAlign: 'center', color: '#9CA3AF' }}>
              <Loader2 style={{ width: 24, height: 24, margin: '0 auto 8px' }} className="animate-spin"/>
              <p style={{ fontSize: 13 }}>Tesis verileri yükleniyor…</p>
            </div>
          )}

          {!loading && satirlar.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
              Filtreye uyan tesis bulunamadı.
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
                          {hro >= 1.3 ? '● Olgun' : hro >= 1.0 ? '● İyi' : '● Uyarı'}
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => hesapla(f)}
                        style={{ fontSize: 11, color: '#6366F1', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}>
                        Hesapla
                      </button>
                    )}
                  </div>

                  {/* MTPD */}
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', fontFamily: 'monospace' }}>
                      {mtpd.toLocaleString('tr-TR')} ₺
                    </span>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>{f.employee_count ?? 0} çalışan</div>
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
