-- ============================================================
-- 005_demo_assessments.sql
-- Beylikdüzü tenant için form_cevaplari demo verileri
-- tenant_id: 11111111-0000-0000-0000-000000000001
-- Supabase SQL Editor'da çalıştır.
-- ============================================================

INSERT INTO public.form_cevaplari
  (id, tenant_id, birim_kodu, senaryo, puanlar, dayaniklilik_skoru, h_skoru, f_skoru, e_skoru, durum, dolduran_email, inceleme_notu, olusturulma, gonderilme, sektor, il_adi)
VALUES

-- 1. Kritik — Bankacılık — gönderildi
(
  gen_random_uuid(),
  '11111111-0000-0000-0000-000000000001',
  'AKB-0042',
  'deprem',
  '{"yapi":1,"enerji":2,"bdt":1,"personel":2,"iletisim":1}'::jsonb,
  22, 1.8, 2.1, 1.5,
  'gonderildi',
  'sube@akbank.com',
  NULL,
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '8 days',
  'bankacilik',
  'İstanbul'
),

-- 2. Kritik — Sağlık — incelendi
(
  gen_random_uuid(),
  '11111111-0000-0000-0000-000000000001',
  'MP-001',
  'deprem',
  '{"yapi":2,"enerji":1,"bdt":2,"personel":1,"iletisim":2}'::jsonb,
  31, 2.1, 1.7, 2.0,
  'incelendi',
  'tesis@medicalpark.com',
  'Jeneratör kapasitesi yetersiz. Acil yatırım gerekli.',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '14 days',
  'saglik',
  'İstanbul'
),

-- 3. Orta — Bankacılık — gönderildi
(
  gen_random_uuid(),
  '11111111-0000-0000-0000-000000000001',
  'AKB-0078',
  'sel',
  '{"yapi":3,"enerji":3,"bdt":2,"personel":3,"iletisim":2}'::jsonb,
  48, 2.8, 3.1, 2.5,
  'gonderildi',
  'sube2@akbank.com',
  NULL,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days',
  'bankacilik',
  'İstanbul'
),

-- 4. Orta — Sanayi — gönderildi
(
  gen_random_uuid(),
  '11111111-0000-0000-0000-000000000001',
  'GOSB-0011',
  'yangin',
  '{"yapi":3,"enerji":2,"bdt":3,"personel":3,"iletisim":3}'::jsonb,
  55, 3.2, 2.8, 3.0,
  'gonderildi',
  'fabrika@gebzeosb.com',
  NULL,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days',
  'uretim',
  'Kocaeli'
),

-- 5. Orta — Sağlık — incelendi
(
  gen_random_uuid(),
  '11111111-0000-0000-0000-000000000001',
  'MP-003',
  'deprem',
  '{"yapi":3,"enerji":3,"bdt":3,"personel":2,"iletisim":3}'::jsonb,
  61, 3.5, 3.0, 3.2,
  'incelendi',
  'tesis3@medicalpark.com',
  'BDT planı güncellendi. Bir sonraki tatbikatta test edilecek.',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '19 days',
  'saglik',
  'İstanbul'
),

-- 6. Güçlü — Bankacılık — gönderildi
(
  gen_random_uuid(),
  '11111111-0000-0000-0000-000000000001',
  'AKB-GM-01',
  'deprem',
  '{"yapi":4,"enerji":4,"bdt":4,"personel":4,"iletisim":4}'::jsonb,
  74, 4.2, 4.0, 4.1,
  'gonderildi',
  'uzman@akbank.com',
  NULL,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days',
  'bankacilik',
  'İstanbul'
),

-- 7. Güçlü — Sanayi — incelendi
(
  gen_random_uuid(),
  '11111111-0000-0000-0000-000000000001',
  'GOSB-HQ',
  'deprem',
  '{"yapi":4,"enerji":5,"bdt":4,"personel":4,"iletisim":5}'::jsonb,
  82, 4.6, 4.8, 4.5,
  'incelendi',
  'izleme@isoistanbul.com',
  'Tüm sistemler standartları karşılıyor. Yıllık revizyona dahil.',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '29 days',
  'uretim',
  'İstanbul'
),

-- 8. Kritik — Sanayi — taslak
(
  gen_random_uuid(),
  '11111111-0000-0000-0000-000000000001',
  'GOSB-0044',
  'yangin',
  '{"yapi":1,"enerji":1,"bdt":1,"personel":1,"iletisim":2}'::jsonb,
  20, 1.2, 1.4, 1.3,
  'taslak',
  'fabrika2@gebzeosb.com',
  NULL,
  NOW() - INTERVAL '1 day',
  NULL,
  'uretim',
  'Kocaeli'
),

-- 9. Orta — Bankacılık — taslak
(
  gen_random_uuid(),
  '11111111-0000-0000-0000-000000000001',
  'AKB-0099',
  'sel',
  '{"yapi":2,"enerji":3,"bdt":2,"personel":3,"iletisim":2}'::jsonb,
  44, 2.5, 3.2, 2.8,
  'taslak',
  'sube3@akbank.com',
  NULL,
  NOW() - INTERVAL '6 hours',
  NULL,
  'bankacilik',
  'İstanbul'
),

-- 10. Güçlü — Sağlık — incelendi
(
  gen_random_uuid(),
  '11111111-0000-0000-0000-000000000001',
  'MP-HQ',
  'deprem',
  '{"yapi":5,"enerji":4,"bdt":5,"personel":4,"iletisim":5}'::jsonb,
  85, 4.8, 4.5, 4.9,
  'incelendi',
  'board@medicalpark.com',
  'En yüksek skor. Diğer tesislere referans model olarak paylaşıldı.',
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '44 days',
  'saglik',
  'İstanbul'
);
