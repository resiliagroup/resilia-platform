-- ============================================================
-- Migration 003: Tenant bazlı RLS izolasyonu
-- assessments · bia_assessments · bcp_plans · crisis_events · vendors
-- Supabase SQL Editor'da çalıştır
-- ============================================================

-- ── Yardımcı fonksiyon: mevcut kullanıcının tenant_id'sini döndür ─────────
-- SECURITY DEFINER ile çalışır; döngüsel RLS sorgusunu önler.
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT tenant_id
  FROM   public.profiles
  WHERE  id = auth.uid()
  LIMIT  1
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. assessments
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assessments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  facility_id UUID,
  sector      TEXT,
  uri_score   NUMERIC,
  extra_data  JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "assessments_tenant_select" ON public.assessments;
DROP POLICY IF EXISTS "assessments_tenant_insert" ON public.assessments;
DROP POLICY IF EXISTS "assessments_tenant_update" ON public.assessments;
DROP POLICY IF EXISTS "assessments_tenant_delete" ON public.assessments;

CREATE POLICY "assessments_tenant_select"
  ON public.assessments FOR SELECT
  USING (tenant_id = public.current_tenant_id());

CREATE POLICY "assessments_tenant_insert"
  ON public.assessments FOR INSERT
  WITH CHECK (tenant_id = public.current_tenant_id());

CREATE POLICY "assessments_tenant_update"
  ON public.assessments FOR UPDATE
  USING (tenant_id = public.current_tenant_id());

CREATE POLICY "assessments_tenant_delete"
  ON public.assessments FOR DELETE
  USING (tenant_id = public.current_tenant_id());

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. bia_assessments
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bia_assessments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  facility_id UUID,
  surecler    JSONB,
  mtpd        NUMERIC,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bia_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bia_tenant_select" ON public.bia_assessments;
DROP POLICY IF EXISTS "bia_tenant_insert" ON public.bia_assessments;
DROP POLICY IF EXISTS "bia_tenant_update" ON public.bia_assessments;
DROP POLICY IF EXISTS "bia_tenant_delete" ON public.bia_assessments;

CREATE POLICY "bia_tenant_select"
  ON public.bia_assessments FOR SELECT
  USING (tenant_id = public.current_tenant_id());

CREATE POLICY "bia_tenant_insert"
  ON public.bia_assessments FOR INSERT
  WITH CHECK (tenant_id = public.current_tenant_id());

CREATE POLICY "bia_tenant_update"
  ON public.bia_assessments FOR UPDATE
  USING (tenant_id = public.current_tenant_id());

CREATE POLICY "bia_tenant_delete"
  ON public.bia_assessments FOR DELETE
  USING (tenant_id = public.current_tenant_id());

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. bcp_plans
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bcp_plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  ad          TEXT,
  senaryolar  JSONB,
  rto_calismalari JSONB,
  tatbikatlar JSONB,
  version     INTEGER DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bcp_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bcp_tenant_select" ON public.bcp_plans;
DROP POLICY IF EXISTS "bcp_tenant_insert" ON public.bcp_plans;
DROP POLICY IF EXISTS "bcp_tenant_update" ON public.bcp_plans;
DROP POLICY IF EXISTS "bcp_tenant_delete" ON public.bcp_plans;

CREATE POLICY "bcp_tenant_select"
  ON public.bcp_plans FOR SELECT
  USING (tenant_id = public.current_tenant_id());

CREATE POLICY "bcp_tenant_insert"
  ON public.bcp_plans FOR INSERT
  WITH CHECK (tenant_id = public.current_tenant_id());

CREATE POLICY "bcp_tenant_update"
  ON public.bcp_plans FOR UPDATE
  USING (tenant_id = public.current_tenant_id());

CREATE POLICY "bcp_tenant_delete"
  ON public.bcp_plans FOR DELETE
  USING (tenant_id = public.current_tenant_id());

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. crisis_events
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crisis_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  ad          TEXT,
  durum       TEXT DEFAULT 'normal',
  baslangic   TIMESTAMPTZ,
  bitis       TIMESTAMPTZ,
  gorevler    JSONB,
  kararlar    JSONB,
  aar_bulgular JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.crisis_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crisis_tenant_select" ON public.crisis_events;
