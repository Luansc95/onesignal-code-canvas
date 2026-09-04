
REVOKE EXECUTE ON FUNCTION public.guard_public_lead_insert() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_public_contact_insert() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_public_diagnostic_insert() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_public_diagnostic_answer_insert() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_public_analytics_insert() FROM public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.storage_object_is_published(_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
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
