'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, Factory, Landmark, ShieldAlert, Activity, Target, 
  CheckCircle2, ChevronRight, AlertCircle, BrainCircuit, ArrowRight
} from 'lucide-react';

// Sektörel Dinamik Soru Bankası (Supabase'den Gelecek Verinin Simülasyonu)
const QUESTION_BANK = {
  'Belediye / Kamu': {
    H: [
      { id: 'h1', q: 'İlçe sınırlarınız içindeki aktif fay hatlarına uzaklığınız nedir?', labels: ['0-5 km (Çok Riskli)', '5-15 km', '15-30 km', '30-50 km', '50+ km (Güvenli)'] },
      { id: 'h2', q: 'Son 5 yılda gerçekleşen taşkın/sel olaylarının sıklığı nedir?', labels: ['Yılda 3+', 'Yılda 1-2', '2 Yılda 1', '5 Yılda 1', 'Hiç Olmadı'] }
    ],
    F: [
      { id: 'f1', q: 'Kritik altyapı (Su/Kanalizasyon) tesislerinizin sismik dayanıklılık oranı nedir?', labels: ['%0-20', '%21-40', '%41-60', '%61-80', '%81-100'] },
      { id: 'f2', q: 'Belediye hizmet binalarının tahliye yolları güncel NFPA standartlarına uygun mu?', labels: ['Hiç Uygun Değil', 'Kısmen', 'Çoğunlukla', 'Büyük Oranda', 'Tamamen Uygun'] }
    ],
    E: [
      { id: 'e1', q: 'AFAD akredite Arama Kurtarma (Nefes vb.) personel kapasiteniz nedir?', labels: ['Yok', '1-10 Kişi', '11-30 Kişi', '31-50 Kişi', '50+ (Tam Ekip)'] },
      { id: 'e2', q: 'Afet anında komşu ilçelerle (Nefes Birliği) haberleşme yedekliliğiniz (Uydu/Telsiz) aktif mi?', labels: ['Sadece GSM', 'Sınırlı Telsiz', 'Telsiz Ağları', 'Uydu+Telsiz', 'Tam Yedekli TAMP Ağı'] }
    ]
  },
  'Sanayi / OSB': {
    H: [
      { id: 'h1', q: 'Tesisiniz endüstriyel kaza (Seveso) riski taşıyan bir bölgede mi?', labels: ['Yüksek Risk', 'Orta Risk', 'Düşük Risk', 'Çok Düşük', 'Risk Yok'] }
    ],
    F: [
      { id: 'f1', q: 'Üretim bantlarınızın titreşim sönümleyici (İzolatör) altyapısı var mı?', labels: ['Yok', 'Kurulum Aşamasında', 'Kısmi Kapasite', 'Büyük Bantlarda Var', 'Tüm Tesis İzolatörlü'] }
    ],
    E: [
      { id: 'e1', q: 'Tesisin tam kapasite çalışmasını sağlayacak ikincil enerji (Jeneratör) süresi nedir?', labels: ['Yok', '1-4 Saat', '4-12 Saat', '12-24 Saat', '48+ Saat (BDDK Uyumlu)'] }
    ]
  }
};

