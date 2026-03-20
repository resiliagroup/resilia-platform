export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Sizin hazırladığınız muazzam ARES Knowledge Graph (Bilgi Grafiği) Verisi
    const disasterGraph = {
      "Disaster_Knowledge_Graph": {
        "Nodes": [
          {
            "ID": "INF-104", "Label": "Kritik_Altyapi",
            "Properties": { "Name": "Kavaklı Ana Trafo Merkezi", "Type": "Elektrik", "Elevation_m": 2.5, "HFE_Fragility_Score": 82 }
          },
          {
            "ID": "POP-089", "Label": "Hassas_Nufus",
            "Properties": { "Name": "Beylikdüzü Devlet Hastanesi", "Capacity": 400, "Critical_Patients": 45 }
          },
          {
            "ID": "REG-023", "Label": "Mevzuat",
            "Properties": { "Source": "AFAD TAMP", "Article": "Madde 14.2", "Requirement": "Kritik sağlık tesislerinin enerjisi 2 saatten fazla kesilemez." }
          },
          {
            "ID": "HAZ-001", "Label": "Tehlike_Olayi",
            "Properties": { "Type": "Sel ve Taşkın", "Current_Severity": "Kritik", "Predicted_Water_Level_m": 3.1 }
          }
        ],
        "Edges": [
          { "Source": "HAZ-001", "Target": "INF-104", "Relation": "THREATENS", "Weight": 0.95, "AI_Context": "Su seviyesi (3.1m), trafonun yüksekliğini (2.5m) aşıyor." },
          { "Source": "INF-104", "Target": "POP-089", "Relation": "POWERS", "Criticality": "High" },
          { "Source": "REG-023", "Target": "POP-089", "Relation": "PROTECTS" }
        ]
      }
    };

    // Llama 3'e veriyi nasıl "Zincirleme (Reasoning)" okuması gerektiğini öğretiyoruz
    const prompt = `Sen ARES (Urban Resilience OS) platformunun Yapay Zeka Olay Komutanısın.
    Aşağıdaki JSON formatındaki "Kentsel Bilgi Grafiği (Knowledge Graph)" verisini analiz et.
    Grafikte düğümler (Nodes) ve bu düğümlerin birbiriyle nasıl etkileşime girdiği (Edges) verilmiştir.
    
    GRAFİK VERİSİ:
    ${JSON.stringify(disasterGraph, null, 2)}
    
    GÖREV:
    Bu zincirleme ilişkiyi analiz et. Selin (HAZ-001) kimi etkileyeceğini (Edges üzerinden) bul, hastanedeki durumu (POP-089) hesapla ve mevzuata (REG-023) dayanarak Belediye Başkanına ACİL BİR EYLEM PLANI yaz.
    Yazın son derece resmi, kısa ve doğrudan askeri/kriz formatında olsun. Yalnızca TÜRKÇE kullan.`;

    // Local Ollama (Llama 3) bağlantısı
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model: 'llama3', 
        prompt: prompt, 
        stream: false 
      }),
    });

    const data = await response.json();
    return NextResponse.json({ result: data.response });

  } catch (error) {
    console.error('AI Graph Hatası:', error);
    return NextResponse.json({ error: 'GraphRAG analizi başarısız oldu.' }, { status: 500 });
  }
}