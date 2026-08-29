import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  UserPlus, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Building, 
  Phone, 
  Sparkles, 
  X
} from 'lucide-react';
import { contactService } from '../../services/contactService';
import { adminService } from '../../services/adminService';
import { authService } from '../../services/authService';
import { ContactMessage } from '../../types';
import { navigate } from '../../lib/router';

export const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>(() => contactService.getAllContacts());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentUser = authService.getCurrentUser();

  const refreshList = () => {
    setContacts(contactService.getAllContacts());
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleConvertToLead = (contact: ContactMessage) => {
    const lead = contactService.convertToLead(contact.id);
    if (lead) {
      if (currentUser) {
        adminService.logAction(currentUser, `Converteu mensagem de "${contact.name}" em Lead`, 'contact', contact.id);
      }
      refreshList();
      showFeedback(`Contato de ${contact.name} convertido em Lead no CRM com sucesso!`);
    }
  };

  const handleMarkStatus = (contactId: string, status: ContactMessage['status']) => {
    contactService.updateContactStatus(contactId, status);
    refreshList();
    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact({ ...selectedContact, status });
    }
    showFeedback('Status da mensagem atualizado.');
  };

  const handleDelete = (contactId: string) => {
    if (window.confirm('Deseja excluir esta mensagem de contato?')) {
      contactService.deleteContact(contactId);
      if (selectedContact?.id === contactId) setSelectedContact(null);
      refreshList();
      showFeedback('Mensagem removida.');
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            Central de Mensagens & Contatos
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-medium border border-cyan-500/30">
              {contacts.length} mensagens
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Recebimento de dúvidas, solicitações diretas do site e conversão facilitada para o CRM.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar mensagens por nome, empresa, e-mail ou assunto..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071B3A] border border-white/10 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrar por status da mensagem"
          className="px-3 py-2.5 rounded-xl bg-[#071B3A] border border-white/10 text-xs text-slate-300 outline-none focus:border-cyan-400"
        >
          <option value="all">Todos os Status</option>
          <option value="new">🆕 Novas</option>
          <option value="read">👀 Lidas</option>
          <option value="replied">✅ Respondidas</option>
          <option value="converted">👥 Convertidas em Lead</option>
        </select>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => setSelectedContact(contact)}
            className="p-5 rounded-3xl bg-[#071B3A]/80 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xl group"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                    {contact.name}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>{contact.company}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  contact.status === 'new'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : contact.status === 'converted'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {contact.status === 'new' && '🆕 Nova'}
                  {contact.status === 'read' && '👀 Lida'}
                  {contact.status === 'replied' && '✅ Respondida'}
                  {contact.status === 'converted' && '👥 Convertida'}
                </span>
              </div>

              {contact.serviceType && (
                <div className="text-[11px] font-mono text-cyan-400">
                  Interesse: {contact.serviceType}
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-xl bg-[#030D1A] border border-white/5 line-clamp-3">
                "{contact.message}"
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                {new Date(contact.createdAt).toLocaleDateString('pt-BR')} às {new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              <div className="flex items-center gap-1.5">
                {contact.status !== 'converted' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConvertToLead(contact);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-[11px] font-bold border border-cyan-500/30 flex items-center gap-1 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Virar Lead</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/55${contact.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12 rounded-3xl bg-[#071B3A]/40 border border-white/5 text-xs text-slate-400">
          Nenhuma mensagem encontrada.
        </div>
      )}

      {/* Message Modal View */}
      {selectedContact && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-[#071B3A] border border-cyan-500/30 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">{selectedContact.name}</h3>
                <span className="text-xs text-cyan-300">{selectedContact.company}</span>
              </div>
              <button onClick={() => setSelectedContact(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex flex-wrap gap-4 text-slate-300">
                <div>E-mail: <strong className="text-white">{selectedContact.email}</strong></div>
                <div>WhatsApp: <strong className="text-white">{selectedContact.whatsapp}</strong></div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Mensagem do Usuário:</span>
                <p className="p-4 rounded-2xl bg-[#030D1A] border border-white/10 text-slate-200 leading-relaxed">
                  {selectedContact.message}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedContact.id)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedContact.status !== 'converted' && (
                  <button
                    onClick={() => {
                      handleConvertToLead(selectedContact);
                      setSelectedContact(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Converter em Lead</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
