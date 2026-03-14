'use client'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { createClient } from '@supabase/supabase-js'

/* ─── Supabase client (beylikdüzü projesi) ───────────────────── */
const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550',
)
const TENANT_ID = '11111111-0000-0000-0000-000000000001'

/* ─── Tipler ─────────────────────────────────────────────────── */
type Sektor = 'MUNICIPALITY' | 'HOSPITAL' | 'EDUCATION' | 'INDUSTRIAL' | 'BANK' | 'HOTEL' | 'OTHER'

interface ExtraData {
  neighborhood?:   string
  H_score?:        number
  risk_deprem?:    number
  risk_sel?:       number
  hazmat_flag?:    boolean
  natech_risk?:    number
  sub_sector?:     string
  [k: string]:     unknown
}

interface FacilityRow {
  id:              string
  name:            string
  sector:          Sektor
  employee_count:  number
  building_age:    number
  operates_24h:    boolean
  geom:            { type: string; coordinates: [number, number] } | null
  extra_data:      ExtraData | null
}

/* ─── Sektör meta ────────────────────────────────────────────── */
const META: Record<Sektor, { label: string; renk: string; emoji: string }> = {
  MUNICIPALITY: { label: 'Kamu',    renk: '#5BA3DC', emoji: '🏛️' },
  HOSPITAL:     { label: 'Sağlık',  renk: '#EF4444', emoji: '🏥' },
  EDUCATION:    { label: 'Eğitim',  renk: '#F59E0B', emoji: '🎓' },
  INDUSTRIAL:   { label: 'Sanayi',  renk: '#F97316', emoji: '🏭' },
  BANK:         { label: 'Finans',  renk: '#10B981', emoji: '🏦' },
  HOTEL:        { label: 'Turizm',  renk: '#A78BFA', emoji: '🏨' },
  OTHER:        { label: 'Diğer',   renk: '#94A3B8', emoji: '📍' },
}
const SEKTORLER = Object.keys(META).filter(s => s !== 'OTHER') as Sektor[]

/* ─── Yardımcılar ────────────────────────────────────────────── */
const riskRenk = (v = 0) =>
  v >= 4 ? '#EF4444' : v >= 3 ? '#F97316' : v >= 2 ? '#F59E0B' : v >= 1 ? '#22C55E' : '#334155'

const riskLabel = (v?: number) =>
  v == null ? '—' : v >= 4 ? `${v} Kritik` : v >= 3 ? `${v} Yüksek` : v >= 2 ? `${v} Orta` : `${v} Düşük`

/* ─── Leaflet icon fix ───────────────────────────────────────── */
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/* ─── DivIcon factory ────────────────────────────────────────── */
function mkIcon(renk: string, hazmat: boolean, kritik: boolean): L.DivIcon {
  const sz = kritik ? 22 : 16
  if (hazmat) {
    return L.divIcon({
      className: '',
      html: `<div style="width:${sz}px;height:${sz}px;background:#F97316;transform:rotate(45deg);
               border:2px solid #fff;border-radius:3px;
               box-shadow:0 0 0 2px #F9731688,0 2px 8px rgba(0,0,0,.55);
               display:flex;align-items:center;justify-content:center;">
               <span style="transform:rotate(-45deg);font-size:8px;color:#fff;line-height:1;">⚠</span>
             </div>`,
      iconSize:    [sz, sz],
      iconAnchor:  [sz / 2, sz / 2],
      popupAnchor: [0, -(sz / 2 + 5)],
    })
  }
  const inner = kritik
    ? `<svg width="9" height="9" viewBox="0 0 24 24" fill="white">
         <path d="M12 2L2 21h20L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v5h2v-5h-2zm0 6v2h2v-2h-2z"/>
       </svg>` : ''
  return L.divIcon({
    className: '',
    html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${renk};
             border:${kritik ? '3px solid #fff' : `2px solid ${renk}bb`};
             box-shadow:${kritik ? `0 0 0 3px ${renk}55,` : ''}0 1px 5px rgba(0,0,0,.4);
             display:flex;align-items:center;justify-content:center;">${inner}</div>`,
    iconSize:    [sz, sz],
    iconAnchor:  [sz / 2, sz / 2],
    popupAnchor: [0, -(sz / 2 + 4)],
  })
}

/* ─── Harita boyut fix ───────────────────────────────────────── */
function SizeFix() {
  const map = useMap()
  useEffect(() => { setTimeout(() => map.invalidateSize(), 120) }, [map])
  return null
}

