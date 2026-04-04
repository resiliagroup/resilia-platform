'use client'

function uriToAdis(uri: number): number { return Math.round(200 + (uri / 100) * 1000) }
function adisRenk(a: number): string { return a<450?'#EF4444':a<650?'#F97316':a<850?'#EAB308':a<1050?'#22C55E':'#16A34A' }
function adisLabel(a: number): string { return a<450?'Kritik Risk':a<650?'Yüksek Risk':a<850?'Orta Risk':a<1050?'İyi':'Güçlü' }
import { useState, useEffect } from 'react'
import { Users, Building2, Settings2, Leaf, TrendingUp, LayoutGrid } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { SORULAR_SANAYI } from '@/lib/sorular-sanayi'

const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
)

const NAVY = '#0A1628'; const TEAL = '#009B8D'; const BORDER = '#E2E8F0'

type Sekme = 'izleme' | 'sorular' | 'kmatris' | 'tokenlar' | 'cozumler'

// ─── Risk rengi ───────────────────────────────────────────────────────────────
function uriRenk(uri: number) {
  return uri < 30 ? '#22C55E' : uri < 50 ? '#EAB308' : uri < 70 ? '#F97316' : '#EF4444'
}
function uriEtiket(uri: number) {
  return uri < 30 ? 'Düşük' : uri < 50 ? 'Orta' : uri < 70 ? 'Yüksek' : 'Kritik'
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ val, onChange }: { val: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!val)}
      style={{ width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', background: val ? TEAL : '#CBD5E1', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 2, left: val ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left .2s', display: 'block' }} />
    </button>
  )
}

// ─── KPI Kart ─────────────────────────────────────────────────────────────────
function KpiKart({ baslik, deger, renk }: { baslik: string; deger: string | number; renk?: string }) {
  return (
    <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 20px', minWidth: 140 }}>
      <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: .5 }}>{baslik}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: renk ?? NAVY, fontFamily: 'DM Mono, monospace' }}>{deger}</div>
    </div>
  )
}

// ─── SEKME 1: Form İzleme ─────────────────────────────────────────────────────
type TesisFormu = {
  token: string
  envanter: Record<string, unknown>
  uri_skoru: number
  lat: number
  lng: number
  gonderim_tarihi: string
}

