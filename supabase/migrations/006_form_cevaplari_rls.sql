-- ============================================================
-- 006_form_cevaplari_rls.sql
-- form_cevaplari tablosunda RLS'i devre dışı bırak
-- Supabase SQL Editor'da çalıştır.
-- ============================================================

ALTER TABLE public.form_cevaplari DISABLE ROW LEVEL SECURITY;
