import React from 'react';
import { Database, Clock, TrendingUp, Check } from 'lucide-react';
import { INFO_CONTROL_OPTIONS, MANUAL_LEVEL_OPTIONS, INDICATORS_OPTIONS } from '../../data/diagnosticQuestions';

interface DiagnosticStep3Props {
  infoControl?: string;
  customInfoControl?: string;
  manualProcessesLevel?: string;
  indicatorsStatus?: string;
  onChangeInfoControl: (val: string) => void;
  onChangeCustomInfoControl: (val: string) => void;
  onChangeManualLevel: (val: string) => void;
  onChangeIndicatorsStatus: (val: string) => void;
}

export const DiagnosticStep3: React.FC<DiagnosticStep3Props> = ({
  infoControl,
  customInfoControl,
  manualProcessesLevel,
  indicatorsStatus,
  onChangeInfoControl,
  onChangeCustomInfoControl,
  onChangeManualLevel,
  onChangeIndicatorsStatus
}) => {
  return (
    <div className="space-y-6">
      {/* Subquestion 1: How info is controlled */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#22D3EE]" />
          <label className="text-xs sm:text-sm font-semibold text-white">
            Como sua empresa controla as informações atualmente? *
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {INFO_CONTROL_OPTIONS.map((opt) => {
            const isSelected = infoControl === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`info-control-${opt.id}`}
                onClick={() => onChangeInfoControl(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-500/20 border-[#22D3EE] text-white shadow-sm font-semibold'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-[#22D3EE] text-[#071B3A] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {infoControl === 'outro' && (
          <input
            type="text"
            id="custom-info-control-input"
            value={customInfoControl || ''}
            onChange={(e) => onChangeCustomInfoControl(e.target.value)}
            placeholder="Como as informações são gerenciadas hoje?"
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/20 text-white text-xs focus:border-[#22D3EE] focus:outline-none"
          />
        )}
      </div>

      {/* Subquestion 2: Manual processes proportion */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2DD4BF]" />
          <label className="text-xs sm:text-sm font-semibold text-white">
            Quanto dos processos da empresa ainda é realizado manualmente? *
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MANUAL_LEVEL_OPTIONS.map((opt) => {
            const isSelected = manualProcessesLevel === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`manual-level-${opt.id}`}
                onClick={() => onChangeManualLevel(opt.id)}
                className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-teal-500/25 border-[#2DD4BF] text-white shadow-sm font-semibold'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subquestion 3: Decision Indicators */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <label className="text-xs sm:text-sm font-semibold text-white">
            Sua empresa possui indicadores atualizados para tomada de decisão? *
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {INDICATORS_OPTIONS.map((opt) => {
            const isSelected = indicatorsStatus === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`indicators-opt-${opt.id}`}
                onClick={() => onChangeIndicatorsStatus(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm font-semibold'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-emerald-400 text-[#071B3A] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