export default function HFEEssessmentEngine() {
  const [step, setStep] = useState(0); // 0: Sektör, 1: H, 2: F, 3: E, 4: Sonuç
  const [sector, setSector] = useState('Belediye / Kamu');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  // Canlı Skor Hesaplama
  const calculateScore = (category: string) => {
    if (step === 0) return 0;
    const questions = QUESTION_BANK[sector as keyof typeof QUESTION_BANK][category as 'H' | 'F' | 'E'] || [];
    let total = 0;
    let answered = 0;
    questions.forEach(q => {
      if (answers[q.id] !== undefined) {
        total += answers[q.id];
        answered++;
      }
    });
    // Formül: (Toplam Puan / (Soru Sayısı * 5)) * 100
    // Not: H ve F için yüksek puan = Kötü. E için yüksek puan = İyi. Algoritma ileride bunu tersleyecek.
    return answered === 0 ? 0 : Math.round((total / (answered * 5)) * 100);
  };

  const handleAnswer = (qId: string, val: number) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const isStepComplete = () => {
    if (step === 0) return true;
    const currentCategory = step === 1 ? 'H' : step === 2 ? 'F' : 'E';
    const questions = QUESTION_BANK[sector as keyof typeof QUESTION_BANK][currentCategory] || [];
    return questions.every(q => answers[q.id] !== undefined);
  };

  const renderQuestions = (category: 'H' | 'F' | 'E', title: string, desc: string, Icon: any, color: string) => {
    const questions = QUESTION_BANK[sector as keyof typeof QUESTION_BANK][category];
    return (
      <div className="animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="mb-10">
          <div className={`inline-flex p-3 rounded-2xl mb-4 bg-${color}-500/10 text-${color}-500 border border-${color}-500/20`}>
            <Icon className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{title}</h2>
          <p className="text-slate-500 mt-2 text-lg">{desc}</p>
        </div>

        <div className="space-y-8">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex gap-3">
                <span className={`text-${color}-500`}>{idx + 1}.</span> {q.q}
              </h3>
              
              {/* Likert Scale (1-5) Pro Tasarım */}
              <div className="flex flex-col md:flex-row gap-3">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(q.id, val)}
                    className={`flex-1 relative group p-4 rounded-2xl border-2 transition-all duration-200 ${
                      answers[q.id] === val 
                        ? `border-${color}-500 bg-${color}-50` 
                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {answers[q.id] === val && (
                      <div className={`absolute -top-3 -right-3 bg-${color}-500 text-white rounded-full p-1 shadow-md animate-in zoom-in`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <span className={`block text-center font-bold text-xl mb-1 ${answers[q.id] === val ? `text-${color}-700` : 'text-slate-400'}`}>
                      {val}
                    </span>
                    <span className={`block text-center text-xs font-medium ${answers[q.id] === val ? `text-${color}-600` : 'text-slate-500'}`}>
                      {q.labels[val - 1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      
      {/* ÜST BAR (Top Navigation) */}
      <header className="bg-white border-b border-slate-200/60 px-6 lg:px-10 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl"><BrainCircuit className="w-6 h-6 text-white"/></div>
          <span className="font-black text-xl tracking-wider text-slate-900">OMNI <span className="font-medium text-slate-400">DATA ENGINE</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 border border-slate-200">
            <AlertCircle className="w-4 h-4"/> ISO 22301 & TAMP Uyumlu
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        
        {/* SOL PANEL - DİNAMİK SKOR VE İLERLEME (Sidebar) */}
        <aside className="w-full lg:w-96 bg-white border-r border-slate-200/60 p-6 lg:p-10 flex flex-col justify-between hidden lg:flex">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">HFE-360 Değerlendirmesi</h3>
            
            {/* Stepper */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              
              <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${step >= 1 ? 'bg-rose-500 border-rose-100 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                  <ShieldAlert className="w-4 h-4"/>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] pl-4 md:pl-0">
                  <h4 className={`font-bold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Tehlike (H)</h4>
                  <p className="text-2xl font-black font-mono text-slate-300">{calculateScore('H')}</p>
                </div>
              </div>

              <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${step >= 2 ? 'bg-amber-500 border-amber-100 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                  <Activity className="w-4 h-4"/>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] pl-4 md:pl-0">
                  <h4 className={`font-bold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Kırılganlık (F)</h4>
                  <p className="text-2xl font-black font-mono text-slate-300">{calculateScore('F')}</p>
                </div>
              </div>

              <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${step >= 3 ? 'bg-emerald-500 border-emerald-100 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                  <Target className="w-4 h-4"/>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] pl-4 md:pl-0">
                  <h4 className={`font-bold ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Kapasite (E)</h4>
                  <p className="text-2xl font-black font-mono text-slate-300">{calculateScore('E')}</p>
                </div>
              </div>

            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-800 mb-1">Seçili Sektör Modülü</h4>
            <p className="text-slate-500 text-xs mb-3">Bu değerlendirme sektörel mevzuata göre dinamik oluşturulmuştur.</p>
            <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 shadow-sm flex items-center gap-2">
              {sector === 'Belediye / Kamu' ? <Landmark className="w-4 h-4 text-blue-500"/> : <Factory className="w-4 h-4 text-indigo-500"/>}
              {sector}
            </div>
          </div>
        </aside>

        {/* SAĞ PANEL - İÇERİK (Wizard Content) */}
        <main className="flex-1 p-6 lg:p-16 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            
            {step === 0 && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Sektörel Konfigürasyon</h1>
                  <p className="text-lg text-slate-500">OMNI motoru, seçeceğiniz sektöre göre ISO ve ulusal mevzuat algoritmalarını otomatik yükleyecektir.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div 
                    onClick={() => setSector('Belediye / Kamu')}
                    className={`cursor-pointer p-8 rounded-3xl border-2 transition-all duration-300 ${sector === 'Belediye / Kamu' ? 'border-blue-600 bg-blue-50 shadow-xl shadow-blue-900/10 scale-[1.02]' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${sector === 'Belediye / Kamu' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Landmark className="w-7 h-7"/>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Belediye / Kamu</h3>
                    <p className="text-slate-500 leading-relaxed">AFAD TAMP, İRAP ve NFPA standartlarına dayalı yerel yönetim ve acil müdahale soru seti.</p>
                  </div>

                  <div 
                    onClick={() => setSector('Sanayi / OSB')}
                    className={`cursor-pointer p-8 rounded-3xl border-2 transition-all duration-300 ${sector === 'Sanayi / OSB' ? 'border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-900/10 scale-[1.02]' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${sector === 'Sanayi / OSB' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Factory className="w-7 h-7"/>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Sanayi / OSB</h3>
                    <p className="text-slate-500 leading-relaxed">ISO 22301 İş Sürekliliği, Seveso III Endüstriyel Kaza ve tedarik zinciri dayanıklılık seti.</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button onClick={() => setStep(1)} className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2">
                    Değerlendirmeyi Başlat <ArrowRight className="w-5 h-5"/>
                  </button>
                </div>
              </div>
            )}

            {step === 1 && renderQuestions('H', 'Tehlike Profili (Hazard)', 'Kurumunuzun dışsal tehditlere maruz kalma durumunu puanlayın.', ShieldAlert, 'rose')}
            {step === 2 && renderQuestions('F', 'Kırılganlık (Fragility)', 'Mevcut altyapınızın bu tehditlere karşı yapısal zayıflığını değerlendirin.', Activity, 'amber')}
            {step === 3 && renderQuestions('E', 'Müdahale Kapasitesi (Emergency)', 'Afet anındaki operasyonel toparlanma gücünüzü belirleyin.', Target, 'emerald')}

            {step === 4 && (
               <div className="text-center animate-in zoom-in-95 duration-500 py-20">
                 <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 className="w-12 h-12" />
                 </div>
                 <h2 className="text-4xl font-black text-slate-900 mb-4">Veri Toplama Tamamlandı</h2>
                 <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8">
                   Girmiş olduğunuz veriler ARES (Urban Resilience OS) Knowledge Graph'ına işlenmiş ve Derin Öğrenme modelleri için yapılandırılmıştır.
                 </p>
                 <button onClick={() => window.location.href='/eoc-dashboard'} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2 mx-auto">
                   <BrainCircuit className="w-5 h-5"/> AI Komuta Merkezine Geç (EOC)
                 </button>
               </div>
            )}

            {/* Navigasyon Butonları */}
            {step > 0 && step < 4 && (
              <div className="mt-12 flex justify-between items-center border-t border-slate-200/60 pt-8">
                <button onClick={() => setStep(step - 1)} className="text-slate-500 hover:text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors">
                  Geri Dön
                </button>
                <button 
                  disabled={!isStepComplete()}
                  onClick={() => setStep(step + 1)} 
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${
                    isStepComplete() 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {step === 3 ? 'Analizi Tamamla' : 'Sonraki Aşama'} <ChevronRight className="w-5 h-5"/>
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}