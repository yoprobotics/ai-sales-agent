/**
 * SendGrid Compliance Module
 * Ensures RGPD/CCPA/CASL compliance for all email communications
 */

import { SendEmailData } from './types';
import { log } from './client';

export interface ComplianceConfig {
  requireOptIn: boolean;
  requireDoubleOptIn: boolean;
  includeUnsubscribeLink: boolean;
  includePhysicalAddress: boolean;
  dataRetentionDays: number;
  region: 'EU' | 'US' | 'CA';
}

export interface ComplianceFooter {
  html: string;
  text: string;
}

export interface ComplianceCheck {
  compliant: boolean;
  issues: string[];
  warnings: string[];
  recommendations: string[];
}

/**
 * Get compliance configuration based on region
 */
export function getComplianceConfig(region: 'EU' | 'US' | 'CA'): ComplianceConfig {
  switch (region) {
    case 'EU': // GDPR
      return {
        requireOptIn: true,
        requireDoubleOptIn: true,
        includeUnsubscribeLink: true,
        includePhysicalAddress: true,
        dataRetentionDays: 365 * 2, // 2 years max
        region: 'EU'
      };
    
    case 'CA': // CASL/PIPEDA
      return {
        requireOptIn: true,
        requireDoubleOptIn: true,
        includeUnsubscribeLink: true,
        includePhysicalAddress: true,
        dataRetentionDays: 365 * 3, // 3 years
        region: 'CA'
      };
    
    case 'US': // CAN-SPAM/CCPA
      return {
        requireOptIn: false, // CAN-SPAM doesn't require opt-in
        requireDoubleOptIn: false,
        includeUnsubscribeLink: true,
        includePhysicalAddress: true,
        dataRetentionDays: 365 * 7, // 7 years for business records
        region: 'US'
      };
    
    default:
      // Default to most restrictive (EU)
      return getComplianceConfig('EU');
  }
}

/**
 * Generate compliance footer for emails
 */
export function generateComplianceFooter(
  options: {
    language?: 'en' | 'fr';
    companyName?: string;
    companyAddress?: string;
    unsubscribeUrl?: string;
    preferencesUrl?: string;
    privacyPolicyUrl?: string;
    region?: 'EU' | 'US' | 'CA';
  }
): ComplianceFooter {
  const language = options.language || 'en';
  const companyName = options.companyName || 'AI Sales Agent';
  const companyAddress = options.companyAddress || process.env.COMPANY_ADDRESS || '';
  const baseUrl = process.env.APP_BASE_URL || 'https://app.aisalesagent.com';
  const unsubscribeUrl = options.unsubscribeUrl || `${baseUrl}/unsubscribe`;
  const preferencesUrl = options.preferencesUrl || `${baseUrl}/preferences`;
  const privacyPolicyUrl = options.privacyPolicyUrl || `${baseUrl}/privacy`;
  
  let footerText: { html: string; text: string };
  
  if (language === 'fr') {
    footerText = {
      html: `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #666;">
          <p>
            Cet email a été envoyé par <strong>${companyName}</strong><br>
            ${companyAddress ? `${companyAddress}<br>` : ''}
          </p>
          <p>
            Vous recevez cet email car vous êtes inscrit à notre liste de diffusion.<br>
            <a href="${unsubscribeUrl}" style="color: #0066cc;">Se désinscrire</a> | 
            <a href="${preferencesUrl}" style="color: #0066cc;">Gérer les préférences</a> | 
            <a href="${privacyPolicyUrl}" style="color: #0066cc;">Politique de confidentialité</a>
          </p>
          <p style="font-size: 10px; color: #999;">
            © ${new Date().getFullYear()} ${companyName}. Tous droits réservés.<br>
            Conformément au RGPD, vous pouvez exercer vos droits d'accès, de rectification, 
            de suppression et de portabilité de vos données personnelles.
          </p>
        </div>
      `,
      text: `
---
Cet email a été envoyé par ${companyName}
${companyAddress}

Vous recevez cet email car vous êtes inscrit à notre liste de diffusion.
Se désinscrire: ${unsubscribeUrl}
Gérer les préférences: ${preferencesUrl}
Politique de confidentialité: ${privacyPolicyUrl}

© ${new Date().getFullYear()} ${companyName}. Tous droits réservés.
Conformément au RGPD, vous pouvez exercer vos droits d'accès, de rectification, de suppression et de portabilité de vos données personnelles.
      `.trim()
    };
  } else {
    footerText = {
      html: `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #666;">
          <p>
            This email was sent by <strong>${companyName}</strong><br>
            ${companyAddress ? `${companyAddress}<br>` : ''}
          </p>
          <p>
            You are receiving this email because you are subscribed to our mailing list.<br>
            <a href="${unsubscribeUrl}" style="color: #0066cc;">Unsubscribe</a> | 
            <a href="${preferencesUrl}" style="color: #0066cc;">Manage Preferences</a> | 
            <a href="${privacyPolicyUrl}" style="color: #0066cc;">Privacy Policy</a>
          </p>
          <p style="font-size: 10px; color: #999;">
            © ${new Date().getFullYear()} ${companyName}. All rights reserved.<br>
            Under GDPR/CCPA regulations, you have the right to access, correct, delete, 
            and port your personal data.
          </p>
        </div>
      `,
      text: `
---
This email was sent by ${companyName}
${companyAddress}

You are receiving this email because you are subscribed to our mailing list.
Unsubscribe: ${unsubscribeUrl}
Manage Preferences: ${preferencesUrl}
Privacy Policy: ${privacyPolicyUrl}

© ${new Date().getFullYear()} ${companyName}. All rights reserved.
Under GDPR/CCPA regulations, you have the right to access, correct, delete, and port your personal data.
      `.trim()
    };
  }
  
  return footerText;
}

