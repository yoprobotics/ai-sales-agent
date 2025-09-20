// Deduplicator for detecting and handling duplicate prospects
import { createHash } from 'crypto';
import {
  extractDomainFromEmail,
  isValidEmail
} from '@ai-sales-agent/core';

// Duplicate detection strategies
export enum DuplicateStrategy {
  EXACT = 'exact',           // Exact email match
  DOMAIN = 'domain',         // Same email domain + similar name
  FUZZY = 'fuzzy',          // Fuzzy matching on multiple fields
  COMPANY = 'company',       // Same company + similar name/role
  STRICT = 'strict'          // Multiple fields must match
}

// Deduplication options
export interface DeduplicationOptions {
  strategy?: DuplicateStrategy;
  threshold?: number; // Similarity threshold for fuzzy matching (0-1)
  compareFields?: string[]; // Fields to compare
  ignoreCase?: boolean;
  ignoreDiacritics?: boolean;
  checkExisting?: boolean; // Check against existing database
}

// Duplicate result
export interface DuplicateResult {
  isDuplicate: boolean;
  confidence: number; // 0-1 confidence score
  matchedWith?: any; // The record it matched with
  matchType?: string; // Type of match (email, name, company, etc.)
  hash?: string; // Unique hash for the record
}

// Batch deduplication result
export interface BatchDeduplicationResult {
  unique: any[];
  duplicates: Array<{
    record: any;
    matchedWith: any;
    confidence: number;
    matchType: string;
  }>;
  stats: {
    total: number;
    unique: number;
    duplicates: number;
    duplicateRate: number;
  };
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

// Calculate similarity between two strings (0-1)
function stringSimilarity(str1: string, str2: string, ignoreCase = true): number {
  if (!str1 || !str2) return 0;
  
  const s1 = ignoreCase ? str1.toLowerCase() : str1;
  const s2 = ignoreCase ? str2.toLowerCase() : str2;
  
  if (s1 === s2) return 1;
  
  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  
  return 1 - (distance / maxLength);
}

// Remove diacritics from string
function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Generate hash for a prospect record
export function generateProspectHash(prospect: any): string {
  const normalized = {
    email: prospect.email?.toLowerCase().trim(),
    firstName: prospect.firstName?.toLowerCase().trim(),
    lastName: prospect.lastName?.toLowerCase().trim(),
    company: prospect.company?.name?.toLowerCase().trim() || prospect.companyName?.toLowerCase().trim()
  };
  
  const hashString = JSON.stringify(normalized);
  return createHash('sha256').update(hashString).digest('hex');
}

// Check if two emails are similar (same person, different email)
function areEmailsSimilar(email1: string, email2: string): boolean {
  if (!isValidEmail(email1) || !isValidEmail(email2)) return false;
  
  const [local1, domain1] = email1.split('@');
  const [local2, domain2] = email2.split('@');
  
  // Same domain, similar local part
  if (domain1 === domain2) {
    const similarity = stringSimilarity(local1, local2);
    return similarity > 0.8;
  }
  
  // Different domain, but same local part (person changed companies)
  if (local1 === local2) {
    return true;
  }
  
  return false;
}

// Check if two names are similar
function areNamesSimilar(
  name1: { firstName?: string; lastName?: string },
  name2: { firstName?: string; lastName?: string },
  threshold = 0.8
): boolean {
  if (!name1.firstName && !name2.firstName) return false;
  
  const firstNameSimilarity = stringSimilarity(
    name1.firstName || '',
    name2.firstName || ''
  );
  
  const lastNameSimilarity = stringSimilarity(
    name1.lastName || '',
    name2.lastName || ''
  );
  
  // Both names must be similar
  if (name1.lastName && name2.lastName) {
    return firstNameSimilarity > threshold && lastNameSimilarity > threshold;
  }
  
  // Only first name available
  return firstNameSimilarity > threshold;
}

// Check if two companies are similar
function areCompaniesSimilar(
  company1: string | { name?: string },
  company2: string | { name?: string },
  threshold = 0.8
): boolean {
  const name1 = typeof company1 === 'string' ? company1 : company1?.name;
  const name2 = typeof company2 === 'string' ? company2 : company2?.name;
  
  if (!name1 || !name2) return false;
  
  // Remove common suffixes for comparison
  const suffixes = /\b(inc|llc|ltd|corp|corporation|company|co|gmbh|ag|sa)\b\.?$/gi;
  const clean1 = name1.replace(suffixes, '').trim();
  const clean2 = name2.replace(suffixes, '').trim();
  
  return stringSimilarity(clean1, clean2) > threshold;
}

// Exact duplicate detection
function detectExactDuplicate(
  prospect1: any,
  prospect2: any,
  options: DeduplicationOptions
): DuplicateResult {
  const email1 = options.ignoreCase 
    ? prospect1.email?.toLowerCase() 
    : prospect1.email;
  const email2 = options.ignoreCase 
    ? prospect2.email?.toLowerCase() 
    : prospect2.email;
  
  if (email1 && email2 && email1 === email2) {
    return {
      isDuplicate: true,
      confidence: 1,
      matchedWith: prospect2,
      matchType: 'email'
    };
  }
  
  return {
    isDuplicate: false,
    confidence: 0
  };
}

// Domain-based duplicate detection
function detectDomainDuplicate(
  prospect1: any,
  prospect2: any,
  options: DeduplicationOptions
): DuplicateResult {
  if (!prospect1.email || !prospect2.email) {
    return { isDuplicate: false, confidence: 0 };
  }
  
  const domain1 = extractDomainFromEmail(prospect1.email);
  const domain2 = extractDomainFromEmail(prospect2.email);
  
  if (domain1 !== domain2) {
    return { isDuplicate: false, confidence: 0 };
  }
  
  // Same domain, check if names are similar
  const namesSimilar = areNamesSimilar(
    { firstName: prospect1.firstName, lastName: prospect1.lastName },
    { firstName: prospect2.firstName, lastName: prospect2.lastName },
    options.threshold || 0.8
  );
  
  if (namesSimilar) {
    return {
      isDuplicate: true,
      confidence: 0.85,
      matchedWith: prospect2,
      matchType: 'domain+name'
    };
  }
  
  return { isDuplicate: false, confidence: 0 };
}

// Company-based duplicate detection
function detectCompanyDuplicate(
  prospect1: any,
  prospect2: any,
  options: DeduplicationOptions
): DuplicateResult {
  const company1 = prospect1.company?.name || prospect1.companyName;
  const company2 = prospect2.company?.name || prospect2.companyName;
  
  if (!company1 || !company2) {
    return { isDuplicate: false, confidence: 0 };
  }
  
  const companiesSimilar = areCompaniesSimilar(
    company1,
    company2,
    options.threshold || 0.8
  );
  
  if (!companiesSimilar) {
    return { isDuplicate: false, confidence: 0 };
  }
  
  // Same company, check other fields
  const namesSimilar = areNamesSimilar(
    { firstName: prospect1.firstName, lastName: prospect1.lastName },
    { firstName: prospect2.firstName, lastName: prospect2.lastName },
    options.threshold || 0.7 // Lower threshold since company matches
  );
  
  // Check job title similarity
  const jobTitleSimilarity = stringSimilarity(
    prospect1.jobTitle || '',
    prospect2.jobTitle || '',
    true
  );
  
  if (namesSimilar && jobTitleSimilarity > 0.7) {
    return {
      isDuplicate: true,
      confidence: 0.9,
      matchedWith: prospect2,
      matchType: 'company+name+role'
    };
  }
  
  if (namesSimilar) {
    return {
      isDuplicate: true,
      confidence: 0.75,
      matchedWith: prospect2,
      matchType: 'company+name'
    };
  }
  
  return { isDuplicate: false, confidence: 0 };
}

// Fuzzy duplicate detection
function detectFuzzyDuplicate(
  prospect1: any,
  prospect2: any,
  options: DeduplicationOptions
): DuplicateResult {
  const threshold = options.threshold || 0.7;
  let totalScore = 0;
  let fieldCount = 0;
  let matchTypes: string[] = [];
  
  // Email similarity
  if (prospect1.email && prospect2.email) {
    if (areEmailsSimilar(prospect1.email, prospect2.email)) {
      totalScore += 1;
      matchTypes.push('email');
    }
    fieldCount++;
  }
  
  // Name similarity
  if (prospect1.firstName || prospect1.lastName) {
    if (areNamesSimilar(
      { firstName: prospect1.firstName, lastName: prospect1.lastName },
      { firstName: prospect2.firstName, lastName: prospect2.lastName },
      threshold
    )) {
      totalScore += 0.8;
      matchTypes.push('name');
    }
    fieldCount++;
  }
  
  // Company similarity
  const company1 = prospect1.company?.name || prospect1.companyName;
  const company2 = prospect2.company?.name || prospect2.companyName;
  if (company1 && company2) {
    if (areCompaniesSimilar(company1, company2, threshold)) {
      totalScore += 0.7;
      matchTypes.push('company');
    }
    fieldCount++;
  }
  
  // Job title similarity
  if (prospect1.jobTitle && prospect2.jobTitle) {
    const similarity = stringSimilarity(prospect1.jobTitle, prospect2.jobTitle, true);
    if (similarity > threshold) {
      totalScore += 0.5 * similarity;
      matchTypes.push('jobTitle');
    }
    fieldCount++;
  }
  
  // LinkedIn URL match
  if (prospect1.linkedinUrl && prospect2.linkedinUrl) {
    if (prospect1.linkedinUrl === prospect2.linkedinUrl) {
      totalScore += 1;
      matchTypes.push('linkedin');
    }
    fieldCount++;
  }
  
  // Phone match
  if (prospect1.phone && prospect2.phone) {
    const phone1 = prospect1.phone.replace(/\D/g, '');
    const phone2 = prospect2.phone.replace(/\D/g, '');
    if (phone1 === phone2) {
      totalScore += 0.8;
      matchTypes.push('phone');
    }
    fieldCount++;
  }
  
  const confidence = fieldCount > 0 ? totalScore / fieldCount : 0;
  
  return {
    isDuplicate: confidence >= threshold,
    confidence,
    matchedWith: confidence >= threshold ? prospect2 : undefined,
    matchType: matchTypes.join('+')
  };
}

// Strict duplicate detection (multiple fields must match exactly)
function detectStrictDuplicate(
  prospect1: any,
  prospect2: any,
  options: DeduplicationOptions
): DuplicateResult {
  const requiredMatches = 3; // At least 3 fields must match
  let matches = 0;
  let matchTypes: string[] = [];
  
  // Email match
  if (prospect1.email && prospect2.email) {
    const email1 = options.ignoreCase ? prospect1.email.toLowerCase() : prospect1.email;
    const email2 = options.ignoreCase ? prospect2.email.toLowerCase() : prospect2.email;
    if (email1 === email2) {
      matches++;
      matchTypes.push('email');
    }
  }
  
  // First name match
  if (prospect1.firstName && prospect2.firstName) {
    const name1 = options.ignoreCase ? prospect1.firstName.toLowerCase() : prospect1.firstName;
    const name2 = options.ignoreCase ? prospect2.firstName.toLowerCase() : prospect2.firstName;
    if (name1 === name2) {
      matches++;
      matchTypes.push('firstName');
    }
  }
  
  // Last name match
  if (prospect1.lastName && prospect2.lastName) {
    const name1 = options.ignoreCase ? prospect1.lastName.toLowerCase() : prospect1.lastName;
    const name2 = options.ignoreCase ? prospect2.lastName.toLowerCase() : prospect2.lastName;
    if (name1 === name2) {
      matches++;
      matchTypes.push('lastName');
    }
  }
  
  // Company match
  const company1 = prospect1.company?.name || prospect1.companyName;
  const company2 = prospect2.company?.name || prospect2.companyName;
  if (company1 && company2) {
    const comp1 = options.ignoreCase ? company1.toLowerCase() : company1;
    const comp2 = options.ignoreCase ? company2.toLowerCase() : company2;
    if (comp1 === comp2) {
      matches++;
      matchTypes.push('company');
    }
  }
  
  // Job title match
  if (prospect1.jobTitle && prospect2.jobTitle) {
    const title1 = options.ignoreCase ? prospect1.jobTitle.toLowerCase() : prospect1.jobTitle;
    const title2 = options.ignoreCase ? prospect2.jobTitle.toLowerCase() : prospect2.jobTitle;
    if (title1 === title2) {
      matches++;
      matchTypes.push('jobTitle');
    }
  }
  
  const isDuplicate = matches >= requiredMatches;
  
  return {
    isDuplicate,
    confidence: isDuplicate ? matches / 5 : 0, // 5 possible fields
    matchedWith: isDuplicate ? prospect2 : undefined,
    matchType: matchTypes.join('+')
  };
}

// Main duplicate detection function
export function detectDuplicate(
  prospect1: any,
  prospect2: any,
  options: DeduplicationOptions = {}
): DuplicateResult {
  const strategy = options.strategy || DuplicateStrategy.EXACT;
  
  // Apply diacritics removal if requested
  if (options.ignoreDiacritics) {
    prospect1 = {
      ...prospect1,
      email: prospect1.email ? removeDiacritics(prospect1.email) : undefined,
      firstName: prospect1.firstName ? removeDiacritics(prospect1.firstName) : undefined,
      lastName: prospect1.lastName ? removeDiacritics(prospect1.lastName) : undefined
    };
    prospect2 = {
      ...prospect2,
      email: prospect2.email ? removeDiacritics(prospect2.email) : undefined,
      firstName: prospect2.firstName ? removeDiacritics(prospect2.firstName) : undefined,
      lastName: prospect2.lastName ? removeDiacritics(prospect2.lastName) : undefined
    };
  }
  
  switch (strategy) {
    case DuplicateStrategy.EXACT:
      return detectExactDuplicate(prospect1, prospect2, options);
    
    case DuplicateStrategy.DOMAIN:
      return detectDomainDuplicate(prospect1, prospect2, options);
    
    case DuplicateStrategy.COMPANY:
      return detectCompanyDuplicate(prospect1, prospect2, options);
    
    case DuplicateStrategy.FUZZY:
      return detectFuzzyDuplicate(prospect1, prospect2, options);
    
    case DuplicateStrategy.STRICT:
      return detectStrictDuplicate(prospect1, prospect2, options);
    
    default:
      return detectExactDuplicate(prospect1, prospect2, options);
  }
}

// Batch deduplication
export function deduplicateBatch(
  prospects: any[],
  options: DeduplicationOptions = {}
): BatchDeduplicationResult {
  const unique: any[] = [];
  const duplicates: any[] = [];
  const seen = new Map<string, any>();
  
  for (const prospect of prospects) {
    let isDuplicate = false;
    let duplicateInfo: any = null;
    
    // Check against already processed unique records
    for (const [hash, existing] of seen.entries()) {
      const result = detectDuplicate(prospect, existing, options);
      
      if (result.isDuplicate) {
        isDuplicate = true;
        duplicateInfo = {
          record: prospect,
          matchedWith: existing,
          confidence: result.confidence,
          matchType: result.matchType || 'unknown'
        };
        break;
      }
    }
    
    if (isDuplicate) {
      duplicates.push(duplicateInfo);
    } else {
      const hash = generateProspectHash(prospect);
      seen.set(hash, prospect);
      unique.push(prospect);
    }
  }
  
  const total = prospects.length;
  const uniqueCount = unique.length;
  const duplicateCount = duplicates.length;
  
  return {
    unique,
    duplicates,
    stats: {
      total,
      unique: uniqueCount,
      duplicates: duplicateCount,
      duplicateRate: total > 0 ? duplicateCount / total : 0
    }
  };
}

// Find all duplicates within a batch (including groups)
export function findDuplicateGroups(
  prospects: any[],
  options: DeduplicationOptions = {}
): Map<string, any[]> {
  const groups = new Map<string, any[]>();
  
  for (let i = 0; i < prospects.length; i++) {
    let addedToGroup = false;
    
    // Check if this prospect matches any existing group
    for (const [groupId, groupMembers] of groups.entries()) {
      const result = detectDuplicate(prospects[i], groupMembers[0], options);
      
      if (result.isDuplicate) {
        groupMembers.push(prospects[i]);
        addedToGroup = true;
        break;
      }
    }
    
    // If not added to any group, create a new group
    if (!addedToGroup) {
      const groupId = generateProspectHash(prospects[i]);
      groups.set(groupId, [prospects[i]]);
    }
  }
  
  // Filter out groups with only one member (not duplicates)
  const duplicateGroups = new Map<string, any[]>();
  for (const [groupId, members] of groups.entries()) {
    if (members.length > 1) {
      duplicateGroups.set(groupId, members);
    }
  }
  
  return duplicateGroups;
}

// Merge duplicate prospects into a single record
export function mergeDuplicates(duplicates: any[]): any {
  if (duplicates.length === 0) return null;
  if (duplicates.length === 1) return duplicates[0];
  
  // Start with the most complete record (most non-null fields)
  const sorted = [...duplicates].sort((a, b) => {
    const countFields = (obj: any): number => {
      return Object.values(obj).filter(v => v != null).length;
    };
    return countFields(b) - countFields(a);
  });
  
  const merged = { ...sorted[0] };
  
  // Merge fields from other records
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    
    // Merge simple fields (take non-null values)
    for (const field of ['firstName', 'lastName', 'jobTitle', 'phone', 'linkedinUrl', 'websiteUrl', 'notes']) {
      if (!merged[field] && current[field]) {
        merged[field] = current[field];
      }
    }
    
    // Merge company data
    if (current.company) {
      merged.company = merged.company || {};
      for (const field of ['name', 'domain', 'industry', 'size', 'revenue', 'location', 'employees', 'founded']) {
        if (!merged.company[field] && current.company[field]) {
          merged.company[field] = current.company[field];
        }
      }
    }
    
    // Merge custom fields
    if (current.customFields) {
      merged.customFields = { ...merged.customFields, ...current.customFields };
    }
  }
  
  return merged;
}
