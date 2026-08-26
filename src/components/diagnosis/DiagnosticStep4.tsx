import React from 'react';
import { Target, Check } from 'lucide-react';
import { OBJECTIVE_OPTIONS } from '../../data/diagnosticQuestions';

interface DiagnosticStep4Props {
  selectedObjectives: string[];
  onToggleObjective: (objId: string) => void;
}

export const DiagnosticStep4: React.FC<DiagnosticStep4Props> = ({
  selectedObjectives,
  onToggleObjective
}) => {
  const MAX_SELECTIONS = 4;
  const isMaxReached = selectedObjectives.length >= MAX_SELECTIONS;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-400" />
          <label className="text-sm sm:text-base font-semibold text-white">
            Qual resultado você gostaria de alcançar? *
          </label>
        </div>
        <span className="text-xs text-cyan-300 font-mono">
          {selectedObjectives.length}/{MAX_SELECTIONS} selecionados
        </span>
      </div>

      <p className="text-xs text-slate-300">
        Escolha os principais objetivos prioritários para a evolução da sua empresa.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {OBJECTIVE_OPTIONS.map((opt) => {
          const isSelected = selectedObjectives.includes(opt.id);
          const isDisabled = !isSelected && isMaxReached;

          return (
            <button
              key={opt.id}
              type="button"
              id={`obj-opt-${opt.id}`}
              disabled={isDisabled}
              onClick={() => onToggleObjective(opt.id)}
              className={`flex items-start justify-between p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-950/70 to-teal-950/70 border-[#22D3EE] shadow-md shadow-cyan-500/10 text-white'
                  : isDisabled
                  ? 'bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed text-slate-500'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="pr-2">
                <div className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {opt.label}
                </div>
                {opt.description && (
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {opt.description}
                  </div>
                )}
              </div>

              <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                isSelected ? 'border-[#22D3EE] bg-[#22D3EE] text-[#071B3A]' : 'border-white/30 bg-white/5'
              }`}>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
