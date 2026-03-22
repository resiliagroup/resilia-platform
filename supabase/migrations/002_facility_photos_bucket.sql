-- ============================================================
-- Sprint 2: facility-photos Supabase Storage bucket
-- Supabase Dashboard > Storage > New Bucket veya SQL Editor
-- ============================================================

-- Bucket oluştur (Supabase Dashboard > Storage > New Bucket)
-- Name: facility-photos
-- Public: true (okuma herkese açık)

-- SQL ile bucket oluştur:
INSERT INTO storage.buckets (id, name, public)
VALUES ('facility-photos', 'facility-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS politikaları
CREATE POLICY "Herkes okuyabilir"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'facility-photos');

CREATE POLICY "Kimliği doğrulanmış yükleyebilir"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'facility-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Kimliği doğrulanmış güncelleyebilir"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'facility-photos' AND auth.role() = 'authenticated');

-- facilities tablosuna photo_url kolonu ekle
ALTER TABLE public.facilities
  ADD COLUMN IF NOT EXISTS photo_url TEXT;
