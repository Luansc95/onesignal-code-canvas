import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { DiagnosticAnswers, DiagnosticResultData } from '../../types';
import { DiagnosticEngine } from '../../lib/diagnosticEngine';
import { analytics } from '../../services/analyticsService';
import { DiagnosticProgress } from './DiagnosticProgress';
import { DiagnosticStep1 } from './DiagnosticStep1';
import { DiagnosticStep2 } from './DiagnosticStep2';
import { DiagnosticStep3 } from './DiagnosticStep3';
import { DiagnosticStep4 } from './DiagnosticStep4';
import { DiagnosticStep5 } from './DiagnosticStep5';
import { DiagnosticResult } from './DiagnosticResult';
import { AutomationCalculator } from './AutomationCalculator';
import { DiagnosisFaq } from './DiagnosisFaq';

interface DiagnosisFlowProps {
  onSelectSolutionForQuote?: (solutionTitle: string) => void;
  onExploreServices?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenBudgetModal?: (serviceType?: string) => void;
}

export const DiagnosisFlow: React.FC<DiagnosisFlowProps> = ({
  onSelectSolutionForQuote,
  onExploreServices,
  onOpenPrivacyPolicy,
  onOpenBudgetModal
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  const [answers, setAnswers] = useState<DiagnosticAnswers>({
    companySize: undefined,
    industry: undefined,
    customIndustry: '',
    challenges: [],
    customChallenge: '',
    infoControl: undefined,
    customInfoControl: '',
    manualProcessesLevel: undefined,
    indicatorsStatus: undefined,
    objectives: [],
    systemsIntegrated: undefined,
    infoAccessEase: undefined,
    repetitiveTasksAutomable: undefined
  });

  const [result, setResult] = useState<DiagnosticResultData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Track start of diagnostic
  useEffect(() => {
    analytics.track('diagnostic_started');
  }, []);

  // Scroll to diagnostic container when step changes
  const scrollToFlow = () => {
    const el = document.getElementById('diagnostico-questionnaire-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const validateCurrentStep = (): boolean => {
    setErrorMessage(null);

    switch (currentStep) {
      case 1:
        if (!answers.companySize) {
          setErrorMessage('Por favor, selecione o porte da sua empresa.');
          return false;
        }
        if (!answers.industry) {
          setErrorMessage('Por favor, selecione sua área de atuação.');
          return false;
        }
        return true;

      case 2:
        if (!answers.challenges || answers.challenges.length === 0) {
          setErrorMessage('Selecione pelo menos um desafio para prosseguir.');
          return false;
        }
        return true;

      case 3:
        if (!answers.infoControl) {
          setErrorMessage('Selecione como sua empresa controla as informações.');
          return false;
        }
        if (!answers.manualProcessesLevel) {
          setErrorMessage('Informe a proporção aproximada de processos manuais.');
          return false;
        }
        if (!answers.indicatorsStatus) {
          setErrorMessage('Selecione a situação atual dos seus indicadores.');
          return false;
        }
        return true;

      case 4:
        if (!answers.objectives || answers.objectives.length === 0) {
          setErrorMessage('Selecione pelo menos um objetivo prioritário.');
          return false;
        }
        return true;

      case 5:
        if (!answers.systemsIntegrated) {
          setErrorMessage('Informe se os sistemas da sua empresa estão integrados.');
          return false;
        }
        if (!answers.infoAccessEase) {
          setErrorMessage('Informe se as informações são acessadas facilmente.');
          return false;
        }
        if (!answers.repetitiveTasksAutomable) {
          setErrorMessage('Informe sobre a existência de tarefas repetitivas.');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;

    analytics.track('diagnostic_step_completed', { step: currentStep });

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      scrollToFlow();
    } else {
      // Evaluate result
      const calculatedResult = DiagnosticEngine.evaluate(answers);
      setResult(calculatedResult);
      analytics.track('diagnostic_completed', {
        score: calculatedResult.score,
        maturityLevel: calculatedResult.maturityLevel
      });
      scrollToFlow();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      analytics.track('diagnostic_step_back', { fromStep: currentStep });
      setCurrentStep(prev => prev - 1);
      setErrorMessage(null);
      scrollToFlow();
    }
  };

  const handleReset = () => {
    setAnswers({
      companySize: undefined,
      industry: undefined,
      customIndustry: '',
      challenges: [],
      customChallenge: '',
      infoControl: undefined,
      customInfoControl: '',
      manualProcessesLevel: undefined,
      indicatorsStatus: undefined,
      objectives: [],
      systemsIntegrated: undefined,
      infoAccessEase: undefined,
      repetitiveTasksAutomable: undefined
    });
    setResult(null);
    setCurrentStep(1);
    setErrorMessage(null);
    analytics.track('diagnostic_started', { reset: true });
    scrollToFlow();
  };

  const handleToggleChallenge = (challengeId: string) => {
    setErrorMessage(null);
    setAnswers(prev => {
      const exists = prev.challenges.includes(challengeId);
      if (exists) {
        return { ...prev, challenges: prev.challenges.filter(c => c !== challengeId) };
      } else {
        if (prev.challenges.length >= 4) return prev;
        return { ...prev, challenges: [...prev.challenges, challengeId] };
      }
    });
  };

  const handleToggleObjective = (objId: string) => {
    setErrorMessage(null);
    setAnswers(prev => {
      const exists = prev.objectives.includes(objId);
      if (exists) {
        return { ...prev, objectives: prev.objectives.filter(o => o !== objId) };
      } else {
        if (prev.objectives.length >= 4) return prev;
        return { ...prev, objectives: [...prev.objectives, objId] };
      }
    });
  };

  return (
    <div className="space-y-16 py-8" id="diagnostico-section">
      {/* Top Section Header */}
      {!result && (
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[#22D3EE] text-xs font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>⏱️ Leva aproximadamente 2 minutos • 100% Gratuito</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Outfit'] text-white tracking-tight leading-tight">
            Descubra oportunidades de tecnologia para o seu negócio.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Responda algumas perguntas rápidas e receba uma análise inicial sobre como sistemas, automação e tecnologia podem ajudar sua empresa a escalar com eficiência.
          </p>
        </div>
      )}

      {/* Main Interactive Card */}
      <div 
        id="diagnostico-questionnaire-card"
        className="max-w-4xl mx-auto px-4 sm:px-6"
      >
        {result ? (
          <DiagnosticResult
            result={result}
            onReset={handleReset}
            onExploreServices={onExploreServices || (() => {
              const el = document.getElementById('servicos');
              el?.scrollIntoView({ behavior: 'smooth' });
            })}
            onSelectSolutionForQuote={onSelectSolutionForQuote || ((sol) => {
              if (onOpenBudgetModal) {
                onOpenBudgetModal(sol);
              } else {
                const el = document.getElementById('contato');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            })}
            onOpenPrivacyPolicy={onOpenPrivacyPolicy}
          />
        ) : (
          <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl space-y-8">
            {/* Progress Bar */}
            <DiagnosticProgress 
              currentStep={currentStep} 
              totalSteps={totalSteps} 
            />

            {/* Error banner if validation fails */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-shake">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step Form Switcher */}
            <div className="min-h-[280px]">
              {currentStep === 1 && (
                <DiagnosticStep1
                  companySize={answers.companySize}
                  industry={answers.industry}
                  customIndustry={answers.customIndustry}
                  onChangeCompanySize={(size) => {
                    setAnswers(prev => ({ ...prev, companySize: size }));
                    setErrorMessage(null);
                  }}
                  onChangeIndustry={(ind) => {
                    setAnswers(prev => ({ ...prev, industry: ind }));
                    setErrorMessage(null);
                  }}
                  onChangeCustomIndustry={(val) => {
                    setAnswers(prev => ({ ...prev, customIndustry: val }));
                  }}
                />
              )}

              {currentStep === 2 && (
                <DiagnosticStep2
                  selectedChallenges={answers.challenges}
                  customChallenge={answers.customChallenge}
                  onToggleChallenge={handleToggleChallenge}
                  onChangeCustomChallenge={(val) => {
                    setAnswers(prev => ({ ...prev, customChallenge: val }));
                  }}
                />
              )}

              {currentStep === 3 && (
                <DiagnosticStep3
                  infoControl={answers.infoControl}
                  customInfoControl={answers.customInfoControl}
                  manualProcessesLevel={answers.manualProcessesLevel}
                  indicatorsStatus={answers.indicatorsStatus}
                  onChangeInfoControl={(val) => {
                    setAnswers(prev => ({ ...prev, infoControl: val }));
                    setErrorMessage(null);
                  }}
                  onChangeCustomInfoControl={(val) => {
                    setAnswers(prev => ({ ...prev, customInfoControl: val }));
                  }}
                  onChangeManualLevel={(val) => {
                    setAnswers(prev => ({ ...prev, manualProcessesLevel: val }));
                    setErrorMessage(null);
                  }}
                  onChangeIndicatorsStatus={(val) => {
                    setAnswers(prev => ({ ...prev, indicatorsStatus: val }));
                    setErrorMessage(null);
                  }}
                />
              )}

              {currentStep === 4 && (
                <DiagnosticStep4
                  selectedObjectives={answers.objectives}
                  onToggleObjective={handleToggleObjective}
                />
              )}

              {currentStep === 5 && (
                <DiagnosticStep5
                  systemsIntegrated={answers.systemsIntegrated}
                  infoAccessEase={answers.infoAccessEase}
                  repetitiveTasksAutomable={answers.repetitiveTasksAutomable}
                  onChangeSystemsIntegrated={(val) => {
                    setAnswers(prev => ({ ...prev, systemsIntegrated: val }));
                    setErrorMessage(null);
                  }}
                  onChangeInfoAccessEase={(val) => {
                    setAnswers(prev => ({ ...prev, infoAccessEase: val }));
                    setErrorMessage(null);
                  }}
                  onChangeRepetitiveTasks={(val) => {
                    setAnswers(prev => ({ ...prev, repetitiveTasksAutomable: val }));
                    setErrorMessage(null);
                  }}
                />
              )}
            </div>

            {/* Navigation Footer Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              {currentStep > 1 ? (
                <button
                  type="button"
                  id="diag-prev-step-btn"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Diagnóstico sem identificação prévia</span>
                </div>
              )}

              <button
                type="button"
                id="diag-next-step-btn"
                onClick={handleNextStep}
                className="px-6 py-3 rounded-xl text-[#071B3A] font-bold text-xs sm:text-sm bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>{currentStep === totalSteps ? 'Gerar Meu Diagnóstico' : 'Avançar Etapa'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Second Interactive Tool: Automation Opportunity Calculator */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AutomationCalculator 
          onStartDiagnosis={() => {
            scrollToFlow();
            if (result) handleReset();
          }}
          onOpenBudgetModal={onOpenBudgetModal}
        />
      </div>

      {/* Frequently Asked Questions & Objections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <DiagnosisFaq />
      </div>
    </div>
  );
};
