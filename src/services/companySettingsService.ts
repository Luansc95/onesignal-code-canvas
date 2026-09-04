/**
 * Fonte única de verdade das configurações institucionais da OneSignal.
 * Os dados vivem na tabela `company_settings` (Supabase) e são consumidos
 * tanto pelo site público quanto pela Área Administrativa.
 */

import { supabase } from '../integrations/supabase/client';
import { CompanySettings } from '../types';

export type CompanySettingsStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface CompanySettingsState {
  settings: CompanySettings;
  status: CompanySettingsStatus;
  error: string | null;
  updatedAt?: string;
}

type Listener = (state: CompanySettingsState) => void;

/** Fallback seguro: nunca expõe telefone/WhatsApp/redes fictícias. */
export const FALLBACK_SETTINGS: CompanySettings = {
  companyName: 'OneSignal Soluções Tecnológicas Ltda.',
  tradingName: 'OneSignal Soluções Tecnológicas Ltda',
  cnpj: '',
  commercialEmail: 'onesignal@outlook.com.br',
  supportEmail: 'onesignal@outlook.com.br',
  phoneDisplay: '',
  rawWhatsappNumber: '',
  addressDisplay: 'Rua Moreira dos Santos, 52 - Centro, Barra do Piraí - RJ',
  businessHours: 'Segunda a Sexta: 08:30 às 18:30 (Sistemas em Nuvem 24/7)',
  instagram: 'https://www.instagram.com/onesignal_tech/',
  linkedin: '',
  youtube: '',
  github: '',
  seoTitle: 'OneSignal | Soluções Tecnológicas Sob Medida & Sistemas Web',
  seoDescription:
    'Desenvolvimento de sistemas web, aplicativos móveis, automação e inteligência artificial para médias e grandes empresas.',
  notifyOnNewLead: true,
  notifyOnDiagnostic: true
};

interface CompanySettingsRow {
  id: string;
  company_name: string;
  trading_name: string;
  cnpj: string | null;
  commercial_email: string;
  support_email: string;
  phone_display: string;
  raw_whatsapp_number: string;
  address_display: string;
  business_hours: string;
  instagram: string;
  linkedin: string;
  youtube: string | null;
  github: string | null;
  seo_title: string;
  seo_description: string;
  notify_on_new_lead: boolean;
  notify_on_diagnostic: boolean;
  updated_at: string;
}

function rowToSettings(row: CompanySettingsRow): CompanySettings {
  return {
    companyName: row.company_name,
    tradingName: row.trading_name,
    cnpj: row.cnpj || '',
    commercialEmail: row.commercial_email,
    supportEmail: row.support_email,
    phoneDisplay: row.phone_display,
    rawWhatsappNumber: row.raw_whatsapp_number,
    addressDisplay: row.address_display,
    businessHours: row.business_hours,
    instagram: row.instagram,
    linkedin: row.linkedin,
    youtube: row.youtube || '',
    github: row.github || '',
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    notifyOnNewLead: row.notify_on_new_lead,
    notifyOnDiagnostic: row.notify_on_diagnostic
  };
}

function settingsToRow(settings: CompanySettings): Record<string, unknown> {
  return {
    company_name: settings.companyName,
    trading_name: settings.tradingName,
    cnpj: settings.cnpj || null,
    commercial_email: settings.commercialEmail,
    support_email: settings.supportEmail,
    phone_display: settings.phoneDisplay || '',
    raw_whatsapp_number: settings.rawWhatsappNumber || '',
    address_display: settings.addressDisplay,
    business_hours: settings.businessHours,
    instagram: settings.instagram || '',
    linkedin: settings.linkedin || '',
    youtube: settings.youtube || null,
    github: settings.github || null,
    seo_title: settings.seoTitle,
    seo_description: settings.seoDescription,
    notify_on_new_lead: settings.notifyOnNewLead,
    notify_on_diagnostic: settings.notifyOnDiagnostic
  };
}

const SELECT_COLUMNS =
  'id, company_name, trading_name, cnpj, commercial_email, support_email, phone_display, raw_whatsapp_number, address_display, business_hours, instagram, linkedin, youtube, github, seo_title, seo_description, notify_on_new_lead, notify_on_diagnostic, updated_at';

class CompanySettingsService {
  private state: CompanySettingsState = {
    settings: FALLBACK_SETTINGS,
    status: 'idle',
    error: null
  };
  private listeners = new Set<Listener>();
  private inFlight: Promise<CompanySettingsState> | null = null;
  private rowId: string | null = null;

  /** Snapshot síncrono (usado por helpers como getWhatsAppUrl). */
  public getSnapshot(): CompanySettingsState {
    return this.state;
  }

  public getSettings(): CompanySettings {
    return this.state.settings;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setState(patch: Partial<CompanySettingsState>): void {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener(this.state));
  }

  /** Carrega do banco (com deduplicação de chamadas simultâneas). */
  public async load(force = false): Promise<CompanySettingsState> {
    if (!force && this.state.status === 'ready') return this.state;
    if (this.inFlight) return this.inFlight;

    this.setState({ status: 'loading', error: null });

    this.inFlight = (async () => {
      try {
        const { data, error } = await supabase
          .from('company_settings')
          .select(SELECT_COLUMNS)
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const row = data as unknown as CompanySettingsRow;
          this.rowId = row.id;
          this.setState({
            settings: rowToSettings(row),
            status: 'ready',
            error: null,
            updatedAt: row.updated_at
          });
        } else {
          // Sem registro no banco: mantém fallback seguro, sem quebrar o site.
          this.setState({ status: 'ready', error: null });
        }
      } catch (err) {
        this.setState({
          status: 'error',
          error: err instanceof Error ? err.message : 'Não foi possível carregar as configurações.'
        });
      } finally {
        this.inFlight = null;
      }
      return this.state;
    })();

    return this.inFlight;
  }

  /** Salva no banco e só então atualiza o estado local. */
  public async save(next: CompanySettings): Promise<CompanySettings> {
    const payload = settingsToRow(next);

    let query = supabase.from('company_settings').update(payload as never);
    query = this.rowId ? query.eq('id', this.rowId) : query.eq('singleton', true);

    const { data, error } = await query.select(SELECT_COLUMNS).maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) {
      throw new Error(
        'Não foi possível confirmar a gravação das configurações. Verifique suas permissões e tente novamente.'
      );
    }

    const row = data as unknown as CompanySettingsRow;
    this.rowId = row.id;
    this.setState({
      settings: rowToSettings(row),
      status: 'ready',
      error: null,
      updatedAt: row.updated_at
    });

    return this.state.settings;
  }

  /** Invalida o cache e recarrega do banco. */
  public async refresh(): Promise<CompanySettingsState> {
    return this.load(true);
  }
}

export const companySettingsService = new CompanySettingsService();

/** Diferença entre dois conjuntos de configurações (para auditoria). */
export function diffSettings(
  before: CompanySettings,
  after: CompanySettings
): { field: string; before: unknown; after: unknown }[] {
  const keys = Object.keys(after) as (keyof CompanySettings)[];
  return keys
    .filter((key) => (before[key] ?? '') !== (after[key] ?? ''))
    .map((key) => ({ field: key, before: before[key] ?? '', after: after[key] ?? '' }));
}
