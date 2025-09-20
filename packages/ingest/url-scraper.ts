// URL Scraper for extracting prospect data from web pages
import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer';
import { 
  ValidationError,
  isValidEmail,
  extractDomainFromUrl,
  addHttpsToUrl,
  capitalize
} from '@ai-sales-agent/core';

// Scraping options
export interface ScrapingOptions {
  timeout?: number; // Milliseconds
  waitForSelector?: string; // CSS selector to wait for
  userAgent?: string;
  headless?: boolean;
  javascript?: boolean; // Use Puppeteer for JS-heavy sites
  maxRetries?: number;
  followRedirects?: boolean;
  extractEmails?: boolean;
  extractPhones?: boolean;
  extractSocials?: boolean;
}

// Scraped company data
export interface ScrapedCompanyData {
  name?: string;
  domain: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  founded?: number;
  technologies?: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  contactEmails?: string[];
  contactPhones?: string[];
  metadata?: {
    title?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

// Scraped person data (from LinkedIn or similar)
export interface ScrapedPersonData {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  linkedinUrl?: string;
  profileImage?: string;
}

// Combined scraping result
export interface ScrapingResult {
  success: boolean;
  url: string;
  type: 'company' | 'person' | 'unknown';
  companyData?: ScrapedCompanyData;
  personData?: ScrapedPersonData;
  error?: string;
}

// Patterns for detecting various data
const PATTERNS = {
  email: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
  phone: /(\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g,
  linkedin: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:company|in)\/([a-zA-Z0-9-]+)/gi,
  twitter: /(?:https?:\/\/)?(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/gi,
  facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9.]+)/gi,
  instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]+)/gi,
  founded: /(?:founded|established|since|est\.?)\s*(?:in\s*)?(\d{4})/i,
  employees: /(\d+(?:,\d+)?)\s*(?:employees|staff|people)/i,
};

// Technology detection keywords
const TECH_KEYWORDS = [
  'React', 'Angular', 'Vue', 'Node.js', 'Python', 'Django', 'Rails', 'Ruby',
  'Java', 'Spring', '.NET', 'PHP', 'Laravel', 'WordPress', 'Shopify',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
  'Salesforce', 'HubSpot', 'Stripe', 'Twilio', 'SendGrid'
];

// Industry keywords for detection
const INDUSTRY_KEYWORDS = {
  'Technology': ['software', 'saas', 'tech', 'it', 'digital', 'cloud', 'ai', 'data'],
  'Healthcare': ['health', 'medical', 'pharma', 'biotech', 'healthcare', 'clinic', 'hospital'],
  'Finance': ['finance', 'banking', 'investment', 'insurance', 'fintech', 'payment'],
  'Education': ['education', 'learning', 'training', 'university', 'school', 'edtech'],
  'Retail': ['retail', 'ecommerce', 'shop', 'store', 'marketplace', 'fashion'],
  'Manufacturing': ['manufacturing', 'industrial', 'factory', 'production', 'supply chain'],
  'Real Estate': ['real estate', 'property', 'realty', 'housing', 'construction'],
  'Marketing': ['marketing', 'advertising', 'agency', 'media', 'creative', 'pr'],
};

// Initialize Puppeteer browser
let browser: Browser | null = null;

async function getBrowser(options: ScrapingOptions): Promise<Browser> {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: options.headless !== false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
  }
  return browser;
}

// Clean up browser
export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

// Extract emails from text
function extractEmails(text: string): string[] {
  const matches = text.match(PATTERNS.email) || [];
  return [...new Set(matches)]
    .filter(email => isValidEmail(email))
    .filter(email => !email.includes('example.com')); // Filter example emails
}

// Extract phone numbers from text
function extractPhones(text: string): string[] {
  const matches = text.match(PATTERNS.phone) || [];
  return [...new Set(matches)]
    .map(phone => phone.replace(/\D/g, ''))
    .filter(phone => phone.length >= 10 && phone.length <= 15);
}

