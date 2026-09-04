import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const VALID_ROLES = ['admin', 'editor', 'commercial', 'marketing'];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return json({ error: 'Não autenticado.' }, 401);

    // Identidade do chamador (nunca com service role).
    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: callerData, error: callerError } = await callerClient.auth.getUser(token);
    if (callerError || !callerData.user) return json({ error: 'Sessão inválida.' }, 401);

    const caller = callerData.user;

    // Cliente com privilégios de servidor (sem login de usuário).
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: callerRole } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', caller.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!callerRole) return json({ error: 'Apenas administradores podem convidar usuários.' }, 403);

    const body = await req.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const role = typeof body?.role === 'string' ? body.role : '';

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'E-mail inválido.' }, 400);
    if (!VALID_ROLES.includes(role)) return json({ error: 'Papel inválido.' }, 400);

    const origin = req.headers.get('origin') || '';
    const redirectTo = origin ? `${origin}/admin/redefinir-senha` : undefined;

    // Já existe? Apenas ajusta o papel.
    const { data: existingProfile } = await admin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingProfile) {
      await admin.from('user_roles').delete().eq('user_id', existingProfile.id).neq('role', role);
      await admin.from('user_roles').upsert(
        { user_id: existingProfile.id, role },
        { onConflict: 'user_id,role', ignoreDuplicates: true }
      );
      await admin
        .from('admin_users_meta')
        .upsert({ id: existingProfile.id, is_active: true, deactivated_at: null }, { onConflict: 'id' });
    } else {
      await admin.from('pending_role_assignments').upsert(
        { email, role, invited_by: caller.id, consumed_at: null },
        { onConflict: 'email' }
      );

      const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
      if (inviteError) {
        return json({ error: `Não foi possível enviar o convite: ${inviteError.message}` }, 400);
      }
    }

    const { data: callerProfile } = await admin
      .from('profiles')
      .select('full_name, email')
      .eq('id', caller.id)
      .maybeSingle();

    await admin.from('audit_logs').insert({
      user_id: caller.id,
      user_name: callerProfile?.full_name ?? null,
      user_email: callerProfile?.email ?? caller.email,
      user_role: 'admin',
      action: existingProfile ? 'role_changed' : 'user_invited',
      target_type: 'auth',
      target_id: email,
      details: existingProfile ? `Papel definido como ${role}` : `Convite enviado com papel ${role}`
    });

    return json({ success: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Erro inesperado.' }, 500);
  }
});
