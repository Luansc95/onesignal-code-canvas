import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Flame, 
  MessageSquare, 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BrainCircuit, 
  FileText, 
  Tag, 
  ExternalLink, 
  Trash2, 
  Send, 
  Sparkles, 
  X, 
  ChevronRight,
  Kanban,
  Table as TableIcon
} from 'lucide-react';
import { leadService } from '../../services/leadService';
import { adminService } from '../../services/adminService';
import { authService } from '../../services/authService';
import { Lead, LeadStatus, LeadPriority } from '../../types';

export const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(() => leadService.getAllLeads());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Lead Detail Modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentUser = authService.getCurrentUser();

  const refreshList = () => {
    setLeads(leadService.getAllLeads());
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    const updated = leadService.updateLeadStatus(leadId, newStatus, currentUser?.name || 'Administrador');
    if (updated) {
      if (currentUser) {
        adminService.logAction(currentUser, `Alterou status do Lead "${updated.name}" para "${leadService.getStatusLabel(newStatus)}"`, 'lead', leadId);
      }
      refreshList();
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...updated });
      }
      showFeedback(`Status do lead atualizado para ${leadService.getStatusLabel(newStatus)}.`);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;

    const updated = leadService.addLeadNote(selectedLead.id, newNote.trim(), currentUser?.name || 'Administrador');
    if (updated) {
      if (currentUser) {
        adminService.logAction(currentUser, `Adicionou nota ao Lead "${updated.name}"`, 'lead', selectedLead.id);
      }
      setNewNote('');
      setSelectedLead({ ...updated });
      refreshList();
      showFeedback('Nota interna registrada.');
    }
  };

  const handleDeleteLead = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    if (window.confirm(`Deseja realmente remover o lead "${lead?.name}" do CRM?`)) {
      leadService.deleteLead(id);
      if (currentUser && lead) {
        adminService.logAction(currentUser, `Excluiu o Lead "${lead.name}"`, 'lead', id);
      }
      if (selectedLead?.id === id) setSelectedLead(null);
      refreshList();
      showFeedback('Lead removido do pipeline.');
    }
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Nome', 'Empresa', 'Email', 'WhatsApp', 'Solucao', 'Orcamento', 'Prazo', 'Score', 'Prioridade', 'Status', 'Origem', 'Data_Criacao'];
    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.name}"`,
      `"${l.company}"`,
      `"${l.email}"`,
      `"${l.whatsapp}"`,
      `"${l.solutionType}"`,
      `"${l.budgetRange || ''}"`,
      `"${l.desiredTimeline || ''}"`,
      l.score || 0,
      `"${l.priority || 'medium'}"`,
      `"${l.status}"`,
      `"${l.source}"`,
      `"${l.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `onesignal_leads_crm_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback('Relatório de leads exportado com sucesso!');
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.whatsapp.includes(searchTerm) ||
      l.solutionType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = selectedPriority === 'all' || l.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || l.status === selectedStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const statuses: { id: LeadStatus; label: string; color: string }[] = [
    { id: 'new', label: '🆕 Novos', color: 'border-cyan-500/40 bg-cyan-950/20' },
    { id: 'analyzing', label: '👀 Em Análise', color: 'border-amber-500/40 bg-amber-950/20' },
    { id: 'contacted', label: '📞 Contatados', color: 'border-sky-500/40 bg-sky-950/20' },
    { id: 'negotiating', label: '🤝 Em Negociação', color: 'border-purple-500/40 bg-purple-950/20' },
    { id: 'converted', label: '🎉 Convertidos', color: 'border-emerald-500/40 bg-emerald-950/20' },
    { id: 'lost', label: '❌ Perdidos', color: 'border-rose-500/40 bg-rose-950/20' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
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

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            Pipeline de Leads & CRM
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-medium border border-cyan-500/30">
              {leads.length} oportunidades
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestão comercial, lead scoring transparente e histórico unificado de atendimento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#071B3A] border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Tabela"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Tabela</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Kanban"
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, empresa, e-mail, telefone ou solução..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071B3A] border border-white/10 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none"
          />
        </div>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          aria-label="Filtrar por prioridade do lead"
          className="px-3 py-2.5 rounded-xl bg-[#071B3A] border border-white/10 text-xs text-slate-300 outline-none focus:border-cyan-400"
        >
          <option value="all">Todas as Prioridades</option>
          <option value="high">🔥 Alta Prioridade (Score 70+)</option>
          <option value="medium">🟡 Média Prioridade (Score 40-69)</option>
          <option value="low">🔵 Baixa Prioridade (&lt; 40)</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filtrar por etapa do funil"
          className="px-3 py-2.5 rounded-xl bg-[#071B3A] border border-white/10 text-xs text-slate-300 outline-none focus:border-cyan-400"
        >
          <option value="all">Todas as Etapas</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="p-4 rounded-3xl bg-[#071B3A]/80 border border-white/10 overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-3 px-3">Lead / Empresa</th>
                <th className="pb-3 px-3">Solução Desejada</th>
                <th className="pb-3 px-3">Score & Prioridade</th>
                <th className="pb-3 px-3">Origem</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Data</th>
                <th className="pb-3 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">{lead.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-500" />
                      <span>{lead.company}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-slate-200 font-medium">{lead.solutionType}</span>
                    {lead.budgetRange && (
                      <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                        {lead.budgetRange}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1 ${
                      lead.priority === 'high'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : lead.priority === 'medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      <Flame className="w-3 h-3" />
                      {lead.score || 70} pts
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-[11px] text-slate-300 font-mono">
                      {lead.diagnosticCompleted ? '🧠 Diagnóstico' : lead.source === 'budget_modal' ? '📩 Orçamento' : 'Formulário'}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-xs font-semibold text-slate-200">
                      {leadService.getStatusLabel(lead.status)}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-[11px] font-mono text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(lead);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12 text-xs text-slate-400">
              Nenhum lead encontrado com os filtros selecionados.
            </div>
          )}
        </div>
      ) : (
        /* KANBAN VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {statuses.map((column) => {
            const columnLeads = filteredLeads.filter((l) => l.status === column.id);

            return (
              <div
                key={column.id}
                className={`p-3 rounded-2xl border ${column.color} flex flex-col justify-between min-h-[400px] space-y-3`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white font-['Outfit']">{column.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 text-[10px] font-mono font-bold">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="p-3 rounded-xl bg-[#071B3A] border border-white/10 hover:border-cyan-400/40 text-left transition-all cursor-pointer space-y-2 shadow-md group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {lead.name}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                          lead.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {lead.score || 70}pt
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 truncate">{lead.company}</div>
                      <div className="text-[10px] font-mono text-cyan-300 line-clamp-1">{lead.solutionType}</div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>{new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-cyan-300" />
                      </div>
                    </div>
                  ))}

                  {columnLeads.length === 0 && (
                    <div className="text-center py-8 text-[11px] text-slate-500">
                      Nenhum lead nesta etapa.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lead Detail & CRM Inspector Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 animate-fade-in overflow-y-auto">
          <div className="max-w-4xl w-full my-8 p-6 sm:p-8 rounded-3xl bg-[#071B3A] border border-cyan-500/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white font-['Outfit']">{selectedLead.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                    selectedLead.priority === 'high'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedLead.score || 70} pts — {selectedLead.priority === 'high' ? '🔥 Alta Prioridade' : '🟡 Média Prioridade'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold text-slate-200">{selectedLead.company}</span>
                  <span>•</span>
                  <span>Registrado em {new Date(selectedLead.createdAt).toLocaleString('pt-BR')}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Contact Bar */}
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <a
                  href={`https://wa.me/55${selectedLead.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${selectedLead.name}, tudo bem? Sou da OneSignal Tecnologia. Recebemos sua solicitação de ${selectedLead.solutionType} e gostaria de agendar nosso alinhamento técnico.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Conversar no WhatsApp ({selectedLead.whatsapp})</span>
                </a>

                <a
                  href={`mailto:${selectedLead.email}`}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>{selectedLead.email}</span>
                </a>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                  aria-label="Atualizar status do lead"
                  className="px-3 py-1.5 rounded-xl bg-[#030D1A] border border-cyan-500/40 text-xs text-cyan-300 font-bold outline-none"
                >
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Two-Column Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Project & Solution Scope */}
              <div className="space-y-4 p-5 rounded-2xl bg-[#030D1A] border border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  Demanda & Escopo do Projeto
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-mono">Tipo de Solução</span>
                    <span className="text-white font-bold">{selectedLead.solutionType}</span>
                  </div>

                  {selectedLead.budgetRange && (
                    <div>
                      <span className="text-slate-500 block text-[10px] font-mono">Faixa de Investimento Estimada</span>
                      <span className="text-cyan-300 font-mono font-bold">{selectedLead.budgetRange}</span>
                    </div>
                  )}

                  {selectedLead.desiredTimeline && (
                    <div>
                      <span className="text-slate-500 block text-[10px] font-mono">Prazo Desejado</span>
                      <span className="text-slate-200">{selectedLead.desiredTimeline}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-500 block text-[10px] font-mono">Descrição Informada pelo Cliente</span>
                    <p className="text-slate-300 mt-1 p-3 rounded-xl bg-white/5 border border-white/5 leading-relaxed">
                      {selectedLead.projectDescription || 'Nenhum detalhe adicional informado no envio.'}
                    </p>
                  </div>
                </div>

                {/* Diagnostic Qualifiers if completed */}
                {selectedLead.diagnosticCompleted && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                      <BrainCircuit className="w-4 h-4" />
                      Qualificadores do Diagnóstico Inteligente
                    </span>
                    <div className="text-xs text-slate-300 space-y-1">
                      <div>Maturidade: <strong className="text-white">{selectedLead.digitalMaturity || 'Estruturada'}</strong></div>
                      {selectedLead.identifiedChallenges && (
                        <div>
                          Desafios:
                          <ul className="list-disc list-inside text-slate-400 mt-0.5">
                            {selectedLead.identifiedChallenges.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Internal Notes & Activities Timeline */}
              <div className="space-y-4 p-5 rounded-2xl bg-[#030D1A] border border-white/10 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Notas Internas & Histórico
                  </h4>

                  {/* Add note form */}
                  <form onSubmit={handleAddNote} className="space-y-2 mb-4">
                    <textarea
                      rows={2}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Registrar anotação de contato, proposta ou alinhamento..."
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1 ml-auto"
                    >
                      <Send className="w-3 h-3" />
                      <span>Salvar Nota</span>
                    </button>
                  </form>

                  {/* Activity log */}
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {selectedLead.activities?.map((act) => (
                      <div key={act.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-0.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>{act.authorName}</span>
                          <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{act.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Delete */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">ID: {selectedLead.id}</span>
                  <button
                    onClick={() => handleDeleteLead(selectedLead.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Lead</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
