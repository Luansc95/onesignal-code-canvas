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
}

export const ProjectMockup: React.FC<ProjectMockupProps> = ({ type, title }) => {
  switch (type) {
    case 'dashboard':
      return (
        <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-[#061B33] via-[#092244] to-[#040D1A] p-4 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-[11px] font-mono text-cyan-200">ERP Matrix Core // v4.2</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              REALTIME
            </span>
          </div>

          {/* Mini analytics chart simulation */}
          <div className="grid grid-cols-4 gap-2 my-auto">
            <div className="p-2 rounded bg-[#071B3A]/90 border border-cyan-500/20">
              <span className="text-[9px] text-slate-400 block">Estoque</span>
              <span className="text-xs font-bold text-white">99.8%</span>
              <div className="w-full bg-slate-800 h-1 rounded mt-1 overflow-hidden">
                <div className="bg-cyan-400 h-full w-[95%]" />
              </div>
            </div>
            <div className="p-2 rounded bg-[#071B3A]/90 border border-cyan-500/20">
              <span className="text-[9px] text-slate-400 block">Faturamento</span>
              <span className="text-xs font-bold text-emerald-400">+42.5%</span>
              <div className="w-full bg-slate-800 h-1 rounded mt-1 overflow-hidden">
                <div className="bg-emerald-400 h-full w-[80%]" />
              </div>
            </div>
            <div className="p-2 rounded bg-[#071B3A]/90 border border-cyan-500/20">
              <span className="text-[9px] text-slate-400 block">Ordens</span>
              <span className="text-xs font-bold text-teal-300">1,248</span>
              <div className="w-full bg-slate-800 h-1 rounded mt-1 overflow-hidden">
                <div className="bg-teal-400 h-full w-[70%]" />
              </div>
            </div>
            <div className="p-2 rounded bg-[#071B3A]/90 border border-cyan-500/20">
              <span className="text-[9px] text-slate-400 block">SLA</span>
              <span className="text-xs font-bold text-cyan-300">99.9%</span>
              <div className="w-full bg-slate-800 h-1 rounded mt-1 overflow-hidden">
                <div className="bg-cyan-300 h-full w-[98%]" />
              </div>
            </div>
          </div>

          {/* Bottom simulated graph lines */}
          <div className="h-10 flex items-end gap-1.5 pt-2">
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
        <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-[#041527] via-[#082846] to-[#030d1a] p-4 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
          <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span className="text-[11px] font-mono text-teal-200">Industrial SCADA Telemetry</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300">128 SENSORS ONLINE</span>
          </div>

          {/* Plant Sensor Grid */}
          <div className="grid grid-cols-3 gap-2.5 my-2">
            <div className="p-2 rounded-lg bg-[#071B3A] border border-teal-500/30 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <div>
                <div className="text-[9px] text-slate-400">Vibração</div>
                <div className="text-xs font-bold text-white">0.04 mm/s</div>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[#071B3A] border border-cyan-500/30 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-[9px] text-slate-400">Temp. Maq 04</div>
                <div className="text-xs font-bold text-cyan-300">64.2 °C</div>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[#071B3A] border border-emerald-500/30 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[9px] text-slate-400">Status OEE</div>
                <div className="text-xs font-bold text-emerald-300">92.4%</div>
              </div>
            </div>
          </div>

          {/* Animated pulse sine wave indicator */}
          <div className="bg-[#030d1a] p-2 rounded border border-teal-500/20 flex items-center justify-between text-[10px] font-mono text-slate-300">
            <span className="text-teal-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
              MQTT Broker: Latência 1.4ms
            </span>
            <span className="text-slate-400">Sem falhas críticas</span>
          </div>
        </div>
      );

    case 'crm':
      return (
        <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-[#061830] via-[#0a2f55] to-[#040D1A] p-4 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
          <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[11px] font-mono text-sky-200">Omnichannel Sales Funnel</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30">
              WHATSAPP SYNC
            </span>
          </div>

          {/* Mini Kanban Columns */}
          <div className="grid grid-cols-3 gap-2 my-2">
            <div className="p-2 rounded bg-[#071B3A]/90 border border-slate-700 space-y-1.5">
              <div className="text-[9px] font-bold text-slate-300">Novo Lead (12)</div>
              <div className="p-1.5 rounded bg-[#040D1A] text-[9px] text-slate-200 border-l-2 border-sky-400">
                Construtora Alfa • R$ 120k
              </div>
            </div>
            <div className="p-2 rounded bg-[#071B3A]/90 border border-slate-700 space-y-1.5">
              <div className="text-[9px] font-bold text-cyan-300">Em Proposta (5)</div>
              <div className="p-1.5 rounded bg-[#040D1A] text-[9px] text-slate-200 border-l-2 border-cyan-400">
                LogTech Corp • R$ 85k
              </div>
            </div>
            <div className="p-2 rounded bg-[#071B3A]/90 border border-slate-700 space-y-1.5">
              <div className="text-[9px] font-bold text-teal-300">Fechado Ganho (8)</div>
              <div className="p-1.5 rounded bg-[#040D1A] text-[9px] text-slate-200 border-l-2 border-emerald-400">
                Global Foods • R$ 240k
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
            <span>Conversão: +64% vs mês anterior</span>
            <span className="text-teal-400 font-mono">100% Automatizado</span>
          </div>
        </div>
      );

    case 'finance':
      return (
        <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-[#071b38] via-[#0c3866] to-[#040D1A] p-4 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-mono text-cyan-200">FinFlow Executive DRE</span>
            </div>
            <span className="text-[10px] font-mono text-teal-300">OPEN FINANCE API</span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2">
            <div className="p-2.5 rounded-lg bg-[#040D1A]/80 border border-cyan-500/30">
              <span className="text-[9px] text-slate-400">Fluxo Projetado (90d)</span>
              <div className="text-sm font-bold text-white font-mono">R$ 2.845.200</div>
              <span className="text-[9px] text-teal-400">+18% vs orçamento</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#040D1A]/80 border border-teal-500/30">
              <span className="text-[9px] text-slate-400">Conciliação Automática</span>
              <div className="text-sm font-bold text-teal-300 font-mono">100.0%</div>
              <span className="text-[9px] text-slate-300">0 pendências</span>
            </div>
          </div>

          <div className="flex items-center gap-1 h-6">
            <div className="h-full bg-cyan-400 rounded-l flex-1" title="Entradas" />
            <div className="h-full bg-teal-400 flex-1" title="Investimentos" />
            <div className="h-full bg-slate-700 w-1/4 rounded-r" title="Despesas" />
          </div>
        </div>
      );

    case 'mobile':
      return (
        <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-[#051930] via-[#0b335a] to-[#040D1A] p-4 flex items-center justify-between relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
          <div className="space-y-2 max-w-[60%]">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              RouteSync Driver App
            </div>
            <div className="text-xs font-bold text-white">Roteirização GPS & Assinatura Digital</div>
            <div className="text-[10px] text-slate-300">
              34 veículos monitorados ao vivo com modo offline sincronizado.
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30">
              <MapPin className="w-3 h-3" />
              GPS Live Tracker
            </div>
          </div>

          {/* Smartphone mockup outline */}
          <div className="w-24 h-40 bg-[#040D1A] rounded-xl border-2 border-cyan-500/40 p-1.5 flex flex-col justify-between shadow-lg shrink-0">
            <div className="w-6 h-1 bg-slate-700 rounded-full mx-auto" />
            <div className="p-1 rounded bg-[#071B3A] text-[8px] space-y-1 text-slate-300">
              <div className="bg-teal-500/20 text-teal-300 p-0.5 rounded font-mono">Rota Otimizada</div>
              <div className="text-[7px]">Entrega 04/18</div>
              <div className="h-1 bg-cyan-400 rounded w-3/4" />
            </div>
            <div className="w-3 h-3 rounded-full border border-slate-700 mx-auto" />
          </div>
        </div>
      );

    case 'ai':
      return (
        <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-[#05172e] via-[#09294e] to-[#040D1A] p-4 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
          <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span className="text-[11px] font-mono text-sky-200">SignalAI Cognitive Engine</span>
            </div>
            <span className="text-[10px] font-mono text-teal-300">RAG KNOWLEDGE BASE</span>
          </div>

          {/* AI Chat preview */}
          <div className="space-y-2 my-2 text-[10px]">
            <div className="p-2 rounded-lg bg-[#040D1A]/80 border border-slate-700 text-slate-300 max-w-[85%]">
              <span className="text-cyan-400 font-bold block mb-0.5">Cliente:</span>
              Como emitir a 2ª via da nota fiscal e consultar meu pedido?
            </div>
            <div className="p-2 rounded-lg bg-[#0B4F7A]/80 border border-cyan-500/30 text-white ml-auto max-w-[90%]">
              <span className="text-teal-300 font-bold block mb-0.5">SignalAI (2.1s):</span>
              Localizei seu pedido #8921. O PDF da nota foi enviado para seu e-mail e você pode baixar aqui.
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span className="text-teal-400">Precisão: 99.4% (Zero alucinações)</span>
            <span>24/7 Ativo</span>
          </div>
        </div>
      );

    default:
      return null;
  }
};
