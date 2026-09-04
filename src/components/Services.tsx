import React, { useState } from 'react';
import { 
  Smartphone, 
  Globe, 
  Cog, 
  BarChart3, 
  Bot, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  Code2,
  Sparkles
} from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { ServiceItem } from '../types';
import { analytics } from '../services/analyticsService';

interface ServicesProps {
  onSelectServiceForBudget: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForBudget }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleOpenDetails = (service: ServiceItem) => {
    analytics.track('view_service', { serviceId: service.id, serviceTitle: service.title });
    setSelectedService(service);
  };

  const handleRequestService = (serviceTitle: string) => {
    analytics.track('click_budget', { source: 'services_card', serviceTitle });
    onSelectServiceForBudget(serviceTitle);
  };

  const handleCustomProjectClick = () => {
    analytics.track('click_consultative_cta', { source: 'post_services_card' });
    onSelectServiceForBudget('Solução Personalizada');
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-cyan-400" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-teal-400" />;
      case 'Cog':
        return <Cog className="w-6 h-6 text-cyan-300" />;
      case 'BarChart3':
        return <BarChart3 className="w-6 h-6 text-teal-300" />;
      case 'Bot':
        return <Bot className="w-6 h-6 text-sky-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      default:
        return <Code2 className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <section id="servicos" className="py-24 relative z-10 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#22D3EE] text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Nossas Especialidades
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Tecnologia para transformar{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF]">
              o seu negócio
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Desenvolvemos soluções de software de ponta a ponta com engenharia de alto nível, 
            design focado no usuário e arquiteturas escaláveis em nuvem.
          </p>
        </div>

        {/* Services Grid (6 Frosted Glass Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="group relative rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 backdrop-blur-md p-7 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-cyan-500/10 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 group-hover:bg-cyan-500/15 rounded-full blur-2xl transition-all pointer-events-none" />

              <div className="space-y-5 relative z-10">
                {/* Icon Container */}
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/15 border border-cyan-400/30 flex items-center justify-center shadow-md shadow-cyan-500/10 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(service.iconName)}
                </div>

                {/* Title & Short Description */}
                <div>
                  <h3 className="text-xl font-bold text-white font-['Outfit'] group-hover:text-[#22D3EE] transition-colors mb-2.5">
                    {service.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Key Deliverables Bullet Points */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {service.deliverables.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.technologies.slice(0, 4).map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-0.5 text-[11px] font-mono font-medium rounded-md bg-white/5 text-cyan-200 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                <button
                  id={`btn-service-details-${service.id}`}
                  onClick={() => handleOpenDetails(service)}
                  className="text-xs font-semibold text-[#22D3EE] hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  Ver detalhes
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  id={`btn-quote-service-${service.id}`}
                  onClick={() => handleRequestService(service.title)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] hover:shadow-md hover:shadow-cyan-500/25 transition-all group-hover:scale-105 active:scale-95"
                >
                  <span>Solicitar</span>
                  <ArrowRight className="w-3 h-3 text-[#071B3A]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Post-Services Contextual CTA */}
        <div 
          id="services-custom-project-cta"
          className="mt-12 rounded-2xl bg-white/5 border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit'] flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              Não encontrou exatamente o que precisa?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Desenvolvemos soluções tecnológicas personalizadas para os desafios específicos de cada negócio.
            </p>
          </div>

          <button
            id="btn-services-custom-project"
            onClick={handleCustomProjectClick}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Fale sobre seu projeto</span>
            <ArrowRight className="w-4 h-4 text-[#071B3A]" />
          </button>
        </div>

      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div 
          id="service-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-[#071B3A]/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[#22D3EE]">
                  {getIcon(selectedService.iconName)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-['Outfit']">
                    {selectedService.title}
                  </h3>
                  <span className="text-xs font-mono text-[#22D3EE]">OneSignal Engineering Solutions</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white border border-white/15"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <p className="text-slate-200 text-sm leading-relaxed">
              {selectedService.fullDescription}
            </p>

            {/* Deliverables */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-cyan-300 font-['Outfit'] uppercase tracking-wider">
                O que entregamos nesta modalidade:
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {selectedService.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Benefits */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-teal-300 font-['Outfit'] uppercase tracking-wider">
                Benefícios diretos para sua operação:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedService.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div className="pt-2">
              <h4 className="text-xs font-mono text-slate-400 uppercase mb-2">Tecnologias Utilizadas:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedService.technologies.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs font-mono rounded-lg bg-white/5 text-cyan-300 border border-white/10">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/10 border border-white/15"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  const serviceName = selectedService.title;
                  setSelectedService(null);
                  onSelectServiceForBudget(serviceName);
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#071B3A]" />
                Solicitar projeto em {selectedService.title}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