// Extract social links
function extractSocialLinks(html: string): any {
  const social: any = {};
  
  const linkedinMatch = html.match(PATTERNS.linkedin);
  if (linkedinMatch) social.linkedin = `https://linkedin.com/${linkedinMatch[1]}`;
  
  const twitterMatch = html.match(PATTERNS.twitter);
  if (twitterMatch) social.twitter = `https://twitter.com/${twitterMatch[1]}`;
  
  const facebookMatch = html.match(PATTERNS.facebook);
  if (facebookMatch) social.facebook = `https://facebook.com/${facebookMatch[1]}`;
  
  const instagramMatch = html.match(PATTERNS.instagram);
  if (instagramMatch) social.instagram = `https://instagram.com/${instagramMatch[1]}`;
  
  return Object.keys(social).length > 0 ? social : undefined;
}

// Detect industry from text
function detectIndustry(text: string): string | undefined {
  const lowerText = text.toLowerCase();
  
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return industry;
    }
  }
  
  return undefined;
}

// Detect technologies from text
function detectTechnologies(text: string): string[] {
  const technologies: string[] = [];
  
  TECH_KEYWORDS.forEach(tech => {
    const regex = new RegExp(`\\b${tech}\\b`, 'i');
    if (regex.test(text)) {
      technologies.push(tech);
    }
  });
  
  return technologies;
}

// Parse company size from text
function parseCompanySize(text: string): string | undefined {
  const match = text.match(PATTERNS.employees);
  if (match) {
    const num = parseInt(match[1].replace(',', ''));
    if (num <= 10) return 'startup';
    if (num <= 50) return 'small';
    if (num <= 200) return 'medium';
    if (num <= 1000) return 'large';
    return 'enterprise';
  }
  return undefined;
}

// Parse founded year from text
function parseFoundedYear(text: string): number | undefined {
  const match = text.match(PATTERNS.founded);
  if (match) {
    const year = parseInt(match[1]);
    const currentYear = new Date().getFullYear();
    if (year >= 1800 && year <= currentYear) {
      return year;
    }
  }
  return undefined;
}

