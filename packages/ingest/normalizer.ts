// Data normalizer for cleaning and standardizing prospect data
import {
  capitalize,
  isValidEmail,
  isValidUrl,
  addHttpsToUrl,
  extractDomainFromEmail,
  extractDomainFromUrl
} from '@ai-sales-agent/core';

// Normalization options
export interface NormalizationOptions {
  trimWhitespace?: boolean;
  lowercaseEmails?: boolean;
  capitalizeNames?: boolean;
  standardizePhones?: boolean;
  cleanUrls?: boolean;
  removeSpecialChars?: boolean;
  standardizeDates?: boolean;
  defaultCountryCode?: string; // For phone numbers
  locale?: string; // For date/number formatting
}

// Normalized prospect data
export interface NormalizedProspectData {
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  jobTitle?: string;
  company: {
    name: string;
    domain?: string;
    industry?: string;
    size?: string;
    revenue?: string;
    location?: string;
    employees?: number;
    founded?: number;
  };
  linkedinUrl?: string;
  websiteUrl?: string;
  phone?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  customFields?: Record<string, any>;
}

// Common name prefixes and suffixes to handle
const NAME_TITLES = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof', 'Sir', 'Madam'];
const NAME_SUFFIXES = ['Jr', 'Sr', 'II', 'III', 'IV', 'PhD', 'MD', 'MBA', 'Esq'];

// Common company suffixes to standardize
const COMPANY_SUFFIXES = {
  'incorporated': 'Inc.',
  'inc': 'Inc.',
  'corporation': 'Corp.',
  'corp': 'Corp.',
  'company': 'Co.',
  'co': 'Co.',
  'limited': 'Ltd.',
  'ltd': 'Ltd.',
  'llc': 'LLC',
  'llp': 'LLP',
  'lp': 'LP',
  'plc': 'PLC',
  'gmbh': 'GmbH',
  'ag': 'AG',
  'sa': 'SA',
  'sas': 'SAS',
  'sarl': 'SARL',
  'bv': 'BV',
  'nv': 'NV',
};

// Industry standardization mapping
const INDUSTRY_MAPPING: Record<string, string> = {
  'tech': 'Technology',
  'it': 'Technology',
  'software': 'Technology',
  'saas': 'Technology',
  'fintech': 'Finance',
  'banking': 'Finance',
  'insurance': 'Finance',
  'healthtech': 'Healthcare',
  'medical': 'Healthcare',
  'pharma': 'Healthcare',
  'biotech': 'Healthcare',
  'edtech': 'Education',
  'e-learning': 'Education',
  'ecommerce': 'Retail',
  'e-commerce': 'Retail',
  'retail': 'Retail',
  'realestate': 'Real Estate',
  'real-estate': 'Real Estate',
  'property': 'Real Estate',
};

// Company size standardization
const SIZE_MAPPING: Record<string, string> = {
  'micro': 'startup',
  'small business': 'small',
  'smb': 'small',
  'mid-market': 'medium',
  'midmarket': 'medium',
  'mid-size': 'medium',
  'large enterprise': 'enterprise',
  'corporate': 'enterprise',
  'multinational': 'enterprise',
};

// Revenue range standardization
const REVENUE_MAPPING: Record<string, string> = {
  '<$1M': 'under_1m',
  'under $1M': 'under_1m',
  '$1M-$10M': '1m_10m',
  '$1-10M': '1m_10m',
  '$10M-$50M': '10m_50m',
  '$10-50M': '10m_50m',
  '$50M-$100M': '50m_100m',
  '$50-100M': '50m_100m',
  '>$100M': 'over_100m',
  'over $100M': 'over_100m',
  '$100M+': 'over_100m',
};

