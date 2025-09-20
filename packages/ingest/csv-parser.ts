// CSV Parser with intelligent column mapping and validation
import Papa from 'papaparse';
import { z } from 'zod';
import { 
  ProspectCreateSchema,
  ProspectCompanySchema,
  ValidationError,
  isValidEmail,
  extractDomainFromEmail,
  truncate,
  capitalize
} from '@ai-sales-agent/core';

// Column mapping types
export interface ColumnMapping {
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string; // Can be split into firstName/lastName
  jobTitle?: string;
  companyName: string;
  companyDomain?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  phone?: string;
  notes?: string;
  [key: string]: string | undefined; // Allow custom fields
}

// CSV parsing options
export interface CSVParseOptions {
  delimiter?: string;
  encoding?: string;
  maxRows?: number;
  skipEmptyRows?: boolean;
  trimValues?: boolean;
  validateEmail?: boolean;
  detectDuplicates?: boolean;
  icpId: string;
}

// Parsed result
export interface ParsedProspect {
  email: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  company: {
    name: string;
    domain?: string;
    industry?: string;
    size?: string;
    location?: string;
  };
  linkedinUrl?: string;
  websiteUrl?: string;
  phone?: string;
  notes?: string;
  customFields: Record<string, any>;
  isValid: boolean;
  errors?: string[];
}

export interface CSVParseResult {
  success: boolean;
  prospects: ParsedProspect[];
  duplicates: string[];
  invalidRows: Array<{ row: number; errors: string[] }>;
  stats: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    duplicateRows: number;
  };
  suggestedMapping?: Partial<ColumnMapping>;
}

// Column detection patterns for intelligent mapping
const COLUMN_PATTERNS = {
  email: /email|mail|contact|e-mail/i,
  firstName: /first[\s_-]?name|prenom|fname|given[\s_-]?name/i,
  lastName: /last[\s_-]?name|nom|lname|family[\s_-]?name|surname/i,
  fullName: /full[\s_-]?name|name|nom[\s_-]?complet|contact[\s_-]?name/i,
  jobTitle: /title|job|position|role|poste|fonction/i,
  companyName: /company|organisation|organization|entreprise|societe|firm/i,
  companyDomain: /domain|website|site|url|web/i,
  industry: /industry|sector|secteur|industrie|vertical/i,
  companySize: /size|employees|effectif|taille|headcount/i,
  location: /location|city|country|address|ville|pays|region/i,
  linkedinUrl: /linkedin|profile/i,
  phone: /phone|telephone|tel|mobile|cell/i,
  notes: /notes|comments|description|remarques/i,
};

// Smart column detection
export function detectColumnMapping(headers: string[]): Partial<ColumnMapping> {
  const mapping: Partial<ColumnMapping> = {};
  
  headers.forEach((header) => {
    const normalizedHeader = header.trim().toLowerCase();
    
    for (const [field, pattern] of Object.entries(COLUMN_PATTERNS)) {
      if (pattern.test(normalizedHeader)) {
        mapping[field as keyof ColumnMapping] = header;
        break;
      }
    }
  });
  
  return mapping;
}

// Parse name into firstName and lastName
function parseFullName(fullName: string): { firstName?: string; lastName?: string } {
  if (!fullName) return {};
  
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return { firstName: parts[0] };
  }
  
  if (parts.length === 2) {
    return { firstName: parts[0], lastName: parts[1] };
  }
  
  // For 3+ parts, assume first is firstName, rest is lastName
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
}

// Normalize company size
function normalizeCompanySize(size: string | undefined): string | undefined {
  if (!size) return undefined;
  
  const normalized = size.toLowerCase().trim();
  
  if (normalized.includes('startup') || /1-10|<10/.test(normalized)) {
    return 'startup';
  }
  if (/11-50|10-50|small/.test(normalized)) {
    return 'small';
  }
  if (/51-200|50-200|medium|mid/.test(normalized)) {
    return 'medium';
  }
  if (/201-1000|200-1000|large/.test(normalized)) {
    return 'large';
  }
  if (/1000\+|>1000|enterprise/.test(normalized)) {
    return 'enterprise';
  }
  
  // Try to parse as number
  const num = parseInt(normalized.replace(/[^\d]/g, ''));
  if (!isNaN(num)) {
    if (num <= 10) return 'startup';
    if (num <= 50) return 'small';
    if (num <= 200) return 'medium';
    if (num <= 1000) return 'large';
    return 'enterprise';
  }
  
  return undefined;
}

