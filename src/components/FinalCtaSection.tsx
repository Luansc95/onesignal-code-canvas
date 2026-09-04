import React from 'react';
import { Sparkles, MessageSquare, ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { getWhatsAppUrl } from '../config/commercialConfig';
import { analytics } from '../services/analyticsService';

interface FinalCtaSectionProps {
  onOpenBudgetModal: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenBudgetModal }) => {
  const handleConsultativeWhatsApp = () => {
    analytics.track('click_whatsapp', { source: 'final_cta_section' });
    analytics.track('click_consultative_cta', { source: 'final_cta_section' });
    const url = getWhatsAppUrl('consultative');
    if (url) window.open(url, '_blank');
  };

  const handleBudgetClick = () => {
    analytics.track('click_primary_cta', { source: 'final_cta_section' });
    onOpenBudgetModal();
  };

  return (
    <section id="chamada-final" className="py-20 relative z-10 overflow-hidden bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Glow backdrop layers */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-[#22D3EE]/20 via-[#2DD4BF]/20 to-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Frosted Banner Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-white/[0.02] border border-white/20 p-8 sm:p-12 lg:p-16 shadow-2xl backdrop-blur-2xl text-center space-y-8 overflow-hidden">
          
          {/* Subtle Grid / Circuit Lines in Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#22D3EE]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2DD4BF]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Section Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#22D3EE] uppercase tracking-wider backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-[#2DD4BF]" />
            Próximo Passo Estratégico
          </div>

          {/* Main Title from Prompt Specification */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-['Outfit'] tracking-tight leading-tight">
              Sua próxima solução{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#2DD4BF] to-sky-300">
                pode começar agora.
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              Conte para nós o desafio da sua empresa e descubra como a tecnologia pode transformar seus processos, eliminar gargalos e acelerar seu crescimento.
            </p>
          </div>

          {/* CTAs Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-md mx-auto">
            {/* Primary CTA */}
            <button
              id="final-cta-budget-btn"
              onClick={handleBudgetClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-105 active:scale-95 group"
            >
              <Sparkles className="w-5 h-5 text-[#071B3A] group-hover:rotate-12 transition-transform" />
              <span>Solicitar orçamento</span>
              <ArrowRight className="w-5 h-5 text-[#071B3A] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Consultative / WhatsApp CTA */}
            <button
              id="final-cta-talk-btn"
              onClick={handleConsultativeWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm sm:text-base text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group"
            >
              <MessageSquare className="w-5 h-5 text-[#22D3EE] group-hover:scale-110 transition-transform" />
              <span>Falar com a OneSignal</span>
            </button>
          </div>

          {/* Assurance bullet points */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />
              Análise técnica preliminar sem compromisso
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
              Acordo de Confidencialidade (NDA)
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />
              Retorno ágil em até 24 horas úteis
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
