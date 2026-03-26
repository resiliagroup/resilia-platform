'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
)

// NATECH riski taşıyan NACE kodları (Seveso / RAPID-N uyumlu)
const NATECH_NACE = new Set([
  '19','20','21','24','38','08','09','35',  // petrokimya, kimya, ilaç, maden, atık, enerji
  '29','30','25',                            // taşıt, savunma, metal ürünleri
  '52',                                      // depolama (tehlikeli madde)
])
function isNatech(nace: string | null | undefined, hazmat?: string, hazmatFlag?: boolean): boolean {
  if (hazmat || hazmatFlag) return true
  if (!nace) return false
  return NATECH_NACE.has(String(nace).slice(0, 2))
}

function naceUriSkor(nace: string | null | undefined, calisan: number | null, binaYasi: number | null): number {
  if (!nace) return 15
  const n2 = String(nace).slice(0, 2)
  const BASE: Record<string, number> = {
    '20': 70, '19': 68, '24': 62, '08': 60, '35': 58, '09': 58,
    '38': 56, '29': 55, '21': 55, '25': 50, '22': 48, '23': 46,
    '28': 45, '30': 44, '26': 43, '27': 42, '17': 42, '15': 40,
    '16': 38, '10': 30, '11': 32, '13': 28, '14': 25, '31': 28,
    '32': 25, '18': 22, '33': 35, '41': 20, '42': 22, '43': 20,
    '45': 18, '46': 15, '47': 12, '49': 18, '52': 20, '62': 10, '63': 10,
  }
  let s = BASE[n2] ?? 20
  if (calisan) s += calisan > 500 ? 15 : calisan > 200 ? 10 : calisan > 50 ? 5 : 2
  if (binaYasi) s += binaYasi > 40 ? 10 : binaYasi > 25 ? 6 : binaYasi > 15 ? 3 : 0
  return Math.min(100, Math.max(0, s))
}

type RiskSeviye = 'critical' | 'high' | 'medium' | 'low'
const RISK_RENK: Record<RiskSeviye, string> = {
  critical: '#EF4444', high: '#F97316', medium: '#EAB308', low: '#22C55E',
}
const RISK_LABEL: Record<RiskSeviye, string> = {
  critical: 'Kritik ≥60', high: 'Yüksek 40-60', medium: 'Orta 20-40', low: 'Düşük <20',
}
function seviye(s: number): RiskSeviye {
  return s >= 60 ? 'critical' : s >= 40 ? 'high' : s >= 20 ? 'medium' : 'low'
}

interface Tesis {
  id: string
  name: string
  sector: string
  employee_count: number | null
  building_age: number | null
  geom: { coordinates: [number, number] } | null
  extra_data: Record<string, unknown> | null
}

