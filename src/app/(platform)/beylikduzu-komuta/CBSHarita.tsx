'use client'
import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from '@/lib/supabase'

// ─── Tipler ────────────────────────────────────────────────────
type Sektor = 'MUNICIPALITY' | 'HOSPITAL' | 'EDUCATION' | 'INDUSTRIAL' | 'BANK' | 'HOTEL' | 'OTHER'

interface ExtraData {
  neighborhood?:  string
  H_score?:       number
  F_score?:       number
  X_score?:       number
  C_score?:       number
  risk_deprem?:   number
  risk_sel?:      number
  risk_sicaklik?: number
  risk_firtina?:  number
  risk_toplumsal?: number
  natech_risk?:   number
  hazmat_flag?:   boolean
  sub_sector?:    string
}

interface FacilityRow {
  id:             string
  code:           string
  name:           string
  sector:         Sektor
  is_active:      boolean
  geom:           { type: string; coordinates: [number, number] } | null
  il_kodu:        string
  ilce_kodu:      string
  building_age:   number
  employee_count: number
  operates_24h:   boolean
  asset_value_usd: number
  extra_data:     ExtraData | null
}

// ─── Sektör meta ────────────────────────────────────────────────
const SEKTOR_META: Record<Sektor, { label: string; renk: string; emoji: string }> = {
  MUNICIPALITY: { label: 'Kamu',      renk: '#5BA3DC', emoji: '🏛️' },
  HOSPITAL:     { label: 'Sağlık',    renk: '#EF4444', emoji: '🏥' },
  EDUCATION:    { label: 'Eğitim',    renk: '#F59E0B', emoji: '🎓' },
  INDUSTRIAL:   { label: 'Sanayi',    renk: '#F97316', emoji: '🏭' },
  BANK:         { label: 'Finans',    renk: '#10B981', emoji: '🏦' },
  HOTEL:        { label: 'Turizm',    renk: '#A78BFA', emoji: '🏨' },
  OTHER:        { label: 'Diğer',     renk: '#94A3B8', emoji: '📍' },
}

// ─── Leaflet default icon fix ───────────────────────────────────
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ─── DivIcon builder ────────────────────────────────────────────
function buildIcon(renk: string, hazmat: boolean, kritik: boolean): L.DivIcon {
  const size = kritik ? 22 : 16

  if (hazmat) {
    // Elmas şekil — NATECH uyarısı
    return L.divIcon({
      className: '',
      html: `
        <div style="
          width:${size + 4}px; height:${size + 4}px;
          background:${renk};
          transform:rotate(45deg);
          border:2px solid #fff;
          box-shadow:0 0 0 2px ${renk}88, 0 2px 8px rgba(0,0,0,0.6);
          display:flex; align-items:center; justify-content:center;
        ">
          <span style="transform:rotate(-45deg); font-size:9px; line-height:1;">⚠</span>
        </div>`,
      iconSize:   [size + 4, size + 4],
      iconAnchor: [(size + 4) / 2, (size + 4) / 2],
      popupAnchor:[0, -((size + 4) / 2 + 4)],
    })
  }

  const warningInner = kritik
    ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 21h20L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v5h2v-5h-2zm0 6v2h2v-2h-2z"/></svg>`
    : ''

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:${size}px; height:${size}px;
        border-radius:50%;
        background:${renk};
        border:${kritik ? '3px solid #fff' : `2px solid ${renk}`};
        box-shadow:${kritik ? `0 0 0 3px ${renk}55, ` : ''}0 1px 4px rgba(0,0,0,0.4);
        display:flex; align-items:center; justify-content:center;
      ">${warningInner}</div>`,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor:[0, -(size / 2 + 4)],
  })
}

// ─── Harita invalidate fix ──────────────────────────────────────
function InvalidateFix() {
  const map = useMap()
  useEffect(() => { setTimeout(() => map.invalidateSize(), 100) }, [map])
  return null
}

