// Re-export Prisma types
export type { 
  User, 
  UserRole,
  Session,
  ICP, 
  Prospect,
  ProspectStage,
  ProspectSource,
  EmailTemplate,
  EmailSequence,
  EmailSequenceStep,
  Campaign,
  CampaignStatus,
  Message,
  MessageStatus,
  MessageChannel,
  Activity,
  AIInsight,
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  SubscriptionUsage,
  Payment,
  Language,
  DataRegion
} from '@prisma/client';

// Additional app-specific types
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  plan: string;
  companyName?: string;
  language: string;
  dataRegion: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProspectInput {
  email: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  company: {
    name: string;
    domain?: string;
    industry?: string;
    size?: string;
    revenue?: string;
    location?: string;
  };
  linkedinUrl?: string;
  websiteUrl?: string;
  phone?: string;
  notes?: string;
  icpId: string;
  source?: string;
}

export interface CreateICPInput {
  name: string;
  description?: string;
  criteria: {
    industry: string[];
    companySize: string[];
    revenue?: string;
    location: string[];
    keywords: string[];
    exclusions?: string[];
    jobTitles?: string[];
    technologies?: string[];
  };
}

export interface EmailSequenceInput {
  name: string;
  description?: string;
  icpId: string;
  steps: {
    stepNumber: number;
    subject: string;
    content: string;
    delayDays: number;
    conditions?: any;
  }[];
}

export interface CampaignInput {
  name: string;
  description?: string;
  sequenceId: string;
  prospectIds: string[];
}

export interface ScoreExplanation {
  total: number;
  breakdown: {
    budget: number;
    authority: number;
    need: number;
    timing: number;
    signals: number;
  };
  reasoning: {
    budget: string;
    authority: string;
    need: string;
    timing: string;
    signals: string;
  };
  confidence: number;
}

export interface DashboardStats {
  totalProspects: number;
  qualifiedProspects: number;
  emailsSent: number;
  responseRate: number;
  pipelineValue: number;
  activeSequences: number;
  weeklyGrowth: {
    prospects: number;
    emails: number;
    responses: number;
  };
}

export interface CSVMapping {
  [csvColumn: string]: string;
}

export interface ParsedProspect {
  email: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  companyName: string;
  companyDomain?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  phone?: string;
  notes?: string;
  [key: string]: any;
}