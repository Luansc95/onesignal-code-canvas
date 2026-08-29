/**
 * Authentication & Role-Based Access Control (RBAC) Service for OneSignal Admin
 * Handles sessions, role validation, demo accounts, and audit event dispatching.
 */

import { AdminUser, AdminRole } from '../types';

const AUTH_STORAGE_KEY = 'onesignal_admin_auth_v1';

export const DEMO_ADMIN_USERS: Record<AdminRole, AdminUser> = {
  admin: {
    id: 'user_admin_01',
    name: 'Luan Silva',
    email: 'admin@onesignal.tech',
    role: 'admin',
    roleLabel: '👑 Administrador Geral',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    lastLogin: new Date().toISOString()
  },
  editor: {
    id: 'user_editor_01',
    name: 'Mariana Duarte',
    email: 'conteudo@onesignal.tech',
    role: 'editor',
    roleLabel: '✏️ Editor de Projetos & Conteúdo',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    lastLogin: new Date().toISOString()
  },
  commercial: {
    id: 'user_commercial_01',
    name: 'Carlos Mendes',
    email: 'comercial@onesignal.tech',
    role: 'commercial',
    roleLabel: '💼 Executivo Comercial & CRM',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    lastLogin: new Date().toISOString()
  },
  marketing: {
    id: 'user_marketing_01',
    name: 'Fernanda Rocha',
    email: 'marketing@onesignal.tech',
    role: 'marketing',
    roleLabel: '📊 Growth & Marketing Analytics',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    lastLogin: new Date().toISOString()
  }
};

class AuthService {
  private currentUser: AdminUser | null = null;
  private token: string | null = null;

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user && parsed.token && parsed.expiresAt > Date.now()) {
          this.currentUser = parsed.user;
          this.token = parsed.token;
        } else {
          this.logout();
        }
      }
    } catch {
      this.logout();
    }
  }

  public isAuthenticated(): boolean {
    return !!this.currentUser && !!this.token;
  }

  public getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }

  public async login(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    // Simulated secure latency
    await new Promise((r) => setTimeout(r, 450));

    const cleanEmail = email.trim().toLowerCase();

    // Check matching demo user or generic admin login
    let matchedUser: AdminUser | null = null;

    if (cleanEmail === 'admin@onesignal.tech' || cleanEmail === 'luansc1995@gmail.com' || cleanEmail === 'onesignal@outlook.com.br') {
      matchedUser = DEMO_ADMIN_USERS.admin;
    } else if (cleanEmail === 'conteudo@onesignal.tech') {
      matchedUser = DEMO_ADMIN_USERS.editor;
    } else if (cleanEmail === 'comercial@onesignal.tech') {
      matchedUser = DEMO_ADMIN_USERS.commercial;
    } else if (cleanEmail === 'marketing@onesignal.tech') {
      matchedUser = DEMO_ADMIN_USERS.marketing;
    } else if (cleanEmail.includes('@') && password.length >= 4) {
      // Default dynamic admin fallback
      matchedUser = {
        id: `user_${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'admin',
        roleLabel: '👑 Administrador',
        lastLogin: new Date().toISOString()
      };
    }

    if (!matchedUser) {
      return { success: false, error: 'Credenciais inválidas. Verifique seu e-mail e senha.' };
    }

    const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    this.currentUser = {
      ...matchedUser,
      lastLogin: new Date().toISOString()
    };
    this.token = sessionToken;

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: this.currentUser,
          token: this.token,
          expiresAt
        })
      );
    }

    return { success: true, user: this.currentUser };
  }

  public loginAsDemoRole(role: AdminRole): AdminUser {
    const user = DEMO_ADMIN_USERS[role] || DEMO_ADMIN_USERS.admin;
    const sessionToken = `token_demo_${Date.now()}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    this.currentUser = {
      ...user,
      lastLogin: new Date().toISOString()
    };
    this.token = sessionToken;

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: this.currentUser,
          token: this.token,
          expiresAt
        })
      );
    }

    return this.currentUser;
  }

  public logout(): void {
    this.currentUser = null;
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  /**
   * Permission validation helper
   */
  public canAccess(section: string): boolean {
    if (!this.currentUser) return false;
    const role = this.currentUser.role;

    if (role === 'admin') return true; // Full access

    switch (section) {
      case 'dashboard':
        return true;
      case 'projetos':
        return role === 'editor';
      case 'leads':
      case 'contatos':
        return role === 'commercial';
      case 'marketing':
      case 'analytics':
      case 'diagnosticos':
        return role === 'marketing';
      case 'configuracoes':
      case 'logs':
        return false; // Only admin (handled above)
      default:
        return false;
    }
  }
}

export const authService = new AuthService();
