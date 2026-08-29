import React, { useState } from 'react';
import { 
  Megaphone, 
  Link2, 
  Copy, 
  Check, 
  Plus, 
  ExternalLink, 
  TrendingUp, 
  MousePointer, 
  Users, 
  DollarSign, 
  Sparkles, 
  Trash2, 
  CheckCircle2,
  X
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { authService } from '../../services/authService';
import { MarketingCampaign } from '../../types';

export const AdminMarketing: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => adminService.getCampaigns());
  
  // UTM Link Builder State
  const [baseUrl, setBaseUrl] = useState('https://onesignal.tech/');
  const [utmSource, setUtmSource] = useState('instagram');
  const [utmMedium, setUtmMedium] = useState('stories');
  const [utmCampaign, setUtmCampaign] = useState('lancamento_gestao_2025');
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Campaign Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campName, setCampName] = useState('');

  const currentUser = authService.getCurrentUser();

  const generatedUrl = `${baseUrl.trim()}?utm_source=${encodeURIComponent(utmSource.trim())}&utm_medium=${encodeURIComponent(utmMedium.trim())}&utm_campaign=${encodeURIComponent(utmCampaign.trim())}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim() || !utmCampaign.trim()) return;

    adminService.createCampaign(
      {
        name: campName.trim(),
        source: utmSource.trim(),
        medium: utmMedium.trim(),
        campaign: utmCampaign.trim(),
        targetUrl: generatedUrl,
        status: 'active'
      },
      currentUser || undefined
    );

    setCampaigns(adminService.getCampaigns());
    setIsModalOpen(false);
    setCampName('');
    setFeedback(`Campanha "${campName}" registrada com rastreamento ativo!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteCampaign = (id: string) => {
    if (window.confirm('Deseja remover o registro desta campanha?')) {
      adminService.deleteCampaign(id, currentUser || undefined);
      setCampaigns(adminService.getCampaigns());
      setFeedback('Campanha removida.');
      setTimeout(() => setFeedback(null), 4000);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            Marketing Center & Atribuição de Tráfego
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-medium border border-cyan-500/30">
              Gerador UTM Oficial
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rastreamento de campanhas digitais no Instagram (@onesignal_tech), Google Ads, LinkedIn e WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Salvar Nova Campanha</span>
        </button>
      </div>

      {/* UTM Generator Interactive Tool */}
      <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-cyan-500/30 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Link2 className="w-4 h-4 text-cyan-400" />
            Construtor de Links Rastreáveis (UTM Builder)
          </h3>
          <span className="text-xs font-mono text-cyan-300">Padrão Google Analytics 4</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">URL de Destino</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://onesignal.tech/"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">Origem (utm_source)</label>
            <input
              type="text"
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
              placeholder="ex: instagram, google, linkedin"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">Mídia (utm_medium)</label>
            <input
              type="text"
              value={utmMedium}
              onChange={(e) => setUtmMedium(e.target.value)}
              placeholder="ex: stories, reels, cpc, bio"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">Campanha (utm_campaign)</label>
            <input
              type="text"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              placeholder="ex: cases_2025"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
            />
          </div>
        </div>

        {/* Generated Link Output Box */}
        <div className="p-4 rounded-2xl bg-[#030D1A] border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="overflow-x-auto custom-scrollbar font-mono text-xs text-cyan-300 select-all pr-2">
            {generatedUrl}
          </div>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20 shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
          </button>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 space-y-4 shadow-2xl">
        <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-cyan-400" />
          Campanhas Ativas & Desempenho de Conversão
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-2.5">Nome da Campanha</th>
                <th className="pb-2.5">Origem / Mídia</th>
                <th className="pb-2.5">Cliques</th>
                <th className="pb-2.5">Leads Captados</th>
                <th className="pb-2.5">Taxa de Conversão</th>
                <th className="pb-2.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-bold text-white">{camp.name}</td>
                  <td className="py-3 text-cyan-300 font-mono">
                    {camp.source} / {camp.medium}
                  </td>
                  <td className="py-3 font-mono text-white">{camp.clicksCount}</td>
                  <td className="py-3 font-mono font-bold text-emerald-400">{camp.leadsCount} leads</td>
                  <td className="py-3 font-mono text-cyan-300 font-bold">{camp.conversionRate}%</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeleteCampaign(camp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Excluir Campanha"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#071B3A] border border-cyan-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-['Outfit']">Registrar Campanha no BI</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-medium">Nome Amigável da Campanha</label>
                <input
                  type="text"
                  required
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="ex: Instagram Stories — Cases Setembro"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#030D1A] border border-white/5 space-y-1 text-xs">
                <span className="text-slate-500 font-mono block">URL Gerada:</span>
                <p className="text-[11px] font-mono text-cyan-300 break-all">{generatedUrl}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold text-xs"
                >
                  Salvar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