/**
 * Add compliance footer to email
 */
export function addComplianceFooter(
  emailData: SendEmailData,
  options?: {
    language?: 'en' | 'fr';
    region?: 'EU' | 'US' | 'CA';
  }
): SendEmailData {
  const footer = generateComplianceFooter({
    language: options?.language,
    region: options?.region
  });
  
  // Add footer to HTML content
  if (emailData.html) {
    emailData.html += footer.html;
  }
  
  // Add footer to text content
  if (emailData.text) {
    emailData.text += '\n\n' + footer.text;
  }
  
  // Add unsubscribe group ID for SendGrid
  const unsubscribeGroupId = process.env.SENDGRID_UNSUBSCRIBE_GROUP_ID;
  if (unsubscribeGroupId) {
    emailData.asmGroupId = parseInt(unsubscribeGroupId);
  }
  
  // Add tracking settings for compliance
  emailData.trackingSettings = {
    ...emailData.trackingSettings,
    subscriptionTracking: {
      enable: true,
      substitutionTag: '<%unsubscribe%>'
    }
  };
  
  log('compliance.footer.added', { 
    to: emailData.to,
    language: options?.language,
    region: options?.region 
  });
  
  return emailData;
}

/**
 * Check if email is compliant with regulations
 */
export function checkEmailCompliance(
  emailData: SendEmailData,
  region: 'EU' | 'US' | 'CA' = 'EU'
): ComplianceCheck {
  const config = getComplianceConfig(region);
  const issues: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  // Check for unsubscribe link
  if (config.includeUnsubscribeLink) {
    const hasUnsubscribe = 
      (emailData.html && emailData.html.includes('unsubscribe')) ||
      (emailData.text && emailData.text.includes('unsubscribe'));
    
    if (!hasUnsubscribe && !emailData.asmGroupId) {
      issues.push('Missing unsubscribe link or SendGrid unsubscribe group');
    }
  }
  
  // Check for physical address
  if (config.includePhysicalAddress) {
    const addressKeywords = ['address', 'street', 'city', 'postal', 'zip'];
    const hasAddress = addressKeywords.some(keyword => 
      (emailData.html && emailData.html.toLowerCase().includes(keyword)) ||
      (emailData.text && emailData.text?.toLowerCase().includes(keyword))
    );
    
    if (!hasAddress) {
      issues.push('Missing physical mailing address (required by CAN-SPAM/CASL)');
    }
  }
  
  // Check for proper from address
  if (!emailData.from) {
    issues.push('Missing from address');
  }
  
  // Check subject line
  if (!emailData.subject || emailData.subject.length === 0) {
    issues.push('Missing subject line');
  } else if (emailData.subject.length > 200) {
    warnings.push('Subject line is very long (>200 characters)');
  }
  
  // Check for misleading subject
  const misleadingKeywords = ['free', 'winner', 'congratulations', 'urgent', '100%'];
  const hasMisleading = misleadingKeywords.some(keyword =>
    emailData.subject?.toLowerCase().includes(keyword)
  );
  
  if (hasMisleading) {
    warnings.push('Subject line may be considered misleading or spam-like');
  }
  
  // Recommendations based on region
  if (region === 'EU') {
    recommendations.push('Ensure you have explicit consent before sending');
    recommendations.push('Include clear data processing information');
    recommendations.push('Provide contact information for data protection officer');
  } else if (region === 'CA') {
    recommendations.push('Include clear identification of commercial message');
    recommendations.push('Ensure consent was obtained within last 2 years');
  } else if (region === 'US') {
    recommendations.push('Avoid deceptive subject lines');
    recommendations.push('Honor opt-out requests within 10 business days');
  }
  
  const compliant = issues.length === 0;
  
  log('compliance.check', {
    compliant,
    issueCount: issues.length,
    warningCount: warnings.length,
    region
  });
  
  return {
    compliant,
    issues,
    warnings,
    recommendations
  };
}

