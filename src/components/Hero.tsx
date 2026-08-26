import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Code, 
  Layers, 
  ShieldCheck, 
  Zap,
  Globe,
  Database,
  ExternalLink
} from 'lucide-react';

interface HeroProps {
  onOpenBudgetModal: () => void;
  onExploreProjects: () => void;
  onStartDiagnosis?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBudgetModal, onExploreProjects, onStartDiagnosis }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'architecture' | 'ai' | 'automation'>('architecture');
  const [liveLatency, setLiveLatency] = useState(24);
  const [activeUsersCount, setActiveUsersCount] = useState(1482);

  // Simulated live telemetry fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLatency(Math.floor(22 + Math.random() * 8));
      setActiveUsersCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const codeSnippets = {
    architecture: `// OneSignal Enterprise Stack v3.8
export const EnterpriseSystem = {
  architecture: "Cloud Native Microservices",
  security: "Zero-Trust & End-to-End Encryption",
  database: "PostgreSQL Distributed Cluster",
  observability: "Realtime Telemetry (99.99% SLA)",
  status: "ONLINE • AUTO-SCALING READY"
};`,
    ai: `// OneSignal Autonomous AI Pipeline
import { SignalCognitiveAgent } from '@onesignal/core';

const agent = new SignalCognitiveAgent({
  model: 'enterprise-llm-v2',
  ragKnowledgeBase: 'Company_Docs_Embeddings',
  autonomousActions: ['generateReport', 'triageLead', 'syncCRM']
});

await agent.executeStream({ prompt: "Otimizar fluxos" });`,
    automation: `// Workflow & Industrial Trigger Engine
export async function handleIndustrialEvent(telemetry) {
  if (telemetry.temperature > 85.0) {
    await triggerEmergencyCooling();
    await sendWhatsAppAlert({ to: '+55 11 99999-9999', level: 'CRITICAL' });
  }
  return { status: 'DISPATCHED_IN_12ms' };
}`
  };

  return (
    <section 
      id="inicio" 
      className="relative min-h-[92vh] pt-32 pb-20 flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines and Value Proposition */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Tech Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#22D3EE] backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse"></span>
              <span className="font-mono uppercase tracking-wider text-[11px]">INOVAÇÃO TECNOLÓGICA • SOLUÇÕES SOB MEDIDA</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.12]">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                  SOLUÇÕES TECNOLÓGICAS
                </span>
                <br />
                <span className="text-[#22D3EE] drop-shadow-sm">
                  SOB MEDIDA
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Transformamos ideias e desafios empresariais em soluções digitais modernas, inteligentes e eficientes para o mercado global.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col items-center lg:items-start gap-3 pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                <button
                  id="hero-request-quote-btn"
                  onClick={onOpenBudgetModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-xl shadow-cyan-500/20 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <Sparkles className="w-5 h-5 text-[#071B3A] group-hover:rotate-12 transition-transform" />
                  <span>Solicite um orçamento</span>
                  <ArrowRight className="w-5 h-5 text-[#071B3A] group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  id="hero-explore-projects-btn"
                  href="#projetos"
                  onClick={(e) => {
                    e.preventDefault();
                    onExploreProjects();
                    const target = document.getElementById('projetos');
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Layers className="w-5 h-5 text-[#22D3EE]" />
                  <span>Conheça nossos projetos</span>
                </a>
              </div>

              {/* Consultative Diagnosis Anchor */}
              <a
                id="hero-diagnosis-anchor-link"
                href="#diagnostico"
                onClick={(e) => {
                  e.preventDefault();
                  if (onStartDiagnosis) {
                    onStartDiagnosis();
                  } else {
                    const target = document.getElementById('diagnostico');
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:text-white text-xs font-semibold transition-all group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                <span>Não sabe qual solução escolher? <strong>Faça um diagnóstico inteligente (2 min)</strong></span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Trust Badges / Stats Bar */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-white font-extrabold text-2xl font-['Outfit']">
                  <span>+50</span>
                  <Zap className="w-4 h-4 text-[#22D3EE] inline" />
                </div>
                <span className="text-xs text-slate-400 font-medium">Projetos Entregues</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-white font-extrabold text-2xl font-['Outfit']">
                  <span>99.9%</span>
                  <Activity className="w-4 h-4 text-[#2DD4BF] inline" />
                </div>
                <span className="text-xs text-slate-400 font-medium">Uptime & SLA</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-white font-extrabold text-2xl font-['Outfit']">
                  <span>100%</span>
                  <ShieldCheck className="w-4 h-4 text-[#22D3EE] inline" />
                </div>
                <span className="text-xs text-slate-400 font-medium">Código Sob Medida</span>
              </div>
            </div>

          </div>

          {/* Right Column: Frosted Glass Tech Showcase */}
          <div className="lg:col-span-5 relative">
            
            {/* Tech Glow Halo behind */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#22D3EE]/20 via-[#2DD4BF]/20 to-[#0B4F7A]/30 rounded-3xl blur-2xl opacity-75 pointer-events-none" />

            <div className="relative rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-5 sm:p-6 shadow-2xl overflow-hidden">
              
              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  <span className="text-xs font-mono text-slate-300 ml-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#22D3EE]" />
                    onesignal-core // system-matrix
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-[#2DD4BF] border border-white/15 flex items-center gap-1.5 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Code Tab Switcher */}
              <div className="flex items-center gap-1.5 mb-3">
                <button
                  id="tab-code-architecture"
                  onClick={() => setActiveCodeTab('architecture')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                    activeCodeTab === 'architecture'
                      ? 'bg-white/15 text-[#22D3EE] border border-white/20 font-medium shadow-sm'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  system.config.ts
                </button>
                <button
                  id="tab-code-ai"
                  onClick={() => setActiveCodeTab('ai')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                    activeCodeTab === 'ai'
                      ? 'bg-white/15 text-[#22D3EE] border border-white/20 font-medium shadow-sm'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  cognitiveAgent.ai
                </button>
                <button
                  id="tab-code-automation"
                  onClick={() => setActiveCodeTab('automation')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                    activeCodeTab === 'automation'
                      ? 'bg-white/15 text-[#22D3EE] border border-white/20 font-medium shadow-sm'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  iot-triggers.ts
                </button>
              </div>

              {/* Code Content in Frosted Container */}
              <div className="p-3.5 rounded-xl bg-[#071B3A]/70 border border-white/10 backdrop-blur-md overflow-x-auto text-xs font-mono leading-relaxed text-slate-300 min-h-[140px]">
                <pre className="text-cyan-200/90 whitespace-pre-wrap">
                  {codeSnippets[activeCodeTab]}
                </pre>
              </div>

              {/* Live Systems Dashboard Grid */}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Métricas de Infraestrutura Ativa</span>
                  <span className="text-[#22D3EE] font-semibold">{liveLatency}ms latency</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-cyan-500/15 text-[#22D3EE]">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Cluster CPU</div>
                        <div className="text-xs font-bold text-white">18.4% Nominal</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#2DD4BF] font-mono font-bold">OK</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-teal-500/15 text-[#2DD4BF]">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Transações/s</div>
                        <div className="text-xs font-bold text-white">{activeUsersCount} req/s</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#22D3EE] font-mono font-bold">SYNC</span>
                  </div>
                </div>

                {/* Floating Interactive Trigger */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    Stack 100% pronta para produção
                  </span>
                  <span className="text-[#22D3EE] font-mono text-[11px]">OneSignal Core</span>
                </div>
              </div>

            </div>

            {/* Floating Frosted Glass Uptime Card (from design reference) */}
            <div className="hidden sm:block absolute -bottom-5 -left-5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/40 text-white max-w-[150px]">
              <div className="text-[10px] uppercase tracking-widest text-[#22D3EE] font-bold mb-1">Uptime SLA</div>
              <div className="text-xl font-bold font-['Outfit'] mb-1.5">99.9%</div>
              <div className="flex gap-1 items-end h-6">
                <div className="flex-1 bg-[#22D3EE] h-full rounded-sm opacity-30"></div>
                <div className="flex-1 bg-[#22D3EE] h-[80%] rounded-sm opacity-50"></div>
                <div className="flex-1 bg-[#22D3EE] h-[60%] rounded-sm opacity-70"></div>
                <div className="flex-1 bg-[#22D3EE] h-[90%] rounded-sm opacity-85"></div>
                <div className="flex-1 bg-[#22D3EE] h-[75%] rounded-sm"></div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
