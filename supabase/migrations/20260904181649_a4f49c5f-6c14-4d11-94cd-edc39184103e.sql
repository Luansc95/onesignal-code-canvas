
-- 1) Revoke execute on internal-only security definer functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_pending_role(text, public.app_role) FROM authenticated;

-- 2) Guard public inserts: reset internal fields + basic validation
CREATE OR REPLACE FUNCTION public.guard_public_lead_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_any_role(ARRAY['admin','commercial','marketing']::public.app_role[]) THEN
    NEW.status := 'new';
    NEW.priority := NULL;
    NEW.score := NULL;
    NEW.score_factors := NULL;
    NEW.internal_notes := NULL;
    NEW.notes := NULL;
    NEW.assigned_to := NULL;
    NEW.next_follow_up_at := NULL;
    NEW.estimated_value := NULL;
    NEW.proposal_value := NULL;
    NEW.closed_value := NULL;
    NEW.revenue := NULL;
  END IF;

  IF length(NEW.name) > 200 OR length(NEW.company) > 200 OR length(NEW.email) > 320
     OR length(NEW.whatsapp) > 40 OR length(NEW.project_description) > 5000 THEN
    RAISE EXCEPTION 'Dados do formulário excedem o tamanho permitido.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_guard_public_insert ON public.leads;
CREATE TRIGGER leads_guard_public_insert
BEFORE INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.guard_public_lead_insert();

CREATE OR REPLACE FUNCTION public.guard_public_contact_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_any_role(ARRAY['admin','commercial','marketing']::public.app_role[]) THEN
    NEW.status := 'new';
    NEW.lead_id := NULL;
  END IF;

  IF length(NEW.name) > 200 OR length(NEW.company) > 200 OR length(NEW.email) > 320
     OR length(NEW.whatsapp) > 40 OR length(NEW.message) > 5000
     OR length(COALESCE(NEW.subject, '')) > 300 THEN
    RAISE EXCEPTION 'Dados do formulário excedem o tamanho permitido.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contacts_guard_public_insert ON public.contacts;
CREATE TRIGGER contacts_guard_public_insert
BEFORE INSERT ON public.contacts
FOR EACH ROW EXECUTE FUNCTION public.guard_public_contact_insert();

CREATE OR REPLACE FUNCTION public.guard_public_diagnostic_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_any_role(ARRAY['admin','commercial','marketing']::public.app_role[]) THEN
    NEW.lead_id := NULL;
  END IF;

  IF NEW.score < 0 OR NEW.score > 100 OR NEW.maturity_percentage < 0 OR NEW.maturity_percentage > 100 THEN
    RAISE EXCEPTION 'Valores de diagnóstico inválidos.';
  END IF;

  IF length(COALESCE(NEW.summary_text, '')) > 5000 THEN
    RAISE EXCEPTION 'Resumo do diagnóstico excede o tamanho permitido.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS diagnostics_guard_public_insert ON public.diagnostics;
CREATE TRIGGER diagnostics_guard_public_insert
BEFORE INSERT ON public.diagnostics
FOR EACH ROW EXECUTE FUNCTION public.guard_public_diagnostic_insert();

CREATE OR REPLACE FUNCTION public.guard_public_diagnostic_answer_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF length(NEW.question_key) > 200 OR length(COALESCE(NEW.question_label, '')) > 500
     OR length(COALESCE(NEW.answer_value, '')) > 2000 THEN
    RAISE EXCEPTION 'Resposta do diagnóstico excede o tamanho permitido.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS diagnostic_answers_guard_public_insert ON public.diagnostic_answers;
CREATE TRIGGER diagnostic_answers_guard_public_insert
BEFORE INSERT ON public.diagnostic_answers
FOR EACH ROW EXECUTE FUNCTION public.guard_public_diagnostic_answer_insert();

CREATE OR REPLACE FUNCTION public.guard_public_analytics_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF length(NEW.event_name) > 100 OR length(NEW.visitor_id) > 100 OR length(NEW.session_id) > 100
     OR length(COALESCE(NEW.page_url, '')) > 2000 OR length(COALESCE(NEW.referrer, '')) > 2000
     OR length(COALESCE(NEW.landing_page, '')) > 2000 THEN
    RAISE EXCEPTION 'Evento de analytics excede o tamanho permitido.';
  END IF;

  IF NEW.occurred_at > now() + interval '1 day' THEN
    NEW.occurred_at := now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS analytics_events_guard_public_insert ON public.analytics_events;
CREATE TRIGGER analytics_events_guard_public_insert
BEFORE INSERT ON public.analytics_events
FOR EACH ROW EXECUTE FUNCTION public.guard_public_analytics_insert();

-- 3) Storage: only images of published projects are publicly readable
CREATE OR REPLACE FUNCTION public.storage_object_is_published(_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.project_images pi
    JOIN public.projects p ON p.id = pi.project_id
    WHERE p.is_published = true
      AND p.status = 'published'
      AND pi.image_url LIKE '%' || _name
  ) OR EXISTS (
    SELECT 1
    FROM public.projects p
    WHERE p.is_published = true
      AND p.status = 'published'
      AND p.cover_image LIKE '%' || _name
  )
$$;

REVOKE EXECUTE ON FUNCTION public.storage_object_is_published(text) FROM public;
GRANT EXECUTE ON FUNCTION public.storage_object_is_published(text) TO anon, authenticated, service_role;

DROP POLICY IF EXISTS project_images_public_read_objects ON storage.objects;
CREATE POLICY project_images_public_read_objects
ON storage.objects FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'project-images'
  AND public.storage_object_is_published(name)
);

DROP POLICY IF EXISTS project_images_staff_read_objects ON storage.objects;
CREATE POLICY project_images_staff_read_objects
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-images'
  AND public.has_any_role(ARRAY['admin','editor']::public.app_role[])
);
