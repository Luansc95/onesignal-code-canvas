import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  User, 
  KeyRound, 
  FileText, 
  Layers, 
  Trash2,
  Lock
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AuditLog } from '../../types';

export const AdminAuditLogs: React.FC = () => {
  const [logs] = useState<AuditLog[]>(() => adminService.getAuditLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEntity = selectedEntity === 'all' || log.targetEntity === selectedEntity;

    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          Auditoria de Segurança & Trilha de Ações
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-medium border border-cyan-500/30">
            {logs.length} registros
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Registro imutável de todas as ações administrativas, publicações de cases, alterações no CRM e acessos ao sistema.
        </p>
      </div>

      {/* Security Principles Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-white block">Princípio de Governança e Rastreabilidade</span>
          <p className="text-slate-300 leading-relaxed">
            Cada ação administrativa é vinculada ao ID do operador, papel de acesso (RBAC), endereço IP e timestamp preciso.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por usuário, e-mail ou ação..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071B3A] border border-white/10 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none"
          />
        </div>

        <select
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          aria-label="Filtrar por entidade do sistema"
          className="px-3 py-2.5 rounded-xl bg-[#071B3A] border border-white/10 text-xs text-slate-300 outline-none focus:border-cyan-400"
        >
          <option value="all">Todas as Entidades</option>
          <option value="lead">Leads & CRM</option>
          <option value="project">Portfólio / Projetos</option>
          <option value="contact">Mensagens / Contatos</option>
          <option value="auth">Autenticação & Sessões</option>
          <option value="campaign">Marketing / Campanhas</option>
          <option value="settings">Configurações</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="p-6 rounded-3xl bg-[#071B3A]/90 border border-white/10 shadow-2xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
              <th className="pb-3 px-3">Data / Horário</th>
              <th className="pb-3 px-3">Usuário</th>
              <th className="pb-3 px-3">Papel (RBAC)</th>
              <th className="pb-3 px-3">Entidade</th>
              <th className="pb-3 px-3">Descrição da Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('pt-BR')}
                </td>

                <td className="py-3 px-3">
                  <div className="font-bold text-white">{log.userName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{log.userEmail}</div>
                </td>

                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    log.userRole === 'admin'
                      ? 'bg-rose-500/20 text-rose-300'
                      : log.userRole === 'manager'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {log.userRole.toUpperCase()}
                  </span>
                </td>

                <td className="py-3 px-3 font-mono text-cyan-300 text-[11px]">
                  {log.targetEntity || 'sistema'}
                </td>

                <td className="py-3 px-3 text-slate-200">
                  {log.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="text-center py-10 text-xs text-slate-400">
            Nenhum registro de auditoria encontrado.
          </div>
        )}
      </div>

    </div>
  );
};
