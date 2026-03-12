'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, Activity, Target, Map, Crosshair, TrendingUp, 
  AlertTriangle, ChevronRight, Zap, CheckCircle2, Radar
} from 'lucide-react';

// Sizin formülünüzden (HFER-720) üretilmiş gerçek senaryolarımız
const FACILITIES = [
  {
    id: 1, name: 'İstanbul Cadde Şubesi', type: 'Zemin Kat / Eski Bina', location: 'Kadıköy',
    scores: { H: 0.9, F: 0.8, X: 0.6, D: 1.5, C: 0.3, k: 20 },
    riskScore: 0.231, status: 'Kritik', color: 'rose', coords: 'top-[60%] left-[25%]',
    recs: [
      { action: 'Sistem Odasını 1. Kata Taşı', roi: '-42% Risk', cost: 'Orta', type: 'F Düşürücü' },
      { action: 'Uydu Haberleşme (VSAT) Kur', roi: '-45% Risk', cost: 'Düşük', type: 'C Artırıcı' }
    ]
  },
  {
    id: 2, name: 'Karadeniz Ana Şube', type: 'Dere Yatağı Hub', location: 'Bozkurt',
    scores: { H: 0.8, F: 0.7, X: 0.8, D: 1.2, C: 0.4, k: 12 },
    riskScore: 0.183, status: 'Yüksek', color: 'amber', coords: 'top-[30%] left-[65%]',
    recs: [
      { action: 'Zemin Kat Su Bariyeri Kurulumu', roi: '-35% Risk', cost: 'Düşük', type: 'F Düşürücü' },
      { action: 'Mobil Jeneratör Anlaşması', roi: '-25% Risk', cost: 'Düşük', type: 'C Artırıcı' }
    ]
  },
  {
    id: 3, name: 'Ankara AVM Şubesi', type: 'Kapalı Kutu Ticari', location: 'Çankaya',
    scores: { H: 0.6, F: 0.3, X: 0.9, D: 1.8, C: 0.8, k: 15 },
    riskScore: 0.027, status: 'Dirençli', color: 'teal', coords: 'top-[50%] left-[45%]',
    recs: [
      { action: 'AVM Tahliye Tatbikatı (NATECH)', roi: 'Optimum', cost: 'Yok', type: 'Prosedür' }
    ]
  }
];

