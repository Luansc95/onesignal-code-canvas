import React from 'react';
import { AlertCircle, Check, Plus } from 'lucide-react';
import { CHALLENGE_OPTIONS } from '../../data/diagnosticQuestions';

interface DiagnosticStep2Props {
  selectedChallenges: string[];
  customChallenge?: string;
  onToggleChallenge: (challengeId: string) => void;
  onChangeCustomChallenge: (val: string) => void;
}

export const DiagnosticStep2: React.FC<DiagnosticStep2Props> = ({
  selectedChallenges,
  customChallenge,
  onToggleChallenge,
  onChangeCustomChallenge
}) => {
  const MAX_SELECTIONS = 4;
  const isMaxReached = selectedChallenges.length >= MAX_SELECTIONS;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <label className="text-sm sm:text-base font-semibold text-white">
            Qual é o principal desafio que você gostaria de resolver? *
          </label>
        </div>
        <span className="text-xs text-cyan-300 font-mono">
          {selectedChallenges.length}/{MAX_SELECTIONS} selecionados
        </span>
      </div>

      <p className="text-xs text-slate-300">
        Selecione até {MAX_SELECTIONS} opções que melhor representam os gargalos operacionais da sua empresa.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CHALLENGE_OPTIONS.map((opt) => {
          const isSelected = selectedChallenges.includes(opt.id);
          const isDisabled = !isSelected && isMaxReached;

          return (
            <button
              key={opt.id}
              type="button"
              id={`challenge-opt-${opt.id}`}
              disabled={isDisabled}
              onClick={() => onToggleChallenge(opt.id)}
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

      {/* Optional Custom Challenge Input if 'outro_desafio' is selected */}
      {selectedChallenges.includes('outro_desafio') && (
        <div className="pt-2 animate-fadeIn">
          <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
            Descreva brevemente o outro desafio:
          </label>
          <input
            type="text"
            id="custom-challenge-input"
            value={customChallenge || ''}
            onChange={(e) => onChangeCustomChallenge(e.target.value)}
            placeholder="Ex: Falha na conciliação financeira de múltiplos meios de pagamento..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-xs sm:text-sm focus:border-[#22D3EE] focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
