import React, { useState } from 'react';
import { 
  BarChart3, 
  Activity, 
  Eye, 
  MousePointer, 
  Smartphone, 
  Monitor, 
  Layers, 
  Sparkles, 
  Clock, 
  Globe, 
  Filter
} from 'lucide-react';
import { analytics, ConversionEventName } from '../../services/analyticsService';

export const AdminAnalytics: React.FC = () => {
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const recentEvents = analytics.getRecentEvents(100);

  const filteredEvents = selectedEventType === 'all'
    ? recentEvents
    : recentEvents.filter((e) => e.eventName === selectedEventType);

  const eventTypeLabels: Record<ConversionEventName, string> = {
    page_view: 'Visualização de Página',
    view_service: 'Explorou Serviço',
    view_project: 'Abriu Case no Portfólio',
    click_primary_cta: 'Clique CTA Principal',
    click_secondary_cta: 'Clique CTA Secundário',
    click_consultative_cta: 'Clique CTA Consultivo',
    click_budget: 'Clique em Solicitar Orçamento',
    click_contact: 'Clique em Contato',
    click_whatsapp: 'Clique no WhatsApp Oficial',
    click_instagram: 'Clique no Instagram Oficial (@onesignal_tech)',
    start_contact_form: 'Iniciou Formulário',
    submit_contact_form: 'Enviou Formulário',
    contact_form_success: 'Lead Registrado com Sucesso',
    portfolio_filter: 'Filtrou Portfólio',
    simulator_calculate: 'Usou Calculadora de Orçamento',
    privacy_policy_open: 'Abriu Política de Privacidade',
    diagnostic_started: 'Iniciou Diagnóstico',
    diagnostic_step_completed: 'Avançou Etapa do Diagnóstico',
    diagnostic_step_back: 'Voltou Etapa no Diagnóstico',
    diagnostic_completed: 'Concluiu Diagnóstico Inteligente',
    diagnostic_result_viewed: 'Visualizou Resultado do Diagnóstico',
    diagnostic_lead_started: 'Iniciou Envio de Lead no Diagnóstico',
    diagnostic_lead_submitted: 'Lead de Diagnóstico Enviado',
    recommended_service_clicked: 'Clicou em Solução Recomendada',
    calculator_started: 'Iniciou Calculadora de Automação',
    calculator_completed: 'Concluiu Calculadora de Automação',
    calculator_cta_clicked: 'Clicou CTA da Calculadora'
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          Telemetria & Eventos de Conversão em Tempo Real
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-medium border border-cyan-500/30">
            Live Stream
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Monitoramento em tempo real de cada interação, clique em CTA, diagnóstico e conversão realizada no site.
        </p>
      </div>

      {/* Grid: Device Distribution & Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Devices */}
        <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Monitor className="w-4 h-4 text-cyan-400" />
            Distribuição por Dispositivo
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  Mobile (Smartphones)
                </span>
                <span className="font-mono font-bold text-white">64%</span>
              </div>
              <div className="h-2 rounded-full bg-[#030D1A] overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '64%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-teal-400" />
                  Desktop & Laptops
                </span>
                <span className="font-mono font-bold text-white">36%</span>
              </div>
              <div className="h-2 rounded-full bg-[#030D1A] overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full" style={{ width: '36%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Clicked CTAs */}
        <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-4 md:col-span-2">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-cyan-400" />
            Gatilhos de Conversão Mais Acionados
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-[#030D1A] border border-white/5 space-y-1">
              <span className="text-xs text-slate-400 block">WhatsApp Flutuante & Navbar</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">64 cliques</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#030D1A] border border-white/5 space-y-1">
              <span className="text-xs text-slate-400 block">Diagnóstico Inteligente Iniciado</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">62 inícios</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#030D1A] border border-white/5 space-y-1">
              <span className="text-xs text-slate-400 block">Modal de Orçamento Rápido</span>
              <span className="text-lg font-bold text-teal-400 font-mono">48 aberturas</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#030D1A] border border-white/5 space-y-1">
              <span className="text-xs text-slate-400 block">Simulador de Escopo & Custos</span>
              <span className="text-lg font-bold text-purple-400 font-mono">35 cálculos</span>
            </div>
          </div>
        </div>

      </div>

      {/* Live Event Stream Log */}
      <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Feed de Eventos em Tempo Real ({filteredEvents.length})
            </h3>
            <span className="text-xs text-slate-400">Stream de dados com metadados e parâmetros da sessão</span>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              aria-label="Filtrar por tipo de evento"
              className="px-3 py-1.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-slate-300 outline-none focus:border-cyan-400"
            >
              <option value="all">Todos os Tipos de Evento</option>
              <option value="page_view">Visualização de Página</option>
              <option value="click_whatsapp">Clique WhatsApp</option>
              <option value="click_budget">Clique Orçamento</option>
              <option value="diagnostic_completed">Diagnóstico Concluído</option>
              <option value="contact_form_success">Lead Registrado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-2.5">Horário</th>
                <th className="pb-2.5">Evento</th>
                <th className="pb-2.5">Identificador / Parâmetros</th>
                <th className="pb-2.5">URL da Página</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {filteredEvents.slice(0, 30).map((evt) => (
                <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 text-slate-400">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-cyan-300 font-semibold">
                      {eventTypeLabels[evt.eventName] || evt.eventName}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-300">
                    {evt.metadata ? JSON.stringify(evt.metadata) : '—'}
                  </td>
                  <td className="py-2.5 text-slate-400 truncate max-w-xs">
                    {evt.pageUrl}
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
