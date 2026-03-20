export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder-key-000");

export async function POST(request: Request) {
  try {
    const { hScore, fScore, eScore, tenant } = await request.json();

    // 1. ADIM: DURUMU ANLA VE VEKTÖRE ÇEVİR (Nomic Modeli)
    // Kapasite skoru düşükse, sisteme "Kapasite eksikliği ve yedekleme" konusunu aratıyoruz
    const searchQuery = `Kapasite eksikliği, kritik altyapı ve yedek jeneratör gereksinimleri`;
    
    const embedResponse = await fetch('http://127.0.0.1:11434/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'nomic-embed-text', prompt: searchQuery }),
    });
    
    const embedData = await embedResponse.json();
    const queryEmbedding = embedData.embedding;

    // 2. ADIM: SUPABASE HAFIZASINDA MEVZUAT ARA (RAG Eşleşmesi)
    let contextText = "Özel bir mevzuat bulunamadı. Genel BCM prensiplerine göre hareket et.";
    
    if (supabaseUrl) {
      const { data: documents, error: matchError } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5, // %50 ve üzeri benzerlikte olanları getir
        match_count: 1 // En alakalı 1 mevzuatı getir
      });

      if (!matchError && documents && documents.length > 0) {
        // Eşleşen mevzuatı bulduk! (Bizim yüklediğimiz BDDK maddesi gelecek)
        contextText = `İLGİLİ MEVZUAT (${documents[0].title}): ${documents[0].content}`;
      }
    }

    // 3. ADIM: LLAMA 3'E MEVZUATLI (AKILLI) PROMPT GÖNDER
    const prompt = `Sen ${tenant} için çalışan bir İş Sürekliliği (BCM) ve Mevzuat Uzmanısın. 
    Aşağıdaki HFE skorlarını ve SANA VERİLEN RESMİ MEVZUATI kullanarak kurumsal bir eylem planı yaz.
    
    Skorlar: Tehlike(H):${hScore}/100, Kırılganlık(F):${fScore}/100, Kapasite(E):${eScore}/100
    
    ${contextText}
    
    KURALLAR:
    1. YALNIZCA TÜRKÇE yaz.
    2. Raporunda mutlaka yukarıdaki "İLGİLİ MEVZUAT" kısmına atıfta bulun (Örn: "... tebliği/maddesi gereğince...").
    3. Resmi ve otoriter bir dil kullan.`;

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3', prompt: prompt, stream: false }),
    });

    const data = await response.json();
    const aiReport = data.response;

    // 4. ADIM: SONUCU ARŞİVE KAYDET
    if (supabaseUrl && supabaseAnonKey) {
      await supabase.from('ai_reports').insert([{
        tenant_name: tenant, h_score: hScore, f_score: fScore, e_score: eScore, ai_response: aiReport
      }]);
    }

    return NextResponse.json({ report: aiReport });

  } catch (error) {
    console.error('Sistem Hatası:', error);
    return NextResponse.json({ report: 'Yapay zeka bağlantısı kurulamadı.' }, { status: 500 });
  }
}