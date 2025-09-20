import { CSVParser } from '../csv-parser';
import { ProspectData } from '../types';

describe('CSV Parser', () => {
  let parser: CSVParser;

  beforeEach(() => {
    parser = new CSVParser();
  });

  describe('parseCSV', () => {
    it('should parse valid CSV with headers', async () => {
      const csvContent = `Email,First Name,Last Name,Company,Job Title
john@example.com,John,Doe,Acme Corp,CEO
jane@example.com,Jane,Smith,Tech Inc,CTO`;

      const result = await parser.parseCSV(csvContent);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        company: 'Acme Corp',
        jobTitle: 'CEO'
      });
    });

    it('should handle different delimiters', async () => {
      const csvContent = `Email;First Name;Last Name
john@example.com;John;Doe
jane@example.com;Jane;Smith`;

      const result = await parser.parseCSV(csvContent, { delimiter: ';' });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('should handle quoted fields with commas', async () => {
      const csvContent = `Email,Company,Location
john@example.com,"Acme, Inc.","San Francisco, CA"`;

      const result = await parser.parseCSV(csvContent);

      expect(result.success).toBe(true);
      expect(result.data[0].company).toBe('Acme, Inc.');
      expect(result.data[0].location).toBe('San Francisco, CA');
    });

    it('should skip empty rows', async () => {
      const csvContent = `Email,Name
john@example.com,John


jane@example.com,Jane`;

      const result = await parser.parseCSV(csvContent, { skipEmptyRows: true });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('should handle UTF-8 characters', async () => {
      const csvContent = `Email,Name,Company
jean@example.fr,Jean-François,Société Générale
maria@example.es,María García,Compañía S.A.`;

      const result = await parser.parseCSV(csvContent);

      expect(result.success).toBe(true);
      expect(result.data[0].name).toBe('Jean-François');
      expect(result.data[1].name).toBe('María García');
    });

    it('should detect and report parsing errors', async () => {
      const malformedCSV = `Email,Name
john@example.com,"John`; // Unclosed quote

      const result = await parser.parseCSV(malformedCSV);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors[0]).toContain('quote');
    });
  });

  describe('detectHeaders', () => {
    it('should auto-detect common headers', () => {
      const headers = ['email_address', 'first_name', 'last_name', 'company_name', 'title'];
      const mapping = parser.detectHeaders(headers);

      expect(mapping).toEqual({
        email: 'email_address',
        firstName: 'first_name',
        lastName: 'last_name',
        company: 'company_name',
        jobTitle: 'title'
      });
    });

    it('should handle case variations', () => {
      const headers = ['EMAIL', 'First_Name', 'LAST_NAME', 'Company Name'];
      const mapping = parser.detectHeaders(headers);

      expect(mapping.email).toBe('EMAIL');
      expect(mapping.firstName).toBe('First_Name');
      expect(mapping.lastName).toBe('LAST_NAME');
      expect(mapping.company).toBe('Company Name');
    });

    it('should detect French headers', () => {
      const headers = ['courriel', 'prénom', 'nom', 'entreprise', 'poste'];
      const mapping = parser.detectHeaders(headers);

      expect(mapping.email).toBe('courriel');
      expect(mapping.firstName).toBe('prénom');
      expect(mapping.lastName).toBe('nom');
      expect(mapping.company).toBe('entreprise');
      expect(mapping.jobTitle).toBe('poste');
    });
  });

  describe('validateProspects', () => {
    it('should validate email format', () => {
      const prospects: ProspectData[] = [
        { email: 'valid@example.com', company: { name: 'Test' } },
        { email: 'invalid-email', company: { name: 'Test' } },
        { email: '', company: { name: 'Test' } }
      ];

      const result = parser.validateProspects(prospects);

      expect(result.valid).toHaveLength(1);
      expect(result.invalid).toHaveLength(2);
      expect(result.errors[1]).toContain('Invalid email');
      expect(result.errors[2]).toContain('Email required');
    });

    it('should require company name', () => {
      const prospects: ProspectData[] = [
        { email: 'test@example.com', company: { name: 'Test' } },
        { email: 'test2@example.com', company: { name: '' } },
        { email: 'test3@example.com', company: null }
      ];

      const result = parser.validateProspects(prospects);

      expect(result.valid).toHaveLength(1);
      expect(result.invalid).toHaveLength(2);
      expect(result.errors).toContain('Company name required');
    });

    it('should detect duplicates', () => {
      const prospects: ProspectData[] = [
        { email: 'test@example.com', company: { name: 'Test' } },
        { email: 'test@example.com', company: { name: 'Different' } },
        { email: 'unique@example.com', company: { name: 'Unique' } }
      ];

      const result = parser.validateProspects(prospects);

      expect(result.valid).toHaveLength(2);
      expect(result.duplicates).toHaveLength(1);
      expect(result.duplicates[0]).toBe('test@example.com');
    });
  });

  describe('normalizeData', () => {
    it('should normalize prospect data', () => {
      const raw = {
        email: '  JOHN@EXAMPLE.COM  ',
        firstName: 'john',
        lastName: 'DOE',
        company: '  Acme Corp  ',
        phone: '1-234-567-8900',
        linkedin: 'linkedin.com/in/johndoe'
      };

      const normalized = parser.normalizeProspect(raw);

      expect(normalized.email).toBe('john@example.com');
      expect(normalized.firstName).toBe('John');
      expect(normalized.lastName).toBe('Doe');
      expect(normalized.company.name).toBe('Acme Corp');
      expect(normalized.phone).toBe('+12345678900');
      expect(normalized.linkedinUrl).toBe('https://linkedin.com/in/johndoe');
    });

    it('should extract domain from email', () => {
      const raw = {
        email: 'john@company.com',
        company: 'Company Inc'
      };

      const normalized = parser.normalizeProspect(raw);

      expect(normalized.company.domain).toBe('company.com');
    });

    it('should handle missing optional fields', () => {
      const raw = {
        email: 'john@example.com',
        company: 'Test'
      };

      const normalized = parser.normalizeProspect(raw);

      expect(normalized.email).toBe('john@example.com');
      expect(normalized.company.name).toBe('Test');
      expect(normalized.firstName).toBeUndefined();
      expect(normalized.lastName).toBeUndefined();
    });
  });

  describe('enrichData', () => {
    it('should infer company size from employee count', () => {
      const prospects = [
        { email: 'test@example.com', company: { name: 'Small Co', employees: 25 } },
        { email: 'test2@example.com', company: { name: 'Medium Co', employees: 150 } },
        { email: 'test3@example.com', company: { name: 'Large Co', employees: 5000 } }
      ];

      const enriched = parser.enrichProspects(prospects);

      expect(enriched[0].company.size).toBe('small');
      expect(enriched[1].company.size).toBe('medium');
      expect(enriched[2].company.size).toBe('enterprise');
    });

    it('should infer industry from keywords', () => {
      const prospects = [
        { email: 'test@example.com', company: { name: 'AI Solutions Inc' } },
        { email: 'test2@example.com', company: { name: 'FinTech Innovations' } },
        { email: 'test3@example.com', company: { name: 'Healthcare Systems' } }
      ];

      const enriched = parser.enrichProspects(prospects);

      expect(enriched[0].company.industry).toContain('Technology');
      expect(enriched[1].company.industry).toContain('Finance');
      expect(enriched[2].company.industry).toContain('Healthcare');
    });
  });
});
