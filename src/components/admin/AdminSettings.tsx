import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  Building, 
  Mail, 
  Phone, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Github, 
  Globe, 
  Bell, 
  Save, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import {
  companySettingsService,
  diffSettings
} from '../../services/companySettingsService';
import { supabase } from '../../integrations/supabase/client';
import { CompanySettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings>(() => companySettingsService.getSettings());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;
    void companySettingsService.refresh().then((state) => {
      if (!active) return;
      setSettings(state.settings);
      setUpdatedAt(state.updatedAt);
      setLoadError(state.status === 'error' ? state.error : null);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    setFeedback(null);

    const before = companySettingsService.getSettings();

    try {
      const saved = await companySettingsService.save(settings);
      const changes = diffSettings(before, saved);

      setSettings(saved);
      setUpdatedAt(companySettingsService.getSnapshot().updatedAt);
      setFeedback('Configurações institucionais e de canais salvas com sucesso!');
      setTimeout(() => setFeedback(null), 4000);

      if (changes.length > 0) {
        await supabase.rpc('audit_admin_action', {
          _action: 'settings_updated',
          _target_type: 'settings',
          _target_id: 'company_settings',
          _details: `Campos alterados: ${changes.map((c) => c.field).join(', ')}`,
          _metadata: { changes } as never
        });
      }
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar as configurações. Tente novamente.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-cyan-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {(loadError || saveError) && (
        <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2 shadow-xl">
          <span>{saveError || `Não foi possível carregar as configurações: ${loadError}`}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            Configurações Institucionais & Canais Oficiais
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestão dos dados cadastrais da empresa, canais de contato, Instagram oficial (@onesignal_tech) e metas de SEO.
          </p>
          {isLoading ? (
            <p className="text-[11px] text-slate-500 mt-1">Carregando configurações do banco...</p>
          ) : updatedAt ? (
            <p className="text-[11px] text-slate-500 mt-1">
              Última atualização: {new Date(updatedAt).toLocaleString('pt-BR')}
            </p>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Company Identity Details */}
        <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-5 shadow-2xl">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Building className="w-4 h-4 text-cyan-400" />
            Identificação Corporativa & Contato
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Razão Social</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Nome Fantasia</label>
              <input
                type="text"
                value={settings.tradingName}
                onChange={(e) => setSettings({ ...settings, tradingName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">CNPJ</label>
              <input
                type="text"
                value={settings.cnpj || ''}
                onChange={(e) => setSettings({ ...settings, cnpj: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">E-mail Comercial Oficial</label>
              <input
                type="email"
                value={settings.commercialEmail}
                onChange={(e) => setSettings({ ...settings, commercialEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Telefone de Exibição</label>
              <input
                type="text"
                value={settings.phoneDisplay}
                onChange={(e) => setSettings({ ...settings, phoneDisplay: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">WhatsApp (apenas números com DDD)</label>
              <input
                type="text"
                value={settings.rawWhatsappNumber}
                onChange={(e) => setSettings({ ...settings, rawWhatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-mono text-slate-300 font-medium">Endereço de Atendimento</label>
              <input
                type="text"
                value={settings.addressDisplay}
                onChange={(e) => setSettings({ ...settings, addressDisplay: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Horário de Funcionamento</label>
              <input
                type="text"
                value={settings.businessHours}
                onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Official Social Media Channels */}
        <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-5 shadow-2xl">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Instagram className="w-4 h-4 text-cyan-400" />
            Canais Oficiais de Marketing & Redes Sociais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                Instagram Oficial da Empresa
              </label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none font-mono"
              />
              <span className="text-[10px] text-slate-400">Canal oficial: @onesignal_tech</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                LinkedIn Corporativo
              </label>
              <input
                type="text"
                value={settings.linkedin}
                onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-rose-400" />
                Canal no YouTube (Opcional)
              </label>
              <input
                type="text"
                value={settings.youtube || ''}
                onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-400" />
                Repositório / GitHub (Opcional)
              </label>
              <input
                type="text"
                value={settings.github || ''}
                onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* SEO Defaults */}
        <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-5 shadow-2xl">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Metadados de SEO & Indexação
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Título Principal (Title Tag)</label>
              <input
                type="text"
                value={settings.seoTitle}
                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Meta Description Padrão</label>
              <textarea
                rows={3}
                value={settings.seoDescription}
                onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notification Toggles */}
        <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-4 shadow-2xl">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            Preferências de Alertas & Notificações
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#030D1A] border border-white/5 cursor-pointer text-xs">
              <span className="text-slate-200 font-medium">Notificar imediatamente na chegada de novo Lead Comercial</span>
              <input
                type="checkbox"
                checked={settings.notifyOnNewLead}
                onChange={(e) => setSettings({ ...settings, notifyOnNewLead: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#030D1A] border border-white/5 cursor-pointer text-xs">
              <span className="text-slate-200 font-medium">Notificar quando um Diagnóstico Inteligente for concluído</span>
              <input
                type="checkbox"
                checked={settings.notifyOnDiagnostic}
                onChange={(e) => setSettings({ ...settings, notifyOnDiagnostic: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-400"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving || isLoading}
            className={`${isSaving || isLoading ? 'opacity-60 pointer-events-none ' : ''}`.trim() && ''}
            {...{}}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </button>
        </div>

      </form>

    </div>
  );
};
