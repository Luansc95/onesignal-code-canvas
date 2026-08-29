import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Sliders, 
  TrendingUp, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { leadService } from '../../services/leadService';
import { Lead } from '../../types';
import { navigate } from '../../lib/router';

export const AdminLeadScoring: React.FC = () => {
  const leads = leadService.getAllLeads();

  // Interactive Scoring Simulator State
  const [simDiagnostic, setSimDiagnostic] = useState(true);
  const [simMaturity, setSimMaturity] = useState(true);
  const [simBudget, setSimBudget] = useState(true);
  const [simTimeline, setSimTimeline] = useState(true);
  const [simCompanyData, setSimCompanyData] = useState(true);
  const [simHighIntentSource, setSimHighIntentSource] = useState(true);

  // Calculate simulator score
  const simulatedLead: Partial<Lead> = {
    diagnosticCompleted: simDiagnostic,
    identifiedChallenges: simMaturity ? ['Desafio 1', 'Desafio 2'] : [],
    digitalMaturity: simMaturity ? 'Estruturada' : 'Em desenvolvimento',
    budgetRange: simBudget ? 'R$ 35.000 - R$ 60.000' : undefined,
    desiredTimeline: simTimeline ? 'Urgente (30 dias)' : undefined,
    company: simCompanyData ? 'Empresa Simulação S.A.' : '',
    whatsapp: simCompanyData ? '(11) 98765-4321' : '',
    source: simHighIntentSource ? 'diagnostic_flow' : 'direct'
  };

  const simulationResult = leadService.calculateLeadScore(simulatedLead);

  // Ranked leads by score
  const rankedLeads = [...leads].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          Motor de Lead Scoring & Qualificação
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-medium border border-cyan-500/30">
            Algoritmo Transparente
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Regras determinísticas de priorização para o time comercial agir primeiro nas contas com maior propensão de fechamento.
        </p>
      </div>

      {/* Grid: Simulator & Algorithm Rulebook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Interactive Scoring Simulator */}
        <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-cyan-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Simulador de Score em Tempo Real
            </h3>
            <span className="text-xs font-mono text-cyan-300">Auditoria de Regras</span>
          </div>

          {/* Simulator Result Output Badge */}
          <div className="p-5 rounded-2xl bg-[#030D1A] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-mono block">Score Calculado</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-white font-['Outfit']">{simulationResult.score}</span>
                <span className="text-xs text-slate-400 font-mono">/ 100 pontos</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono block">Classificação Comercial</span>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                simulationResult.priority === 'high'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : simulationResult.priority === 'medium'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                {simulationResult.priorityLabel}
              </span>
            </div>
          </div>

          {/* Interactive Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-colors text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={simDiagnostic}
                  onChange={(e) => setSimDiagnostic(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-400"
                />
                <span>Diagnóstico Inteligente Concluído</span>
              </div>
              <span className="font-mono font-bold text-cyan-300">+30 pts</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-colors text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={simBudget}
                  onChange={(e) => setSimBudget(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-400"
                />
                <span>Faixa de Orçamento Selecionada</span>
              </div>
              <span className="font-mono font-bold text-cyan-300">+20 pts</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-colors text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={simTimeline}
                  onChange={(e) => setSimTimeline(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-400"
                />
                <span>Prazo de Implementação Definido (Urgente/1-3m)</span>
              </div>
              <span className="font-mono font-bold text-cyan-300">+15 pts</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-colors text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={simMaturity}
                  onChange={(e) => setSimMaturity(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-400"
                />
                <span>Maturidade Estruturada / 2+ Gargalos Mapeados</span>
              </div>
              <span className="font-mono font-bold text-cyan-300">+15 pts</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-colors text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={simCompanyData}
                  onChange={(e) => setSimCompanyData(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-400"
                />
                <span>Dados Corporativos Completos (Empresa + WhatsApp)</span>
              </div>
              <span className="font-mono font-bold text-cyan-300">+10 pts</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-colors text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={simHighIntentSource}
                  onChange={(e) => setSimHighIntentSource(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-400"
                />
                <span>Origem de Alta Intenção (Diagnóstico / Orçamento)</span>
              </div>
              <span className="font-mono font-bold text-cyan-300">+10 pts</span>
            </label>
          </div>
        </div>

        {/* Priority Matrix & Scoring Rules */}
        <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-5">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Flame className="w-4 h-4 text-cyan-400" />
            Matriz de Prioridade Comercial
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Como cada faixa de pontuação orienta as ações do executivo de contas da OneSignal:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-400" />
                  🔥 Alta Prioridade (70 - 100 pontos)
                </span>
                <span className="font-mono">SLA: até 2 horas</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Leads altamente qualificados com dor operacional clara, orçamento mapeado e diagnóstico preenchido. Contato direto via WhatsApp e agendamento imediato de reunião de escopo.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  🟡 Média Prioridade (40 - 69 pontos)
                </span>
                <span className="font-mono">SLA: até 6 horas</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Oportunidades em fase de pesquisa de mercado ou que necessitam de direcionamento de tecnologia. Envio de material complementar e proposta consultiva preliminar.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-blue-300">
                <span className="flex items-center gap-1.5">
                  🔵 Baixa Prioridade (0 - 39 pontos)
                </span>
                <span className="font-mono">SLA: até 24 horas</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Contatos preliminares com poucos dados ou em fase inicial. Nutrição automática e convite para realização do Diagnóstico Inteligente.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Ranked Leads Table */}
      <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Ranking de Leads por Score no Pipeline
            </h3>
            <span className="text-xs text-slate-400">Oportunidades ordenadas pela maior pontuação de qualificação</span>
          </div>

          <button
            onClick={() => navigate('/admin/leads')}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-all"
          >
            Ver Pipeline Completo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-2.5">Posição</th>
                <th className="pb-2.5">Lead / Empresa</th>
                <th className="pb-2.5">Solução</th>
                <th className="pb-2.5">Score</th>
                <th className="pb-2.5">Prioridade</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rankedLeads.map((lead, idx) => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-mono font-bold text-cyan-400">#{idx + 1}</td>
                  <td className="py-3">
                    <div className="font-bold text-white">{lead.name}</div>
                    <div className="text-[11px] text-slate-400">{lead.company}</div>
                  </td>
                  <td className="py-3 text-slate-300">{lead.solutionType}</td>
                  <td className="py-3">
                    <span className="font-mono font-bold text-base text-white">{lead.score || 70}</span>
                    <span className="text-slate-500 text-[10px]">/100</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      lead.priority === 'high'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {lead.priority === 'high' ? '🔥 Alta' : '🟡 Média'}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{leadService.getStatusLabel(lead.status)}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => navigate('/admin/leads')}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition-colors"
                    >
                      Ver no CRM
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
