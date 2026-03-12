'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase Bağlantısı
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GecmisAnalizler() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      // Supabase'den verileri en yeni tarihli olan en üstte olacak şekilde çekiyoruz
      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Veri çekme hatası:", error);
      } else {
        setReports(data || []);
      }
      setLoading(false);
    }

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Arşiv Modülü</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Kurumsal Hafıza (Geçmiş Analizler)
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Yapay zeka tarafından üretilen ve kurum kasanıza kaydedilen tüm stratejik eylem planları.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-500 font-medium animate-pulse">
            Veriler güvenli kasadan getiriliyor, lütfen bekleyin...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-10 text-center text-slate-500 font-medium">
            Henüz kaydedilmiş bir AI analizi bulunmuyor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider">
                  <th className="p-4 font-semibold w-40">Tarih</th>
                  <th className="p-4 font-semibold w-48">Kurum (Tenant)</th>
                  <th className="p-4 font-semibold text-center w-40">H-F-E Skorları</th>
                  <th className="p-4 font-semibold">Yapay Zeka Stratejik Çıktısı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                      {new Date(report.created_at).toLocaleDateString('tr-TR', {
                        day: '2-digit', month: 'short', year: 'numeric', 
                        hour: '2-digit', minute:'2-digit'
                      })}
                    </td>
                    <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                      {report.tenant_name}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className="inline-flex gap-1.5">
                        <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold" title="Tehlike">H:{report.h_score}</span>
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold" title="Kırılganlık">F:{report.f_score}</span>
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold" title="Kapasite">E:{report.e_score}</span>
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 line-clamp-2 md:line-clamp-3" title={report.ai_response}>
                      {report.ai_response}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}