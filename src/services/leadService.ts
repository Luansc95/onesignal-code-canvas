/**
 * Centralized Lead Management, CRM & Lead Scoring Service for OneSignal
 * Validates, tracks attribution, scores leads transparently, and manages commercial pipeline.
 */

import { Lead, ContactFormData, LeadStatus, LeadPriority, LeadScoreResult, LeadActivity } from '../types';
import { getUtmParameters } from '../config/commercialConfig';
import { analytics } from './analyticsService';

const STORAGE_KEY = 'onesignal_leads_v2';

export interface LeadSubmissionResult {
  success: boolean;
  lead?: Lead;
  errors?: Record<string, string>;
  message: string;
}

class LeadService {
  private leads: Lead[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (this.isInitialized) return;
    if (typeof window === 'undefined') {
      this.leads = this.getSeedLeads();
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.leads = JSON.parse(stored);
      } else {
        this.leads = this.getSeedLeads();
        this.persist();
      }
    } catch {
      this.leads = this.getSeedLeads();
    }
    this.isInitialized = true;
  }

  private persist(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.leads));
    } catch (e) {
      console.warn('[OneSignal LeadService] Storage warning:', e);
    }
  }

  /**
   * Transparent Lead Scoring Algorithm
   * Scores from 0 to 100 based on explicit qualification rules
   */
  public calculateLeadScore(lead: Partial<Lead>): LeadScoreResult {
    const factors = [
      {
        name: 'Diagnóstico Concluído',
        points: 30,
        description: 'Usuário finalizou o Diagnóstico Inteligente com maturidade e desafios mapeados.',
        matched: !!lead.diagnosticCompleted
      },
      {
        name: 'Maturidade Alta / Desafios Estruturados',
        points: 15,
        description: 'Empresa identificou 2+ gargalos operacionais ou sistemas legados a integrar.',
        matched: (lead.identifiedChallenges?.length || 0) >= 2 || lead.digitalMaturity === 'Estruturada' || lead.digitalMaturity === 'Avançada'
      },
      {
        name: 'Faixa de Investimento Informada',
        points: 20,
        description: 'Cliente selecionou faixa de orçamento realista para o projeto.',
        matched: !!lead.budgetRange && lead.budgetRange !== 'A definir'
      },
      {
        name: 'Prazo ou Urgência Mapeada',
        points: 15,
        description: 'Cliente tem horizonte de implementação definido (urgente ou 1-3 meses).',
        matched: !!lead.desiredTimeline && !lead.desiredTimeline.includes('Apenas pesquisando')
      },
      {
        name: 'Dados Corporativos Completos',
        points: 10,
        description: 'Forneceu nome da empresa e WhatsApp válido com DDD.',
        matched: (lead.company?.trim().length || 0) > 2 && (lead.whatsapp?.replace(/\D/g, '').length || 0) >= 10
      },
      {
        name: 'Origem de Alta Intenção',
        points: 10,
        description: 'Lead originado de solicitação de orçamento ou simulador de automação.',
        matched: lead.source === 'budget_modal' || lead.source === 'budget_estimator' || lead.source === 'diagnostic_flow'
      }
    ];

    const score = factors.reduce((acc, factor) => acc + (factor.matched ? factor.points : 0), 0);

    let priority: LeadPriority = 'low';
    let priorityLabel = '🔵 Baixa prioridade';

    if (score >= 70) {
      priority = 'high';
      priorityLabel = '🔥 Alta prioridade';
    } else if (score >= 40) {
      priority = 'medium';
      priorityLabel = '🟡 Média prioridade';
    }

    return {
      score,
      priority,
      priorityLabel,
      factors
    };
  }

  private sanitize(input?: string): string {
    if (!input) return '';
    return input
      .trim()
      .replace(/[<>]/g, '')
      .slice(0, 1500);
  }

  public validate(data: ContactFormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Por favor, informe seu nome completo.';
    }

    if (!data.company || data.company.trim().length < 2) {
      errors.company = 'Por favor, informe o nome da sua empresa.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email.trim())) {
      errors.email = 'Informe um endereço de e-mail corporativo válido.';
    }

    const cleanPhone = data.whatsapp ? data.whatsapp.replace(/\D/g, '') : '';
    if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 11) {
      errors.whatsapp = 'Informe um número de WhatsApp válido com DDD (10 ou 11 dígitos).';
    }

    if (data.lgpdConsent === false) {
      errors.lgpdConsent = 'É necessário concordar com a política de contato para prosseguir.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  public async submitLead(
    formData: ContactFormData,
    sourceContext = 'contact_section'
  ): Promise<LeadSubmissionResult> {
    this.init();

    analytics.track('submit_contact_form', {
      source: sourceContext,
      solutionType: formData.solutionType
    });

    const { isValid, errors } = this.validate(formData);
    if (!isValid) {
      return {
        success: false,
        errors,
        message: 'Verifique os campos destacados e tente novamente.'
      };
    }

    const utm = getUtmParameters();
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

    const partialLead: Partial<Lead> = {
      name: this.sanitize(formData.name),
      company: this.sanitize(formData.company),
      email: this.sanitize(formData.email).toLowerCase(),
      whatsapp: this.sanitize(formData.whatsapp),
      solutionType: this.sanitize(formData.solutionType) || 'Sistema Web Sob Medida',
      projectDescription: this.sanitize(formData.description),
      budgetRange: formData.budgetRange ? this.sanitize(formData.budgetRange) : undefined,
      desiredTimeline: formData.desiredTimeline || formData.timeline ? this.sanitize(formData.desiredTimeline || formData.timeline) : undefined,
      foundUsVia: formData.foundUsVia ? this.sanitize(formData.foundUsVia) : undefined,
      preferredContactMethod: formData.preferredContactMethod ? this.sanitize(formData.preferredContactMethod) : 'WhatsApp',
      source: sourceContext,
      diagnosticCompleted: !!formData.diagnosticData,
      digitalMaturity: formData.diagnosticData?.maturityLevel,
      identifiedChallenges: formData.diagnosticData?.challenges,
      recommendedSolutions: formData.diagnosticData?.recommendedSolutions,
    };

    const scoring = this.calculateLeadScore(partialLead);

    const initialActivity: LeadActivity = {
      id: `act_${Date.now()}`,
      leadId: '',
      type: 'created',
      description: `Lead recebido através de ${sourceContext === 'diagnostic_flow' ? 'Diagnóstico Inteligente' : sourceContext === 'budget_modal' ? 'Solicitação de Orçamento' : 'Formulário de Contato'}. Score inicial: ${scoring.score} pts (${scoring.priorityLabel}).`,
      authorName: 'Sistema OneSignal',
      timestamp: new Date().toISOString()
    };

    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: partialLead.name!,
      company: partialLead.company!,
      email: partialLead.email!,
      whatsapp: partialLead.whatsapp!,
      solutionType: partialLead.solutionType!,
      projectDescription: partialLead.projectDescription!,
      budgetRange: partialLead.budgetRange,
      desiredTimeline: partialLead.desiredTimeline,
      foundUsVia: partialLead.foundUsVia,
      preferredContactMethod: partialLead.preferredContactMethod,
      source: sourceContext,
      pageUrl,
      utmSource: utm.utmSource || 'direct',
      utmMedium: utm.utmMedium || 'organic',
      utmCampaign: utm.utmCampaign || 'institutional',
      referrer: utm.referrer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'new',
      priority: scoring.priority,
      score: scoring.score,
      notes: undefined,
      activities: [initialActivity],
      lgpdConsent: formData.lgpdConsent ?? true,
      diagnosticCompleted: partialLead.diagnosticCompleted,
      digitalMaturity: partialLead.digitalMaturity,
      diagnosticScore: formData.diagnosticData?.score,
      identifiedChallenges: partialLead.identifiedChallenges,
      recommendedSolutions: partialLead.recommendedSolutions,
      diagnosticAnswers: formData.diagnosticData?.answers
    };

    initialActivity.leadId = newLead.id;

    try {
      this.leads.unshift(newLead);
      this.persist();

      analytics.track('contact_form_success', {
        leadId: newLead.id,
        solutionType: newLead.solutionType,
        source: newLead.source,
        score: newLead.score,
        priority: newLead.priority
      });

      return {
        success: true,
        lead: newLead,
        message: 'Solicitação registrada com sucesso! Nossa equipe entrará em contato em breve.'
      };
    } catch (err) {
      console.error('[OneSignal LeadService] Error processing lead:', err);
      return {
        success: false,
        message: 'Houve uma instabilidade temporária ao enviar. Por favor, tente pelo WhatsApp ou tente novamente.'
      };
    }
  }

  public getAllLeads(): Lead[] {
    this.init();
    return [...this.leads];
  }

  public getLeadById(id: string): Lead | undefined {
    this.init();
    return this.leads.find((l) => l.id === id);
  }

  public updateLeadStatus(id: string, newStatus: LeadStatus, author = 'Administrador'): Lead | null {
    this.init();
    const idx = this.leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;

    const lead = this.leads[idx];
    const oldStatus = lead.status;
    lead.status = newStatus;
    lead.updatedAt = new Date().toISOString();

    const activity: LeadActivity = {
      id: `act_${Date.now()}`,
      leadId: id,
      type: 'status_change',
      description: `Status alterado de "${this.getStatusLabel(oldStatus)}" para "${this.getStatusLabel(newStatus)}".`,
      authorName: author,
      timestamp: new Date().toISOString()
    };

    lead.activities = [activity, ...(lead.activities || [])];
    this.persist();
    return lead;
  }

  public addLeadNote(id: string, noteText: string, author = 'Administrador'): Lead | null {
    this.init();
    const idx = this.leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;

    const lead = this.leads[idx];
    lead.notes = noteText;
    lead.updatedAt = new Date().toISOString();

    const activity: LeadActivity = {
      id: `act_${Date.now()}`,
      leadId: id,
      type: 'note_added',
      description: `Nota interna adicionada: "${noteText.slice(0, 100)}${noteText.length > 100 ? '...' : ''}"`,
      authorName: author,
      timestamp: new Date().toISOString()
    };

    lead.activities = [activity, ...(lead.activities || [])];
    this.persist();
    return lead;
  }

  public deleteLead(id: string): boolean {
    this.init();
    const initial = this.leads.length;
    this.leads = this.leads.filter((l) => l.id !== id);
    if (this.leads.length !== initial) {
      this.persist();
      return true;
    }
    return false;
  }

  public getStatusLabel(status: LeadStatus): string {
    switch (status) {
      case 'new':
        return '🆕 Novo';
      case 'analyzing':
        return '👀 Em análise';
      case 'contacted':
        return '📞 Contatado';
      case 'negotiating':
        return '🤝 Em negociação';
      case 'converted':
        return '🎉 Convertido';
      case 'lost':
        return '❌ Perdido';
      case 'archived':
        return '📁 Arquivado';
      default:
        return status;
    }
  }

  private getSeedLeads(): Lead[] {
    return [
      {
        id: 'lead_seed_01',
        name: 'Roberto Alcantara',
        company: 'Vanguard Logística & Distribuição',
        email: 'roberto@vanguardlog.com.br',
        whatsapp: '(11) 98451-2090',
        solutionType: 'Sistema de Gestão Sob Medida (ERP)',
        projectDescription: 'Necessitamos integrar 3 centros de distribuição com controle de estoque via código de barras e painel para a diretoria em tempo real.',
        budgetRange: 'R$ 35.000 - R$ 60.000',
        desiredTimeline: 'Urgente (em até 30 dias)',
        foundUsVia: 'Instagram Oficial (@onesignal_tech)',
        preferredContactMethod: 'WhatsApp',
        source: 'diagnostic_flow',
        pageUrl: 'https://onesignal.tech/#diagnostico',
        utmSource: 'instagram',
        utmMedium: 'social_bio',
        utmCampaign: 'cases_inovacao_2025',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'new',
        priority: 'high',
        score: 95,
        notes: 'Contato realizado via WhatsApp. Agendada reunião de escopo para amanhã às 14h.',
        activities: [
          {
            id: 'act_seed_1',
            leadId: 'lead_seed_01',
            type: 'created',
            description: 'Lead gerado via Diagnóstico Inteligente com Score 95 (Alta prioridade).',
            authorName: 'Sistema OneSignal',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ],
        lgpdConsent: true,
        diagnosticCompleted: true,
        digitalMaturity: 'Estruturada',
        diagnosticScore: 78,
        identifiedChallenges: ['Processos manuais / retrabalho', 'Falta de indicadores em tempo real', 'Sistemas desconectados'],
        recommendedSolutions: ['Sistema de Gestão sob medida', 'Dashboard de KPIs Executivo', 'Automação de processos']
      },
      {
        id: 'lead_seed_02',
        name: 'Dra. Carolina Betti',
        company: 'Clínica Bella Pele Dermatologia',
        email: 'carolina@bellapele.com.br',
        whatsapp: '(19) 99124-7788',
        solutionType: 'Aplicativo Mobile iOS / Android',
        projectDescription: 'App para agendamento automatizado de pacientes, prontuário digital e notificações de pós-procedimento.',
        budgetRange: 'R$ 20.000 - R$ 35.000',
        desiredTimeline: '1 a 2 meses',
        foundUsVia: 'Indicação de cliente',
        preferredContactMethod: 'WhatsApp',
        source: 'budget_modal',
        pageUrl: 'https://onesignal.tech/#servicos',
        utmSource: 'direct',
        utmMedium: 'referral',
        utmCampaign: 'institucional',
        createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'analyzing',
        priority: 'high',
        score: 80,
        notes: 'Proposta preliminar enviada por e-mail e WhatsApp.',
        activities: [
          {
            id: 'act_seed_2',
            leadId: 'lead_seed_02',
            type: 'status_change',
            description: 'Status alterado para "Em análise" por Carlos Mendes.',
            authorName: 'Carlos Mendes',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
          }
        ],
        lgpdConsent: true,
        diagnosticCompleted: false
      },
      {
        id: 'lead_seed_03',
        name: 'Guilherme Sampaio',
        company: 'AgroTech Sensores',
        email: 'guilherme@agrotech.ind.br',
        whatsapp: '(16) 98711-3322',
        solutionType: 'Automação & IoT Industrial',
        projectDescription: 'Conexão de sensores de umidade de solo e pivôs de irrigação com telemetria e controle via dashboard web.',
        budgetRange: 'R$ 40.000 - R$ 75.000',
        desiredTimeline: '2 a 3 meses',
        foundUsVia: 'Google / Pesquisa Orgânica',
        preferredContactMethod: 'E-mail',
        source: 'contact_section',
        pageUrl: 'https://onesignal.tech/#contato',
        utmSource: 'google',
        utmMedium: 'organic',
        utmCampaign: 'seo_automacao_iot',
        createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'negotiating',
        priority: 'high',
        score: 85,
        notes: 'Alinhando minuta contratual e cronograma de entrega das sprints.',
        activities: [
          {
            id: 'act_seed_3',
            leadId: 'lead_seed_03',
            type: 'status_change',
            description: 'Status alterado para "Em negociação".',
            authorName: 'Carlos Mendes',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          }
        ],
        lgpdConsent: true,
        diagnosticCompleted: true,
        digitalMaturity: 'Em evolução',
        diagnosticScore: 62,
        identifiedChallenges: ['Equipamentos sem telemetria em tempo real', 'Perda de tempo em inspeções manuais'],
        recommendedSolutions: ['Automação SCADA IoT', 'Dashboard de Telemetria']
      },
      {
        id: 'lead_seed_04',
        name: 'Juliana Fagundes',
        company: 'Solaris Imobiliária',
        email: 'juliana@solarisimoveis.com.br',
        whatsapp: '(41) 99655-4411',
        solutionType: 'Portal Web & CRM Imobiliário',
        projectDescription: 'Reformulação do portal de imóveis com integração com portais Zap/VivaReal e CRM para corretores.',
        budgetRange: 'R$ 15.000 - R$ 25.000',
        desiredTimeline: '1 mês',
        foundUsVia: 'Instagram (@onesignal_tech)',
        preferredContactMethod: 'WhatsApp',
        source: 'contact_section',
        pageUrl: 'https://onesignal.tech/#projetos',
        utmSource: 'instagram',
        utmMedium: 'reels',
        utmCampaign: 'lancamento_plataforma',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'converted',
        priority: 'medium',
        score: 65,
        notes: 'Contrato assinado! Projeto iniciado na sprint 1.',
        activities: [
          {
            id: 'act_seed_4',
            leadId: 'lead_seed_04',
            type: 'status_change',
            description: 'Status alterado para "Convertido" 🎉.',
            authorName: 'Luan Silva',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        lgpdConsent: true,
        diagnosticCompleted: false
      }
    ];
  }
}

export const leadService = new LeadService();
