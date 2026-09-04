import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Flame, 
  Mail, 
  BrainCircuit, 
  Megaphone, 
  BarChart3, 
  Settings, 
  History, 
  LogOut, 
  ExternalLink, 
  Bell, 
  Menu, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Search,
  UserCheck
} from 'lucide-react';
import { authService } from '../../services/authService';
import { adminService } from '../../services/adminService';
import { leadService } from '../../services/leadService';
import { AdminRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { navigate } from '../../lib/router';

interface AdminLayoutProps {
  currentPath: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPath, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user: currentUser } = useAuth();
  const unreadNotifsCount = adminService.getUnreadNotificationsCount();
  const notifications = adminService.getNotifications();
  const leads = leadService.getAllLeads();
  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Executivo',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'editor', 'commercial', 'marketing']
    },
    {
      id: 'projetos',
      label: 'Gestão de Projetos',
      path: '/admin/projetos',
      icon: FolderKanban,
      roles: ['admin', 'editor']
    },
    {
      id: 'leads',
      label: 'Pipeline de Leads (CRM)',
      path: '/admin/leads',
      icon: Users,
      badge: newLeadsCount > 0 ? newLeadsCount : undefined,
      badgeColor: 'bg-cyan-500 text-cyan-950',
      roles: ['admin', 'commercial']
    },
    {
      id: 'lead-scoring',
      label: 'Lead Scoring',
      path: '/admin/lead-scoring',
      icon: Flame,
      roles: ['admin', 'commercial']
    },
    {
      id: 'contatos',
      label: 'Central de Contatos',
      path: '/admin/contatos',
      icon: Mail,
      roles: ['admin', 'commercial']
    },
    {
      id: 'diagnosticos',
      label: 'Diagnósticos & BI',
      path: '/admin/diagnosticos',
      icon: BrainCircuit,
      roles: ['admin', 'marketing']
    },
    {
      id: 'marketing',
      label: 'Marketing Center',
      path: '/admin/marketing',
      icon: Megaphone,
      roles: ['admin', 'marketing']
    },
    {
      id: 'analytics',
      label: 'Analytics & Eventos',
      path: '/admin/analytics',
      icon: BarChart3,
      roles: ['admin', 'marketing']
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      path: '/admin/configuracoes',
      icon: Settings,
      roles: ['admin']
    },
    {
      id: 'usuarios',
      label: 'Usuários & Permissões',
      path: '/admin/usuarios',
      icon: UserCheck,
      roles: ['admin']
    },
    {
      id: 'logs',
      label: 'Logs & Auditoria',
      path: '/admin/logs',
      icon: History,
      roles: ['admin']
    }
  ];

  const handleLogout = async () => {
    if (currentUser) {
      adminService.logAction(currentUser, 'Logout do painel', 'auth', undefined, 'Sessão encerrada pelo usuário.');
    }
    await authService.signOut();
    navigate('/admin/login');
  };

  // Find active navigation item
  const currentNavItem = navigationItems.find(
    (item) => currentPath === item.path || currentPath.startsWith(item.path + '/')
  ) || navigationItems[0];

  const userCanAccessCurrent = currentUser ? authService.canAccess(currentNavItem.id) : false;

  return (
    <div className="min-h-screen bg-[#030D1A] text-slate-100 flex flex-col md:flex-row antialiased">
      
      {/* Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#071B3A] border-b border-cyan-500/20 z-40 sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm">
            1S
          </div>
          <div>
            <span className="font-['Outfit'] font-bold text-white tracking-wide text-sm block">OneSignal</span>
            <span className="text-[10px] font-mono text-cyan-400 block -mt-1">ADMIN // BI</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 relative"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-bold flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Desktop Persistent Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-[#05152B] border-r border-cyan-500/15 z-50 flex flex-col justify-between
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand & Logo Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#22D3EE] via-[#2DD4BF] to-sky-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
              1S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Outfit'] font-bold text-white tracking-wide text-base">OneSignal</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  BI v2.4
                </span>
              </div>
              <span className="text-xs text-slate-400 block font-medium">Painel Corporativo</span>
            </div>
          </div>
          <button 
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Navegação Principal
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== '/admin/dashboard' && currentPath.startsWith(item.path));
            const hasRoleAccess = currentUser ? item.roles.includes(currentUser.role) : true;

            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm font-semibold' 
                    : hasRoleAccess
                      ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                      : 'text-slate-400 hover:bg-white/[0.02] opacity-60'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Role Switcher Footer */}
        <div className="p-3 border-t border-white/10 bg-[#040D1A]/60 space-y-2">
          {/* Quick link to public website */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-cyan-300 hover:bg-white/5 border border-white/5 transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              Ver Site Público
            </span>
            <span className="text-[10px] font-mono text-slate-400">onesignal.com</span>
          </button>

          {/* User Profile Bar */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img 
                  src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                  alt={currentUser?.name || 'Usuário'}
                  className="w-8 h-8 rounded-lg object-cover border border-cyan-400/30 shrink-0" 
                />
                <div className="truncate">
                  <span className="text-xs font-bold text-white block truncate">{currentUser?.name || 'Administrador'}</span>
                  <span className="text-[10px] font-mono text-cyan-300 block truncate">{currentUser?.roleLabel || '👑 Administrador'}</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            </button>

            {/* Menu do Usuário */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 p-2 rounded-2xl bg-[#071B3A] border border-cyan-500/30 shadow-2xl space-y-1 z-50 animate-fade-in backdrop-blur-xl">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/10 mb-1">
                  {currentUser?.email}
                </div>
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/admin/usuarios');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 flex items-center gap-2 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Usuários & Permissões
                  </button>
                )}
                <div className="border-t border-white/10 pt-1 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sair da Sessão
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#030D1A]">
        
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#05152B]/80 border-b border-cyan-500/15 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <currentNavItem.icon className="w-5 h-5 text-[#22D3EE]" />
                {currentNavItem.label}
              </h1>
              <span className="text-xs text-slate-400">
                OneSignal Business Intelligence & Control Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Public Site Link */}
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver Site Público</span>
            </button>

            {/* Notification Center Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white relative transition-all"
                aria-label="Central de Notificações"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Pop-up Modal */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#071B3A] border border-cyan-500/30 shadow-2xl p-4 z-50 animate-fade-in backdrop-blur-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                        Notificações ({notifications.length})
                      </span>
                    </div>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={() => adminService.markAllNotificationsAsRead()}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        Marcar lidas
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        Nenhuma notificação recente.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            adminService.markNotificationAsRead(notif.id);
                            if (notif.linkUrl) {
                              navigate(notif.linkUrl);
                              setIsNotifOpen(false);
                            }
                          }}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            notif.read
                              ? 'bg-white/[0.02] border-white/5 text-slate-400'
                              : 'bg-cyan-950/40 border-cyan-500/30 text-slate-200 hover:bg-cyan-900/40'
                          }`}
                        >
                          <div className="font-bold text-white flex items-center justify-between">
                            <span>{notif.title}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-300">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
              <img 
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                alt={currentUser?.name}
                className="w-8 h-8 rounded-lg object-cover border border-cyan-400/30"
              />
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-white block">{currentUser?.name}</span>
                <span className="text-[10px] font-mono text-cyan-300 block">{currentUser?.roleLabel}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Body View */}
        <main className="p-4 sm:p-6 md:p-8 flex-1">
          {userCanAccessCurrent ? (
            children
          ) : (
            <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-[#071B3A] border border-rose-500/30 text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white font-['Outfit']">Acesso Restrito ao Módulo</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seu perfil atual (<span className="font-mono text-cyan-300">{currentUser?.roleLabel}</span>) não possui permissão para acessar esta seção. Solicite autorização a um administrador.
              </p>
            </div>
          )}
        </main>
      </div>

    </div>
  );
};
