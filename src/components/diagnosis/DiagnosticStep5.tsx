import React from 'react';
import { Network, FolderLock, RefreshCw, Check } from 'lucide-react';
import { SYSTEMS_INTEGRATED_OPTIONS, INFO_ACCESS_OPTIONS, REPETITIVE_TASKS_OPTIONS } from '../../data/diagnosticQuestions';

interface DiagnosticStep5Props {
  systemsIntegrated?: string;
  infoAccessEase?: string;
  repetitiveTasksAutomable?: string;
  onChangeSystemsIntegrated: (val: string) => void;
  onChangeInfoAccessEase: (val: string) => void;
  onChangeRepetitiveTasks: (val: string) => void;
}

export const DiagnosticStep5: React.FC<DiagnosticStep5Props> = ({
  systemsIntegrated,
  infoAccessEase,
  repetitiveTasksAutomable,
  onChangeSystemsIntegrated,
  onChangeInfoAccessEase,
  onChangeRepetitiveTasks
}) => {
  return (
    <div className="space-y-6">
      {/* Subquestion 1: Integrated systems */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-[#22D3EE]" />
          <label className="text-xs sm:text-sm font-semibold text-white">
            Os principais sistemas da sua empresa estão integrados? *
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SYSTEMS_INTEGRATED_OPTIONS.map((opt) => {
            const isSelected = systemsIntegrated === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`systems-integrated-${opt.id}`}
                onClick={() => onChangeSystemsIntegrated(opt.id)}
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
      </div>

      {/* Subquestion 2: Easy info access */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-2">
          <FolderLock className="w-4 h-4 text-[#2DD4BF]" />
          <label className="text-xs sm:text-sm font-semibold text-white">
            As informações importantes podem ser acessadas facilmente pela equipe? *
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {INFO_ACCESS_OPTIONS.map((opt) => {
            const isSelected = infoAccessEase === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`info-access-${opt.id}`}
                onClick={() => onChangeInfoAccessEase(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-teal-500/20 border-[#2DD4BF] text-white shadow-sm font-semibold'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-[#2DD4BF] text-[#071B3A] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subquestion 3: Repetitive tasks */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <label className="text-xs sm:text-sm font-semibold text-white">
            Existem tarefas repetitivas que poderiam ser automatizadas? *
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {REPETITIVE_TASKS_OPTIONS.map((opt) => {
            const isSelected = repetitiveTasksAutomable === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`repetitive-tasks-${opt.id}`}
                onClick={() => onChangeRepetitiveTasks(opt.id)}
                className={`p-3 rounded-xl border text-center text-xs font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm font-semibold'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
