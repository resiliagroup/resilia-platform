'use client'
import { useEffect, useRef } from 'react'

interface Props {
  center: [number, number]
  lat?: number
  lng?: number
  onSelect: (lat: number, lng: number) => void
}

export default function LeafletMap({ center, lat, lng, onSelect }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then(L => {
      // Fix default icon paths for Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!).setView(center, 14)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      // Initial marker
      if (lat !== undefined && lng !== undefined) {
        markerRef.current = L.marker([lat, lng]).addTo(map)
        map.setView([lat, lng], 16)
      }

      map.on('click', (e: any) => {
        const { lat: clat, lng: clng } = e.latlng
        onSelect(clat, clng)
        if (markerRef.current) {
          markerRef.current.setLatLng([clat, clng])
        } else {
          markerRef.current = L.marker([clat, clng]).addTo(map)
        }
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update marker when lat/lng change externally
  useEffect(() => {
    if (!mapInstanceRef.current || lat === undefined || lng === undefined) return
    import('leaflet').then(L => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current)
      }
      mapInstanceRef.current.setView([lat, lng], 16)
    })
  }, [lat, lng])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </>
  )
}
