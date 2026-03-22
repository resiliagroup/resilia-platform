'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Building2, MapPin, Server, Plus, AlertCircle, Upload, X, Image } from 'lucide-react'

const supabaseUrl  = 'https://gqguwgbopgnpwzjwcexl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const PHOTO_BUCKET = 'facility-photos'
// Signed URL geçerlilik süresi: 1 saat (saniye cinsinden)
const SIGNED_URL_EXPIRY = 3600

interface Facility {
  id: string
  name: string
  type: string
  city: string
  status?: string
  // DB'de artık storage path saklanıyor (tam URL değil)
  // örn: "abc123-facility-id/cover.jpg"
  photo_url?: string | null
  tenant_name?: string
}

export default function TesisAgi() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  // Signed URL cache: facility.id → signed URL string
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('Şube')
  const [city, setCity] = useState('')

  // Fotoğraf upload state
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoOnizleme, setFotoOnizleme] = useState<string | null>(null)
  const [fotoYukleniyor, setFotoYukleniyor] = useState(false)
  const [surukleniyorMu, setSurukleniyorMu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Signed URL'leri toplu oluştur
  const signedUrlOlustur = async (tesisler: Facility[]) => {
    const fotoluTesisler = tesisler.filter(f => f.photo_url)
    if (fotoluTesisler.length === 0) return

    const urlMap: Record<string, string> = {}
    await Promise.all(
      fotoluTesisler.map(async fac => {
        const { data, error } = await supabase.storage
          .from(PHOTO_BUCKET)
          .createSignedUrl(fac.photo_url!, SIGNED_URL_EXPIRY)
        if (!error && data?.signedUrl) {
          urlMap[fac.id] = data.signedUrl
        }
      })
    )
    setSignedUrls(prev => ({ ...prev, ...urlMap }))
  }

  const fetchFacilities = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('facilities')
      .select('*')
      .order('created_at', { ascending: false })
    const liste = (data || []) as Facility[]
    setFacilities(liste)
    await signedUrlOlustur(liste)
    setLoading(false)
  }

  useEffect(() => { fetchFacilities() }, [])

  // Fotoğraf sürükle-bırak
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setSurukleniyorMu(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) secFoto(file)
  }

  const secFoto = (file: File) => {
    setFotoFile(file)
    const reader = new FileReader()
    reader.onload = e => setFotoOnizleme(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const fotoKaldir = () => { setFotoFile(null); setFotoOnizleme(null) }

  // Supabase Storage'a yükle.
  // Private bucket: publicUrl yerine storage PATH döndür.
  // DB'ye path kaydedilir; gösterim sırasında signed URL oluşturulur.
  const fotoYukle = async (facilityId: string): Promise<string | null> => {
    if (!fotoFile) return null
    setFotoYukleniyor(true)
    const uzanti = fotoFile.name.split('.').pop() ?? 'jpg'
    const dosyaYolu = `${facilityId}/cover.${uzanti}`

    const { error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(dosyaYolu, fotoFile, { upsert: true, contentType: fotoFile.type })

    if (error) {
      console.error('Fotoğraf yükleme hatası:', error)
      setFotoYukleniyor(false)
      return null
    }

    // Yükleme başarılı → path döndür (tam URL değil)
    setFotoYukleniyor(false)
    return dosyaYolu
  }

  const handleAddFacility = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: yeniTesis, error } = await supabase
      .from('facilities')
      .insert([{ tenant_name: 'Akbank A.Ş.', name, type, city }])
      .select()
      .single()

    if (error || !yeniTesis) return

    if (fotoFile) {
      const path = await fotoYukle(yeniTesis.id)
      if (path) {
        await supabase.from('facilities').update({ photo_url: path }).eq('id', yeniTesis.id)
      }
    }

    setShowForm(false)
    setName(''); setCity(''); fotoKaldir()
    fetchFacilities()
  }

  const getIcon = (t: string) => {
    if (t === 'Veri Merkezi') return <Server className="w-5 h-5 text-indigo-500" />
    return <Building2 className="w-5 h-5 text-blue-500" />
  }

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

      {/* Yeni Tesis Formu */}
      {showForm && (
        <form onSubmit={handleAddFacility} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h3 className="font-bold text-lg mb-4">Yeni Lokasyon Tanımla</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input required type="text" placeholder="Tesis Adı" value={name} onChange={e => setName(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500" />
            <select value={type} onChange={e => setType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500">
              <option value="Şube">Banka Şubesi</option>
              <option value="Veri Merkezi">Veri Merkezi / IT</option>
              <option value="Genel Müdürlük">Genel Müdürlük Binası</option>
              <option value="Depo">Lojistik / Depo</option>
            </select>
            <input required type="text" placeholder="Şehir" value={city} onChange={e => setCity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500" />
          </div>

          {/* Drag-Drop Fotoğraf Alanı */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-600 mb-2">Tesis Fotoğrafı <span className="font-normal text-slate-400">(opsiyonel)</span></p>

            {fotoOnizleme ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoOnizleme} alt="Önizleme" className="w-full h-full object-cover" />
                <button type="button" onClick={fotoKaldir}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors">
                  <X className="w-4 h-4 text-red-500" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                  {fotoFile?.name}
                </div>
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setSurukleniyorMu(true) }}
                onDragLeave={() => setSurukleniyorMu(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  surukleniyorMu ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}>
                <div className={`p-2 rounded-full ${surukleniyorMu ? 'bg-blue-100' : 'bg-slate-100'}`}>
                  <Image className={`w-5 h-5 ${surukleniyorMu ? 'text-blue-500' : 'text-slate-400'}`} />
                </div>
                <p className="text-sm text-slate-500">
                  {surukleniyorMu ? 'Bırakın!' : 'Fotoğraf sürükleyin veya tıklayın'}
                </p>
                <p className="text-xs text-slate-400">PNG, JPG, WEBP · Maks 5MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) secFoto(f) }} />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setShowForm(false); fotoKaldir() }}
              className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg">İptal</button>
            <button type="submit" disabled={fotoYukleniyor}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2">
              {fotoYukleniyor ? (<><Upload className="w-4 h-4 animate-bounce" /> Yükleniyor...</>) : 'Kaydet'}
            </button>
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
          facilities.map(fac => {
            // Signed URL varsa göster; yoksa placeholder
            const gorselUrl = signedUrls[fac.id] ?? null
            return (
              <div key={fac.id} className="bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all hover:border-blue-200 group cursor-pointer overflow-hidden">
                {/* Tesis fotoğrafı — signed URL ile */}
                {gorselUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={gorselUrl} alt={fac.name} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-slate-300" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-blue-50 transition-colors">
                      {getIcon(fac.type)}
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {fac.status ?? 'Aktif'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{fac.name}</h3>
                  <p className="text-sm font-semibold text-blue-600 mb-3">{fac.type}</p>
                  <div className="flex items-center gap-2 text-slate-500 text-sm pt-3 border-t border-slate-100">
                    <MapPin className="w-4 h-4" /> {fac.city}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
