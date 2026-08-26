import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Check, 
  Clock, 
  Layers, 
  ArrowRight,
  Shield,
  Smartphone,
  Globe,
  Bot,
  Cog,
  Database
} from 'lucide-react';

interface BudgetEstimatorProps {
  onApplyEstimateToForm: (data: { solutionType: string; description: string; timeline: string }) => void;
}

export const BudgetEstimator: React.FC<BudgetEstimatorProps> = ({ onApplyEstimateToForm }) => {
  const [platform, setPlatform] = useState<'web' | 'mobile' | 'both' | 'automation'>('web');
  const [complexity, setComplexity] = useState<'mvp' | 'standard' | 'enterprise'>('standard');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Auth & Permissões',
    'Dashboard & Gráficos',
    'Integração de APIs'
  ]);

  const platformOptions = [
    { id: 'web', label: 'Sistema Web / SaaS', icon: <Globe className="w-4 h-4" /> },
    { id: 'mobile', label: 'App Mobile (iOS / Android)', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'both', label: 'Web + App Integrados', icon: <Layers className="w-4 h-4" /> },
    { id: 'automation', label: 'Automação & IA / IoT', icon: <Bot className="w-4 h-4" /> },
  ];

  const availableFeatures = [
    { id: 'Auth & Permissões', label: 'Autenticação & Níveis de Acesso' },
    { id: 'Dashboard & Gráficos', label: 'Dashboards & Indicadores em Tempo Real' },
    { id: 'Integração de APIs', label: 'Integração com APIs & ERPs Legados' },
    { id: 'WhatsApp & Notificações', label: 'Automação WhatsApp & Notificações Push' },
    { id: 'Inteligência Artificial', label: 'Módulo de IA Generativa / Chatbot RAG' },
    { id: 'Pagamentos & Cobrança', label: 'Gateway de Pagamentos & Cobrança PIX/Cartão' },
    { id: 'Modo Offline', label: 'Sincronização Offline Resiliente' },
    { id: 'Relatórios Fiscais', label: 'Exportação DRE / Relatórios em PDF & Excel' }
  ];

  const toggleFeature = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== featureId));
    } else {
      setSelectedFeatures([...selectedFeatures, featureId]);
    }
  };

  // Estimated timeline calculation
  const getEstimatedTimeline = () => {
    let weeks = 3;
    if (platform === 'mobile') weeks += 2;
    if (platform === 'both') weeks += 4;
    if (platform === 'automation') weeks += 1;
    if (complexity === 'standard') weeks += 2;
    if (complexity === 'enterprise') weeks += 4;
    weeks += Math.floor(selectedFeatures.length * 0.5);
    return `${weeks} a ${weeks + 2} semanas`;
  };

  const handleApply = () => {
    const platformLabel = platformOptions.find(p => p.id === platform)?.label || 'Sistema Web';
    const complexityLabel = complexity === 'mvp' ? 'MVP Ágil' : complexity === 'standard' ? 'Versão Comercial Completa' : 'Enterprise de Alta Escala';
    const descriptionText = `Projeto estimado via Simulador OneSignal:\n- Plataforma: ${platformLabel}\n- Porte: ${complexityLabel}\n- Recursos selecionados: ${selectedFeatures.join(', ')}\n- Estimativa de prazo inicial: ${getEstimatedTimeline()}`;
    
    onApplyEstimateToForm({
      solutionType: platform === 'mobile' ? 'Aplicativo Mobile' : platform === 'automation' ? 'Automação' : 'Sistema Web',
      description: descriptionText,
      timeline: getEstimatedTimeline()
    });

    const contactSection = document.getElementById('contato');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="my-16 p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/15 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#22D3EE] text-xs font-mono mb-2 backdrop-blur-md">
            <Calculator className="w-3.5 h-3.5" />
            SIMULADOR INTERATIVO DE ESCOPO
          </div>
          <h3 className="text-2xl font-bold text-white font-['Outfit']">
            Estime o escopo e prazo do seu projeto
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Selecione as características do sistema para gerar uma estimativa preliminar personalizada.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/15 text-right shrink-0 backdrop-blur-md">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Tempo Estimado de Entrega</span>
          <span className="text-xl font-bold text-[#2DD4BF] font-['Outfit'] flex items-center gap-1.5 justify-end">
            <Clock className="w-4 h-4 text-[#2DD4BF]" />
            {getEstimatedTimeline()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Left Column: Platform & Scope Selectors */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Platform */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#22D3EE] block mb-2.5 font-semibold">
              1. Tipo de Plataforma Desejada:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {platformOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPlatform(opt.id as any)}
                  className={`p-3 rounded-2xl border text-xs font-medium flex flex-col items-center text-center gap-2 transition-all backdrop-blur-sm ${
                    platform === opt.id
                      ? 'bg-white/15 border-[#22D3EE] text-white shadow-md shadow-cyan-500/20'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${platform === opt.id ? 'bg-[#22D3EE] text-[#071B3A]' : 'bg-white/10 text-[#22D3EE]'}`}>
                    {opt.icon}
                  </div>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Complexity / Scale */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#22D3EE] block mb-2.5 font-semibold">
              2. Porte e Maturidade do Projeto:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'mvp', title: 'MVP / Protótipo Funcional', desc: 'Validação rápida no mercado' },
                { id: 'standard', title: 'Sistema Comercial Completo', desc: 'Pronto para alta operação diária' },
                { id: 'enterprise', title: 'Enterprise / Alta Escala', desc: 'Múltiplas filiais, IA & compliance' },
              ].map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setComplexity(comp.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition-all backdrop-blur-sm ${
                    complexity === comp.id
                      ? 'bg-white/15 border-[#2DD4BF] text-white shadow-md shadow-teal-500/20'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold font-['Outfit'] text-white">{comp.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{comp.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Features Checklist */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#22D3EE] block mb-2.5 font-semibold">
              3. Módulos e Recursos Desejados:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableFeatures.map((feat) => {
                const isSelected = selectedFeatures.includes(feat.id);
                return (
                  <button
                    key={feat.id}
                    onClick={() => toggleFeature(feat.id)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all backdrop-blur-sm ${
                      isSelected
                        ? 'bg-white/15 border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <span>{feat.label}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center ${isSelected ? 'bg-[#22D3EE] text-[#071B3A]' : 'border border-white/20'}`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Simulation Summary & Direct Transfer */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white/5 border border-white/15 flex flex-col justify-between space-y-6 backdrop-blur-md">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              Resumo da Arquitetura
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-slate-400">Modalidade:</span>
                <span className="font-semibold text-[#22D3EE]">Software Sob Medida</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-slate-400">Recursos:</span>
                <span className="font-semibold text-white">{selectedFeatures.length} módulos ativos</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-slate-400">Metodologia:</span>
                <span className="font-semibold text-[#2DD4BF]">Sprints Ágeis + QA</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-slate-400">Código-fonte:</span>
                <span className="font-semibold text-white">100% do Cliente</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 leading-relaxed backdrop-blur-sm">
              💡 Inclui suporte técnico pós-lançamento, documentação completa e deploy em infraestrutura de alta disponibilidade.
            </div>
          </div>

          <button
            id="apply-estimator-btn"
            onClick={handleApply}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Preencher Proposta com estes Dados</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
