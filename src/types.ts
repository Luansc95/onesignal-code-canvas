export type ProjectCategory = 'all' | 'web' | 'mobile' | 'automation' | 'management' | 'ai';

export type ProjectType = 'real' | 'concept' | 'in_development' | 'internal' | 'demo';
export type ProjectStatus = 'published' | 'draft' | 'archived' | 'completed' | 'in_development';

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
  slug?: string;
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
  coverImage?: string;
  galleryImages?: string[];
  demoUrl?: string;
  clientType: string;
  clientName?: string;
  year: string;
  projectType?: ProjectType;
  featured?: boolean;
  status?: ProjectStatus;
  isPublished?: boolean;
  viewsCount?: number;
  updatedAt?: string;
  createdAt?: string;
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

export type LeadStatus = 'new' | 'analyzing' | 'contacted' | 'negotiating' | 'converted' | 'lost' | 'archived';

export type LeadPriority = 'high' | 'medium' | 'low';

export interface LeadScoreFactor {
  name: string;
  points: number;
  description: string;
  matched: boolean;
}

export interface LeadScoreResult {
  score: number;
  priority: LeadPriority;
  priorityLabel: string;
  factors: LeadScoreFactor[];
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'status_change' | 'note_added' | 'contacted' | 'diagnostic_viewed' | 'created';
  description: string;
  authorName: string;
  timestamp: string;
}

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
  updatedAt?: string;
  status: LeadStatus;
  priority?: LeadPriority;
  score?: number;
  notes?: string;
  activities?: LeadActivity[];
  lgpdConsent: boolean;
  // Diagnostic Lead Qualifiers
  diagnosticCompleted?: boolean;
  digitalMaturity?: string;
  diagnosticScore?: number;
  identifiedChallenges?: string[];
  recommendedSolutions?: string[];
  diagnosticAnswers?: DiagnosticAnswers;
}

export interface ContactMessage {
  id: string;
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  subject?: string;
  message: string;
  serviceType?: string;
  source: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied' | 'converted';
  leadId?: string;
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

// Admin RBAC & User Types
export type AdminRole = 'admin' | 'editor' | 'commercial' | 'marketing';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'budget' | 'diagnostic' | 'project' | 'system';
  timestamp: string;
  read: boolean;
  linkUrl?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: AdminRole;
  action: string;
  targetType: 'project' | 'lead' | 'contact' | 'settings' | 'auth' | 'campaign';
  targetId?: string;
  details: string;
  timestamp: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  source: string;
  medium: string;
  campaign: string;
  targetUrl: string;
  clicksCount: number;
  leadsCount: number;
  conversionRate: number;
  createdAt: string;
  status: 'active' | 'paused' | 'archived';
}

export interface CompanySettings {
  companyName: string;
  tradingName: string;
  cnpj?: string;
  commercialEmail: string;
  supportEmail: string;
  phoneDisplay: string;
  rawWhatsappNumber: string;
  addressDisplay: string;
  businessHours: string;
  instagram: string;
  linkedin: string;
  youtube?: string;
  github?: string;
  seoTitle: string;
  seoDescription: string;
  notifyOnNewLead: boolean;
  notifyOnDiagnostic: boolean;
}



