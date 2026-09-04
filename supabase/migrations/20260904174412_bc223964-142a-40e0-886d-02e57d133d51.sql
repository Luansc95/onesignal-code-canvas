-- 1. admin_users_meta
CREATE TABLE public.admin_users_meta (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  last_sign_in_at timestamptz,
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  deactivated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.admin_users_meta TO authenticated;
GRANT ALL ON public.admin_users_meta TO service_role;

ALTER TABLE public.admin_users_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_users_meta_select_own_or_admin ON public.admin_users_meta
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY admin_users_meta_admin_manage ON public.admin_users_meta
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY admin_users_meta_update_own ON public.admin_users_meta
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE TRIGGER admin_users_meta_set_updated_at
  BEFORE UPDATE ON public.admin_users_meta
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. pending_role_assignments
CREATE TABLE public.pending_role_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  role public.app_role NOT NULL,
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pending_role_assignments TO authenticated;
GRANT ALL ON public.pending_role_assignments TO service_role;

ALTER TABLE public.pending_role_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY pending_role_assignments_admin_read ON public.pending_role_assignments
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE TRIGGER pending_role_assignments_set_updated_at
  BEFORE UPDATE ON public.pending_role_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. handle_new_user: profile + meta + pending role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _pending public.pending_role_assignments%ROWTYPE;
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  SELECT * INTO _pending
  FROM public.pending_role_assignments
  WHERE lower(email) = lower(NEW.email) AND consumed_at IS NULL
  LIMIT 1;

  INSERT INTO public.admin_users_meta (id, invited_by)
  VALUES (NEW.id, _pending.invited_by)
  ON CONFLICT (id) DO NOTHING;

  IF _pending.id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, _pending.role)
    ON CONFLICT (user_id, role) DO NOTHING;

    UPDATE public.pending_role_assignments
    SET consumed_at = now()
    WHERE id = _pending.id;
  END IF;

  RETURN NEW;
END;
$function$;

-- 4. Admin actions (security definer, admin-only, audited)
CREATE OR REPLACE FUNCTION public.audit_admin_action(_action text, _target_type text, _target_id text, _details text, _metadata jsonb DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _p public.profiles%ROWTYPE;
  _role public.app_role;
BEGIN
  SELECT * INTO _p FROM public.profiles WHERE id = auth.uid();
  SELECT role INTO _role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;

  INSERT INTO public.audit_logs (user_id, user_name, user_email, user_role, action, target_type, target_id, details, metadata)
  VALUES (auth.uid(), _p.full_name, _p.email, _role, _action, _target_type, _target_id, _details, _metadata);
END;
$$;

CREATE OR REPLACE FUNCTION public.set_user_role(_user_id uuid, _role public.app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Apenas administradores podem alterar papéis.';
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _user_id AND role <> _role;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;

  PERFORM public.audit_admin_action('role_changed', 'user', _user_id::text, 'Papel alterado para ' || _role::text, NULL);
END;
$$;

CREATE OR REPLACE FUNCTION public.set_user_active(_user_id uuid, _active boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Apenas administradores podem alterar o acesso de usuários.';
  END IF;

  IF _user_id = auth.uid() AND _active = false THEN
    RAISE EXCEPTION 'Não é possível desativar o próprio acesso.';
  END IF;

  INSERT INTO public.admin_users_meta (id, is_active, deactivated_at)
  VALUES (_user_id, _active, CASE WHEN _active THEN NULL ELSE now() END)
  ON CONFLICT (id) DO UPDATE
    SET is_active = EXCLUDED.is_active,
        deactivated_at = EXCLUDED.deactivated_at,
        updated_at = now();

  PERFORM public.audit_admin_action(
    CASE WHEN _active THEN 'user_activated' ELSE 'user_deactivated' END,
    'user', _user_id::text,
    CASE WHEN _active THEN 'Acesso reativado' ELSE 'Acesso desativado' END, NULL);
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_pending_role(_email text, _role public.app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _existing uuid;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Apenas administradores podem convidar usuários.';
  END IF;

  SELECT id INTO _existing FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1;

  IF _existing IS NOT NULL THEN
    PERFORM public.set_user_role(_existing, _role);
    RETURN;
  END IF;

  INSERT INTO public.pending_role_assignments (email, role, invited_by)
  VALUES (lower(_email), _role, auth.uid())
  ON CONFLICT (email) DO UPDATE
    SET role = EXCLUDED.role,
        invited_by = EXCLUDED.invited_by,
        consumed_at = NULL,
        updated_at = now();

  PERFORM public.audit_admin_action('user_invited', 'user', lower(_email), 'Convite com papel ' || _role::text, NULL);
END;
$$;

CREATE OR REPLACE FUNCTION public.touch_last_sign_in()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.admin_users_meta (id, last_sign_in_at)
  VALUES (auth.uid(), now())
  ON CONFLICT (id) DO UPDATE SET last_sign_in_at = now(), updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.list_admin_users()
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  avatar_url text,
  role public.app_role,
  is_active boolean,
  last_sign_in_at timestamptz,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.id, p.full_name, p.email, p.avatar_url,
         (SELECT ur.role FROM public.user_roles ur WHERE ur.user_id = p.id LIMIT 1),
         COALESCE(m.is_active, true),
         m.last_sign_in_at,
         p.created_at
  FROM public.profiles p
  LEFT JOIN public.admin_users_meta m ON m.id = p.id
  WHERE public.is_admin()
  ORDER BY p.created_at ASC
$$;

REVOKE ALL ON FUNCTION public.audit_admin_action(text, text, text, text, jsonb) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_user_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_user_active(uuid, boolean) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.assign_pending_role(text, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.touch_last_sign_in() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.list_admin_users() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.set_user_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_user_active(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_pending_role(text, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.touch_last_sign_in() TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_admin_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.audit_admin_action(text, text, text, text, jsonb) TO authenticated;

-- 5. Tighten anonymous inserts
DROP POLICY IF EXISTS notifications_public_insert ON public.notifications;
CREATE POLICY notifications_staff_insert ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS lead_activities_public_insert ON public.lead_activities;
CREATE POLICY lead_activities_staff_insert ON public.lead_activities
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

REVOKE INSERT ON public.notifications FROM anon;
REVOKE INSERT ON public.lead_activities FROM anon;