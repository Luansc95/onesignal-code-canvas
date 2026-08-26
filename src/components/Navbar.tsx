import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Menu as MenuIcon, 
  X, 
  ArrowRight, 
  Sparkles, 
  Code2, 
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  onOpenBudgetModal: (serviceType?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBudgetModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Determine active section
      const sections = ['inicio', 'diagnostico', 'servicos', 'projetos', 'metodologia', 'sobre', 'contato'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio', id: 'inicio' },
    { label: 'Diagnóstico', href: '#diagnostico', id: 'diagnostico' },
    { label: 'Serviços', href: '#servicos', id: 'servicos' },
    { label: 'Projetos', href: '#projetos', id: 'projetos' },
    { label: 'Metodologia', href: '#metodologia', id: 'metodologia' },
    { label: 'Sobre', href: '#sobre', id: 'sobre' },
    { label: 'Contato', href: '#contato', id: 'contato' },
  ];

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/5 backdrop-blur-md border-b border-white/10 py-3 shadow-xl shadow-black/20' 
          : 'bg-white/[0.02] backdrop-blur-sm border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          id="brand-logo-link"
          href="#inicio" 
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="relative flex items-center justify-center w-9 h-9 bg-gradient-to-br from-[#22D3EE] to-[#2DD4BF] rounded-lg shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-all duration-300">
            <div className="w-4 h-4 border-2 border-[#071B3A] rounded-sm rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#071B3A] rounded-full" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-300 animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-300" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tight font-['Outfit'] text-white">
                One<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF]">Signal</span>
              </span>
            </div>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-cyan-300/80 -mt-1">
              Tech Solutions
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-1 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                id={`nav-link-${link.id}`}
                href={link.href}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive 
                    ? 'text-white bg-white/15 shadow-sm border border-white/20' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            id="navbar-quote-btn"
            onClick={() => onOpenBudgetModal()}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-[#071B3A] rounded-full overflow-hidden transition-all duration-300 bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#071B3A] group-hover:rotate-12 transition-transform" />
            <span>Solicite um orçamento</span>
            <ArrowRight className="w-4 h-4 text-[#071B3A] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="mobile-budget-quick-btn"
            onClick={() => onOpenBudgetModal()}
            className="px-3.5 py-1.5 text-xs font-bold text-[#071B3A] bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] rounded-full shadow-md"
          >
            Orçamento
          </button>

          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 focus:outline-none border border-white/10 backdrop-blur-md"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <MenuIcon className="w-6 h-6 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu-drawer"
          className="md:hidden mt-3 px-4 pt-3 pb-6 bg-[#071B3A]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl space-y-3"
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                id={`mobile-link-${link.id}`}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  activeSection === link.id
                    ? 'text-white bg-white/15 border border-white/20'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              id="mobile-drawer-quote-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBudgetModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-[#071B3A] font-bold bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4 text-[#071B3A]" />
              Solicite um orçamento
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
