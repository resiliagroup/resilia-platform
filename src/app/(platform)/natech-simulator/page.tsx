'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, Factory, Wind, Activity, Layers, Radiation,
  Cpu, Thermometer, ShieldAlert, Crosshair, Map, RefreshCw, Radar
} from 'lucide-react';

export default function NatechSimulator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setResults(false);
    setTimeout(() => {
      setIsSimulating(false);
      setResults(true);
    }, 2000); // 2 saniyelik yapay zeka düşünme süresi
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-200 p-4 md:p-6 font-sans overflow-y-auto">
      
      {/* HEADER: ARES NATECH COMMAND */}
      <header className="flex justify-between items-end mb-6 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-widest text-white flex items-center gap-3">
            <Layers className="w-8 h-8 text-rose-500"/> OMNI <span className="text-slate-600 font-light">| NATECH SIMULATOR</span>
          </h1>
          <p className="text-rose-400 font-mono text-xs mt-1 uppercase tracking-[0.2em] flex items-center gap-2">
            <Cpu className="w-3 h-3"/> Cascading Disaster Intelligence (RAPID-N Protocol)
          </p>
        </div>
        
        <div className="bg-[#0F1626] border border-slate-700/50 px-6 py-2 rounded-lg text-right">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Canlı Simülasyon Motoru</p>
          <p className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-2 justify-end">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            HFER-720 Active
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SOL KOLON: SENARYO YAPILANDIRMASI (RAPID-N GİRDİLERİ) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* STEP 1: Doğal Afet Tetikleyicisi (Natural Hazard Trigger) */}
          <div className="bg-[#0F1626] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400"/> Adım 1: Doğal Afet (H)</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider">Afet Tipi</label>
                <select className="w-full bg-[#070B14] border border-slate-800 rounded-lg p-2.5 text-sm font-bold text-white mt-1 outline-none">
                  <option>Deprem (Sismik İvme)</option>
                  <option>Sel ve Taşkın</option>
                  <option>Kasırga / Fırtına</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Büyüklük (Mw)</label>
                  <input type="text" defaultValue="7.4" className="w-full bg-[#070B14] border border-slate-800 rounded-lg p-2.5 text-sm font-mono text-rose-400 mt-1 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">PGA (İvme - g)</label>
                  <input type="text" defaultValue="0.65" className="w-full bg-[#070B14] border border-slate-800 rounded-lg p-2.5 text-sm font-mono text-amber-400 mt-1 outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Endüstriyel Maruziyet (Industrial Exposure) */}
          <div className="bg-[#0F1626] border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Factory className="w-4 h-4 text-amber-400"/> Adım 2: Endüstriyel Hedef (X)</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider">Tesis Tipi (SATAKOL)</label>
                <select className="w-full bg-[#070B14] border border-slate-800 rounded-lg p-2.5 text-sm font-bold text-white mt-1 outline-none">
                  <option>Petrokimya / Rafineri</option>
                  <option>Boya Üretim Tesisi</option>
                  <option>Lojistik / Depo</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider">Tehlikeli Madde (CAS No)</label>
                <select className="w-full bg-[#070B14] border border-slate-800 rounded-lg p-2.5 text-sm font-bold text-white mt-1 outline-none">
                  <option>Amonyak (Anhidroz) - Toksik</option>
                  <option>LPG - Yanıcı/Patlayıcı</option>
                  <option>Klor Gazı - Çok Toksik</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider">Tank Tipi ve Doluluk</label>
                <div className="flex gap-2 mt-1">
                  <select className="flex-1 bg-[#070B14] border border-slate-800 rounded-lg p-2.5 text-sm font-bold text-slate-300 outline-none">
                    <option>Küresel Basınçlı Tank</option>
                    <option>Atmosferik Silindirik</option>
                  </select>
                  <input type="text" defaultValue="85%" className="w-20 bg-[#070B14] border border-slate-800 rounded-lg p-2.5 text-sm font-mono text-white text-center outline-none" />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            {isSimulating ? <RefreshCw className="w-5 h-5 animate-spin"/> : <ShieldAlert className="w-5 h-5"/>}
            {isSimulating ? 'Fragility Curves İşleniyor...' : 'NATECH Simülasyonunu Başlat'}
          </button>
        </div>

        {/* SAĞ KOLON: KASKAD ETKİLER VE SONUÇLAR (CONSEQUENCE ANALYSIS) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-[#0F1626] border border-slate-800 rounded-2xl p-6 min-h-[500px] relative flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Crosshair className="w-4 h-4 text-rose-500"/> Hasar ve Yayılım Analizi (Consequence)
               </h2>
               <span className="text-[10px] bg-[#070B14] border border-slate-800 text-slate-400 px-3 py-1.5 rounded-lg font-mono">D (Domino Katsayısı) Çıktısı</span>
            </div>

            {!results && !isSimulating && (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                <Radar className="w-24 h-24 text-slate-600 mb-4" />
                <p className="text-sm font-mono uppercase tracking-widest">Senaryo Bekleniyor</p>
              </div>
            )}

            {isSimulating && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-32 h-32 relative flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-t-rose-500 border-r-rose-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-l-amber-500 border-b-amber-500 border-t-transparent border-r-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                  <Radiation className="w-8 h-8 text-rose-500 animate-pulse"/>
                </div>
                <p className="mt-6 text-sm text-slate-400 font-mono">Probabilistic Damage States (PDS) Hesaplanıyor...</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase">Toksik Bulut Dağılım Modeli Yükleniyor</p>
              </div>
            )}

            {results && (
              <div className="flex-1 animate-in fade-in zoom-in-95 duration-500 flex flex-col">
                
                {/* 1. HASAR DURUMU (Damage State) */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#070B14] border border-rose-900/50 p-4 rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Tank Hasar Olasılığı</p>
                    <p className="text-2xl font-black text-rose-500 font-mono">% 82</p>
                    <p className="text-[10px] text-rose-400 mt-1">Catastrophic Rupture (Tam Yırtılma)</p>
                  </div>
                  <div className="bg-[#070B14] border border-amber-900/50 p-4 rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Toksik Salınım (Release)</p>
                    <p className="text-2xl font-black text-amber-500 font-mono">42 Ton</p>
                    <p className="text-[10px] text-amber-400 mt-1">Anhidroz Amonyak (NH3)</p>
                  </div>
                  <div className="bg-rose-900/20 border border-rose-500 p-4 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                    <p className="text-[10px] text-rose-300 font-bold uppercase tracking-wider mb-1">ARES Domino Çarpanı (D)</p>
                    <p className="text-3xl font-black text-white font-mono">D = 2.4</p>
                    <p className="text-[10px] text-rose-200 mt-1">HFER-720 Motoruna Aktarıldı</p>
                  </div>
                </div>

                {/* 2. YAYILIM HARİTASI (Toxic Plume / Thermal Radiation) */}
                <div className="flex-1 bg-[#070B14] border border-slate-800 rounded-xl relative overflow-hidden flex">
                   <div className="w-1/2 relative bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Turkey_location_map.svg/1024px-Turkey_location_map.svg.png')] bg-cover bg-center opacity-40">
                      {/* Toksik Bulut Simülasyonu */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                         <div className="w-4 h-4 bg-rose-500 rounded-full z-20 relative shadow-[0_0_10px_#f43f5e]"></div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/20 rounded-full animate-ping border border-amber-500/50"></div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-16 bg-gradient-to-r from-amber-500/40 to-transparent rotate-45 transform origin-left blur-sm"></div>
                      </div>
                   </div>
                   
                   <div className="w-1/2 p-6 flex flex-col justify-center border-l border-slate-800">
                     <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Wind className="w-4 h-4 text-amber-400"/> Çevresel Etki Mesafeleri (ERPG)</h3>
                     <div className="space-y-4">
                       <div>
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1"><span>Ölümcül Etki (ERPG-3)</span> <span>800 Metre</span></div>
                         <div className="w-full bg-slate-900 h-2 rounded-full"><div className="bg-rose-500 h-2 rounded-full w-[20%]"></div></div>
                       </div>
                       <div>
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1"><span>Kritik Sağlık (ERPG-2)</span> <span>2.4 Kilometre</span></div>
                         <div className="w-full bg-slate-900 h-2 rounded-full"><div className="bg-amber-500 h-2 rounded-full w-[60%]"></div></div>
                       </div>
                       <div>
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1"><span>Hafif Etki (ERPG-1)</span> <span>4.5 Kilometre</span></div>
                         <div className="w-full bg-slate-900 h-2 rounded-full"><div className="bg-blue-500 h-2 rounded-full w-[90%]"></div></div>
                       </div>
                     </div>
                     <div className="mt-6 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                       <p className="text-xs text-slate-300 font-medium leading-relaxed">
                         Rüzgar kuzeydoğu yönünde esmektedir. 2.4 km yarıçapındaki <b className="text-amber-400">Yakuplu Merkez ve 3 Eğitim Kurumu</b> acil tahliye zonuna (Kırmızı Bölge) alınmalıdır.
                       </p>
                     </div>
                   </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}