/* ─── Mini progress bar ──────────────────────────────────────── */
function Bar({ val }: { val: number }) {
  return (
    <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#1a3558', overflow: 'hidden' }}>
      <div style={{
        width: `${Math.min((val / 5) * 100, 100)}%`, height: '100%',
        borderRadius: 2, background: riskRenk(val), transition: 'width .5s ease',
      }} />
    </div>
  )
}

/* ─── Skeleton satır ─────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <div style={{ height: 11, width: 80, borderRadius: 4, background: '#1a3558' }} />
        <div style={{ height: 11, width: 30, borderRadius: 4, background: '#1a3558' }} />
      </div>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 40, height: 9, borderRadius: 3, background: '#142340' }} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#142340' }} />
          <div style={{ width: 18, height: 9, borderRadius: 3, background: '#142340' }} />
        </div>
      ))}
    </div>
  )
}

/* ─── Mahalle hesaplama ──────────────────────────────────────── */
interface MahalleOzet {
  isim:       string
  sayi:       number
  hOrt:       number
  depremOrt:  number
  selOrt:     number
  hazmatSayi: number
  natechSayi: number
  sektor:     Partial<Record<Sektor, number>>
}

function hesaplaOzetler(list: FacilityRow[]): MahalleOzet[] {
  const map = new Map<string, FacilityRow[]>()
  for (const f of list) {
    const nb = f.extra_data?.neighborhood ?? 'Belirsiz'
    if (!map.has(nb)) map.set(nb, [])
    map.get(nb)!.push(f)
  }
  const ort = (arr: FacilityRow[], fn: (f: FacilityRow) => number | undefined) => {
    const vals = arr.map(fn).filter((v): v is number => v !== undefined && !isNaN(v))
    return vals.length ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : 0
  }
  return [...map.entries()]
    .map(([isim, arr]) => {
      const skt: Partial<Record<Sektor, number>> = {}
      for (const f of arr) skt[f.sector] = (skt[f.sector] ?? 0) + 1
      return {
        isim,
        sayi:       arr.length,
        hOrt:       ort(arr, f => f.extra_data?.H_score),
        depremOrt:  ort(arr, f => f.extra_data?.risk_deprem),
        selOrt:     ort(arr, f => f.extra_data?.risk_sel),
        hazmatSayi: arr.filter(f => f.extra_data?.hazmat_flag).length,
        natechSayi: arr.filter(f => (f.extra_data?.natech_risk ?? 0) >= 3.5).length,
        sektor:     skt,
      }
    })
    .sort((a, b) => b.hOrt - a.hOrt)
}

/* ═══════════════════════════════════════════════════════════════
   POPUP — koyu tema
═══════════════════════════════════════════════════════════════ */
const POPUP_STYLE = `
  .leaflet-popup-content-wrapper {
    background:#1E293B !important; border:1px solid #334155 !important;
    border-radius:12px !important; box-shadow:0 8px 28px rgba(0,0,0,.55) !important; padding:0 !important;
  }
  .leaflet-popup-content { margin:0 !important; }
  .leaflet-popup-tip { background:#1E293B !important; }
`

