/**
 * Centralized Lead Management & Integration Service for OneSignal
 * Validates, sanitizes, tracks attribution (UTMs/Referrers), and processes leads.
 * Structured with a clean data model prepared for future CRM/Database/Email/Webhook integrations.
 */

import { Lead, ContactFormData } from '../types';
import { getUtmParameters } from '../config/commercialConfig';
import { analytics } from './analyticsService';

const STORAGE_KEY = 'onesignal_leads_v1';

export interface LeadSubmissionResult {
  success: boolean;
  lead?: Lead;
  errors?: Record<string, string>;
  message: string;
}

class LeadService {
  /**
   * Sanitizes text input to prevent XSS or malicious payloads
   */
  private sanitize(input?: string): string {
    if (!input) return '';
    return input
      .trim()
      .replace(/[<>]/g, '') // remove HTML tags
      .slice(0, 1500); // sensible max length
  }

  /**
   * Validates form inputs before submission
   */
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

  /**
   * Submits a new Lead with source attribution, UTM tracking, and persistence
   */
  public async submitLead(
    formData: ContactFormData,
    sourceContext = 'contact_section'
  ): Promise<LeadSubmissionResult> {
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

    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: this.sanitize(formData.name),
      company: this.sanitize(formData.company),
      email: this.sanitize(formData.email).toLowerCase(),
      whatsapp: this.sanitize(formData.whatsapp),
      solutionType: this.sanitize(formData.solutionType) || 'Sistema Web',
      projectDescription: this.sanitize(formData.description),
      budgetRange: formData.budgetRange ? this.sanitize(formData.budgetRange) : undefined,
      desiredTimeline: formData.desiredTimeline || formData.timeline ? this.sanitize(formData.desiredTimeline || formData.timeline) : undefined,
      foundUsVia: formData.foundUsVia ? this.sanitize(formData.foundUsVia) : undefined,
      preferredContactMethod: formData.preferredContactMethod ? this.sanitize(formData.preferredContactMethod) : undefined,
      source: sourceContext,
      pageUrl,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      referrer: utm.referrer,
      createdAt: new Date().toISOString(),
      status: 'new',
      notes: undefined,
      lgpdConsent: formData.lgpdConsent ?? true,
      // Diagnostic Data
      diagnosticCompleted: !!formData.diagnosticData,
      digitalMaturity: formData.diagnosticData?.maturityLevel,
      diagnosticScore: formData.diagnosticData?.score,
      identifiedChallenges: formData.diagnosticData?.challenges,
      recommendedSolutions: formData.diagnosticData?.recommendedSolutions,
      diagnosticAnswers: formData.diagnosticData?.answers
    };

    try {
      // 1. Persist locally to preserve leads safely
      this.saveLeadLocally(newLead);

      // 2. Prepared pipeline for future REST API or CRM Webhook:
      // if (process.env.CRM_WEBHOOK_URL) {
      //   await fetch(process.env.CRM_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(newLead) });
      // }

      // 3. Track conversion event
      analytics.track('contact_form_success', {
        leadId: newLead.id,
        solutionType: newLead.solutionType,
        source: newLead.source,
        hasBudget: !!newLead.budgetRange,
        hasTimeline: !!newLead.desiredTimeline
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

  /**
   * Saves lead in local storage queue
   */
  private saveLeadLocally(lead: Lead): void {
    if (typeof window === 'undefined') return;
    try {
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      const leads: Lead[] = existingRaw ? JSON.parse(existingRaw) : [];
      leads.unshift(lead);
      // Keep last 100 entries
      const trimmed = leads.slice(0, 100);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('[OneSignal LeadService] Local storage warning:', e);
    }
  }

  /**
   * Retrieves all stored leads (for administration or diagnostics)
   */
  public getStoredLeads(): Lead[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const leadService = new LeadService();
