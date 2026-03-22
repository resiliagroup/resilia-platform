export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550'
);

export async function POST(request: Request) {
  try {
    // 1. Arayüzden gelen başlık, içerik ve kategori bilgilerini alıyoruz
    const { title, content, sector } = await request.json();

    // 2. Metni Nomic modeli ile okutup matematiksel vektöre çeviriyoruz
    const embedResponse = await fetch('http://127.0.0.1:11434/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'nomic-embed-text', prompt: content }),
    });
    
    const embedData = await embedResponse.json();
    const embedding = embedData.embedding;

    // 3. Vektörü ve metni Supabase'deki "knowledge_base" hafızasına yazıyoruz
    const { error } = await supabase.from('knowledge_base').insert([
      { title, content, metadata: { sector }, embedding }
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Bilgi başarıyla yapay zeka hafızasına eklendi.' });

  } catch (error) {
    console.error("Öğretme Hatası:", error);
    return NextResponse.json({ error: 'Yapay zekaya öğretilirken bir hata oluştu.' }, { status: 500 });
  }
}