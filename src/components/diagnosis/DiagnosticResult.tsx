import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Layers, 
  Cpu, 
  BarChart3, 
  Workflow, 
  Smartphone, 
  Users, 
  LayoutGrid, 
  ShieldCheck, 
  RotateCcw,
  ExternalLink,
  Send,
  PhoneCall,
  Mail,
  CalendarCheck
} from 'lucide-react';
import { DiagnosticResultData, ContactFormData, DigitalMaturityLevel } from '../../types';
import { getWhatsAppUrl } from '../../config/commercialConfig';
import { analytics } from '../../services/analyticsService';
import { leadService } from '../../services/leadService';

interface DiagnosticResultProps {
  result: DiagnosticResultData;
  onReset: () => void;
  onExploreServices: () => void;
  onSelectSolutionForQuote: (solutionTitle: string) => void;
  onOpenPrivacyPolicy?: () => void;
}

export const DiagnosticResult: React.FC<DiagnosticResultProps> = ({
  result,
  onReset,
  onExploreServices,
  onSelectSolutionForQuote,
  onOpenPrivacyPolicy
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    email: '',
    whatsapp: '',
    preferredContactMethod: 'WhatsApp',
    solutionType: result.recommendedSolutions[0]?.title || 'Sistema Web',
    budgetRange: 'A definir / Preciso de consultoria',
    desiredTimeline: '1 a 3 meses',
    description: `Diagnóstico realizado no site. Foco identificado em: ${result.recommendedSolutions.map(s => s.title).join(', ')}. Maturidade: ${result.maturityLevel}.`,
    lgpdConsent: true
  });

  const [formStarted, setFormStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const maturityTiers: { level: DigitalMaturityLevel; label: string; desc: string }[] = [
    { level: 'Em desenvolvimento', label: 'Em desenvolvimento', desc: 'Fase inicial de digitalização' },
    { level: 'Em evolução', label: 'Em evolução', desc: 'Processos digitais em expansão' },
    { level: 'Estruturada', label: 'Estruturada', desc: 'Boa base e rotinas consolidadas' },
    { level: 'Avançada', label: 'Avançada', desc: 'Alta escala e inovação contínua' }
  ];

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

  const handleFieldFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      analytics.track('diagnostic_lead_started', { maturityLevel: result.maturityLevel });
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const submissionPayload: ContactFormData = {
      ...formData,
      diagnosticData: {
        score: result.score,
        maturityLevel: result.maturityLevel,
        challenges: result.answers.challenges,
        recommendedSolutions: result.recommendedSolutions.map(s => s.title),
        answers: result.answers
      }
    };

    const res = await leadService.submitLead(submissionPayload, 'diagnostic_result');
    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
      analytics.track('diagnostic_lead_submitted', {
        maturityLevel: result.maturityLevel,
        topSolution: result.recommendedSolutions[0]?.title
      });
    } else if (res.errors) {
      setFormErrors(res.errors);
    }
  };

  const handleWhatsAppChat = () => {
    analytics.track('click_whatsapp', { source: 'diagnostic_result' });
    const url = getWhatsAppUrl('diagnostic_result', {
      digitalMaturity: result.maturityLevel,
      topSolution: result.recommendedSolutions[0]?.title
    });
    window.open(url, '_blank');
  };

  const getOpportunityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-[#22D3EE]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#2DD4BF]" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-emerald-400" />;
      case 'Workflow': return <Workflow className="w-5 h-5 text-cyan-400" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-teal-300" />;
      case 'Users': return <Users className="w-5 h-5 text-sky-400" />;
      default: return <Sparkles className="w-5 h-5 text-[#22D3EE]" />;
    }
  };

  const getSolutionIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutGrid': return <LayoutGrid className="w-6 h-6 text-[#22D3EE]" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-[#2DD4BF]" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-emerald-400" />;
      case 'Workflow': return <Workflow className="w-6 h-6 text-teal-300" />;
      case 'Users': return <Users className="w-6 h-6 text-cyan-400" />;
      default: return <Sparkles className="w-6 h-6 text-[#22D3EE]" />;
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn" id="diagnostic-results-view">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[#22D3EE] text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Diagnóstico Concluído com Sucesso</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Outfit'] text-white">
          Encontramos algumas oportunidades para o seu negócio.
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Análise inicial baseada nas informações fornecidas. Este relatório destaca os principais pontos de alavancagem para ganhos operacionais com tecnologia.
        </p>
      </div>

      {/* 1. Digital Maturity Gauge Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/15 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-300">
              Nível Estimado de Maturidade Digital
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {result.maturityLevel}
              </h3>
              <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200 text-xs font-mono border border-white/15">
                Índice: {result.score}/100
              </span>
            </div>
          </div>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refazer questionário</span>
          </button>
        </div>

        {/* Visual Multi-step Track */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {maturityTiers.map((tier) => {
              const isCurrent = result.maturityLevel === tier.level;
              return (
                <div 
                  key={tier.level}
                  className={`p-3 rounded-2xl border transition-all ${
                    isCurrent 
                      ? 'bg-gradient-to-br from-cyan-950/70 to-teal-950/70 border-[#22D3EE] shadow-lg shadow-cyan-500/10 text-white' 
                      : 'bg-white/[0.02] border-white/5 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-[#22D3EE] animate-pulse' : 'bg-slate-600'}`} />
                    <span className={isCurrent ? 'text-white' : 'text-slate-400'}>{tier.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    {tier.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed">
            💡 <strong className="text-white">Diagnóstico contextual:</strong> {result.maturityExplanation}
          </div>
        </div>
      </div>

      {/* 2. Top Identified Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#22D3EE]" />
          <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-white">
            Principais Oportunidades Identificadas
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.identifiedOpportunities.map((opp) => (
            <div 
              key={opp.id}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-2.5 hover:border-white/20 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                {getOpportunityIcon(opp.icon)}
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">
                {opp.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {opp.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recommended Solutions (1 to 3 cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
            <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-white">
              Soluções que Fazem Sentido para Sua Empresa
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline font-mono">
            {result.recommendedSolutions.length} recomendações
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {result.recommendedSolutions.map((sol) => (
            <div 
              key={sol.id}
              className="relative p-6 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-xl hover:border-cyan-400/40 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getSolutionIcon(sol.icon)}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-white/10">
                    {sol.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#22D3EE] transition-colors">
                    {sol.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {sol.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  <div className="bg-white/5 p-2.5 rounded-xl">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">O que resolve:</span>
                    <span className="text-slate-200">{sol.problemSolved}</span>
                  </div>
                  <div className="bg-teal-950/30 border border-teal-500/20 p-2.5 rounded-xl">
                    <span className="text-[10px] font-mono uppercase text-teal-300 block mb-0.5">Benefício potencial:</span>
                    <span className="text-teal-100 font-medium">{sol.potentialBenefit}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                id={`quote-sol-${sol.id}`}
                onClick={() => onSelectSolutionForQuote(sol.title)}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-[#22D3EE] hover:text-[#071B3A] text-white text-xs font-bold border border-white/15 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Solicitar proposta para esta solução</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Non-intrusive, Value-first Lead Capture Form */}
      <div 
        id="diagnostic-lead-capture"
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#071B3A] via-cyan-950/40 to-teal-950/40 border border-white/20 backdrop-blur-2xl shadow-2xl space-y-6"
      >
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-[#22D3EE] text-xs font-mono">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Próximos Passos Consultivos</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
            Quer transformar esse diagnóstico em um plano prático para sua empresa?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Deixe seus dados para que possamos entender melhor sua necessidade e conversar sobre possíveis caminhos para o seu projeto, sem compromisso de contratação.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Diagnóstico Registrado com Sucesso!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                Nossos arquitetos de soluções analisarão suas respostas e entrarão em contato pelo canal de sua preferência.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleWhatsAppChat}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Iniciar conversa agora no WhatsApp</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Seu Nome *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={formData.name}
                  onFocus={handleFieldFocus}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border ${formErrors.name ? 'border-rose-500' : 'border-white/15'} text-white text-xs sm:text-sm focus:border-[#22D3EE] outline-none`}
                />
                {formErrors.name && <span className="text-[10px] text-rose-400 mt-0.5 block">{formErrors.name}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Nome da Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Sua empresa"
                  value={formData.company}
                  onFocus={handleFieldFocus}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border ${formErrors.company ? 'border-rose-500' : 'border-white/15'} text-white text-xs sm:text-sm focus:border-[#22D3EE] outline-none`}
                />
                {formErrors.company && <span className="text-[10px] text-rose-400 mt-0.5 block">{formErrors.company}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">E-mail Corporativo *</label>
                <input
                  type="email"
                  required
                  placeholder="voce@empresa.com"
                  value={formData.email}
                  onFocus={handleFieldFocus}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border ${formErrors.email ? 'border-rose-500' : 'border-white/15'} text-white text-xs sm:text-sm focus:border-[#22D3EE] outline-none`}
                />
                {formErrors.email && <span className="text-[10px] text-rose-400 mt-0.5 block">{formErrors.email}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onFocus={handleFieldFocus}
                  onChange={handlePhoneChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border ${formErrors.whatsapp ? 'border-rose-500' : 'border-white/15'} text-white text-xs sm:text-sm focus:border-[#22D3EE] outline-none`}
                />
                {formErrors.whatsapp && <span className="text-[10px] text-rose-400 mt-0.5 block">{formErrors.whatsapp}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Melhor Forma de Contato</label>
                <select
                  value={formData.preferredContactMethod}
                  onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-200 text-xs focus:border-[#22D3EE] outline-none"
                >
                  <option value="WhatsApp" className="bg-[#071B3A] text-white">WhatsApp</option>
                  <option value="Email" className="bg-[#071B3A] text-white">E-mail</option>
                  <option value="Reuniao_Online" className="bg-[#071B3A] text-white">Reunião Online (Google Meet)</option>
                </select>
              </div>
            </div>

            {/* LGPD Consent */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.lgpdConsent !== false}
                  onChange={(e) => setFormData({ ...formData, lgpdConsent: e.target.checked })}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-white/30 text-teal-400 bg-white/10"
                />
                <span className="text-[11px] text-slate-300">
                  Concordo em receber um contato consultivo da equipe da OneSignal para avaliação do diagnóstico.{' '}
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

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                type="submit"
                id="submit-diagnostic-lead-btn"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl text-[#071B3A] font-bold text-xs sm:text-sm bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-[#071B3A] border-t-transparent animate-spin" />
                    Enviando dados...
                  </span>
                ) : (
                  <>
                    <span>Solicitar Análise Detalhada com Especialista</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <span className="text-[11px] text-slate-400">
                🔒 Sem spam. Contato 100% consultivo.
              </span>
            </div>
          </form>
        )}
      </div>

      {/* 5. Direct Action Buttons Footer */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h4 className="text-sm font-bold text-white">Prefere um contato imediato?</h4>
          <p className="text-xs text-slate-400">
            Nossa equipe técnica atende diretamente via WhatsApp em horário comercial.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            id="diagnostic-direct-whatsapp-btn"
            onClick={handleWhatsAppChat}
            className="px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 border border-emerald-400/30 transition-all shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Falar com Especialista no WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={onExploreServices}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold border border-white/15 transition-all flex items-center gap-1.5"
          >
            <span>Ver Catálogo de Serviços</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
