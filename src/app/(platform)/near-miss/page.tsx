'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Loader2, CheckCircle, AlertTriangle, TrendingUp, Building2, Shield } from 'lucide-react'
import { createAssessment } from '@/lib/api'

const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI'
)
const TENANT = '11111111-0000-0000-0000-000000000001'
const NAVY   = '#0A1628'
const TEAL   = '#009B8D'

const KATEGORILER = [
  'Yangın Tehlikesi', 'Kimyasal Sızıntı', 'Yapısal Hasar',
  'Ekipman Arızası', 'İnsan Hatası', 'Doğal Tehlike', 'Siber/BT', 'Diğer',
]
const ACILIYET_RENKLER: Record<string, { bg: string; border: string; text: string }> = {
  'Düşük':  { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
  'Orta':   { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' },
  'Yüksek': { bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C' },
  'Kritik': { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C' },
}
const DURUM_RENKLER: Record<string, { bg: string; text: string }> = {
  open:         { bg: '#EEF2FF', text: '#4338CA' },
  investigating:{ bg: '#FFFBEB', text: '#92400E' },
  closed:       { bg: '#F0FDF4', text: '#166534' },
}
const DURUM_TR: Record<string, string> = {
  open: 'Açık', investigating: 'İnceleniyor', closed: 'Kapatıldı',
}

interface ExtraData {
  risk_deprem?: number; risk_sel?: number; natech_risk?: number
  H_score?: number; F_score?: number; X_score?: number; C_score?: number
  hazmat_flag?: boolean
  [k: string]: unknown
}
interface Facility {
  id: string; name: string
  sector?: string; employee_count?: number | null
  operates_24h?: boolean; extra_data?: ExtraData | null
}
interface NearMiss {
  id: string; facility_id: string; event_date: string
  category: string; urgency: string; status: string; description: string
}
interface HroSonuc { uri: number; alpha: number; facility_name: string }

const BOSH = {
  facility_id: '', event_date: '', category: '', location: '',
  description: '', potential_outcome: '',
  root_cause_1: '', root_cause_2: '', root_cause_3: '',
  repeated: false, urgency: 'Orta',
}

async function ensureTable() {
  try {
    await sb.rpc('exec_sql', {
      sql: `CREATE TABLE IF NOT EXISTS near_miss_events (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        tenant_id UUID,
        facility_id UUID,
        event_date TIMESTAMPTZ,
        category TEXT,
        location TEXT,
        description TEXT,
        potential_outcome TEXT,
        root_cause_1 TEXT,
        root_cause_2 TEXT,
        root_cause_3 TEXT,
        repeated BOOLEAN DEFAULT false,
        urgency TEXT,
        status TEXT DEFAULT 'open',
        created_at TIMESTAMPTZ DEFAULT now()
      );`,
    })
  } catch {/* rpc olmayabilir — tablo zaten varsa sorun yok */}
}

export default function NearMissPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [kayitlar,   setKayitlar]   = useState<NearMiss[]>([])
  const [form,       setForm]       = useState({ ...BOSH })
  const [kaydediyor, setKaydediyor] = useState(false)
  const [hata,       setHata]       = useState<string | null>(null)
  const [listeleme,  setListeleme]  = useState(true)

  // HRO yeniden hesaplama sonucu
  const [hroSonuc,       setHroSonuc]       = useState<HroSonuc | null>(null)
  const [hroHesaplaniyor,setHroHesaplaniyor] = useState(false)
  const [toastMesaj,     setToastMesaj]     = useState<string | null>(null)

  // KPI state
  const [kpiAy,         setKpiAy]         = useState(0)
  const [kpiFacility,   setKpiFacility]   = useState('—')
  const [kpiHroOrtalama,setKpiHroOrtalama]= useState<number | null>(null)

  const f = (k: keyof typeof BOSH, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  useEffect(() => {
    ensureTable()
    sb.from('facilities')
      .select('id,name,sector,employee_count,operates_24h,extra_data')
      .eq('tenant_id', TENANT)
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => { if (data) setFacilities(data as Facility[]) })
    yukleKayitlar()
    yukleKpi()
  }, [])

  function yukleKayitlar() {
    sb.from('near_miss_events')
      .select('id,facility_id,event_date,category,urgency,status,description')
      .eq('tenant_id', TENANT)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => { if (data) setKayitlar(data as NearMiss[]) })
  }

  async function yukleKpi() {
    const now = new Date()
    const ayBasi = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    // Bu ay kaç kayıt
    const { count } = await sb.from('near_miss_events')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', TENANT)
      .gte('created_at', ayBasi)
    setKpiAy(count ?? 0)

    // Tüm kayıtlar — en çok raporlayan tesis + HRO ortalama
    const { data: tumKayitlar } = await sb.from('near_miss_events')
      .select('facility_id')
      .eq('tenant_id', TENANT)
    if (!tumKayitlar) return

    // Facility başına sayım
    const sayimlar: Record<string, number> = {}
    for (const k of tumKayitlar) {
      sayimlar[k.facility_id] = (sayimlar[k.facility_id] ?? 0) + 1
    }

    // En çok raporlayan
    const maxId = Object.entries(sayimlar).sort((a, b) => b[1] - a[1])[0]?.[0]
    if (maxId) {
      const { data: fac } = await sb.from('facilities').select('name').eq('id', maxId).single()
      if (fac) setKpiFacility(fac.name)
    }

    // Ortalama HRO_α: near_miss > 0 olan tesisler → α=1.2, diğerleri → α=0.8
    const { data: tumFac } = await sb.from('facilities')
      .select('id')
      .eq('tenant_id', TENANT)
      .eq('is_active', true)
    if (tumFac && tumFac.length > 0) {
      const benzersizNearMiss = new Set(Object.keys(sayimlar))
      const hroTopla = tumFac.reduce((sum, fac) => {
        return sum + (benzersizNearMiss.has(fac.id) ? 1.2 : 0.8)
      }, 0)
      setKpiHroOrtalama(Math.round((hroTopla / tumFac.length) * 100) / 100)
    }
  }

  async function kaydet() {
    if (!form.facility_id || !form.category || !form.description) {
      setHata('Tesis, kategori ve açıklama zorunludur.')
      return
    }
    setKaydediyor(true); setHata(null); setHroSonuc(null)

    const { error } = await sb.from('near_miss_events').insert({
      tenant_id:         TENANT,
      facility_id:       form.facility_id,
      event_date:        form.event_date || new Date().toISOString(),
      category:          form.category,
      location:          form.location,
      description:       form.description,
      potential_outcome: form.potential_outcome,
      root_cause_1:      form.root_cause_1,
      root_cause_2:      form.root_cause_2,
      root_cause_3:      form.root_cause_3,
      repeated:          form.repeated,
      urgency:           form.urgency,
      status:            'open',
    })
    setKaydediyor(false)
    if (error) { setHata(error.message); return }

    // Başarılı → listeyi ve KPI'yı güncelle
    yukleKayitlar()
    yukleKpi()

    // Near Miss sayısını hesapla (mevcut + 1)
    const { count: mevcutSayi } = await sb.from('near_miss_events')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', TENANT)
      .eq('facility_id', form.facility_id)
    const yeniSayi = (mevcutSayi ?? 0)

    // Railway'e assessment gönder
    const fac = facilities.find(fc => fc.id === form.facility_id)
    const ex  = fac?.extra_data ?? {}
    const deprem = ((ex.risk_deprem ?? ex.H_score ?? 2.5) as number)
    const sel    = ((ex.risk_sel ?? 1.5) as number)
    const natech = ((ex.natech_risk ?? 1.0) as number)
    const primaryH = natech >= deprem && natech >= sel ? 'natech' : deprem >= sel ? 'deprem' : 'sel'

    setHroHesaplaniyor(true)
    setToastMesaj('Near Miss kaydedildi → Railway URI motoru tetiklendi → HRO skoru güncelleniyor...')

    // Railway webhook — arka planda URI yeniden hesapla (fire & forget)
    fetch('https://omniversel-risk-engine-production.up.railway.app/api/v1/webhooks/near-miss-trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        facility_id:      form.facility_id,
        near_miss_count:  yeniSayi,
        tenant_id:        TENANT,
      }),
    }).catch(() => {/* sessizce geç — background task */})

    // createAssessment: anlık HRO skoru UI'a yansıt
    try {
      const res = await createAssessment({
        facility_id:      form.facility_id,
        near_miss_count:  yeniSayi,
        tatbikat_var:     false,
        otonom_squad:     false,
        bottleneck_score: ex.hazmat_flag ? 2.5 : 1.2,
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
          population_at_risk: fac?.employee_count ?? 100,
          asset_criticality:  ex.X_score != null ? Math.min(1, (ex.X_score as number) / 5) : 0.5,
        },
        response: ex.C_score != null ? {
          bcm_plan_exists:          (ex.C_score as number) >= 2,
          plan_tested_last_12m:     (ex.C_score as number) >= 3,
          drill_frequency_per_year: Math.round(ex.C_score as number),
          crisis_team_exists:       (ex.C_score as number) >= 3,
        } : undefined,
      })
      const alpha = res.hro_alpha ?? 1.2
      setHroSonuc({ uri: res.uri_score, alpha, facility_name: fac?.name ?? '' })
      setToastMesaj(`Near Miss kaydedildi → Railway URI motoru tetiklendi → HRO α = ${alpha.toFixed(2)} ✓`)
    } catch {
      setToastMesaj('Near Miss kaydedildi → Railway URI motoru tetiklendi → HRO skoru güncelleniyor...')
    } finally {
      setHroHesaplaniyor(false)
    }

    setForm({ ...BOSH })
    setTimeout(() => setToastMesaj(null), 6000)
  }

  const inputSt: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '9px 12px',
    borderRadius: 10, border: '1px solid #E5E3E1', fontSize: 13,
    fontFamily: "'DM Sans',sans-serif", outline: 'none', background: 'white',
  }
  const labelSt: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5,
  }

  // KPI: bu ay kayıtlar
  const buAyKayitlar = kayitlar.filter(k => {
    if (!k.event_date) return false
    const d = new Date(k.event_date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Toast */}
      {toastMesaj && (
        <div style={{
          position: 'fixed', top: 20, right: 24, zIndex: 9999,
          background: '#0D1F3C', color: 'white', borderRadius: 12,
          padding: '14px 20px', fontSize: 13, fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,.25)',
          display: 'flex', alignItems: 'center', gap: 10, maxWidth: 420,
          borderLeft: '4px solid #22C55E',
        }}>
          <CheckCircle style={{ width: 16, height: 16, color: '#22C55E', flexShrink: 0 }}/>
          {toastMesaj}
        </div>
      )}

      {/* Header */}
      <div style={{ background: NAVY, padding: '20px 32px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>Near Miss Bildirim Modülü</h1>
            <p style={{ color: '#94A3B8', fontSize: 11, marginTop: 3 }}>HRO Beşinci İlkesi · Başarısızlıklara Hassasiyet · Ramak Kala Kayıt Sistemi</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['form', 'liste'] as const).map(s => (
              <button key={s} onClick={() => setListeleme(s === 'liste')}
                style={{
                  fontSize: 12, padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
                  background: (s === 'liste') === listeleme ? TEAL : 'transparent',
                  color:      (s === 'liste') === listeleme ? 'white' : '#94A3B8',
                  border: `1px solid ${(s === 'liste') === listeleme ? TEAL : 'rgba(148,163,184,.3)'}`,
                  fontWeight: 600,
                }}>
                {s === 'form' ? '+ Yeni Kayıt' : `📋 Son Kayıtlar (${kayitlar.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 32px' }}>

        {/* ── FORM ── */}
        {!listeleme && (
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #F1F0EF', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F0EF', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle style={{ width: 18, height: 18, color: '#F59E0B' }}/>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: NAVY, margin: 0 }}>Yeni Ramak Kala Olayı</h2>
            </div>

            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelSt}>Tesis *</label>
                  <select value={form.facility_id} onChange={e => f('facility_id', e.target.value)} style={inputSt}>
                    <option value="">— Tesis seçin —</option>
                    {facilities.map(fc => <option key={fc.id} value={fc.id}>{fc.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Olay Tarihi / Saati</label>
                  <input type="datetime-local" value={form.event_date} onChange={e => f('event_date', e.target.value)} style={inputSt}/>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelSt}>Olay Kategorisi *</label>
                  <select value={form.category} onChange={e => f('category', e.target.value)} style={inputSt}>
                    <option value="">— Kategori seçin —</option>
                    {KATEGORILER.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Aciliyet</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Düşük','Orta','Yüksek','Kritik'].map(a => {
                      const r = ACILIYET_RENKLER[a]
                      const aktif = form.urgency === a
                      return (
                        <button key={a} onClick={() => f('urgency', a)}
                          style={{ flex: 1, fontSize: 12, fontWeight: aktif ? 700 : 500, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
                            background: aktif ? r.bg : 'white', border: `1px solid ${aktif ? r.border : '#E5E3E1'}`, color: aktif ? r.text : '#6B7280' }}>
                          {a}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label style={labelSt}>Olay Lokasyonu (tesis içinde)</label>
                <input type="text" placeholder="ör. Depo B katı, Üretim Hattı 3, Sunucu Odası…" value={form.location} onChange={e => f('location', e.target.value)} style={inputSt}/>
              </div>

              <div>
                <label style={labelSt}>Kısa Açıklama *</label>
                <textarea rows={3} placeholder="Ne oldu? Kısaca özetleyin…" value={form.description} onChange={e => f('description', e.target.value)}
                  style={{ ...inputSt, resize: 'vertical' as const }}/>
              </div>

              <div>
                <label style={labelSt}>Potansiyel Sonuç</label>
                <textarea rows={2} placeholder="Bu olay önlenmeseydi ne olabilirdi?" value={form.potential_outcome} onChange={e => f('potential_outcome', e.target.value)}
                  style={{ ...inputSt, resize: 'vertical' as const }}/>
              </div>

              <div>
                <label style={labelSt}>Kök Neden Analizi (5 WHY — 3 adım)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(['root_cause_1','root_cause_2','root_cause_3'] as const).map((k, i) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, width: 52, flexShrink: 0 }}>
                        {i === 0 ? 'Neden?' : i === 1 ? 'Neden? (2)' : 'Neden? (3)'}
                      </span>
                      <input type="text" placeholder={`${i+1}. neden…`} value={form[k]} onChange={e => f(k, e.target.value)} style={{ ...inputSt, flex: 1 }}/>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelSt}>HRO: Bu olay daha önce de yaşandı mı?</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{ v: true, l: 'Evet' }, { v: false, l: 'Hayır' }].map(({ v, l }) => (
                    <button key={l} onClick={() => f('repeated', v)}
                      style={{ fontSize: 13, fontWeight: form.repeated === v ? 700 : 400, padding: '8px 24px', borderRadius: 8, cursor: 'pointer',
                        background: form.repeated === v ? (v ? '#FEF2F2' : '#F0FDF4') : 'white',
                        border: `1px solid ${form.repeated === v ? (v ? '#FECACA' : '#BBF7D0') : '#E5E3E1'}`,
                        color: form.repeated === v ? (v ? '#B91C1C' : '#15803D') : '#6B7280' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {hata && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', color: '#B91C1C', fontSize: 13 }}>
                  {hata}
                </div>
              )}

              <button onClick={kaydet} disabled={kaydediyor || hroHesaplaniyor}
                style={{ background: (kaydediyor || hroHesaplaniyor) ? '#9CA3AF' : TEAL, color: 'white', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, cursor: (kaydediyor || hroHesaplaniyor) ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {kaydediyor
                  ? <><Loader2 style={{ width: 16, height: 16 }} className="animate-spin"/> Kaydediliyor…</>
                  : hroHesaplaniyor
                  ? <><Loader2 style={{ width: 16, height: 16 }} className="animate-spin"/> HRO skoru güncelleniyor…</>
                  : '✓ Near Miss Kaydını Oluştur'}
              </button>

              {/* HRO Sonuç kartı */}
              {hroSonuc && (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <CheckCircle style={{ width: 16, height: 16, color: '#16A34A' }}/>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#15803D' }}>
                      {hroSonuc.facility_name} — HRO Skoru Güncellendi
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 24 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
                        HRO_α
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'monospace', color: '#16A34A' }}>
                        {hroSonuc.alpha.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
                        Yeni URI Skoru
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'monospace',
                                     color: hroSonuc.uri >= 80 ? '#16A34A' : hroSonuc.uri >= 60 ? '#D97706' : '#DC2626' }}>
                        {hroSonuc.uri.toFixed(1)}
                      </div>
                    </div>
                    <div style={{ alignSelf: 'center' }}>
                      <span style={{ fontSize: 12, color: '#15803D', background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 20, padding: '4px 14px', fontWeight: 600 }}>
                        Near Miss raporlama kültürü aktif
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── LİSTE ── */}
        {listeleme && (<>

          {/* KPI Kartları */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
            {[
              {
                icon: <TrendingUp style={{ width: 18, height: 18 }}/>,
                label: 'Bu Ay Near Miss',
                val: String(kpiAy),
                sub: `${new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}`,
                renk: '#F97316', bg: '#FFF7ED',
              },
              {
                icon: <Building2 style={{ width: 18, height: 18 }}/>,
                label: 'En Çok Raporlayan',
                val: kpiFacility.length > 22 ? kpiFacility.slice(0, 20) + '…' : kpiFacility,
                sub: 'Tesis bazında en yüksek kayıt',
                renk: '#6366F1', bg: '#EEF2FF',
              },
              {
                icon: <Shield style={{ width: 18, height: 18 }}/>,
                label: 'Ortalama HRO_α',
                val: kpiHroOrtalama !== null ? kpiHroOrtalama.toFixed(2) : '—',
                sub: 'Near miss > 0 tesisler dahil',
                renk: kpiHroOrtalama !== null && kpiHroOrtalama >= 1.0 ? '#16A34A' : '#DC2626',
                bg:   kpiHroOrtalama !== null && kpiHroOrtalama >= 1.0 ? '#F0FDF4' : '#FEF2F2',
              },
            ].map((k, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 16, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #F1F0EF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ background: k.bg, color: k.renk, padding: 8, borderRadius: 10 }}>{k.icon}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</span>
                </div>
                <p style={{ fontSize: 26, fontWeight: 800, color: k.renk, margin: '0 0 4px', fontFamily: 'monospace' }}>{k.val}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{k.sub}</p>
              </div>
            ))}
          </div>

          {/* Liste tablosu */}
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #F1F0EF', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F0EF' }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: NAVY, margin: 0 }}>Son Near Miss Kayıtları</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 90px 100px', padding: '8px 20px', background: '#F8F9FA', borderBottom: '1px solid #F1F0EF', gap: 12 }}>
              {['Tarih','Tesis','Kategori','Aciliyet','Durum'].map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

            {kayitlar.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                Henüz kayıt yok. Yeni kayıt eklemek için &quot;+ Yeni Kayıt&quot; seçin.
              </div>
            ) : (
              <div>
                {kayitlar.map(k => {
                  const ac  = ACILIYET_RENKLER[k.urgency] ?? ACILIYET_RENKLER['Orta']
                  const dur = DURUM_RENKLER[k.status]      ?? DURUM_RENKLER['open']
                  const tesis = facilities.find(fc => fc.id === k.facility_id)
                  return (
                    <div key={k.id}
                      style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 90px 100px', padding: '13px 20px', borderBottom: '1px solid #F9F8F7', gap: 12, alignItems: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F9F8F7')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'monospace' }}>
                        {k.event_date ? new Date(k.event_date).toLocaleDateString('tr-TR', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
                      </span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{tesis?.name ?? k.facility_id.slice(0,8) + '…'}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{k.description?.slice(0,60)}{(k.description?.length ?? 0) > 60 ? '…' : ''}</div>
                      </div>
                      <span style={{ fontSize: 12, color: '#4B5563' }}>{k.category}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: ac.bg, border: `1px solid ${ac.border}`, color: ac.text, display: 'inline-block', whiteSpace: 'nowrap' }}>
                        {k.urgency}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: dur.bg, color: dur.text, display: 'inline-block' }}>
                        {DURUM_TR[k.status] ?? k.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>)}
      </div>
    </div>
  )
}
