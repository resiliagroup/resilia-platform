'use client'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { createClient } from '@supabase/supabase-js'

/* ══════════════════════════════════════════════════════════════
   SUPABASE
══════════════════════════════════════════════════════════════ */
const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
)
const TENANT_ID = '11111111-0000-0000-0000-000000000001'

/* ══════════════════════════════════════════════════════════════
   TİPLER
══════════════════════════════════════════════════════════════ */
type MapMod    = 'tesis' | 'isi' | 'fn'
type TehlikeTur = 'deprem' | 'sel' | 'sicaklik' | 'firtina' | 'toplumsal' | 'natech'
type Sektor    = 'MUNICIPALITY' | 'HOSPITAL' | 'EDUCATION' | 'INDUSTRIAL' | 'BANK' | 'HOTEL' | 'OTHER'

interface ExtraData {
  neighborhood?:   string
  H_score?:        number
  X_score?:        number
  risk_deprem?:    number
  risk_sel?:       number
  risk_sicaklik?:  number
  risk_firtina?:   number
  risk_toplumsal?: number
  hazmat_flag?:    boolean
  natech_risk?:    number
  sub_sector?:     string
  [k: string]:     unknown
}

interface FacilityRow {
  id:             string
  name:           string
  sector:         Sektor
  employee_count: number
  building_age:   number
  operates_24h:   boolean
  geom:           { type: string; coordinates: [number, number] } | null
  extra_data:     ExtraData | null
}

/* ══════════════════════════════════════════════════════════════
   META
══════════════════════════════════════════════════════════════ */
const SEKTOR_META: Record<Sektor, { label: string; renk: string; emoji: string }> = {
  MUNICIPALITY: { label: 'Kamu',   renk: '#5BA3DC', emoji: '🏛️' },
  HOSPITAL:     { label: 'Sağlık', renk: '#EF4444', emoji: '🏥' },
  EDUCATION:    { label: 'Eğitim', renk: '#F59E0B', emoji: '🎓' },
  INDUSTRIAL:   { label: 'Sanayi', renk: '#F97316', emoji: '🏭' },
  BANK:         { label: 'Finans', renk: '#10B981', emoji: '🏦' },
  HOTEL:        { label: 'Turizm', renk: '#A78BFA', emoji: '🏨' },
  OTHER:        { label: 'Diğer',  renk: '#94A3B8', emoji: '📍' },
}
const SEKTORLER = (Object.keys(SEKTOR_META) as Sektor[]).filter(s => s !== 'OTHER')

const TEHLIKE_META: Record<TehlikeTur, { lbl: string; renk: string; emoji: string; alan: keyof ExtraData }> = {
  deprem:    { lbl: 'Deprem',    renk: '#EF4444', emoji: '🏔️', alan: 'risk_deprem'    },
  sel:       { lbl: 'Sel',       renk: '#3B82F6', emoji: '🌊', alan: 'risk_sel'       },
  sicaklik:  { lbl: 'Sıcaklık', renk: '#F59E0B', emoji: '🌡️', alan: 'risk_sicaklik'  },
  firtina:   { lbl: 'Fırtına',  renk: '#8B5CF6', emoji: '⛈️', alan: 'risk_firtina'   },
  toplumsal: { lbl: 'Toplumsal',renk: '#EC4899', emoji: '👥', alan: 'risk_toplumsal' },
  natech:    { lbl: 'NATECH',   renk: '#F97316', emoji: '☢️', alan: 'natech_risk'    },
}
const TEHLIKE_TURLERI = Object.keys(TEHLIKE_META) as TehlikeTur[]

/* ══════════════════════════════════════════════════════════════
   YARDIMCILAR
══════════════════════════════════════════════════════════════ */
function getScore(f: FacilityRow, tt: TehlikeTur): number {
  const ed = f.extra_data ?? {}
  return (ed[TEHLIKE_META[tt].alan] as number | undefined) ?? 0
}

const riskRenk  = (v = 0) => v >= 4 ? '#EF4444' : v >= 3 ? '#F97316' : v >= 2 ? '#F59E0B' : v >= 1 ? '#22C55E' : '#334155'
const riskLabel = (v?: number) => v == null ? '—' : v >= 4 ? `${v} Kritik` : v >= 3 ? `${v} Yüksek` : v >= 2 ? `${v} Orta` : `${v} Düşük`

/* ══════════════════════════════════════════════════════════════
   LEAFLET ICON
══════════════════════════════════════════════════════════════ */
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function mkIcon(renk: string, hazmat: boolean, kritik: boolean): L.DivIcon {
  const sz = kritik ? 22 : 16
  if (hazmat) {
    return L.divIcon({
      className: '',
      html: `<div style="width:${sz}px;height:${sz}px;background:#F97316;transform:rotate(45deg);
        border:2px solid #fff;border-radius:3px;
        box-shadow:0 0 0 2px #F9731688,0 2px 8px rgba(0,0,0,.55);
        display:flex;align-items:center;justify-content:center;">
        <span style="transform:rotate(-45deg);font-size:8px;color:#fff;line-height:1;">⚠</span></div>`,
      iconSize: [sz, sz], iconAnchor: [sz/2, sz/2], popupAnchor: [0, -(sz/2+5)],
    })
  }
  const inner = kritik
    ? `<svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 21h20L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v5h2v-5h-2zm0 6v2h2v-2h-2z"/></svg>`
    : ''
  return L.divIcon({
    className: '',
    html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${renk};
      border:${kritik?'3px solid #fff':`2px solid ${renk}bb`};
      box-shadow:${kritik?`0 0 0 3px ${renk}55,`:''}0 1px 5px rgba(0,0,0,.4);
      display:flex;align-items:center;justify-content:center;">${inner}</div>`,
    iconSize: [sz, sz], iconAnchor: [sz/2, sz/2], popupAnchor: [0, -(sz/2+4)],
  })
}

