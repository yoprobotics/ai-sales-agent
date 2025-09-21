import { z } from 'zod';

// User schemas
export const UserRegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number and special character'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  companyName: z.string().max(100).optional(),
  language: z.enum(['en', 'fr']).default('en'),
  dataRegion: z.enum(['US', 'EU', 'CA']).default('EU'),
  timezone: z.string().default('UTC'),
  acceptTerms: z.boolean().refine(val => val === true, 'Must accept terms and conditions')
});

export const ICPCriteriaSchema = z.object({
  industry: z.array(z.string()).min(1, 'At least one industry is required'),
  companySize: z.array(z.string()).min(1),
  revenue: z.string().optional(),
  location: z.array(z.string()).min(1, 'At least one location is required'),
  keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
  exclusions: z.array(z.string()).optional(),
  jobTitles: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional()
});

export const ICPCreateSchema = z.object({
  name: z.string().min(1, 'ICP name is required').max(100),
  description: z.string().max(500).optional(),
  criteria: ICPCriteriaSchema
});

export const ProspectCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  jobTitle: z.string().max(200).optional(),
  company: z.object({
    name: z.string().min(1, 'Company name is required').max(200),
    domain: z.string().url().optional().or(z.literal('')),
    industry: z.string().max(100).optional(),
    size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']).optional(),
    revenue: z.enum(['under_1m', '1m_10m', '10m_50m', '50m_100m', 'over_100m']).optional(),
    location: z.string().max(200).optional(),
    description: z.string().max(1000).optional(),
    employees: z.number().int().positive().optional(),
    founded: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
    technologies: z.array(z.string()).optional()
  }),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  notes: z.string().max(2000).optional(),
  icpId: z.string().uuid('Invalid ICP ID'),
  source: z.enum(['csv_import', 'url_scraping', 'manual', 'api', 'integration']).default('manual'),
  customFields: z.record(z.any()).optional().default({})
});

export const EmailSequenceStepSchema = z.object({
  stepNumber: z.number().int().min(1).max(10),
  subject: z.string().min(1, 'Subject is required').max(200),
  content: z.string().min(1, 'Content is required').max(5000),
  delayDays: z.number().int().min(0).max(365),
  conditions: z.array(z.object({
    type: z.enum(['opened', 'clicked', 'replied', 'bounced', 'unsubscribed']),
    action: z.enum(['continue', 'skip', 'stop']),
    waitDays: z.number().int().min(0).max(365).optional()
  })).optional().default([]),
  isActive: z.boolean().default(true)
});

export const EmailSequenceCreateSchema = z.object({
  name: z.string().min(1, 'Sequence name is required').max(100),
  description: z.string().max(500).optional(),
  icpId: z.string().uuid('Invalid ICP ID'),
  steps: z.array(EmailSequenceStepSchema).min(1, 'At least one step is required').max(10)
});

// Type exports
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type ICPCriteria = z.infer<typeof ICPCriteriaSchema>;
export type ICPCreate = z.infer<typeof ICPCreateSchema>;
export type ProspectCreate = z.infer<typeof ProspectCreateSchema>;
export type EmailSequenceCreate = z.infer<typeof EmailSequenceCreateSchema>;