'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Building2, MapPin, Server, Plus, AlertCircle } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TesisAgi() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Yeni Tesis Formu Eyaletleri
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Şube');
  const [city, setCity] = useState('');

  // Tesisleri Getir
  const fetchFacilities = async () => {
    setLoading(true);
    const { data } = await supabase.from('facilities').select('*').order('created_at', { ascending: false });
    setFacilities(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchFacilities(); }, []);

  // Yeni Tesis Ekle
  const handleAddFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('facilities').insert([{ tenant_name: 'Akbank A.Ş.', name, type, city }]);
    if (!error) {
      setShowForm(false);
      setName(''); setCity('');
      fetchFacilities(); // Listeyi yenile
    }
  };

  const getIcon = (type: string) => {
    if (type === 'Veri Merkezi') return <Server className="w-5 h-5 text-indigo-500" />;
    return <Building2 className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Tesis ve Şube Ağı</h1>
          <p className="text-slate-500">Kurumunuza ait tüm fiziksel ve kritik altyapı lokasyonlarını yönetin.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all">
          <Plus className="w-5 h-5" /> Yeni Tesis Ekle
        </button>
      </div>

      {/* Yeni Ekleme Formu */}
      {showForm && (
        <form onSubmit={handleAddFacility} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 animate-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-4">Yeni Lokasyon Tanımla</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input required type="text" placeholder="Tesis Adı (Örn: Gebze DR Merkezi)" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500" />
            <select value={type} onChange={(e) => setType(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500">
              <option value="Şube">Banka Şubesi</option>
              <option value="Veri Merkezi">Veri Merkezi / IT</option>
              <option value="Genel Müdürlük">Genel Müdürlük Binası</option>
              <option value="Depo">Lojistik / Depo</option>
            </select>
            <input required type="text" placeholder="Şehir (Örn: İstanbul)" value={city} onChange={(e) => setCity(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg">İptal</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all">Kaydet</button>
          </div>
        </form>
      )}

      {/* Tesis Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-10 text-center text-slate-500 animate-pulse">Tesisler yükleniyor...</div>
        ) : facilities.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
            <p className="font-medium text-lg">Sisteme kayıtlı hiçbir tesis bulunmuyor.</p>
            <p className="text-sm">Risk analizi yapabilmek için yukarıdan yeni bir tesis ekleyin.</p>
          </div>
        ) : (
          facilities.map((fac) => (
            <div key={fac.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all hover:border-blue-200 group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
                  {getIcon(fac.type)}
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">{fac.status}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{fac.name}</h3>
              <p className="text-sm font-semibold text-blue-600 mb-4">{fac.type}</p>
              
              <div className="flex items-center gap-2 text-slate-500 text-sm pt-4 border-t border-slate-100">
                <MapPin className="w-4 h-4" /> {fac.city}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}