/**
 * Ensure email meets all compliance requirements
 */
export function ensureCompliance(
  emailData: SendEmailData,
  options?: {
    language?: 'en' | 'fr';
    region?: 'EU' | 'US' | 'CA';
    skipValidation?: boolean;
  }
): SendEmailData {
  const region = options?.region || 'EU';
  
  // Add compliance footer
  const compliantEmail = addComplianceFooter(emailData, {
    language: options?.language,
    region
  });
  
  // Check compliance unless skipped
  if (!options?.skipValidation) {
    const complianceCheck = checkEmailCompliance(compliantEmail, region);
    
    if (!complianceCheck.compliant) {
      throw new Error(
        `Email does not meet ${region} compliance requirements: ${complianceCheck.issues.join(', ')}`
      );
    }
  }
  
  return compliantEmail;
}

/**
 * Get compliance report for a date range
 */
export async function getComplianceReport(
  startDate: Date,
  endDate: Date,
  region?: 'EU' | 'US' | 'CA'
): Promise<{
  totalEmails: number;
  compliantEmails: number;
  nonCompliantEmails: number;
  unsubscribes: number;
  spamReports: number;
  bounces: number;
  complianceRate: number;
  issues: Record<string, number>;
  recommendations: string[];
}> {
  log('compliance.report.generate', { 
    startDate,
    endDate,
    region 
  });
  
  // TODO: Fetch actual data from database
  // This is a mock implementation
  
  const report = {
    totalEmails: 10000,
    compliantEmails: 9800,
    nonCompliantEmails: 200,
    unsubscribes: 150,
    spamReports: 5,
    bounces: 100,
    complianceRate: 98.0,
    issues: {
      'Missing unsubscribe link': 50,
      'Missing physical address': 100,
      'No consent record': 50
    },
    recommendations: [
      'Improve consent record keeping',
      'Ensure all templates include physical address',
      'Review and update unsubscribe process',
      'Implement double opt-in for all regions',
      'Regular compliance audits'
    ]
  };
  
  log('compliance.report.complete', { 
    complianceRate: report.complianceRate 
  });
  
  return report;
}

/**
 * Check if sending to email would be compliant
 */
export async function canSendToEmail(
  email: string,
  options?: {
    requireConsent?: boolean;
    checkSuppression?: boolean;
    region?: 'EU' | 'US' | 'CA';
  }
): Promise<{
  canSend: boolean;
  reason?: string;
}> {
  const config = getComplianceConfig(options?.region || 'EU');
  
  // Check suppression list
  if (options?.checkSuppression !== false) {
    const { isEmailSuppressed } = await import('./suppression');
    const isSuppressed = await isEmailSuppressed(email);
    
    if (isSuppressed) {
      return {
        canSend: false,
        reason: 'Email is in suppression list (unsubscribed, bounced, or marked as spam)'
      };
    }
  }
  
  // Check consent if required
  if (config.requireOptIn && options?.requireConsent !== false) {
    const { hasValidConsent } = await import('./opt-in');
    const hasConsent = await hasValidConsent(email);
    
    if (!hasConsent) {
      return {
        canSend: false,
        reason: 'No valid consent record found for this email'
      };
    }
  }
  
  return { canSend: true };
}