// Clean and validate URL
function cleanUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  let cleaned = url.trim();
  
  // Add https:// if missing
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  
  // Validate URL
  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    return undefined;
  }
}

// Clean phone number
function cleanPhoneNumber(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  
  // Remove all non-digit characters except + at the beginning
  const cleaned = phone.replace(/[^\d+]/g, '').replace(/\+(?!\d)/g, '');
  
  // Basic validation: should have at least 7 digits
  if (cleaned.replace(/\D/g, '').length >= 7) {
    return cleaned;
  }
  
  return undefined;
}

// Parse a single row
function parseRow(
  row: any,
  mapping: ColumnMapping,
  options: CSVParseOptions
): ParsedProspect {
  const errors: string[] = [];
  const customFields: Record<string, any> = {};
  
  // Extract email (required)
  const email = row[mapping.email]?.toString().trim().toLowerCase();
  if (!email) {
    errors.push('Email is required');
  } else if (options.validateEmail && !isValidEmail(email)) {
    errors.push('Invalid email format');
  }
  
  // Extract name
  let firstName: string | undefined;
  let lastName: string | undefined;
  
  if (mapping.fullName && row[mapping.fullName]) {
    const parsed = parseFullName(row[mapping.fullName]);
    firstName = parsed.firstName;
    lastName = parsed.lastName;
  } else {
    firstName = row[mapping.firstName]?.toString().trim();
    lastName = row[mapping.lastName]?.toString().trim();
  }
  
  // Capitalize names
  if (firstName) firstName = capitalize(firstName);
  if (lastName) lastName = capitalize(lastName);
  
  // Extract company (required)
  const companyName = row[mapping.companyName]?.toString().trim();
  if (!companyName) {
    errors.push('Company name is required');
  }
  
  // Extract company domain (or derive from email)
  let companyDomain = row[mapping.companyDomain]?.toString().trim();
  if (!companyDomain && email && isValidEmail(email)) {
    const emailDomain = extractDomainFromEmail(email);
    // Only use email domain if it's not a common provider
    const commonProviders = ['gmail.', 'yahoo.', 'outlook.', 'hotmail.', 'icloud.'];
    if (!commonProviders.some(p => emailDomain.includes(p))) {
      companyDomain = emailDomain;
    }
  }
  companyDomain = cleanUrl(companyDomain);
  
  // Extract other fields
  const jobTitle = row[mapping.jobTitle]?.toString().trim();
  const industry = row[mapping.industry]?.toString().trim();
  const companySize = normalizeCompanySize(row[mapping.companySize]);
  const location = row[mapping.location]?.toString().trim();
  const linkedinUrl = cleanUrl(row[mapping.linkedinUrl]);
  const websiteUrl = cleanUrl(row[mapping.websiteUrl || mapping.companyDomain]);
  const phone = cleanPhoneNumber(row[mapping.phone]);
  const notes = row[mapping.notes]?.toString().trim();
  
  // Collect custom fields (fields not in the standard mapping)
  Object.keys(row).forEach(key => {
    if (!Object.values(mapping).includes(key)) {
      const value = row[key];
      if (value !== null && value !== undefined && value !== '') {
        customFields[key] = value;
      }
    }
  });
  
  return {
    email: email || '',
    firstName,
    lastName,
    jobTitle,
    company: {
      name: companyName || '',
      domain: companyDomain,
      industry,
      size: companySize,
      location
    },
    linkedinUrl,
    websiteUrl,
    phone,
    notes: notes ? truncate(notes, 2000) : undefined,
    customFields,
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

// Main CSV parsing function
export async function parseCSV(
  fileContent: string | File,
  mapping: ColumnMapping,
  options: CSVParseOptions = { icpId: '' }
): Promise<CSVParseResult> {
  return new Promise((resolve, reject) => {
    const config: Papa.ParseConfig = {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: options.skipEmptyRows !== false,
      delimitersToGuess: [',', '\t', ';', '|', '^'],
      complete: (results) => {
        if (results.errors.length > 0) {
          // Handle Papa parse errors
          const error = results.errors[0];
          reject(new ValidationError(`CSV parsing error: ${error.message}`));
          return;
        }
        
        const data = results.data as any[];
        const prospects: ParsedProspect[] = [];
        const duplicates: string[] = [];
        const invalidRows: Array<{ row: number; errors: string[] }> = [];
        const seenEmails = new Set<string>();
        
        // Process each row
        data.forEach((row, index) => {
          // Skip if max rows reached
          if (options.maxRows && prospects.length >= options.maxRows) {
            return;
          }
          
          // Trim values if requested
          if (options.trimValues !== false) {
            Object.keys(row).forEach(key => {
              if (typeof row[key] === 'string') {
                row[key] = row[key].trim();
              }
            });
          }
          
          // Parse the row
          const parsed = parseRow(row, mapping, options);
          
          // Check for duplicates
          if (options.detectDuplicates !== false && parsed.email) {
            if (seenEmails.has(parsed.email)) {
              duplicates.push(parsed.email);
              return;
            }
            seenEmails.add(parsed.email);
          }
          
          // Add to results
          if (parsed.isValid) {
            prospects.push(parsed);
          } else {
            invalidRows.push({
              row: index + 2, // +2 for header and 0-index
              errors: parsed.errors || []
            });
          }
        });
        
        resolve({
          success: true,
          prospects,
          duplicates,
          invalidRows,
          stats: {
            totalRows: data.length,
            validRows: prospects.length,
            invalidRows: invalidRows.length,
            duplicateRows: duplicates.length
          }
        });
      },
      error: (error) => {
        reject(new ValidationError(`CSV parsing failed: ${error.message}`));
      }
    };
    
    if (typeof fileContent === 'string') {
      Papa.parse(fileContent, config);
    } else {
      Papa.parse(fileContent, config);
    }
  });
}

// Helper to suggest column mapping from headers
export async function suggestColumnMapping(
  fileContent: string | File
): Promise<Partial<ColumnMapping>> {
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      preview: 1, // Only need headers
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new ValidationError('Failed to read CSV headers'));
          return;
        }
        
        const headers = results.meta.fields || [];
        const mapping = detectColumnMapping(headers);
        resolve(mapping);
      },
      error: (error) => {
        reject(new ValidationError(`Failed to read CSV: ${error.message}`));
      }
    });
  });
}

// Validate parsed prospects against schema
export function validateProspects(
  prospects: ParsedProspect[],
  icpId: string
): Array<z.infer<typeof ProspectCreateSchema>> {
  const validated: Array<z.infer<typeof ProspectCreateSchema>> = [];
  
  prospects.forEach(prospect => {
    try {
      const validatedProspect = ProspectCreateSchema.parse({
        email: prospect.email,
        firstName: prospect.firstName,
        lastName: prospect.lastName,
        jobTitle: prospect.jobTitle,
        company: {
          name: prospect.company.name,
          domain: prospect.company.domain,
          industry: prospect.company.industry,
          size: prospect.company.size,
          location: prospect.company.location
        },
        linkedinUrl: prospect.linkedinUrl,
        websiteUrl: prospect.websiteUrl,
        phone: prospect.phone,
        notes: prospect.notes,
        icpId,
        source: 'csv_import',
        customFields: prospect.customFields
      });
      
      validated.push(validatedProspect);
    } catch (error) {
      // Skip invalid prospects (already reported in parseRow)
    }
  });
  
  return validated;
}
