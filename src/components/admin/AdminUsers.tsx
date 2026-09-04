import React, { useCallback, useEffect, useState } from 'react';
import { UserPlus, ShieldCheck, Mail, Loader2, Check, Ban, RotateCcw } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { authService, ROLE_LABELS } from '../../services/authService';
import { AdminRole } from '../../types';

interface AdminUserRow {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: AdminRole | null;
  is_active: boolean;
  last_sign_in_at: string | null;
  created_at: string;
}

const ROLES: AdminRole[] = ['admin', 'editor', 'commercial', 'marketing'];

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('commercial');
  const [inviting, setInviting] = useState(false);

  const currentUser = authService.getCurrentUser();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase.rpc('list_admin_users');
    if (err) {
      setError('Não foi possível carregar os usuários.');
    } else {
      setUsers((data as AdminUserRow[]) || []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setError(null);

    const { data, error: err } = await supabase.functions.invoke('admin-invite-user', {
      body: { email: inviteEmail.trim().toLowerCase(), role: inviteRole }
    });

    setInviting(false);

    if (err || (data as { error?: string } | null)?.error) {
      setError((data as { error?: string } | null)?.error || 'Não foi possível enviar o convite.');
      return;
    }

    setInviteEmail('');
    showFeedback('Convite enviado. A pessoa receberá um e-mail para definir a própria senha.');
    void load();
  };

  const handleRoleChange = async (userId: string, role: AdminRole) => {
    const { error: err } = await supabase.rpc('set_user_role', { _user_id: userId, _role: role });
    if (err) {
      setError('Não foi possível alterar o papel deste usuário.');
      return;
    }
    showFeedback('Papel atualizado.');
    void load();
  };

  const handleToggleActive = async (userId: string, active: boolean) => {
    const { error: err } = await supabase.rpc('set_user_active', { _user_id: userId, _active: active });
    if (err) {
      setError(err.message.includes('próprio') ? 'Você não pode desativar o próprio acesso.' : 'Não foi possível alterar o acesso.');
      return;
    }
    showFeedback(active ? 'Acesso reativado.' : 'Acesso desativado.');
    void load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          Usuários & Permissões
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Convide pessoas por e-mail, defina o papel de cada uma e revogue acessos. Não existe cadastro público.
        </p>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs">{feedback}</div>
      )}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">{error}</div>
      )}

      {/* Convite */}
      <form onSubmit={handleInvite} className="p-5 rounded-2xl bg-[#071B3A] border border-cyan-500/20 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-cyan-400" />
          Convidar novo usuário
        </h2>

        <div className="grid gap-3 sm:grid-cols-[1fr_200px_auto]">
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="pessoa@empresa.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#030D1A] border border-white/10 focus:border-cyan-400 text-white text-xs placeholder:text-slate-500 outline-none"
            />
          </div>

          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as AdminRole)}
            className="px-3 py-3 rounded-xl bg-[#030D1A] border border-white/10 focus:border-cyan-400 text-white text-xs outline-none"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={inviting}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar convite'}
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          O convidado recebe um e-mail e cria a própria senha. Nenhuma senha temporária é definida aqui.
        </p>
      </form>

      {/* Lista */}
      <div className="rounded-2xl bg-[#071B3A] border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Carregando usuários...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">Sem dados suficientes</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Usuário</th>
                  <th className="px-4 py-3">Papel</th>
                  <th className="px-4 py-3">Último acesso</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <span className="block font-semibold text-white">{u.full_name || (u.email || '').split('@')[0]}</span>
                      <span className="block text-[11px] text-slate-400">{u.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role || ''}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as AdminRole)}
                        className="px-2 py-1.5 rounded-lg bg-[#030D1A] border border-white/10 text-white text-[11px] outline-none focus:border-cyan-400"
                      >
                        <option value="" disabled>
                          Sem papel
                        </option>
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString('pt-BR') : 'Nunca acessou'}
                    </td>
                    <td className="px-4 py-3">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-300">
                          <Check className="w-3.5 h-3.5" /> Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-300">
                          <Ban className="w-3.5 h-3.5" /> Desativado
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.id === currentUser?.id ? (
                        <span className="text-[11px] text-slate-500">Você</span>
                      ) : u.is_active ? (
                        <button
                          onClick={() => handleToggleActive(u.id, false)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-semibold inline-flex items-center gap-1.5"
                        >
                          <Ban className="w-3.5 h-3.5" /> Desativar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleActive(u.id, true)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold inline-flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reativar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
