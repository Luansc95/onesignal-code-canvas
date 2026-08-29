import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Edit3, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Check, 
  X, 
  Sparkles, 
  Star, 
  Layers, 
  Code, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { adminService } from '../../services/adminService';
import { authService } from '../../services/authService';
import { Project, ProjectCategory, ProjectType, ProjectStatus, ProjectFeature, ProjectResult } from '../../types';
import { ProjectMockup } from '../ProjectMockup';
import { navigate } from '../../lib/router';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => projectService.getAllProjects());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    tagline: string;
    category: Project['category'];
    categoryLabel: string;
    shortDescription: string;
    challenge: string;
    solution: string;
    features: ProjectFeature[];
    technologies: string;
    results: ProjectResult[];
    imagePlaceholderType: Project['imagePlaceholderType'];
    accentColor: string;
    clientType: string;
    clientName: string;
    year: string;
    projectType: ProjectType;
    featured: boolean;
    isPublished: boolean;
  }>({
    name: '',
    slug: '',
    tagline: '',
    category: 'web',
    categoryLabel: 'Sistemas Web',
    shortDescription: '',
    challenge: '',
    solution: '',
    features: [
      { title: 'Funcionalidade Principal', description: 'Descrição da funcionalidade implementada.' }
    ],
    technologies: 'React, TypeScript, Node.js, Tailwind CSS',
    results: [
      { metric: '+80%', label: 'Eficiência operacional' }
    ],
    imagePlaceholderType: 'dashboard',
    accentColor: '#22D3EE',
    clientType: 'Empresa Corporativa',
    clientName: '',
    year: '2025',
    projectType: 'real',
    featured: false,
    isPublished: true
  });

  const currentUser = authService.getCurrentUser();

  const refreshList = () => {
    setProjects(projectService.getAllProjects());
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      category: 'web',
      categoryLabel: 'Sistemas Web',
      shortDescription: '',
      challenge: '',
      solution: '',
      features: [
        { title: 'Módulo Central', description: 'Painel completo com controle de dados em tempo real.' }
      ],
      technologies: 'React, Node.js, PostgreSQL, Docker, Tailwind CSS',
      results: [
        { metric: '+85%', label: 'Otimização de tempo operacional' },
        { metric: '100%', label: 'Disponibilidade e segurança em nuvem' }
      ],
      imagePlaceholderType: 'dashboard',
      accentColor: '#22D3EE',
      clientType: 'Indústria / Varejo',
      clientName: 'Cliente Corporativo',
      year: '2025',
      projectType: 'real',
      featured: false,
      isPublished: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: Project) => {
    setEditingProject(proj);
    setFormData({
      name: proj.name,
      slug: proj.slug || proj.id,
      tagline: proj.tagline,
      category: proj.category,
      categoryLabel: proj.categoryLabel,
      shortDescription: proj.shortDescription,
      challenge: proj.challenge,
      solution: proj.solution,
      features: proj.features && proj.features.length > 0 ? proj.features : [{ title: 'Módulo Central', description: 'Funcionalidade implementada.' }],
      technologies: proj.technologies.join(', '),
      results: proj.results && proj.results.length > 0 ? proj.results : [{ metric: '+50%', label: 'Aumento de produtividade' }],
      imagePlaceholderType: proj.imagePlaceholderType,
      accentColor: proj.accentColor || '#22D3EE',
      clientType: proj.clientType || 'Empresa',
      clientName: proj.clientName || '',
      year: proj.year || '2025',
      projectType: proj.projectType || 'real',
      featured: !!proj.featured,
      isPublished: proj.isPublished !== false && proj.status !== 'draft'
    });
    setIsModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || projectService.generateSlug(formData.name),
      tagline: formData.tagline.trim(),
      category: formData.category,
      categoryLabel: getCategoryLabel(formData.category),
      shortDescription: formData.shortDescription.trim(),
      challenge: formData.challenge.trim(),
      solution: formData.solution.trim(),
      features: formData.features,
      technologies: techArray,
      results: formData.results,
      imagePlaceholderType: formData.imagePlaceholderType,
      accentColor: formData.accentColor,
      clientType: formData.clientType.trim(),
      clientName: formData.clientName.trim(),
      year: formData.year.trim() || '2025',
      projectType: formData.projectType,
      featured: formData.featured,
      isPublished: formData.isPublished,
      status: (formData.isPublished ? 'published' : 'draft') as ProjectStatus
    };

    if (editingProject) {
      projectService.updateProject(editingProject.id, payload);
      if (currentUser) {
        adminService.logAction(currentUser, `Atualizou o projeto "${payload.name}"`, 'project', editingProject.id);
      }
      showFeedback(`Case "${payload.name}" atualizado com sucesso!`);
    } else {
      const created = projectService.createProject(payload);
      if (currentUser) {
        adminService.logAction(currentUser, `Criou o novo projeto "${created.name}"`, 'project', created.id);
      }
      showFeedback(`Novo case "${created.name}" adicionado ao portfólio!`);
    }

    setIsModalOpen(false);
    refreshList();
  };

  const handleDuplicate = (id: string) => {
    const dup = projectService.duplicateProject(id);
    if (dup) {
      if (currentUser) {
        adminService.logAction(currentUser, `Duplicou o projeto para "${dup.name}"`, 'project', dup.id);
      }
      showFeedback(`Projeto duplicado como rascunho com sucesso!`);
      refreshList();
    }
  };

  const handleTogglePublish = (id: string) => {
    const toggled = projectService.togglePublish(id);
    if (toggled) {
      const statusLabel = toggled.isPublished ? 'publicado' : 'despublicado (rascunho)';
      if (currentUser) {
        adminService.logAction(currentUser, `Alterou status do projeto "${toggled.name}" para ${statusLabel}`, 'project', id);
      }
      showFeedback(`Status alterado para ${statusLabel}.`);
      refreshList();
    }
  };

  const handleDelete = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    const success = projectService.deleteProject(id);
    if (success) {
      if (currentUser && proj) {
        adminService.logAction(currentUser, `Excluiu o projeto "${proj.name}"`, 'project', id);
      }
      showFeedback('Projeto removido do portfólio.');
      setDeleteConfirmId(null);
      refreshList();
    }
  };

  const getCategoryLabel = (cat: Project['category']): string => {
    switch (cat) {
      case 'management':
        return 'Sistemas de Gestão & ERP';
      case 'web':
        return 'Sistemas Web';
      case 'automation':
        return 'Automação & IoT';
      case 'mobile':
        return 'Aplicativos Mobile';
      case 'ai':
        return 'Inteligência Artificial';
      default:
        return 'Soluções Corporativas';
    }
  };

  // Dynamic Features handling
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { title: '', description: '' }]
    });
  };

  const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...formData.features];
    updated[index][field] = value;
    setFormData({ ...formData, features: updated });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  // Dynamic Results handling
  const addResult = () => {
    setFormData({
      ...formData,
      results: [...formData.results, { metric: '+50%', label: 'Métrica de impacto' }]
    });
  };

  const updateResult = (index: number, field: 'metric' | 'label', value: string) => {
    const updated = [...formData.results];
    updated[index][field] = value;
    setFormData({ ...formData, results: updated });
  };

  const removeResult = (index: number) => {
    setFormData({
      ...formData,
      results: formData.results.filter((_, i) => i !== index)
    });
  };

  // Filters
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.technologies || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = 
      selectedStatus === 'all' ||
      (selectedStatus === 'published' && p.isPublished !== false && p.status !== 'draft') ||
      (selectedStatus === 'draft' && (p.isPublished === false || p.status === 'draft')) ||
      (selectedStatus === 'featured' && p.featured);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-cyan-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            Gestão de Portfólio & Cases
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-medium border border-cyan-500/30">
              {projects.length} cases
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Adicione, edite, destaque e publique cases de sucesso visíveis no site institucional.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome do projeto, tecnologias, cliente ou descrição..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071B3A] border border-white/10 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filtrar por categoria de projeto"
          className="px-3 py-2.5 rounded-xl bg-[#071B3A] border border-white/10 text-xs text-slate-300 outline-none focus:border-cyan-400"
        >
          <option value="all">Todas as Categorias</option>
          <option value="management">Sistemas de Gestão & ERP</option>
          <option value="web">Sistemas Web</option>
          <option value="automation">Automação & IoT</option>
          <option value="mobile">Aplicativos Mobile</option>
          <option value="ai">Inteligência Artificial</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filtrar por status de publicação"
          className="px-3 py-2.5 rounded-xl bg-[#071B3A] border border-white/10 text-xs text-slate-300 outline-none focus:border-cyan-400"
        >
          <option value="all">Todos os Status</option>
          <option value="published">🟢 Publicados no Site</option>
          <option value="draft">🟡 Rascunhos</option>
          <option value="featured">⭐ Destaques</option>
        </select>
      </div>

      {/* Projects Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const isPublished = project.isPublished !== false && project.status !== 'draft';

          return (
            <div
              key={project.id}
              className="p-5 rounded-3xl bg-[#071B3A]/80 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4 group shadow-xl"
            >
              {/* Card Header & Badges */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300 text-[10px] font-mono font-semibold uppercase">
                    {project.categoryLabel}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {project.featured && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-300" />
                        Destaque
                      </span>
                    )}

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isPublished 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-slate-700 text-slate-300 border border-white/10'
                    }`}>
                      {isPublished ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                </div>

                {/* Mockup Preview Thumbnail */}
                <div className="h-36 rounded-2xl overflow-hidden bg-[#030D1A] border border-white/10 relative p-2 flex items-center justify-center">
                  <div className="scale-75 origin-center w-full pointer-events-none">
                    <ProjectMockup type={project.imagePlaceholderType} title={project.name} accentColor={project.accentColor} />
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {project.viewsCount || 0} views
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-bold text-white text-base font-['Outfit'] group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.technologies.slice(0, 4).map((tech, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[10px] font-mono">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 text-[10px] font-mono">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-1">
                {/* Publish Toggle Button */}
                <button
                  onClick={() => handleTogglePublish(project.id)}
                  title={isPublished ? 'Tornar Rascunho' : 'Publicar no Site'}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isPublished
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span className="text-[11px]">{isPublished ? 'Online' : 'Rascunho'}</span>
                </button>

                <div className="flex items-center gap-1">
                  {/* Public Preview */}
                  <button
                    onClick={() => navigate(`/projetos/${project.slug || project.id}`)}
                    title="Ver no site público"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicate(project.id)}
                    title="Duplicar Projeto"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEditModal(project)}
                    title="Editar Projeto"
                    className="p-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    title="Excluir Projeto"
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 rounded-3xl bg-[#071B3A]/40 border border-white/5 space-y-3">
          <FolderKanban className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm text-slate-300 font-medium">Nenhum projeto encontrado com os filtros atuais.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className="text-xs text-cyan-400 hover:underline"
          >
            Limpar filtros de busca
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#071B3A] border border-rose-500/40 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white font-['Outfit']">Confirmar Exclusão de Case</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tem certeza que deseja remover este case permanentemente do portfólio da OneSignal? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-600/30"
              >
                Sim, Excluir Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Project Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 animate-fade-in overflow-y-auto">
          <div className="max-w-3xl w-full my-8 p-6 sm:p-8 rounded-3xl bg-[#071B3A] border border-cyan-500/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  {editingProject ? 'Editar Case de Sucesso' : 'Adicionar Novo Case ao Portfólio'}
                </h3>
                <span className="text-xs text-slate-400">Preencha as informações técnicas e de negócios do projeto</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-6">
              
              {/* General Project Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-slate-300 font-medium">Nome do Projeto / Solução *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Sistema de Gestão Empresarial (Nexus ERP)"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-medium">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Project['category'] })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-slate-200 focus:border-cyan-400 outline-none"
                  >
                    <option value="management">Sistemas de Gestão & ERP</option>
                    <option value="web">Sistemas Web</option>
                    <option value="automation">Automação & IoT</option>
                    <option value="mobile">Aplicativos Mobile</option>
                    <option value="ai">Inteligência Artificial</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-medium">Tipo de Mockup Visual</label>
                  <select
                    value={formData.imagePlaceholderType}
                    onChange={(e) => setFormData({ ...formData, imagePlaceholderType: e.target.value as Project['imagePlaceholderType'] })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-slate-200 focus:border-cyan-400 outline-none"
                  >
                    <option value="dashboard">📊 Dashboard Executivo (Analytics/ERP)</option>
                    <option value="mobile">📱 App Mobile (Interface de Smartphone)</option>
                    <option value="iot">⚡ Automação & IoT (Sensores/Telemetria)</option>
                    <option value="crm">👥 CRM & Comercial (Pipeline/Contatos)</option>
                    <option value="finance">💰 Gestão Financeira & Fiscal</option>
                    <option value="ai">🧠 Inteligência Artificial & Diagnósticos</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-slate-300 font-medium">Tagline / Chamada de Impacto</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="ex: Controle unificado de processos, estoque e KPIs em tempo real"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-slate-300 font-medium">Descrição Resumida (Card)</label>
                  <textarea
                    rows={2}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Descrição concisa exibida no card do portfólio..."
                    className="w-full px-4 py-2 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-medium">O Desafio do Cliente</label>
                  <textarea
                    rows={3}
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    placeholder="Qual era o gargalo operacional ou problema antes do projeto?"
                    className="w-full px-4 py-2 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-medium">A Solução OneSignal</label>
                  <textarea
                    rows={3}
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="Como nossa engenharia de software solucionou o desafio?"
                    className="w-full px-4 py-2 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <label className="text-xs font-mono text-slate-300 font-medium">Tecnologias Utilizadas (separadas por vírgula)</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, Tailwind CSS"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                />
              </div>

              {/* Dynamic Key Features */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-300 font-medium">Funcionalidades Principais ({formData.features.length})</label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Funcionalidade
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-[#030D1A] border border-white/10 flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                          placeholder="Título do módulo (ex: Gestão de Equipes)"
                          className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                        />
                        <input
                          type="text"
                          value={feat.description}
                          onChange={(e) => updateFeature(idx, 'description', e.target.value)}
                          placeholder="Descrição da entrega e impacto"
                          className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 focus:border-cyan-400 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Results & Metrics */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-300 font-medium">Resultados & Métricas ({formData.results.length})</label>
                  <button
                    type="button"
                    onClick={addResult}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Métrica
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formData.results.map((res, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-[#030D1A] border border-white/10 flex items-center gap-2">
                      <input
                        type="text"
                        value={res.metric}
                        onChange={(e) => updateResult(idx, 'metric', e.target.value)}
                        placeholder="Métrica (+85%)"
                        className="w-24 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-cyan-300 font-bold focus:border-cyan-400 outline-none"
                      />
                      <input
                        type="text"
                        value={res.label}
                        onChange={(e) => updateResult(idx, 'label', e.target.value)}
                        placeholder="Impacto / Descrição"
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 focus:border-cyan-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeResult(idx)}
                        className="p-1 text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client & Metadata Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-medium">Nome do Cliente</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Grupo Industrial Nexus"
                    className="w-full px-3 py-2 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-medium">Segmento / Tipo</label>
                  <input
                    type="text"
                    value={formData.clientType}
                    onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                    placeholder="Indústria & Logística"
                    className="w-full px-3 py-2 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-medium">Ano</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2 rounded-xl bg-[#030D1A] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              {/* Toggles: Featured & Published */}
              <div className="p-4 rounded-2xl bg-[#030D1A] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400"
                  />
                  <span>Destacar case no início do portfólio ⭐</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400"
                  />
                  <span className="text-emerald-400">Publicar imediatamente no site público 🟢</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer"
                >
                  {editingProject ? 'Salvar Alterações' : 'Criar e Publicar Case'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
