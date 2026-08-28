import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, X } from 'lucide-react';
import { getWhatsAppUrl } from '../config/commercialConfig';
import { analytics } from '../services/analyticsService';

interface QuickContactFloatingProps {
  onOpenBudgetModal: () => void;
}

export const QuickContactFloating: React.FC<QuickContactFloatingProps> = ({ onOpenBudgetModal }) => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsApp = () => {
    analytics.track('click_whatsapp', { source: 'floating_button' });
    const url = getWhatsAppUrl('general');
    window.open(url, '_blank');
  };

  const handleBudgetClick = () => {
    analytics.track('click_budget', { source: 'floating_button' });
    onOpenBudgetModal();
  };

  return (
    <div id="floating-contact-actions" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      
      {/* Toast Prompt */}
      {showNotification && (
        <div className="p-3.5 rounded-2xl bg-[#071B3A]/90 border border-white/20 shadow-2xl shadow-cyan-950/80 text-xs text-white max-w-xs relative backdrop-blur-xl animate-fade-in">
          <button 
            id="close-floating-toast-btn"
            onClick={() => setShowNotification(false)}
            className="absolute top-1.5 right-1.5 p-1 text-slate-400 hover:text-white"
            aria-label="Fechar notificação rápida"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          
          <div className="flex items-start gap-2.5 pr-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 animate-ping" />
            <div>
              <span className="font-bold text-[#22D3EE] block">Precisa de um orçamento ágil?</span>
              <span className="text-slate-300 text-[11px]">Nossa equipe responde rapidamente pelo WhatsApp ou formulário.</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Buttons */}
      <div className="flex items-center gap-2">
        <button
          id="floating-budget-btn"
          onClick={handleBudgetClick}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-3 rounded-full font-bold text-xs text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-[#071B3A]" />
          Solicitar Orçamento
        </button>

        <button
          id="floating-whatsapp-btn"
          onClick={handleWhatsApp}
          className="w-12 h-12 sm:w-auto sm:h-auto sm:p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/60 border border-emerald-400/50 transition-all hover:scale-110 active:scale-95 flex items-center justify-center relative group"
          aria-label="Falar no WhatsApp"
        >
          <MessageSquare className="w-6 h-6 shrink-0" />
          <span className="hidden sm:inline-block absolute right-full mr-3 px-3 py-1 rounded-xl bg-[#071B3A]/90 text-emerald-300 text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/15 pointer-events-none shadow-lg backdrop-blur-md">
            Falar no WhatsApp
          </span>
        </button>
      </div>

    </div>
  );
};

