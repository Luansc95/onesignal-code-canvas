export type ProjectCategory = 'all' | 'web' | 'mobile' | 'automation' | 'management' | 'ai';

export type ProjectType = 'real' | 'concept' | 'in_development';
export type ProjectStatus = 'completed' | 'in_development';

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface ProjectResult {
  metric: string;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: 'web' | 'mobile' | 'automation' | 'management' | 'ai';
  categoryLabel: string;
  shortDescription: string;
  challenge: string;
  solution: string;
  features: ProjectFeature[];
  technologies: string[];
  results: ProjectResult[];
  imagePlaceholderType: 'dashboard' | 'mobile' | 'iot' | 'crm' | 'finance' | 'ai';
  accentColor: string;
  demoUrl?: string;
  clientType: string;
  clientName?: string;
  year: string;
  projectType?: ProjectType;
  featured?: boolean;
  status?: ProjectStatus;
  isDemo?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  iconName: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  technologies: string[];
  benefits: string[];
}

export type LeadStatus = 'new' | 'analyzing' | 'contacted' | 'negotiating' | 'converted' | 'archived';

export type DigitalMaturityLevel = 'Em desenvolvimento' | 'Em evolução' | 'Estruturada' | 'Avançada';

export interface DiagnosticAnswers {
  companySize?: string;
  industry?: string;
  customIndustry?: string;
  challenges: string[];
  customChallenge?: string;
  infoControl?: string;
  customInfoControl?: string;
  manualProcessesLevel?: string;
  indicatorsStatus?: string;
  objectives: string[];
  systemsIntegrated?: string;
  infoAccessEase?: string;
  repetitiveTasksAutomable?: string;
}

export interface IdentifiedOpportunity {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface RecommendedSolution {
  id: string;
  icon: string;
  title: string;
  category: string;
  description: string;
  problemSolved: string;
  potentialBenefit: string;
  serviceId?: string;
}

export interface DiagnosticResultData {
  score: number;
  maturityLevel: DigitalMaturityLevel;
  maturityPercentage: number;
  maturityExplanation: string;
  identifiedOpportunities: IdentifiedOpportunity[];
  recommendedSolutions: RecommendedSolution[];
  summaryText: string;
  answers: DiagnosticAnswers;
  completedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  solutionType: string;
  projectDescription: string;
  budgetRange?: string;
  desiredTimeline?: string;
  foundUsVia?: string;
  preferredContactMethod?: string;
  source: string;
  pageUrl: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  createdAt: string;
  status: LeadStatus;
  notes?: string;
  lgpdConsent: boolean;
  // Diagnostic Lead Qualifiers
  diagnosticCompleted?: boolean;
  digitalMaturity?: string;
  diagnosticScore?: number;
  identifiedChallenges?: string[];
  recommendedSolutions?: string[];
  diagnosticAnswers?: DiagnosticAnswers;
}

export interface ContactFormData {
  name: string;
  company: string;
  whatsapp: string;
  email: string;
  solutionType: string;
  budgetRange?: string;
  desiredTimeline?: string;
  timeline?: string;
  foundUsVia?: string;
  preferredContactMethod?: string;
  description: string;
  lgpdConsent?: boolean;
  // Diagnostic Integration
  diagnosticData?: {
    score: number;
    maturityLevel: string;
    challenges: string[];
    recommendedSolutions: string[];
    answers: DiagnosticAnswers;
  };
}


