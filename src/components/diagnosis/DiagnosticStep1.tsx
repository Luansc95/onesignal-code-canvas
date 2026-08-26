import React from 'react';
import { Building2, Briefcase, Check } from 'lucide-react';
import { COMPANY_SIZE_OPTIONS, INDUSTRY_OPTIONS } from '../../data/diagnosticQuestions';

interface DiagnosticStep1Props {
  companySize?: string;
  industry?: string;
  customIndustry?: string;
  onChangeCompanySize: (size: string) => void;
  onChangeIndustry: (ind: string) => void;
  onChangeCustomIndustry: (val: string) => void;
}

export const DiagnosticStep1: React.FC<DiagnosticStep1Props> = ({
  companySize,
  industry,
  customIndustry,
  onChangeCompanySize,
  onChangeIndustry,
  onChangeCustomIndustry
}) => {
  return (
    <div className="space-y-6">
      {/* Question 1: Company Size */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#22D3EE]" />
          <label className="text-sm sm:text-base font-semibold text-white">
            Qual é o porte da sua empresa? *
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {COMPANY_SIZE_OPTIONS.map((opt) => {
            const isSelected = companySize === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`size-opt-${opt.id}`}
                onClick={() => onChangeCompanySize(opt.id)}
                className={`flex items-start justify-between p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/60 to-teal-950/60 border-[#22D3EE] shadow-md shadow-cyan-500/10 text-white'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div>
                  <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {opt.label}
                  </div>
                  {opt.description && (
                    <div className="text-xs text-slate-400 mt-0.5">
                      {opt.description}
                    </div>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                  isSelected ? 'border-[#22D3EE] bg-[#22D3EE] text-[#071B3A]' : 'border-white/30 bg-white/5'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 2: Industry Sector */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#2DD4BF]" />
          <label className="text-sm sm:text-base font-semibold text-white">
            Qual é a sua área de atuação? *
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {INDUSTRY_OPTIONS.map((opt) => {
            const isSelected = industry === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`industry-opt-${opt.id}`}
                onClick={() => onChangeIndustry(opt.id)}
                className={`px-3 py-2.5 rounded-xl border text-center text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500/20 border-[#22D3EE] text-white shadow-sm font-semibold'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Optional Custom Industry Input */}
        {industry === 'outro' && (
          <div className="pt-2 animate-fadeIn">
            <input
              type="text"
              id="custom-industry-input"
              value={customIndustry || ''}
              onChange={(e) => onChangeCustomIndustry(e.target.value)}
              placeholder="Especifique seu segmento (ex: Logística, Finanças, Imobiliário...)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-xs sm:text-sm focus:border-[#22D3EE] focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
