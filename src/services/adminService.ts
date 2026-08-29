/**
 * Centralized Administrative Business Service for OneSignal
 * Manages Audit Logs, Notifications, Company Settings, and Marketing Campaigns.
 */

import { AuditLog, NotificationItem, CompanySettings, MarketingCampaign, AdminUser } from '../types';
import { COMMERCIAL_CONFIG } from '../config/commercialConfig';

const SETTINGS_STORAGE_KEY = 'onesignal_admin_settings_v1';
const NOTIFICATIONS_STORAGE_KEY = 'onesignal_admin_notifications_v1';
const AUDIT_LOGS_STORAGE_KEY = 'onesignal_admin_audit_logs_v1';
const CAMPAIGNS_STORAGE_KEY = 'onesignal_admin_campaigns_v1';

class AdminService {
  private settings: CompanySettings | null = null;
  private notifications: NotificationItem[] = [];
  private auditLogs: AuditLog[] = [];
  private campaigns: MarketingCampaign[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (this.isInitialized) return;
    if (typeof window === 'undefined') {
      this.settings = this.getDefaultSettings();
      this.notifications = this.getSeedNotifications();
      this.auditLogs = this.getSeedAuditLogs();
      this.campaigns = this.getSeedCampaigns();
      return;
    }

    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      this.settings = storedSettings ? JSON.parse(storedSettings) : this.getDefaultSettings();

      const storedNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : this.getSeedNotifications();

      const storedLogs = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
      this.auditLogs = storedLogs ? JSON.parse(storedLogs) : this.getSeedAuditLogs();

      const storedCampaigns = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
      this.campaigns = storedCampaigns ? JSON.parse(storedCampaigns) : this.getSeedCampaigns();
    } catch {
      this.settings = this.getDefaultSettings();
      this.notifications = this.getSeedNotifications();
      this.auditLogs = this.getSeedAuditLogs();
      this.campaigns = this.getSeedCampaigns();
    }
    this.isInitialized = true;
  }

  // --- SETTINGS ---
  public getSettings(): CompanySettings {
    this.init();
    return this.settings || this.getDefaultSettings();
  }

  public updateSettings(newSettings: Partial<CompanySettings>, author?: AdminUser): CompanySettings {
    this.init();
    this.settings = {
      ...(this.settings || this.getDefaultSettings()),
      ...newSettings
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
    }

    if (author) {
      this.logAction(author, 'Atualizou configurações gerais da empresa', 'settings', undefined, 'Alteração de contatos ou metadados de SEO');
    }

    return this.settings;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(): NotificationItem[] {
    this.init();
    return [...this.notifications];
  }

  public getUnreadNotificationsCount(): number {
    this.init();
    return this.notifications.filter((n) => !n.read).length;
  }

  public markNotificationAsRead(id: string): void {
    this.init();
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.persistNotifications();
    }
  }

  public markAllNotificationsAsRead(): void {
    this.init();
    this.notifications.forEach((n) => (n.read = true));
    this.persistNotifications();
  }

  public addNotification(notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    this.init();
    const created: NotificationItem = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(created);
    this.persistNotifications();
    return created;
  }

  private persistNotifications(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(this.notifications.slice(0, 50)));
    } catch (e) {
      console.warn('[OneSignal AdminService] Notifications storage warning:', e);
    }
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLog[] {
    this.init();
    return [...this.auditLogs];
  }

  public logAction(
    user: AdminUser,
    action: string,
    targetType: AuditLog['targetType'],
    targetId?: string,
    details = ''
  ): AuditLog {
    this.init();
    const entry: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString()
    };

    this.auditLogs.unshift(entry);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(this.auditLogs.slice(0, 200)));
      } catch (e) {
        console.warn('[OneSignal AdminService] Audit log warning:', e);
      }
    }
    return entry;
  }

  // --- MARKETING CAMPAIGNS ---
  public getCampaigns(): MarketingCampaign[] {
    this.init();
    return [...this.campaigns];
  }

  public createCampaign(campaign: Omit<MarketingCampaign, 'id' | 'clicksCount' | 'leadsCount' | 'conversionRate' | 'createdAt'>, author?: AdminUser): MarketingCampaign {
    this.init();
    const created: MarketingCampaign = {
      ...campaign,
      id: `camp_${Date.now()}`,
      clicksCount: 0,
      leadsCount: 0,
      conversionRate: 0,
      createdAt: new Date().toISOString()
    };

    this.campaigns.unshift(created);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(this.campaigns));
    }

    if (author) {
      this.logAction(author, `Criou nova campanha de marketing "${created.name}"`, 'campaign', created.id, `UTM: ${created.source}/${created.medium}/${created.campaign}`);
    }

    return created;
  }

  public deleteCampaign(id: string, author?: AdminUser): boolean {
    this.init();
    const initial = this.campaigns.length;
    this.campaigns = this.campaigns.filter((c) => c.id !== id);
    if (this.campaigns.length !== initial) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(this.campaigns));
      }
      if (author) {
        this.logAction(author, 'Excluiu campanha de marketing', 'campaign', id);
      }
      return true;
    }
    return false;
  }

  // --- SEEDS & DEFAULTS ---
  private getDefaultSettings(): CompanySettings {
    return {
      companyName: COMMERCIAL_CONFIG.companyName,
      tradingName: COMMERCIAL_CONFIG.tradingName,
      cnpj: '00.000.000/0001-00',
      commercialEmail: COMMERCIAL_CONFIG.commercialEmail,
      supportEmail: COMMERCIAL_CONFIG.supportEmail,
      phoneDisplay: COMMERCIAL_CONFIG.phoneDisplay,
      rawWhatsappNumber: COMMERCIAL_CONFIG.rawWhatsappNumber,
      addressDisplay: `${COMMERCIAL_CONFIG.address.street}, ${COMMERCIAL_CONFIG.address.city} - ${COMMERCIAL_CONFIG.address.state}`,
      businessHours: COMMERCIAL_CONFIG.businessHours,
      instagram: COMMERCIAL_CONFIG.social.instagram,
      linkedin: COMMERCIAL_CONFIG.social.linkedin,
      youtube: '',
      github: COMMERCIAL_CONFIG.social.github || '',
      seoTitle: 'OneSignal | Soluções Tecnológicas Sob Medida & Sistemas Web',
      seoDescription: 'Desenvolvimento de sistemas web, aplicativos móveis, automação e inteligência artificial para médias e grandes empresas.',
      notifyOnNewLead: true,
      notifyOnDiagnostic: true
    };
  }

  private getSeedNotifications(): NotificationItem[] {
    return [
      {
        id: 'notif_01',
        title: 'Novo Lead Qualificado 🔥',
        message: 'Roberto Alcantara (Vanguard Logística) concluiu o Diagnóstico com Score 95.',
        type: 'lead',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        linkUrl: '/admin/leads'
      },
      {
        id: 'notif_02',
        title: 'Nova Solicitação de Orçamento 📩',
        message: 'Dra. Carolina Betti solicitou proposta para Aplicativo Mobile iOS/Android.',
        type: 'budget',
        timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        read: false,
        linkUrl: '/admin/leads'
      },
      {
        id: 'notif_03',
        title: 'Diagnóstico Inteligente Concluído 🧠',
        message: 'Visitante identificou 3 gargalos operacionais e solicitou contato.',
        type: 'diagnostic',
        timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        read: true,
        linkUrl: '/admin/diagnosticos'
      },
      {
        id: 'notif_04',
        title: 'Novo Projeto Publicado ⭐',
        message: 'O case "Sistema de Gestão Empresarial (Nexus ERP)" foi atualizado.',
        type: 'project',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        read: true,
        linkUrl: '/admin/projetos'
      }
    ];
  }

  private getSeedAuditLogs(): AuditLog[] {
    return [
      {
        id: 'log_01',
        userId: 'user_admin_01',
        userName: 'Luan Silva',
        userRole: 'admin',
        action: 'Login no Painel Administrativo',
        targetType: 'auth',
        details: 'Sessão autenticada via credenciais corporativas.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: 'log_02',
        userId: 'user_commercial_01',
        userName: 'Carlos Mendes',
        userRole: 'commercial',
        action: 'Atualizou status do Lead',
        targetType: 'lead',
        targetId: 'lead_seed_03',
        details: 'Status alterado para "Em negociação" com alinhamento de proposta.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'log_03',
        userId: 'user_editor_01',
        userName: 'Mariana Duarte',
        userRole: 'editor',
        action: 'Editou case de sucesso',
        targetType: 'project',
        targetId: 'sistema-gestao-empresarial',
        details: 'Métricas de resultados e tecnologias atualizadas no portfólio.',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  private getSeedCampaigns(): MarketingCampaign[] {
    return [
      {
        id: 'camp_01',
        name: 'Instagram Stories — Cases de Inovação',
        source: 'instagram',
        medium: 'stories',
        campaign: 'cases_inovacao_2025',
        targetUrl: 'https://onesignal.tech/?utm_source=instagram&utm_medium=stories&utm_campaign=cases_inovacao_2025',
        clicksCount: 384,
        leadsCount: 14,
        conversionRate: 3.6,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 'camp_02',
        name: 'Google Ads — Automação & ERP Sob Medida',
        source: 'google',
        medium: 'cpc',
        campaign: 'software_sob_medida_sp',
        targetUrl: 'https://onesignal.tech/?utm_source=google&utm_medium=cpc&utm_campaign=software_sob_medida_sp',
        clicksCount: 520,
        leadsCount: 22,
        conversionRate: 4.2,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 'camp_03',
        name: 'LinkedIn Direct B2B — Diagnóstico Corporativo',
        source: 'linkedin',
        medium: 'sponsored_inmail',
        campaign: 'diagnostico_ti_c_level',
        targetUrl: 'https://onesignal.tech/#diagnostico?utm_source=linkedin&utm_medium=sponsored&utm_campaign=diagnostico_ti_c_level',
        clicksCount: 210,
        leadsCount: 11,
        conversionRate: 5.2,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      }
    ];
  }
}

export const adminService = new AdminService();
