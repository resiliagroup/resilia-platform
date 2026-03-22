export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqguwgbopgnpwzjwcexl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    // 1. Sisteme öğreteceğimiz ÖRNEK MEVZUAT METNİ
    const sampleText = "BDDK Madde 23: Bankalar ve finansal kuruluşlar, kesintiye tahammülü olmayan kritik IT ve operasyon merkezleri için (Kapasite skoru düşükse) en az 48 saat tam yükte çalışabilecek yedek jeneratör ve yakıt rezervine sahip olmak zorundadır.";

    // 2. Nomic modeline metni verip, matematiksel "Vektör" karşılığını alıyoruz
    const embedResponse = await fetch('http://127.0.0.1:11434/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        prompt: sampleText,
      }),
    });

    const embedData = await embedResponse.json();
    const embedding = embedData.embedding;

    // 3. Çıkan vektörü ve metni Supabase'deki Hafıza (knowledge_base) tablomuza yazıyoruz
    const { error } = await supabase
      .from('knowledge_base')
      .insert([
        {
          title: 'BDDK Kritik Altyapı Tebliği',
          content: sampleText,
          metadata: { sector: 'Banking', type: 'Regulation' },
          embedding: embedding
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ 
      status: 'Başarılı!', 
      message: 'Mevzuat vektöre çevrildi ve Supabase yapay zeka hafızasına başarıyla kaydedildi.',
      vector_size: embedding.length // 768 boyutlu bir koordinat olmalı
    });

  } catch (error) {
    console.error("Vektör Kayıt Hatası:", error);
    return NextResponse.json({ error: 'Mevzuat hafızaya yazılamadı.' }, { status: 500 });
  }
}