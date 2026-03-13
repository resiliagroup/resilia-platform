'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TUM_TESİSLER, KATEGORİ_META, CBS_OZET, type CBSTesis, type CBSKategori } from '@/lib/beylikduzu-mock'

// ─── Leaflet default ikon fix (Next.js) ───────────────────────
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ─── DivIcon builder ──────────────────────────────────────────
function buildIcon(renk: string, kritik: boolean, acil: boolean): L.DivIcon {
  const size = kritik ? 22 : 16
  const border = acil ? '3px solid #fff' : `2px solid ${renk}`
  const ring = kritik
    ? `box-shadow: 0 0 0 3px ${renk}55, 0 2px 6px rgba(0,0,0,0.5);`
    : 'box-shadow: 0 1px 4px rgba(0,0,0,0.4);'
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:${size}px; height:${size}px;
        border-radius:50%;
        background:${renk};
        border:${border};
        ${ring}
        display:flex; align-items:center; justify-content:center;
      ">${kritik ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 21h20L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v5h2v-5h-2zm0 6v2h2v-2h-2z"/></svg>` : ''}</div>
    `,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor:[0, -(size / 2 + 4)],
  })
}

// ─── Harita yeniden boyutlandırma fix ─────────────────────────
function InvalidateFix() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

// ─── Risk skoru badge rengi ────────────────────────────────────
function riskBadge(skor?: number) {
  if (!skor) return { label: '—',       cls: 'bg-slate-700 text-slate-400' }
  if (skor >= 4) return { label: `${skor} Kritik`, cls: 'bg-red-500/20 text-red-400 border border-red-500/40' }
  if (skor >= 3) return { label: `${skor} Yüksek`, cls: 'bg-orange-500/20 text-orange-400 border border-orange-500/40' }
  if (skor >= 2) return { label: `${skor} Orta`,   cls: 'bg-amber-500/20 text-amber-400 border border-amber-500/40' }
  return { label: `${skor} Düşük`, cls: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' }
}

// ─── Kategori filtre butonu ────────────────────────────────────
interface FilterBtnProps {
  kat: CBSKategori | 'hepsi'
  aktif: CBSKategori | 'hepsi'
  onTikla: (k: CBSKategori | 'hepsi') => void
  sayi: number
}

function FilterBtn({ kat, aktif, onTikla, sayi }: FilterBtnProps) {
  const meta   = kat !== 'hepsi' ? KATEGORİ_META[kat] : null
  const label  = meta?.label ?? 'Tümü'
  const renk   = meta?.renk  ?? '#94A3B8'
  const seçili = aktif === kat
  return (
    <button
      onClick={() => onTikla(kat)}
      style={seçili ? { borderColor: renk, color: renk, backgroundColor: renk + '18' } : {}}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        seçili ? 'border-current' : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
      }`}>
      {meta && (
        <span style={{ background: seçili ? renk : '#475569', transition: 'background .15s' }}
          className="w-2.5 h-2.5 rounded-full flex-shrink-0" />
      )}
      {label}
      <span className="opacity-60">({sayi})</span>
    </button>
  )
}

// ─── Ana bileşen ──────────────────────────────────────────────
import { useState } from 'react'

export default function CBSHarita() {
  const [filtre, setFiltre] = useState<CBSKategori | 'hepsi'>('hepsi')
  const [katman, setKatman] = useState<'sokak' | 'uydu'>('sokak')

  const gösterilen = filtre === 'hepsi'
    ? TUM_TESİSLER
    : TUM_TESİSLER.filter(t => t.kategori === filtre)

  const kategoriler = Object.keys(KATEGORİ_META) as CBSKategori[]

  return (
    <div className="flex flex-col gap-4">

      {/* Özet KPI satırı */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Toplam Tesis',          val: CBS_OZET.toplam_tesis,                  renk: 'text-white'     },
          { label: 'Kritik Tesis (≥4)',      val: CBS_OZET.kritik_tesis_sayisi,           renk: 'text-red-400'   },
          { label: 'Acil Toplama Noktası',  val: CBS_OZET.acil_toplama_noktasi_sayisi,   renk: 'text-amber-400' },
          { label: 'Kategori',              val: Object.keys(CBS_OZET.kategoriler).length, renk: 'text-blue-400' },
        ].map(k => (
          <div key={k.label} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${k.renk}`}>{k.val}</p>
            <p className="text-xs text-slate-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Filtre butonları */}
      <div className="flex flex-wrap gap-2">
        <FilterBtn kat="hepsi" aktif={filtre} onTikla={setFiltre} sayi={TUM_TESİSLER.length} />
        {kategoriler.map(k => (
          <FilterBtn key={k} kat={k} aktif={filtre} onTikla={setFiltre}
            sayi={TUM_TESİSLER.filter(t => t.kategori === k).length} />
        ))}
      </div>

      {/* Harita */}
      <div className="rounded-xl overflow-hidden border border-slate-700/40" style={{ height: 520, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4, background: 'white', borderRadius: 8, padding: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          {(['sokak', 'uydu'] as const).map(k => (
            <button key={k} onClick={() => setKatman(k)}
              style={{
                padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                background: katman === k ? '#0A1628' : 'transparent',
                color: katman === k ? 'white' : '#64748B',
                transition: 'all .15s',
              }}>
              {k === 'sokak' ? 'Sokak' : 'Uydu'}
            </button>
          ))}
        </div>
        <MapContainer
          center={[CBS_OZET.merkez_koordinat.lat, CBS_OZET.merkez_koordinat.lng]}
          zoom={CBS_OZET.zoom_seviyesi}
          style={{ height: '100%', width: '100%', background: katman === 'sokak' ? '#fff' : '#000' }}>
          <InvalidateFix />
          {katman === 'sokak' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              attribution='Tiles &copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {gösterilen.map((tesis: CBSTesis) => {
            const kritik = (tesis.risk_skoru ?? 0) >= 4
            const renk   = kritik ? '#EF4444' : KATEGORİ_META[tesis.kategori].renk
            const acil   = tesis.acil_toplama_noktasi === true
            const badge  = riskBadge(tesis.risk_skoru)

            return (
              <Marker
                key={tesis.id}
                position={[tesis.koordinat.lat, tesis.koordinat.lng]}
                icon={buildIcon(renk, kritik, acil)}>
                <Popup minWidth={220} maxWidth={280}>
                  {/* Popup stil override — dark theme */}
                  <style>{`
                    .leaflet-popup-content-wrapper {
                      background: #1E293B;
                      border: 1px solid #334155;
                      border-radius: 12px;
                      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                      padding: 0;
                    }
                    .leaflet-popup-content { margin: 0; }
                    .leaflet-popup-tip { background: #1E293B; }
                  `}</style>

                  <div style={{ fontFamily: "'DM Sans', sans-serif", padding: '14px 16px' }}>
                    {/* Başlık */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%', background: renk,
                        flexShrink: 0, marginTop: 4,
                      }} />
                      <p style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 13, lineHeight: 1.4, margin: 0 }}>
                        {tesis.ad}
                      </p>
                    </div>

                    {/* Detaylar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#64748B' }}>Kategori</span>
                        <span style={{
                          fontSize: 11, fontWeight: 500, color: renk,
                          background: renk + '18', border: `1px solid ${renk}44`,
                          borderRadius: 6, padding: '2px 8px',
                        }}>
                          {KATEGORİ_META[tesis.kategori].label}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#64748B' }}>Alt Kategori</span>
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>{tesis.alt_kategori}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#64748B' }}>Risk Skoru</span>
                        <span style={{ fontSize: 11, fontWeight: 600 }}
                          className={badge.cls.split(' ').join(' ')}>
                          {/* inline style fallback for popup */}
                          <span style={{
                            color: (tesis.risk_skoru ?? 0) >= 4 ? '#F87171' :
                                   (tesis.risk_skoru ?? 0) >= 3 ? '#FB923C' :
                                   (tesis.risk_skoru ?? 0) >= 2 ? '#FBBF24' : '#34D399',
                          }}>
                            {badge.label}
                          </span>
                        </span>
                      </div>

                      {tesis.kapasite && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: '#64748B' }}>Kapasite</span>
                          <span style={{ fontSize: 11, color: '#94A3B8' }}>
                            {tesis.kapasite.toLocaleString('tr-TR')} {tesis.kapasite_birimi}
                          </span>
                        </div>
                      )}

                      {acil && (
                        <div style={{
                          marginTop: 4, padding: '4px 8px', borderRadius: 6,
                          background: '#78350F22', border: '1px solid #F59E0B44',
                          fontSize: 11, color: '#F59E0B', textAlign: 'center',
                        }}>
                          ⚡ Acil Toplama Noktası
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      {/* Lejant */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 px-1">
        {kategoriler.map(k => (
          <div key={k} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span style={{ background: KATEGORİ_META[k].renk }}
              className="w-2.5 h-2.5 rounded-full flex-shrink-0" />
            {KATEGORİ_META[k].label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-red-500 ring-2 ring-red-500/40" />
          Kritik (risk ≥ 4)
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-full flex-shrink-0 bg-slate-600 ring-2 ring-white/40" />
          Acil Toplama Noktası
        </div>
      </div>

      {/* CBS kaynak notu */}
      <div className="p-3 bg-[#E8C97A]/5 border border-[#E8C97A]/15 rounded-lg">
        <p className="text-xs text-slate-400">
          <span className="text-[#E8C97A] font-medium">Veri Kaynağı:</span>{' '}
          Beylikdüzü Belediyesi CBS · Gerçek koordinatlar · Demo: 16 Mart 2026 ·{' '}
          Canlı entegrasyon için: cbs.beylikduzu.istanbul/GiSoftGis/api
        </p>
      </div>
    </div>
  )
}