// ─── Risk renk yardımcısı ────────────────────────────────────────
function riskRenk(v?: number): string {
  if (!v) return '#64748B'
  if (v >= 4)  return '#EF4444'
  if (v >= 3)  return '#F97316'
  if (v >= 2)  return '#F59E0B'
  return '#22C55E'
}
function riskLabel(v?: number): string {
  if (!v) return '—'
  if (v >= 4) return `${v} Kritik`
  if (v >= 3) return `${v} Yüksek`
  if (v >= 2) return `${v} Orta`
  return `${v} Düşük`
}

// ─── Mahalle risk özeti ──────────────────────────────────────────
interface MahalleOzet {
  isim:       string
  sayi:       number
  hScore:     number   // ort
  deprem:     number
  sel:        number
  hazmatSayi: number
  sektor: Record<Sektor, number>
}

function mahalleOzetlerHesapla(facilities: FacilityRow[]): MahalleOzet[] {
  const map = new Map<string, FacilityRow[]>()
  for (const f of facilities) {
    const nb = f.extra_data?.neighborhood ?? 'Diğer'
    if (!map.has(nb)) map.set(nb, [])
    map.get(nb)!.push(f)
  }
  const result: MahalleOzet[] = []
  for (const [isim, list] of map.entries()) {
    const avg = (fn: (f: FacilityRow) => number | undefined) => {
      const vals = list.map(fn).filter((v): v is number => v !== undefined)
      return vals.length ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : 0
    }
    const sektorSayac = {} as Record<Sektor, number>
    for (const f of list) {
      sektorSayac[f.sector] = (sektorSayac[f.sector] ?? 0) + 1
    }
    result.push({
      isim,
      sayi:       list.length,
      hScore:     avg(f => f.extra_data?.H_score),
      deprem:     avg(f => f.extra_data?.risk_deprem),
      sel:        avg(f => f.extra_data?.risk_sel),
      hazmatSayi: list.filter(f => f.extra_data?.hazmat_flag).length,
      sektor:     sektorSayac,
    })
  }
  return result.sort((a, b) => b.hScore - a.hScore)
}

