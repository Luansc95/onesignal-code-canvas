import React, { useState } from 'react';
import { 
  Search, 
  Compass, 
  Code2, 
  CheckCircle2, 
  Rocket, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Workflow
} from 'lucide-react';

export const HowWeWork: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Entendemos sua necessidade',
      subtitle: 'Imersão & Diagnóstico Estratégico',
      description: 'Conhecemos seu negócio, seus processos e seus desafios em profundidade para identificar oportunidades reais de ganho operacional.',
      deliverables: ['Mapeamento de processos', 'Identificação de gargalos', 'Definição de escopo funcional'],
      icon: <Search className="w-5 h-5 text-cyan-400" />
    },
    {
      number: '02',
      title: 'Planejamos a solução',
      subtitle: 'Arquitetura & Design de Interface',
      description: 'Definimos as melhores tecnologias, desenhamos protótipos navegáveis (UI/UX) e estruturamos o banco de dados e APIs.',
      deliverables: ['Wireframes interativos', 'Arquitetura técnica em nuvem', 'Cronograma detalhado por sprints'],
      icon: <Compass className="w-5 h-5 text-teal-400" />
    },
    {
      number: '03',
      title: 'Desenvolvemos',
      subtitle: 'Engenharia Ágil & Código Limpo',
      description: 'Criamos uma solução personalizada para suas necessidades com metodologia ágil, validações parciais e código seguro de alto desempenho.',
      deliverables: ['Sprints quinzenais com demos', 'Código fonte versionado (Git)', 'Integrações e APIs conectadas'],
      icon: <Code2 className="w-5 h-5 text-cyan-300" />
    },
    {
      number: '04',
      title: 'Testamos e aprimoramos',
      subtitle: 'Garantia de Qualidade (QA) & Segurança',
      description: 'Garantimos qualidade, segurança e eficiência através de baterias rigorosas de testes automatizados, auditoria de carga e usabilidade.',
      deliverables: ['Testes de segurança e carga', 'Validação em múltiplos dispositivos', 'Homologação assistida com sua equipe'],
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      number: '05',
      title: 'Implantamos e acompanhamos',
      subtitle: 'Go-Live & Suporte Contínuo',
      description: 'Apoiamos a evolução da solução após a entrega com monitoramento em tempo real, treinamentos e suporte técnico especializado.',
      deliverables: ['Deploy em nuvem de alta disponibilidade', 'Treinamento dos usuários', 'SLA de sustentação e evolução'],
      icon: <Rocket className="w-5 h-5 text-sky-400" />
    }
  ];

  return (
    <section id="metodologia" className="py-24 relative z-10 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#22D3EE] text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Workflow className="w-3.5 h-3.5" />
            Metodologia Transparente
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Como Trabalhamos:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#2DD4BF] to-sky-300">
              Da ideia ao resultado
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Um processo estruturado em 5 etapas para garantir previsibilidade de prazos, 
            qualidade de código e retorno real sobre o investimento.
          </p>
        </div>

        {/* 5-Step Process Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-5 relative">
          
          {steps.map((step, idx) => (
            <div
              key={idx}
              id={`methodology-step-${step.number}`}
              onClick={() => setActiveStep(idx)}
              className={`rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border relative overflow-hidden backdrop-blur-md ${
                activeStep === idx 
                  ? 'bg-white/15 border-white/40 shadow-xl shadow-cyan-500/20 scale-[1.02]' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Step indicator top */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black font-mono text-[#22D3EE]">
                  {step.number}
                </span>
                <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 text-[#22D3EE]">
                  {step.icon}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 mb-4">
                <h3 className="text-base font-bold text-white font-['Outfit'] leading-snug">
                  {step.title}
                </h3>
                <span className="text-[11px] font-mono text-[#2DD4BF] block font-medium">
                  {step.subtitle}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Deliverables snippet */}
              <div className="pt-3 border-t border-white/10 space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                  Entregas principais:
                </span>
                {step.deliverables.map((item, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-1.5 text-[11px] text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
