'use client'
import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
)

type RiskSeviye = 'critical' | 'high' | 'medium' | 'low'

interface Tesis {
  id: string
  name: string
  sector: string
  employee_count: number
  building_age: number
  geom: { type: string; coordinates: [number, number] } | null
  extra_data: {
    uri_score?: number
    natech_risk?: number
    hazmat_flag?: boolean
    sub_sector?: string
    neighborhood?: string
    [k: string]: unknown
  } | null
}

function riskSeviye(uri: number): RiskSeviye {
  if (uri >= 60) return 'critical'
  if (uri >= 40) return 'high'
  if (uri >= 20) return 'medium'
  return 'low'
}

const RISK_RENK: Record<RiskSeviye, string> = {
  critical: '#EF4444',
  high:     '#F97316',
  medium:   '#EAB308',
  low:      '#22C55E',
}

const RISK_LABEL: Record<RiskSeviye, string> = {
  critical: 'Kritik ≥60',
  high:     'Yüksek 40-60',
  medium:   'Orta 20-40',
  low:      'Düşük <20',
}

function markerIcon(renk: string, natech: boolean) {
  return L.divIcon({
    className: '',
    html: `<div style="width:${natech?12:8}px;height:${natech?12:8}px;border-radius:50%;background:${renk};border:2px solid white;box-shadow:0 0 4px ${renk}88;"></div>`,
    iconSize: [natech?12:8, natech?12:8],
    iconAnchor: [natech?6:4, natech?6:4],
  })
}

function AutoBounds() {
  const map = useMap()
  useEffect(() => {
    map.setView([41.015, 28.95], 10)
    map.setMaxBounds([[40.5, 27.5], [41.8, 30.5]])
  }, [map])
  return null
}

