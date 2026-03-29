'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { BarChart3, Building2, LayoutGrid, FileText, Siren, TableProperties, Zap, Database, TrendingDown, ShieldCheck, Upload, Factory, FileBarChart2, Map } from 'lucide-react'
import OmniverselLogo from '@/components/OmniverselLogo'
import { mevcutKullanici } from '@/lib/auth'

function SidebarInner({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState('...')
  const [isAdmin, setIsAdmin] = useState(false)
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get('embed') === '1'

  useEffect(() => {
    const k = mevcutKullanici()
    if (k) {
      setTenant(k.tenant)
      setIsAdmin(k.rol === 'admin')
    }
  }, [])

  return (
    <div className="flex h-screen bg-[#0A1628] overflow-hidden">
      {!isEmbed && (
        <aside className="w-64 bg-[#0D1F3C] text-slate-300 flex flex-col border-r border-slate-800/40">
          <div className="h-16 flex items-center px-4 border-b border-slate-800/40">
            <OmniverselLogo width={160} height={42} variant="navy" />
          </div>
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            <Link href="/hub" className="flex items-center gap-3 px-3 py-2.5 mb-4 hover:bg-slate-800/40 hover:text-white text-slate-300 rounded-lg transition-all text-sm font-semibold bg-slate-800/20">
              <LayoutGrid className="w-4 h-4 text-[#E8C97A]" />
              <span>Hub</span>
            </Link>
            <p className="px-3 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Risk</p>
            <Link href="/hub/form/banking" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
              <BarChart3 className="w-4 h-4 text-[#E8C97A]" />
              <span>omniRISK Bankacılık</span>
            </Link>
            <Link href="/hub/form/industrial" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
              <Factory className="w-4 h-4 text-[#E8C97A]" />
              <span>omniRISK Sanayi</span>
            </Link>
            <p className="px-3 mt-5 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Analiz</p>
            <Link href="/hub/omniimpact" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
              <TrendingDown className="w-4 h-4 text-[#7B9FD4]" />
              <span>omniIMPACT</span>
            </Link>
            <Link href="/hub/omniaudit" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
              <ShieldCheck className="w-4 h-4 text-[#6ABFB8]" />
              <span>omniAUDIT</span>
            </Link>
            <p className="px-3 mt-5 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Planlama</p>
            <Link href="/hub/omniplan" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
              <FileText className="w-4 h-4 text-[#3B82F6]" />
              <span>omniPLAN</span>
            </Link>
            <Link href="/hub/omnivendor" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
              <Building2 className="w-4 h-4 text-[#3B82F6]" />
              <span>omniVENDOR</span>
            </Link>
            <p className="px-3 mt-5 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Operasyon</p>
            <Link href="/hub/omnicrisis" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
              <Siren className="w-4 h-4 text-[#8B5CF6]" />
              <span>omniCRISIS</span>
            </Link>
            <Link href="/hub/omnipipe" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
              <Zap className="w-4 h-4 text-[#A78BFA]" />
              <span>omniPIPE</span>
            </Link>
            <p className="px-3 mt-5 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Araştırma</p>
            <Link href="/hub/omniqra" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
              <Database className="w-4 h-4 text-[#F97316]" />
              <span>omniQRA</span>
            </Link>
            <p className="px-3 mt-5 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Yönetim</p>
            <Link href="/hub/admin/import" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Toplu Import</span>
            </Link>
            <Link href="/hub/admin/matrix" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
              <TableProperties className="w-4 h-4 text-slate-400" />
              <span>Matris Editörü</span>
            </Link>
            <Link href="/hub/site-haritasi" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
              <Map className="w-4 h-4 text-slate-400" />
              <span>Site Haritası</span>
            </Link>
            {isAdmin && (
              <>
                <p className="px-3 mt-5 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Admin</p>
                <Link href="/hub/iso-brifing" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
                  <FileBarChart2 className="w-4 h-4 text-[#2D8A87]" />
                  <span>İSO Brifing</span>
                </Link>
              </>
            )}
          </nav>
          <div className="p-4 border-t border-slate-800/40">
            <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-900/50 rounded-lg border border-slate-800/40">
              <div className="w-8 h-8 rounded-full bg-[#E8C97A]/20 border border-[#E8C97A]/30 flex items-center justify-center text-[#E8C97A] font-bold text-sm">
                A
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{tenant}</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Aktif Oturum
                </p>
              </div>
            </div>
          </div>
        </aside>
      )}
      <main className="flex-1 overflow-y-auto" style={isEmbed ? { marginLeft: 0, padding: 0 } : undefined}>
        {children}
      </main>
    </div>
  )
}

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-[#0A1628] overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    }>
      <SidebarInner>{children}</SidebarInner>
    </Suspense>
  )
}
