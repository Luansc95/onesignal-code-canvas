import React, { useState, useId } from 'react';
import { Calculator, Clock, Users, Zap, ArrowRight, MessageSquare, Sparkles, HelpCircle } from 'lucide-react';
import { analytics } from '../../services/analyticsService';
import { getWhatsAppUrl } from '../../config/commercialConfig';

interface AutomationCalculatorProps {
  onStartDiagnosis?: () => void;
  onOpenBudgetModal?: (serviceType?: string) => void;
}

export const AutomationCalculator: React.FC<AutomationCalculatorProps> = ({
  onStartDiagnosis,
  onOpenBudgetModal
}) => {
  const peopleInputId = useId();
  const hoursInputId = useId();
  const processesInputId = useId();
  const hourlyRateInputId = useId();

  const [peopleCount, setPeopleCount] = useState<number>(3);
  const [weeklyHoursPerPerson, setWeeklyHoursPerPerson] = useState<number>(8);
  const [repetitiveProcessesCount, setRepetitiveProcessesCount] = useState<number>(2);
  const [hourlyRate, setHourlyRate] = useState<number>(45);

  // Calculations: 4.33 weeks per month
  const totalWeeklyHours = peopleCount * weeklyHoursPerPerson;
  const totalMonthlyHours = Math.round(totalWeeklyHours * 4.33);
  
  // Potential automatable range (approx. 50% to 75% for routine standardized tasks)
  const potentialSavedMonthlyHoursMin = Math.round(totalMonthlyHours * 0.5);
  const potentialSavedMonthlyHoursMax = Math.round(totalMonthlyHours * 0.75);

  // Approximate financial footprint directed to manual routine
  const estimatedMonthlyManualCost = totalMonthlyHours * hourlyRate;
  const estimatedOptimizedValueMin = potentialSavedMonthlyHoursMin * hourlyRate;
  const estimatedOptimizedValueMax = potentialSavedMonthlyHoursMax * hourlyRate;

  const handleSliderChange = () => {
    analytics.track('calculator_completed', {
      peopleCount,
      weeklyHoursPerPerson,
      totalMonthlyHours
    });
  };

  const handleWhatsApp = () => {
    analytics.track('click_whatsapp', { source: 'automation_calculator' });
    const message = `Olá OneSignal! Simulei na Calculadora de Oportunidade do site: nossa equipe gasta aproximadamente ${totalMonthlyHours}h/mês em rotinas repetitivas. Gostaria de avaliar automações para otimizar esse tempo.`;
    const url = getWhatsAppUrl('general', { customMessage: message });
    if (url) window.open(url, '_blank');
  };

  return (
    <div 
      id="calculadora-automacao"
      className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-[#22D3EE] text-xs font-mono">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador de Eficiência Operacional</span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-['Outfit'] text-white">
            Quanto tempo sua empresa pode economizar?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Estime a quantidade de horas que sua equipe dedica a processos manuais e descubra oportunidades de automação inteligente.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 shrink-0 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-[#2DD4BF] flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Tempo Total Estimado</span>
            <span className="text-base font-bold text-white font-mono">{totalMonthlyHours}h / mês</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs (Left) and Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Input 1: People */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor={peopleInputId} className="font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer">
                <Users className="w-4 h-4 text-[#22D3EE]" />
                Pessoas envolvidas na rotina
              </label>
              <span className="font-mono font-bold text-cyan-300 text-sm px-2.5 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
                {peopleCount} {peopleCount === 1 ? 'pessoa' : 'pessoas'}
              </span>
            </div>
            <input
              id={peopleInputId}
              type="range"
              min="1"
              max="25"
              value={peopleCount}
              onChange={(e) => {
                setPeopleCount(Number(e.target.value));
                handleSliderChange();
              }}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#22D3EE]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 pessoa</span>
              <span>10 pessoas</span>
              <span>25+ pessoas</span>
            </div>
          </div>

          {/* Input 2: Hours spent per week */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor={hoursInputId} className="font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer">
                <Clock className="w-4 h-4 text-[#2DD4BF]" />
                Horas gastas por semana em tarefas repetitivas (por pessoa)
              </label>
              <span className="font-mono font-bold text-teal-300 text-sm px-2.5 py-0.5 rounded-lg bg-teal-950/60 border border-teal-500/30">
                {weeklyHoursPerPerson}h / sem
              </span>
            </div>
            <input
              id={hoursInputId}
              type="range"
              min="1"
              max="35"
              value={weeklyHoursPerPerson}
              onChange={(e) => {
                setWeeklyHoursPerPerson(Number(e.target.value));
                handleSliderChange();
              }}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1h (leve)</span>
              <span>15h (moderado)</span>
              <span>35h (intensivo)</span>
            </div>
          </div>

          {/* Input 3 & 4: Quick Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
              <label htmlFor={processesInputId} className="block text-xs font-semibold text-slate-200">
                Processos repetitivos mapeados
              </label>
              <select
                id={processesInputId}
                value={repetitiveProcessesCount}
                onChange={(e) => setRepetitiveProcessesCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:border-[#22D3EE] outline-none"
              >
                <option value={1} className="bg-[#071B3A]">1 a 2 processos (ex: emissão ou digitação)</option>
                <option value={2} className="bg-[#071B3A]">3 a 5 processos (conferência, planilhas)</option>
                <option value={3} className="bg-[#071B3A]">6+ processos em múltiplos setores</option>
              </select>
            </div>

            <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <label htmlFor={hourlyRateInputId} className="text-xs font-semibold text-slate-200">
                  Custo médio estimado da hora (opcional)
                </label>
                <span className="text-[11px] font-mono text-cyan-300">R$ {hourlyRate}/h</span>
              </div>
              <input
                id={hourlyRateInputId}
                type="range"
                min="20"
                max="150"
                step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Right: Results Panel */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-cyan-950/50 via-[#071B3A] to-teal-950/50 border border-cyan-400/30 space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-cyan-300 tracking-wider">
              Diagnóstico de Oportunidade
            </span>
            <h4 className="text-lg font-bold text-white">
              Potencial de Otimização Estimado
            </h4>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-300 block">Horas dedicadas a tarefas manuais:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  ~{totalMonthlyHours} horas
                </span>
                <span className="text-xs text-slate-400">/ mês</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-950/60 border border-teal-400/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-teal-300 font-semibold">Horas potenciais liberadas com tecnologia:</span>
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#2DD4BF] font-mono">
                  {potentialSavedMonthlyHoursMin} a {potentialSavedMonthlyHoursMax}h
                </span>
                <span className="text-xs text-teal-200">/ mês</span>
              </div>
              <span className="text-[10px] text-teal-200/80 block mt-1">
                Tempo que sua equipe pode redirecionar para atendimento, vendas e estratégia.
              </span>
            </div>
          </div>

          {/* Educational Notice */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 leading-relaxed">
            💡 <strong className="text-white">Aviso educativo:</strong> Nem todo processo deve ser automatizado. Porém, tarefas repetitivas, manuais e padronizadas podem ser candidatas a melhorias tecnológicas.
          </div>

          {/* CTAs */}
          <div className="space-y-2.5 pt-1">
            {onStartDiagnosis && (
              <button
                type="button"
                onClick={() => {
                  analytics.track('calculator_cta_clicked', { action: 'start_diagnosis' });
                  onStartDiagnosis();
                }}
                className="w-full py-3 px-4 rounded-xl text-[#071B3A] font-bold text-xs sm:text-sm bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Fazer Diagnóstico Completo da Empresa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Avaliar Oportunidades no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