function TesisPopup({ f }: { f: FacilityRow }) {
  const meta   = META[f.sector] ?? META.OTHER
  const ed     = f.extra_data ?? {}
  const hazmat = ed.hazmat_flag ?? false

  const satir = (lbl: string, val: string, renk?: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, color: '#64748B', flexShrink: 0 }}>{lbl}</span>
      <span style={{ fontSize: 11, fontWeight: 500, color: renk ?? '#94A3B8',
                     textAlign: 'right', maxWidth: 150 }}>{val}</span>
    </div>
  )

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", padding: '14px 16px', minWidth: 220 }}>
      <style>{POPUP_STYLE}</style>

      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1, marginTop: 1 }}>{meta.emoji}</span>
        <div>
          <p style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 13, lineHeight: 1.35, margin: 0 }}>
            {f.name}
          </p>
          {/* Sektör badge */}
          <span style={{
            display: 'inline-block', marginTop: 5,
            fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
            padding: '2px 8px', borderRadius: 20,
            background: meta.renk + '22', color: meta.renk,
            border: `1px solid ${meta.renk}55`,
          }}>{meta.label}</span>
        </div>
      </div>

      {/* 8 alan */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
        {satir('Alt Sektör',  ed.sub_sector      ?? '—')}
        {satir('Mahalle',     ed.neighborhood     ?? '—')}
        {satir('H Skoru',     riskLabel(ed.H_score),     riskRenk(ed.H_score))}
        {satir('Deprem',      riskLabel(ed.risk_deprem), riskRenk(ed.risk_deprem))}
        {satir('Sel',         riskLabel(ed.risk_sel),    riskRenk(ed.risk_sel))}
        {satir('Çalışan',     `${f.employee_count} kişi`)}
        {satir('Bina Yaşı',   `${f.building_age} yıl`)}
      </div>

      {/* Badge'ler */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {hazmat && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
            background: '#7c2d1222', color: '#FB923C', border: '1px solid #F9731655',
          }}>⬥ NATECH / Hazmat</span>
        )}
        {f.operates_24h && (
          <span style={{
            fontSize: 10, padding: '3px 8px', borderRadius: 6,
            background: '#0F172A', color: '#60A5FA', border: '1px solid #1E3A5F',
          }}>24h Operasyonel</span>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAHALLE PANELİ
═══════════════════════════════════════════════════════════════ */
function MahallePanel({
  ozetler, yukleniyor, secilen, onSec,
}: {
  ozetler: MahalleOzet[]
  yukleniyor: boolean
  secilen: string | null
  onSec: (nb: string | null) => void
}) {
  return (
    <div style={{
      width: 280, flexShrink: 0, height: 560,
      background: '#0A1628',
      border: '1px solid #1a3558',
      borderRadius: 12,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Başlık */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #1a3558', flexShrink: 0 }}>
        <p style={{ margin: 0, color: '#E8C97A', fontSize: 11, fontWeight: 700,
                    letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Mahalle Risk Atlası
        </p>
        <p style={{ margin: '4px 0 0', color: '#607899', fontSize: 11 }}>
          H Skoru ortalamasına göre sıralı
        </p>
      </div>

      {/* Sütun başlıkları */}
      <div style={{
        padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6,
        borderBottom: '1px solid #0d1f3c', flexShrink: 0,
      }}>
        <span style={{ color: '#2d4a6a', fontSize: 9, fontWeight: 700,
                       letterSpacing: 1, textTransform: 'uppercase', width: 42 }}>Alan</span>
        <span style={{ color: '#2d4a6a', fontSize: 9, fontWeight: 700,
                       letterSpacing: 1, textTransform: 'uppercase', flex: 1 }}>H · Dep · Sel</span>
        <span style={{ color: '#2d4a6a', fontSize: 9, fontWeight: 700,
                       letterSpacing: 1, textTransform: 'uppercase', width: 18 }}></span>
      </div>

      {/* Liste */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {yukleniyor
          ? Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)
          : ozetler.map(oz => {
              const aktif = secilen === oz.isim
              return (
                <button key={oz.isim}
                  onClick={() => onSec(aktif ? null : oz.isim)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none', border: 'none',
                    cursor: 'pointer', padding: '10px 16px',
                    borderLeft: aktif ? '3px solid #E8C97A' : '3px solid transparent',
                    backgroundColor: aktif ? '#0d1f3c' : 'transparent',
                    transition: 'background .15s, border-color .15s',
                    borderBottom: '1px solid #0d1f3c',
                  }}>

                  {/* Satır: isim + sayı */}
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', marginBottom: 7 }}>
                    <span style={{ color: aktif ? '#F1F5F9' : '#CBD5E1',
                                   fontSize: 12, fontWeight: 600, letterSpacing: 0.2 }}>
                      {oz.isim}
                    </span>
                    <span style={{ color: '#607899', fontSize: 10 }}>{oz.sayi}</span>
                  </div>

                  {/* 3 × progress bar */}
                  {[
                    { lbl: 'H Sk.', val: oz.hOrt },
                    { lbl: 'Dep.',  val: oz.depremOrt },
                    { lbl: 'Sel',   val: oz.selOrt },
                  ].map(r => (
                    <div key={r.lbl} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: '#2d4a6a', fontSize: 9, width: 26, flexShrink: 0 }}>{r.lbl}</span>
                      <Bar val={r.val} />
                      <span style={{ color: riskRenk(r.val), fontSize: 9, width: 24,
                                     textAlign: 'right', flexShrink: 0, fontWeight: 600 }}>
                        {r.val || '—'}
                      </span>
                    </div>
                  ))}

                  {/* Expand: detay */}
                  {aktif && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #1a3558' }}>

                      {/* NATECH / Hazmat */}
                      {(oz.hazmatSayi > 0 || oz.natechSayi > 0) && (
                        <div style={{
                          marginBottom: 10, padding: '6px 10px', borderRadius: 6,
                          background: '#7c2d1218', border: '1px solid #f9731640',
                        }}>
                          {oz.natechSayi > 0 && (
                            <p style={{ margin: '0 0 2px', fontSize: 11, color: '#FB923C', fontWeight: 600 }}>
                              ⬥ {oz.natechSayi} NATECH tesisi
                            </p>
                          )}
                          {oz.hazmatSayi > 0 && (
                            <p style={{ margin: 0, fontSize: 11, color: '#FDBA74' }}>
                              ⚠ {oz.hazmatSayi} Hazmat tesisi
                            </p>
                          )}
                        </div>
                      )}

                      {/* Sektör dağılımı */}
                      <p style={{ margin: '0 0 6px', fontSize: 9, fontWeight: 700,
                                  letterSpacing: 1.2, textTransform: 'uppercase', color: '#2d4a6a' }}>
                        Sektör Dağılımı
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {(Object.entries(oz.sektor) as [Sektor, number][])
                          .sort((a, b) => b[1] - a[1])
                          .map(([s, n]) => {
                            const m = META[s] ?? META.OTHER
                            return (
                              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                <span style={{
                                  width: 7, height: 7, borderRadius: '50%',
                                  background: m.renk, flexShrink: 0,
                                }} />
                                <span style={{ flex: 1, color: '#8FA3B8', fontSize: 11 }}>{m.label}</span>
                                <span style={{ color: '#CBD5E1', fontSize: 11, fontWeight: 600 }}>{n}</span>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
      </div>

      {/* Alt bilgi */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid #1a3558',
                    flexShrink: 0, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#2d4a6a', fontSize: 10 }}>Tıkla → detay</span>
        <span style={{ color: '#2d4a6a', fontSize: 10 }}>H Skoru: 0 – 5</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ANA BİLEŞEN
═══════════════════════════════════════════════════════════════ */
export default function CBSHarita() {
  const [facilities,    setFacilities]    = useState<FacilityRow[]>([])
  const [yukleniyor,    setYukleniyor]    = useState(true)
  const [hata,          setHata]          = useState<string | null>(null)
  const [filtre,        setFiltre]        = useState<Sektor | 'hepsi'>('hepsi')
  const [secilenNb,     setSecilenNb]     = useState<string | null>(null)

  /* ── Veri çek ── */
  useEffect(() => {
    let iptal = false
    async function cek() {
      setYukleniyor(true)
      setHata(null)
      const { data, error } = await sb
        .from('facilities')
        .select(`
          id, name, sector, employee_count, building_age,
          operates_24h, geom, extra_data
        `)
        .eq('tenant_id', TENANT_ID)
        .eq('is_active', true)
        .limit(1500)

      if (iptal) return
      if (error) { setHata(error.message); setYukleniyor(false); return }
      setFacilities((data ?? []) as FacilityRow[])
      setYukleniyor(false)
    }
    cek()
    return () => { iptal = true }
  }, [])

  /* ── Türetilmiş ── */
  const gösterilen = useMemo(() =>
    facilities.filter(f =>
      f.geom?.coordinates &&
      (filtre === 'hepsi' || f.sector === filtre)
    ), [facilities, filtre])

  const mahalleOzetleri = useMemo(() => hesaplaOzetler(facilities), [facilities])

  const kpi = useMemo(() => ({
    toplam:  facilities.length,
    kritik:  facilities.filter(f => (f.extra_data?.H_score ?? 0) >= 4).length,
    hazmat:  facilities.filter(f => f.extra_data?.hazmat_flag).length,
    h24:     facilities.filter(f => f.operates_24h).length,
  }), [facilities])

  const onSec = useCallback((nb: string | null) => setSecilenNb(nb), [])

  /* ── Hata ── */
  if (hata) return (
    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
      ⚠ Supabase hatası: {hata}
    </div>
  )

  /* ── Render ── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16,
                  fontFamily: "'DM Sans', sans-serif" }}>

      {/* KPI ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {yukleniyor
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{
                height: 76, borderRadius: 12,
                background: 'rgba(30,41,59,.4)', border: '1px solid rgba(51,65,85,.4)',
                animation: 'pulse 1.5s infinite',
              }} />
            ))
          : [
              { lbl: 'Toplam Tesis',    v: kpi.toplam, renk: '#F1F5F9' },
              { lbl: 'Kritik (H ≥ 4)', v: kpi.kritik, renk: '#EF4444' },
              { lbl: 'Hazmat Tesisi',   v: kpi.hazmat, renk: '#F97316' },
              { lbl: '24h Operasyon',   v: kpi.h24,    renk: '#F59E0B' },
            ].map(k => (
              <div key={k.lbl} style={{
                background: 'rgba(30,41,59,.4)', border: '1px solid rgba(51,65,85,.4)',
                borderRadius: 12, padding: '16px 20px', textAlign: 'center',
              }}>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: k.renk }}>{k.v}</p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#64748B' }}>{k.lbl}</p>
              </div>
            ))}
      </div>

      {/* Filtre butonları ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {/* Tümü */}
        <button
          onClick={() => setFiltre('hepsi')}
          style={{
            padding: '6px 14px', borderRadius: 8, border: '1px solid',
            borderColor: filtre === 'hepsi' ? '#94A3B8' : '#334155',
            background:  filtre === 'hepsi' ? 'rgba(148,163,184,.15)' : 'transparent',
            color:       filtre === 'hepsi' ? '#F1F5F9' : '#64748B',
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
            transition: 'all .15s', fontFamily: "'DM Sans', sans-serif",
          }}>
          Tümü ({facilities.length})
        </button>
        {SEKTORLER.map(s => {
          const m   = META[s]
          const n   = facilities.filter(f => f.sector === s).length
          const aktif = filtre === s
          if (!n) return null
          return (
            <button key={s}
              onClick={() => setFiltre(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 8, border: '1px solid',
                borderColor: aktif ? m.renk : '#334155',
                background:  aktif ? m.renk + '22' : 'transparent',
                color:       aktif ? m.renk : '#64748B',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                transition: 'all .15s', fontFamily: "'DM Sans', sans-serif",
              }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: aktif ? m.renk : '#475569', flexShrink: 0,
                transition: 'background .15s',
              }} />
              {m.label}
              <span style={{ opacity: .6 }}>({n})</span>
            </button>
          )
        })}
      </div>

      {/* Harita + Sağ Panel ── */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* Harita */}
        <div style={{
          flex: 1, minWidth: 0, height: 560,
          borderRadius: 12, overflow: 'hidden',
          border: '1px solid rgba(51,65,85,.4)',
          position: 'relative',
        }}>
          {yukleniyor && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1000,
              background: 'rgba(10,22,40,.75)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              color: '#8FA3B8', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            }}>
              <svg style={{ animation: 'spin 1s linear infinite' }} width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".2"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#E8C97A" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Veriler yükleniyor…
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          <MapContainer center={[41.0, 28.675]} zoom={13}
            style={{ height: '100%', width: '100%' }}>
            <SizeFix />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {gösterilen.map(f => {
              const c      = f.geom!.coordinates  // [lng, lat]
              const m      = META[f.sector] ?? META.OTHER
              const hs     = f.extra_data?.H_score ?? 0
              const hazmat = f.extra_data?.hazmat_flag ?? false
              const kritik = hs >= 4
              const renk   = hazmat ? '#F97316' : kritik ? '#EF4444' : m.renk

              return (
                <Marker key={f.id} position={[c[1], c[0]]} icon={mkIcon(renk, hazmat, kritik)}>
                  <Popup minWidth={230} maxWidth={290}>
                    <TesisPopup f={f} />
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>

        {/* Sağ panel */}
        <MahallePanel
          ozetler={mahalleOzetleri}
          yukleniyor={yukleniyor}
          secilen={secilenNb}
          onSec={onSec}
        />
      </div>

      {/* Lejant ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', paddingLeft: 4 }}>
        {SEKTORLER.filter(s => facilities.some(f => f.sector === s)).map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6,
                                 fontSize: 12, color: '#94A3B8' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%',
                           background: META[s].renk, flexShrink: 0 }} />
            {META[s].label}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94A3B8' }}>
          <span style={{ width: 10, height: 10, background: '#EF4444',
                         borderRadius: 2, transform: 'rotate(45deg)', flexShrink: 0 }} />
          Kritik (H ≥ 4)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94A3B8' }}>
          <span style={{ width: 10, height: 10, background: '#F97316',
                         borderRadius: 2, transform: 'rotate(45deg)', flexShrink: 0 }} />
          NATECH / Hazmat ⬥
        </div>
      </div>

      {/* Kaynak notu ── */}
      <div style={{
        padding: '10px 14px', borderRadius: 8,
        background: 'rgba(232,201,122,.05)', border: '1px solid rgba(232,201,122,.15)',
      }}>
        <p style={{ margin: 0, fontSize: 11, color: '#64748B' }}>
          <span style={{ color: '#E8C97A', fontWeight: 600 }}>Veri Kaynağı: </span>
          Supabase · facilities tablosu · Beylikdüzü Belediyesi ·{' '}
          {yukleniyor ? '…' : `${facilities.length} tesis`} · HFER-720 parametreleri
        </p>
      </div>
    </div>
  )
}
