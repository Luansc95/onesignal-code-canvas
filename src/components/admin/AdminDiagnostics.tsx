import React from 'react';
import { 
  BrainCircuit, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Users, 
  ArrowUpRight, 
  ChevronRight,
  PieChart,
  Sparkles,
  Award
} from 'lucide-react';
import { leadService } from '../../services/leadService';
import { analytics } from '../../services/analyticsService';
import { navigate } from '../../lib/router';

export const AdminDiagnostics: React.FC = () => {
  const leads = leadService.getAllLeads();
  const diagnosticLeads = leads.filter((l) => l.diagnosticCompleted);
  const kpis = analytics.getKpiSummary('30d');

  // Digital Maturity Distribution
  const maturityLevels = [
    { label: 'Estruturada (Maturidade 60-80%)', count: 18, percentage: 43, color: 'bg-cyan-400' },
    { label: 'Em Evolução (Maturidade 35-59%)', count: 14, percentage: 33, color: 'bg-teal-400' },
    { label: 'Em Desenvolvimento (Maturidade <35%)', count: 7, percentage: 17, color: 'bg-amber-400' },
    { label: 'Avançada (Maturidade >80%)', count: 3, percentage: 7, color: 'bg-emerald-400' }
  ];

  // Top Market Challenges
  const topChallenges = [
    { challenge: 'Processos manuais e retrabalho operacional contínuo', count: 34, percentage: 81 },
    { challenge: 'Falta de indicadores e relatórios executivos em tempo real', count: 28, percentage: 67 },
    { challenge: 'Sistemas e planilhas desconectados entre setores', count: 22, percentage: 52 },
    { challenge: 'Dificuldade de controle de estoque ou ordens de serviço', count: 16, percentage: 38 },
    { challenge: 'Ausência de aplicativo mobile ou canal digital para clientes', count: 12, percentage: 29 }
  ];

  // Top Recommended Solutions
  const topSolutions = [
    { solution: 'Sistema de Gestão Sob Medida (ERP Cloud)', count: 24, percentage: 57, type: 'management' },
    { solution: 'Dashboards Executivos & BI em Tempo Real', count: 19, percentage: 45, type: 'web' },
    { solution: 'Automação de Processos & Integração de APIs', count: 16, percentage: 38, type: 'automation' },
    { solution: 'Aplicativo Mobile iOS / Android Corporativo', count: 11, percentage: 26, type: 'mobile' },
    { solution: 'Módulo de Inteligência Artificial & Previsibilidade', count: 8, percentage: 19, type: 'ai' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            Inteligência & Diagnósticos Corporativos
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-medium border border-cyan-500/30">
              Mapeamento de Mercado
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Análise agregada dos gargalos operacionais e demandas de tecnologia das empresas que completaram o Diagnóstico Inteligente.
          </p>
        </div>

        <button
          onClick={() => navigate('/diagnostico')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
        >
          <span>Abrir Diagnóstico Público</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#071B3A]/80 border border-white/10 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Diagnósticos Iniciados</span>
          <div className="text-2xl font-bold text-white font-['Outfit']">62</div>
          <span className="text-[11px] text-emerald-400">+15% este mês</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#071B3A]/80 border border-cyan-500/30 space-y-2">
          <span className="text-xs font-mono text-cyan-300 uppercase font-bold">Diagnósticos Concluídos</span>
          <div className="text-2xl font-bold text-white font-['Outfit']">{kpis.diagnosticsCompleted}</div>
          <span className="text-[11px] text-cyan-300/80">Taxa de conclusão: 67.7%</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#071B3A]/80 border border-white/10 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Conversão em Leads CRM</span>
          <div className="text-2xl font-bold text-white font-['Outfit']">{diagnosticLeads.length}</div>
          <span className="text-[11px] text-emerald-400">Score médio: 86 pts 🔥</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#071B3A]/80 border border-white/10 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Maturidade Média</span>
          <div className="text-2xl font-bold text-white font-['Outfit']">58.4%</div>
          <span className="text-[11px] text-slate-400">Faixa "Em Evolução"</span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Identified Challenges */}
        <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-5 shadow-2xl">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Top 5 Gargalos Operacionais Identificados
          </h3>
          <p className="text-xs text-slate-400">
            Dores mais reportadas pelos tomadores de decisão nas empresas
          </p>

          <div className="space-y-4 pt-2">
            {topChallenges.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium pr-2 truncate">#{idx + 1}. {item.challenge}</span>
                  <span className="font-mono font-bold text-cyan-300 shrink-0">{item.percentage}% ({item.count})</span>
                </div>
                <div className="h-2 rounded-full bg-[#030D1A] overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recommended Solutions */}
        <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-5 shadow-2xl">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Top 5 Soluções Mais Recomendadas pelo Algoritmo
          </h3>
          <p className="text-xs text-slate-400">
            Engenharias OneSignal mais indicadas conforme o perfil das respostas
          </p>

          <div className="space-y-4 pt-2">
            {topSolutions.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium pr-2 truncate">#{idx + 1}. {item.solution}</span>
                  <span className="font-mono font-bold text-emerald-300 shrink-0">{item.percentage}% ({item.count})</span>
                </div>
                <div className="h-2 rounded-full bg-[#030D1A] overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-500" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Maturity Distribution Banner */}
      <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-cyan-500/20 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          Distribuição dos Níveis de Maturidade Digital das Empresas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {maturityLevels.map((lvl, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#030D1A] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{lvl.label.split('(')[0]}</span>
                <span className="font-mono font-bold text-cyan-300 text-xs">{lvl.percentage}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full ${lvl.color}`} style={{ width: `${lvl.percentage}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 block">{lvl.count} empresas avaliadas</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
