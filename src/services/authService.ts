/**
 * Autenticação real do painel administrativo (Supabase Auth + papéis no banco).
 * Não existe usuário de demonstração, senha padrão nem fallback de acesso.
 */

import { supabase, isSupabaseConfigured } from '../integrations/supabase/client';
import { AdminUser, AdminRole } from '../types';

export const ROLE_LABELS: Record<AdminRole, string> = {
  admin: '👑 Administrador Geral',
  editor: '✏️ Editor de Projetos & Conteúdo',
  commercial: '💼 Executivo Comercial & CRM',
  marketing: '📊 Growth & Marketing Analytics'
};

type Listener = () => void;

class AuthService {
  private currentUser: AdminUser | null = null;
  private loading = true;
  private listeners = new Set<Listener>();
  private initialized = false;

  private emit(): void {
    this.listeners.forEach((l) => l());
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public isLoading(): boolean {
    return this.loading;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  public getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }

  /** Carrega perfil + papel do usuário autenticado. */
  private async loadProfile(userId: string, email: string): Promise<AdminUser | null> {
    const [{ data: profile }, { data: roleRow }, { data: meta }] = await Promise.all([
      supabase.from('profiles').select('full_name, email, avatar_url').eq('id', userId).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', userId).limit(1).maybeSingle(),
      supabase.from('admin_users_meta').select('is_active').eq('id', userId).maybeSingle()
    ]);

    if (meta && meta.is_active === false) return null;
    if (!roleRow?.role) return null;

    const role = roleRow.role as AdminRole;

    return {
      id: userId,
      name: profile?.full_name || (profile?.email || email).split('@')[0],
      email: profile?.email || email,
      role,
      roleLabel: ROLE_LABELS[role],
      avatarUrl: profile?.avatar_url || undefined,
      lastLogin: new Date().toISOString()
    };
  }

  private async syncSession(): Promise<void> {
    try {
      if (!isSupabaseConfigured) {
        this.currentUser = null;
        this.loading = false;
        this.emit();
        return;
      }

      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        this.currentUser = null;
        this.loading = false;
        this.emit();
        return;
      }

      const adminUser = await this.loadProfile(user.id, user.email || '');

      if (!adminUser) {
        // Sessão válida, mas sem papel atribuído ou acesso desativado.
        this.currentUser = null;
        this.loading = false;
        this.emit();
        await supabase.auth.signOut();
        return;
      }

      this.currentUser = adminUser;
      this.loading = false;
      this.emit();
    } catch (err) {
      // Nunca propagar falha de autenticação: apenas trata como "sem sessão".
      console.warn('[Auth] Falha ao sincronizar sessão:', err);
      this.currentUser = null;
      this.loading = false;
      this.emit();
    }
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    try {
      supabase.auth.onAuthStateChange((_event, session) => {
        // Evita chamadas assíncronas dentro do callback do Supabase.
        setTimeout(() => {
          if (!session) {
            this.currentUser = null;
            this.loading = false;
            this.emit();
            return;
          }
          void this.syncSession();
        }, 0);
      });
    } catch (err) {
      console.warn('[Auth] Não foi possível registrar o listener de sessão:', err);
    }

    await this.syncSession();
  }


  public async signIn(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Serviço de autenticação indisponível no momento.' };
    }

    const cleanEmail = email.trim().toLowerCase();


    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });

    if (error || !data.user) {
      return { success: false, error: 'E-mail ou senha inválidos.' };
    }

    const adminUser = await this.loadProfile(data.user.id, data.user.email || cleanEmail);

    if (!adminUser) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Esta conta não possui acesso ao painel. Solicite autorização a um administrador.'
      };
    }

    this.currentUser = adminUser;
    this.loading = false;
    this.emit();

    void supabase.rpc('touch_last_sign_in');

    return { success: true, user: adminUser };
  }

  public async signOut(): Promise<void> {
    await supabase.auth.signOut();
    this.currentUser = null;
    this.loading = false;
    this.emit();
  }

  /** Compatibilidade com chamadas síncronas existentes. */
  public logout(): void {
    void this.signOut();
  }

  public async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/admin/redefinir-senha`
    });
    if (error) return { success: false, error: 'Não foi possível enviar o e-mail de redefinição.' };
    return { success: true };
  }

  public async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  public canAccess(section: string): boolean {
    if (!this.currentUser) return false;
    const role = this.currentUser.role;

    if (role === 'admin') return true;

    switch (section) {
      case 'dashboard':
        return true;
      case 'projetos':
        return role === 'editor';
      case 'leads':
      case 'lead-scoring':
      case 'contatos':
        return role === 'commercial';
      case 'marketing':
      case 'analytics':
      case 'diagnosticos':
        return role === 'marketing';
      default:
        return false;
    }
  }
}

export const authService = new AuthService();