DROP POLICY IF EXISTS "crisis_tenant_insert" ON public.crisis_events;
DROP POLICY IF EXISTS "crisis_tenant_update" ON public.crisis_events;
DROP POLICY IF EXISTS "crisis_tenant_delete" ON public.crisis_events;

CREATE POLICY "crisis_tenant_select"
  ON public.crisis_events FOR SELECT
  USING (tenant_id = public.current_tenant_id());

CREATE POLICY "crisis_tenant_insert"
  ON public.crisis_events FOR INSERT
  WITH CHECK (tenant_id = public.current_tenant_id());

CREATE POLICY "crisis_tenant_update"
  ON public.crisis_events FOR UPDATE
  USING (tenant_id = public.current_tenant_id());

CREATE POLICY "crisis_tenant_delete"
  ON public.crisis_events FOR DELETE
  USING (tenant_id = public.current_tenant_id());

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. vendors
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vendors (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL,
  ad                  TEXT NOT NULL,
  kategori            TEXT,
  ulke                TEXT,
  sehir               TEXT,
  kritiklik           TEXT CHECK (kritiklik IN ('kritik','yüksek','orta','düşük')),
  durum               TEXT DEFAULT 'aktif',
  yillik_sozlesme     NUMERIC,
  tek_kaynak          BOOLEAN DEFAULT false,
  son_denetim         DATE,
  bddk_bildirimi      BOOLEAN DEFAULT false,
  notlar              TEXT,
  risk_skoru          NUMERIC,
  created_at          TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vendors_tenant_select" ON public.vendors;
DROP POLICY IF EXISTS "vendors_tenant_insert" ON public.vendors;
DROP POLICY IF EXISTS "vendors_tenant_update" ON public.vendors;
DROP POLICY IF EXISTS "vendors_tenant_delete" ON public.vendors;

CREATE POLICY "vendors_tenant_select"
  ON public.vendors FOR SELECT
  USING (tenant_id = public.current_tenant_id());

CREATE POLICY "vendors_tenant_insert"
  ON public.vendors FOR INSERT
  WITH CHECK (tenant_id = public.current_tenant_id());

CREATE POLICY "vendors_tenant_update"
  ON public.vendors FOR UPDATE
  USING (tenant_id = public.current_tenant_id());

CREATE POLICY "vendors_tenant_delete"
  ON public.vendors FOR DELETE
  USING (tenant_id = public.current_tenant_id());

-- ─────────────────────────────────────────────────────────────────────────────
-- facilities tablosuna da tenant izolasyonu ekle (varsa)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE IF EXISTS public.facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "facilities_tenant_select" ON public.facilities;
DROP POLICY IF EXISTS "facilities_tenant_insert" ON public.facilities;
DROP POLICY IF EXISTS "facilities_tenant_update" ON public.facilities;
DROP POLICY IF EXISTS "facilities_tenant_delete" ON public.facilities;

CREATE POLICY "facilities_tenant_select"
  ON public.facilities FOR SELECT
  USING (
    tenant_name IN (
      SELECT t.name FROM public.tenants t
      JOIN   public.profiles p ON p.tenant_id = t.id
      WHERE  p.id = auth.uid()
    )
    OR tenant_id = public.current_tenant_id()
  );

CREATE POLICY "facilities_tenant_insert"
  ON public.facilities FOR INSERT
  WITH CHECK (tenant_id = public.current_tenant_id());

CREATE POLICY "facilities_tenant_update"
  ON public.facilities FOR UPDATE
  USING (tenant_id = public.current_tenant_id());

CREATE POLICY "facilities_tenant_delete"
  ON public.facilities FOR DELETE
  USING (tenant_id = public.current_tenant_id());

-- ─────────────────────────────────────────────────────────────────────────────
-- İndeksler — tenant_id sorgularını hızlandırır
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_assessments_tenant     ON public.assessments     (tenant_id);
CREATE INDEX IF NOT EXISTS idx_bia_assessments_tenant ON public.bia_assessments (tenant_id);
CREATE INDEX IF NOT EXISTS idx_bcp_plans_tenant       ON public.bcp_plans       (tenant_id);
CREATE INDEX IF NOT EXISTS idx_crisis_events_tenant   ON public.crisis_events   (tenant_id);
CREATE INDEX IF NOT EXISTS idx_vendors_tenant         ON public.vendors         (tenant_id);
