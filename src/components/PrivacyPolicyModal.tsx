import React from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2, Building, Mail } from 'lucide-react';
import { useCompanySettings } from '../hooks/useCompanySettings';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useCompanySettings();

  if (!isOpen) return null;

  return (
    <div 
      id="privacy-policy-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="privacy-policy-modal-container"
        className="relative w-full max-w-3xl bg-[#071B3A]/95 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 backdrop-blur-2xl my-8 space-y-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-[#2DD4BF] border border-teal-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                Política de Privacidade & LGPD
              </h3>
              <p className="text-xs text-slate-300">
                {settings.companyName} • Atualizado em 2025
              </p>
            </div>
          </div>

          <button
            id="close-privacy-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Policy Body */}
        <div className="space-y-6 overflow-y-auto pr-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#22D3EE]" />
              1. Compromisso com a Proteção de Dados
            </h4>
            <p>
              A <strong>{settings.companyName}</strong> atua em estrita conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD). Valorizamos a confidencialidade e a segurança das informações fornecidas por visitantes, parceiros e clientes.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm">2. Finalidade da Coleta de Dados</h4>
            <p>
              Os dados coletados em nossos formulários de contato e simulação de orçamento (nome, empresa, e-mail corporativo, WhatsApp e descrição de projeto) têm as seguintes finalidades exclusivas:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
              <li>Elaboração de diagnósticos técnicos, estimativas de escopo e propostas comerciais personalizadas;</li>
              <li>Comunicação direta via WhatsApp ou e-mail para esclarecimento de requisitos de projeto;</li>
              <li>Atendimento a solicitações de suporte e consultoria tecnológica.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm">3. Não Compartilhamento com Terceiros</h4>
            <p>
              A OneSignal não comercializa, não aluga e não compartilha seus dados de contato com terceiros para fins de marketing não autorizado. Todas as informações técnicas e comerciais são tratadas sob sigilo profissional e proteção por Acordo de Confidencialidade (NDA) quando aplicável.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm">4. Armazenamento Seguro</h4>
            <p>
              Seus dados são armazenados em ambientes em nuvem protegidos com criptografia SSL/TLS em trânsito e controles rigorosos de acesso restrito aos engenheiros e consultores responsáveis pelo atendimento.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm">5. Direitos do Titular dos Dados</h4>
            <p>
              A qualquer momento, você pode solicitar a confirmação da existência de tratamento, a correção de dados incompletos ou a exclusão definitiva de suas informações de nossas bases de contato.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <span className="font-bold text-[#22D3EE] block">Canal de Contato do Encarregado de Dados (DPO):</span>
            <div className="flex items-center gap-2 text-slate-200">
              <Mail className="w-4 h-4 text-[#2DD4BF]" />
              <span>{settings.commercialEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <Building className="w-4 h-4 text-[#22D3EE]" />
              <span>{settings.addressDisplay}</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end shrink-0">
          <button
            id="privacy-modal-confirm-btn"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Entendido e Ciente
          </button>
        </div>

      </div>
    </div>
  );
};
