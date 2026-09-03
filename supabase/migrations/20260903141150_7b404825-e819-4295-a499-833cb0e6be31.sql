-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin','editor','commercial','marketing');
CREATE TYPE public.lead_status AS ENUM ('new','analyzing','contacted','negotiating','converted','lost','archived');
CREATE TYPE public.lead_priority AS ENUM ('high','medium','low');
CREATE TYPE public.project_status AS ENUM ('published','draft','archived','completed','in_development');
CREATE TYPE public.contact_status AS ENUM ('new','read','replied','converted');

-- ============ SHARED FUNCTIONS ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_roles public.app_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = ANY(_roles)
  )
$$;

-- profiles policies
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- user_roles policies
CREATE POLICY "user_roles_select_own_or_admin" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "user_roles_admin_manage" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ PROJECTS ============
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'web',
  category_label TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  challenge TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  results JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_placeholder_type TEXT NOT NULL DEFAULT 'dashboard',
  accent_color TEXT NOT NULL DEFAULT '#22D3EE',
  cover_image TEXT,
  demo_url TEXT,
  client_type TEXT NOT NULL DEFAULT '',
  client_name TEXT,
  year TEXT NOT NULL DEFAULT '',
  project_type TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  status public.project_status NOT NULL DEFAULT 'draft',
  is_published BOOLEAN NOT NULL DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_public_read_published" ON public.projects
  FOR SELECT TO anon, authenticated
  USING (is_published = true AND status = 'published');
CREATE POLICY "projects_staff_read_all" ON public.projects
  FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin','editor','commercial','marketing']::public.app_role[]));
CREATE POLICY "projects_staff_write" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (public.has_any_role(ARRAY['admin','editor']::public.app_role[]));
CREATE POLICY "projects_staff_update" ON public.projects
  FOR UPDATE TO authenticated
  USING (public.has_any_role(ARRAY['admin','editor']::public.app_role[]))
  WITH CHECK (public.has_any_role(ARRAY['admin','editor']::public.app_role[]));
CREATE POLICY "projects_admin_delete" ON public.projects
  FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_projects_published ON public.projects (is_published, status);
CREATE INDEX idx_projects_category ON public.projects (category);

-- ============ PROJECT IMAGES ============
CREATE TABLE public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.project_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_images TO authenticated;
GRANT ALL ON public.project_images TO service_role;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_images_public_read" ON public.project_images
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id AND p.is_published = true AND p.status = 'published'
  ));
CREATE POLICY "project_images_staff_read" ON public.project_images
  FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin','editor','commercial','marketing']::public.app_role[]));
CREATE POLICY "project_images_staff_manage" ON public.project_images
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin','editor']::public.app_role[]))
  WITH CHECK (public.has_any_role(ARRAY['admin','editor']::public.app_role[]));

CREATE TRIGGER project_images_set_updated_at
  BEFORE UPDATE ON public.project_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_project_images_project ON public.project_images (project_id, sort_order);

-- ============ LEADS ============
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL DEFAULT '',
  solution_type TEXT NOT NULL DEFAULT '',
  project_description TEXT NOT NULL DEFAULT '',
  budget_range TEXT,
  desired_timeline TEXT,
  found_us_via TEXT,
  preferred_contact_method TEXT,
  source TEXT NOT NULL DEFAULT 'site',
  page_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  first_touch JSONB,
  last_touch JSONB,
  referrer TEXT,
  landing_page TEXT,
  visitor_id TEXT,
  session_id TEXT,
  status public.lead_status NOT NULL DEFAULT 'new',
  priority public.lead_priority,
  score INTEGER,
  score_factors JSONB,
  notes TEXT,
  internal_notes TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  next_follow_up_at TIMESTAMPTZ,
  estimated_value NUMERIC(12,2),
  proposal_value NUMERIC(12,2),
  closed_value NUMERIC(12,2),
  revenue NUMERIC(12,2),
  lgpd_consent BOOLEAN NOT NULL DEFAULT false,
  diagnostic_completed BOOLEAN NOT NULL DEFAULT false,
  digital_maturity TEXT,
  diagnostic_score INTEGER,
  identified_challenges TEXT[],
  recommended_solutions TEXT[],
  diagnostic_answers JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_public_insert" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "leads_staff_read" ON public.leads
  FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin','commercial','marketing']::public.app_role[]));
