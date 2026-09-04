import React, { useState } from 'react';
import { TechBackground } from './components/TechBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DiagnosisFlow } from './components/diagnosis/DiagnosisFlow';
import { Services } from './components/Services';
import { WhyInvest } from './components/WhyInvest';
import { Portfolio } from './components/Portfolio';
import { ProjectModal } from './components/ProjectModal';
import { HowWeWork } from './components/HowWeWork';
import { About } from './components/About';
import { BudgetEstimator } from './components/BudgetEstimator';
import { FinalCtaSection } from './components/FinalCtaSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { QuickContactFloating } from './components/QuickContactFloating';
import { BudgetModal } from './components/BudgetModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { Project } from './types';
import { analytics } from './services/analyticsService';
import { useRouter } from './lib/router';
import { useAuth } from './hooks/useAuth';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminResetPassword } from './components/admin/AdminResetPassword';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminLeads } from './components/admin/AdminLeads';
import { AdminLeadScoring } from './components/admin/AdminLeadScoring';
import { AdminContacts } from './components/admin/AdminContacts';
import { AdminDiagnostics } from './components/admin/AdminDiagnostics';
import { AdminMarketing } from './components/admin/AdminMarketing';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { AdminUsers } from './components/admin/AdminUsers';

function AdminArea({ currentPath }: { currentPath: string }) {
  const { user, isLoading } = useAuth();

  if (currentPath === '/admin/redefinir-senha') {
    return <AdminResetPassword />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030D1A] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-400">Verificando sessão...</p>
      </div>
    );
  }


  if (!user || currentPath === '/admin/login') {
    return <AdminLogin />;
  }

  const renderAdminContent = () => {
    switch (currentPath) {
      case '/admin':
      case '/admin/dashboard':
        return <AdminDashboard />;
      case '/admin/projetos':
        return <AdminProjects />;
      case '/admin/leads':
        return <AdminLeads />;
      case '/admin/lead-scoring':
        return <AdminLeadScoring />;
      case '/admin/contatos':
        return <AdminContacts />;
      case '/admin/diagnosticos':
        return <AdminDiagnostics />;
      case '/admin/marketing':
        return <AdminMarketing />;
      case '/admin/analytics':
        return <AdminAnalytics />;
      case '/admin/configuracoes':
        return <AdminSettings />;
      case '/admin/usuarios':
        return <AdminUsers />;
      case '/admin/logs':
        return <AdminAuditLogs />;
      default:
        return <AdminDashboard />;
    }
  };

  return <AdminLayout currentPath={currentPath}>{renderAdminContent()}</AdminLayout>;
}


