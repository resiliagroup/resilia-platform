'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import 'react-leaflet-markercluster/dist/styles.min.css'
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
    html: `<div style="
      width:${natech ? 12 : 9}px;
      height:${natech ? 12 : 9}px;
      border-radius:50%;
      background:${renk};
      border:2px solid ${natech ? '#fff' : 'rgba(255,255,255,0.6)'};
      box-shadow:0 0 ${natech ? 6 : 3}px ${renk}88;
    "></div>`,
    iconSize: [natech ? 12 : 9, natech ? 12 : 9],
    iconAnchor: [natech ? 6 : 4, natech ? 6 : 4],
  })
}

function createClusterIcon(cluster: L.MarkerCluster) {
  const count = cluster.getChildCount()
  const size = count > 100 ? 44 : count > 20 ? 36 : 28
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:rgba(45,138,135,0.85);
      border:2px solid rgba(45,138,135,1);
      display:flex;align-items:center;justify-content:center;
      color:#fff;font-size:${count > 100 ? 13 : 11}px;font-weight:700;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
    ">${count > 999 ? '999+' : count}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  })
}

function AutoBounds({ tesisler }: { tesisler: Tesis[] }) {
  const map = useMap()
  useEffect(() => {
    // İstanbul sınırlarına sabitle
    map.setView([41.015, 28.95], 10)
    map.setMaxBounds([[40.8, 28.0], [41.6, 30.0]])
  }, [map, tesisler])
  return null
}

