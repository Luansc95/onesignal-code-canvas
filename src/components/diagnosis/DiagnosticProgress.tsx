import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { DIAGNOSTIC_STEPS_META } from '../../data/diagnosticQuestions';

interface DiagnosticProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const DiagnosticProgress: React.FC<DiagnosticProgressProps> = ({
  currentStep,
  totalSteps
}) => {
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full space-y-4">
      {/* Top Meta info */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-400/20 text-[#22D3EE] font-mono font-bold text-[10px] border border-cyan-400/30">
            {currentStep}
          </span>
          <span className="font-medium text-slate-300">
            Etapa {currentStep} de {totalSteps}:{' '}
            <strong className="text-white font-semibold">
              {DIAGNOSTIC_STEPS_META[currentStep - 1]?.title}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{progressPercent}% Concluído</span>
        </div>
      </div>

      {/* Main Progress Track */}
      <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
        <div 
          className="h-full bg-gradient-to-r from-[#22D3EE] via-[#2DD4BF] to-teal-400 rounded-full transition-all duration-500 ease-out shadow-sm shadow-cyan-500/50"
          style={{ width: `${Math.max(8, progressPercent)}%` }}
        />
      </div>

      {/* Desktop Step Dots */}
      <div className="hidden sm:grid grid-cols-5 gap-2 pt-1">
        {DIAGNOSTIC_STEPS_META.map((meta) => {
          const isDone = currentStep > meta.step;
          const isCurrent = currentStep === meta.step;

          return (
            <div 
              key={meta.step} 
              className={`flex flex-col items-center text-center p-1.5 rounded-lg border transition-all ${
                isCurrent 
                  ? 'bg-white/10 border-cyan-400/50 text-white shadow-sm shadow-cyan-500/10' 
                  : isDone 
                  ? 'bg-white/5 border-white/10 text-slate-300' 
                  : 'bg-transparent border-transparent text-slate-500'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-medium">
                {isDone ? (
                  <Check className="w-3 h-3 text-teal-400" />
                ) : (
                  <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[9px] font-mono ${
                    isCurrent ? 'bg-cyan-400 text-[#071B3A] font-bold' : 'bg-white/10 text-slate-400'
                  }`}>
                    {meta.step}
                  </span>
                )}
                <span className="truncate">{meta.shortTitle}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
