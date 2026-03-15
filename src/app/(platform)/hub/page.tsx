'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { mevcutKullanici } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const sbBD = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
)
const TENANT_BD = '11111111-0000-0000-0000-000000000001'

const MODULES = [
  {
    key: 'omnirisk',
    name: 'omniRISK',
    desc: 'HFER-720 tehlike & risk analizi, URI skoru, tesis bazlı puanlama',
    href: '/beylikduzu-komuta',
    color: '#EF4444',
    bg: '#FEF2F2',
    border: '#FCA5A5',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    key: 'omniimpact',
    name: 'omniIMPACT',
    desc: 'İş etkisi analizi, BIA raporlama, kritik fonksiyon değerlendirmesi',
    href: '/omni-dashboard',
    color: '#F97316',
    bg: '#FFF7ED',
    border: '#FDBA74',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    key: 'omniplan',
    name: 'omniPLAN',
    desc: 'BCM planlaması, RTO/RPO takibi, iş sürekliliği tatbikatları',
    href: '/omniplan',
    color: '#3B82F6',
    bg: '#EFF6FF',
    border: '#93C5FD',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    key: 'omnicrisis',
    name: 'omniCRISIS',
    desc: 'Kriz yönetimi, olay takibi, post-mortem raporlama',
    href: '/omnicrisis',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#C4B5FD',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  {
    key: 'omniaudit',
    name: 'omniAUDIT',
    desc: 'Uyum denetimi, ISO 22301 kontrolü, Sendai çerçeve izleme',
    href: '/beylikduzu-komuta',
    color: '#10B981',
    bg: '#F0FDF4',
    border: '#6EE7B7',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    key: 'omnivendor',
    name: 'omniVENDOR',
    desc: 'Tedarik zinciri riski, üçüncü taraf değerlendirmesi, vendor skoru',
    href: '/tesis-agi',
    color: '#6366F1',
    bg: '#EEF2FF',
    border: '#A5B4FC',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
]

export default function HubPage() {
  const [kullanici, setKullanici]     = useState('...')
  const [toplam,    setToplam]        = useState<number | null>(null)
  const [kritik,    setKritik]        = useState<number | null>(null)
  const [bekleyen,  setBekleyen]      = useState(4)
  const [tatbikat,  setTatbikat]      = useState('15 Mart 2026')
  const bugun = new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  useEffect(() => {
    const k = mevcutKullanici()
    if (k) setKullanici(k.tenant)

    sbBD
      .from('facilities')
      .select('id,extra_data', { count: 'exact' })
      .eq('tenant_id', TENANT_BD)
      .eq('is_active', true)
      .limit(1000)
      .then(({ data, count }) => {
        setToplam(count ?? data?.length ?? 0)
        const krit = (data ?? []).filter((f: { extra_data: { H_score?: number } | null }) =>
          (f.extra_data?.H_score ?? 0) >= 4
        ).length
        setKritik(krit)
      })
  }, [])

  const KPI_ITEMS = [
    { label: 'Toplam Tesis',    val: toplam !== null ? toplam.toLocaleString('tr-TR') : '…', renk: '#3B82F6', sub: 'Supabase · canlı' },
    { label: 'Kritik Risk',     val: kritik !== null ? String(kritik) : '…',                  renk: '#EF4444', sub: 'H ≥ 4 seviyesi'   },
    { label: 'Bekleyen Aksiyon',val: String(bekleyen),                                         renk: '#F97316', sub: 'Aksiyon planı'    },
    { label: 'Son Tatbikat',    val: tatbikat,                                                  renk: '#10B981', sub: 'En son tatbikat'  },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: '#0A1628', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Hoş geldiniz,{' '}
              <span style={{ color: '#E8C97A' }}>{kullanici}</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>{bugun}</p>
          </div>
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
               style={{ background: 'rgba(232,201,122,.1)', border: '1px solid rgba(232,201,122,.2)', color: '#E8C97A' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#E8C97A' }}/>
            OMNI Resilience Platform · v2.0
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* KPI STRIP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {KPI_ITEMS.map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{k.label}</p>
              <p className="text-2xl font-bold font-mono mt-1" style={{ color: k.renk }}>{k.val}</p>
              <p className="text-xs text-gray-400 mt-1.5">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* MODULES GRID */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Modüller</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODULES.map(m => (
              <div key={m.key}
                   className="bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow"
                   style={{ borderColor: m.border }}>
                <div className="p-6 flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl flex-shrink-0" style={{ background: m.bg, color: m.color }}>
                      {m.icon}
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900" style={{ fontFamily: 'DM Mono,monospace', letterSpacing: 1 }}>{m.name}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-5">
                  <Link href={m.href}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: m.color, color: 'white' }}>
                    Aç
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-300">OMNI Resilience Platform · HFER-720 v2.0 · © 2026</p>
          <p className="text-xs text-gray-300">Sendai 2015–2030 · ISO 22301 · AFAD</p>
        </div>
      </div>
    </div>
  )
}