export default function IstanbulHarita() {
  const [tesisler, setTesisler] = useState<Tesis[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [filtre, setFiltre] = useState<RiskSeviye | 'all' | 'natech'>('all')

  useEffect(() => {
    async function yukle() {
      const tumTesisler: Tesis[] = []
      let offset = 0
      while (true) {
        const { data, error } = await sb
          .from('facilities')
          .select('id, name, sector, employee_count, building_age, geom, extra_data')
          .not('geom', 'is', null)
          .range(offset, offset + 999)
        if (error || !data || data.length === 0) break
        tumTesisler.push(...(data as Tesis[]))
        if (data.length < 1000) break
        offset += 1000
      }
      setTesisler(tumTesisler)
      setYukleniyor(false)
    }
    yukle()
  }, [])

  const gorunen = tesisler.filter(t => {
    if (filtre === 'all') return true
    if (filtre === 'natech') return !!(t.extra_data?.hazmat_flag || (t.extra_data?.natech_risk as number) > 0)
    return riskSeviye((t.extra_data?.uri_score as number) || 0) === filtre
  })

  const ist = {
    critical: tesisler.filter(t => riskSeviye((t.extra_data?.uri_score as number)||0) === 'critical').length,
    high:     tesisler.filter(t => riskSeviye((t.extra_data?.uri_score as number)||0) === 'high').length,
    medium:   tesisler.filter(t => riskSeviye((t.extra_data?.uri_score as number)||0) === 'medium').length,
    low:      tesisler.filter(t => riskSeviye((t.extra_data?.uri_score as number)||0) === 'low').length,
    natech:   tesisler.filter(t => !!(t.extra_data?.hazmat_flag || (t.extra_data?.natech_risk as number) > 0)).length,
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {/* Filtre bar */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
        {([['all','Tümü','#64748B']] as const).map(([k,l,r]) => (
          <button key={k} onClick={()=>setFiltre(k)}
            style={{ padding:'5px 12px', borderRadius:20, border:`1px solid ${filtre===k?r:'#D1D5DB'}`, background:filtre===k?r+'18':'white', color:filtre===k?r:'#6B7280', fontSize:12, cursor:'pointer', fontWeight:filtre===k?600:400 }}>
            {l} ({tesisler.length})
          </button>
        ))}
        {(Object.entries(RISK_RENK) as [RiskSeviye, string][]).map(([sev, renk]) => (
          <button key={sev} onClick={()=>setFiltre(sev)}
            style={{ padding:'5px 12px', borderRadius:20, border:`1px solid ${filtre===sev?renk:'#D1D5DB'}`, background:filtre===sev?renk+'18':'white', color:filtre===sev?renk:'#6B7280', fontSize:12, cursor:'pointer', fontWeight:filtre===sev?600:400 }}>
            {RISK_LABEL[sev]} ({ist[sev]})
          </button>
        ))}
        <button onClick={()=>setFiltre('natech')}
          style={{ padding:'5px 12px', borderRadius:20, border:`1px solid ${filtre==='natech'?'#EF4444':'#D1D5DB'}`, background:filtre==='natech'?'#EF444418':'white', color:filtre==='natech'?'#EF4444':'#6B7280', fontSize:12, cursor:'pointer', fontWeight:filtre==='natech'?600:400 }}>
          ⚠️ NATECH ({ist.natech})
        </button>
        <span style={{ marginLeft:'auto', fontSize:11, color:'#9CA3AF' }}>
          {yukleniyor ? '⏳ Yükleniyor...' : `${gorunen.length.toLocaleString('tr')} tesis`}
        </span>
      </div>

      {/* Harita */}
      <div style={{ borderRadius:12, overflow:'hidden', border:'1px solid #E5E7EB', height:560, position:'relative' }}>
        {yukleniyor && (
          <div style={{ position:'absolute', inset:0, zIndex:1000, background:'rgba(255,255,255,0.9)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
            <div style={{ fontSize:24 }}>🗺️</div>
            <div style={{ color:'#2D8A87', fontSize:13, fontWeight:600 }}>Tesis verileri yükleniyor...</div>
          </div>
        )}
        <MapContainer center={[41.015, 28.95]} zoom={10} style={{ height:'100%', width:'100%' }}
          maxBounds={[[40.5, 27.5], [41.8, 30.5]]} maxBoundsViscosity={0.8}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='© CartoDB'
          />
          <AutoBounds />
          {gorunen.map(t => {
            if (!t.geom?.coordinates) return null
            const [lng, lat] = t.geom.coordinates
            if (!lat || !lng || lat < 40.5 || lat > 41.8 || lng < 27.5 || lng > 30.5) return null
            const uri = (t.extra_data?.uri_score as number) || 0
            const seviye = riskSeviye(uri)
            const renk = RISK_RENK[seviye]
            const natech = !!(t.extra_data?.hazmat_flag || (t.extra_data?.natech_risk as number) > 0)
            return (
              <Marker key={t.id} position={[lat, lng]} icon={markerIcon(renk, natech)}>
                <Popup>
                  <div style={{ minWidth:180, fontFamily:'sans-serif' }}>
                    <p style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{t.name}</p>
                    <p style={{ fontSize:11, color:'#6B7280', marginBottom:8 }}>{t.sector} · {t.extra_data?.neighborhood||'—'}</p>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:2 }}>
                      <span>URI Skoru</span><span style={{ color:renk, fontWeight:700 }}>{uri}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:2 }}>
                      <span>Çalışan</span><span>{t.employee_count?.toLocaleString('tr')||'—'}</span>
                    </div>
                    {natech && <div style={{ marginTop:6, padding:'3px 8px', background:'#FEE2E2', borderRadius:4, fontSize:11, color:'#EF4444', fontWeight:600 }}>⚠️ NATECH Riski</div>}
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:16, fontSize:11, color:'#6B7280', flexWrap:'wrap' }}>
        {(Object.entries(RISK_RENK) as [RiskSeviye, string][]).map(([sev, renk]) => (
          <span key={sev} style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:renk, display:'inline-block' }}/>
            {RISK_LABEL[sev]}
          </span>
        ))}
        <span style={{ display:'flex', alignItems:'center', gap:4 }}>
          <span style={{ width:10, height:10, borderRadius:'50%', background:'#EF4444', border:'2px solid white', display:'inline-block' }}/>
          NATECH (büyük nokta)
        </span>
      </div>
    </div>
  )
}
