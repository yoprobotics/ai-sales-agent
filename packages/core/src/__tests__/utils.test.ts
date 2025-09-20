import {
  hashPassword,
  verifyPassword,
  isValidEmail,
  extractDomainFromEmail,
  formatCurrency,
  formatPercentage,
  generateId,
  isStrongPassword,
  slugify,
  capitalize,
  truncate
} from '../utils';

describe('Core Utils', () => {
  describe('Password utilities', () => {
    it('should hash and verify password correctly', async () => {
      const password = 'Test123!@#';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
      
      const isInvalid = await verifyPassword('wrong', hash);
      expect(isInvalid).toBe(false);
    });

    it('should validate strong passwords', () => {
      expect(isStrongPassword('Test123!@#')).toBe(true);
      expect(isStrongPassword('weak')).toBe(false);
      expect(isStrongPassword('NoNumbers!')).toBe(false);
      expect(isStrongPassword('NoSpecial123')).toBe(false);
      expect(isStrongPassword('nouppercase123!')).toBe(false);
      expect(isStrongPassword('NOLOWERCASE123!')).toBe(false);
    });
  });

  describe('Email utilities', () => {
    it('should validate email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });

    it('should extract domain from email', () => {
      expect(extractDomainFromEmail('test@example.com')).toBe('example.com');
      expect(extractDomainFromEmail('user@subdomain.example.co.uk')).toBe('subdomain.example.co.uk');
      expect(extractDomainFromEmail('invalid')).toBe('');
    });
  });

  describe('String utilities', () => {
    it('should slugify strings correctly', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
      expect(slugify('Special@#$Characters')).toBe('specialcharacters');
    });

    it('should capitalize strings', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('')).toBe('');
    });

    it('should truncate strings', () => {
      expect(truncate('Short', 10)).toBe('Short');
      expect(truncate('This is a long string', 10)).toBe('This is a...');
      expect(truncate('Exact fit!', 10)).toBe('Exact fit!');
    });
  });

  describe('Formatting utilities', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(0.99)).toBe('$0.99');
      expect(formatCurrency(1234.56, 'EUR', 'fr-FR')).toContain('€');
    });

    it('should format percentages', () => {
      expect(formatPercentage(0.1234)).toBe('12.3%');
      expect(formatPercentage(1)).toBe('100.0%');
      expect(formatPercentage(0.5678, 2)).toBe('56.78%');
    });
  });

  describe('ID generation', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toHaveLength(8);
      expect(id2).toHaveLength(8);
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs of specified length', () => {
      const id = generateId(16);
      expect(id).toHaveLength(16);
    });
  });
});