// Scrape using Cheerio (for static HTML)
async function scrapeWithCheerio(
  url: string,
  options: ScrapingOptions
): Promise<ScrapingResult> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    const domain = extractDomainFromUrl(url);
    
    // Extract metadata
    const title = $('title').text() || $('meta[property="og:title"]').attr('content');
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content');
    const keywords = $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim());
    const ogImage = $('meta[property="og:image"]').attr('content');
    
    // Extract text content
    const bodyText = $('body').text();
    
    // Extract structured data (JSON-LD)
    const jsonLd = $('script[type="application/ld+json"]').text();
    let structuredData: any = {};
    if (jsonLd) {
      try {
        structuredData = JSON.parse(jsonLd);
      } catch {}
    }
    
    // Build company data
    const companyData: ScrapedCompanyData = {
      name: structuredData.name || title?.split('|')[0]?.trim(),
      domain,
      description: description || structuredData.description,
      industry: detectIndustry(bodyText),
      size: parseCompanySize(bodyText),
      location: structuredData.address?.addressLocality || structuredData.location,
      founded: parseFoundedYear(bodyText),
      technologies: detectTechnologies(bodyText),
      metadata: {
        title,
        keywords,
        ogImage
      }
    };
    
    // Extract contact info if requested
    if (options.extractEmails) {
      companyData.contactEmails = extractEmails(bodyText);
    }
    
    if (options.extractPhones) {
      companyData.contactPhones = extractPhones(bodyText);
    }
    
    if (options.extractSocials) {
      companyData.socialLinks = extractSocialLinks(html);
    }
    
    return {
      success: true,
      url,
      type: 'company',
      companyData
    };
    
  } catch (error) {
    return {
      success: false,
      url,
      type: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Scrape using Puppeteer (for JS-heavy sites)
async function scrapeWithPuppeteer(
  url: string,
  options: ScrapingOptions
): Promise<ScrapingResult> {
  let page: Page | null = null;
  
  try {
    const browser = await getBrowser(options);
    page = await browser.newPage();
    
    // Set user agent
    if (options.userAgent) {
      await page.setUserAgent(options.userAgent);
    }
    
    // Navigate to URL
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: options.timeout || 30000
    });
    
    // Wait for specific selector if provided
    if (options.waitForSelector) {
      await page.waitForSelector(options.waitForSelector, {
        timeout: options.timeout || 30000
      });
    }
    
    // Extract data
    const data = await page.evaluate(() => {
      const getMetaContent = (name: string): string | null => {
        const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        return meta ? (meta as HTMLMetaElement).content : null;
      };
      
      // Get structured data
      const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
      let structuredData: any = {};
      if (jsonLdScript) {
        try {
          structuredData = JSON.parse(jsonLdScript.textContent || '{}');
        } catch {}
      }
      
      return {
        title: document.title,
        description: getMetaContent('description') || getMetaContent('og:description'),
        keywords: getMetaContent('keywords'),
        ogImage: getMetaContent('og:image'),
        bodyText: document.body.innerText,
        html: document.documentElement.outerHTML,
        structuredData
      };
    });
    
    const domain = extractDomainFromUrl(url);
    
    // Build company data
    const companyData: ScrapedCompanyData = {
      name: data.structuredData.name || data.title?.split('|')[0]?.trim(),
      domain,
      description: data.description || data.structuredData.description,
      industry: detectIndustry(data.bodyText),
      size: parseCompanySize(data.bodyText),
      location: data.structuredData.address?.addressLocality || data.structuredData.location,
      founded: parseFoundedYear(data.bodyText),
      technologies: detectTechnologies(data.bodyText),
      metadata: {
        title: data.title,
        keywords: data.keywords?.split(',').map((k: string) => k.trim()),
        ogImage: data.ogImage || undefined
      }
    };
    
    // Extract contact info if requested
    if (options.extractEmails) {
      companyData.contactEmails = extractEmails(data.bodyText);
    }
    
    if (options.extractPhones) {
      companyData.contactPhones = extractPhones(data.bodyText);
    }
    
    if (options.extractSocials) {
      companyData.socialLinks = extractSocialLinks(data.html);
    }
    
    return {
      success: true,
      url,
      type: 'company',
      companyData
    };
    
  } catch (error) {
    return {
      success: false,
      url,
      type: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    if (page) {
      await page.close();
    }
  }
}

// Main scraping function
export async function scrapeUrl(
  url: string,
  options: ScrapingOptions = {}
): Promise<ScrapingResult> {
  // Normalize URL
  const normalizedUrl = addHttpsToUrl(url);
  if (!normalizedUrl) {
    throw new ValidationError('Invalid URL provided');
  }
  
  // Detect if it's a LinkedIn profile
  if (normalizedUrl.includes('linkedin.com/in/')) {
    return scrapeLinkedInProfile(normalizedUrl, options);
  }
  
  // Use Puppeteer for JS-heavy sites or if explicitly requested
  if (options.javascript) {
    return scrapeWithPuppeteer(normalizedUrl, options);
  }
  
  // Default to Cheerio for better performance
  let result = await scrapeWithCheerio(normalizedUrl, options);
  
  // Retry with Puppeteer if Cheerio fails and we have retries left
  if (!result.success && (options.maxRetries || 1) > 0) {
    result = await scrapeWithPuppeteer(normalizedUrl, options);
  }
  
  return result;
}

// Specialized LinkedIn profile scraping
async function scrapeLinkedInProfile(
  url: string,
  options: ScrapingOptions
): Promise<ScrapingResult> {
  // Note: LinkedIn has strict anti-scraping measures
  // This would need proper authentication or API access in production
  
  return {
    success: false,
    url,
    type: 'person',
    error: 'LinkedIn scraping requires authentication. Please use LinkedIn API or manual entry.'
  };
}

// Batch URL scraping with concurrency control
export async function scrapeUrls(
  urls: string[],
  options: ScrapingOptions & { concurrency?: number } = {}
): Promise<ScrapingResult[]> {
  const { concurrency = 3, ...scrapingOptions } = options;
  const results: ScrapingResult[] = [];
  
  // Process URLs in batches
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(url => scrapeUrl(url, scrapingOptions))
    );
    results.push(...batchResults);
    
    // Add delay between batches to avoid rate limiting
    if (i + concurrency < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}
