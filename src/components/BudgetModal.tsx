import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, CheckCircle2, ShieldCheck, Clock, MessageSquare, ArrowRight, DollarSign, Calendar } from 'lucide-react';
import { ContactFormData } from '../types';
import { leadService } from '../services/leadService';
import { getWhatsAppUrl } from '../config/commercialConfig';
import { useCompanySettings } from '../hooks/useCompanySettings';
import { analytics } from '../services/analyticsService';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceType?: string;
  initialDescription?: string;
  onOpenPrivacyPolicy?: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  initialServiceType,
  initialDescription,
  onOpenPrivacyPolicy
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    whatsapp: '',
    email: '',
    solutionType: initialServiceType || 'Sistema Web',
    budgetRange: 'R$ 20.000 a R$ 50.000',
    desiredTimeline: '1 a 3 meses',
    foundUsVia: 'Google / Pesquisa',
    description: initialDescription || '',
    lgpdConsent: true
  });

  const [formStarted, setFormStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialServiceType) {
      setFormData(prev => ({ ...prev, solutionType: initialServiceType }));
    }
    if (initialDescription) {
      setFormData(prev => ({ ...prev, description: initialDescription }));
    }
  }, [initialServiceType, initialDescription]);

  if (!isOpen) return null;

  const handleFieldFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      analytics.track('start_contact_form', { source: 'budget_modal' });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    if (val.length > 6) {
      val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    }
    setFormData({ ...formData, whatsapp: val });
    if (formErrors.whatsapp) {
      setFormErrors(prev => {
        const copy = { ...prev };
        delete copy.whatsapp;
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const result = await leadService.submitLead(formData, 'budget_modal');
    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else if (result.errors) {
      setFormErrors(result.errors);
    }
  };

  const solutionTypes = [
    'Sistema Web',
    'Aplicativo Mobile',
    'Sistema de Gestão',
    'Automação',
    'Dashboard',
    'Inteligência Artificial',
    'Outro'
  ];

  const budgetOptions = [
    'Até R$ 15.000',
    'R$ 15.000 a R$ 35.000',
    'R$ 35.000 a R$ 75.000',
    'Acima de R$ 75.000',
    'A definir / Preciso de consultoria'
  ];

  const timelineOptions = [
    'Urgente (menos de 1 mês)',
    '1 a 3 meses',
    '3 a 6 meses',
    'Flexível / Planejamento'
  ];

  return (
    <div 
      id="budget-request-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#071B3A]/95 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 backdrop-blur-2xl my-8 space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-budget-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white border border-white/15 transition-colors"
          aria-label="Fechar formulário de orçamento"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/50 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white font-['Outfit']">
              Proposta Solicitada com Sucesso!
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Recebemos sua solicitação para <strong className="text-[#22D3EE]">{formData.solutionType}</strong>. Nossa equipe técnica entrará em contato pelo WhatsApp <strong className="text-white">{formData.whatsapp}</strong> ou e-mail.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                id="modal-success-whatsapp-btn"
                onClick={() => {
                  analytics.track('click_whatsapp', { source: 'budget_modal_success' });
                  const url = getWhatsAppUrl('budget_request', {
                    clientName: formData.name,
                    companyName: formData.company,
                    serviceTitle: formData.solutionType
                  });
                  if (url) window.open(url, '_blank');
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                Continuar no WhatsApp
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs sm:text-sm border border-white/15"
              >
                Fechar Janela
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#22D3EE] text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                ORÇAMENTO TÉCNICO ONESIGNAL
              </div>
              <h3 className="text-2xl font-bold text-white font-['Outfit']">
                Solicite uma Proposta Sob Medida
              </h3>
              <p className="text-xs text-slate-300">
                Receba um diagnóstico completo e estimativa de cronograma.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">Seu Nome *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={formData.name}
                  onFocus={handleFieldFocus}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border ${formErrors.name ? 'border-rose-500' : 'border-white/10'} text-white text-sm focus:border-[#22D3EE] outline-none`}
                />
                {formErrors.name && <span className="text-[10px] text-rose-400 mt-0.5 block">{formErrors.name}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">Sua Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome da empresa"
                  value={formData.company}
                  onFocus={handleFieldFocus}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border ${formErrors.company ? 'border-rose-500' : 'border-white/10'} text-white text-sm focus:border-[#22D3EE] outline-none`}
                />
                {formErrors.company && <span className="text-[10px] text-rose-400 mt-0.5 block">{formErrors.company}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onFocus={handleFieldFocus}
                  onChange={handlePhoneChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border ${formErrors.whatsapp ? 'border-rose-500' : 'border-white/10'} text-white text-sm focus:border-[#22D3EE] outline-none`}
                />
                {formErrors.whatsapp && <span className="text-[10px] text-rose-400 mt-0.5 block">{formErrors.whatsapp}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">E-mail *</label>
                <input
                  type="email"
                  required
                  placeholder="voce@empresa.com"
                  value={formData.email}
                  onFocus={handleFieldFocus}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border ${formErrors.email ? 'border-rose-500' : 'border-white/10'} text-white text-sm focus:border-[#22D3EE] outline-none`}
                />
                {formErrors.email && <span className="text-[10px] text-rose-400 mt-0.5 block">{formErrors.email}</span>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">Solução Desejada *</label>
              <div className="flex flex-wrap gap-1.5">
                {solutionTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, solutionType: t })}
                    className={`px-3 py-1 text-xs rounded-xl transition-all ${
                      formData.solutionType === t
                        ? 'bg-white/20 text-white border border-white/30 font-semibold'
                        : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Qualification options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#2DD4BF]" />
                  Orçamento Estimado
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs focus:border-[#22D3EE] outline-none"
                >
                  {budgetOptions.map(o => (
                    <option key={o} value={o} className="bg-[#071B3A] text-white">{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#22D3EE]" />
                  Prazo Desejado
                </label>
                <select
                  value={formData.desiredTimeline}
                  onChange={(e) => setFormData({ ...formData, desiredTimeline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs focus:border-[#22D3EE] outline-none"
                >
                  {timelineOptions.map(o => (
                    <option key={o} value={o} className="bg-[#071B3A] text-white">{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">Descrição do Projeto</label>
              <textarea
                rows={2}
                placeholder="Principais funcionalidades ou objetivos..."
                value={formData.description}
                onFocus={handleFieldFocus}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#22D3EE] outline-none leading-relaxed"
              />
            </div>

            {/* LGPD Consent */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.lgpdConsent !== false}
                  onChange={(e) => setFormData({ ...formData, lgpdConsent: e.target.checked })}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-white/30 text-teal-400 bg-white/10"
                />
                <span className="text-[11px] text-slate-300">
                  Concordo com o tratamento dos dados para contato comercial.{' '}
                  {onOpenPrivacyPolicy && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenPrivacyPolicy();
                      }}
                      className="text-[#22D3EE] underline hover:text-white font-semibold inline"
                    >
                      Privacidade (LGPD)
                    </button>
                  )}
                </span>
              </label>
              {formErrors.lgpdConsent && (
                <span className="text-[10px] text-rose-400 block pl-5">{formErrors.lgpdConsent}</span>
              )}
            </div>

            <button
              id="submit-modal-quote-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl text-[#071B3A] font-bold text-sm bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-[#071B3A] border-t-transparent animate-spin" />
                  Processando...
                </span>
              ) : (
                <>
                  <span>Solicitar Orçamento Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

