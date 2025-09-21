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

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false)
});

export const UserUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  companyName: z.string().max(100).optional(),
  language: z.enum(['en', 'fr']).optional(),
  timezone: z.string().optional()
});
