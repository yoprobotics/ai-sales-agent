import { z, ZodError, ZodSchema } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Common validation schemas
 */
export const schemas = {
  // Authentication schemas
  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
  }),
  
  register: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number and special character'
      ),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    companyName: z.string().max(100).optional(),
    language: z.enum(['en', 'fr']).optional(),
    dataRegion: z.enum(['US', 'EU', 'CA']).optional(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }),
  
  forgotPassword: z.object({
    email: z.string().email('Invalid email format'),
  }),
  
  resetPassword: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number and special character'
      ),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }),
  
  // User profile schemas
  updateProfile: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    companyName: z.string().max(100).optional(),
    language: z.enum(['en', 'fr']).optional(),
    timezone: z.string().optional(),
  }),
  
  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number and special character'
      ),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }),
  
  // ICP schemas
  createICP: z.object({
    name: z.string().min(1, 'ICP name is required').max(100),
    description: z.string().max(500).optional(),
    criteria: z.object({
      industry: z.array(z.string()).min(1, 'At least one industry is required'),
      companySize: z.array(z.enum(['startup', 'small', 'medium', 'large', 'enterprise'])).min(1),
      revenue: z.enum(['under_1m', '1m_10m', '10m_50m', '50m_100m', 'over_100m']).optional(),
      location: z.array(z.string()).min(1, 'At least one location is required'),
      keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
      exclusions: z.array(z.string()).optional(),
      jobTitles: z.array(z.string()).optional(),
      technologies: z.array(z.string()).optional(),
    }),
  }),
  
  // Prospect schemas
  createProspect: z.object({
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
    }),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    websiteUrl: z.string().url().optional().or(z.literal('')),
    phone: z.string().max(20).optional(),
    notes: z.string().max(2000).optional(),
    icpId: z.string().uuid('Invalid ICP ID'),
  }),
  
  // Pagination and filters
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
  
  // Email sequence schemas
  createSequence: z.object({
    name: z.string().min(1, 'Sequence name is required').max(100),
    description: z.string().max(500).optional(),
    icpId: z.string().uuid('Invalid ICP ID'),
    steps: z.array(z.object({
      stepNumber: z.number().int().min(1).max(10),
      subject: z.string().min(1, 'Subject is required').max(200),
      content: z.string().min(1, 'Content is required').max(5000),
      delayDays: z.number().int().min(0).max(365),
    })).min(1, 'At least one step is required').max(10),
  }),
};

/**
 * Validate request body against a schema
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        data: null,
        error: NextResponse.json(
          {
            error: 'Validation failed',
            details: error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        ),
      };
    }
    
    return {
      data: null,
      error: NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Validate query parameters against a schema
 */
export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): { data: T; error: null } | { data: null; error: NextResponse } {
  try {
    const { searchParams } = new URL(request.url);
    const query: Record<string, any> = {};
    
    searchParams.forEach((value, key) => {
      // Handle numeric values
      if (/^\d+$/.test(value)) {
        query[key] = parseInt(value, 10);
      }
      // Handle boolean values
      else if (value === 'true' || value === 'false') {
        query[key] = value === 'true';
      }
      // Default to string
      else {
        query[key] = value;
      }
    });
    
    const data = schema.parse(query);
    return { data, error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        data: null,
        error: NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        ),
      };
    }
    
    return {
      data: null,
      error: NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize HTML content
 */
export function sanitizeHTML(html: string): string {
  // Remove script tags and event handlers
  const cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '');
  
  return cleaned;
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Export types for use in API routes
 */
export type LoginInput = z.infer<typeof schemas.login>;
export type RegisterInput = z.infer<typeof schemas.register>;
export type CreateICPInput = z.infer<typeof schemas.createICP>;
export type CreateProspectInput = z.infer<typeof schemas.createProspect>;
export type CreateSequenceInput = z.infer<typeof schemas.createSequence>;
export type PaginationInput = z.infer<typeof schemas.pagination>;
