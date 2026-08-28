import React from 'react';
import { 
  BarChart2, 
  Activity, 
  Cpu, 
  MessageSquare, 
  TrendingUp, 
  MapPin, 
  Bot, 
  ShieldCheck, 
  Smartphone,
  Layers,
  Database
} from 'lucide-react';

interface ProjectMockupProps {
  type: 'dashboard' | 'mobile' | 'iot' | 'crm' | 'finance' | 'ai';
  title: string;
  variant?: 'card' | 'modal';
}

export const ProjectMockup: React.FC<ProjectMockupProps> = ({ type, title, variant = 'card' }) => {
  const isModal = variant === 'modal';
  const containerHeight = isModal 
    ? 'min-h-[220px] sm:min-h-[260px] md:min-h-[300px]' 
    : 'h-48 sm:h-52';

  switch (type) {
    case 'dashboard':
      return (
        <div className={`w-full ${containerHeight} bg-gradient-to-br from-[#061B33] via-[#092244] to-[#040D1A] p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300`}>
          {/* Header bar / Window Chrome */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-[11px] sm:text-xs font-mono text-cyan-200 ml-1">
                ERP Matrix Core // v4.2
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              LIVE DATA 24/7
            </span>
          </div>

          {/* Mini analytics chart simulation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-auto py-2">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#071B3A]/90 border border-cyan-500/25 shadow-sm">
              <span className="text-[10px] text-slate-400 block">Estoque Unificado</span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono">99.8%</span>
              <div className="w-full bg-slate-800 h-1.5 rounded mt-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-full w-[95%]" />
              </div>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#071B3A]/90 border border-cyan-500/25 shadow-sm">
              <span className="text-[10px] text-slate-400 block">Faturamento</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">+42.5%</span>
              <div className="w-full bg-slate-800 h-1.5 rounded mt-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full w-[80%]" />
              </div>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#071B3A]/90 border border-cyan-500/25 shadow-sm">
              <span className="text-[10px] text-slate-400 block">Ordens / Mês</span>
              <span className="text-xs sm:text-sm font-bold text-teal-300 font-mono">1,248</span>
              <div className="w-full bg-slate-800 h-1.5 rounded mt-1.5 overflow-hidden">
                <div className="bg-teal-400 h-full w-[70%]" />
              </div>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#071B3A]/90 border border-cyan-500/25 shadow-sm">
              <span className="text-[10px] text-slate-400 block">SLA Operacional</span>
              <span className="text-xs sm:text-sm font-bold text-cyan-300 font-mono">99.9%</span>
              <div className="w-full bg-slate-800 h-1.5 rounded mt-1.5 overflow-hidden">
                <div className="bg-cyan-300 h-full w-[98%]" />
              </div>
            </div>
          </div>

          {/* Bottom simulated graph lines */}
          <div className="h-10 sm:h-12 flex items-end gap-1.5 pt-2">
            {[35, 55, 40, 75, 60, 85, 95, 70, 88, 100].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-[#0B4F7A] to-cyan-400 rounded-t opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      );

    case 'iot':
      return (
        <div className={`w-full ${containerHeight} bg-gradient-to-br from-[#041527] via-[#082846] to-[#030d1a] p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300`}>
          <div className="flex items-center justify-between border-b border-teal-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-mono text-teal-200">SCADA Industrial // Telemetria</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              128 SENSORS ONLINE
            </span>
          </div>

          {/* Plant Sensor Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-2 py-1">
            <div className="p-2.5 rounded-xl bg-[#071B3A] border border-teal-500/30 flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">Vibração Eixo A</div>
                <div className="text-xs sm:text-sm font-bold text-white font-mono">0.04 mm/s</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#071B3A] border border-cyan-500/30 flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">Temp. Reator 04</div>
                <div className="text-xs sm:text-sm font-bold text-cyan-300 font-mono">64.2 °C</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#071B3A] border border-emerald-500/30 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">Status OEE Geral</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-300 font-mono">92.4%</div>
              </div>
            </div>
          </div>

          {/* Animated pulse sine wave indicator */}
          <div className="bg-[#030d1a] p-2 rounded-lg border border-teal-500/20 flex items-center justify-between text-[10px] font-mono text-slate-300">
            <span className="text-teal-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
              MQTT Broker: Latência 1.4ms
            </span>
            <span className="text-slate-400">Tolerância a falhas ativada</span>
          </div>
        </div>
      );

    case 'crm':
      return (
        <div className={`w-full ${containerHeight} bg-gradient-to-br from-[#061830] via-[#0a2f55] to-[#040D1A] p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300`}>
          <div className="flex items-center justify-between border-b border-sky-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[11px] sm:text-xs font-mono text-sky-200">Funil Omnichannel & CRM</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/30">
              WHATSAPP SYNC
            </span>
          </div>

          {/* Mini Kanban Columns */}
          <div className="grid grid-cols-3 gap-2 my-2 py-1">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#071B3A]/90 border border-slate-700 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-300">Novo Lead (12)</div>
              <div className="p-1.5 rounded-lg bg-[#040D1A] text-[9px] sm:text-[10px] text-slate-200 border-l-2 border-sky-400">
                Construtora Alfa • R$ 120k
              </div>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#071B3A]/90 border border-slate-700 space-y-1.5">
              <div className="text-[10px] font-bold text-cyan-300">Em Proposta (5)</div>
              <div className="p-1.5 rounded-lg bg-[#040D1A] text-[9px] sm:text-[10px] text-slate-200 border-l-2 border-cyan-400">
                LogTech Corp • R$ 85k
              </div>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#071B3A]/90 border border-slate-700 space-y-1.5">
              <div className="text-[10px] font-bold text-teal-300">Fechado Ganho (8)</div>
              <div className="p-1.5 rounded-lg bg-[#040D1A] text-[9px] sm:text-[10px] text-slate-200 border-l-2 border-emerald-400">
                Global Foods • R$ 240k
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-300 flex items-center justify-between pt-1 font-mono">
            <span className="text-cyan-300">Taxa de Conversão: +64%</span>
            <span className="text-teal-400">Roteamento 100% Automático</span>
          </div>
        </div>
      );

    case 'finance':
      return (
        <div className={`w-full ${containerHeight} bg-gradient-to-br from-[#071b38] via-[#0c3866] to-[#040D1A] p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300`}>
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] sm:text-xs font-mono text-cyan-200">FinFlow DRE Executivo</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
              OPEN FINANCE API
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2 py-1">
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#040D1A]/85 border border-cyan-500/30">
              <span className="text-[10px] text-slate-400">Fluxo Projetado (90 dias)</span>
              <div className="text-sm sm:text-base font-bold text-white font-mono">R$ 2.845.200</div>
              <span className="text-[10px] text-teal-400 font-mono">+18% vs planejado</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#040D1A]/85 border border-teal-500/30">
              <span className="text-[10px] text-slate-400">Conciliação Bancária</span>
              <div className="text-sm sm:text-base font-bold text-teal-300 font-mono">100.0%</div>
              <span className="text-[10px] text-slate-300 font-mono">0 pendências</span>
            </div>
          </div>

          <div className="flex items-center gap-1 h-5 sm:h-6">
            <div className="h-full bg-cyan-400 rounded-l flex-1" title="Entradas" />
            <div className="h-full bg-teal-400 flex-1" title="Investimentos" />
            <div className="h-full bg-slate-700 w-1/4 rounded-r" title="Despesas" />
          </div>
        </div>
      );

    case 'mobile':
      return (
        <div className={`w-full ${containerHeight} bg-gradient-to-br from-[#051930] via-[#0b335a] to-[#040D1A] p-3.5 sm:p-5 flex items-center justify-between relative overflow-hidden transition-all duration-300`}>
          <div className="space-y-2 max-w-[65%]">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-cyan-300">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              RouteSync Driver App
            </div>
            <div className="text-xs sm:text-sm font-bold text-white font-['Outfit']">
              Roteirização Inteligente & Assinatura Digital
            </div>
            <div className="text-[10px] sm:text-xs text-slate-300 leading-relaxed">
              34 veículos monitorados ao vivo com sincronização offline imediata.
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30">
              <MapPin className="w-3 h-3" />
              GPS Live Tracker
            </div>
          </div>

          {/* Smartphone mockup outline */}
          <div className="w-24 sm:w-28 h-36 sm:h-44 bg-[#040D1A] rounded-2xl border-2 border-cyan-500/40 p-1.5 flex flex-col justify-between shadow-2xl shrink-0">
            <div className="w-6 h-1 bg-slate-700 rounded-full mx-auto" />
            <div className="p-1.5 rounded-lg bg-[#071B3A] text-[8px] sm:text-[9px] space-y-1 text-slate-300">
              <div className="bg-teal-500/20 text-teal-300 p-0.5 rounded font-mono font-semibold">Rota Otimizada</div>
              <div className="text-[8px] text-slate-200">Entrega 04/18</div>
              <div className="h-1 bg-cyan-400 rounded w-3/4" />
            </div>
            <div className="w-3 h-3 rounded-full border border-slate-700 mx-auto" />
          </div>
        </div>
      );

    case 'ai':
      return (
        <div className={`w-full ${containerHeight} bg-gradient-to-br from-[#05172e] via-[#09294e] to-[#040D1A] p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300`}>
          <div className="flex items-center justify-between border-b border-sky-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-mono text-sky-200">SignalAI Engine</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
              RAG KNOWLEDGE BASE
            </span>
          </div>

          {/* AI Chat preview */}
          <div className="space-y-2 my-2 py-1 text-[10px] sm:text-xs">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#040D1A]/85 border border-slate-700 text-slate-300 max-w-[85%]">
              <span className="text-cyan-400 font-bold block mb-0.5 text-[10px]">Cliente:</span>
              Como consultar meu pedido e gerar a 2ª via da nota?
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#0B4F7A]/85 border border-cyan-500/30 text-white ml-auto max-w-[90%]">
              <span className="text-teal-300 font-bold block mb-0.5 text-[10px]">SignalAI (1.8s):</span>
              Pedido #8921 localizado. O link para download da nota foi gerado com sucesso.
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
            <span className="text-teal-400">Precisão: 99.4% (Zero alucinações)</span>
            <span>24/7 Ativo</span>
          </div>
        </div>
      );

    default:
      return null;
  }
};
