import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  companyName: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const icpSchema = z.object({
  name: z.string().min(1, 'ICP name is required'),
  description: z.string().optional(),
  criteria: z.object({
    industry: z.array(z.string()).min(1, 'Select at least one industry'),
    companySize: z.array(z.string()).min(1, 'Select at least one company size'),
    location: z.array(z.string()).min(1, 'Add at least one location'),
    keywords: z.array(z.string()).min(1, 'Add at least one keyword'),
    revenue: z.string().optional(),
    exclusions: z.array(z.string()).optional(),
    jobTitles: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
  }),
});

export const prospectSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().min(1, 'Company name is required'),
  companyDomain: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const emailSequenceSchema = z.object({
  name: z.string().min(1, 'Sequence name is required'),
  description: z.string().optional(),
  steps: z.array(
    z.object({
      subject: z.string().min(1, 'Subject is required'),
      content: z.string().min(1, 'Content is required'),
      delayDays: z.number().min(0).max(365),
    })
  ).min(1, 'Add at least one step'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ICPInput = z.infer<typeof icpSchema>;
export type ProspectInput = z.infer<typeof prospectSchema>;
export type EmailSequenceInput = z.infer<typeof emailSequenceSchema>;