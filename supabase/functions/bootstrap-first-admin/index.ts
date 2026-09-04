import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    // Só funciona enquanto não existir nenhum administrador.
    const { count, error: countError } = await admin
      .from('user_roles')
      .select('user_id', { count: 'exact', head: true })
      .eq('role', 'admin');

    if (countError) return json({ error: countError.message }, 500);
    if ((count ?? 0) > 0) return json({ error: 'Já existe um administrador. Use o painel de usuários.' }, 403);

    const body = await req.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'E-mail inválido.' }, 400);

    const redirectTo = typeof body?.redirectTo === 'string' ? body.redirectTo : undefined;

    await admin.from('pending_role_assignments').upsert(
      { email, role: 'admin', consumed_at: null },
      { onConflict: 'email' }
    );

    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
    if (error) return json({ error: `Não foi possível enviar o convite: ${error.message}` }, 400);

    return json({ success: true, user_id: data.user?.id ?? null, email });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Erro inesperado.' }, 500);
  }
});