CREATE POLICY "leads_staff_update" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.has_any_role(ARRAY['admin','commercial']::public.app_role[]))
  WITH CHECK (public.has_any_role(ARRAY['admin','commercial']::public.app_role[]));
CREATE POLICY "leads_admin_delete" ON public.leads
  FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX idx_leads_status ON public.leads (status);
CREATE INDEX idx_leads_priority ON public.leads (priority);
CREATE INDEX idx_leads_email ON public.leads (lower(email));

-- ============ LEAD ACTIVITIES ============
CREATE TABLE public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Sistema',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.lead_activities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_activities TO authenticated;
GRANT ALL ON public.lead_activities TO service_role;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_activities_public_insert" ON public.lead_activities
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "lead_activities_staff_read" ON public.lead_activities
  FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin','commercial','marketing']::public.app_role[]));
CREATE POLICY "lead_activities_admin_delete" ON public.lead_activities
  FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE INDEX idx_lead_activities_lead ON public.lead_activities (lead_id, created_at DESC);

-- ============ CONTACTS ============
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL DEFAULT '',
  subject TEXT,
  message TEXT NOT NULL DEFAULT '',
  service_type TEXT,
  source TEXT NOT NULL DEFAULT 'site',
  page_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  status public.contact_status NOT NULL DEFAULT 'new',
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contacts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contacts TO authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contacts_public_insert" ON public.contacts
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "contacts_staff_read" ON public.contacts
  FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin','commercial','marketing']::public.app_role[]));
CREATE POLICY "contacts_staff_update" ON public.contacts
  FOR UPDATE TO authenticated
  USING (public.has_any_role(ARRAY['admin','commercial']::public.app_role[]))
  WITH CHECK (public.has_any_role(ARRAY['admin','commercial']::public.app_role[]));
CREATE POLICY "contacts_admin_delete" ON public.contacts
  FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE TRIGGER contacts_set_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_contacts_created_at ON public.contacts (created_at DESC);
CREATE INDEX idx_contacts_status ON public.contacts (status);

-- ============ DIAGNOSTICS ============
CREATE TABLE public.diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  visitor_id TEXT,
  session_id TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  maturity_level TEXT NOT NULL DEFAULT '',
  maturity_percentage INTEGER NOT NULL DEFAULT 0,
  summary_text TEXT,
  identified_opportunities JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_solutions JSONB NOT NULL DEFAULT '[]'::jsonb,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  landing_page TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.diagnostics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnostics TO authenticated;
GRANT ALL ON public.diagnostics TO service_role;
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "diagnostics_public_insert" ON public.diagnostics
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "diagnostics_staff_read" ON public.diagnostics
  FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin','commercial','marketing']::public.app_role[]));
CREATE POLICY "diagnostics_staff_update" ON public.diagnostics
  FOR UPDATE TO authenticated
  USING (public.has_any_role(ARRAY['admin','commercial','marketing']::public.app_role[]))
  WITH CHECK (public.has_any_role(ARRAY['admin','commercial','marketing']::public.app_role[]));
CREATE POLICY "diagnostics_admin_delete" ON public.diagnostics
  FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE TRIGGER diagnostics_set_updated_at
  BEFORE UPDATE ON public.diagnostics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_diagnostics_created_at ON public.diagnostics (created_at DESC);
CREATE INDEX idx_diagnostics_lead ON public.diagnostics (lead_id);