function FormIzlemeSekme() {
  const [formlar, setFormlar] = useState<TesisFormu[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    sb.from('iso_tesis_formlari')
      .select('token, envanter, uri_skoru, lat, lng, gonderim_tarihi')
      .order('gonderim_tarihi', { ascending: false })
      .then(({ data }) => {
        if (data) setFormlar(data as TesisFormu[])
        setYukleniyor(false)
      })
  }, [])

  const buHafta = formlar.filter(f => {
    const d = new Date(f.gonderim_tarihi)
    const haftaOnce = new Date(); haftaOnce.setDate(haftaOnce.getDate() - 7)
    return d >= haftaOnce
  }).length

  const ortUri = formlar.length
    ? Math.round(formlar.reduce((s, f) => s + f.uri_skoru, 0) / formlar.length)
    : 0

  const kritik = formlar.filter(f => f.uri_skoru > 50).length

  return (
    <div>
      {/* KPI */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <KpiKart baslik="Toplam Gönderim" deger={formlar.length} />
        <KpiKart baslik="Ortalama URI" deger={ortUri} renk={uriRenk(ortUri)} />
        <KpiKart baslik="Kritik Tesis (URI>50)" deger={kritik} renk="#EF4444" />
        <KpiKart baslik="Bu Hafta" deger={buHafta} renk={TEAL} />
      </div>

      {/* Tablo */}
      <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Gönderilen Formlar</span>
          <button onClick={() => window.location.reload()} style={{ fontSize: 12, color: TEAL, background: 'none', border: 'none', cursor: 'pointer' }}>↻ Yenile</button>
        </div>
        {yukleniyor ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Yükleniyor...</div>
        ) : formlar.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Henüz form gönderilmemiş.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Token', 'Firma Adı', 'ADİS Skoru', 'Risk', 'Gönderim Tarihi', 'Konum'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left' as const, fontWeight: 600, color: '#64748B', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {formlar.map((f, i) => {
                  const firma = (f.envanter?.E01 as string) || '—'
                  const renk = uriRenk(f.uri_skoru)
                  return (
                    <tr key={f.token} style={{ background: i % 2 === 0 ? 'white' : '#FAFBFC' }}>
                      <td style={{ padding: '10px 16px', color: '#94A3B8', fontFamily: 'monospace', fontSize: 11 }}>{f.token.slice(0, 8)}…</td>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: NAVY }}>{firma}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ fontWeight: 800, color: renk, fontFamily: 'DM Mono, monospace', fontSize: 16 }}>{f.uri_skoru}</span>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: renk, background: renk + '15', padding: '2px 8px', borderRadius: 20 }}>{uriEtiket(f.uri_skoru)}</span>
                      </td>
                      <td style={{ padding: '10px 16px', color: '#64748B' }}>
                        {new Date(f.gonderim_tarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        {f.lat && f.lng ? (
                          <a href={`https://www.google.com/maps?q=${f.lat},${f.lng}`} target="_blank" rel="noreferrer"
                            style={{ fontSize: 12, color: TEAL, textDecoration: 'none' }}> Harita</a>
                        ) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── SEKME 2: Soru Yönetimi ───────────────────────────────────────────────────
// ─── SEKME 2: Soru Yönetimi (v2) ─────────────────────────────────────────────
// Bu dosyanın içeriği iso-admin/page.tsx içindeki eski SoruYonetimiSekme
// fonksiyonunun YERİNE geçecek. Tüm bloğu kopyala-yapıştır.

type SoruAyar = {
  kod: string
  agirlik: number
  kritik: boolean
  soru: string
  rehber: [string, string, string, string]
  mevzuat: string[]
  siniflar: (1 | 2 | 3)[]
}

function SoruYonetimiSekme() {
  const [ayarlar, setAyarlar] = useState<Record<string, SoruAyar>>(() =>
    Object.fromEntries(
      SORULAR_SANAYI.map(s => [
        s.kod,
        {
          kod: s.kod,
          agirlik: s.agirlik,
          kritik: s.kritik,
          soru: s.soru,
          rehber: (s.rehber ?? ['', '', '', '']) as [string, string, string, string],
          mevzuat: (s as any).mevzuat ?? [],
          siniflar: (s as any).siniflar ?? [1, 2, 3],
        },
      ])
    )
  )
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [mesaj, setMesaj] = useState('')
  const [acikKod, setAcikKod] = useState<string | null>(null)
  const [sinifFiltre, setSinifFiltre] = useState<0 | 1 | 2 | 3>(0) // 0 = hepsi
  const [kategoriFiltre, setKategoriFiltre] = useState<string>('hepsi')
  const [aramaMetni, setAramaMetni] = useState('')

  const setAlan = (kod: string, alan: Partial<SoruAyar>) =>
    setAyarlar(a => ({ ...a, [kod]: { ...a[kod], ...alan } }))

  const setRehber = (kod: string, idx: number, val: string) =>
    setAyarlar(a => {
      const r = [...a[kod].rehber] as [string, string, string, string]
      r[idx] = val
      return { ...a, [kod]: { ...a[kod], rehber: r } }
    })

  const toggleSinif = (kod: string, sinif: 1 | 2 | 3) =>
    setAyarlar(a => {
      const prev = a[kod].siniflar
      const next = prev.includes(sinif) ? prev.filter(s => s !== sinif) : [...prev, sinif].sort() as (1 | 2 | 3)[]
      return { ...a, [kod]: { ...a[kod], siniflar: next } }
    })

  const kaydet = async () => {
    setKaydediliyor(true)
    setMesaj('')
    const rows = Object.values(ayarlar).map(a => ({
      ...a,
      guncelleme: new Date().toISOString(),
    }))
    const { error } = await sb.from('soru_ayarlari').upsert(rows, { onConflict: 'kod' })
    setMesaj(error ? 'Hata: ' + error.message : '✓ Değişiklikler kaydedildi.')
    setKaydediliyor(false)
  }

  const BOLUMLER = [
    { baslik: 'Tehlike', bolum: 'TEHLİKE', renk: '#EF4444', bg: '#FEF2F2' },
    { baslik: 'Kırılganlık', bolum: 'KIRILGANLIK', renk: '#F97316', bg: '#FFF7ED' },
    { baslik: 'Kapasite', bolum: 'KAPASİTE_C', renk: '#10B981', bg: '#F0FDF4' },
    { baslik: 'HRO', bolum: 'HRO', renk: '#8B5CF6', bg: '#F5F3FF' },
  ]

  const SINIF_ETIKET: Record<number, string> = { 1: 'Çok Tehlikeli', 2: 'Tehlikeli', 3: 'Az Tehlikeli' }
  const SINIF_RENK: Record<number, string> = { 1: '#EF4444', 2: '#F97316', 3: '#22C55E' }

  const sorularFor = (bolum: string) => {
    let liste = SORULAR_SANAYI.filter(s =>
      bolum === 'KAPASİTE_C'
        ? s.bolum === 'KAPASİTE' && s.boyut !== 'HRO'
        : bolum === 'HRO'
        ? s.boyut === 'HRO'
        : s.bolum === bolum
    )
    if (sinifFiltre !== 0)
      liste = liste.filter(s => ayarlar[s.kod]?.siniflar?.includes(sinifFiltre as 1 | 2 | 3))
    if (kategoriFiltre !== 'hepsi')
      liste = liste.filter(s => (s as any).kategori === kategoriFiltre)
    if (aramaMetni.trim())
      liste = liste.filter(s =>
        s.soru.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        s.kod.toLowerCase().includes(aramaMetni.toLowerCase())
      )
    return liste
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, minWidth: 240 }}>
          <input
            placeholder="Soru kodu veya metin ara..."
            value={aramaMetni}
            onChange={e => setAramaMetni(e.target.value)}
            style={{ flex: 1, padding: '7px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, outline: 'none' }}
          />
          <div style={{ display: 'flex', gap: 4 }}>
            {([0, 1, 2, 3] as const).map(s => (
              <button key={s} onClick={() => setSinifFiltre(s)}
                style={{
                  padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer',
                  background: sinifFiltre === s ? (s === 0 ? NAVY : SINIF_RENK[s]) : '#F1F5F9',
                  color: sinifFiltre === s ? 'white' : '#475569',
                }}>
                {s === 0 ? 'Tümü' : `S${s}`}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {mesaj && <span style={{ fontSize: 12, color: mesaj.startsWith('✓') ? '#15803D' : '#EF4444' }}>{mesaj}</span>}
          <button onClick={kaydet} disabled={kaydediliyor}
            style={{ padding: '9px 24px', background: kaydediliyor ? '#94A3B8' : NAVY, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: kaydediliyor ? 'not-allowed' : 'pointer' }}>
            {kaydediliyor ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>

      {/* İstatistik satırı */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[1, 2, 3].map(s => {
          const n = SORULAR_SANAYI.filter(q => (q as any).siniflar?.includes(s)).length
          return (
            <div key={s} style={{ padding: '6px 14px', borderRadius: 20, background: SINIF_RENK[s] + '18', border: `1px solid ${SINIF_RENK[s]}40`, fontSize: 12, fontWeight: 600, color: SINIF_RENK[s] }}>
              Sınıf {s} — {n} soru
            </div>
          )
        })}
        <div style={{ padding: '6px 14px', borderRadius: 20, background: '#F1F5F9', fontSize: 12, fontWeight: 600, color: '#475569' }}>
          Toplam {SORULAR_SANAYI.length} soru
        </div>
      </div>

      {/* Kategori Filtresi */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', marginRight: 4 }}>KATEGORİ:</span>
        {([
          { id: 'hepsi',   label: 'Tümü',    renk: '#0A1628', Ikon: LayoutGrid },
          { id: 'insan',   label: 'İnsan',   renk: '#3B82F6', Ikon: Users },
          { id: 'mekan',   label: 'Mekan',   renk: '#F97316', Ikon: Building2 },
          { id: 'proses',  label: 'Proses',  renk: '#10B981', Ikon: Settings2 },
          { id: 'cevre',   label: 'Çevre',   renk: '#06B6D4', Ikon: Leaf },
          { id: 'ekonomi', label: 'Ekonomi', renk: '#8B5CF6', Ikon: TrendingUp },
        ] as const).map(k => {
          const aktif = kategoriFiltre === k.id
          const sayi = k.id === 'hepsi'
            ? SORULAR_SANAYI.length
            : SORULAR_SANAYI.filter(s => (s as any).kategori === k.id).length
          return (
            <button key={k.id} onClick={() => setKategoriFiltre(k.id)}
              style={{
                padding: '5px 14px', borderRadius: 20,
                border: `1.5px solid ${aktif ? k.renk : '#E2E8F0'}`,
                background: aktif ? k.renk : 'white',
                color: aktif ? 'white' : '#64748B',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
              <k.Ikon size={13} />
              <span>{k.label}</span>
              <span style={{ fontSize: 10, opacity: 0.8 }}>({sayi})</span>
            </button>
          )
        })}
      </div>

      {/* Bölümler */}
      {BOLUMLER.map(({ baslik, bolum, renk, bg }) => {
        const sorular = sorularFor(bolum)
        if (sorular.length === 0) return null
        return (
          <div key={bolum} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            {/* Bölüm başlığı */}
            <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, background: bg, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: renk, display: 'inline-block' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{baslik}</span>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>· {sorular.length} soru gösteriliyor</span>
            </div>

            {/* Sorular */}
            {sorular.map(s => {
              const ay = ayarlar[s.kod]
              const acik = acikKod === s.kod
              return (
                <div key={s.kod} style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {/* Soru satırı (özet) */}
                  <div
                    onClick={() => setAcikKod(acik ? null : s.kod)}
                    style={{ padding: '11px 20px', display: 'grid', gridTemplateColumns: '64px 1fr 200px 100px 90px', gap: 14, alignItems: 'center', cursor: 'pointer', background: acik ? '#F8FAFC' : 'white' }}
                  >
                    {/* Kod */}
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: renk, padding: '2px 8px', borderRadius: 4, textAlign: 'center' as const }}>{s.kod}</span>

                    {/* Soru özeti */}
                    <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}>
                      {ay?.soru?.slice(0, 100)}{(ay?.soru?.length ?? 0) > 100 ? '…' : ''}
                    </span>

                    {/* Sınıf rozetleri */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      {([1, 2, 3] as const).map(sinif => (
                        <button key={sinif}
                          onClick={e => { e.stopPropagation(); toggleSinif(s.kod, sinif) }}
                          style={{
                            padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 700, border: 'none', cursor: 'pointer',
                            background: ay?.siniflar?.includes(sinif) ? SINIF_RENK[sinif] : '#E2E8F0',
                            color: ay?.siniflar?.includes(sinif) ? 'white' : '#94A3B8',
                          }}>
                          S{sinif}
                        </button>
                      ))}
                    </div>

                    {/* Ağırlık */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="range" min={1} max={10} value={ay?.agirlik ?? s.agirlik}
                        onClick={e => e.stopPropagation()}
                        onChange={e => setAlan(s.kod, { agirlik: Number(e.target.value) })}
                        style={{ flex: 1, accentColor: TEAL }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, width: 16, textAlign: 'center' as const }}>{ay?.agirlik ?? s.agirlik}</span>
                    </div>

                    {/* Kritik toggle + expand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Toggle val={ay?.kritik ?? s.kritik} onChange={v => { setAlan(s.kod, { kritik: v }) }} />
                      <span style={{ fontSize: 18, color: '#94A3B8', transform: acik ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', userSelect: 'none' }}>⌄</span>
                    </div>
                  </div>

                  {/* Genişletilmiş düzenleme paneli */}
                  {acik && (
                    <div style={{ padding: '16px 20px', background: '#F8FAFC', borderTop: `1px solid ${BORDER}` }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                        {/* Sol: Soru metni */}
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 6 }}>SORU METNİ</label>
                          <textarea
                            value={ay?.soru ?? ''}
                            onChange={e => setAlan(s.kod, { soru: e.target.value })}
                            rows={3}
                            style={{ width: '100%', padding: '8px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit', background: 'white', boxSizing: 'border-box' }}
                          />

                          {/* Mevzuat */}
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginTop: 12, marginBottom: 6 }}>MEVZUAT / STANDART REFERANSLARI</label>
                          <textarea
                            value={ay?.mevzuat?.join('\n') ?? ''}
                            onChange={e => setAlan(s.kod, { mevzuat: e.target.value.split('\n').filter(Boolean) })}
                            rows={3}
                            placeholder="Her satıra bir referans yazın..."
                            style={{ width: '100%', padding: '8px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12, lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit', background: 'white', boxSizing: 'border-box', color: '#64748B' }}
                          />
                          <p style={{ fontSize: 11, color: '#94A3B8', margin: '4px 0 0' }}>Her satır ayrı bir mevzuat referansı</p>
                        </div>

                        {/* Sağ: 4 şık */}
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 6 }}>CEVAP ŞIKLARI (1→ En İyi, 4→ En Kötü)</label>
                          {[0, 1, 2, 3].map(idx => (
                            <div key={idx} style={{ marginBottom: 8 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                                <span style={{
                                  width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 10, fontWeight: 700, flexShrink: 0,
                                  background: idx === 0 ? '#22C55E' : idx === 1 ? '#84CC16' : idx === 2 ? '#F97316' : '#EF4444',
                                  color: 'white',
                                }}>{idx + 1}</span>
                                <span style={{ fontSize: 10, color: '#94A3B8' }}>
                                  {idx === 0 ? 'Mükemmel / En İyi Durum' : idx === 1 ? 'İyi / Yeterli' : idx === 2 ? 'Orta / Geliştirilebilir' : 'Yetersiz / Kritik'}
                                </span>
                              </div>
                              <textarea
                                value={ay?.rehber?.[idx] ?? ''}
                                onChange={e => setRehber(s.kod, idx, e.target.value)}
                                rows={2}
                                style={{ width: '100%', padding: '6px 10px', border: `1px solid ${BORDER}`, borderRadius: 7, fontSize: 12, lineHeight: 1.4, resize: 'vertical', fontFamily: 'inherit', background: 'white', boxSizing: 'border-box' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mevzuat rozet önizleme */}
                      {ay?.mevzuat && ay.mevzuat.length > 0 && (
                        <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {ay.mevzuat.map((m, i) => (
                            <span key={i} style={{ padding: '3px 8px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 4, fontSize: 11, color: '#1D4ED8' }}>{m}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}


// ─── SEKME 3: k Katsayısı Editörü ────────────────────────────────────────────
const HAZARDS  = ['deprem', 'sel', 'natech', 'siber'] as const
const SECTORS  = ['HOSPITAL', 'INDUSTRIAL', 'BANK', 'MUNICIPALITY', 'EDUCATION', 'HOTEL'] as const
type HKey = typeof HAZARDS[number]
type SKey = typeof SECTORS[number]
type KMatrix = Record<SKey, Record<HKey, number>>

const SECTOR_TR: Record<SKey, string>  = { HOSPITAL: 'Hastane', INDUSTRIAL: 'Sanayi', BANK: 'Finans', MUNICIPALITY: 'Belediye', EDUCATION: 'Eğitim', HOTEL: 'Otelcilik' }
const HAZARD_TR: Record<HKey, string>  = { deprem: 'Deprem', sel: 'Sel', natech: 'NATECH', siber: 'Siber' }

const DEFAULT_K: KMatrix = {
  HOSPITAL:     { deprem: 2.8, sel: 2.1, natech: 3.5, siber: 4.2 },
  INDUSTRIAL:   { deprem: 3.2, sel: 2.8, natech: 4.8, siber: 1.9 },
  BANK:         { deprem: 1.8, sel: 1.5, natech: 2.0, siber: 5.1 },
  MUNICIPALITY: { deprem: 3.0, sel: 2.5, natech: 3.2, siber: 3.8 },
  EDUCATION:    { deprem: 2.5, sel: 2.0, natech: 1.8, siber: 2.2 },
  HOTEL:        { deprem: 2.2, sel: 3.0, natech: 2.5, siber: 2.8 },
}

function kRenk(v: number) {
  if (v < 1.5) return { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' }
  if (v < 3.0) return { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' }
  if (v < 4.5) return { bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C' }
  return { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C' }
}

function KMatrisSekme() {
  const [kMatrix, setKMatrix] = useState<KMatrix>(() => {
    try { const s = localStorage.getItem('omni_k_matrix'); return s ? JSON.parse(s) : DEFAULT_K }
    catch { return DEFAULT_K }
  })
  const [kaydedildi, setKaydedildi] = useState(false)

  const setK = (sector: SKey, hazard: HKey, val: number) => {
    setKMatrix(m => ({ ...m, [sector]: { ...m[sector], [hazard]: val } }))
    setKaydedildi(false)
  }
  const kaydet = () => {
    localStorage.setItem('omni_k_matrix', JSON.stringify(kMatrix))
    setKaydedildi(true)
    setTimeout(() => setKaydedildi(false), 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: '#64748B' }}>k(s,t) — Sektör × Tehlike tipi ağırlık matrisi (0.5 – 6.0 arası)</p>
        <button onClick={kaydet}
          style={{ padding: '9px 24px', background: kaydedildi ? '#10B981' : NAVY, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background .2s' }}>
          {kaydedildi ? '✓ Kaydedildi' : 'Kaydet (LocalStorage)'}
        </button>
      </div>

      <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 20px', textAlign: 'left' as const, fontSize: 12, color: '#64748B', fontWeight: 600, borderBottom: `1px solid ${BORDER}`, background: '#F8FAFC' }}>Sektör</th>
              {HAZARDS.map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'center' as const, fontSize: 12, color: '#64748B', fontWeight: 600, borderBottom: `1px solid ${BORDER}`, background: '#F8FAFC' }}>{HAZARD_TR[h]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SECTORS.map((sector, si) => (
              <tr key={sector} style={{ background: si % 2 === 0 ? 'white' : '#FAFBFC' }}>
                <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 600, color: NAVY, borderBottom: `1px solid ${BORDER}` }}>{SECTOR_TR[sector]}</td>
                {HAZARDS.map(hazard => {
                  const val = kMatrix[sector][hazard]
                  const c = kRenk(val)
                  return (
                    <td key={hazard} style={{ padding: '8px 16px', borderBottom: `1px solid ${BORDER}`, textAlign: 'center' as const }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                        <input type="number" min={0.5} max={6} step={0.1} value={val}
                          onChange={e => setK(sector, hazard, parseFloat(e.target.value) || 0.5)}
                          style={{ width: 64, padding: '5px 8px', border: `1px solid ${c.border}`, borderRadius: 6, fontSize: 13, fontWeight: 700, color: c.text, background: c.bg, textAlign: 'center' as const, outline: 'none' }} />
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[{ label: '< 1.5 — Düşük etki', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
          { label: '1.5–3.0 — Orta', bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' },
          { label: '3.0–4.5 — Yüksek', bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C' },
          { label: '≥ 4.5 — Kritik', bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C' }
        ].map(c => (
          <span key={c.label} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontWeight: 600 }}>{c.label}</span>
        ))}
      </div>
    </div>
  )
}

// ─── ANA SAYFA ────────────────────────────────────────────────────────────────
// ─── SEKME 4: Token Yönetimi ──────────────────────────────────────────────────
const BASE_URL = 'https://omniversel.com/tesis-formu'

type IsoToken = {
  id?: string
  token: string
  tesis_adi: string
  nace_kodu?: string
  ilce?: string
  employee_count?: number
  building_age?: number
  dolduruldu?: boolean
  olusturma_tarihi?: string
}

const lbl2: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }
const inp2: React.CSSProperties = { width: '100%', padding: '9px 12px', border: `1px solid #E2E8F0`, borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' as const }

// ─── SEKME 5: Çözüm Bankası ───────────────────────────────────────────────────
type Cozum = {
  id: string
  soru_kod: string
  baslik: string
  aciklama: string
  adimlar: string[]
  maliyet_seviyesi: 'ucretsiz' | 'dusuk' | 'orta' | 'pro'
  uri_iyilesmesi: number
  oncelik: number
  tehlike_siniflar: number[]
  mevzuat_referans: string
  kaynak: string
  aktif: boolean
}

const MALIYET_LABEL: Record<string, string> = { ucretsiz: 'Ücretsiz', dusuk: 'Düşük', orta: 'Orta', pro: 'Pro' }
const MALIYET_COLOR: Record<string, string> = { ucretsiz: '#22C55E', dusuk: '#009B8D', orta: '#F97316', pro: '#8B5CF6' }

const SUPA_URL2 = 'https://gqguwgbopgnpwzjwcexl.supabase.co'
const SUPA_KEY2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI'

const BOSH_COZUM: Omit<Cozum, 'id'> = {
  soru_kod: '', baslik: '', aciklama: '', adimlar: [],
  maliyet_seviyesi: 'ucretsiz', uri_iyilesmesi: 3, oncelik: 5,
  tehlike_siniflar: [1, 2, 3], mevzuat_referans: '', kaynak: '', aktif: true,
}

function CozumBankasiSekme() {
  const [cozumler, setCozumler] = useState<Cozum[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [sinifFiltre, setSinifFiltre] = useState<number | null>(null)
  const [maliyetFiltre, setMaliyetFiltre] = useState<string>('')
  const [formAcik, setFormAcik] = useState(false)
  const [yeni, setYeni] = useState<Omit<Cozum, 'id'>>({ ...BOSH_COZUM })
  const [kaydediyor, setKaydediyor] = useState(false)
  const [hata, setHata] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editOncelik, setEditOncelik] = useState(5)
  const [editAktif, setEditAktif] = useState(true)

  const yukle = () => {
    setYukleniyor(true)
    fetch(`${SUPA_URL2}/rest/v1/cozum_bankasi?select=*&order=oncelik.asc`, {
      headers: { 'apikey': SUPA_KEY2, 'Authorization': `Bearer ${SUPA_KEY2}` },
    }).then(r => r.json()).then((rows: Cozum[]) => {
      setCozumler(Array.isArray(rows) ? rows : [])
      setYukleniyor(false)
    })
  }

  useEffect(() => { yukle() }, [])

  const goruntu = cozumler.filter(c => {
    if (sinifFiltre && !c.tehlike_siniflar?.includes(sinifFiltre)) return false
    if (maliyetFiltre && c.maliyet_seviyesi !== maliyetFiltre) return false
    return true
  })

  const toplam       = cozumler.length
  const ucretsizS    = cozumler.filter(c => c.maliyet_seviyesi === 'ucretsiz').length
  const dusukS       = cozumler.filter(c => c.maliyet_seviyesi === 'dusuk').length
  const ortaS        = cozumler.filter(c => c.maliyet_seviyesi === 'orta').length
  const uriPotansiyel = cozumler.reduce((s, c) => s + (c.uri_iyilesmesi ?? 0), 0)

  const kaydet = async () => {
    if (!yeni.baslik || !yeni.soru_kod) { setHata('Soru kodu ve başlık zorunlu.'); return }
    setKaydediyor(true); setHata('')
    const r = await fetch(`${SUPA_URL2}/rest/v1/cozum_bankasi`, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY2, 'Authorization': `Bearer ${SUPA_KEY2}`,
        'Content-Type': 'application/json', 'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ ...yeni, adimlar: yeni.adimlar }),
    })
    if (r.ok) {
      setYeni({ ...BOSH_COZUM }); setFormAcik(false); yukle()
    } else {
      setHata('Kaydedilemedi: ' + await r.text())
    }
    setKaydediyor(false)
  }

  const inline_kaydet = async (id: string) => {
    await fetch(`${SUPA_URL2}/rest/v1/cozum_bankasi?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPA_KEY2, 'Authorization': `Bearer ${SUPA_KEY2}`,
        'Content-Type': 'application/json', 'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ aktif: editAktif, oncelik: editOncelik }),
    })
    setEditId(null); yukle()
  }

  const inp3: React.CSSProperties = { width: '100%', padding: '8px 10px', border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, outline: 'none', boxSizing: 'border-box' as const }

  return (
    <div>
      {/* KPI */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
        <KpiKart baslik="Toplam Çözüm"  deger={toplam} />
        <KpiKart baslik="Ücretsiz"       deger={ucretsizS}    renk="#22C55E" />
        <KpiKart baslik="Düşük Maliyet"  deger={dusukS}       renk={TEAL} />
        <KpiKart baslik="Orta Maliyet"   deger={ortaS}        renk="#F97316" />
        <KpiKart baslik="URI Potansiyeli" deger={`-${uriPotansiyel}`} renk="#8B5CF6" />
      </div>

      {/* Filtreler + Yeni Ekle */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {[{ v: null, l: 'Tüm Sınıflar' }, { v: 1, l: 'Sınıf 1 — Çok Tehlikeli' }, { v: 2, l: 'Sınıf 2 — Tehlikeli' }, { v: 3, l: 'Sınıf 3 — Az Tehlikeli' }].map(f => (
          <button key={String(f.v)} onClick={() => setSinifFiltre(f.v as number | null)}
            style={{ padding: '6px 14px', fontSize: 12, borderRadius: 6, border: `1px solid ${sinifFiltre === f.v ? TEAL : BORDER}`, background: sinifFiltre === f.v ? '#EBF8F7' : 'white', color: sinifFiltre === f.v ? TEAL : '#374151', cursor: 'pointer', fontWeight: sinifFiltre === f.v ? 700 : 400 }}>
            {f.l}
          </button>
        ))}
        <select value={maliyetFiltre} onChange={e => setMaliyetFiltre(e.target.value)}
          style={{ padding: '6px 10px', fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 6, outline: 'none', cursor: 'pointer' }}>
          <option value="">Tüm Maliyetler</option>
          {Object.entries(MALIYET_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button onClick={() => setFormAcik(f => !f)}
          style={{ marginLeft: 'auto', padding: '8px 18px', background: TEAL, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 7, cursor: 'pointer' }}>
          {formAcik ? '× Kapat' : '+ Yeni Çözüm'}
        </button>
      </div>

      {/* Yeni Çözüm Formu */}
      {formAcik && (
        <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 20 }}>Yeni Çözüm Ekle</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={lbl2}>Soru Kodu *</label>
              <input style={inp3} value={yeni.soru_kod} onChange={e => setYeni(p => ({ ...p, soru_kod: e.target.value }))} placeholder="örn. S7, Y12" />
            </div>
            <div>
              <label style={lbl2}>Başlık *</label>
              <input style={inp3} value={yeni.baslik} onChange={e => setYeni(p => ({ ...p, baslik: e.target.value }))} placeholder="Çözüm başlığı" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl2}>Açıklama</label>
              <textarea style={{ ...inp3, minHeight: 72, resize: 'vertical' as const }} value={yeni.aciklama} onChange={e => setYeni(p => ({ ...p, aciklama: e.target.value }))} placeholder="Kısa açıklama" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl2}>Adımlar (her satır bir adım)</label>
              <textarea style={{ ...inp3, minHeight: 72, resize: 'vertical' as const }}
                value={yeni.adimlar.join('\n')}
                onChange={e => setYeni(p => ({ ...p, adimlar: e.target.value.split('\n').filter(Boolean) }))}
                placeholder={'1. adım\n2. adım\n3. adım'} />
            </div>
            <div>
              <label style={lbl2}>Maliyet Seviyesi</label>
              <select style={{ ...inp3, cursor: 'pointer' }} value={yeni.maliyet_seviyesi} onChange={e => setYeni(p => ({ ...p, maliyet_seviyesi: e.target.value as Cozum['maliyet_seviyesi'] }))}>
                {Object.entries(MALIYET_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={lbl2}>URI İyileşmesi (0–10)</label>
                <input style={inp3} type="number" min={0} max={10} value={yeni.uri_iyilesmesi} onChange={e => setYeni(p => ({ ...p, uri_iyilesmesi: Number(e.target.value) }))} />
              </div>
              <div>
                <label style={lbl2}>Öncelik (1–10)</label>
                <input style={inp3} type="number" min={1} max={10} value={yeni.oncelik} onChange={e => setYeni(p => ({ ...p, oncelik: Number(e.target.value) }))} />
              </div>
            </div>
            <div>
              <label style={lbl2}>Tehlike Sınıfları</label>
              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                {[1, 2, 3].map(s => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={yeni.tehlike_siniflar.includes(s)}
                      onChange={e => setYeni(p => ({
                        ...p,
                        tehlike_siniflar: e.target.checked ? [...p.tehlike_siniflar, s] : p.tehlike_siniflar.filter(x => x !== s),
                      }))} />
                    Sınıf {s}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={lbl2}>Mevzuat Referansı</label>
              <input style={inp3} value={yeni.mevzuat_referans} onChange={e => setYeni(p => ({ ...p, mevzuat_referans: e.target.value }))} placeholder="örn. 6331 EK-1 Md.12" />
            </div>
            <div>
              <label style={lbl2}>Kaynak</label>
              <input style={inp3} value={yeni.kaynak} onChange={e => setYeni(p => ({ ...p, kaynak: e.target.value }))} placeholder="örn. AFAD, NFPA, ISO 22301" />
            </div>
          </div>
          {hata && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 10 }}>{hata}</p>}
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button onClick={kaydet} disabled={kaydediyor}
              style={{ padding: '9px 24px', background: TEAL, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 7, cursor: 'pointer', opacity: kaydediyor ? .6 : 1 }}>
              {kaydediyor ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
            <button onClick={() => setFormAcik(false)}
              style={{ padding: '9px 16px', background: 'white', color: '#64748B', fontWeight: 600, fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 7, cursor: 'pointer' }}>
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Tablo */}
      {yukleniyor ? (
        <p style={{ fontSize: 13, color: '#94A3B8' }}>Yükleniyor…</p>
      ) : (
        <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 80px 60px 80px 60px 70px 100px', gap: '0 12px', padding: '10px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: .5 }}>
            <span>Soru Kodu</span><span>Başlık</span><span>Maliyet</span><span>URI</span><span>Sınıflar</span><span>Öncelik</span><span>Durum</span><span></span>
          </div>
          {goruntu.length === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 13, color: '#94A3B8' }}>Kayıt bulunamadı.</div>
          )}
          {goruntu.map((c, i) => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 80px 60px 80px 60px 70px 100px', gap: '0 12px', padding: '12px 16px', borderBottom: i < goruntu.length - 1 ? `1px solid ${BORDER}` : 'none', alignItems: 'center', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
              <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: TEAL }}>{c.soru_kod}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{c.baslik}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: MALIYET_COLOR[c.maliyet_seviyesi] ?? '#64748B', background: (MALIYET_COLOR[c.maliyet_seviyesi] ?? '#64748B') + '18', border: `1px solid ${(MALIYET_COLOR[c.maliyet_seviyesi] ?? '#64748B')}40`, borderRadius: 20, padding: '2px 8px' }}>{MALIYET_LABEL[c.maliyet_seviyesi] ?? c.maliyet_seviyesi}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#8B5CF6', fontFamily: 'DM Mono, monospace' }}>-{c.uri_iyilesmesi}</span>
              <span style={{ fontSize: 11, color: '#64748B' }}>{(c.tehlike_siniflar ?? []).map(s => `S${s}`).join(', ')}</span>
              {editId === c.id ? (
                <input type="number" min={1} max={10} value={editOncelik} onChange={e => setEditOncelik(Number(e.target.value))}
                  style={{ width: 48, padding: '3px 6px', border: `1px solid ${TEAL}`, borderRadius: 4, fontSize: 12 }} />
              ) : (
                <span style={{ fontSize: 12, color: '#374151' }}>{c.oncelik}</span>
              )}
              {editId === c.id ? (
                <Toggle val={editAktif} onChange={setEditAktif} />
              ) : (
                <span style={{ fontSize: 10, fontWeight: 700, color: c.aktif ? '#22C55E' : '#94A3B8', background: c.aktif ? '#F0FDF4' : '#F8FAFC', border: `1px solid ${c.aktif ? '#BBF7D0' : '#E2E8F0'}`, borderRadius: 20, padding: '2px 8px' }}>{c.aktif ? 'Aktif' : 'Pasif'}</span>
              )}
              <div style={{ display: 'flex', gap: 6 }}>
                {editId === c.id ? (
                  <>
                    <button onClick={() => inline_kaydet(c.id)} style={{ padding: '4px 10px', fontSize: 11, fontWeight: 700, background: TEAL, color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>Kaydet</button>
                    <button onClick={() => setEditId(null)} style={{ padding: '4px 8px', fontSize: 11, background: 'white', color: '#64748B', border: `1px solid ${BORDER}`, borderRadius: 5, cursor: 'pointer' }}>İptal</button>
                  </>
                ) : (
                  <button onClick={() => { setEditId(c.id); setEditOncelik(c.oncelik); setEditAktif(c.aktif) }}
                    style={{ padding: '4px 12px', fontSize: 11, fontWeight: 600, background: 'white', color: TEAL, border: `1px solid ${TEAL}40`, borderRadius: 5, cursor: 'pointer' }}>Düzenle</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TokenYonetimiSekme() {
  const [tokenlar, setTokenlar] = useState<IsoToken[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)

  // Form state
  const [tesisAdi, setTesisAdi] = useState('')
  const [naceKodu, setNaceKodu] = useState('')
  const [ilce, setIlce] = useState('')
  const [calisanSayisi, setCalisanSayisi] = useState('')
  const [binaYasi, setBinaYasi] = useState('')
  const [olusturuluyor, setOlusturuluyor] = useState(false)
  const [yeniToken, setYeniToken] = useState<string | null>(null)
  const [kopyalandi, setKopyalandi] = useState<string | null>(null)
  const [formHata, setFormHata] = useState('')

  const yukle = () => {
    setYukleniyor(true)
    sb.from('iso_tokenlar')
      .select('*')
      .order('olusturma_tarihi', { ascending: false })
      .then(({ data }) => {
        if (data) setTokenlar(data as IsoToken[])
        setYukleniyor(false)
      })
  }

  useEffect(() => { yukle() }, [])

  const tokenOlustur = async () => {
    if (!tesisAdi.trim()) { setFormHata('Tesis adı zorunludur.'); return }
    setFormHata(''); setOlusturuluyor(true)
    const uuid = crypto.randomUUID()
    const token = `iso-${uuid.slice(0, 4)}-${new Date().getFullYear()}`
    const { error } = await sb.from('iso_tokenlar').insert({
      token,
      tesis_adi: tesisAdi.trim(),
      nace_kodu: naceKodu.trim() || null,
      ilce: ilce.trim() || null,
      employee_count: calisanSayisi ? parseInt(calisanSayisi) : null,
      building_age: binaYasi ? parseInt(binaYasi) : null,
      dolduruldu: false,
      olusturma_tarihi: new Date().toISOString(),
    })
    if (error) { setFormHata('Hata: ' + error.message); setOlusturuluyor(false); return }
    setYeniToken(token)
    setTesisAdi(''); setNaceKodu(''); setIlce(''); setCalisanSayisi(''); setBinaYasi('')
    setOlusturuluyor(false)
    yukle()
  }

  const kopyala = (metin: string, id: string) => {
    navigator.clipboard.writeText(metin)
    setKopyalandi(id)
    setTimeout(() => setKopyalandi(null), 2000)
  }

  const csvIndir = () => {
    const satirlar = [
      ['Tesis Adı', 'Token', 'Link', 'Durum', 'Oluşturma Tarihi'],
      ...tokenlar.map(t => [
        t.tesis_adi,
        t.token,
        `${BASE_URL}/${t.token}`,
        t.dolduruldu ? 'Dolduruldu' : 'Bekliyor',
        t.olusturma_tarihi ? new Date(t.olusturma_tarihi).toLocaleDateString('tr-TR') : '',
      ]),
    ]
    const csv = satirlar.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'iso_tokenlar.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const toplam    = tokenlar.length
  const doldurulan = tokenlar.filter(t => t.dolduruldu).length
  const bekleyen  = toplam - doldurulan
  const oran      = toplam ? Math.round((doldurulan / toplam) * 100) : 0

  return (
    <div>
      {/* KPI */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <KpiKart baslik="Toplam Token" deger={toplam} />
        <KpiKart baslik="Doldurulan" deger={doldurulan} renk="#22C55E" />
        <KpiKart baslik="Bekleyen" deger={bekleyen} renk="#F97316" />
        <KpiKart baslik="Doluluk Oranı" deger={`%${oran}`} renk={TEAL} />
      </div>

      {/* Token Oluşturma Formu */}
      <div style={{ background: 'white', border: `1px solid #E2E8F0`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 16 }}>Yeni Token Oluştur</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={lbl2}>Tesis Adı <span style={{ color: '#EF4444' }}>*</span></label>
            <input value={tesisAdi} onChange={e => setTesisAdi(e.target.value)} placeholder="örn. Gebze OSB Metal A.Ş." style={inp2} />
          </div>
          <div>
            <label style={lbl2}>NACE Kodu</label>
            <input value={naceKodu} onChange={e => setNaceKodu(e.target.value)} placeholder="örn. 24.10" style={inp2} />
          </div>
          <div>
            <label style={lbl2}>İlçe</label>
            <input value={ilce} onChange={e => setIlce(e.target.value)} placeholder="örn. Gebze" style={inp2} />
          </div>
          <div>
            <label style={lbl2}>Çalışan Sayısı</label>
            <input type="number" value={calisanSayisi} onChange={e => setCalisanSayisi(e.target.value)} placeholder="örn. 150" style={inp2} />
          </div>
          <div>
            <label style={lbl2}>Bina Yaşı</label>
            <input type="number" value={binaYasi} onChange={e => setBinaYasi(e.target.value)} placeholder="örn. 18" style={inp2} />
          </div>
        </div>
        {formHata && <p style={{ color: '#EF4444', fontSize: 12, marginBottom: 10 }}>{formHata}</p>}
        <button onClick={tokenOlustur} disabled={olusturuluyor}
          style={{ padding: '9px 24px', background: olusturuluyor ? '#94A3B8' : TEAL, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: olusturuluyor ? 'not-allowed' : 'pointer' }}>
          {olusturuluyor ? 'Oluşturuluyor...' : '+ Token Oluştur'}
        </button>

        {yeniToken && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
            <span style={{ fontSize: 12, color: '#15803D', fontWeight: 600 }}>✓ Token oluşturuldu:</span>
            <code style={{ fontSize: 12, color: '#0F766E', background: 'white', padding: '2px 8px', borderRadius: 4, border: '1px solid #BBF7D0' }}>
              {BASE_URL}/{yeniToken}
            </code>
            <button onClick={() => kopyala(`${BASE_URL}/${yeniToken}`, 'yeni')}
              style={{ padding: '4px 14px', border: `1px solid ${TEAL}`, borderRadius: 6, background: 'white', color: TEAL, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {kopyalandi === 'yeni' ? '✓ Kopyalandı' : 'Kopyala'}
            </button>
          </div>
        )}
      </div>

      {/* Token Listesi */}
      <div style={{ background: 'white', border: `1px solid #E2E8F0`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid #E2E8F0`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Token Listesi</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={yukle} style={{ fontSize: 12, color: TEAL, background: 'none', border: 'none', cursor: 'pointer' }}>↻ Yenile</button>
            <button onClick={csvIndir}
              style={{ padding: '6px 16px', border: `1px solid #E2E8F0`, borderRadius: 7, background: 'white', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              ⬇ CSV İndir
            </button>
          </div>
        </div>
        {yukleniyor ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Yükleniyor...</div>
        ) : tokenlar.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Henüz token oluşturulmamış.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Tesis Adı', 'Token', 'Link', 'Durum', 'Oluşturma Tarihi'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left' as const, fontWeight: 600, color: '#64748B', borderBottom: `1px solid #E2E8F0`, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokenlar.map((t, i) => (
                  <tr key={t.token} style={{ background: i % 2 === 0 ? 'white' : '#FAFBFC' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600, color: NAVY }}>{t.tesis_adi}</td>
                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 12, color: '#64748B' }}>{t.token}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#94A3B8', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                          {BASE_URL}/{t.token}
                        </span>
                        <button onClick={() => kopyala(`${BASE_URL}/${t.token}`, t.token)}
                          style={{ padding: '3px 10px', border: `1px solid #E2E8F0`, borderRadius: 5, background: 'white', color: kopyalandi === t.token ? '#22C55E' : '#64748B', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                          {kopyalandi === t.token ? '✓' : 'Kopyala'}
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {t.dolduruldu
                        ? <span style={{ fontSize: 11, fontWeight: 600, color: '#15803D', background: '#F0FDF4', padding: '2px 8px', borderRadius: 20, border: '1px solid #BBF7D0' }}>✓ Dolduruldu</span>
                        : <span style={{ fontSize: 11, fontWeight: 600, color: '#C2410C', background: '#FFF7ED', padding: '2px 8px', borderRadius: 20, border: '1px solid #FED7AA' }}>⏳ Bekliyor</span>}
                    </td>
                    <td style={{ padding: '10px 16px', color: '#64748B', fontSize: 12 }}>
                      {t.olusturma_tarihi ? new Date(t.olusturma_tarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default function IsoAdminPage() {
  const [sekme, setSekme] = useState<Sekme>('izleme')

  const sekmeler: { id: Sekme; label: string }[] = [
    { id: 'izleme',   label: 'Form İzleme' },
    { id: 'sorular',  label: 'Soru Yönetimi' },
    { id: 'kmatris',  label: 'k Katsayısı' },
    { id: 'tokenlar', label: 'Token Yönetimi' },
    { id: 'cozumler', label: 'Çözüm Bankası' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: TEAL, fontWeight: 800, fontSize: 15 }}>İSO Admin</span>
        <span style={{ color: '#334155' }}>—</span>
        <span style={{ color: '#94A3B8', fontSize: 13 }}>Tesis Formu Yönetim Paneli</span>
      </div>

      {/* Sekme Bar */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '0 32px' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {sekmeler.map(s => (
            <button key={s.id} onClick={() => setSekme(s.id)}
              style={{ padding: '14px 24px', fontSize: 13, fontWeight: sekme === s.id ? 700 : 500, color: sekme === s.id ? TEAL : '#64748B', background: 'none', border: 'none', borderBottom: sekme === s.id ? `2px solid ${TEAL}` : '2px solid transparent', cursor: 'pointer' }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 24px 60px' }}>
        {sekme === 'izleme'   && <FormIzlemeSekme />}
        {sekme === 'sorular'  && <SoruYonetimiSekme />}
        {sekme === 'kmatris'  && <KMatrisSekme />}
        {sekme === 'tokenlar' && <TokenYonetimiSekme />}
        {sekme === 'cozumler' && <CozumBankasiSekme />}
      </div>
    </div>
  )
}