// ─── Mini progress bar ───────────────────────────────────────────
function RiskBar({ val, max = 5 }: { val: number; max?: number }) {
  const pct = Math.min((val / max) * 100, 100)
  return (
    <div style={{ flex: 1, height: 4, background: '#1e3a5f', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: riskRenk(val),
                    transition: 'width .4s ease', borderRadius: 2 }} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ANA BİLEŞEN
// ═══════════════════════════════════════════════════════════════
const TENANT_ID = '11111111-0000-0000-0000-000000000001'
const MERKEZ: [number, number] = [41.0, 28.675]

export default function CBSHarita() {
  const [facilities, setFacilities]   = useState<FacilityRow[]>([])
  const [yukleniyor, setYukleniyor]   = useState(true)
  const [hata, setHata]               = useState<string | null>(null)
  const [filtre, setFiltre]           = useState<Sektor | 'hepsi'>('hepsi')
  const [katman, setKatman]           = useState<'sokak' | 'uydu'>('sokak')
  const [secilenMahalle, setSecilenMahalle] = useState<string | null>(null)

  // ── Veri çek ─────────────────────────────────────────────────
  useEffect(() => {
    async function cek() {
      setYukleniyor(true)
      const { data, error } = await supabase
        .from('facilities')
        .select('id,code,name,sector,is_active,geom,il_kodu,ilce_kodu,building_age,employee_count,operates_24h,asset_value_usd,extra_data')
        .eq('tenant_id', TENANT_ID)
        .eq('is_active', true)
        .limit(1200)

      if (error) { setHata(error.message); setYukleniyor(false); return }
      setFacilities((data ?? []) as FacilityRow[])
      setYukleniyor(false)
    }
    cek()
  }, [])

  // ── Türetilmiş veriler ────────────────────────────────────────
  const gösterilen = useMemo(() =>
    facilities.filter(f => {
      if (filtre !== 'hepsi' && f.sector !== filtre) return false
      if (!f.geom?.coordinates) return false
      return true
    }), [facilities, filtre])

  const mahalleOzetleri = useMemo(() => mahalleOzetlerHesapla(facilities), [facilities])

  const kpiVeriler = useMemo(() => {
    const kritik  = facilities.filter(f => (f.extra_data?.H_score ?? 0) >= 4).length
    const hazmat  = facilities.filter(f => f.extra_data?.hazmat_flag).length
    const aktif24 = facilities.filter(f => f.operates_24h).length
    return { toplam: facilities.length, kritik, hazmat, aktif24 }
  }, [facilities])

  const sektorler = Object.keys(SEKTOR_META) as Sektor[]

  // ── Yükleniyor durumu ─────────────────────────────────────────
  if (yukleniyor) return (
    <div className="flex items-center justify-center h-96 text-slate-400 gap-3">
      <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#E8C97A" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      Supabase&apos;den tesis verileri yükleniyor…
    </div>
  )

  if (hata) return (
    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
      ⚠ Veri çekme hatası: {hata}
    </div>
  )

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">

      {/* KPI satırı */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Toplam Tesis',     val: kpiVeriler.toplam,  renk: 'text-white' },
          { label: 'Kritik (H≥4)',     val: kpiVeriler.kritik,  renk: 'text-red-400' },
          { label: 'NATECH / Hazmat',  val: kpiVeriler.hazmat,  renk: 'text-orange-400' },
          { label: '24h Operasyon',    val: kpiVeriler.aktif24, renk: 'text-amber-400' },
        ].map(k => (
          <div key={k.label} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${k.renk}`}>{k.val}</p>
            <p className="text-xs text-slate-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Filtre butonları */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltre('hepsi')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            filtre === 'hepsi'
              ? 'border-slate-400 text-white bg-slate-600/30'
              : 'border-slate-700 text-slate-400 hover:border-slate-500'
          }`}>
          Tümü ({facilities.length})
        </button>
        {sektorler.map(s => {
          const meta   = SEKTOR_META[s]
          const secili = filtre === s
          const sayi   = facilities.filter(f => f.sector === s).length
          if (!sayi) return null
          return (
            <button key={s}
              onClick={() => setFiltre(s)}
              style={secili ? { borderColor: meta.renk, color: meta.renk, backgroundColor: meta.renk + '18' } : {}}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                secili ? '' : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
              }`}>
              <span style={{ background: secili ? meta.renk : '#475569' }}
                className="w-2 h-2 rounded-full flex-shrink-0" />
              {meta.label}
              <span className="opacity-60">({sayi})</span>
            </button>
          )
        })}
      </div>

      {/* Ana içerik: harita + sağ panel */}
      <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>

        {/* Harita */}
        <div className="flex-1 rounded-xl overflow-hidden border border-slate-700/40"
             style={{ height: 560, position: 'relative', minWidth: 0 }}>
          {/* Katman toggle */}
          <div style={{
            position: 'absolute', top: 10, right: 10, zIndex: 1000,
            display: 'flex', gap: 4, background: 'white',
            borderRadius: 8, padding: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            {(['sokak', 'uydu'] as const).map(k => (
              <button key={k} onClick={() => setKatman(k)} style={{
                padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                background: katman === k ? '#0A1628' : 'transparent',
                color: katman === k ? 'white' : '#64748B',
                transition: 'all .15s',
              }}>{k === 'sokak' ? 'Sokak' : 'Uydu'}</button>
            ))}
          </div>

          <MapContainer center={MERKEZ} zoom={13}
            style={{ height: '100%', width: '100%' }}>
            <InvalidateFix />
            {katman === 'sokak' ? (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            ) : (
              <TileLayer
                attribution="Tiles &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            )}

            {gösterilen.map(tesis => {
              const coords  = tesis.geom!.coordinates  // [lng, lat]
              const meta    = SEKTOR_META[tesis.sector] ?? SEKTOR_META.OTHER
              const hScore  = tesis.extra_data?.H_score ?? 0
              const hazmat  = tesis.extra_data?.hazmat_flag ?? false
              const kritik  = hScore >= 4
              const renk    = hazmat ? '#E8A87C' : kritik ? '#EF4444' : meta.renk

              return (
                <Marker
                  key={tesis.id}
                  position={[coords[1], coords[0]]}
                  icon={buildIcon(renk, hazmat, kritik)}>
                  <Popup minWidth={230} maxWidth={290}>
                    <style>{`
                      .leaflet-popup-content-wrapper {
                        background:#1E293B; border:1px solid #334155;
                        border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,.5); padding:0;
                      }
                      .leaflet-popup-content { margin:0; }
                      .leaflet-popup-tip { background:#1E293B; }
                    `}</style>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", padding:'14px 16px' }}>
                      {/* Başlık */}
                      <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:10 }}>
                        <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{meta.emoji}</span>
                        <p style={{ color:'#F1F5F9', fontWeight:600, fontSize:13, lineHeight:1.35, margin:0 }}>
                          {tesis.name}
                        </p>
                      </div>
                      {/* Detaylar */}
                      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                        {[
                          { l:'Sektör',    v: meta.label,                          c: meta.renk },
                          { l:'Alt Sektör',v: tesis.extra_data?.sub_sector ?? '—', c:'#94A3B8' },
                          { l:'Mahalle',   v: tesis.extra_data?.neighborhood ?? '—', c:'#94A3B8' },
                          { l:'H Skoru',   v: riskLabel(tesis.extra_data?.H_score),  c: riskRenk(tesis.extra_data?.H_score) },
                          { l:'Deprem',    v: riskLabel(tesis.extra_data?.risk_deprem), c: riskRenk(tesis.extra_data?.risk_deprem) },
                          { l:'Sel',       v: riskLabel(tesis.extra_data?.risk_sel),    c: riskRenk(tesis.extra_data?.risk_sel) },
                          { l:'Çalışan',   v: `${tesis.employee_count} kişi`,        c:'#94A3B8' },
                          { l:'Bina Yaşı', v: `${tesis.building_age} yıl`,           c:'#94A3B8' },
                        ].map(row => (
                          <div key={row.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <span style={{ fontSize:11, color:'#64748B' }}>{row.l}</span>
                            <span style={{ fontSize:11, fontWeight:500, color: row.c }}>{row.v}</span>
                          </div>
                        ))}
                        {hazmat && (
                          <div style={{
                            marginTop:4, padding:'5px 8px', borderRadius:6,
                            background:'#92400E22', border:'1px solid #F97316aa',
                            fontSize:11, color:'#FB923C', textAlign:'center', fontWeight:600,
                          }}>⬥ NATECH / Tehlikeli Madde Tesisi</div>
                        )}
                        {tesis.operates_24h && (
                          <div style={{
                            padding:'3px 8px', borderRadius:6,
                            background:'#0F172A', border:'1px solid #334155',
                            fontSize:10, color:'#94A3B8', textAlign:'center',
                          }}>24 saat operasyonel</div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>

        {/* Sağ panel — Mahalle risk özeti */}
        <div style={{
          width: 280, flexShrink: 0,
          background: '#0d1f3c',
          border: '1px solid #1e3a5f',
          borderRadius: 12,
          height: 560,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Panel başlık */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e3a5f', flexShrink: 0 }}>
            <p style={{ color: '#E8C97A', fontSize: 11, fontWeight: 700,
                        letterSpacing: 1.5, textTransform: 'uppercase', margin: 0 }}>
              Mahalle Risk Özeti
            </p>
            <p style={{ color: '#607899', fontSize: 11, margin: '4px 0 0' }}>
              Ortalama H-Skoru sıralaması
            </p>
          </div>

          {/* Liste */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {mahalleOzetleri.map(oz => {
              const secili = secilenMahalle === oz.isim
              return (
                <button
                  key={oz.isim}
                  onClick={() => setSecilenMahalle(secili ? null : oz.isim)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '10px 16px',
                    background: secili ? '#1a3558' : 'transparent',
                    border: 'none',
                    borderLeft: secili ? '3px solid #E8C97A' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'background .15s',
                  }}>
                  {/* Mahalle adı + tesis sayısı */}
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: secili ? '#F1F5F9' : '#CBD5E1',
                                   fontSize: 12, fontWeight: 600 }}>{oz.isim}</span>
                    <span style={{ color: '#607899', fontSize: 11 }}>{oz.sayi} tesis</span>
                  </div>

                  {/* Risk skorları — bar'lar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {[
                      { lbl: 'H Skoru', val: oz.hScore },
                      { lbl: 'Deprem',  val: oz.deprem },
                      { lbl: 'Sel',     val: oz.sel },
                    ].map(r => (
                      <div key={r.lbl} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#607899', fontSize: 10, width: 42, flexShrink: 0 }}>{r.lbl}</span>
                        <RiskBar val={r.val} />
                        <span style={{ color: riskRenk(r.val), fontSize: 10,
                                       width: 22, textAlign: 'right', flexShrink: 0 }}>
                          {r.val || '—'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Genişletilmiş detay */}
                  {secili && (
                    <div style={{ marginTop: 10, paddingTop: 10,
                                  borderTop: '1px solid #1e3a5f' }}>
                      {/* Hazmat uyarısı */}
                      {oz.hazmatSayi > 0 && (
                        <div style={{
                          marginBottom: 8, padding: '5px 8px', borderRadius: 6,
                          background: '#7c2d1222', border: '1px solid #f9731655',
                          fontSize: 11, color: '#fb923c', fontWeight: 600,
                        }}>
                          ⬥ {oz.hazmatSayi} NATECH tesisi
                        </div>
                      )}
                      {/* Sektör dağılımı */}
                      <p style={{ color: '#607899', fontSize: 10,
                                  fontWeight: 600, letterSpacing: 1,
                                  textTransform: 'uppercase', margin: '0 0 6px' }}>
                        Sektör Dağılımı
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {(Object.entries(oz.sektor) as [Sektor, number][])
                          .sort((a, b) => b[1] - a[1])
                          .map(([s, n]) => (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{
                                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                                background: SEKTOR_META[s]?.renk ?? '#64748B',
                              }} />
                              <span style={{ color: '#94A3B8', fontSize: 11, flex: 1 }}>
                                {SEKTOR_META[s]?.label ?? s}
                              </span>
                              <span style={{ color: '#CBD5E1', fontSize: 11, fontWeight: 600 }}>{n}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Panel alt satır */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid #1e3a5f',
                        flexShrink: 0, fontSize: 10, color: '#607899' }}>
            Tıkla → mahalle detayı · H Skoru: 0–5
          </div>
        </div>
      </div>

      {/* Lejant */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 px-1">
        {sektorler.filter(s => facilities.some(f => f.sector === s)).map(s => (
          <div key={s} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span style={{ background: SEKTOR_META[s].renk }}
              className="w-2.5 h-2.5 rounded-full flex-shrink-0" />
            {SEKTOR_META[s].label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 flex-shrink-0"
            style={{ background: '#EF4444', borderRadius: 2, transform: 'rotate(45deg)' }} />
          Kritik (H≥4)
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 flex-shrink-0"
            style={{ background: '#E8A87C', borderRadius: 2, transform: 'rotate(45deg)' }} />
          NATECH / Hazmat ⬥
        </div>
      </div>

      {/* Kaynak notu */}
      <div className="p-3 bg-[#E8C97A]/5 border border-[#E8C97A]/15 rounded-lg">
        <p className="text-xs text-slate-400">
          <span className="text-[#E8C97A] font-medium">Veri Kaynağı:</span>{' '}
          Supabase · facilities tablosu · tenant: Beylikdüzü Belediyesi ·{' '}
          {facilities.length} tesis · HFER-720 parametreleri
        </p>
      </div>
    </div>
  )
}
