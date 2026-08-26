import React from 'react';
import { 
  Zap, 
  TrendingDown, 
  Coins, 
  BarChart, 
  Rocket, 
  CheckCircle, 
  Sparkles,
  Layers,
  Clock,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export const WhyInvest: React.FC = () => {
  const benefitCards = [
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: 'Mais Produtividade',
      stat: '+65%',
      statLabel: 'ganho médio de eficiência',
      description: 'Automatize tarefas manuais e permita que sua equipe foque nas atividades de alto valor estratégico.',
      tag: 'Agilidade Operacional',
      accentColor: 'from-amber-500/20 to-transparent'
    },
    {
      icon: <TrendingDown className="w-6 h-6 text-emerald-400" />,
      title: 'Redução de Erros',
      stat: '-80%',
      statLabel: 'menos falhas operacionais',
      description: 'Validações sistemáticas e rotinas computacionais eliminam retrabalhos causados por processos manuais.',
      tag: 'Qualidade & Precisão',
      accentColor: 'from-emerald-500/20 to-transparent'
    },
    {
      icon: <Coins className="w-6 h-6 text-cyan-400" />,
      title: 'Otimização de Custos',
      stat: '-35%',
      statLabel: 'redução de custos recorrentes',
      description: 'Sistemas inteligentes eliminam desperdícios, otimizam estoques e melhoram a margem líquida do negócio.',
      tag: 'Retorno Sobre Investimento',
      accentColor: 'from-cyan-500/20 to-transparent'
    },
    {
      icon: <BarChart className="w-6 h-6 text-teal-400" />,
      title: 'Decisões Baseadas em Dados',
      stat: '100%',
      statLabel: 'visibilidade em tempo real',
      description: 'Dashboards executivos e relatórios confiáveis para tomar decisões estratégicas sem depender de achismos.',
      tag: 'Business Intelligence',
      accentColor: 'from-teal-500/20 to-transparent'
    },
    {
      icon: <Rocket className="w-6 h-6 text-sky-400" />,
      title: 'Processos Mais Eficientes',
      stat: '4x',
      statLabel: 'mais velocidade no fluxo',
      description: 'Comunicação integrada entre setores e clientes com respostas instantâneas e fluxos contínuos.',
      tag: 'Escalabilidade',
      accentColor: 'from-sky-500/20 to-transparent'
    }
  ];

  return (
    <section className="py-24 relative z-10 overflow-hidden bg-white/[0.01]">
      {/* Background glow elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#22D3EE] text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Impacto Comprovado no Negócio
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight leading-tight">
            Tecnologia não é apenas uma ferramenta.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#2DD4BF] to-sky-300">
              É uma vantagem competitiva.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Empresas que investem em software sob medida e automação crescem com mais previsibilidade, 
            menor custo marginal e satisfação superior de seus clientes.
          </p>
        </div>

        {/* 5 Dynamic Frosted Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefitCards.map((card, idx) => (
            <div
              key={idx}
              className={`rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 shadow-xl shadow-black/20 group relative overflow-hidden flex flex-col justify-between ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Subtle gradient corner */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${card.accentColor} rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity`} />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/15 group-hover:scale-105 transition-transform backdrop-blur-sm">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    {card.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-['Outfit'] mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Stat Metric */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-baseline justify-between relative z-10">
                <div>
                  <div className="text-3xl font-extrabold text-white font-['Outfit'] tracking-tight group-hover:text-[#22D3EE] transition-colors">
                    {card.stat}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {card.statLabel}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Before vs After Frosted Glass Comparison Strip */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/15 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white font-['Outfit']">
              O Salto Operacional com a OneSignal
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Transformação tangível em todas as etapas do ciclo de negócios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="p-5 rounded-2xl bg-white/5 border border-rose-500/20 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm font-['Outfit']">
                <ShieldAlert className="w-4 h-4" />
                <span>Cenário Tradicional / Sem Software Sob Medida</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span> Planilhas manuais desconexas e propensas a erros
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span> Perda de vendas por demora no atendimento e follow-up
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span> Falta de relatórios confiáveis para tomada de decisões
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span> Dependência de processos lentos e papéis físicos
                </li>
              </ul>
            </div>

            {/* After */}
            <div className="p-5 rounded-2xl bg-white/5 border border-[#2DD4BF]/30 backdrop-blur-sm space-y-3 shadow-inner">
              <div className="flex items-center gap-2 text-[#2DD4BF] font-bold text-sm font-['Outfit']">
                <CheckCircle className="w-4 h-4 text-[#2DD4BF]" />
                <span>Com as Soluções Sob Medida da OneSignal</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <span className="text-[#2DD4BF] font-bold">✓</span> Centralização 100% em nuvem com sincronização instantânea
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2DD4BF] font-bold">✓</span> Automações e IA qualificando clientes 24h por dia
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2DD4BF] font-bold">✓</span> Painéis estratégicos com dados em tempo real na palma da mão
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2DD4BF] font-bold">✓</span> Escalabilidade operacional com governança e segurança de dados
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
