import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { authService } from '../../services/authService';
import { navigate } from '../../lib/router';

export const AdminLogin: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const res = await authService.signIn(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMessage(res.error || 'E-mail ou senha inválidos.');
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await authService.requestPasswordReset(email);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage('Se este e-mail tiver acesso ao painel, enviamos um link para redefinir a senha.');
    } else {
      setErrorMessage(res.error || 'Não foi possível enviar o e-mail agora.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030D1A] flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 antialiased relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-900/10 blur-3xl pointer-events-none" />

      <header className="w-full max-w-5xl flex items-center justify-between py-4 z-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 text-left group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#22D3EE] to-[#2DD4BF] flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            1S
          </div>
          <div>
            <span className="font-['Outfit'] font-bold text-white tracking-wide text-base block">OneSignal</span>
            <span className="text-[10px] font-mono text-cyan-400 block -mt-1">ADMINISTRATIVE PORTAL</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
        >
          <span>Retornar ao Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </header>

      <div className="w-full max-w-md my-8 z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#071B3A]/90 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white font-['Outfit'] tracking-tight">
              {mode === 'login' ? 'Acesso Corporativo & BI' : 'Redefinir Senha'}
            </h1>
            <p className="text-xs text-slate-300">
              {mode === 'login'
                ? 'Acesso restrito a usuários autorizados pela OneSignal.'
                : 'Informe seu e-mail corporativo para receber o link de redefinição.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium text-center">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleForgot} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300 block">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="seu.email@empresa.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#030D1A] border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white text-xs placeholder:text-slate-500 transition-all outline-none"
                />
              </div>
            </div>

            {mode === 'login' && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300 block">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#030D1A] border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white text-xs placeholder:text-slate-500 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Entrar no Painel Administrativo' : 'Enviar link de redefinição'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            {mode === 'login' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                Esqueci minha senha
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar para o login
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-4">
          Não há cadastro público. O acesso é concedido por convite de um administrador.
        </p>
      </div>

      <footer className="w-full max-w-5xl text-center text-[10px] text-slate-500 py-4 z-10">
        OneSignal Tecnologia • Área restrita monitorada e auditada
      </footer>
    </div>
  );
};
