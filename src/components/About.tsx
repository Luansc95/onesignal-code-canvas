import React from 'react';
import { 
  Building2, 
  Target, 
  Eye, 
  HeartHandshake, 
  Sparkles, 
  Code2, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2,
  Users,
  Award
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="sobre" className="py-24 relative z-10 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Story + Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#22D3EE] text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Building2 className="w-3.5 h-3.5" />
              Quem Somos
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight leading-tight">
              Tecnologia criada para{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#2DD4BF] to-sky-300">
                resolver problemas reais.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              A <strong className="text-white font-semibold">OneSignal</strong> desenvolve soluções 
              tecnológicas personalizadas para empresas que desejam inovar, automatizar processos e crescer através da tecnologia.
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Acreditamos que softwares genéricos de prateleira muitas vezes engessam os fluxos únicos de um negócio de sucesso. 
              Por isso, nossa equipe une engenharia de software de ponta, design centrado em usabilidade e visão estratégica de negócios 
              para conceber produtos digitais que geram impacto real, redução de custos e aumento comprovado de receita.
            </p>

            {/* Core Commitments */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-cyan-500/15 text-[#22D3EE] mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Desenvolvimento 100% Personalizado</h4>
                  <p className="text-xs text-slate-300">Cada linha de código é estruturada para responder exatamente às particularidades da sua operação.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-teal-500/15 text-[#2DD4BF] mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Compromisso com Inovação Contínua</h4>
                  <p className="text-xs text-slate-300">Aplicamos o que há de mais avançado em IA, nuvem distribuída e automações inteligentes.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Mission, Vision, Values Stack */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Missão */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:border-white/20 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/10 text-[#22D3EE] border border-white/15">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">Nossa Missão</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-12">
                Capacitar organizações através de tecnologia de alto nível, transformando rotinas burocráticas em fluxos digitais autônomos, velozes e altamente rentáveis.
              </p>
            </div>

            {/* Visão */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:border-white/20 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/10 text-[#2DD4BF] border border-white/15">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">Nossa Visão</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-12">
                Ser a principal referência em soluções tecnológicas sob medida e engenharia de software corporativo, reconhecida pela excelência técnica, velocidade e impacto nos negócios.
              </p>
            </div>

            {/* Valores */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:border-white/20 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/10 text-sky-400 border border-white/15">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">Nossos Valores</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 pl-12 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                  Excelência Técnica
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                  Transparência Radical
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                  Foco em Resultados
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                  Segurança Inegociável
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Engineering Stats Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/15 shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              100%
            </div>
            <div className="text-xs text-[#22D3EE] font-medium">Projetos no Prazo</div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              +150k
            </div>
            <div className="text-xs text-[#2DD4BF] font-medium">Linhas de Código Limpo</div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              99.9%
            </div>
            <div className="text-xs text-[#22D3EE] font-medium">SLA de Estabilidade</div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              24/7
            </div>
            <div className="text-xs text-[#2DD4BF] font-medium">Monitoramento Proativo</div>
          </div>
        </div>

      </div>
    </section>
  );
};
