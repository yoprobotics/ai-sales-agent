import {
  UserRegistrationSchema,
  UserLoginSchema,
  ICPCreateSchema,
  ProspectCreateSchema,
  EmailSequenceCreateSchema
} from '../schemas';

describe('Validation Schemas', () => {
  describe('UserRegistrationSchema', () => {
    it('should validate correct user registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        firstName: 'John',
        lastName: 'Doe',
        companyName: 'Test Corp',
        language: 'en',
        dataRegion: 'US',
        acceptTerms: true
      };

      const result = UserRegistrationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Test123!@#',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: true
      };

      const result = UserRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email format');
      }
    });

    it('should reject weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: true
      };

      const result = UserRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('8 characters');
      }
    });

    it('should require accepting terms', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: false
      };

      const result = UserRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('ICPCreateSchema', () => {
    it('should validate correct ICP data', () => {
      const validData = {
        name: 'Enterprise SaaS',
        description: 'Large software companies',
        criteria: {
          industry: ['Technology', 'Software'],
          companySize: ['large', 'enterprise'],
          location: ['United States'],
          keywords: ['SaaS', 'B2B']
        }
      };

      const result = ICPCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should require at least one industry', () => {
      const invalidData = {
        name: 'Test ICP',
        criteria: {
          industry: [],
          companySize: ['medium'],
          location: ['US'],
          keywords: ['test']
        }
      };

      const result = ICPCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('ProspectCreateSchema', () => {
    it('should validate correct prospect data', () => {
      const validData = {
        email: 'prospect@company.com',
        firstName: 'Jane',
        lastName: 'Smith',
        jobTitle: 'CEO',
        company: {
          name: 'Acme Corp',
          domain: 'https://acme.com',
          industry: 'Technology',
          size: 'medium'
        },
        icpId: '550e8400-e29b-41d4-a716-446655440000',
        source: 'manual'
      };

      const result = ProspectCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should require valid email', () => {
      const invalidData = {
        email: 'invalid',
        company: {
          name: 'Test'
        },
        icpId: '550e8400-e29b-41d4-a716-446655440000'
      };

      const result = ProspectCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should require valid UUID for icpId', () => {
      const invalidData = {
        email: 'test@example.com',
        company: {
          name: 'Test'
        },
        icpId: 'invalid-uuid'
      };

      const result = ProspectCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('EmailSequenceCreateSchema', () => {
    it('should validate correct email sequence data', () => {
      const validData = {
        name: 'Welcome Sequence',
        description: 'Onboarding emails',
        icpId: '550e8400-e29b-41d4-a716-446655440000',
        steps: [
          {
            stepNumber: 1,
            subject: 'Welcome!',
            content: 'Welcome to our platform',
            delayDays: 0,
            isActive: true
          },
          {
            stepNumber: 2,
            subject: 'Getting Started',
            content: 'Here is how to get started',
            delayDays: 3,
            conditions: [{
              type: 'opened',
              action: 'continue'
            }]
          }
        ]
      };

      const result = EmailSequenceCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should require at least one step', () => {
      const invalidData = {
        name: 'Empty Sequence',
        icpId: '550e8400-e29b-41d4-a716-446655440000',
        steps: []
      };

      const result = EmailSequenceCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should limit to maximum 10 steps', () => {
      const steps = Array(11).fill(null).map((_, i) => ({
        stepNumber: i + 1,
        subject: `Step ${i + 1}`,
        content: 'Content',
        delayDays: i
      }));

      const invalidData = {
        name: 'Too Many Steps',
        icpId: '550e8400-e29b-41d4-a716-446655440000',
        steps
      };

      const result = EmailSequenceCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
