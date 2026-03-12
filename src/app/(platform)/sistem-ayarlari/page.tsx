'use client';

import React, { useState } from 'react';
import { Database, BrainCircuit, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SistemAyarlari() {
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState('Genel BCM');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleTeach = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, sector }),
      });

      if (res.ok) {
        setStatus('success');
        setTitle(''); setContent('');
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        <div className="mb-10 text-center">
          <div className="inline-flex bg-purple-100 p-3 rounded-2xl mb-4 shadow-sm text-purple-700">
            <BrainCircuit className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Yapay Zeka Eğitim Paneli (RAG)
          </h1>
          <p className="text-slate-500">Sisteme yeni mevzuat, politika veya standartlar öğreterek analiz zekasını geliştirin.</p>
        </div>

        <form onSubmit={handleTeach} className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mevzuat / Standart Adı</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: ISO 22301 Madde 8.4" className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 block p-3.5 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Sektör / Kategori</label>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 block p-3.5 outline-none transition-all cursor-pointer">
                <option value="Genel BCM">Genel BCM (İş Sürekliliği)</option>
                <option value="Banking">Bankacılık & Finans (BDDK)</option>
                <option value="Public">Kamu & Afet (AFAD)</option>
                <option value="IT">Siber Güvenlik (DORA/NIS2)</option>
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
              <span>Mevzuat Metni (İçerik)</span>
              <span className="text-slate-400 font-normal text-xs">Yapay zeka bu metni analizlerinde kullanacaktır.</span>
            </label>
            <textarea required rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Öğretmek istediğiniz kuralı veya mevzuat maddesini buraya yapıştırın..." className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 block p-4 outline-none transition-all resize-none"></textarea>
          </div>

          {status === 'success' && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3 font-medium">
              <CheckCircle2 className="w-5 h-5"/> Bilgi başarıyla vektörel hafızaya kodlandı!
            </div>
          )}
          {status === 'error' && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3 font-medium">
              <AlertCircle className="w-5 h-5"/> Kayıt sırasında bir hata oluştu.
            </div>
          )}

          <button type="submit" disabled={status === 'loading'} className="w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all">
            <Database className="w-5 h-5"/>
            {status === 'loading' ? 'Vektöre Çevriliyor ve Şifreleniyor...' : 'Sisteme Öğret ve Hafızaya Kaydet'}
          </button>
        </form>

      </div>
    </div>
  );
}