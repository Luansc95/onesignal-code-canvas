import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Flame, 
  MessageSquare, 
  BrainCircuit, 
  DollarSign, 
  FolderKanban, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  Eye, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  Calendar,
  Filter,
  BarChart3
} from 'lucide-react';
import { analytics, TimePeriod } from '../../services/analyticsService';
import { leadService } from '../../services/leadService';
import { projectService } from '../../services/projectService';
import { contactService } from '../../services/contactService';
import { Lead, Project } from '../../types';
import { navigate } from '../../lib/router';

export const AdminDashboard: React.FC = () => {
  const [period, setPeriod] = useState<TimePeriod>('30d');

  const kpis = analytics.getKpiSummary(period);
  const leads = leadService.getAllLeads();
  const projects = projectService.getAllProjects();
  const contacts = contactService.getAllContacts();
  const trafficSources = analytics.getTrafficSourcesSummary();

  const newLeads = leads.filter((l) => l.status === 'new');
  const highPriorityLeads = leads.filter((l) => l.priority === 'high');
  const convertedLeads = leads.filter((l) => l.status === 'converted');
  const diagnosticLeads = leads.filter((l) => l.diagnosticCompleted);

  // Top Viewed Projects
  const topProjects = [...projects].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 4);

  // Top Requested Solution Types
  const solutionTypeCounts: Record<string, number> = {};
  leads.forEach((l) => {
    const type = l.solutionType || 'Outro';
    solutionTypeCounts[type] = (solutionTypeCounts[type] || 0) + 1;
  });
  const topServices = Object.entries(solutionTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner & Time Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit'] tracking-tight flex items-center gap-2">
            Visão Geral Executiva & BI
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-medium">
              <Sparkles className="w-3 h-3" />
              Tempo Real
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Métricas consolidadas de captação de leads, conversão de tráfego e engajamento do portfólio.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#071B3A] border border-cyan-500/20 text-xs font-medium">
          {[
            { id: 'today', label: 'Hoje' },
            { id: '7d', label: '7 Dias' },
            { id: '30d', label: '30 Dias' },
            { id: 'month', label: 'Este Mês' },
            { id: 'all', label: 'Total' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id as TimePeriod)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Visitors */}
        <div className="p-5 rounded-2xl bg-[#071B3A]/80 border border-white/10 hover:border-cyan-500/30 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Visitantes Únicos</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-['Outfit']">{kpis.uniqueVisitors.toLocaleString('pt-BR')}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">{kpis.pageViews} visualizações de páginas totais</p>
        </div>

        {/* Total Leads Captured */}
        <div className="p-5 rounded-2xl bg-[#071B3A]/80 border border-cyan-500/30 shadow-lg shadow-cyan-500/5 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">Leads Captados</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-['Outfit']">{leads.length}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +24.1%
            </span>
          </div>
          <p className="text-[11px] text-cyan-300/80">
            {newLeads.length} novos para atendimento ({highPriorityLeads.length} de alta prioridade)
          </p>
        </div>

        {/* Global Conversion Rate */}
        <div className="p-5 rounded-2xl bg-[#071B3A]/80 border border-white/10 hover:border-cyan-500/30 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Taxa de Conversão</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-['Outfit']">{kpis.conversionRate}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +0.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Leads gerados / Visitantes únicos</p>
        </div>

        {/* WhatsApp & Direct Channels */}
        <div className="p-5 rounded-2xl bg-[#071B3A]/80 border border-white/10 hover:border-cyan-500/30 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Cliques no WhatsApp</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-['Outfit']">{kpis.whatsappClicks}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +31.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Conversas comerciais diretas iniciadas</p>
        </div>
      </div>

      {/* Commercial Funnel & Traffic Acquisition Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Commercial Pipeline Funnel */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Funil de Conversão & Aquisição
              </h3>
              <p className="text-xs text-slate-400">
                Jornada do visitante desde o primeiro acesso até o contrato assinado
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/leads')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Abrir CRM</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Visitantes Únicos no Site', count: kpis.uniqueVisitors, pct: '100%', color: 'bg-cyan-500' },
              { label: 'Engajamento com Diagnóstico ou Orçamento', count: kpis.diagnosticsCompleted + kpis.budgetClicks, pct: '11.8%', color: 'bg-teal-400' },
              { label: 'Leads Qualificados no CRM', count: leads.length, pct: `${((leads.length / kpis.uniqueVisitors) * 100).toFixed(1)}%`, color: 'bg-sky-400' },
              { label: 'Em Negociação / Apresentação de Escopo', count: leads.filter(l => l.status === 'negotiating' || l.status === 'contacted').length + 2, pct: '4.2%', color: 'bg-amber-400' },
              { label: 'Projetos Fechados & Convertidos', count: convertedLeads.length + 1, pct: '2.1%', color: 'bg-emerald-400' }
            ].map((step, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{step.label}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white">{step.count}</span>
                    <span className="text-slate-400 text-[11px]">({step.pct})</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-[#030D1A] overflow-hidden border border-white/5">
                  <div 
                    className={`h-full rounded-full ${step.color} transition-all duration-500`}
                    style={{ width: step.pct === '100%' ? '100%' : `${Math.max(10, parseFloat(step.pct) * 6)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Diagnósticos Concluídos: {kpis.diagnosticsCompleted}</span>
                <span className="text-[11px] text-slate-400">Excelente alavanca de qualificação com taxa de conversão em lead de 68%.</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/diagnosticos')}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-cyan-300 text-xs font-semibold whitespace-nowrap transition-colors"
            >
              Ver Relatório BI
            </button>
          </div>
        </div>

        {/* Traffic Channels Breakdown */}
        <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Canais de Aquisição
            </h3>
            <button
              onClick={() => navigate('/admin/marketing')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Ver Campanhas
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Distribuição de tráfego por origem e canal oficial
          </p>

          <div className="space-y-3.5 pt-2">
            {trafficSources.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 truncate pr-2">{item.source}</span>
                  <span className="font-mono font-bold text-white shrink-0">{item.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#030D1A] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Instagram Oficial</span>
              <span className="text-cyan-300 font-mono font-bold">@onesignal_tech</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Leads & Top Portfolio Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent High-Intent Leads */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Leads Recentes no Pipeline
              </h3>
              <span className="text-xs text-slate-400">Últimas oportunidades qualificadas registradas</span>
            </div>
            <button
              onClick={() => navigate('/admin/leads')}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold transition-all border border-cyan-500/20"
            >
              Ver Todos ({leads.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="pb-2.5">Lead / Empresa</th>
                  <th className="pb-2.5">Solução Solicitada</th>
                  <th className="pb-2.5">Score</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.slice(0, 4).map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3">
                      <div className="font-bold text-white">{lead.name}</div>
                      <div className="text-[11px] text-slate-400">{lead.company}</div>
                    </td>
                    <td className="py-3">
                      <span className="text-slate-300">{lead.solutionType}</span>
                      {lead.budgetRange && (
                        <div className="text-[10px] font-mono text-cyan-400">{lead.budgetRange}</div>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        lead.priority === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : lead.priority === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {lead.score || 70} pts
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-[11px] font-medium text-slate-300">
                        {leadService.getStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => navigate('/admin/leads')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors font-medium text-[11px]"
                      >
                        Atender
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Viewed Portfolio Projects */}
        <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-cyan-400" />
              Cases Mais Acessados
            </h3>
            <button
              onClick={() => navigate('/admin/projetos')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Gerenciar
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Projetos com maior engajamento e visualizações
          </p>

          <div className="space-y-3">
            {topProjects.map((project, idx) => (
              <div 
                key={project.id}
                onClick={() => navigate('/admin/projetos')}
                className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-0.5 truncate pr-2">
                  <div className="font-bold text-xs text-white truncate">{project.name}</div>
                  <div className="text-[10px] text-slate-400">{project.categoryLabel}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {project.viewsCount || 150}
                  </span>
                  <span className="text-[10px] text-slate-400 block">views</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/admin/projetos')}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <span>Adicionar Novo Projeto ao Portfólio</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
