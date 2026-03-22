'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import { Download, Bot, Target, ArrowRight, ArrowLeft, ShieldAlert, Activity, CheckCircle2, Building2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { createClient } from '@supabase/supabase-js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Supabase Bağlantısı
const supabaseUrl = 'https://gqguwgbopgnpwzjwcexl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function OmniRiskDashboard() {
  const [step, setStep] = useState(1);
  const [hScore, setHScore] = useState(50);
  const [fScore, setFScore] = useState(50);
  const [eScore, setEScore] = useState(50);
  
  // Tesis Entegrasyonu
  const [facilities, setFacilities] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState('Merkez Bina');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);

  // Sayfa açıldığında tesisleri Supabase'den çek
  useEffect(() => {
    async function fetchFacilities() {
      if(supabaseUrl) {
        const { data } = await supabase.from('facilities').select('*').order('name');
        if (data && data.length > 0) {
          setFacilities(data);
          setSelectedFacility(data[0].name); // Varsayılan olarak ilk tesisi seç
        }
      }
    }
    fetchFacilities();
  }, []);

  const radarData = {
    labels: ['Tehlike (H)', 'Kırılganlık (F)', 'Kapasite (E)'],
    datasets: [{
      label: 'HFE-360 Skoru',
      data: [hScore, fScore, eScore],
      backgroundColor: 'rgba(37, 99, 235, 0.2)',
      borderColor: 'rgba(37, 99, 235, 0.8)',
      borderWidth: 2,
      pointBackgroundColor: '#1e40af',
      pointBorderColor: '#fff',
    }],
  };

  const radarOptions = {
    scales: { r: { min: 0, max: 100, ticks: { stepSize: 20, display: false }, pointLabels: { font: { size: 14, family: 'Inter', weight: 'bold' as const }, color: '#334155' } } },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  const handleAnalyze = async () => {
    setStep(4);
    setIsAnalyzing(true);
    setAiReport('Ollama Llama 3 modeli tesis verilerini ve mevzuatları sentezliyor, lütfen bekleyin...');
    
    try {
      // API'ye Kurum Adı + Seçilen Tesis ismini birlikte gönderiyoruz!
      const tenantWithFacility = `Akbank A.Ş. (${selectedFacility})`;
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hScore, fScore, eScore, tenant: tenantWithFacility }),
      });
      const data = await response.json();
      setAiReport(data.report);
    } catch (error) {
      setAiReport('Bir hata oluştu. Ollama uygulamasının çalıştığından emin olun.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`OMNI_${selectedFacility.replace(/\s+/g, '_')}_Rapor_${new Date().toLocaleDateString('tr-TR')}.pdf`);
    } catch (error) {
      console.error('PDF oluşturulurken hata:', error);
    }
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* YENİ: TESİS SEÇİM ALANI */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-xl"><Building2 className="w-6 h-6 text-blue-700"/></div>
                <div>
                  <h3 className="font-bold text-slate-900">Analiz Edilecek Tesis</h3>
                  <p className="text-sm text-slate-500">Lütfen risk analizi yapılacak lokasyonu seçin</p>
                </div>
              </div>
              <select 
                value={selectedFacility} 
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="bg-white border border-slate-300 text-slate-900 font-bold rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 w-full md:w-64 outline-none shadow-sm cursor-pointer">
                {facilities.length > 0 ? (
                  facilities.map(fac => <option key={fac.id} value={fac.name}>{fac.name}</option>)
                ) : (
                  <option value="Merkez Bina">Merkez Bina (Kayıtlı tesis yok)</option>
                )}
              </select>
            </div>

            <div className="flex items-center gap-3 mb-4 text-rose-600"><ShieldAlert className="w-8 h-8"/> <h2 className="text-2xl font-bold">Adım 1: Tehlike Profili (Hazard)</h2></div>
            <p className="text-slate-500 mb-8">Seçilen tesisin maruz kalabileceği dışsal ve içsel tehditlerin şiddet ve olasılık potansiyelini belirleyin.</p>
            <div className="bg-rose-50 p-8 rounded-2xl border border-rose-100">
              <label className="flex justify-between font-black text-lg mb-6 text-rose-900">Tehlike Skoru <span className="text-3xl bg-white px-4 py-1 rounded-lg shadow-sm">{hScore}</span></label>
              <input type="range" min="0" max="100" value={hScore} onChange={(e) => setHScore(Number(e.target.value))} className="w-full h-3 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4 text-amber-600"><Activity className="w-8 h-8"/> <h2 className="text-2xl font-bold">Adım 2: Operasyonel Kırılganlık (Fragility)</h2></div>
            <p className="text-slate-500 mb-8">Tesisin mevcut sistemlerinin ve altyapısının bu tehlikelere karşı ne kadar zayıf veya savunmasız olduğunu değerlendirin.</p>
            <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100">
              <label className="flex justify-between font-black text-lg mb-6 text-amber-900">Kırılganlık Skoru <span className="text-3xl bg-white px-4 py-1 rounded-lg shadow-sm">{fScore}</span></label>
              <input type="range" min="0" max="100" value={fScore} onChange={(e) => setFScore(Number(e.target.value))} className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4 text-emerald-600"><Target className="w-8 h-8"/> <h2 className="text-2xl font-bold">Adım 3: Müdahale Kapasitesi (Emergency)</h2></div>
            <p className="text-slate-500 mb-8">Tesisin bir kriz anında toparlanma, kaynakları yönetme ve iş sürekliliğini sağlama konusundaki mevcut yetkinlik seviyesi.</p>
            <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
              <label className="flex justify-between font-black text-lg mb-6 text-emerald-900">Kapasite Skoru <span className="text-3xl bg-white px-4 py-1 rounded-lg shadow-sm">{eScore}</span></label>
              <input type="range" min="0" max="100" value={eScore} onChange={(e) => setEScore(Number(e.target.value))} className="w-full h-3 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-in fade-in zoom-in-95 duration-500">
             {aiReport && !isAnalyzing && (
              <div className="flex justify-end mb-4">
                <button onClick={generatePDF} className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2 px-5 rounded-lg flex items-center gap-2 shadow-md transition-all">
                  <Download className="w-4 h-4"/> Resmi PDF Raporunu İndir
                </button>
              </div>
            )}
            
            <div ref={reportRef} className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 min-h-[500px]">
              <div className="border-b border-slate-200 pb-6 mb-8 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wide">OMNI OMNI Stratejik Rapor</h2>
                  <p className="text-slate-500 font-medium mt-1">Kurum: <span className="text-slate-800 font-bold">Akbank A.Ş.</span></p>
                  <p className="text-slate-500 font-medium mt-1">İncelenen Tesis: <span className="text-blue-700 font-bold">{selectedFacility}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-400 uppercase">Tarih</p>
                  <p className="text-lg font-bold text-slate-800">{new Date().toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="h-72 relative"><Radar data={radarData} options={radarOptions} /></div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm">
                    <Bot className="w-5 h-5"/> Yönetim Kurulu Eylem Planı
                  </h4>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{aiReport}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
               <button onClick={() => setStep(1)} className="text-slate-500 font-medium hover:text-slate-800 underline">Yeni Bir Analiz Başlat</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">HFE-360 Değerlendirme Modülü</h1>
          <p className="text-slate-500">Adım adım risk profilinizi oluşturun, yapay zeka sizin için stratejiyi yönetsin.</p>
        </div>

        {step < 4 && (
          <div className="flex items-center justify-between mb-12 relative px-4">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
            
            {[1, 2, 3].map((num) => (
              <div key={num} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all duration-300 ${step >= num ? 'bg-blue-600 border-white text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 border-white text-slate-400'}`}>
                {step > num ? <CheckCircle2 className="w-6 h-6" /> : num}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200/60 mb-8 min-h-[400px] flex flex-col justify-center">
          {renderStepContent()}
        </div>

        {step < 4 && (
          <div className="flex justify-between items-center px-4">
            <button 
              onClick={() => setStep(step - 1)} 
              disabled={step === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'opacity-0 cursor-default' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>
              <ArrowLeft className="w-5 h-5"/> Geri
            </button>

            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)} 
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 hover:shadow-lg transition-all">
                İleri <ArrowRight className="w-5 h-5"/>
              </button>
            ) : (
              <button 
                onClick={handleAnalyze} 
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                <Bot className="w-5 h-5"/> Tesis Analizini Başlat
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}