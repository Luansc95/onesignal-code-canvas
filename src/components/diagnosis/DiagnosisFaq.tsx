import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'O diagnóstico inteligente tem algum custo?',
    answer: 'Não. O diagnóstico inicial e a calculadora de eficiência são 100% gratuitos e acessíveis a qualquer momento. Você pode responder às perguntas e visualizar suas oportunidades sem pagar nada e sem a necessidade de informar dados bancários.'
  },
  {
    question: 'Sou obrigado a contratar alguma solução após o resultado?',
    answer: 'De forma alguma. O diagnóstico foi criado como uma ferramenta consultiva e educativa para ajudar você a entender melhor seus processos internos, identificar gargalos e visualizar caminhos tecnológicos. Você decide se e quando deseja avançar.'
  },
  {
    question: 'A OneSignal consegue desenvolver uma solução totalmente personalizada?',
    answer: 'Sim. As soluções recomendadas pelo diagnóstico são categorias e pontos de partida. Como desenvolvemos software sob medida, cada sistema, aplicativo ou automação é arquitetado respeitando exatamente as regras de negócio, fluxos e integrações da sua empresa.'
  },
  {
    question: 'Os resultados e estimativas são uma garantia de resultados?',
    answer: 'Não. Os resultados representam uma análise inicial estimada com base nas respostas e parâmetros fornecidos. Para projetos reais, realizamos uma fase preliminar de levantamento de requisitos e arquitetura técnica detalhada antes do desenvolvimento.'
  },
  {
    question: 'Como a OneSignal protege os dados que eu preencher?',
    answer: 'Tratamos todas as informações sob rigorosa conformidade com a LGPD (Lei Geral de Proteção de Dados) e sob acordos mútuos de confidencialidade (NDA). Seus dados não são comercializados ou compartilhados com terceiros.'
  }
];

export const DiagnosisFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-mono">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Perguntas Frequentes</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white">
          Dúvidas Comuns sobre o Diagnóstico
        </h3>
        <p className="text-xs text-slate-300">
          Transparência total sobre nossa metodologia e atendimento consultivo.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen 
                  ? 'bg-white/[0.05] border-cyan-400/30 shadow-lg shadow-cyan-500/5' 
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white"
              >
                <span>{item.question}</span>
                <ChevronDown className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`} />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