function SizeFix() {
  const map = useMap()
  useEffect(() => { setTimeout(() => map.invalidateSize(), 120) }, [map])
  return null
}

/* ══════════════════════════════════════════════════════════════
   ISI HARİTASI KATMANI — canvas overlay
══════════════════════════════════════════════════════════════ */
function HeatmapLayer({ facilities, tehlike }: { facilities: FacilityRow[]; tehlike: TehlikeTur }) {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    const canvas = document.createElement('canvas')
    canvas.style.cssText =
      'position:absolute;top:0;left:0;pointer-events:none;z-index:450;'
    container.appendChild(canvas)

    function zoomRadius(): number {
      const z = map.getZoom()
      if (z >= 15) return 40
      if (z >= 14) return 25
      return 15
    }

    function draw() {
      const w = container.clientWidth
      const h = container.clientHeight
      canvas.width  = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, w, h)

      const radius = zoomRadius()

      for (const f of facilities) {
        if (!f.geom?.coordinates) continue
        const score = getScore(f, tehlike)
        if (score < 0.3) continue
        const [lng, lat] = f.geom.coordinates
        const pt = map.latLngToContainerPoint([lat, lng])
        const t = Math.min(score / 5, 1)
        // green→yellow→red
        const r = Math.round(t < 0.5 ? t * 2 * 255 : 255)
        const g = Math.round(t < 0.5 ? 255 : (1 - t) * 2 * 255)
        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius)
        grad.addColorStop(0,   `rgba(${r},${g},0,0.6)`)
        grad.addColorStop(0.6, `rgba(${r},${g},0,0.25)`)
        grad.addColorStop(1,   `rgba(${r},${g},0,0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    draw()
    map.on('moveend zoomend', draw)
    return () => {
      map.off('moveend zoomend', draw)
      canvas.remove()
    }
  }, [map, facilities, tehlike])

  return null
}

/* ══════════════════════════════════════════════════════════════
   F-N EĞRİSİ
══════════════════════════════════════════════════════════════ */
interface FNPoint { name: string; N: number; cumF: number }

function buildFNCurves(facilities: FacilityRow[]) {
  return TEHLIKE_TURLERI.map(tt => {
    const raw = facilities
      .filter(f => f.geom?.coordinates)
      .map(f => {
        const score = getScore(f, tt)
        const xSc   = (f.extra_data?.X_score as number | undefined) ?? 2
        return { name: f.name, N: Math.max(1, Math.round(f.employee_count * xSc)), F: score * 0.001 }
      })
      .filter(p => p.F > 0)
      .sort((a, b) => b.N - a.N)

    let cum = 0
    const pts: FNPoint[] = raw.map(p => ({ name: p.name, N: p.N, cumF: (cum += p.F) }))
    return { tt, pts, color: TEHLIKE_META[tt].renk, label: TEHLIKE_META[tt].lbl }
  })
}

function FNCurve({ facilities }: { facilities: FacilityRow[] }) {
  const [aktivCurve, setAktivCurve] = useState<TehlikeTur | 'hepsi'>('hepsi')
  const [tooltip, setTooltip]       = useState<{ x: number; y: number; html: string } | null>(null)
  const [curves, setCurves]         = useState<ReturnType<typeof buildFNCurves>>([])

  useEffect(() => {
    setCurves(buildFNCurves(facilities))
  }, [facilities])

  const W = 800, H = 400
  const m = { t: 28, r: 28, b: 52, l: 76 }
  const pw = W - m.l - m.r
  const ph = H - m.t - m.b

  const xLogMin = 0, xLogMax = 4    // log10(1..10000)
  const yLogMin = -7, yLogMax = -2  // log10(1e-7..1e-2)

  const xS = (N: number) => m.l + (Math.log10(Math.max(1, N)) - xLogMin) / (xLogMax - xLogMin) * pw
  const yS = (F: number) => m.t + ph - (Math.log10(Math.max(1e-8, F)) - yLogMin) / (yLogMax - yLogMin) * ph

  const xTicks = [1, 10, 100, 1000, 10000]
  const yTicks = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7]

  // ALARP zones y-coords
  const yZones = { intolTop: yS(1e-2), intolBot: yS(1e-4), alarpBot: yS(1e-6), acceptBot: yS(1e-7) }

  return (
    <div style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: 14, padding: '20px 24px', marginTop: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ margin: 0, color: '#E8C97A', fontSize: 11, fontWeight: 700,
                      letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: "'DM Mono',monospace" }}>
            F-N Risk Eğrisi
          </p>
          <p style={{ margin: '3px 0 0', color: '#475569', fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>
            Kümülatif yıllık frekans — etkilenen nüfus
          </p>
        </div>
        {/* Curve filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {(['hepsi', ...TEHLIKE_TURLERI] as (TehlikeTur | 'hepsi')[]).map(tt => {
            const c = tt === 'hepsi' ? '#94A3B8' : TEHLIKE_META[tt].renk
            const a = aktivCurve === tt
            return (
              <button key={tt} onClick={() => setAktivCurve(tt)} style={{
                padding: '3px 10px', borderRadius: 20, border: `1px solid ${a ? c : '#334155'}`,
                background: a ? c + '25' : 'transparent', color: a ? c : '#475569',
                fontSize: 10, fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif",
                boxShadow: a ? `0 0 8px ${c}45` : 'none',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, flexShrink: 0 }}/>
                {tt === 'hepsi' ? 'Tümü' : TEHLIKE_META[tt].lbl}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ position: 'relative', height: 420, overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
          {/* ALARP Zones */}
          <rect x={m.l} y={yZones.intolTop}  width={pw} height={yZones.intolBot - yZones.intolTop}  fill="rgba(239,68,68,.09)"/>
          <rect x={m.l} y={yZones.intolBot}  width={pw} height={yZones.alarpBot - yZones.intolBot}  fill="rgba(245,158,11,.09)"/>
          <rect x={m.l} y={yZones.alarpBot}  width={pw} height={yZones.acceptBot - yZones.alarpBot} fill="rgba(34,197,94,.07)"/>

          {/* Zone labels */}
          {[
            { y: yZones.intolTop + 14,                          lbl: 'KABULEDİLEMEZ', c: 'rgba(239,68,68,.55)'  },
            { y: (yZones.intolBot + yZones.alarpBot) / 2 + 4,   lbl: 'ALARP',          c: 'rgba(245,158,11,.6)' },
            { y: yZones.alarpBot  + 14,                          lbl: 'KABULEDİLEBİLİR',c:'rgba(34,197,94,.55)' },
          ].map(z => (
            <text key={z.lbl} x={m.l + pw - 4} y={z.y} textAnchor="end" fill={z.c}
                  fontSize={9} fontFamily="DM Sans,sans-serif" fontWeight={700} letterSpacing={0.5}>
              {z.lbl}
            </text>
          ))}

          {/* Grid */}
          {xTicks.map(N => <line key={N} x1={xS(N)} y1={m.t} x2={xS(N)} y2={m.t+ph} stroke="#1E293B" strokeWidth={1}/>)}
          {yTicks.map(F => <line key={F} x1={m.l}   y1={yS(F)} x2={m.l+pw} y2={yS(F)} stroke="#1E293B" strokeWidth={1}/>)}

          {/* Axes */}
          <line x1={m.l} y1={m.t}    x2={m.l}    y2={m.t+ph} stroke="#334155" strokeWidth={1.5}/>
          <line x1={m.l} y1={m.t+ph} x2={m.l+pw} y2={m.t+ph} stroke="#334155" strokeWidth={1.5}/>

          {/* X ticks */}
          {xTicks.map(N => (
            <g key={N}>
              <line x1={xS(N)} y1={m.t+ph} x2={xS(N)} y2={m.t+ph+5} stroke="#475569" strokeWidth={1}/>
              <text x={xS(N)} y={m.t+ph+18} textAnchor="middle" fill="#64748B"
                    fontSize={10} fontFamily="DM Mono,monospace">{N >= 1000 ? `${N/1000}k` : N}</text>
            </g>
          ))}

          {/* Y ticks */}
          {yTicks.map(F => (
            <g key={F}>
              <line x1={m.l-5} y1={yS(F)} x2={m.l} y2={yS(F)} stroke="#475569" strokeWidth={1}/>
              <text x={m.l-8} y={yS(F)+4} textAnchor="end" fill="#64748B"
                    fontSize={9} fontFamily="DM Mono,monospace">
                {`10⁻${Math.abs(Math.log10(F)).toFixed(0)}`}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text x={m.l+pw/2} y={H-6} textAnchor="middle" fill="#8FA3B8"
                fontSize={11} fontFamily="DM Sans,sans-serif">Etkilenen Nüfus (N)</text>
          <text x={14} y={m.t+ph/2} textAnchor="middle" fill="#8FA3B8"
                fontSize={11} fontFamily="DM Sans,sans-serif"
                transform={`rotate(-90 14 ${m.t+ph/2})`}>Yıllık Frekans (F)</text>

          {/* Curves */}
          {curves.map(({ tt, pts, color }) => {
            const visible = aktivCurve === 'hepsi' || aktivCurve === tt
            if (!visible || pts.length < 2) return null
            const d = pts.map((p, i) => `${i===0?'M':'L'}${xS(p.N).toFixed(1)},${yS(p.cumF).toFixed(1)}`).join(' ')
            // Sample every 8th point for hover circles
            const sampled = pts.filter((_, i) => i % 8 === 0)
            return (
              <g key={tt}>
                <path d={d} fill="none" stroke={color} strokeWidth={2}
                      strokeLinejoin="round" strokeLinecap="round" opacity={0.85}/>
                {sampled.map((p, i) => (
                  <circle key={i} cx={xS(p.N)} cy={yS(p.cumF)} r={3.5} fill={color}
                          fillOpacity={0.8} style={{ cursor: 'pointer' }}
                          onMouseEnter={e => setTooltip({
                            x: e.clientX, y: e.clientY,
                            html: `${TEHLIKE_META[tt].lbl}\n${p.name}\nN = ${p.N.toLocaleString('tr-TR')}\nF = ${p.cumF.toExponential(2)}`,
                          })}
                          onMouseLeave={() => setTooltip(null)}/>
                ))}
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div style={{
            position: 'fixed', left: tooltip.x + 14, top: tooltip.y - 8, zIndex: 9999,
            background: '#1E293B', border: '1px solid #334155', borderRadius: 8,
            padding: '8px 12px', fontSize: 11, color: '#E2E8F0',
            pointerEvents: 'none', whiteSpace: 'pre-line', lineHeight: 1.6,
            boxShadow: '0 4px 20px rgba(0,0,0,.6)', fontFamily: "'DM Sans',sans-serif",
          }}>
            {tooltip.html}
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   POPUP
══════════════════════════════════════════════════════════════ */
const POPUP_CSS = `
  .leaflet-popup-content-wrapper{background:#1E293B!important;border:1px solid #334155!important;
    border-radius:12px!important;box-shadow:0 8px 28px rgba(0,0,0,.55)!important;padding:0!important}
  .leaflet-popup-content{margin:0!important}
  .leaflet-popup-tip{background:#1E293B!important}`

function TesisPopup({ f }: { f: FacilityRow }) {
  const meta   = SEKTOR_META[f.sector] ?? SEKTOR_META.OTHER
  const ed     = f.extra_data ?? {}
  const hazmat = ed.hazmat_flag ?? false
  const row = (lbl: string, val: string, c?: string) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
      <span style={{ fontSize:11, color:'#475569', flexShrink:0, fontFamily:"'DM Sans',sans-serif" }}>{lbl}</span>
      <span style={{ fontSize:11, fontWeight:500, color: c??'#94A3B8', textAlign:'right',
                     maxWidth:150, fontFamily:"'DM Mono',monospace" }}>{val}</span>
    </div>
  )
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", padding:'14px 16px', minWidth:220 }}>
      <style>{POPUP_CSS}</style>
      <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:12 }}>
        <span style={{ fontSize:18, flexShrink:0, lineHeight:1, marginTop:1 }}>{meta.emoji}</span>
        <div>
          <p style={{ color:'#F1F5F9', fontWeight:700, fontSize:13, lineHeight:1.35, margin:0 }}>{f.name}</p>
          <span style={{ display:'inline-block', marginTop:5, fontSize:10, fontWeight:700,
                         letterSpacing:1, textTransform:'uppercase', padding:'2px 8px',
                         borderRadius:20, background: meta.renk+'22', color: meta.renk,
                         border:`1px solid ${meta.renk}55` }}>{meta.label}</span>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:5, marginBottom:10 }}>
        {row('Alt Sektör',  String(ed.sub_sector ?? '—'))}
        {row('Mahalle',     String(ed.neighborhood ?? '—'))}
        {row('H Skoru',     riskLabel(ed.H_score    as number|undefined), riskRenk(ed.H_score    as number|undefined))}
        {row('Deprem',      riskLabel(ed.risk_deprem as number|undefined), riskRenk(ed.risk_deprem as number|undefined))}
        {row('Sel',         riskLabel(ed.risk_sel    as number|undefined), riskRenk(ed.risk_sel    as number|undefined))}
        {row('Çalışan',     `${f.employee_count} kişi`)}
        {row('Bina Yaşı',   `${f.building_age} yıl`)}
      </div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {hazmat && (
          <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:6,
                         background:'#7c2d1222', color:'#FB923C', border:'1px solid #F9731655' }}>
            ⬥ NATECH / Hazmat
          </span>
        )}
        {f.operates_24h && (
          <span style={{ fontSize:10, padding:'3px 8px', borderRadius:6,
                         background:'#0F172A', color:'#60A5FA', border:'1px solid #1E3A5F' }}>
            24h Operasyonel
          </span>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   GRADİENT BAR
══════════════════════════════════════════════════════════════ */
function GradBar({ val, lbl }: { val: number; lbl: string }) {
  const pct  = Math.min((val / 5) * 100, 100)
  const grad = `linear-gradient(90deg,#22C55E 0%,#F59E0B 50%,#EF4444 100%)`
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ color:'#475569', fontSize:9, fontFamily:"'DM Sans',sans-serif" }}>{lbl}</span>
        <span style={{ color: riskRenk(val), fontSize:9, fontWeight:700,
                       fontFamily:"'DM Mono',monospace" }}>{val||'—'}</span>
      </div>
      <div style={{ height:5, borderRadius:3, background:'#1E293B', overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', borderRadius:3,
                      background: grad, backgroundSize:`${100*(5/Math.max(val,0.1))}% 100%`,
                      transition:'width .5s ease' }}/>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   SKELETON
══════════════════════════════════════════════════════════════ */
function SkeletonRow() {
  const shimmer = { background:'linear-gradient(90deg,#1E293B 25%,#263548 50%,#1E293B 75%)',
                    backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }
  return (
    <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:8 }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <div style={{ height:11, width:88, borderRadius:4, ...shimmer }}/>
        <div style={{ height:11, width:28, borderRadius:4, ...shimmer }}/>
      </div>
      {[0,1,2].map(i => (
        <div key={i} style={{ display:'flex', flexDirection:'column', gap:3 }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div style={{ height:9, width:30, borderRadius:3, ...shimmer }}/>
            <div style={{ height:9, width:16, borderRadius:3, ...shimmer }}/>
          </div>
          <div style={{ height:5, borderRadius:3, ...shimmer }}/>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAHALLE PANELİ
══════════════════════════════════════════════════════════════ */
interface MahalleOzet {
  isim: string; sayi: number; hOrt: number; depremOrt: number; selOrt: number
  hazmatSayi: number; natechSayi: number; sektor: Partial<Record<Sektor,number>>
}

function hesaplaOzetler(list: FacilityRow[]): MahalleOzet[] {
  const map = new Map<string, FacilityRow[]>()
  for (const f of list) {
    const nb = f.extra_data?.neighborhood ?? 'Belirsiz'
    if (!map.has(nb)) map.set(nb, [])
    map.get(nb)!.push(f)
  }
  const ort = (arr: FacilityRow[], fn: (f:FacilityRow) => number|undefined) => {
    const v = arr.map(fn).filter((x): x is number => x !== undefined && !isNaN(x))
    return v.length ? parseFloat((v.reduce((a,b)=>a+b,0)/v.length).toFixed(1)) : 0
  }
  return [...map.entries()].map(([isim,arr]) => {
    const skt: Partial<Record<Sektor,number>> = {}
    for (const f of arr) skt[f.sector] = (skt[f.sector]??0)+1
    return {
      isim, sayi: arr.length,
      hOrt:      ort(arr, f => f.extra_data?.H_score),
      depremOrt: ort(arr, f => f.extra_data?.risk_deprem),
      selOrt:    ort(arr, f => f.extra_data?.risk_sel),
      hazmatSayi: arr.filter(f => f.extra_data?.hazmat_flag).length,
      natechSayi: arr.filter(f => (f.extra_data?.natech_risk as number|undefined ?? 0) >= 3.5).length,
      sektor: skt,
    }
  }).sort((a,b) => b.hOrt - a.hOrt)
}

function MahallePanel({ ozetler, yukleniyor, secilen, onSec }:{
  ozetler: MahalleOzet[]; yukleniyor: boolean
  secilen: string|null; onSec: (nb:string|null) => void
}) {
  return (
    <div style={{ width:280, flexShrink:0, height:560, background:'#0F172A',
                  border:'1px solid #334155', borderRadius:14,
                  display:'flex', flexDirection:'column', overflow:'hidden',
                  fontFamily:"'DM Sans',sans-serif" }}>

      {/* Başlık */}
      <div style={{ padding:'14px 16px 10px', borderBottom:'1px solid #1E293B', flexShrink:0 }}>
        <p style={{ margin:0, color:'#E8C97A', fontSize:11, fontWeight:700,
                    letterSpacing:1.5, textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>
          Mahalle Risk Atlası
        </p>
        <p style={{ margin:'3px 0 0', color:'#475569', fontSize:11 }}>H Skoru · büyükten küçüğe</p>
      </div>

      {/* Sütun başlıkları */}
      <div style={{ padding:'5px 16px', display:'flex', gap:6,
                    borderBottom:'1px solid #0d1625', flexShrink:0 }}>
        <span style={{ color:'#1E3A5F', fontSize:9, fontWeight:700, letterSpacing:1,
                       textTransform:'uppercase', flex:1 }}>Mahalle</span>
        <span style={{ color:'#1E3A5F', fontSize:9, fontWeight:700, letterSpacing:1,
                       textTransform:'uppercase', width:28 }}>Adet</span>
      </div>

      {/* Liste */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {yukleniyor
          ? Array.from({length:7}).map((_,i) => <SkeletonRow key={i}/>)
          : ozetler.map(oz => {
              const aktif = secilen === oz.isim
              return (
                <button key={oz.isim} onClick={() => onSec(aktif ? null : oz.isim)}
                  style={{
                    width:'100%', textAlign:'left', background:'none', border:'none',
                    cursor:'pointer', padding:'10px 16px',
                    borderLeft: aktif ? '3px solid #E8C97A' : '3px solid transparent',
                    backgroundColor: aktif ? '#111827' : 'transparent',
                    transition:'background .15s, border-color .15s',
                    borderBottom:'1px solid #0d1625',
                  }}>
                  {/* İsim + sayı */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <span style={{ color: aktif?'#F1F5F9':'#CBD5E1', fontSize:12, fontWeight:600, letterSpacing:0.2 }}>
                      {oz.isim}
                    </span>
                    <span style={{ color:'#475569', fontSize:10, fontFamily:"'DM Mono',monospace" }}>{oz.sayi}</span>
                  </div>
                  {/* 3 gradient bar */}
                  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                    <GradBar val={oz.hOrt}     lbl="H Skoru"/>
                    <GradBar val={oz.depremOrt} lbl="Deprem"/>
                    <GradBar val={oz.selOrt}    lbl="Sel"/>
                  </div>
                  {/* Expand */}
                  {aktif && (
                    <div style={{ marginTop:10, paddingTop:10, borderTop:'1px solid #1E293B' }}>
                      {(oz.hazmatSayi > 0 || oz.natechSayi > 0) && (
                        <div style={{ marginBottom:10, padding:'6px 10px', borderRadius:8,
                                      background:'#7c2d1215', border:'1px solid #f9731640' }}>
                          {oz.natechSayi > 0 && (
                            <p style={{ margin:'0 0 2px', fontSize:11, color:'#FB923C', fontWeight:600 }}>
                              ☢️ {oz.natechSayi} NATECH tesisi
                            </p>
                          )}
                          {oz.hazmatSayi > 0 && (
                            <p style={{ margin:0, fontSize:11, color:'#FDBA74' }}>
                              ⚠ {oz.hazmatSayi} Hazmat tesisi
                            </p>
                          )}
                        </div>
                      )}
                      <p style={{ margin:'0 0 6px', fontSize:9, fontWeight:700, letterSpacing:1.2,
                                  textTransform:'uppercase', color:'#1E3A5F', fontFamily:"'DM Mono',monospace" }}>
                        Sektör Dağılımı
                      </p>
                      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                        {(Object.entries(oz.sektor) as [Sektor,number][])
                          .sort((a,b)=>b[1]-a[1])
                          .map(([s,n]) => {
                            const sm = SEKTOR_META[s] ?? SEKTOR_META.OTHER
                            return (
                              <div key={s} style={{ display:'flex', alignItems:'center', gap:7 }}>
                                <span style={{ width:7,height:7,borderRadius:'50%',background:sm.renk,flexShrink:0 }}/>
                                <span style={{ flex:1, color:'#64748B', fontSize:11 }}>{sm.label}</span>
                                <span style={{ color:'#CBD5E1', fontSize:11, fontWeight:600,
                                               fontFamily:"'DM Mono',monospace" }}>{n}</span>
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

      {/* Footer */}
      <div style={{ padding:'8px 16px', borderTop:'1px solid #1E293B', flexShrink:0,
                    display:'flex', justifyContent:'space-between' }}>
        <span style={{ color:'#1E3A5F', fontSize:10 }}>Tıkla → detay</span>
        <span style={{ color:'#1E3A5F', fontSize:10, fontFamily:"'DM Mono',monospace" }}>0 – 5 skala</span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   HEXAGON BUTON (tehlike seçici)
══════════════════════════════════════════════════════════════ */
function HexBtn({ tt, aktif, onClick }:{ tt:TehlikeTur; aktif:boolean; onClick:()=>void }) {
  const m = TEHLIKE_META[tt]
  return (
    <div style={{ position:'relative', width:76, height:76 }}>
      {/* Glow */}
      {aktif && (
        <div style={{
          position:'absolute', inset:'-3px',
          background: m.renk, filter:'blur(10px)', opacity:0.5,
          clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
        }}/>
      )}
      <button onClick={onClick} style={{
        position:'relative', width:'100%', height:'100%', border:'none', cursor:'pointer',
        clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
        background: aktif ? m.renk : '#1E293B',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3,
        transition:'background .2s', fontFamily:"'DM Sans',sans-serif",
      }}>
        <span style={{ fontSize:20, lineHeight:1 }}>{m.emoji}</span>
        <span style={{ fontSize:8, fontWeight:700, letterSpacing:0.5,
                       color: aktif ? '#0F172A' : '#475569', textTransform:'uppercase' }}>
          {m.lbl}
        </span>
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   KPI KART
══════════════════════════════════════════════════════════════ */
function KpiCard({ icon, val, lbl, renk, yukleniyor }:{
  icon: React.ReactNode; val: number; lbl: string; renk: string; yukleniyor: boolean
}) {
  if (yukleniyor) return (
    <div style={{ border:'1px solid #1E293B', borderRadius:14,
                  padding:'18px 20px', height:88,
                  background:'linear-gradient(90deg,#0F172A 25%,#1E293B 50%,#0F172A 75%)',
                  backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }}/>
  )
  return (
    <div style={{ background:'#0F172A', border:'1px solid #1E293B', borderRadius:14,
                  padding:'16px 20px', display:'flex', alignItems:'center', gap:14 }}>
      <div style={{ width:40, height:40, borderRadius:10, background: renk+'18',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <span style={{ color: renk }}>{icon}</span>
      </div>
      <div>
        <p style={{ margin:0, fontSize:26, fontWeight:700, color: renk, lineHeight:1,
                    fontFamily:"'DM Mono',monospace" }}>{val}</p>
        <p style={{ margin:'3px 0 0', fontSize:11, color:'#475569', fontFamily:"'DM Sans',sans-serif" }}>{lbl}</p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAP MODE TOGGLE
══════════════════════════════════════════════════════════════ */
function ModeToggle({ mod, onSet }:{ mod:MapMod; onSet:(m:MapMod)=>void }) {
  const opts: {k:MapMod; lbl:string}[] = [
    { k:'tesis', lbl:'Tesis' },
    { k:'isi',   lbl:'Isı Haritası' },
    { k:'fn',    lbl:'F-N Eğrisi' },
  ]
  return (
    <div style={{ display:'inline-flex', background:'#0F172A', border:'1px solid #334155',
                  borderRadius:10, padding:3, gap:2 }}>
      {opts.map(o => (
        <button key={o.k} onClick={() => onSet(o.k)} style={{
          padding:'6px 18px', borderRadius:8, border:'none', cursor:'pointer',
          background: mod===o.k ? '#1E293B' : 'transparent',
          color: mod===o.k ? '#F1F5F9' : '#475569',
          fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
          boxShadow: mod===o.k ? '0 1px 4px rgba(0,0,0,.4)' : 'none',
          transition:'all .15s',
        }}>
          {o.lbl}
        </button>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   ANA BİLEŞEN
══════════════════════════════════════════════════════════════ */
export default function CBSHarita() {
  const [facilities, setFacilities] = useState<FacilityRow[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata,       setHata]       = useState<string|null>(null)
  const [filtre,     setFiltre]     = useState<Sektor|'hepsi'>('hepsi')
  const [secilenNb,  setSecilenNb]  = useState<string|null>(null)
  const [mapMod,     setMapMod]     = useState<MapMod>('tesis')
  const [tehlike,    setTehlike]    = useState<TehlikeTur>('deprem')

  /* Veri çek */
  useEffect(() => {
    let iptal = false
    async function cek() {
      setYukleniyor(true); setHata(null)
      const { data, error } = await sb
        .from('facilities')
        .select('id,name,sector,employee_count,building_age,operates_24h,geom,extra_data')
        .eq('tenant_id', TENANT_ID)
        .eq('is_active', true)
        .limit(1000)
      if (iptal) return
      if (error) { setHata(error.message); setYukleniyor(false); return }
      console.log('[CBSHarita] Supabase yanıtı:', { adet: data?.length ?? 0, tenant_id: TENANT_ID, hata: error })
      setFacilities((data ?? []) as FacilityRow[])
      setYukleniyor(false)
    }
    cek()
    return () => { iptal = true }
  }, [])

  const gösterilen = useMemo(() =>
    facilities.filter(f => f.geom?.coordinates && (filtre==='hepsi'||f.sector===filtre)),
    [facilities, filtre])

  const mahalleOzetleri = useMemo(() => hesaplaOzetler(facilities), [facilities])

  const kpi = useMemo(() => ({
    toplam: facilities.length,
    kritik: facilities.filter(f => (f.extra_data?.H_score as number|undefined ?? 0) >= 4).length,
    hazmat: facilities.filter(f => f.extra_data?.hazmat_flag).length,
    h24:    facilities.filter(f => f.operates_24h).length,
  }), [facilities])

  const onSec = useCallback((nb:string|null) => setSecilenNb(nb), [])

  if (hata) return (
    <div style={{ padding:16, background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)',
                  borderRadius:12, color:'#F87171', fontSize:13 }}>
      ⚠ Supabase hatası: {hata}
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap');
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* KPI ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        <KpiCard yukleniyor={yukleniyor} val={kpi.toplam} lbl="Toplam Tesis"   renk="#60A5FA"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}/>
        <KpiCard yukleniyor={yukleniyor} val={kpi.kritik} lbl="Kritik (H ≥ 4)" renk="#EF4444"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}/>
        <KpiCard yukleniyor={yukleniyor} val={kpi.hazmat} lbl="Hazmat Tesisi"  renk="#F97316"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>}/>
        <KpiCard yukleniyor={yukleniyor} val={kpi.h24}    lbl="24h Operasyon"  renk="#F59E0B"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}/>
      </div>

      {/* Kontrol satırı: mode toggle + filtre */}
      <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <ModeToggle mod={mapMod} onSet={setMapMod}/>
        <div style={{ width:1, height:28, background:'#1E293B' }}/>
        {/* Sektör filtre pill butonları */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          <button onClick={() => setFiltre('hepsi')} style={{
            padding:'5px 14px', borderRadius:20, border:`1px solid ${filtre==='hepsi'?'#64748B':'#1E293B'}`,
            background: filtre==='hepsi' ? 'rgba(100,116,139,.2)' : 'transparent',
            color: filtre==='hepsi' ? '#F1F5F9' : '#475569',
            fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
            boxShadow: filtre==='hepsi' ? '0 0 10px rgba(100,116,139,.35)' : 'none',
            transition:'all .15s',
          }}>Tümü ({facilities.length})</button>
          {SEKTORLER.map(s => {
            const sm = SEKTOR_META[s]
            const n  = facilities.filter(f=>f.sector===s).length
            const a  = filtre===s
            if (!n) return null
            return (
              <button key={s} onClick={() => setFiltre(s)} style={{
                display:'flex', alignItems:'center', gap:5,
                padding:'5px 14px', borderRadius:20, border:`1px solid ${a?sm.renk:'#1E293B'}`,
                background: a ? sm.renk+'22' : 'transparent', color: a ? sm.renk : '#475569',
                fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                boxShadow: a ? `0 0 12px ${sm.renk}45` : 'none',
                transition:'all .15s',
              }}>
                <span style={{ width:7, height:7, borderRadius:'50%',
                               background: a ? sm.renk : '#334155', flexShrink:0, transition:'background .15s' }}/>
                {sm.label}
                <span style={{ opacity:.55, fontFamily:"'DM Mono',monospace", fontSize:11 }}>({n})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tehlike seçici hexagonlar (sadece ısı haritası modunda) */}
      {mapMod === 'isi' && (
        <div style={{ background:'#0F172A', border:'1px solid #1E293B', borderRadius:12,
                      padding:'16px 20px', display:'flex', alignItems:'center', gap:20 }}>
          <div>
            <p style={{ margin:'0 0 4px', color:'#E8C97A', fontSize:10, fontWeight:700,
                        letterSpacing:1.5, textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>
              Tehlike Katmanı
            </p>
            <p style={{ margin:0, color:'#475569', fontSize:11, fontFamily:"'DM Sans',sans-serif" }}>
              Haritada gösterilecek risk türünü seçin
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,76px)', gap:8, marginLeft:12 }}>
            {TEHLIKE_TURLERI.map(tt => (
              <HexBtn key={tt} tt={tt} aktif={tehlike===tt} onClick={() => setTehlike(tt)}/>
            ))}
          </div>
          <div style={{ marginLeft:'auto', background:'#1E293B', borderRadius:8, padding:'10px 14px' }}>
            <p style={{ margin:'0 0 6px', color:'#475569', fontSize:9, fontWeight:700,
                        letterSpacing:1, textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>
              Renk Skalası
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ color:'#22C55E', fontSize:10, fontFamily:"'DM Mono',monospace" }}>0</span>
              <div style={{ width:80, height:6, borderRadius:3,
                             background:'linear-gradient(90deg,#22C55E,#F59E0B,#EF4444)' }}/>
              <span style={{ color:'#EF4444', fontSize:10, fontFamily:"'DM Mono',monospace" }}>5</span>
            </div>
          </div>
        </div>
      )}

      {/* Harita + Sağ Panel ── */}
      <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
        {/* Harita */}
        <div style={{ flex:1, minWidth:0, height:560, borderRadius:14, overflow:'hidden',
                      border:'1px solid #1E293B', position:'relative' }}>
          {yukleniyor && (
            <div style={{ position:'absolute', inset:0, zIndex:1000,
                          background:'rgba(10,22,40,.8)',
                          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                          color:'#64748B', fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>
              <svg style={{ animation:'spin 1s linear infinite' }} width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".2"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#E8C97A" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Veriler yükleniyor…
            </div>
          )}
          <MapContainer center={[41.0, 28.675]} zoom={13} style={{ height:'100%', width:'100%' }}>
            <SizeFix/>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapMod === 'isi' && (
              <HeatmapLayer facilities={gösterilen} tehlike={tehlike}/>
            )}
            {(mapMod === 'tesis' || mapMod === 'fn') && gösterilen.map(f => {
              const c      = f.geom!.coordinates
              const sm     = SEKTOR_META[f.sector] ?? SEKTOR_META.OTHER
              const hs     = (f.extra_data?.H_score as number|undefined) ?? 0
              const hazmat = f.extra_data?.hazmat_flag ?? false
              const kritik = hs >= 4
              const renk   = hazmat ? '#F97316' : kritik ? '#EF4444' : sm.renk
              return (
                <Marker key={f.id} position={[c[1], c[0]]} icon={mkIcon(renk, hazmat, kritik)}>
                  <Popup minWidth={230} maxWidth={290}><TesisPopup f={f}/></Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>

        {/* Sağ panel */}
        <MahallePanel ozetler={mahalleOzetleri} yukleniyor={yukleniyor}
                      secilen={secilenNb} onSec={onSec}/>
      </div>

      {/* F-N Eğrisi paneli */}
      {mapMod === 'fn' && (
        <FNCurve facilities={facilities}/>
      )}

      {/* Lejant */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 20px', paddingLeft:4 }}>
        {SEKTORLER.filter(s => facilities.some(f=>f.sector===s)).map(s => (
          <div key={s} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#64748B' }}>
            <span style={{ width:9, height:9, borderRadius:'50%', background:SEKTOR_META[s].renk, flexShrink:0 }}/>
            {SEKTOR_META[s].label}
          </div>
        ))}
        {[
          { c:'#EF4444', lbl:'Kritik (H≥4)', r:2 },
          { c:'#F97316', lbl:'NATECH⬥',      r:2 },
        ].map(i => (
          <div key={i.lbl} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#64748B' }}>
            <span style={{ width:9,height:9,background:i.c,borderRadius:i.r,transform:'rotate(45deg)',flexShrink:0 }}/>
            {i.lbl}
          </div>
        ))}
      </div>

      {/* Kaynak notu */}
      <div style={{ padding:'10px 14px', borderRadius:8,
                    background:'rgba(232,201,122,.05)', border:'1px solid rgba(232,201,122,.12)' }}>
        <p style={{ margin:0, fontSize:11, color:'#475569', fontFamily:"'DM Sans',sans-serif" }}>
          <span style={{ color:'#E8C97A', fontWeight:600 }}>Veri Kaynağı: </span>
          Supabase · facilities · Beylikdüzü Belediyesi ·{' '}
          <span style={{ fontFamily:"'DM Mono',monospace" }}>
            {yukleniyor ? '…' : `${facilities.length} tesis`}
          </span>
          {' '}· HFER-720 parametreleri
        </p>
      </div>
    </div>
  )
}
