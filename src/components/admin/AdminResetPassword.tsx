import React, { useEffect, useState } from 'react';
import { KeyRound, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { authService } from '../../services/authService';
import { navigate } from '../../lib/router';

export const AdminResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [done, setDone] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) setHasRecoverySession(!!data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setHasRecoverySession(!!session);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 8) {
      setErrorMessage('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não conferem.');
      return;
    }

    setIsLoading(true);
    const res = await authService.updatePassword(password);
    setIsLoading(false);

    if (res.success) {
      setDone(true);
    } else {
      setErrorMessage(res.error || 'Não foi possível atualizar a senha.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030D1A] flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#071B3A]/90 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white font-['Outfit'] tracking-tight">Definir Nova Senha</h1>
          <p className="text-xs text-slate-300">Escolha uma senha forte para acessar o painel.</p>
        </div>

        {hasRecoverySession === false && !done && (
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs text-center">
            Link inválido ou expirado. Solicite um novo link na tela de login.
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium text-center">
            {errorMessage}
          </div>
        )}

        {done ? (
          <div className="space-y-4 text-center">
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Senha atualizada com sucesso.</span>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
            >
              Ir para o painel <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300 block">Nova senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Mínimo de 8 caracteres"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#030D1A] border border-white/10 focus:border-cyan-400 text-white text-xs placeholder:text-slate-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300 block">Confirmar nova senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Repita a senha"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#030D1A] border border-white/10 focus:border-cyan-400 text-white text-xs placeholder:text-slate-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || hasRecoverySession === false}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 text-slate-950 font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                'Salvar nova senha'
              )}
            </button>
          </form>
        )}

        <button
          onClick={() => navigate('/admin/login')}
          className="w-full text-center text-xs font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Voltar para o login
        </button>
      </div>
    </div>
  );
};