export default function App() {
  const { path: currentPath } = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [budgetModalService, setBudgetModalService] = useState<string | undefined>(undefined);
  const [budgetModalDesc, setBudgetModalDesc] = useState<string | undefined>(undefined);

  // States to pass down to inline ContactSection if applied from Estimator
  const [formInitialService, setFormInitialService] = useState<string | undefined>(undefined);
  const [formInitialDesc, setFormInitialDesc] = useState<string | undefined>(undefined);

  // ==========================================
  // ADMIN PLATFORM ROUTING
  // ==========================================
  if (currentPath.startsWith('/admin')) {
    return <AdminArea currentPath={currentPath} />;
  }



  // ==========================================
  // PUBLIC WEBSITE (EXISTING SITE UNCHANGED)
  // ==========================================
  // Open Modal helper
  const handleOpenBudgetModal = (serviceType?: string, description?: string) => {
    analytics.track('click_budget', { source: 'app_orchestrator', serviceType });
    setBudgetModalService(serviceType);
    setBudgetModalDesc(description);
    setIsBudgetModalOpen(true);
  };

  // When clicking "Tenho um projeto parecido" on Project Modal
  const handleSimilarProjectQuote = (projectName: string, category: string) => {
    const desc = `Tenho interesse em desenvolver um projeto com escopo e arquitetura semelhantes ao case "${projectName}".`;
    setFormInitialService(category.includes('Mobile') ? 'Aplicativo Mobile' : category.includes('Gestão') ? 'Sistema de Gestão' : category.includes('Automação') ? 'Automação' : 'Sistema Web');
    setFormInitialDesc(desc);

    // Scroll to contact form smoothly
    const contactEl = document.getElementById('contato');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleOpenBudgetModal(category, desc);
    }
  };

  // When selecting a solution recommended by the Diagnostic tool
  const handleDiagnosticSolutionQuote = (solutionTitle: string) => {
    analytics.track('recommended_service_clicked', { solutionTitle });
    const desc = `Gostaria de solicitar uma proposta técnica para a solução recomendada pelo Diagnóstico: "${solutionTitle}".`;
    setFormInitialService(solutionTitle);
    setFormInitialDesc(desc);

    const contactEl = document.getElementById('contato');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleOpenBudgetModal(solutionTitle, desc);
    }
  };

  // When applying estimate from the interactive simulator
  const handleApplyEstimate = (data: { solutionType: string; description: string; timeline: string }) => {
    analytics.track('click_consultative_cta', { source: 'budget_estimator', solutionType: data.solutionType });
    setFormInitialService(data.solutionType);
    setFormInitialDesc(data.description);
    const contactEl = document.getElementById('contato');
    contactEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToDiagnosis = () => {
    const el = document.getElementById('diagnostico');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#071B3A] text-slate-100 relative overflow-x-hidden selection:bg-[#22D3EE]/30 selection:text-[#22D3EE]">
      {/* Interactive Tech Canvas & Glow Layers */}
      <TechBackground />

      {/* Main Header / Navigation */}
      <Navbar onOpenBudgetModal={() => handleOpenBudgetModal()} />

      <main className="relative z-10">
        {/* Hero Section */}
        <Hero 
          onOpenBudgetModal={() => handleOpenBudgetModal()} 
          onStartDiagnosis={handleScrollToDiagnosis}
          onExploreProjects={() => {
            const el = document.getElementById('projetos');
            el?.scrollIntoView({ behavior: 'smooth' });
          }} 
        />

        {/* Interactive Diagnosis & Automation Calculator Section */}
        <section id="diagnostico" className="relative scroll-mt-20">
          <DiagnosisFlow
            onSelectSolutionForQuote={handleDiagnosticSolutionQuote}
            onExploreServices={() => {
              const el = document.getElementById('servicos');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenBudgetModal={handleOpenBudgetModal}
            onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
          />
        </section>

        {/* Services Section */}
        <Services 
          onSelectServiceForBudget={(serviceTitle) => {
            setFormInitialService(serviceTitle);
            handleOpenBudgetModal(serviceTitle);
          }} 
        />

        {/* Why Invest in Technology Section */}
        <div className="section-lazy-render">
          <WhyInvest />
        </div>

        {/* Portfolio Section */}
        <div className="section-lazy-render">
          <Portfolio 
            onSelectProject={(project) => setSelectedProject(project)}
            onOpenBudgetModal={() => handleOpenBudgetModal()}
          />
        </div>

        {/* How We Work (Methodology) Section */}
        <div className="section-lazy-render">
          <HowWeWork />
        </div>

        {/* About OneSignal Section */}
        <div className="section-lazy-render">
          <About />
        </div>

        {/* Interactive Scope & Budget Estimator Tool */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-lazy-render">
          <BudgetEstimator onApplyEstimateToForm={handleApplyEstimate} />
        </div>

        {/* Final High-Conversion Pre-Contact CTA Section */}
        <div className="section-lazy-render">
          <FinalCtaSection onOpenBudgetModal={() => handleOpenBudgetModal()} />
        </div>

        {/* Contact & Quote Request Section */}
        <ContactSection 
          initialServiceType={formInitialService} 
          initialDescription={formInitialDesc}
          onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        />
      </main>

      {/* Modern Footer */}
      <Footer 
        onOpenBudgetModal={() => handleOpenBudgetModal()} 
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
      />

      {/* Floating Action Buttons */}
      <QuickContactFloating onOpenBudgetModal={() => handleOpenBudgetModal()} />

      {/* Individual Project Detail Modal */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        onSimilarProjectQuote={handleSimilarProjectQuote}
      />

      {/* Quick Budget Request Pop-up Modal */}
      <BudgetModal 
        isOpen={isBudgetModalOpen} 
        onClose={() => setIsBudgetModalOpen(false)}
        initialServiceType={budgetModalService}
        initialDescription={budgetModalDesc}
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
      />

      {/* LGPD Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
    </div>
  );
}

