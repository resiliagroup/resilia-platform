'use client'
import React, { useEffect, useState } from 'react';
import { mevcutKullanici } from '@/lib/auth';
import Link from 'next/link';
import { Shield, BarChart3, Map, Building2, Settings, Activity, AlertTriangle, Database, History, Home, LayoutGrid, FileText, Siren } from 'lucide-react';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState('...')
  const [tenantHarf, setTenantHarf] = useState('?')
  useEffect(() => {
    const k = mevcutKullanici()
    if (k) {
      setTenant(k.tenant)
      setTenantHarf(k.tenant.charAt(0).toUpperCase())
    }
  }, [])
  return (
    <div className="flex h-screen bg-[#0A1628] overflow-hidden">
      <aside className="w-64 bg-[#0D1F3C] text-slate-300 flex flex-col border-r border-slate-800/40">
        
        <div className="h-16 flex items-center px-6 border-b border-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="bg-[#E8C97A]/10 p-2 rounded-lg border border-[#E8C97A]/20">
              <Shield className="w-5 h-5 text-[#E8C97A]" />
            </div>
            <div>
              <span className="text-white text-lg font-bold tracking-widest">OMNI</span>
              <p className="text-[10px] text-slate-500 tracking-widest uppercase">Resilience Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <Link href="/hub" className="flex items-center gap-3 px-3 py-2.5 mb-3 hover:bg-slate-800/40 hover:text-white text-slate-300 rounded-lg transition-all text-sm font-semibold bg-slate-800/20">
            <LayoutGrid className="w-4 h-4 text-[#E8C97A]" />
            <span>Hub</span>
          </Link>

          <p className="px-3 mb-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Risk Motoru</p>
          
          <Link href="/hfe-motoru" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
            <BarChart3 className="w-4 h-4 text-[#E8C97A]" />
            <span>HFE-360 Analiz</span>
          </Link>

          <Link href="/natech-simulator" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
            <AlertTriangle className="w-4 h-4 text-[#E8C97A]" />
            <span>NATECH Simülatör</span>
          </Link>

          <Link href="/ai-analiz" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
            <Activity className="w-4 h-4 text-[#7B9FD4]" />
            <span>AI Analiz</span>
          </Link>

          <p className="px-3 mt-6 mb-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Operasyon</p>

          <Link href="/eoc-dashboard" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
            <Home className="w-4 h-4 text-[#6ABFB8]" />
            <span>EOC Dashboard</span>
          </Link>

          <Link href="/harita" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
            <Map className="w-4 h-4 text-[#6ABFB8]" />
            <span>Harita</span>
            </Link>
            <Link href="/beylikduzu-komuta" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/5 text-slate-400 hover:text-white">
              <span>🏛️</span>
              <span>Beylikdüzü</span>
          </Link>

          <Link href="/tesis-agi" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>Tesis Ağı</span>
          </Link>

          <Link href="/omniplan" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
            <FileText className="w-4 h-4 text-[#3B82F6]" />
            <span>omniPLAN</span>
          </Link>

          <Link href="/omnicrisis" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
            <Siren className="w-4 h-4 text-[#8B5CF6]" />
            <span>omniCRISIS</span>
          </Link>

          <p className="px-3 mt-6 mb-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Yönetim</p>

          <Link href="/gecmis-analizler" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
            <History className="w-4 h-4 text-slate-400" />
            <span>Geçmiş Analizler</span>
          </Link>

          <Link href="/sistem-ayarlari" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Sistem Ayarları</span>
          </Link>

          <Link href="/board/ozet" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 hover:text-white text-slate-400 rounded-lg transition-all text-sm">
            <Database className="w-4 h-4 text-slate-400" />
            <span>Yönetici Özeti</span>
          </Link>
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

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