export default function IstanbulHarita() {
  const [tesisler, setTesisler] = useState<Tesis[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [filtre, setFiltre] = useState<RiskSeviye | 'all' | 'natech'>('all')
  const [sayfa, setSayfa] = useState(0)
  const [toplam, setToplam] = useState(0)
  const PAGE = 1000

  useEffect(() => {
    async function yukle() {
      setYukleniyor(true)
      // Tüm koordinatlı tesisleri sayfalı çek
      const tumTesisler: Tesis[] = []
      let offset = 0
      let devam = true
      while (devam) {
        const { data, error } = await sb
          .from('facilities')
          .select('id, name, sector, employee_count, building_age, geom, extra_data')
          .not('geom', 'is', null)
          .range(offset, offset + PAGE - 1)
        if (error || !data || data.length === 0) { devam = false; break }
        tumTesisler.push(...(data as Tesis[]))
        if (data.length < PAGE) devam = false
        offset += PAGE
      }
      setTesisler(tumTesisler)
      setToplam(tumTesisler.length)
      setYukleniyor(false)
    }
    yukle()
  }, [])

  const gorunen = tesisler.filter(t => {
    if (filtre === 'all') return true
    if (filtre === 'natech') return !!(t.extra_data?.hazmat_flag || (t.extra_data?.natech_risk as number) > 0)
    const uri = (t.extra_data?.uri_score as number) || 0
    return riskSeviye(uri) === filtre
  })

  const istatistik = {
    critical: tesisler.filter(t => riskSeviye((t.extra_data?.uri_score as number) || 0) === 'critical').length,
    high:     tesisler.filter(t => riskSeviye((t.extra_data?.uri_score as number) || 0) === 'high').length,
    medium:   tesisler.filter(t => riskSeviye((t.extra_data?.uri_score as number) || 0) === 'medium').length,
    low:      tesisler.filter(t => riskSeviye((t.extra_data?.uri_score as number) || 0) === 'low').length,
    natech:   tesisler.filter(t => !!(t.extra_data?.hazmat_flag || (t.extra_data?.natech_risk as number) > 0)).length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Filtre + istatistik bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setFiltre('all')}
          style={{ padding:'5px 12px', borderRadius:20, border:`1px solid ${filtre==='all'?'#2D8A87':'#1E3A5F'}`, background:filtre==='all'?'#2D8A8722':'transparent', color:filtre==='all'?'#2D8A87':'#64748B', fontSize:12, cursor:'pointer', fontWeight:filtre==='all'?600:400 }}>
          Tümü ({toplam})
        </button>
        {(Object.entries(RISK_RENK) as [RiskSeviye, string][]).map(([sev, renk]) => (
          <button key={sev} onClick={() => setFiltre(sev)}
            style={{ padding:'5px 12px', borderRadius:20, border:`1px solid ${filtre===sev?renk:'#1E3A5F'}`, background:filtre===sev?renk+'22':'transparent', color:filtre===sev?renk:'#64748B', fontSize:12, cursor:'pointer', fontWeight:filtre===sev?600:400 }}>
            {RISK_LABEL[sev]} ({istatistik[sev]})
          </button>
        ))}
        <button onClick={() => setFiltre('natech')}
          style={{ padding:'5px 12px', borderRadius:20, border:`1px solid ${filtre==='natech'?'#EF4444':'#1E3A5F'}`, background:filtre==='natech'?'#EF444422':'transparent', color:filtre==='natech'?'#EF4444':'#64748B', fontSize:12, cursor:'pointer', fontWeight:filtre==='natech'?600:400 }}>
          ⚠️ NATECH ({istatistik.natech})
        </button>
        <span style={{ marginLeft:'auto', fontSize:11, color:'#64748B' }}>
          {yukleniyor ? '⏳ Yükleniyor...' : `${gorunen.length.toLocaleString('tr')} tesis gösteriliyor`}
        </span>
      </div>

      {/* Harita */}
      <div style={{ borderRadius:12, overflow:'hidden', border:'1px solid #1E3A5F', height:560, position:'relative' }}>
        {yukleniyor && (
          <div style={{ position:'absolute', inset:0, zIndex:1000, background:'rgba(10,22,40,0.85)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
            <div style={{ fontSize:28 }}>🗺️</div>
            <div style={{ color:'#2D8A87', fontSize:14, fontWeight:600 }}>
              {toplam > 0 ? `${toplam.toLocaleString('tr')} tesis yüklendi, harita hazırlanıyor...` : 'Tesis koordinatları çekiliyor...'}
            </div>
          </div>
        )}
        <MapContainer
          center={[41.015, 28.95]}
          zoom={10}
          style={{ height:'100%', width:'100%', background:'#0A1628' }}
          maxBounds={[[40.5, 27.5], [41.8, 30.5]]}
          maxBoundsViscosity={0.8}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='© CartoDB'
          />
          <AutoBounds tesisler={gorunen} />
          <MarkerClusterGroup
            chunkedLoading
            chunkInterval={100}
            chunkDelay={50}
            maxClusterRadius={60}
            iconCreateFunction={createClusterIcon}
            showCoverageOnHover={false}
          >
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
                    <div style={{ minWidth:190, fontFamily:'sans-serif' }}>
                      <p style={{ fontWeight:700, marginBottom:4, fontSize:13 }}>{t.name}</p>
                      <p style={{ fontSize:11, color:'#64748B', marginBottom:8 }}>{t.sector} · {t.extra_data?.neighborhood || '—'}</p>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:2 }}>
                        <span>URI Skoru</span>
                        <span style={{ color:renk, fontWeight:700 }}>{uri}</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:2 }}>
                        <span>Risk Sınıfı</span>
                        <span style={{ color:renk }}>{seviye.toUpperCase()}</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:2 }}>
                        <span>Çalışan</span>
                        <span>{t.employee_count?.toLocaleString('tr') || '—'}</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:2 }}>
                        <span>Bina Yaşı</span>
                        <span>{t.building_age ? `${t.building_age} yıl` : '—'}</span>
                      </div>
                      {natech && (
                        <div style={{ marginTop:8, padding:'4px 8px', background:'#EF444422', borderRadius:6, fontSize:11, color:'#EF4444', fontWeight:600 }}>
                          ⚠️ NATECH / Tehlikeli Madde Riski
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Açıklama */}
      <div style={{ display:'flex', gap:16, fontSize:11, color:'#64748B', flexWrap:'wrap' }}>
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
        <span style={{ marginLeft:'auto' }}>Cluster sayısına tıklayarak yaklaştırın</span>
      </div>
    </div>
  )
}
