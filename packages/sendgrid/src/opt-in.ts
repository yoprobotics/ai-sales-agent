/**
 * SendGrid Opt-in Management Module
 * RGPD/CCPA/CASL compliant double opt-in system
 */

import { sendTemplateEmail } from './send';
import { getSendGridClient, log } from './client';
import { isEmailSuppressed, removeFromSuppressionList } from './suppression';
import { EmailAddress } from './types';

export interface OptInRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  language?: 'en' | 'fr';
  source: string;
  ipAddress: string;
  userAgent?: string;
  consentText: string;
  timestamp: Date;
}

export interface OptInConfirmation {
  token: string;
  email: string;
  confirmed: boolean;
  confirmedAt?: Date;
  confirmedIp?: string;
  expiresAt: Date;
}

export interface ConsentRecord {
  email: string;
  consentGiven: boolean;
  consentDate: Date;
  consentMethod: 'double-opt-in' | 'single-opt-in' | 'import' | 'manual';
  consentText: string;
  consentVersion: string;
  ipAddress?: string;
  userAgent?: string;
  withdrawDate?: Date;
  withdrawMethod?: string;
  dataRegion: 'EU' | 'US' | 'CA';
}

/**
 * Generate opt-in confirmation token
 */
function generateOptInToken(email: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const data = `${email}-${timestamp}-${random}`;
  
  // In production, use crypto for secure token
  return Buffer.from(data).toString('base64url');
}

/**
 * Send double opt-in confirmation email
 */
export async function sendOptInConfirmation(
  request: OptInRequest,
  options?: {
    templateId?: string;
    confirmationUrl?: string;
    expiryHours?: number;
  }
): Promise<OptInConfirmation> {
  log('optin.send.start', { email: request.email });
  
  const token = generateOptInToken(request.email);
  const baseUrl = process.env.APP_BASE_URL || 'https://app.aisalesagent.com';
  const confirmUrl = options?.confirmationUrl || 
    `${baseUrl}/confirm-subscription?token=${token}`;
  
  const expiryHours = options?.expiryHours || 48;
  const expiresAt = new Date(Date.now() + (expiryHours * 60 * 60 * 1000));
  
  // Template data for the confirmation email
  const templateData = {
    firstName: request.firstName || '',
    confirmationUrl: confirmUrl,
    expiryHours,
    language: request.language || 'en',
    consentText: request.consentText,
    source: request.source,
    // RGPD/CCPA required information
    companyName: 'AI Sales Agent',
    companyAddress: 'Your Company Address',
    privacyPolicyUrl: `${baseUrl}/privacy`,
    dataUsage: request.language === 'fr' 
      ? 'Vos données seront utilisées pour vous envoyer des communications marketing et améliorer nos services.'
      : 'Your data will be used to send you marketing communications and improve our services.',
  };
  
  // Send confirmation email
  await sendTemplateEmail(
    request.email,
    options?.templateId || getDefaultOptInTemplateId(request.language),
    templateData,
    {
      categories: ['opt-in', 'confirmation'],
      customArgs: {
        token,
        source: request.source,
      }
    }
  );
  
  // Store opt-in request in database (TODO: implement database storage)
  const confirmation: OptInConfirmation = {
    token,
    email: request.email,
    confirmed: false,
    expiresAt,
  };
  
  log('optin.send.success', { 
    email: request.email,
    token,
    expiresAt 
  });
  
  return confirmation;
}

/**
 * Confirm opt-in from token
 */
export async function confirmOptIn(
  token: string,
  ipAddress?: string
): Promise<ConsentRecord> {
  log('optin.confirm.start', { token });
  
  // TODO: Validate token and retrieve opt-in request from database
  // For now, we'll decode the token to get the email
  const decoded = Buffer.from(token, 'base64url').toString();
  const [email] = decoded.split('-');
  
  // Remove from suppression lists if present
  const isSuppressed = await isEmailSuppressed(email);
  if (isSuppressed) {
    await removeFromSuppressionList(email, 'unsubscribe');
    log('optin.confirm.unsuppressed', { email });
  }
  
  // Create consent record
  const consent: ConsentRecord = {
    email,
    consentGiven: true,
    consentDate: new Date(),
    consentMethod: 'double-opt-in',
    consentText: 'I agree to receive marketing communications from AI Sales Agent',
    consentVersion: '1.0',
    ipAddress,
    dataRegion: determineDataRegion(ipAddress),
  };
  
  // TODO: Store consent record in database
  
  // Send welcome email
  await sendWelcomeEmail(email);
  
  log('optin.confirm.success', { email });
  
  return consent;
}

/**
 * Send welcome email after successful opt-in
 */
async function sendWelcomeEmail(
  email: string,
  options?: {
    firstName?: string;
    language?: 'en' | 'fr';
    templateId?: string;
  }
): Promise<void> {
  log('optin.welcome.start', { email });
  
  const language = options?.language || 'en';
  const baseUrl = process.env.APP_BASE_URL || 'https://app.aisalesagent.com';
  
  await sendTemplateEmail(
    email,
    options?.templateId || getDefaultWelcomeTemplateId(language),
    {
      firstName: options?.firstName || '',
      dashboardUrl: `${baseUrl}/dashboard`,
      unsubscribeUrl: `${baseUrl}/unsubscribe`,
      privacyPolicyUrl: `${baseUrl}/privacy`,
      language,
    },
    {
      categories: ['welcome', 'transactional'],
    }
  );
  
  log('optin.welcome.success', { email });
}

/**
 * Check if email has valid consent
 */