-- ============ DIAGNOSTIC ANSWERS ============
CREATE TABLE public.diagnostic_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_id UUID NOT NULL REFERENCES public.diagnostics(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  question_label TEXT,
  answer_value TEXT,
  answer_values TEXT[],
  step_number INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.diagnostic_answers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnostic_answers TO authenticated;
GRANT ALL ON public.diagnostic_answers TO service_role;
ALTER TABLE public.diagnostic_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "diagnostic_answers_public_insert" ON public.diagnostic_answers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "diagnostic_answers_staff_read" ON public.diagnostic_answers
  FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin','commercial','marketing']::public.app_role[]));
CREATE POLICY "diagnostic_answers_admin_delete" ON public.diagnostic_answers
  FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE INDEX idx_diagnostic_answers_diagnostic ON public.diagnostic_answers (diagnostic_id);

-- ============ ANALYTICS EVENTS ============
CREATE TABLE public.analytics_events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  page_url TEXT,
  page_path TEXT,
  landing_page TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  device_type TEXT,
  metadata JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.analytics_events TO anon;
GRANT SELECT, INSERT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics_events_public_insert" ON public.analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "analytics_events_staff_read" ON public.analytics_events
  FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin','marketing','commercial']::public.app_role[]));

CREATE INDEX idx_analytics_occurred_at ON public.analytics_events (occurred_at DESC);
CREATE INDEX idx_analytics_event_name ON public.analytics_events (event_name, occurred_at DESC);
CREATE INDEX idx_analytics_visitor ON public.analytics_events (visitor_id);
CREATE INDEX idx_analytics_session ON public.analytics_events (session_id);

-- ============ CAMPAIGNS ============
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  medium TEXT NOT NULL,
  campaign TEXT NOT NULL,
  content TEXT,
  term TEXT,
  target_url TEXT NOT NULL,
  generated_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT ALL ON public.campaigns TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_staff_read" ON public.campaigns
  FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin','marketing','commercial']::public.app_role[]));
CREATE POLICY "campaigns_staff_manage" ON public.campaigns
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin','marketing']::public.app_role[]))
  WITH CHECK (public.has_any_role(ARRAY['admin','marketing']::public.app_role[]));

CREATE TRIGGER campaigns_set_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ NOTIFICATIONS ============
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'system',
  link_url TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.notifications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_public_insert" ON public.notifications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "notifications_staff_read" ON public.notifications
  FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin','editor','commercial','marketing']::public.app_role[]));
CREATE POLICY "notifications_staff_update" ON public.notifications
  FOR UPDATE TO authenticated
  USING (public.has_any_role(ARRAY['admin','editor','commercial','marketing']::public.app_role[]))
  WITH CHECK (public.has_any_role(ARRAY['admin','editor','commercial','marketing']::public.app_role[]));
CREATE POLICY "notifications_admin_delete" ON public.notifications
  FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE TRIGGER notifications_set_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_notifications_created_at ON public.notifications (created_at DESC);

-- ============ AUDIT LOGS ============
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  user_email TEXT,
  user_role public.app_role,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_admin_read" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());
CREATE POLICY "audit_logs_staff_insert" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs (created_at DESC);

-- ============ COMPANY SETTINGS ============
CREATE TABLE public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE,
  company_name TEXT NOT NULL DEFAULT '',
  trading_name TEXT NOT NULL DEFAULT '',
  cnpj TEXT,
  commercial_email TEXT NOT NULL DEFAULT '',
  support_email TEXT NOT NULL DEFAULT '',
  phone_display TEXT NOT NULL DEFAULT '',
  raw_whatsapp_number TEXT NOT NULL DEFAULT '',
  address_display TEXT NOT NULL DEFAULT '',
  business_hours TEXT NOT NULL DEFAULT '',
  instagram TEXT NOT NULL DEFAULT '',
  linkedin TEXT NOT NULL DEFAULT '',
  youtube TEXT,
  github TEXT,
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  notify_on_new_lead BOOLEAN NOT NULL DEFAULT true,
  notify_on_diagnostic BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.company_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.company_settings TO authenticated;
GRANT ALL ON public.company_settings TO service_role;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_settings_public_read" ON public.company_settings
  FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "company_settings_admin_manage" ON public.company_settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE TRIGGER company_settings_set_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ REALTIME ============
ALTER TABLE public.leads REPLICA IDENTITY FULL;
ALTER TABLE public.contacts REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============ STORAGE POLICIES (bucket criado pela ferramenta de storage) ============
CREATE POLICY "project_images_public_read_objects" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-images');
CREATE POLICY "project_images_staff_insert_objects" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND public.has_any_role(ARRAY['admin','editor']::public.app_role[]));
CREATE POLICY "project_images_staff_update_objects" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images' AND public.has_any_role(ARRAY['admin','editor']::public.app_role[]))
  WITH CHECK (bucket_id = 'project-images' AND public.has_any_role(ARRAY['admin','editor']::public.app_role[]));
CREATE POLICY "project_images_staff_delete_objects" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'project-images' AND public.has_any_role(ARRAY['admin','editor']::public.app_role[]));