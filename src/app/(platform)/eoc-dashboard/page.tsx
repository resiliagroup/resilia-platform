'use client';

import React, { useState } from 'react';
import { 
  Map, AlertTriangle, Truck, Users, BrainCircuit, Activity, 
  Zap, CheckCircle2, Navigation, Radio, Flame, Droplets, ShieldAlert, Loader2
} from 'lucide-react';

export default function EOCDashboard() {
  const [selectedIncident, setSelectedIncident] = useState(1);
  
  // GraphRAG (Yapay Zeka) Durum Yönetimi
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Olaylar Mock Verisi
  const incidents = [
    { id: 1, type: 'Sel / Taşkın', location: 'Kavaklı Sahil Yolu', severity: 'Kritik', time: '14:23', icon: <Droplets className="w-5 h-5 text-blue-400" /> },
    { id: 2, type: 'Endüstriyel Yangın', location: 'Yakuplu OSB', severity: 'Yüksek', time: '15:05', icon: <Flame className="w-5 h-5 text-rose-400" /> },
    { id: 3, type: 'Altyapı Çökmesi', location: 'Gürpınar Su Hattı', severity: 'Orta', time: '16:12', icon: <Activity className="w-5 h-5 text-amber-400" /> },
  ];

  const resources = [
    { name: 'Nefes Arama Kurtarma', active: 42, total: 45, type: 'Personel', color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
    { name: 'Ağır İş Makineleri', active: 8, total: 12, type: 'Araç', color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { name: 'Yüksek Kapsiteli Motopomp', active: 15, total: 15, type: 'Ekipman', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  ];

  // API'yi Çağıran Fonksiyon (GraphRAG Tetikleyicisi)
  const runGraphRAG = async () => {
    setIsAnalyzing(true);
    setAiReport(null);
    try {
      const response = await fetch('/api/graph-rag', { method: 'POST' });
      const data = await response.json();
      setAiReport(data.result);
    } catch (error) {
      setAiReport("Yapay zeka bağlantı hatası oluştu.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-6 font-sans overflow-y-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-2xl shadow-lg shadow-purple-900/20">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wider">ARES EOC <span className="text-slate-500 font-medium">| Emergency Operations Center</span></h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase tracking-widest">Durum: Aktif Kriz</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SOL KOLON: OLAYLAR VE HARİTA */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-2 relative h-[350px] overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="absolute top-1/2 left-1/3 z-20 flex flex-col items-center animate-bounce">
              <div className="bg-blue-500/20 p-2 rounded-full border border-blue-500/50 backdrop-blur-sm">
                <Droplets className="w-6 h-6 text-blue-400" />
              </div>
              <div className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-[10px] font-bold mt-1 shadow-lg">Kavaklı Sel (HAZ-001)</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Aktif Olaylar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {incidents.map((inc) => (
                <div key={inc.id} onClick={() => { setSelectedIncident(inc.id); setAiReport(null); }} className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedIncident === inc.id ? 'bg-slate-800 border-purple-500 shadow-lg shadow-purple-900/20' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-slate-900 p-2 rounded-lg">{inc.icon}</div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider bg-rose-500/20 text-rose-400">{inc.severity}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{inc.type}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Navigation className="w-3 h-3"/> {inc.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: AI KARAR DESTEK MOTORU (GRAPHRAG BURADA ÇALIŞACAK) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/50 rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-purple-900/20 min-h-[400px] flex flex-col">
            <div className="absolute -right-6 -top-6 opacity-10"><BrainCircuit className="w-32 h-32 text-purple-500"/></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-2 rounded-xl"><BrainCircuit className="w-5 h-5 text-white"/></div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wide">ARES Knowledge Graph (DL)</h2>
                  <p className="text-[10px] text-purple-400 font-mono">GraphRAG Analiz Motoru</p>
                </div>
              </div>
            </div>

            {/* BUTON BURADA: JSON Verisini Okutup AI'yi Tetikler */}
            {!aiReport && !isAnalyzing && selectedIncident === 1 && (
              <div className="flex-1 flex flex-col items-center justify-center relative z-10 animate-in fade-in">
                <AlertTriangle className="w-12 h-12 text-rose-500 mb-4 animate-pulse" />
                <p className="text-sm text-slate-400 text-center mb-6">Kavaklı bölgesinde kritik sel alarmı. TAMP mevzuatları, bina envanteri ve trafo altyapısı birbiriyle ilişkilendirilecek.</p>
                <button onClick={runGraphRAG} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-purple-900/50 flex items-center gap-2 w-full justify-center">
                  <Zap className="w-5 h-5"/> Derin Ağ Analizini (GraphRAG) Başlat
                </button>
              </div>
            )}

            {/* YÜKLENİYOR DURUMU */}
            {isAnalyzing && (
              <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                <p className="text-sm text-purple-400 font-mono animate-pulse">JSON Düğümleri (Nodes) Taranıyor...</p>
                <p className="text-[10px] text-slate-500 mt-2">İlişkiler (Edges) ve AFAD TAMP Mevzuatı Çözümleniyor</p>
              </div>
            )}

            {/* AI'NIN VERDİĞİ SONUÇ (RAPOR) BURAYA YANSIYACAK */}
            {aiReport && !isAnalyzing && (
              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 flex-1 flex flex-col">
                <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 border-l-4 border-l-rose-500 flex-1 overflow-y-auto">
                  <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">Olay Komutanı (AI) Raporu</h3>
                  <p className="text-sm text-slate-200 font-medium leading-relaxed whitespace-pre-wrap">
                    {aiReport}
                  </p>
                </div>
                <button onClick={() => setAiReport(null)} className="mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl transition-all text-xs border border-slate-700">
                  Analizi Sıfırla
                </button>
              </div>
            )}
            
            {selectedIncident !== 1 && (
              <div className="flex-1 flex items-center justify-center relative z-10">
                <p className="text-sm text-slate-500">Lütfen haritadan "Kavaklı Sel" olayını seçin.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}