export async function hasValidConsent(
  email: string
): Promise<boolean> {
  log('optin.check.start', { email });
  
  // Check if email is in suppression list
  const isSuppressed = await isEmailSuppressed(email);
  if (isSuppressed) {
    log('optin.check.suppressed', { email });
    return false;
  }
  
  // TODO: Check consent record in database
  // For now, return true if not suppressed
  
  log('optin.check.result', { email, hasConsent: !isSuppressed });
  
  return !isSuppressed;
}

/**
 * Withdraw consent (unsubscribe)
 */
export async function withdrawConsent(
  email: string,
  options?: {
    reason?: string;
    method?: string;
    ipAddress?: string;
  }
): Promise<void> {
  log('optin.withdraw.start', { email });
  
  // Add to SendGrid suppression list
  await import('./suppression').then(m => 
    m.addToSuppressionList(email, 'unsubscribe')
  );
  
  // TODO: Update consent record in database
  
  // Send confirmation email (required by some regulations)
  await sendUnsubscribeConfirmation(email);
  
  log('optin.withdraw.success', { 
    email,
    reason: options?.reason,
    method: options?.method 
  });
}

/**
 * Send unsubscribe confirmation
 */
async function sendUnsubscribeConfirmation(
  email: string,
  language: 'en' | 'fr' = 'en'
): Promise<void> {
  log('optin.unsubscribe.confirm.start', { email });
  
  const baseUrl = process.env.APP_BASE_URL || 'https://app.aisalesagent.com';
  
  await sendTemplateEmail(
    email,
    getDefaultUnsubscribeTemplateId(language),
    {
      resubscribeUrl: `${baseUrl}/resubscribe`,
      contactUrl: `${baseUrl}/contact`,
      language,
    },
    {
      categories: ['unsubscribe-confirmation', 'transactional'],
    }
  );
  
  log('optin.unsubscribe.confirm.success', { email });
}

/**
 * Re-subscribe an email (requires new opt-in)
 */
export async function resubscribe(
  request: OptInRequest
): Promise<OptInConfirmation> {
  log('optin.resubscribe.start', { email: request.email });
  
  // Remove from suppression list
  await removeFromSuppressionList(request.email, 'unsubscribe');
  
  // Send new opt-in confirmation
  const confirmation = await sendOptInConfirmation(request);
  
  log('optin.resubscribe.success', { email: request.email });
  
  return confirmation;
}

/**
 * Export consent records for GDPR compliance
 */
export async function exportConsentRecords(
  email: string
): Promise<ConsentRecord[]> {
  log('optin.export.start', { email });
  
  // TODO: Retrieve all consent records from database
  
  const records: ConsentRecord[] = [];
  
  log('optin.export.success', { 
    email,
    recordCount: records.length 
  });
  
  return records;
}

/**
 * Bulk import with consent verification
 */
export async function bulkImportWithConsent(
  contacts: Array<{
    email: string;
    consentDate?: Date;
    consentSource?: string;
  }>,
  options?: {
    requireDoubleOptIn?: boolean;
    defaultConsent?: boolean;
  }
): Promise<{
  imported: number;
  skipped: number;
  errors: Array<{ email: string; reason: string }>;
}> {
  log('optin.bulkImport.start', { count: contacts.length });
  
  let imported = 0;
  let skipped = 0;
  const errors: Array<{ email: string; reason: string }> = [];
  
  for (const contact of contacts) {
    try {
      // Check if email is suppressed
      const isSuppressed = await isEmailSuppressed(contact.email);
      
      if (isSuppressed) {
        skipped++;
        errors.push({
          email: contact.email,
          reason: 'Email is in suppression list'
        });
        continue;
      }
      
      // If double opt-in required and no consent date
      if (options?.requireDoubleOptIn && !contact.consentDate) {
        // Send opt-in confirmation
        await sendOptInConfirmation({
          email: contact.email,
          source: contact.consentSource || 'import',
          ipAddress: '0.0.0.0',
          consentText: 'Imported contact - consent verification required',
          timestamp: new Date(),
        });
        skipped++;
        continue;
      }
      
      // Create consent record
      if (contact.consentDate || options?.defaultConsent) {
        // TODO: Store consent record in database
        imported++;
      } else {
        skipped++;
        errors.push({
          email: contact.email,
          reason: 'No consent date provided'
        });
      }
    } catch (error) {
      errors.push({
        email: contact.email,
        reason: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  log('optin.bulkImport.complete', { 
    imported,
    skipped,
    errors: errors.length 
  });
  
  return { imported, skipped, errors };
}

/**
 * Helper functions
 */
function getDefaultOptInTemplateId(language?: 'en' | 'fr'): string {
  return language === 'fr' 
    ? process.env.SENDGRID_OPTIN_TEMPLATE_FR || 'd-french-optin'
    : process.env.SENDGRID_OPTIN_TEMPLATE_EN || 'd-english-optin';
}

function getDefaultWelcomeTemplateId(language?: 'en' | 'fr'): string {
  return language === 'fr'
    ? process.env.SENDGRID_WELCOME_TEMPLATE_FR || 'd-french-welcome'
    : process.env.SENDGRID_WELCOME_TEMPLATE_EN || 'd-english-welcome';
}

function getDefaultUnsubscribeTemplateId(language?: 'en' | 'fr'): string {
  return language === 'fr'
    ? process.env.SENDGRID_UNSUBSCRIBE_TEMPLATE_FR || 'd-french-unsubscribe'
    : process.env.SENDGRID_UNSUBSCRIBE_TEMPLATE_EN || 'd-english-unsubscribe';
}

function determineDataRegion(ipAddress?: string): 'EU' | 'US' | 'CA' {
  // TODO: Implement IP geolocation
  // For now, default to EU for maximum compliance
  return 'EU';
}
