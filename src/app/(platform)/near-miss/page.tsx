'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react'

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
  'Düşük':   { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
  'Orta':    { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' },
  'Yüksek':  { bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C' },
  'Kritik':  { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C' },
}
const DURUM_RENKLER: Record<string, { bg: string; text: string }> = {
  open:        { bg: '#EEF2FF', text: '#4338CA' },
  investigating:{ bg: '#FFFBEB', text: '#92400E' },
  closed:      { bg: '#F0FDF4', text: '#166534' },
}
const DURUM_TR: Record<string, string> = {
  open: 'Açık', investigating: 'İnceleniyor', closed: 'Kapatıldı',
}

interface Facility { id: string; name: string }
interface NearMiss {
  id: string
  facility_id: string
  event_date: string
  category: string
  urgency: string
  status: string
  description: string
}

const BOSH = {
  facility_id: '', event_date: '', category: '', location: '',
  description: '', potential_outcome: '',
  root_cause_1: '', root_cause_2: '', root_cause_3: '',
  repeated: false, urgency: 'Orta',
}

async function ensureTable() {
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
  }).catch(() => {/* rpc olmayabilir — table zaten varsa sorun yok */})
}

export default function NearMissPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [kayitlar,   setKayitlar]   = useState<NearMiss[]>([])
  const [form,       setForm]       = useState({ ...BOSH })
  const [kaydediyor, setKaydediyor] = useState(false)
  const [basarili,   setBasarili]   = useState(false)
  const [hata,       setHata]       = useState<string | null>(null)
  const [listeleme,  setListeleme]  = useState(true)

  const f = (k: keyof typeof BOSH, v: unknown) =>
    setForm(p => ({ ...p, [k]: v }))

  useEffect(() => {
    ensureTable()
    sb.from('facilities')
      .select('id,name')
      .eq('tenant_id', TENANT)
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => { if (data) setFacilities(data as Facility[]) })
    yukleKayitlar()
  }, [])

  function yukleKayitlar() {
    sb.from('near_miss_events')
      .select('id,facility_id,event_date,category,urgency,status,description')
      .eq('tenant_id', TENANT)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => { if (data) setKayitlar(data as NearMiss[]) })
  }

  async function kaydet() {
    if (!form.facility_id || !form.category || !form.description) {
      setHata('Tesis, kategori ve açıklama zorunludur.')
      return
    }
    setKaydediyor(true); setHata(null)
    const { error } = await sb.from('near_miss_events').insert({
      tenant_id:        TENANT,
      facility_id:      form.facility_id,
      event_date:       form.event_date || new Date().toISOString(),
      category:         form.category,
      location:         form.location,
      description:      form.description,
      potential_outcome:form.potential_outcome,
      root_cause_1:     form.root_cause_1,
      root_cause_2:     form.root_cause_2,
      root_cause_3:     form.root_cause_3,
      repeated:         form.repeated,
      urgency:          form.urgency,
      status:           'open',
    })
    setKaydediyor(false)
    if (error) { setHata(error.message); return }
    setBasarili(true)
    setForm({ ...BOSH })
    yukleKayitlar()
    setTimeout(() => setBasarili(false), 3000)
  }

  const inputSt: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '9px 12px',
    borderRadius: 10, border: '1px solid #E5E3E1', fontSize: 13,
    fontFamily: "'DM Sans',sans-serif", outline: 'none', background: 'white',
  }
  const labelSt: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    display: 'block', marginBottom: 5,
  }

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif" }}>

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

              {/* Satır 1: Tesis + Tarih */}
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

              {/* Satır 2: Kategori + Aciliyet */}
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

              {/* Lokasyon */}
              <div>
                <label style={labelSt}>Olay Lokasyonu (tesis içinde)</label>
                <input type="text" placeholder="ör. Depo B katı, Üretim Hattı 3, Sunucu Odası…" value={form.location} onChange={e => f('location', e.target.value)} style={inputSt}/>
              </div>

              {/* Açıklama */}
              <div>
                <label style={labelSt}>Kısa Açıklama *</label>
                <textarea rows={3} placeholder="Ne oldu? Kısaca özetleyin…" value={form.description} onChange={e => f('description', e.target.value)}
                  style={{ ...inputSt, resize: 'vertical' as const }}/>
              </div>

              {/* Potansiyel Sonuç */}
              <div>
                <label style={labelSt}>Potansiyel Sonuç</label>
                <textarea rows={2} placeholder="Bu olay önlenmeseydi ne olabilirdi?" value={form.potential_outcome} onChange={e => f('potential_outcome', e.target.value)}
                  style={{ ...inputSt, resize: 'vertical' as const }}/>
              </div>

              {/* 5 WHY Kök Neden */}
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

              {/* HRO sorusu + Tekrar mı? */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
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
              </div>

              {/* Hata & Başarı */}
              {hata && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', color: '#B91C1C', fontSize: 13 }}>
                  {hata}
                </div>
              )}
              {basarili && (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', color: '#15803D', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle style={{ width: 16, height: 16 }}/> Kayıt başarıyla oluşturuldu.
                </div>
              )}

              {/* Kaydet */}
              <button onClick={kaydet} disabled={kaydediyor}
                style={{ background: kaydediyor ? '#9CA3AF' : TEAL, color: 'white', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, cursor: kaydediyor ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {kaydediyor ? <><Loader2 style={{ width: 16, height: 16 }} className="animate-spin"/> Kaydediliyor…</> : '✓ Near Miss Kaydını Oluştur'}
              </button>
            </div>
          </div>
        )}

        {/* ── LİSTE ── */}
        {listeleme && (
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #F1F0EF', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F0EF' }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: NAVY, margin: 0 }}>Son Near Miss Kayıtları</h2>
            </div>

            {/* Başlık */}
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
                  const ac  = ACILIYET_RENKLER[k.urgency]  ?? ACILIYET_RENKLER['Orta']
                  const dur = DURUM_RENKLER[k.status]       ?? DURUM_RENKLER['open']
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
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{tesis?.name ?? k.facility_id.slice(0, 8) + '…'}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{k.description?.slice(0, 60)}{(k.description?.length ?? 0) > 60 ? '…' : ''}</div>
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
        )}
      </div>
    </div>
  )
}
