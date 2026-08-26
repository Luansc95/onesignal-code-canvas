import React, { useState } from 'react';
import { 
  Layers, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/projectsData';
import { Project, ProjectCategory } from '../types';
import { ProjectMockup } from './ProjectMockup';
import { analytics } from '../services/analyticsService';

interface PortfolioProps {
  onSelectProject: (project: Project) => void;
  onOpenBudgetModal: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onSelectProject, onOpenBudgetModal }) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [showAll, setShowAll] = useState(false);

  const categories: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: 'Todos os Projetos' },
    { id: 'management', label: 'Sistemas de Gestão & ERP' },
    { id: 'web', label: 'Sistemas Web' },
    { id: 'automation', label: 'Automação & IoT' },
    { id: 'mobile', label: 'Aplicativos Mobile' },
    { id: 'ai', label: 'Inteligência Artificial' },
  ];

  const handleCategoryChange = (catId: ProjectCategory) => {
    setActiveCategory(catId);
    setShowAll(true);
    analytics.track('portfolio_filter', { category: catId });
  };

  const handleProjectClick = (project: Project) => {
    analytics.track('view_project', { projectId: project.id, projectName: project.name, category: project.category });
    onSelectProject(project);
  };

  const filteredProjects = activeCategory === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === activeCategory);

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6);

  return (
    <section id="projetos" className="py-24 relative z-10 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#22D3EE] text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Layers className="w-3.5 h-3.5" />
            Casos de Sucesso & Engenharia
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Projetos que transformam{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF]">
              ideias em resultados
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Conheça algumas das plataformas, aplicativos e automações desenvolvidas 
            com nossa metodologia de engenharia de software de alto impacto.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`filter-btn-${cat.id}`}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 backdrop-blur-md ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] text-[#071B3A] font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 backdrop-blur-md overflow-hidden shadow-xl shadow-black/30 hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Card Visual Top Mockup */}
              <div className="relative border-b border-white/10 overflow-hidden">
                <ProjectMockup type={project.imagePlaceholderType} title={project.name} />
                
                {/* Category Badge overlay */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#071B3A]/80 text-[#22D3EE] border border-white/20 backdrop-blur-md shadow">
                    {project.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Card Body Info */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white font-['Outfit'] group-hover:text-[#22D3EE] transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Tech Tags */}
                <div className="space-y-4 pt-2 border-t border-white/10">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono rounded-md bg-white/5 text-cyan-200 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Primary Project Action */}
                  <button
                    id={`view-project-btn-${project.id}`}
                    onClick={() => handleProjectClick(project)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 group-hover:bg-gradient-to-r group-hover:from-[#22D3EE] group-hover:to-[#2DD4BF] group-hover:text-[#071B3A] border border-white/15 group-hover:border-transparent shadow-md transition-all duration-200"
                  >
                    <span>Ver projeto completo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Post-Portfolio Contextual CTA Banner */}
        <div 
          id="portfolio-contextual-cta"
          className="mt-14 rounded-2xl bg-white/5 border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit'] flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              Tem uma ideia ou necessidade semelhante?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Podemos desenvolver uma solução personalizada para a realidade da sua empresa.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="portfolio-quote-btn"
              onClick={() => {
                analytics.track('click_budget', { source: 'post_portfolio_banner' });
                onOpenBudgetModal();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Solicitar orçamento</span>
              <ArrowRight className="w-4 h-4 text-[#071B3A]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

