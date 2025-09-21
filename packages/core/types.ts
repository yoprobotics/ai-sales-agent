// Core TypeScript types for AI Sales Agent

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  plan: SubscriptionPlan;
  companyName?: string;
  dataRegion: DataRegion;
  isEmailVerified: boolean;
  language: Language;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface ICP {
  id: string;
  userId: string;
  name: string;
  description?: string;
  criteria: ICPCriteria;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICPCriteria {
  industry: string[];
  companySize: CompanySize[];
  revenue?: RevenueRange;
  location: string[];
  keywords: string[];
  exclusions?: string[];
  jobTitles?: string[];
  technologies?: string[];
}

export interface Prospect {
  id: string;
  userId: string;
  icpId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  company: ProspectCompany;
  linkedinUrl?: string;
  websiteUrl?: string;
  phone?: string;
  notes?: string;
  score: number;
  scoreExplanation: ScoreExplanation;
  stage: ProspectStage;
  source: ProspectSource;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
  isOptedOut: boolean;
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProspectCompany {
  name: string;
  domain?: string;
  industry?: string;
  size?: CompanySize;
  revenue?: RevenueRange;
  location?: string;
  description?: string;
  employees?: number;
  founded?: number;
  technologies?: string[];
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

export interface EmailSequence {
  id: string;
  userId: string;
  icpId: string;
  name: string;
  description?: string;
  steps: EmailSequenceStep[];
  isActive: boolean;
  stats: SequenceStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailSequenceStep {
  id: string;
  sequenceId: string;
  stepNumber: number;
  subject: string;
  content: string;
  delayDays: number;
  conditions?: SequenceCondition[];
  isActive: boolean;
}

export interface SequenceCondition {
  type: 'opened' | 'clicked' | 'replied' | 'bounced' | 'unsubscribed';
  action: 'continue' | 'skip' | 'stop';
  waitDays?: number;
}

export interface SequenceStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
}

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  description?: string;
  sequenceId: string;
  prospects: string[];
  status: CampaignStatus;
  startedAt?: Date;
  completedAt?: Date;
  stats: SequenceStats;
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export type UserRole = 'CLIENT' | 'ADMIN' | 'TEAM_MEMBER' | 'TEAM_OWNER';
export type Language = 'en' | 'fr';
export type DataRegion = 'US' | 'EU' | 'CA';
export type SubscriptionPlan = 'STARTER' | 'PRO' | 'BUSINESS';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete';
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
export type RevenueRange = 'under_1m' | '1m_10m' | '10m_50m' | '50m_100m' | 'over_100m';
export type ProspectStage = 'new' | 'contacted' | 'meeting' | 'negotiation' | 'won' | 'lost';
export type ProspectSource = 'csv_import' | 'url_scraping' | 'manual' | 'api' | 'integration';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
export type MessageType = 'initial' | 'follow_up' | 'manual' | 'template';
export type MessageChannel = 'email' | 'linkedin' | 'sms' | 'whatsapp';
export type MessageStatus = 'draft' | 'scheduled' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'failed';
export type ActivityType = 'call' | 'meeting' | 'email' | 'note' | 'task' | 'demo' | 'follow_up';
export type InsightType = 'performance' | 'recommendation' | 'alert' | 'trend' | 'prediction';
export type InsightPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ReportType = 'performance' | 'prospects' | 'sequences' | 'campaigns' | 'revenue';