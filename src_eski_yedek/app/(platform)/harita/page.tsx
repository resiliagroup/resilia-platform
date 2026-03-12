'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { mevcutKullanici, oturumKapat } from '@/lib/auth'

const NAVY  = '#0A1628'
const TEAL  = '#009B8D'
const AMBER = '#D97706'
const RED   = '#DC2626'
const GREEN = '#16A34A'

function riskRenk(s: number) { return s < 40 ? RED : s < 70 ? AMBER : GREEN }
function riskEtiket(s: number) { return s < 40 ? 'KRİTİK' : s < 70 ? 'ORTA' : 'GÜÇLÜ' }

const SEKTOR_META: Record<string, { label: string; icon: string; renk: string }> = {
  bankacilik: { label: 'Bankacılık',  icon: '🏦', renk: '#1B4FD8' },
  uretim:     { label: 'Sanayi',      icon: '🏭', renk: '#D97706' },
  saglik:     { label: 'Sağlık',      icon: '🏥', renk: '#16A34A' },
  belediye:   { label: 'Belediye',    icon: '🏛️', renk: '#7C3AED' },
  meb:        { label: 'Eğitim',      icon: '🎓', renk: '#0891B2' },
  odalar:     { label: 'Odalar',      icon: '🏢', renk: '#9D4EDD' },
}

const TENANT_AD: Record<string, string> = {
  '11111111-1111-1111-1111-111111111111': 'Akbank A.Ş.',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb': 'İş Bankası A.Ş.',
  'cccccccc-cccc-cccc-cccc-cccccccccccc': 'İstanbul Sanayi Odası',
  '22222222-2222-2222-2222-222222222222': 'Medical Park',
}

type Birim = {
  birim_kodu: string
  dayaniklilik_skoru: number
  senaryo: string
  sektor: string
  il_adi?: string
  lat: number
  lng: number
  tenant_id?: string
}