export default function IstanbulHarita() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const clusterRef = useRef<any>(null)
  const [tesisler, setTesisler] = useState<Tesis[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [filtre, setFiltre] = useState<RiskSeviye | 'all' | 'natech'>('all')

  // Veri yükle
  useEffect(() => {
    async function yukle() {
      const all: Tesis[] = []
      let offset = 0
      while (true) {
        const { data, error } = await sb
          .from('facilities')
          .select('id, name, sector, employee_count, building_age, geom, extra_data')
          .not('geom', 'is', null)
          .range(offset, offset + 999)
        if (error || !data || data.length === 0) break
        all.push(...(data as Tesis[]))
        if (data.length < 1000) break
        offset += 1000
      }
      setTesisler(all)
      setYukleniyor(false)
    }
    yukle()
  }, [])

  // Haritayı başlat (bir kez)
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const addCSS = (id: string, href: string) => {
      if (document.getElementById(id)) return
      const l = document.createElement('link')
      l.id = id; l.rel = 'stylesheet'; l.href = href
      document.head.appendChild(l)
    }
    addCSS('leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css')
    addCSS('cluster-css', 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css')

    // Leaflet + MarkerCluster'ı CDN'den yükle
    const loadScript = (src: string) => new Promise<void>(res => {
      if (document.querySelector(`script[src="${src}"]`)) { res(); return }
      const s = document.createElement('script')
      s.src = src; s.onload = () => res()
      document.head.appendChild(s)
    })

    Promise.all([
      loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'),
    ]).then(() =>
      loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js')
    ).then(() => {
      const L = (window as any).L
      if (!mapRef.current || mapInstanceRef.current) return

      const map = L.map(mapRef.current, {
        center: [41.015, 28.95],
        zoom: 10,
        maxBounds: [[40.5, 27.5], [41.8, 30.5]],
        maxBoundsViscosity: 0.8,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CartoDB',
      }).addTo(map)

      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Markerları güncelle
  useEffect(() => {
    const map = mapInstanceRef.current
    const L = (window as any).L
    if (!map || !L || tesisler.length === 0) return

    if (clusterRef.current) map.removeLayer(clusterRef.current)

    const cluster = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      showCoverageOnHover: false,
      iconCreateFunction: (c: any) => {
        const markers = c.getAllChildMarkers()
        const avg = markers.length ? markers.reduce((s: number, m: any) => s + (m.options.uriScore ?? 35), 0) / markers.length : 35
        const clrBg = avg < 20 ? '#22C55E' : avg < 30 ? '#EAB308' : avg < 40 ? '#F97316' : '#EF4444'
        const n = c.getChildCount()
        const sz = n > 1000 ? 44 : n > 100 ? 36 : 28
        return L.divIcon({
          html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${clrBg};color:white;display:flex;align-items:center;justify-content:center;font-size:${sz > 36 ? 13 : 11}px;font-weight:700;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);">${n > 999 ? (n / 1000).toFixed(1) + 'K' : n}</div>`,
          className: '', iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2],
        })
      },
    })

    tesisler.forEach(t => {
      if (!t.geom?.coordinates) return
      const [lng, lat] = t.geom.coordinates
      if (lat < 40.5 || lat > 41.8 || lng < 27.5 || lng > 30.5) return

      const skor = naceUriSkor(t.extra_data?.nace_kodu as string, t.employee_count, t.building_age)
      const sev = seviye(skor)
      const renk = RISK_RENK[sev]
      const natech = isNatech(t.extra_data?.nace_kodu as string, t.extra_data?.tehlikeli_madde_turu as string, t.extra_data?.hazmat_flag as boolean)

      // Filtre
      if (filtre === 'natech' && !natech) return
      if (filtre !== 'all' && filtre !== 'natech' && sev !== filtre) return

      const sz = natech ? 13 : 9
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${renk};border:2px solid white;box-shadow:0 1px 4px ${renk}99;${natech ? `outline:2px solid ${renk};outline-offset:2px;` : ''}"></div>`,
        iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2],
      })

      const marker = L.marker([lat, lng], { icon, uriScore: skor } as any)
      marker.bindPopup(`
        <div style="min-width:190px;font-family:sans-serif;font-size:12px;">
          <p style="font-weight:700;font-size:13px;margin:0 0 4px;line-height:1.3;">${t.name}</p>
          <p style="font-size:11px;color:#6B7280;margin:0 0 8px;">${t.sector}${t.extra_data?.tesis_turu ? ' · ' + t.extra_data.tesis_turu : ''}</p>
          <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
            <span style="color:#64748B;">URI Skoru</span>
            <b style="color:${renk};">${skor} — ${RISK_LABEL[sev]}</b>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
            <span style="color:#64748B;">Çalışan</span><span>${t.employee_count?.toLocaleString('tr') || '—'}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
            <span style="color:#64748B;">Bina Yaşı</span><span>${t.building_age ? t.building_age + ' yıl' : '—'}</span>
          </div>
          ${t.extra_data?.nace_kodu ? `<div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span style="color:#64748B;">NACE</span><code>${t.extra_data.nace_kodu}</code></div>` : ''}
          ${natech ? `<div style="margin-top:8px;padding:4px 8px;background:#FEE2E2;border-radius:6px;color:#EF4444;font-weight:600;font-size:11px;">⚠️ NATECH — ${t.extra_data?.tehlikeli_madde_turu || 'Tehlikeli madde'}</div>` : ''}
        </div>
      `)
      cluster.addLayer(marker)
    })

    map.addLayer(cluster)
    clusterRef.current = cluster
  }, [tesisler, filtre])

  const ist = {
    critical: tesisler.filter(t => seviye(naceUriSkor(t.extra_data?.nace_kodu as string, t.employee_count, t.building_age)) === 'critical').length,
    high:     tesisler.filter(t => seviye(naceUriSkor(t.extra_data?.nace_kodu as string, t.employee_count, t.building_age)) === 'high').length,
    medium:   tesisler.filter(t => seviye(naceUriSkor(t.extra_data?.nace_kodu as string, t.employee_count, t.building_age)) === 'medium').length,
    low:      tesisler.filter(t => seviye(naceUriSkor(t.extra_data?.nace_kodu as string, t.employee_count, t.building_age)) === 'low').length,
    natech:   tesisler.filter(t => isNatech(t.extra_data?.nace_kodu as string, t.extra_data?.tehlikeli_madde_turu as string, t.extra_data?.hazmat_flag as boolean)).length,
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
          {yukleniyor ? '⏳ Yükleniyor...' : `${tesisler.length.toLocaleString('tr')} tesis`}
        </span>
      </div>

      {/* Harita */}
      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid #E5E7EB', height: 560 }}>
        {yukleniyor && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1000, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 28 }}>🗺️</div>
            <div style={{ color: '#0D9488', fontSize: 13, fontWeight: 600 }}>Tesis verileri yükleniyor...</div>
            <div style={{ color: '#94A3B8', fontSize: 11 }}>19.000+ koordinat işleniyor</div>
          </div>
        )}
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
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
          * URI skoru NACE + çalışan sayısı + bina yaşından tahmin edilmektedir
        </span>
      </div>
    </div>
  )
}
