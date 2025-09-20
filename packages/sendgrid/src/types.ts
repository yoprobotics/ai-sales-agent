export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  content: string; // Base64 encoded
  filename: string;
  type?: string;
  disposition?: 'attachment' | 'inline';
  contentId?: string;
}

export interface SendEmailData {
  to: EmailAddress | EmailAddress[] | string | string[];
  from?: EmailAddress | string;
  subject: string;
  text?: string;
  html?: string;
  cc?: EmailAddress | EmailAddress[] | string | string[];
  bcc?: EmailAddress | EmailAddress[] | string | string[];
  replyTo?: EmailAddress | string;
  attachments?: EmailAttachment[];
  categories?: string[];
  customArgs?: Record<string, string>;
  sendAt?: number; // Unix timestamp
  batchId?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  sandboxMode?: boolean;
}

export interface SendBulkEmailData {
  personalizations: {
    to: EmailAddress | EmailAddress[];
    cc?: EmailAddress | EmailAddress[];
    bcc?: EmailAddress | EmailAddress[];
    subject?: string;
    dynamicTemplateData?: Record<string, any>;
    customArgs?: Record<string, string>;
    sendAt?: number;
  }[];
  from: EmailAddress | string;
  subject?: string;
  content?: {
    type: 'text/plain' | 'text/html';
    value: string;
  }[];
  templateId?: string;
  categories?: string[];
  batchId?: string;
  sandboxMode?: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables?: string[];
}

export interface EmailTemplateData {
  [key: string]: any;
}

// Pre-defined email templates
export const EMAIL_TEMPLATES = {
  WELCOME: {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to AI Sales Agent!',
    variables: ['firstName', 'companyName', 'loginUrl'],
  },
  VERIFY_EMAIL: {
    id: 'verify_email',
    name: 'Email Verification',
    subject: 'Verify your email address',
    variables: ['firstName', 'verificationUrl', 'expiresIn'],
  },
  RESET_PASSWORD: {
    id: 'reset_password',
    name: 'Password Reset',
    subject: 'Reset your password',
    variables: ['firstName', 'resetUrl', 'expiresIn'],
  },
  SUBSCRIPTION_ACTIVATED: {
    id: 'subscription_activated',
    name: 'Subscription Activated',
    subject: 'Your subscription is now active!',
    variables: ['firstName', 'planName', 'features', 'billingUrl'],
  },
  SUBSCRIPTION_CANCELED: {
    id: 'subscription_canceled',
    name: 'Subscription Canceled',
    subject: 'Your subscription has been canceled',
    variables: ['firstName', 'planName', 'endDate', 'reactivateUrl'],
  },
  PAYMENT_FAILED: {
    id: 'payment_failed',
    name: 'Payment Failed',
    subject: 'Payment failed - Action required',
    variables: ['firstName', 'amount', 'updatePaymentUrl', 'suspendDate'],
  },
  PROSPECT_REPLIED: {
    id: 'prospect_replied',
    name: 'Prospect Replied',
    subject: 'You have a new reply from {{prospectName}}!',
    variables: ['firstName', 'prospectName', 'prospectCompany', 'message', 'viewUrl'],
  },
  WEEKLY_REPORT: {
    id: 'weekly_report',
    name: 'Weekly Report',
    subject: 'Your weekly AI Sales Agent report',
    variables: ['firstName', 'stats', 'insights', 'recommendations', 'dashboardUrl'],
  },
  QUOTA_WARNING: {
    id: 'quota_warning',
    name: 'Quota Warning',
    subject: 'You\'re approaching your plan limits',
    variables: ['firstName', 'resource', 'used', 'limit', 'upgradeUrl'],
  },
  AI_INSIGHT: {
    id: 'ai_insight',
    name: 'AI Insight',
    subject: 'New AI insight for your prospects',
    variables: ['firstName', 'insightTitle', 'insightDescription', 'actionUrl'],
  },
} as const;

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface BulkEmailResponse {
  success: boolean;
  accepted: number;
  rejected: number;
  errors?: string[];
}

export interface EmailStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  spam: number;
  unsubscribed: number;
}

export interface SuppressionListEntry {
  email: string;
  reason: 'bounce' | 'spam' | 'unsubscribe' | 'invalid';
  createdAt: Date;
}

// Error class
export class SendGridError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'SendGridError';
  }
}