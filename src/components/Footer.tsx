import React from 'react';
import { 
  Radio, 
  ArrowUp, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  ShieldCheck,
  Heart,
  Code2
} from 'lucide-react';
import { COMMERCIAL_CONFIG } from '../config/commercialConfig';
import { analytics } from '../services/analyticsService';

interface FooterProps {
  onOpenBudgetModal: () => void;
  onOpenPrivacyPolicy?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBudgetModal, onOpenPrivacyPolicy }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#071B3A]/80 border-t border-white/10 text-slate-300 text-sm relative z-10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <a href="#inicio" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md">
                <Radio className="w-5 h-5 text-[#22D3EE]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight font-['Outfit'] text-white">
                One<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF]">Signal</span>
              </span>
            </a>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              Desenvolvemos sistemas web, aplicativos, automações e soluções tecnológicas 
              personalizadas para transformar processos e impulsionar negócios.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href={COMMERCIAL_CONFIG.social.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-[#22D3EE] border border-white/15 flex items-center justify-center transition-colors backdrop-blur-sm"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href={COMMERCIAL_CONFIG.social.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-[#22D3EE] border border-white/15 flex items-center justify-center transition-colors backdrop-blur-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={`mailto:${COMMERCIAL_CONFIG.commercialEmail}`} 
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-[#22D3EE] border border-white/15 flex items-center justify-center transition-colors backdrop-blur-sm"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#22D3EE] font-bold">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#inicio" className="text-slate-300 hover:text-white transition-colors">Início</a>
              </li>
              <li>
                <a href="#diagnostico" className="text-[#22D3EE] hover:text-white font-medium transition-colors">Diagnóstico Interativo</a>
              </li>
              <li>
                <a href="#servicos" className="text-slate-300 hover:text-white transition-colors">Serviços</a>
              </li>
              <li>
                <a href="#projetos" className="text-slate-300 hover:text-white transition-colors">Portfólio de Projetos</a>
              </li>
              <li>
                <a href="#metodologia" className="text-slate-300 hover:text-white transition-colors">Como Trabalhamos</a>
              </li>
              <li>
                <a href="#sobre" className="text-slate-300 hover:text-white transition-colors">Sobre a OneSignal</a>
              </li>
              <li>
                <a href="#contato" className="text-slate-300 hover:text-white transition-colors">Contato & Orçamento</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#22D3EE] font-bold">
              Soluções Sob Medida
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#servicos" className="text-slate-300 hover:text-white transition-colors">Sistemas Web & SaaS</a>
              </li>
              <li>
                <a href="#servicos" className="text-slate-300 hover:text-white transition-colors">Aplicativos Android & iOS</a>
              </li>
              <li>
                <a href="#servicos" className="text-slate-300 hover:text-white transition-colors">Automação de Processos & RPA</a>
              </li>
              <li>
                <a href="#servicos" className="text-slate-300 hover:text-white transition-colors">Sistemas de Gestão ERP & CRM</a>
              </li>
              <li>
                <a href="#servicos" className="text-slate-300 hover:text-white transition-colors">Inteligência Artificial & LLMs</a>
              </li>
              <li>
                <a href="#servicos" className="text-slate-300 hover:text-white transition-colors">Cibersegurança & LGPD</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Fast Contact & Action (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#22D3EE] font-bold">
              Solicite uma Proposta
            </h4>
            <p className="text-xs text-slate-300">
              Receba um diagnóstico técnico e orçamento detalhado sem compromisso.
            </p>
            <button
              id="footer-quote-btn"
              onClick={() => {
                analytics.track('click_budget', { source: 'footer_column' });
                onOpenBudgetModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Solicitar Orçamento
            </button>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#2DD4BF]">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantia de sigilo de projeto (NDA)</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-400">
            © {new Date().getFullYear()} OneSignal Soluções Tecnológicas. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            {onOpenPrivacyPolicy ? (
              <button 
                id="footer-privacy-btn"
                onClick={() => {
                  analytics.track('privacy_policy_open', { source: 'footer' });
                  onOpenPrivacyPolicy();
                }}
                className="hover:text-white underline"
              >
                Privacidade & LGPD
              </button>
            ) : (
              <span>Privacidade & Termos</span>
            )}
            <span>•</span>
            <a href="/admin" className="hover:text-[#22D3EE] transition-colors">
              Área Administrativa
            </a>
            <span>•</span>
            <span>Código 100% Proprietário</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/10 text-[#22D3EE] hover:text-white hover:bg-white/20 border border-white/15 transition-colors ml-2 backdrop-blur-sm"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