export default function OmniRiskDashboard() {
  const [selectedFac, setSelectedFac] = useState(FACILITIES[0]);

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-200 p-4 md:p-6 font-sans overflow-hidden">
      
      {/* HEADER: ASKERİ KOMUTA ESTETİĞİ */}
      <header className="flex justify-between items-end mb-6 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-widest text-slate-100 flex items-center gap-3">
            <Crosshair className="w-8 h-8 text-[#E8C97A]"/> OMNI <span className="text-slate-600 font-light">| RISK INTELLIGENCE</span>
          </h1>
          <p className="text-[#6ABFB8] font-mono text-xs mt-1 uppercase tracking-[0.3em]">HFER-720 NATECH Engine Active</p>
        </div>
        
        {/* KILLER FEATURE: BENCHMARK SCORE */}
        <div className="flex gap-4">
          <div className="bg-[#121A2F] border border-slate-700/50 px-6 py-2 rounded-lg text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sektör Ortalaması (Bankacılık)</p>
            <p className="text-xl font-bold text-slate-400 font-mono">0.145 <span className="text-xs">Risk İndeksi</span></p>
          </div>
          <div className="bg-[#121A2F] border border-[#E8C97A]/30 px-6 py-2 rounded-lg text-right shadow-[0_0_15px_rgba(232,201,122,0.1)]">
            <p className="text-[10px] text-[#E8C97A] font-bold uppercase tracking-widest">Portföy Dirençliliğiniz</p>
            <p className="text-xl font-bold text-white font-mono">0.118 <span className="text-xs text-emerald-400">(-18% Daha İyi)</span></p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SOL PANEL: GIS HARİTASI (LIVING ORGANISM) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#121A2F] border border-slate-800 rounded-2xl p-4 h-[450px] relative overflow-hidden group">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 z-20 relative"><Map className="w-4 h-4"/> Canlı Tesis Radarı (GIS)</h2>
            
            {/* Türkiye Haritası Simülasyonu */}
            <div className="absolute inset-0 top-12 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Turkey_location_map.svg/1024px-Turkey_location_map.svg.png')] bg-contain bg-no-repeat bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent z-10"></div>
            
            {/* Tesis Noktaları */}
            {FACILITIES.map(fac => (
              <div 
                key={fac.id}
                onClick={() => setSelectedFac(fac)}
                className={`absolute ${fac.coords} z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
              >
                {/* Pulsing Animasyonu */}
                {selectedFac.id === fac.id && (
                  <span className={`absolute inset-0 flex h-full w-full -z-10`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${fac.color}-500 opacity-40 scale-150`}></span>
                  </span>
                )}
                <div className={`w-4 h-4 rounded-full bg-${fac.color}-500 border-2 border-[#0A0F1C] shadow-[0_0_10px_currentColor] transition-transform ${selectedFac.id === fac.id ? 'scale-150' : 'hover:scale-125'}`}></div>
              </div>
            ))}
          </div>

          {/* PORTFÖY DAĞILIMI */}
          <div className="bg-[#121A2F] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Portföy Risk Dağılımı (673 Şube)</h2>
            <div className="flex h-4 rounded-full overflow-hidden bg-slate-800 mb-3">
              <div className="bg-rose-500 w-[12%] hover:opacity-80 transition-opacity"></div>
              <div className="bg-amber-500 w-[35%] hover:opacity-80 transition-opacity"></div>
              <div className="bg-[#6ABFB8] w-[53%] hover:opacity-80 transition-opacity"></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span><span className="text-rose-500">81</span> Kritik</span>
              <span><span className="text-amber-500">235</span> Yüksek</span>
              <span><span className="text-[#6ABFB8]">357</span> Dirençli</span>
            </div>
          </div>
        </div>

        {/* SAĞ PANEL: HFER-720 ANALİZİ VE AKSİYONLAR */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="grid grid-cols-2 gap-6">
            {/* SEÇİLİ TESİS BİLGİ KARTI */}
            <div className={`bg-gradient-to-br from-[#121A2F] to-[#0A0F1C] border border-${selectedFac.color}-500/30 rounded-2xl p-6 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${selectedFac.color}-500/10 rounded-full blur-3xl`}></div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded border border-${selectedFac.color}-500/50 text-${selectedFac.color}-400 uppercase tracking-widest mb-4 inline-block`}>
                {selectedFac.status} RİSK
              </span>
              <h2 className="text-2xl font-black text-white mb-1">{selectedFac.name}</h2>
              <p className="text-xs text-slate-400 font-mono mb-6">{selectedFac.type}</p>
              
              <div className="bg-[#0A0F1C] rounded-xl p-4 border border-slate-800/50">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">HFER-720 Risk Skoru</p>
                <div className="flex items-end gap-2">
                  <span className={`text-4xl font-black text-${selectedFac.color}-400 font-mono`}>{selectedFac.riskScore}</span>
                  <span className="text-xs text-slate-500 mb-1">/ 1.000</span>
                </div>
              </div>
            </div>

            {/* HFER RADAR KARTI (Saf CSS/HTML ile yapılmış kurumsal Radar) */}
            <div className="bg-[#121A2F] border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative">
               <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest absolute top-4 left-4"><Radar className="w-4 h-4 inline mr-1"/> HFER Katmanları</h2>
               <div className="w-full space-y-4 mt-6">
                 <div>
                   <div className="flex justify-between text-xs font-mono text-slate-400 mb-1"><span>Tehlike (H)</span> <span className="text-rose-400">{selectedFac.scores.H.toFixed(2)}</span></div>
                   <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="bg-rose-500 h-1.5 rounded-full" style={{width: `${selectedFac.scores.H * 100}%`}}></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-mono text-slate-400 mb-1"><span>Kırılganlık (F)</span> <span className="text-amber-400">{selectedFac.scores.F.toFixed(2)}</span></div>
                   <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="bg-amber-500 h-1.5 rounded-full" style={{width: `${selectedFac.scores.F * 100}%`}}></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-mono text-slate-400 mb-1"><span>Maruziyet (X) * Domino(D)</span> <span className="text-purple-400">{(selectedFac.scores.X * selectedFac.scores.D).toFixed(2)}</span></div>
                   <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="bg-purple-500 h-1.5 rounded-full" style={{width: `${Math.min((selectedFac.scores.X * selectedFac.scores.D / 2) * 100, 100)}%`}}></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-mono text-slate-400 mb-1"><span>Kapasite (C)</span> <span className="text-[#6ABFB8]">{selectedFac.scores.C.toFixed(2)}</span></div>
                   <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="bg-[#6ABFB8] h-1.5 rounded-full shadow-[0_0_8px_#6ABFB8]" style={{width: `${selectedFac.scores.C * 100}%`}}></div></div>
                 </div>
               </div>
            </div>
          </div>

          {/* YAPAY ZEKA ÖNERİLERİ (PRIORITY RECOMMENDATIONS) */}
          <div className="bg-[#121A2F] border border-slate-800 rounded-2xl p-6 flex-1 flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Zap className="w-4 h-4 text-[#E8C97A]"/> AI Optimizasyon Önerileri</h2>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono">Formül: R = (H*F*X*D)/(1+kC²)</span>
             </div>

             <div className="space-y-3 flex-1">
               {selectedFac.recs.map((rec, idx) => (
                 <div key={idx} className="bg-[#0A0F1C] border border-slate-800/80 p-4 rounded-xl flex items-center justify-between group hover:border-slate-600 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 ${rec.type.includes('Artırıcı') ? 'text-emerald-400' : 'text-amber-400'}`}>
                       <Target className="w-4 h-4" />
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-slate-200">{rec.action}</h4>
                       <p className="text-[10px] text-slate-500 font-mono mt-0.5">Etki Yönü: {rec.type} | Maliyet: {rec.cost}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                       <TrendingUp className="w-3 h-3"/> {rec.roi}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
             
             <button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-3 rounded-xl transition-all border border-slate-700 uppercase tracking-widest flex items-center justify-center gap-2">
                Aksiyonları İRAP Planına Ekle <ChevronRight className="w-4 h-4"/>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}