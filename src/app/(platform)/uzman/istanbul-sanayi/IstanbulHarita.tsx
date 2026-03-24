'use client'
import { useEffect, useState, useCallback } from 'react'
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

function markerIcon(renk: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:10px;height:10px;border-radius:50%;background:${renk};border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  })
}

function FitBounds({ tesisler }: { tesisler: Tesis[] }) {
  const map = useMap()
  useEffect(() => {
    const pts = tesisler
      .filter(t => t.geom?.coordinates)
      .map(t => [t.geom!.coordinates[1], t.geom!.coordinates[0]] as [number, number])
    if (pts.length > 0) {
      map.fitBounds(pts, { padding: [40, 40], maxZoom: 13 })
    }
  }, [tesisler, map])
  return null
}

export default function IstanbulHarita() {
  const [tesisler, setTesisler] = useState<Tesis[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [filtre, setFiltre] = useState<RiskSeviye | 'all'>('all')
  const [secili, setSecili] = useState<Tesis | null>(null)

  useEffect(() => {
    async function yukle() {
      const { data } = await sb
        .from('facilities')
        .select('id, name, sector, employee_count, building_age, geom, extra_data')
        .not('geom', 'is', null)
        .limit(500)
      if (data) setTesisler(data as Tesis[])
      setYukleniyor(false)
    }
    yukle()
  }, [])

  const gorunen = tesisler.filter(t => {
    if (filtre === 'all') return true
    const uri = (t.extra_data?.uri_score as number) || 0
    return riskSeviye(uri) === filtre
  })

  const istatistik = {
    critical: tesisler.filter(t => riskSeviye((t.extra_data?.uri_score as number) || 0) === 'critical').length,
    high:     tesisler.filter(t => riskSeviye((t.extra_data?.uri_score as number) || 0) === 'high').length,
    medium:   tesisler.filter(t => riskSeviye((t.extra_data?.uri_score as number) || 0) === 'medium').length,
    low:      tesisler.filter(t => riskSeviye((t.extra_data?.uri_score as number) || 0) === 'low').length,
  }

  if (yukleniyor) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 500, background: '#0A1628', borderRadius: 12, color: '#64748B' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🗺️</div>
          <p>Tesis koordinatları yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Filtre bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {([['all', 'Tümü', '#64748B'], ['critical', `Kritik (${istatistik.critical})`, '#EF4444'], ['high', `Yüksek (${istatistik.high})`, '#F97316'], ['medium', `Orta (${istatistik.medium})`, '#EAB308'], ['low', `Düşük (${istatistik.low})`, '#22C55E']] as const).map(([key, label, renk]) => (
          <button key={key} onClick={() => setFiltre(key as typeof filtre)}
            style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${filtre === key ? renk : '#1E3A5F'}`, background: filtre === key ? renk + '22' : 'transparent', color: filtre === key ? renk : '#64748B', fontSize: 12, cursor: 'pointer', fontWeight: filtre === key ? 600 : 400 }}>
            {label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748B', alignSelf: 'center' }}>
          {gorunen.length} tesis gösteriliyor
        </span>
      </div>

      {/* Harita */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #1E3A5F', height: 520 }}>
        <MapContainer center={[41.0082, 28.9784]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='© CartoDB'
          />
          <FitBounds tesisler={gorunen} />
          {gorunen.map(t => {
            if (!t.geom?.coordinates) return null
            const [lng, lat] = t.geom.coordinates
            const uri = (t.extra_data?.uri_score as number) || 0
            const seviye = riskSeviye(uri)
            const renk = RISK_RENK[seviye]
            return (
              <Marker key={t.id} position={[lat, lng]} icon={markerIcon(renk)}
                eventHandlers={{ click: () => setSecili(t) }}>
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <p style={{ fontWeight: 700, marginBottom: 4 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>{t.sector} · {t.extra_data?.neighborhood || '—'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span>URI Skoru</span>
                      <span style={{ color: renk, fontWeight: 700 }}>{uri}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span>Çalışan</span>
                      <span>{t.employee_count || '—'}</span>
                    </div>
                    {t.extra_data?.hazmat_flag && (
                      <div style={{ marginTop: 6, padding: '2px 8px', background: '#EF444422', borderRadius: 4, fontSize: 11, color: '#EF4444' }}>
                        ⚠️ NATECH / Tehlikeli Madde
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#64748B' }}>
        {Object.entries(RISK_RENK).map(([seviye, renk]) => (
          <span key={seviye} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: renk, display: 'inline-block' }} />
            {seviye === 'critical' ? 'Kritik ≥60' : seviye === 'high' ? 'Yüksek 40-60' : seviye === 'medium' ? 'Orta 20-40' : 'Düşük <20'}
          </span>
        ))}
      </div>
    </div>
  )
}
