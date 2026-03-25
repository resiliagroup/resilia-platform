'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'react-leaflet-markercluster/dist/styles.min.css'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
)

// ── NACE → URI Skor tahmini ──────────────────────────────────────────────────
// Kaynak: İSG Yönetmeliği tehlike sınıfları + SEVESO referansları
function naceUriSkor(naceKodu: string | null | undefined, calisanSayisi: number | null, binaYasi: number | null): number {
  if (!naceKodu) return 15

  const n2 = String(naceKodu).slice(0, 2)

  // Temel NACE skoru (tehlike sınıfına göre)
  const NACE_SKOR: Record<string, number> = {
    // Çok Tehlikeli (55-75)
    '20': 70, // Kimyasallar
    '19': 68, // Petrol rafinerisi
    '24': 62, // Ana metal
    '08': 60, // Madencilik
    '35': 58, // Enerji üretimi
    '09': 58, // Madencilik destek
    '38': 56, // Atık yönetimi
    '29': 55, // Motorlu taşıt
    // Tehlikeli (35-55)
    '25': 50, // Metal ürünler
    '22': 48, // Plastik/kauçuk
    '23': 46, // Taş/toprak
    '28': 45, // Makine imalat
    '30': 44, // Diğer ulaşım araçları
    '26': 43, // Elektronik
    '27': 42, // Elektrikli ekipman
    '17': 42, // Kağıt
    '21': 55, // İlaç (yüksek kimyasal)
    '15': 40, // Deri
    '16': 38, // Ağaç ürünleri
    // Az Tehlikeli (15-35)
    '10': 30, // Gıda
    '11': 32, // İçecek
    '13': 28, // Tekstil
    '14': 25, // Giyim
    '31': 28, // Mobilya
    '32': 25, // Diğer imalat
    '18': 22, // Baskı
    '33': 35, // Makine onarım
    '41': 20, // Bina inşaat
    '42': 22, // Altyapı inşaat
    '43': 20, // Özel inşaat
    '45': 18, // Motorlu taşıt ticareti
    '46': 15, // Toptan ticaret
    '47': 12, // Perakende
    '49': 18, // Kara taşımacılığı
    '52': 20, // Depolama
    '62': 10, // Yazılım
    '63': 10, // Bilgi hizmetleri
  }

  let skor = NACE_SKOR[n2] ?? 20

  // Çalışan sayısı düzeltmesi (+0 ile +15 arası)
  if (calisanSayisi) {
    if (calisanSayisi > 500) skor += 15
    else if (calisanSayisi > 200) skor += 10
    else if (calisanSayisi > 50) skor += 5
    else if (calisanSayisi > 10) skor += 2
  }

  // Bina yaşı düzeltmesi (+0 ile +10 arası)
  if (binaYasi) {
    if (binaYasi > 40) skor += 10
    else if (binaYasi > 25) skor += 6
    else if (binaYasi > 15) skor += 3
  }

  return Math.min(100, Math.max(0, skor))
}

// ── Tip tanımları ────────────────────────────────────────────────────────────
type RiskSeviye = 'critical' | 'high' | 'medium' | 'low'

interface Tesis {
  id: string
  name: string
  sector: string
  employee_count: number | null
  building_age: number | null
  geom: { type: string; coordinates: [number, number] } | null
  extra_data: {
    uri_score?: number
    natech_risk?: number
    hazmat_flag?: boolean
    nace_kodu?: string
    tehlikeli_madde_turu?: string
    tesis_turu?: string
    [k: string]: unknown
  } | null
}

function uriSkor(t: Tesis): number {
  // Önce kaydedilmiş skor varsa kullan
  if (t.extra_data?.uri_score) return t.extra_data.uri_score as number
  // Yoksa NACE'den tahmin et
  return naceUriSkor(t.extra_data?.nace_kodu as string, t.employee_count, t.building_age)
}

function riskSeviye(skor: number): RiskSeviye {
  if (skor >= 60) return 'critical'
  if (skor >= 40) return 'high'
  if (skor >= 20) return 'medium'
  return 'low'
}

