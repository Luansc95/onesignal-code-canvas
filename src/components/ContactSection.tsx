import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  Mail, 
  Phone, 
  Building, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Linkedin,
  Instagram,
  FileCheck,
  AlertCircle,
  Calendar,
  DollarSign,
  Compass
} from 'lucide-react';
import { ContactFormData } from '../types';
import { leadService } from '../services/leadService';
import { getWhatsAppUrl, COMMERCIAL_CONFIG } from '../config/commercialConfig';
import { analytics } from '../services/analyticsService';

interface ContactSectionProps {
  initialServiceType?: string;
  initialDescription?: string;
  onOpenPrivacyPolicy?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ 
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
    budgetRange: 'R$ 15.000 a R$ 35.000',
    desiredTimeline: '1 a 3 meses',
    foundUsVia: 'Google / Pesquisa',
    description: initialDescription || '',
    lgpdConsent: true
  });

  const [formStarted, setFormStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Track initial interaction
  const handleFieldFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      analytics.track('start_contact_form', { source: 'contact_section' });
    }
  };

  // Sync props if changed from another button
  useEffect(() => {
    if (initialServiceType) {
      setFormData((prev) => ({ ...prev, solutionType: initialServiceType }));
    }
    if (initialDescription) {
      setFormData((prev) => ({ ...prev, description: initialDescription }));
    }
  }, [initialServiceType, initialDescription]);

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

  const sourceOptions = [
    'Indicação de parceiro',
    'Google / Pesquisa',
    'LinkedIn / Redes Sociais',
    'Evento / Outro'
  ];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    
    // Mask (11) 99999-9999
    if (val.length > 6) {
      val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    }
    setFormData({ ...formData, whatsapp: val });
    if (formErrors.whatsapp) {
      setFormErrors((prev) => {
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

    const result = await leadService.submitLead(formData, 'contact_section');

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
      setSubmittedData({ ...formData });
    } else if (result.errors) {
      setFormErrors(result.errors);
    }
  };

  const handleWhatsAppDirect = () => {
    analytics.track('click_whatsapp', { source: 'contact_section_direct' });
    const url = getWhatsAppUrl('budget_request', {
      clientName: formData.name,
      companyName: formData.company,
      serviceTitle: formData.solutionType
    });
    if (url) window.open(url, '_blank');
  };

  return (
    <section id="contato" className="py-24 relative z-10 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#22D3EE] text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Inicie Seu Projeto
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight leading-tight">
            Vamos transformar sua ideia em uma{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#2DD4BF] to-sky-300">
              solução tecnológica?
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Preencha os detalhes abaixo para receber uma análise técnica preliminar 
            e proposta detalhada de nossa equipe de engenharia em até 24 horas úteis.
          </p>
        </div>

        {/* Main Grid: Form + Direct Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Interactive Form or Success State */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-white/5 border border-white/15 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              
              {isSubmitted && submittedData ? (
                /* Success Confirmation State */
                <div id="quote-success-state" className="space-y-6 py-4 animate-fade-in text-center sm:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/50 flex items-center justify-center mx-auto sm:mx-0 text-teal-300">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white font-['Outfit']">
                      Solicitação Recebida com Sucesso!
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Obrigado, <strong className="text-[#22D3EE]">{submittedData.name}</strong>. 
                      Nossos especialistas em engenharia e produto já estão analisando o escopo do seu projeto para a empresa <strong className="text-white">{submittedData.company || 'sua empresa'}</strong>.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-left text-xs text-slate-300 backdrop-blur-sm">
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-slate-400">Tipo de Solução:</span>
                      <span className="font-semibold text-[#22D3EE]">{submittedData.solutionType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-slate-400">E-mail:</span>
                      <span className="text-white">{submittedData.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-slate-400">WhatsApp:</span>
                      <span className="text-white">{submittedData.whatsapp}</span>
                    </div>
                    {submittedData.budgetRange && (
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-slate-400">Faixa de Investimento:</span>
                        <span className="text-[#2DD4BF]">{submittedData.budgetRange}</span>
                      </div>
                    )}
                    {submittedData.desiredTimeline && (
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-slate-400">Prazo Desejado:</span>
                        <span className="text-white">{submittedData.desiredTimeline}</span>
                      </div>
                    )}
                    <div className="py-1">
                      <span className="text-slate-400 block mb-1">Escopo solicitado:</span>
                      <p className="text-slate-200 italic bg-white/5 p-3 rounded-xl border border-white/10">
                        {submittedData.description || 'Proposta técnica sob medida'}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      id="whatsapp-chat-now-btn"
                      onClick={handleWhatsAppDirect}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/40 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Falar agora pelo WhatsApp
                    </button>

                    <button
                      id="new-quote-request-btn"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          company: '',
                          whatsapp: '',
                          email: '',
                          solutionType: 'Sistema Web',
                          budgetRange: 'R$ 15.000 a R$ 35.000',
                          desiredTimeline: '1 a 3 meses',
                          foundUsVia: 'Google / Pesquisa',
                          description: '',
                          lgpdConsent: true
                        });
                      }}
                      className="px-5 py-3 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/10 border border-white/15"
                    >
                      Enviar nova solicitação
                    </button>
                  </div>
                </div>
              ) : (
                /* Contact / Quote Form */
                <form id="quote-request-form" onSubmit={handleSubmit} className="space-y-5">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nome */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                        Seu Nome *
                      </label>
                      <input
                        id="input-contact-name"
                        type="text"
                        required
                        placeholder="Ex: Carlos Eduardo"
                        value={formData.name}
                        onFocus={handleFieldFocus}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${formErrors.name ? 'border-rose-500' : 'border-white/10'} focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] text-white text-sm placeholder-slate-500 outline-none transition-all`}
                      />
                      {formErrors.name && (
                        <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.name}</span>
                      )}
                    </div>

                    {/* Empresa */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                        Nome da Empresa *
                      </label>
                      <input
                        id="input-contact-company"
                        type="text"
                        required
                        placeholder="Ex: Alfa Logística S/A"
                        value={formData.company}
                        onFocus={handleFieldFocus}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${formErrors.company ? 'border-rose-500' : 'border-white/10'} focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] text-white text-sm placeholder-slate-500 outline-none transition-all`}
                      />
                      {formErrors.company && (
                        <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.company}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                        WhatsApp com DDD *
                      </label>
                      <input
                        id="input-contact-whatsapp"
                        type="text"
                        required
                        placeholder="(11) 99999-9999"
                        value={formData.whatsapp}
                        onFocus={handleFieldFocus}
                        onChange={handlePhoneChange}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${formErrors.whatsapp ? 'border-rose-500' : 'border-white/10'} focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] text-white text-sm placeholder-slate-500 outline-none transition-all`}
                      />
                      {formErrors.whatsapp && (
                        <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.whatsapp}</span>
                      )}
                    </div>

                    {/* E-mail */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                        E-mail Corporativo *
                      </label>
                      <input
                        id="input-contact-email"
                        type="email"
                        required
                        placeholder="carlos@suaempresa.com.br"
                        value={formData.email}
                        onFocus={handleFieldFocus}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${formErrors.email ? 'border-rose-500' : 'border-white/10'} focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] text-white text-sm placeholder-slate-500 outline-none transition-all`}
                      />
                      {formErrors.email && (
                        <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.email}</span>
                      )}
                    </div>
                  </div>

                  {/* Tipo de Solução Desejada */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Tipo de Solução Desejada *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {solutionTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          id={`chip-solution-${type.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setFormData({ ...formData, solutionType: type })}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all backdrop-blur-sm ${
                            formData.solutionType === type
                              ? 'bg-white/20 text-white border border-white/30 shadow-sm font-semibold'
                              : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Qualification Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                    {/* Faixa de Orçamento */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-[#2DD4BF]" />
                        Faixa de Orçamento (Opcional)
                      </label>
                      <select
                        id="select-contact-budget"
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs focus:border-[#22D3EE] outline-none"
                      >
                        {budgetOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#071B3A] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Prazo Desejado */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#22D3EE]" />
                        Prazo Desejado (Opcional)
                      </label>
                      <select
                        id="select-contact-timeline"
                        value={formData.desiredTimeline}
                        onChange={(e) => setFormData({ ...formData, desiredTimeline: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs focus:border-[#22D3EE] outline-none"
                      >
                        {timelineOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#071B3A] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Como nos Conheceu */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                        <Compass className="w-3 h-3 text-sky-400" />
                        Como nos Conheceu?
                      </label>
                      <select
                        id="select-contact-source"
                        value={formData.foundUsVia}
                        onChange={(e) => setFormData({ ...formData, foundUsVia: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs focus:border-[#22D3EE] outline-none"
                      >
                        {sourceOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#071B3A] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Descrição do Projeto */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Descrição do Projeto e Desafios
                    </label>
                    <textarea
                      id="input-contact-description"
                      rows={3}
                      placeholder="Conte-nos os objetivos do projeto, funcionalidades necessárias, dores atuais da sua operação ou integrações que você precisa..."
                      value={formData.description}
                      onFocus={handleFieldFocus}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] text-white text-sm placeholder-slate-500 outline-none transition-all leading-relaxed"
                    />
                  </div>

                  {/* LGPD Consent */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.lgpdConsent !== false}
                        onChange={(e) => setFormData({ ...formData, lgpdConsent: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded border-white/30 text-teal-400 focus:ring-0 focus:ring-offset-0 bg-white/10"
                      />
                      <span className="text-[11px] text-slate-300 leading-relaxed">
                        Ao enviar seus dados, você concorda com o tratamento das informações fornecidas para que a OneSignal possa entrar em contato sobre sua solicitação.{' '}
                        {onOpenPrivacyPolicy && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              analytics.track('privacy_policy_open', { source: 'contact_form' });
                              onOpenPrivacyPolicy();
                            }}
                            className="text-[#22D3EE] underline hover:text-white inline ml-1 font-semibold"
                          >
                            Ver Política de Privacidade
                          </button>
                        )}
                      </span>
                    </label>
                    {formErrors.lgpdConsent && (
                      <span className="text-[11px] text-rose-400 block pl-6">{formErrors.lgpdConsent}</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    id="submit-quote-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl font-extrabold text-sm sm:text-base text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-xl shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 text-[#071B3A]">
                        <span className="w-4 h-4 rounded-full border-2 border-[#071B3A] border-t-transparent animate-spin" />
                        Processando dados técnicos...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-[#071B3A]" />
                        <span>Solicitar orçamento</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 text-center">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
                      Dados protegidos por sigilo (NDA)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#22D3EE]" />
                      Retorno em até 24 horas
                    </span>
                  </div>

                </form>
              )}

            </div>
          </div>

          {/* Right Column: Direct Channels, Support & Credentials */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct WhatsApp Fast Track Card */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/15 shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">Atendimento Direto WhatsApp</h3>
                  <p className="text-xs text-slate-300">Converse em tempo real com nossos especialistas</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Precisa de uma avaliação imediata de viabilidade técnica ou tirar dúvidas sobre prazos e tecnologias?
              </p>

              <button
                id="sidebar-whatsapp-direct-btn"
                onClick={handleWhatsAppDirect}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/40 flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Iniciar Conversa no WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Corporate Info Card */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4 text-xs text-slate-300">
              <h4 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider text-[#22D3EE]">
                Canais de Atendimento OneSignal
              </h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#22D3EE] mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">E-mail Comercial:</span>
                    <a href={`mailto:${COMMERCIAL_CONFIG.commercialEmail}`} className="text-white hover:text-[#22D3EE] font-mono">
                      {COMMERCIAL_CONFIG.commercialEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="w-4 h-4 text-[#2DD4BF] mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sede de Engenharia & Inovação:</span>
                    <span className="text-white">{COMMERCIAL_CONFIG.address.street}, {COMMERCIAL_CONFIG.address.city} - {COMMERCIAL_CONFIG.address.state}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-sky-400 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Horário de Operação:</span>
                    <span className="text-white">{COMMERCIAL_CONFIG.businessHours}</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <span className="text-slate-400 text-[11px]">Redes Oficiais:</span>
                <a 
                  href={COMMERCIAL_CONFIG.social.linkedin}
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-[#22D3EE] border border-white/15 transition-colors"
                  aria-label="LinkedIn OneSignal"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href={COMMERCIAL_CONFIG.social.instagram}
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-[#22D3EE] border border-white/15 transition-colors"
                  aria-label="Instagram OneSignal"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

