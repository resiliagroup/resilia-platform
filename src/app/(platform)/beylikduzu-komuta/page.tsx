'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, Activity, Map, TrendingUp, AlertTriangle, 
  CheckCircle2, Package, Radio, Users, BrainCircuit, Database
} from 'lucide-react';

export default function BeylikduzuKomuta() {
  const [activeTab, setActiveTab] = useState('genel');

  // Beylikdüzü Mahalleleri Mock Verisi
  const mahalleler = [
    { ad: 'Yakuplu', h: 85, f: 70, e: 40, risk: 'Yüksek', trend: 'up' },
    { ad: 'Kavaklı', h: 65, f: 80, e: 55, risk: 'Orta', trend: 'down' },
    { ad: 'Gürpınar', h: 90, f: 60, e: 65, risk: 'Yüksek', trend: 'up' },
    { ad: 'Adnan Kahveci', h: 40, f: 45, e: 85, risk: 'Düşük', trend: 'stable' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 font-sans overflow-y-auto">
      
      {/* ÜST BİLGİ VE LOGO ALANI */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-700 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-900/50">
            <Map className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">BEYLİKDÜZÜ KOMUTA MERKEZİ</h1>
            <p className="text-blue-400 font-medium tracking-widest text-sm mt-1 uppercase">OMNI x Afet Yönetim Modeli Entegrasyonu</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 text-right bg-slate-800 px-6 py-3 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Canlı Sistem Durumu</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold">AFAD / İRAP Ağına Bağlı</span>
          </div>
        </div>
      </div>

      {/* 4'LÜ KPI KARTLARI (Yapay Zeka ve ML Vurgulu) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-900 p-2.5 rounded-lg"><Activity className="w-6 h-6 text-blue-400"/></div>
            <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded">İTÜ Metodolojisi</span>
          </div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">İlçe HFE-360 Skoru</h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-white">68<span className="text-xl text-slate-500">/100</span></span>
            <span className="text-rose-400 text-sm font-bold flex items-center mb-1"><TrendingUp className="w-4 h-4 mr-1"/> Kritik Sınırda</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-900/40 to-slate-800/50 p-6 rounded-2xl border border-rose-700/50 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10"><BrainCircuit className="w-32 h-32 text-rose-500"/></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-rose-950 p-2.5 rounded-lg"><AlertTriangle className="w-6 h-6 text-rose-400"/></div>
            <span className="bg-rose-500/20 text-rose-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><Database className="w-3 h-3"/> ML Öngörüsü</span>
          </div>
          <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-1 relative z-10">Erken Uyarı (72 Saat)</h3>
          <p className="text-white font-medium text-sm mt-2 relative z-10">
            Geçmiş veriler ve Meteoroloji entegrasyonuna göre <b className="text-rose-400">Kavaklı</b> bölgesinde %82 ihtimalle su taşkını riski tespit edildi.
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-900 p-2.5 rounded-lg"><Package className="w-6 h-6 text-emerald-400"/></div>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded">10 Mahalle</span>
          </div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Müdahale İstasyonları</h3>
          <div className="flex flex-col mt-2">
            <div className="flex justify-between text-sm mb-1"><span>Konteyner Malzeme Doluluğu</span> <span className="text-emerald-400 font-bold">%92</span></div>
            <div className="w-full bg-slate-900 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full w-[92%]"></div></div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-900 p-2.5 rounded-lg"><Users className="w-6 h-6 text-indigo-400"/></div>
            <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded">AFAD Akredite</span>
          </div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Nefes Arama Kurtarma</h3>
          <div className="flex items-center gap-4 mt-2">
            <div><p className="text-2xl font-black text-white">45</p><p className="text-xs text-slate-500 uppercase">Aktif Personel</p></div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div><p className="text-2xl font-black text-indigo-400">12</p><p className="text-xs text-slate-500 uppercase">Araç / İŞ Mak.</p></div>
          </div>
        </div>

      </div>

      {/* ALT 2'Lİ BÖLÜM: Harita / Mahalleler & DL Mevzuat Motoru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL: MAHALLE BAZLI CBS/GIS RİSK VERİLERİ */}
        <div className="lg:col-span-2 bg-slate-800/30 rounded-3xl border border-slate-700/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Map className="w-5 h-5 text-blue-500"/> Mahalle Risk (CBS) Katmanları</h2>
            <button className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-slate-300 transition-colors border border-slate-600">Tam Haritayı Aç</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase tracking-widest">
                  <th className="p-4 font-bold">Mahalle</th>
                  <th className="p-4 font-bold text-center">Tehlike (H)</th>
                  <th className="p-4 font-bold text-center">Kırılganlık (F)</th>
                  <th className="p-4 font-bold text-center">Kapasite (E)</th>
                  <th className="p-4 font-bold">Risk Durumu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {mahalleler.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-slate-200">{m.ad}</td>
                    <td className="p-4 text-center"><span className="bg-slate-900 text-rose-400 px-3 py-1 rounded-lg border border-rose-900/50 font-mono">{m.h}</span></td>
                    <td className="p-4 text-center"><span className="bg-slate-900 text-amber-400 px-3 py-1 rounded-lg border border-amber-900/50 font-mono">{m.f}</span></td>
                    <td className="p-4 text-center"><span className="bg-slate-900 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-900/50 font-mono">{m.e}</span></td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${m.risk === 'Yüksek' ? 'bg-rose-500/20 text-rose-400' : m.risk === 'Orta' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {m.risk} RİSK
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SAĞ: DERİN ÖĞRENME (DL) MEVZUAT UYUM ASİSTANI */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl border border-slate-700/80 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-5"><ShieldAlert className="w-64 h-64 text-blue-500"/></div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="bg-purple-600/20 p-2.5 rounded-xl border border-purple-500/30"><BrainCircuit className="w-6 h-6 text-purple-400"/></div>
            <div>
              <h2 className="text-lg font-bold text-white">Yapay Zeka (DL) Denetçisi</h2>
              <p className="text-xs text-slate-400">NFPA, İRAP ve TAMP Uyum Analizi</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 relative z-10">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 border-l-4 border-l-emerald-500">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5"/>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Haberleşme Altyapısı (TAMP)</h4>
                  <p className="text-xs text-slate-400 mt-1">Nefes ekiplerinin uydu ve telsiz envanteri AFAD TAMP standartlarına %100 uygundur.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 border-l-4 border-l-amber-500">
              <div className="flex items-start gap-3">
                <Radio className="w-5 h-5 text-amber-500 mt-0.5"/>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Konteyner Dağılımı (NFPA)</h4>
                  <p className="text-xs text-slate-400 mt-1">10 mahalleye yerleştirilen müdahale istasyonları NFPA mesafe kriterlerine uygundur ancak Gürpınar bölgesinde 2 ek istasyona ihtiyaç vardır.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-500 mt-0.5"/>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Nefes Birliği Protokolü</h4>
                  <p className="text-xs text-slate-400 mt-1">Bornova ve Devrek belediyeleriyle olan veri senkronizasyonu aktif. Olası bir C-Tipi afette destek talebi otonom olarak iletilecektir.</p>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all relative z-10 shadow-lg shadow-purple-900/50">
            Detaylı LLM Mevzuat Raporu Üret
          </button>
        </div>

      </div>
    </div>
  );
}