// Normalize email address
export function normalizeEmail(email: string, options: NormalizationOptions = {}): string {
  let normalized = email.trim();
  
  if (options.lowercaseEmails !== false) {
    normalized = normalized.toLowerCase();
  }
  
  // Remove any mailto: prefix
  normalized = normalized.replace(/^mailto:/i, '');
  
  // Remove any brackets or quotes
  normalized = normalized.replace(/[<>'"]/g, '');
  
  // Validate the email
  if (!isValidEmail(normalized)) {
    throw new Error(`Invalid email format: ${email}`);
  }
  
  return normalized;
}

// Normalize person name
export function normalizeName(
  name: string,
  options: NormalizationOptions = {}
): string {
  if (!name) return '';
  
  let normalized = name;
  
  // Trim whitespace
  if (options.trimWhitespace !== false) {
    normalized = normalized.trim();
  }
  
  // Remove special characters if requested
  if (options.removeSpecialChars) {
    normalized = normalized.replace(/[^\w\s'-]/g, '');
  }
  
  // Remove titles and suffixes
  NAME_TITLES.forEach(title => {
    const regex = new RegExp(`^${title}\\.?\\s+`, 'i');
    normalized = normalized.replace(regex, '');
  });
  
  NAME_SUFFIXES.forEach(suffix => {
    const regex = new RegExp(`\\s+${suffix}\\.?$`, 'i');
    normalized = normalized.replace(regex, '');
  });
  
  // Capitalize if requested
  if (options.capitalizeNames !== false) {
    normalized = normalized
      .split(' ')
      .map(part => capitalize(part))
      .join(' ');
  }
  
  // Handle special name formats
  normalized = normalized
    .replace(/\bMc([a-z])/g, (match, p1) => 'Mc' + p1.toUpperCase())
    .replace(/\bMac([a-z])/g, (match, p1) => 'Mac' + p1.toUpperCase())
    .replace(/\bO'([a-z])/g, (match, p1) => "O'" + p1.toUpperCase());
  
  return normalized;
}

// Split full name into first and last name
export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }
  
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  
  if (parts.length === 2) {
    return { firstName: parts[0], lastName: parts[1] };
  }
  
  // For 3+ parts, check for middle initials or names
  // Assume first part is firstName, last part is lastName, middle parts are middle names
  return {
    firstName: parts[0],
    lastName: parts[parts.length - 1]
  };
}

// Normalize company name
export function normalizeCompanyName(
  name: string,
  options: NormalizationOptions = {}
): string {
  if (!name) return '';
  
  let normalized = name;
  
  // Trim whitespace
  if (options.trimWhitespace !== false) {
    normalized = normalized.trim();
  }
  
  // Standardize company suffixes
  Object.entries(COMPANY_SUFFIXES).forEach(([long, short]) => {
    const regex = new RegExp(`\\b${long}\\.?\\b`, 'gi');
    normalized = normalized.replace(regex, short);
  });
  
  // Remove excessive whitespace
  normalized = normalized.replace(/\s+/g, ' ');
  
  // Capitalize company name properly
  if (options.capitalizeNames !== false) {
    normalized = normalized
      .split(' ')
      .map(word => {
        // Keep acronyms in uppercase
        if (word === word.toUpperCase() && word.length > 1) {
          return word;
        }
        // Keep specific patterns
        if (/^[a-z]+[A-Z]/.test(word)) {
          return word; // camelCase names like "eBay", "iPhone"
        }
        return capitalize(word);
      })
      .join(' ');
  }
  
  return normalized;
}

// Normalize phone number
export function normalizePhoneNumber(
  phone: string,
  options: NormalizationOptions = {}
): string {
  if (!phone) return '';
  
  let normalized = phone.trim();
  
  // Remove all non-numeric characters except + at the beginning
  normalized = normalized.replace(/[^\d+]/g, '');
  
  // Ensure + is only at the beginning
  if (normalized.includes('+') && !normalized.startsWith('+')) {
    normalized = normalized.replace(/\+/g, '');
  }
  
  // Add default country code if needed and provided
  if (options.defaultCountryCode && !normalized.startsWith('+')) {
    if (normalized.length === 10) { // Assume North American number
      normalized = options.defaultCountryCode + normalized;
    }
  }
  
  // Format for display if standardizing
  if (options.standardizePhones) {
    // North American format
    if (normalized.startsWith('+1') && normalized.length === 12) {
      normalized = `+1 (${normalized.slice(2, 5)}) ${normalized.slice(5, 8)}-${normalized.slice(8)}`;
    }
    // International format (generic)
    else if (normalized.startsWith('+')) {
      // Keep as is or implement specific country formats
    }
  }
  
  return normalized;
}

// Normalize URL
export function normalizeUrl(url: string, options: NormalizationOptions = {}): string {
  if (!url) return '';
  
  let normalized = url.trim();
  
  // Add https:// if missing
  if (options.cleanUrls !== false) {
    normalized = addHttpsToUrl(normalized);
  }
  
  // Validate URL
  if (!isValidUrl(normalized)) {
    return '';
  }
  
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');
  
  // Lowercase domain but preserve path case
  try {
    const urlObj = new URL(normalized);
    urlObj.hostname = urlObj.hostname.toLowerCase();
    normalized = urlObj.toString();
  } catch {}
  
  return normalized;
}

// Normalize industry
export function normalizeIndustry(industry: string): string {
  if (!industry) return '';
  
  const lower = industry.toLowerCase().trim();
  
  // Check mapping
  if (INDUSTRY_MAPPING[lower]) {
    return INDUSTRY_MAPPING[lower];
  }
  
  // Check if it's already a standard industry
  const standardIndustries = Object.values(INDUSTRY_MAPPING);
  const found = standardIndustries.find(
    std => std.toLowerCase() === lower
  );
  
  if (found) return found;
  
  // Return capitalized version
  return industry
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

// Normalize company size
export function normalizeCompanySize(size: string): string {
  if (!size) return '';
  
  const lower = size.toLowerCase().trim();
  
  // Check direct mapping
  if (SIZE_MAPPING[lower]) {
    return SIZE_MAPPING[lower];
  }
  
  // Check numeric values
  const num = parseInt(size.replace(/[^\d]/g, ''));
  if (!isNaN(num)) {
    if (num <= 10) return 'startup';
    if (num <= 50) return 'small';
    if (num <= 200) return 'medium';
    if (num <= 1000) return 'large';
    return 'enterprise';
  }
  
  // Check if it's already valid
  const validSizes = ['startup', 'small', 'medium', 'large', 'enterprise'];
  if (validSizes.includes(lower)) {
    return lower;
  }
  
  return size; // Return as is if can't normalize
}

// Normalize revenue range
export function normalizeRevenue(revenue: string): string {
  if (!revenue) return '';
  
  // Check direct mapping
  if (REVENUE_MAPPING[revenue]) {
    return REVENUE_MAPPING[revenue];
  }
  
  const lower = revenue.toLowerCase();
  
  // Check for patterns
  if (lower.includes('under') || lower.includes('<')) {
    if (lower.includes('1m') || lower.includes('1 m')) return 'under_1m';
  }
  if (lower.includes('1') && lower.includes('10')) return '1m_10m';
  if (lower.includes('10') && lower.includes('50')) return '10m_50m';
  if (lower.includes('50') && lower.includes('100')) return '50m_100m';
  if (lower.includes('over') || lower.includes('>') || lower.includes('+')) {
    if (lower.includes('100')) return 'over_100m';
  }
  
  // Check if it's already valid
  const validRanges = ['under_1m', '1m_10m', '10m_50m', '50m_100m', 'over_100m'];
  if (validRanges.includes(lower.replace(/[^a-z0-9_]/g, ''))) {
    return lower.replace(/[^a-z0-9_]/g, '');
  }
  
  return revenue; // Return as is if can't normalize
}

// Parse location string into components
export function parseLocation(location: string): {
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
} {
  if (!location) return {};
  
  const parts = location.split(',').map(p => p.trim());
  
  if (parts.length === 1) {
    // Might be just city or country
    return { city: parts[0] };
  }
  
  if (parts.length === 2) {
    // City, State/Country
    return {
      city: parts[0],
      state: parts[1].length === 2 ? parts[1] : undefined,
      country: parts[1].length > 2 ? parts[1] : undefined
    };
  }
  
  if (parts.length === 3) {
    // City, State, Country
    return {
      city: parts[0],
      state: parts[1],
      country: parts[2]
    };
  }
  
  // More complex format
  const result: any = {};
  
  // Look for postal code (numeric or alphanumeric)
  const postalMatch = location.match(/\b([A-Z0-9]{3,10})\b/);
  if (postalMatch) {
    result.postalCode = postalMatch[1];
  }
  
  // Assume: City, State/Province, Country, Postal
  if (parts.length >= 4) {
    result.city = parts[0];
    result.state = parts[1];
    result.country = parts[2];
    if (!result.postalCode) {
      result.postalCode = parts[3];
    }
  }
  
  return result;
}

// Main normalization function
export function normalizeProspectData(
  data: any,
  options: NormalizationOptions = {}
): NormalizedProspectData {
  // Normalize email
  const email = normalizeEmail(data.email, options);
  
  // Normalize names
  let firstName = data.firstName ? normalizeName(data.firstName, options) : undefined;
  let lastName = data.lastName ? normalizeName(data.lastName, options) : undefined;
  let fullName: string | undefined;
  
  // Handle full name if no first/last
  if (!firstName && !lastName && data.fullName) {
    fullName = normalizeName(data.fullName, options);
    const split = splitFullName(fullName);
    firstName = split.firstName;
    lastName = split.lastName;
  } else if (firstName || lastName) {
    fullName = [firstName, lastName].filter(Boolean).join(' ');
  }
  
  // Normalize job title
  const jobTitle = data.jobTitle
    ? data.jobTitle.trim()
    : undefined;
  
  // Normalize company data
  const companyName = normalizeCompanyName(data.company?.name || data.companyName, options);
  
  // Get company domain
  let companyDomain = data.company?.domain || data.companyDomain;
  if (companyDomain) {
    companyDomain = normalizeUrl(companyDomain, options);
    companyDomain = extractDomainFromUrl(companyDomain);
  } else if (email) {
    // Try to extract from email if not a common provider
    const emailDomain = extractDomainFromEmail(email);
    const commonProviders = ['gmail', 'yahoo', 'outlook', 'hotmail', 'icloud'];
    if (!commonProviders.some(p => emailDomain.includes(p))) {
      companyDomain = emailDomain;
    }
  }
  
  // Normalize other company fields
  const industry = normalizeIndustry(data.company?.industry || data.industry);
  const companySize = normalizeCompanySize(data.company?.size || data.companySize);
  const revenue = normalizeRevenue(data.company?.revenue || data.revenue);
  
  // Parse location
  const locationStr = data.company?.location || data.location;
  const location = locationStr ? parseLocation(locationStr) : undefined;
  
  // Normalize URLs
  const linkedinUrl = data.linkedinUrl
    ? normalizeUrl(data.linkedinUrl, options)
    : undefined;
  
  const websiteUrl = data.websiteUrl || data.company?.websiteUrl
    ? normalizeUrl(data.websiteUrl || data.company?.websiteUrl, options)
    : undefined;
  
  // Normalize phone
  const phone = data.phone
    ? normalizePhoneNumber(data.phone, options)
    : undefined;
  
  // Handle employees count
  let employees: number | undefined;
  if (data.company?.employees) {
    const empStr = data.company.employees.toString();
    employees = parseInt(empStr.replace(/[^\d]/g, ''));
    if (isNaN(employees)) employees = undefined;
  }
  
  // Handle founded year
  let founded: number | undefined;
  if (data.company?.founded) {
    const foundedStr = data.company.founded.toString();
    founded = parseInt(foundedStr);
    const currentYear = new Date().getFullYear();
    if (founded < 1800 || founded > currentYear) founded = undefined;
  }
  
  return {
    email,
    firstName,
    lastName,
    fullName,
    jobTitle,
    company: {
      name: companyName,
      domain: companyDomain,
      industry,
      size: companySize,
      revenue,
      location: locationStr,
      employees,
      founded
    },
    linkedinUrl,
    websiteUrl,
    phone,
    location,
    customFields: data.customFields
  };
}

// Batch normalization
export function normalizeProspectsData(
  dataArray: any[],
  options: NormalizationOptions = {}
): NormalizedProspectData[] {
  return dataArray.map(data => normalizeProspectData(data, options));
}