function isNatech(t: Tesis): boolean {
  return !!(
    t.extra_data?.tehlikeli_madde_turu ||
    t.extra_data?.hazmat_flag ||
    (t.extra_data?.natech_risk as number) > 0
  )
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
  const size = natech ? 13 : 9
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${renk};border:2px solid white;box-shadow:0 1px 4px ${renk}99;${natech ? `outline:2px solid ${renk};outline-offset:2px;` : ''}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
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

// ── Ana Bileşen ──────────────────────────────────────────────────────────────
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

  // Skorları hesapla (bir kez)
  const tesislerSkorlu = tesisler.map(t => ({ ...t, _skor: uriSkor(t), _natech: isNatech(t) }))

  const gorunen = tesislerSkorlu.filter(t => {
    if (filtre === 'all') return true
    if (filtre === 'natech') return t._natech
    return riskSeviye(t._skor) === filtre
  })

  const ist = {
    critical: tesislerSkorlu.filter(t => riskSeviye(t._skor) === 'critical').length,
    high:     tesislerSkorlu.filter(t => riskSeviye(t._skor) === 'high').length,
    medium:   tesislerSkorlu.filter(t => riskSeviye(t._skor) === 'medium').length,
    low:      tesislerSkorlu.filter(t => riskSeviye(t._skor) === 'low').length,
    natech:   tesislerSkorlu.filter(t => t._natech).length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Filtre bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setFiltre('all')}
          style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${filtre === 'all' ? '#64748B' : '#D1D5DB'}`, background: filtre === 'all' ? '#64748B18' : 'white', color: filtre === 'all' ? '#64748B' : '#6B7280', fontSize: 12, cursor: 'pointer', fontWeight: filtre === 'all' ? 600 : 400 }}>
          Tümü ({tesisler.length.toLocaleString('tr')})
        </button>
        {(Object.entries(RISK_RENK) as [RiskSeviye, string][]).map(([sev, renk]) => (
          <button key={sev} onClick={() => setFiltre(sev)}
            style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${filtre === sev ? renk : '#D1D5DB'}`, background: filtre === sev ? renk + '18' : 'white', color: filtre === sev ? renk : '#6B7280', fontSize: 12, cursor: 'pointer', fontWeight: filtre === sev ? 600 : 400 }}>
            {RISK_LABEL[sev]} ({ist[sev]})
          </button>
        ))}
        <button onClick={() => setFiltre('natech')}
          style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${filtre === 'natech' ? '#EF4444' : '#D1D5DB'}`, background: filtre === 'natech' ? '#EF444418' : 'white', color: filtre === 'natech' ? '#EF4444' : '#6B7280', fontSize: 12, cursor: 'pointer', fontWeight: filtre === 'natech' ? 600 : 400 }}>
          ⚠️ NATECH ({ist.natech})
        </button>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9CA3AF' }}>
          {yukleniyor ? '⏳ Yükleniyor...' : `${gorunen.length.toLocaleString('tr')} tesis gösteriliyor`}
        </span>
      </div>

      {/* Harita */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #E5E7EB', height: 560, position: 'relative' }}>
        {yukleniyor && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1000, background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 24 }}>🗺️</div>
            <div style={{ color: '#2D8A87', fontSize: 13, fontWeight: 600 }}>Tesis verileri yükleniyor...</div>
            <div style={{ color: '#94A3B8', fontSize: 11 }}>19.000+ koordinat işleniyor</div>
          </div>
        )}
        <MapContainer
          center={[41.015, 28.95]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          maxBounds={[[40.5, 27.5], [41.8, 30.5]]}
          maxBoundsViscosity={0.8}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="© CartoDB"
          />
          <AutoBounds />
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={50}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            iconCreateFunction={(cluster: any) => {
              const count = cluster.getChildCount()
              const size = count > 1000 ? 48 : count > 100 ? 40 : 32
              return L.divIcon({
                html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#0F172A;color:white;display:flex;align-items:center;justify-content:center;font-size:${size > 40 ? 13 : 11}px;font-weight:700;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">${count > 999 ? (count / 1000).toFixed(1) + 'K' : count}</div>`,
                className: '',
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
              })
            }}
          >
            {gorunen.map(t => {
              if (!t.geom?.coordinates) return null
              const [lng, lat] = t.geom.coordinates
              if (!lat || !lng || lat < 40.5 || lat > 41.8 || lng < 27.5 || lng > 30.5) return null
              const seviye = riskSeviye(t._skor)
              const renk = RISK_RENK[seviye]
              return (
                <MarkerWithIcon
                  key={t.id}
                  lat={lat}
                  lng={lng}
                  renk={renk}
                  natech={t._natech}
                  tesis={t}
                  skor={t._skor}
                  seviye={seviye}
                />
              )
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#6B7280', flexWrap: 'wrap', alignItems: 'center' }}>
        {(Object.entries(RISK_RENK) as [RiskSeviye, string][]).map(([sev, renk]) => (
          <span key={sev} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: renk, display: 'inline-block' }} />
            {RISK_LABEL[sev]}
          </span>
        ))}
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', border: '2px solid white', outline: '2px solid #EF4444', outlineOffset: 2, display: 'inline-block' }} />
          NATECH riski
        </span>
        <span style={{ marginLeft: 'auto', color: '#CBD5E1', fontSize: 10 }}>
          * URI skoru NACE kodu + çalışan sayısı + bina yaşından tahmin edilmektedir
        </span>
      </div>
    </div>
  )
}

// Marker'ı ayrı bileşen olarak çıkardık — büyük listede re-render optimizasyonu için
function MarkerWithIcon({ lat, lng, renk, natech, tesis, skor, seviye }: {
  lat: number; lng: number; renk: string; natech: boolean
  tesis: Tesis & { _skor: number; _natech: boolean }
  skor: number; seviye: RiskSeviye
}) {
  const icon = markerIcon(renk, natech)
  return (
    <L.Marker position={[lat, lng]} icon={icon}>
      <Popup>
        <div style={{ minWidth: 200, fontFamily: 'sans-serif' }}>
          <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, lineHeight: 1.3 }}>{tesis.name}</p>
          <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 10 }}>
            {tesis.sector} · {(tesis.extra_data?.tesis_turu as string) || '—'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: '#64748B' }}>URI Skoru</span>
            <span style={{ color: renk, fontWeight: 700 }}>{skor} — {RISK_LABEL[seviye]}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: '#64748B' }}>Çalışan</span>
            <span>{tesis.employee_count?.toLocaleString('tr') || '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: '#64748B' }}>Bina Yaşı</span>
            <span>{tesis.building_age ? `${tesis.building_age} yıl` : '—'}</span>
          </div>
          {tesis.extra_data?.nace_kodu && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#64748B' }}>NACE</span>
              <span style={{ fontFamily: 'monospace' }}>{tesis.extra_data.nace_kodu as string}</span>
            </div>
          )}
          {natech && (
            <div style={{ marginTop: 8, padding: '4px 8px', background: '#FEE2E2', borderRadius: 6, fontSize: 11, color: '#EF4444', fontWeight: 600 }}>
              ⚠️ NATECH Riski — {(tesis.extra_data?.tehlikeli_madde_turu as string) || 'Tehlikeli madde'}
            </div>
          )}
        </div>
      </Popup>
    </L.Marker>
  )
}
