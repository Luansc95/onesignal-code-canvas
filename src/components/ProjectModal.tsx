import React from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Tag, 
  Layers, 
  Calendar, 
  Building2, 
  TrendingUp, 
  AlertCircle, 
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { Project } from '../types';
import { ProjectMockup } from './ProjectMockup';
import { analytics } from '../services/analyticsService';
import { getWhatsAppUrl } from '../config/commercialConfig';
import { useCompanySettings } from '../hooks/useCompanySettings';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSimilarProjectQuote: (projectName: string, category: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ 
  project, 
  onClose, 
  onSimilarProjectQuote 
}) => {
  if (!project) return null;

  const hasWhatsapp = Boolean(settings.rawWhatsappNumber);

  const handleWhatsAppCase = () => {
    analytics.track('click_whatsapp', { source: 'project_modal', projectName: project.name });
    const url = getWhatsAppUrl('project_case', { projectName: project.name });
    if (url) window.open(url, '_blank');
  };

  const handleSimilarProject = () => {
    analytics.track('click_consultative_cta', { source: 'project_modal', projectName: project.name });
    onClose();
    onSimilarProjectQuote(project.name, project.categoryLabel);
  };

  return (
    <div 
      id="project-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="project-detail-modal-container"
        className="relative w-full max-w-4xl bg-[#071B3A] border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/95 my-auto max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Title & Close Button */}
        <div className="p-5 sm:p-6 md:p-8 bg-[#071B3A] border-b border-white/10 shrink-0 relative">
          {/* Modal Close Button */}
          <button
            id="close-project-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/20 transition-all backdrop-blur-md flex items-center justify-center active:scale-95"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="pr-12 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[#22D3EE] font-mono text-xs font-semibold">
                {project.categoryLabel}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-300 font-medium">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                {project.clientType}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-300 font-medium">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {project.year}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              {project.name}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
              {project.tagline}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 overflow-y-auto flex-1 overscroll-contain">
          
          {/* Dedicated Interface Showcase Frame */}
          <div className="rounded-2xl border border-cyan-500/30 bg-[#040D1A] overflow-hidden shadow-2xl shadow-cyan-950/50">
            <ProjectMockup type={project.imagePlaceholderType} title={project.name} variant="modal" />
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* O Desafio */}
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm font-['Outfit'] uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>O Desafio</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {project.challenge}
              </p>
            </div>

            {/* A Solução */}
            <div className="p-5 rounded-2xl bg-teal-500/10 border border-teal-500/25 space-y-2.5 backdrop-blur-sm shadow-inner">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-sm font-['Outfit'] uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-teal-400" />
                <span>A Solução OneSignal</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {project.solution}
              </p>
            </div>

          </div>

          {/* Principais Funcionalidades */}
          <div className="space-y-3.5">
            <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#22D3EE]" />
              Principais Funcionalidades Implementadas
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {project.features.map((feature, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-colors space-y-1.5 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-cyan-200">
                    <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                    <span>{feature.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Resultados e Benefícios */}
          <div className="space-y-3.5">
            <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2DD4BF]" />
              Resultados e Impacto Medido
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {project.results.map((res, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-white/5 border border-white/15 text-center space-y-1 backdrop-blur-sm"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#22D3EE] font-['Outfit']">
                    {res.metric}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {res.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tecnologias Utilizadas */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#22D3EE]" />
              Tecnologias & Arquitetura
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 text-xs font-mono font-medium rounded-xl bg-white/10 text-[#22D3EE] border border-white/15 backdrop-blur-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer with Primary Conversion CTA */}
        <div className="p-4 sm:p-5 md:p-6 bg-white/[0.03] border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl shrink-0">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xs sm:text-sm font-bold text-white font-['Outfit'] flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              Sua empresa enfrenta um desafio semelhante?
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-300">
              Nossa equipe pode desenvolver uma solução adaptada às necessidades do seu negócio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full md:w-auto shrink-0">
{hasWhatsapp && (
            <button
              id="modal-whatsapp-case-btn"
              onClick={handleWhatsAppCase}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 transition-colors flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Tirar dúvidas no WhatsApp</span>
            </button>
            )}
            
            <button
              id="modal-similar-project-btn"
              onClick={handleSimilarProject}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-[#071B3A]" />
              <span>Tenho um projeto parecido</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );

};
