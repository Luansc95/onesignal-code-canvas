/**
 * Centralized Contact Management Service for OneSignal Admin
 * Organizes direct inquiries, prevents duplication, and supports 1-click Lead conversion.
 */

import { ContactMessage, Lead } from '../types';
import { leadService } from './leadService';
import { analytics } from './analyticsService';

const CONTACTS_STORAGE_KEY = 'onesignal_contacts_v1';

class ContactService {
  private contacts: ContactMessage[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (this.isInitialized) return;
    if (typeof window === 'undefined') {
      this.contacts = this.getSeedContacts();
      return;
    }

    try {
      const stored = localStorage.getItem(CONTACTS_STORAGE_KEY);
      if (stored) {
        this.contacts = JSON.parse(stored);
      } else {
        this.contacts = this.getSeedContacts();
        this.persist();
      }
    } catch {
      this.contacts = this.getSeedContacts();
    }
    this.isInitialized = true;
  }

  private persist(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(this.contacts));
    } catch (e) {
      console.warn('[OneSignal ContactService] Storage warning:', e);
    }
  }

  public getAllContacts(): ContactMessage[] {
    this.init();
    return [...this.contacts];
  }

  public getContactById(id: string): ContactMessage | undefined {
    this.init();
    return this.contacts.find((c) => c.id === id);
  }

  public addContact(contact: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    this.init();
    const created: ContactMessage = {
      ...contact,
      id: `cont_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    this.contacts.unshift(created);
    this.persist();
    return created;
  }

  public updateContactStatus(id: string, status: ContactMessage['status']): ContactMessage | null {
    this.init();
    const idx = this.contacts.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    this.contacts[idx].status = status;
    this.persist();
    return this.contacts[idx];
  }

  public convertToLead(contactId: string): Lead | null {
    this.init();
    const contact = this.contacts.find((c) => c.id === contactId);
    if (!contact) return null;

    const leadSubmission = leadService.submitLead(
      {
        name: contact.name,
        company: contact.company,
        email: contact.email,
        whatsapp: contact.whatsapp,
        solutionType: contact.serviceType || 'Sistema Web Sob Medida',
        description: contact.message,
        lgpdConsent: true
      },
      'contact_conversion'
    );

    contact.status = 'converted';
    this.persist();

    return leadService.getAllLeads()[0] || null;
  }

  public deleteContact(id: string): boolean {
    this.init();
    const initial = this.contacts.length;
    this.contacts = this.contacts.filter((c) => c.id !== id);
    if (this.contacts.length !== initial) {
      this.persist();
      return true;
    }
    return false;
  }

  private getSeedContacts(): ContactMessage[] {
    return [
      {
        id: 'cont_seed_01',
        name: 'Marcos Vinicius',
        company: 'LogExpress Cargas',
        email: 'marcos@logexpress.com.br',
        whatsapp: '(11) 97100-3344',
        subject: 'Orçamento de aplicativo para motoristas',
        message: 'Gostaria de saber o prazo médio para o desenvolvimento de um aplicativo de entregas com assinatura na tela e modo offline.',
        serviceType: 'Aplicativo Mobile',
        source: 'Formulário de Contato Geral',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        status: 'new'
      },
      {
        id: 'cont_seed_02',
        name: 'Patrícia Oliveira',
        company: 'Hospital MedCenter',
        email: 'patricia@medcenter.org.br',
        whatsapp: '(31) 98899-2211',
        subject: 'Integração de prontuário com portal do paciente',
        message: 'Temos um sistema legado e precisamos construir uma API intermediária e um portal web seguro para os pacientes acessarem exames.',
        serviceType: 'Integração de Sistemas',
        source: 'Diagnóstico Inteligente',
        createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
        status: 'read'
      }
    ];
  }
}

export const contactService = new ContactService();