export default function HaritaSayfasi() {
  const mapDiv    = useRef<HTMLDivElement>(null)
  const mapInst   = useRef<any>(null)
  const markerGrp = useRef<any>(null)

  const [tumVeriler, setTumVeriler] = useState<Birim[]>([])
  const [filtreli,   setFiltreli]   = useState<Birim[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [secili,     setSecili]     = useState<Birim | null>(null)
  const [kullanici,  setKullanici]  = useState<any>(null)
  const [sektor,     setSektor]     = useState('tumu')
  const [riskSev,    setRiskSev]    = useState('tumu')
  const [arama,      setArama]      = useState('')
  const [istat,      setIstat]      = useState({ toplam: 0, kritik: 0, orta: 0, guclu: 0 })

  useEffect(() => {
    setKullanici(mevcutKullanici())
    async function cek() {
      const { data, error } = await supabase
        .from('form_cevaplari')
        .select('birim_kodu,dayaniklilik_skoru,senaryo,sektor,il_adi,lat,lng,tenant_id')
        .not('lat', 'is', null)
        .not('lng', 'is', null)
      if (!error && data) {
        const benzersiz = Object.values(
          data.reduce((acc: any, row: any) => {
            if (!acc[row.birim_kodu]) acc[row.birim_kodu] = row
            return acc
          }, {})
        ) as Birim[]
        setTumVeriler(benzersiz)
        setFiltreli(benzersiz)
        setIstat({
          toplam: benzersiz.length,
          kritik: benzersiz.filter(b => b.dayaniklilik_skoru < 40).length,
          orta:   benzersiz.filter(b => b.dayaniklilik_skoru >= 40 && b.dayaniklilik_skoru < 70).length,
          guclu:  benzersiz.filter(b => b.dayaniklilik_skoru >= 70).length,
        })
      }
      setYukleniyor(false)
    }
    cek()
  }, [])

  useEffect(() => {
    let liste = [...tumVeriler]
    if (sektor !== 'tumu')    liste = liste.filter(b => b.sektor === sektor)
    if (riskSev === 'kritik') liste = liste.filter(b => b.dayaniklilik_skoru < 40)
    if (riskSev === 'orta')   liste = liste.filter(b => b.dayaniklilik_skoru >= 40 && b.dayaniklilik_skoru < 70)
    if (riskSev === 'guclu')  liste = liste.filter(b => b.dayaniklilik_skoru >= 70)
    if (arama) liste = liste.filter(b =>
      b.birim_kodu.toLowerCase().includes(arama.toLowerCase()) ||
      (b.il_adi || '').toLowerCase().includes(arama.toLowerCase())
    )
    setFiltreli(liste)
  }, [sektor, riskSev, arama, tumVeriler])

  useEffect(() => {
    if (typeof window === 'undefined' || mapInst.current) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      const L = (window as any).L
      if (!mapDiv.current || mapInst.current) return
      const map = L.map(mapDiv.current, { zoomControl: false }).setView([39.5, 34.0], 6)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap ©CARTO', maxZoom: 19
      }).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      markerGrp.current = L.layerGroup().addTo(map)
      mapInst.current = map
    }
    document.head.appendChild(script)
  }, [])

  const markerlerCiz = useCallback((veri: Birim[]) => {
    const L = (window as any).L
    if (!L || !markerGrp.current) return
    markerGrp.current.clearLayers()
    veri.forEach(b => {
      const renk = riskRenk(b.dayaniklilik_skoru)
      const icon = L.divIcon({
        html: `<div style="width:32px;height:32px;border-radius:50%;background:${renk};border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,.22);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:10px;color:white;cursor:pointer;">${b.dayaniklilik_skoru}</div>`,
        className: '', iconSize: [32, 32], iconAnchor: [16, 16],
      })
      const marker = L.marker([b.lat, b.lng], { icon })
      marker.on('click', () => setSecili(b))
      marker.addTo(markerGrp.current)
    })
  }, [])

  useEffect(() => {
    if (!mapInst.current) {
      const iv = setInterval(() => {
        if (mapInst.current) { markerlerCiz(filtreli); clearInterval(iv) }
      }, 150)
      return () => clearInterval(iv)
    }
    markerlerCiz(filtreli)
  }, [filtreli, markerlerCiz])

  const sektorSayilari = Object.keys(SEKTOR_META).map(s => ({
    s, n: tumVeriler.filter(b => b.sektor === s).length,
  })).filter(x => x.n > 0)

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F6F3', fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#D1CEC9;border-radius:99px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .fi{animation:fadeIn .22s ease forwards}
        input::placeholder{color:#C4C0BB} input:focus{outline:none}
      `}</style>

      {/* Topbar */}
      <div style={{ background: NAVY, height: 52, padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a href="/ana-sayfa" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
            <div style={{ width: 27, height: 27, borderRadius: 7, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 13, fontFamily: "'Playfair Display',serif" }}>R</span>
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 15, fontFamily: "'Playfair Display',serif" }}>RESILIA</span>
          </a>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.12)' }} />
          <div style={{ display: 'flex', gap: 3 }}>
            {[
              { href: '/board/ozet',            label: 'Özet' },
              { href: '/uzman/dashboard',        label: 'Uzman' },
              { href: '/harita',                 label: '🗺️ Harita', aktif: true },
              { href: '/board/cok-banka',        label: '🏦 Çok Banka' },
              { href: '/uzman/bia',              label: '📊 BIA' },
              { href: '/uzman/istanbul-sanayi',  label: '🏭 Sanayi' },
              { href: '/board/rapor',            label: 'PDF Rapor' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{ fontSize: 11, fontWeight: 600, padding: '5px 9px', borderRadius: 7, textDecoration: 'none', transition: 'all .15s', background: l.aktif ? 'rgba(255,255,255,.15)' : 'transparent', color: l.aktif ? 'white' : 'rgba(255,255,255,.45)' }}>{l.label}</a>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{kullanici?.ad_soyad}</div>
          <button onClick={() => { oturumKapat(); window.location.href = '/login' }}
            style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', border: '1px solid rgba(255,255,255,.1)', padding: '4px 9px', borderRadius: 6, background: 'none', cursor: 'pointer' }}>Çıkış</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* SOL PANEL */}
        <div style={{ width: 290, background: 'white', borderRight: '1px solid #ECEAE8', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

          {/* KPI */}
          <div style={{ padding: '13px 15px', borderBottom: '1px solid #ECEAE8', background: NAVY }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 9 }}>
              Tüm Platform · {istat.toplam} Birim
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
              {[['KRİTİK', istat.kritik, RED], ['ORTA', istat.orta, AMBER], ['GÜÇLÜ', istat.guclu, '#22C55E']].map(([l, v, c]) => (
                <div key={l as string} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 9, padding: '7px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 19, fontWeight: 800, color: c as string, lineHeight: 1 }}>{v as number}</div>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filtreler */}
          <div style={{ padding: '11px 13px', borderBottom: '1px solid #ECEAE8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#F8F6F3', border: '1px solid #ECEAE8', borderRadius: 9, padding: '6px 9px', marginBottom: 9 }}>
              <span style={{ fontSize: 13 }}>🔍</span>
              <input value={arama} onChange={e => setArama(e.target.value)} placeholder="Birim kodu veya il ara…"
                style={{ flex: 1, border: 'none', background: 'none', fontSize: 11, color: '#374151', fontFamily: "'DM Sans',sans-serif" }} />
              {arama && <button onClick={() => setArama('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 14, lineHeight: 1 }}>×</button>}
            </div>

            <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>Risk Seviyesi</div>
            <div style={{ display: 'flex', gap: 3, marginBottom: 9 }}>
              {[['tumu', 'Tümü', '#6B7280'], ['kritik', 'Kritik', RED], ['orta', 'Orta', AMBER], ['guclu', 'Güçlü', GREEN]].map(([v, l, c]) => (
                <button key={v} onClick={() => setRiskSev(v)}
                  style={{ flex: 1, fontSize: 9, fontWeight: 700, padding: '4px 3px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .15s', background: riskSev === v ? c : '#F1F0EF', color: riskSev === v ? 'white' : '#6B7280' }}>{l}</button>
              ))}
            </div>

            <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>Sektör</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button onClick={() => setSektor('tumu')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 9px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .15s', background: sektor === 'tumu' ? NAVY : '#F8F6F3', color: sektor === 'tumu' ? 'white' : '#374151', fontSize: 11, fontWeight: 600 }}>
                <span>🗺️ Tüm Sektörler</span><span style={{ fontSize: 10, opacity: .5 }}>{istat.toplam}</span>
              </button>
              {sektorSayilari.map(({ s, n }) => {
                const m = SEKTOR_META[s]
                return (
                  <button key={s} onClick={() => setSektor(s)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 9px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .15s', background: sektor === s ? m.renk + '18' : '#F8F6F3', color: sektor === s ? m.renk : '#374151', fontSize: 11, fontWeight: 600 }}>
                    <span>{m.icon} {m.label}</span><span style={{ fontSize: 10, opacity: .5 }}>{n}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Gösterilen sayı */}
          <div style={{ padding: '7px 13px', borderBottom: '1px solid #ECEAE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>Haritada gösterilen</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: NAVY }}>{yukleniyor ? '…' : filtreli.length} birim</span>
          </div>

          {/* Seçili birim */}
          {secili ? (
            <div className="fi" style={{ padding: '13px 14px', background: '#FAFAF9', flex: 1, overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em' }}>Seçili Birim</div>
                <button onClick={() => setSecili(null)} style={{ fontSize: 16, border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', lineHeight: 1 }}>×</button>
              </div>
              <div style={{ background: 'white', borderRadius: 13, border: '1px solid #ECEAE8', padding: '13px 14px' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 3 }}>{secili.birim_kodu}</div>
                {secili.il_adi && <div style={{ fontSize: 10, color: '#6B7280', marginBottom: 9 }}>📍 {secili.il_adi}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: riskRenk(secili.dayaniklilik_skoru), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 20 }}>
                    {secili.dayaniklilik_skoru}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: riskRenk(secili.dayaniklilik_skoru) }}>{riskEtiket(secili.dayaniklilik_skoru)}</div>
                    <div style={{ fontSize: 9, color: '#9CA3AF' }}>HFE-360 Skoru</div>
                  </div>
                </div>
                {[
                  ['Sektör',  (SEKTOR_META[secili.sektor]?.icon || '') + ' ' + (SEKTOR_META[secili.sektor]?.label || secili.sektor)],
                  ['Senaryo', secili.senaryo],
                  ['Kurum',   TENANT_AD[secili.tenant_id || ''] || '—'],
                  ['Konum',   `${secili.lat?.toFixed(4)}, ${secili.lng?.toFixed(4)}`],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #F1F0EF' }}>
                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>{l}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: NAVY, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#C4C0BB', padding: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📍</div>
              <div style={{ fontSize: 11, textAlign: 'center', lineHeight: 1.6 }}>Haritada bir birime tıklayarak detayları görün</div>
            </div>
          )}
        </div>

        {/* HARİTA */}
        <div style={{ flex: 1, position: 'relative' }}>
          {yukleniyor && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8F6F3', zIndex: 10 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🗺️</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 5 }}>Harita yükleniyor…</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>600 birim koordinatları alınıyor</div>
            </div>
          )}
          <div ref={mapDiv} style={{ width: '100%', height: '100%' }} />

          {/* Legend */}
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'white', borderRadius: 13, border: '1px solid #ECEAE8', padding: '11px 13px', boxShadow: '0 4px 16px rgba(0,0,0,.08)', zIndex: 999, minWidth: 130 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 7 }}>Risk Skoru</div>
            {[['< 40', 'KRİTİK', RED], ['40–69', 'ORTA', AMBER], ['≥ 70', 'GÜÇLÜ', GREEN]].map(([r, l, c]) => (
              <div key={l as string} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: c as string, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'white', fontWeight: 700, border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,.15)', flexShrink: 0 }}>{r}</div>
                <span style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>{l as string}</span>
              </div>
            ))}
            <div style={{ marginTop: 7, paddingTop: 7, borderTop: '1px solid #F1F0EF' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>Sektörler</div>
              {Object.values(SEKTOR_META).map(m => (
                <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                  <span style={{ fontSize: 11 }}>{m.icon}</span>
                  <span style={{ fontSize: 9, color: '#6B7280' }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Aktif filtre badge'leri */}
          {(sektor !== 'tumu' || riskSev !== 'tumu' || arama) && (
            <div style={{ position: 'absolute', bottom: 18, left: 12, display: 'flex', gap: 5, zIndex: 999, flexWrap: 'wrap' }}>
              {sektor !== 'tumu' && (
                <div style={{ background: NAVY, color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {SEKTOR_META[sektor]?.icon} {SEKTOR_META[sektor]?.label}
                  <button onClick={() => setSektor('tumu')} style={{ border: 'none', background: 'none', color: 'rgba(255,255,255,.55)', cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>×</button>
                </div>
              )}
              {riskSev !== 'tumu' && (
                <div style={{ background: riskSev === 'kritik' ? RED : riskSev === 'orta' ? AMBER : GREEN, color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {riskSev.toUpperCase()}
                  <button onClick={() => setRiskSev('tumu')} style={{ border: 'none', background: 'none', color: 'rgba(255,255,255,.55)', cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>×</button>
                </div>
              )}
              {arama && (
                <div style={{ background: TEAL, color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
                  "{arama}"
                  <button onClick={() => setArama('')} style={{ border: 'none', background: 'none', color: 'rgba(255,255,255,.55)', cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>×</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
