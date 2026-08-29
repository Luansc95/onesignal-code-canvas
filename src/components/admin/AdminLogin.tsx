import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { authService, DEMO_ADMIN_USERS } from '../../services/authService';
import { adminService } from '../../services/adminService';
import { AdminRole } from '../../types';
import { navigate } from '../../lib/router';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@onesignal.tech');
  const [password, setPassword] = useState('onesignal2025');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const res = await authService.login(email, password);
    setIsLoading(false);

    if (res.success && res.user) {
      adminService.logAction(res.user, 'Login efetuado com sucesso', 'auth', undefined, 'Autenticado via formulário corporativo.');
      navigate('/admin/dashboard');
    } else {
      setErrorMessage(res.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    }
  };

  const handleQuickLogin = (role: AdminRole) => {
    const user = authService.loginAsDemoRole(role);
    adminService.logAction(user, `Login rápido com papel ${user.roleLabel}`, 'auth', undefined, 'Acesso de teste ativado.');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#030D1A] flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 antialiased relative overflow-hidden">
      
      {/* Subtle background ambient lights */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-900/10 blur-3xl pointer-events-none" />

      {/* Top Brand Link */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-left group"
        >
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

      {/* Login Card */}
      <div className="w-full max-w-md my-8 z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#071B3A]/90 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white font-['Outfit'] tracking-tight">
              Acesso Corporativo & BI
            </h1>
            <p className="text-xs text-slate-300">
              Autenticação unificada para gestão de projetos, CRM de leads e inteligência de conversão.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium text-center animate-shake">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                <span>E-mail Corporativo</span>
                <span className="text-[10px] text-cyan-400">admin@onesignal.tech</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu.email@onesignal.tech"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#030D1A] border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white text-xs placeholder:text-slate-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                <span>Senha de Acesso</span>
                <span className="text-[10px] text-slate-400 font-normal">Mínimo 4 caracteres</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#030D1A] border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white text-xs placeholder:text-slate-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Painel Administrativo</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo RBAC Quick-Access Profiles */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-cyan-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Perfis de Teste Rápidos (RBAC)
              </span>
              <span className="text-[10px] text-slate-400">1-clique</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-left transition-all group"
              >
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>👑 Admin Geral</span>
                  <ChevronRight className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Acesso total irrestrito</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('commercial')}
                className="p-2.5 rounded-xl bg-teal-950/40 hover:bg-teal-900/50 border border-teal-500/30 text-left transition-all group"
              >
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>💼 Comercial</span>
                  <ChevronRight className="w-3 h-3 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Leads, CRM & Contatos</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('editor')}
                className="p-2.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/30 text-left transition-all group"
              >
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>✏️ Editor</span>
                  <ChevronRight className="w-3 h-3 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Portfólio & Cases</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('marketing')}
                className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-left transition-all group"
              >
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>📊 Marketing</span>
                  <ChevronRight className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Analytics & Campanhas</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Security Note */}
      <footer className="w-full max-w-md text-center py-4 text-[11px] text-slate-400 space-y-1 z-10">
        <p className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ambiente protegido com criptografia e auditoria contínua de acessos (LGPD).</span>
        </p>
        <p className="text-slate-400">© 2025 OneSignal Tecnologia da Informação. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
};
