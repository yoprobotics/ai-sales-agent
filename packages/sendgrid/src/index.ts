/**
 * SendGrid Package - Main Export
 * Complete email service with RGPD/CCPA/CASL compliance
 */

// Client initialization
export {
  initializeSendGrid,
  getSendGridMail,
  getSendGridClient,
  resetSendGrid,
  getDefaultSender,
  isSandboxMode,
  type SendGridConfig
} from './client';

// Email sending
export {
  sendEmail,
  sendBulkEmails,
  sendTemplateEmail,
  scheduleEmail
} from './send';

// Suppression management
export {
  addToSuppressionList,
  removeFromSuppressionList,
  isEmailSuppressed,
  getSuppressionList,
  unsubscribeEmail,
  resubscribeEmail
} from './suppression';

// Webhook handling
export {
  verifyWebhookSignature,
  processWebhookEvents,
  setupWebhookEndpoint,
  getWebhookSettings,
  testWebhook,
  type SendGridWebhookEvent
} from './webhooks';

// Domain authentication (SPF/DKIM)
export {
  authenticateDomain,
  validateDomain,
  getAuthenticatedDomains,
  getAuthenticatedDomain,
  deleteAuthenticatedDomain,
  getDnsRecords,
  getDnsInstructions,
  isDomainConfigured,
  waitForDomainValidation,
  generateDomainReport,
  type DomainAuthenticationStatus,
  type DnsRecord,
  type DomainVerificationResult
} from './domain-auth';

// Opt-in management (RGPD/CCPA)
export {
  sendOptInConfirmation,
  confirmOptIn,
  hasValidConsent,
  withdrawConsent,
  resubscribe,
  exportConsentRecords,
  bulkImportWithConsent,
  type OptInRequest,
  type OptInConfirmation,
  type ConsentRecord
} from './opt-in';

// Compliance management
export {
  getComplianceConfig,
  generateComplianceFooter,
  addComplianceFooter,
  checkEmailCompliance,
  ensureCompliance,
  getComplianceReport,
  canSendToEmail,
  type ComplianceConfig,
  type ComplianceFooter,
  type ComplianceCheck
} from './compliance';

// Templates management
export {
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  getEmailTemplate,
  listEmailTemplates,
  activateEmailTemplate,
  duplicateEmailTemplate,
  getDefaultTemplates,
  type EmailTemplate,
  type TemplateVersion
} from './templates';

// Statistics and analytics
export {
  getGlobalStats,
  getCategoryStats,
  getAdvancedStats,
  type EmailStats,
  type CategoryStats,
  type AdvancedStats
} from './stats';

// Error handling
export {
  SendGridError,
  handleSendGridError,
  retryWithBackoff
} from './errors';

// Types
export type {
  SendEmailData,
  EmailResponse,
  EmailAddress,
  EmailAttachment,
  SuppressionListEntry
} from './types';
