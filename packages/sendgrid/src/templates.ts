import Handlebars from 'handlebars';
import { log } from './client';
import { sendTemplateEmail } from './send';
import { EmailAddress, EmailTemplate, EMAIL_TEMPLATES } from './types';

// Template cache
const compiledTemplates = new Map<string, HandlebarsTemplateDelegate>();

/**
 * Register Handlebars helpers
 */
function registerHelpers() {
  // Format currency
  Handlebars.registerHelper('currency', (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  });

  // Format date
  Handlebars.registerHelper('date', (date: Date | string, format = 'short') => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (format === 'short') {
      return d.toLocaleDateString();
    }
    return d.toLocaleString();
  });

  // Pluralize
  Handlebars.registerHelper('pluralize', (count: number, singular: string, plural?: string) => {
    return count === 1 ? singular : (plural || `${singular}s`);
  });

  // If equals
  Handlebars.registerHelper('ifEquals', function(arg1: any, arg2: any, options: any) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  });
}

// Register helpers on initialization
registerHelpers();

/**
 * Compile a Handlebars template
 */
export function compileTemplate(template: string): HandlebarsTemplateDelegate {
  return Handlebars.compile(template);
}

/**
 * Render a template with data
 */
export function renderTemplate(template: string, data: Record<string, any>): string {
  const compiled = compileTemplate(template);
  return compiled(data);
}

/**
 * Get or compile a cached template
 */
function getCachedTemplate(templateId: string, template: string): HandlebarsTemplateDelegate {
  if (!compiledTemplates.has(templateId)) {
    compiledTemplates.set(templateId, compileTemplate(template));
  }
  return compiledTemplates.get(templateId)!;
}

/**
 * Send a welcome email
 */
export async function sendWelcomeEmail(
  to: string | EmailAddress,
  data: {
    firstName: string;
    companyName?: string;
    loginUrl?: string;
  }
) {
  log('template.welcome.send', { to });

  const templateData = {
    firstName: data.firstName,
    companyName: data.companyName || 'your company',
    loginUrl: data.loginUrl || `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    year: new Date().getFullYear(),
  };

  return sendTemplateEmail(
    to,
    process.env.SENDGRID_TEMPLATE_WELCOME || EMAIL_TEMPLATES.WELCOME.id,
    templateData,
    {
      categories: ['welcome', 'transactional'],
    }
  );
}

/**
 * Send email verification
 */
export async function sendVerificationEmail(
  to: string | EmailAddress,
  data: {
    firstName: string;
    verificationUrl: string;
    expiresIn?: string;
  }
) {
  log('template.verification.send', { to });

  const templateData = {
    firstName: data.firstName,
    verificationUrl: data.verificationUrl,
    expiresIn: data.expiresIn || '24 hours',
    year: new Date().getFullYear(),
  };

  return sendTemplateEmail(
    to,
    process.env.SENDGRID_TEMPLATE_VERIFY_EMAIL || EMAIL_TEMPLATES.VERIFY_EMAIL.id,
    templateData,
    {
      categories: ['verification', 'transactional'],
    }
  );
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string | EmailAddress,
  data: {
    firstName: string;
    resetUrl: string;
    expiresIn?: string;
  }
) {
  log('template.passwordReset.send', { to });

  const templateData = {
    firstName: data.firstName,
    resetUrl: data.resetUrl,
    expiresIn: data.expiresIn || '1 hour',
    year: new Date().getFullYear(),
  };

  return sendTemplateEmail(
    to,
    process.env.SENDGRID_TEMPLATE_RESET_PASSWORD || EMAIL_TEMPLATES.RESET_PASSWORD.id,
    templateData,
    {
      categories: ['password-reset', 'transactional'],
    }
  );
}

/**
 * Send subscription activated email
 */
export async function sendSubscriptionActivatedEmail(
  to: string | EmailAddress,
  data: {
    firstName: string;
    planName: string;
    features: string[];
    billingUrl?: string;
  }
) {
  log('template.subscriptionActivated.send', { to });

  const templateData = {
    firstName: data.firstName,
    planName: data.planName,
    features: data.features,
    billingUrl: data.billingUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    year: new Date().getFullYear(),
  };

  return sendTemplateEmail(
    to,
    process.env.SENDGRID_TEMPLATE_SUBSCRIPTION_ACTIVATED || EMAIL_TEMPLATES.SUBSCRIPTION_ACTIVATED.id,
    templateData,
    {
      categories: ['subscription', 'transactional'],
    }
  );
}

/**
 * Send payment failed email
 */
export async function sendPaymentFailedEmail(
  to: string | EmailAddress,
  data: {
    firstName: string;
    amount: number;
    updatePaymentUrl?: string;
    suspendDate?: Date;
  }
) {
  log('template.paymentFailed.send', { to });

  const templateData = {
    firstName: data.firstName,
    amount: data.amount,
    updatePaymentUrl: data.updatePaymentUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    suspendDate: data.suspendDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    year: new Date().getFullYear(),
  };

  return sendTemplateEmail(
    to,
    process.env.SENDGRID_TEMPLATE_PAYMENT_FAILED || EMAIL_TEMPLATES.PAYMENT_FAILED.id,
    templateData,
    {
      categories: ['payment', 'urgent', 'transactional'],
    }
  );
}

/**
 * Send prospect replied notification
 */
export async function sendProspectRepliedEmail(
  to: string | EmailAddress,
  data: {
    firstName: string;
    prospectName: string;
    prospectCompany: string;
    message: string;
    viewUrl: string;
  }
) {
  log('template.prospectReplied.send', { to });

  const templateData = {
    ...data,
    messagePreview: data.message.substring(0, 200),
    year: new Date().getFullYear(),
  };

  return sendTemplateEmail(
    to,
    process.env.SENDGRID_TEMPLATE_PROSPECT_REPLIED || EMAIL_TEMPLATES.PROSPECT_REPLIED.id,
    templateData,
    {
      categories: ['prospect', 'notification'],
    }
  );
}

/**
 * Send weekly report email
 */
export async function sendWeeklyReportEmail(
  to: string | EmailAddress,
  data: {
    firstName: string;
    stats: {
      prospectsContacted: number;
      emailsSent: number;
      repliesReceived: number;
      meetingsScheduled: number;
    };
    insights: string[];
    recommendations: string[];
    dashboardUrl?: string;
  }
) {
  log('template.weeklyReport.send', { to });

  const templateData = {
    ...data,
    dashboardUrl: data.dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    weekEnding: new Date().toLocaleDateString(),
    year: new Date().getFullYear(),
  };

  return sendTemplateEmail(
    to,
    process.env.SENDGRID_TEMPLATE_WEEKLY_REPORT || EMAIL_TEMPLATES.WEEKLY_REPORT.id,
    templateData,
    {
      categories: ['report', 'weekly'],
    }
  );
}

/**
 * Create custom HTML template
 */
export function createHtmlTemplate(
  content: string,
  options?: {
    title?: string;
    preheader?: string;
    footer?: boolean;
  }
): string {
  const title = options?.title || 'AI Sales Agent';
  const preheader = options?.preheader || '';
  const showFooter = options?.footer !== false;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
            background-color: #f7f7f7;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .card {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
        }
        h1 {
            color: #1a1a1a;
            font-size: 28px;
            margin: 0 0 10px;
        }
        h2 {
            color: #1a1a1a;
            font-size: 22px;
            margin: 20px 0 10px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #666666;
            margin-top: 40px;
        }
        .footer a {
            color: #2563eb;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .container {
                padding: 10px;
            }
            .card {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div style="display: none; max-height: 0; overflow: hidden;">
        ${preheader}
    </div>
    <div class="container">
        <div class="card">
            <div class="header">
                <div class="logo">🚀 AI Sales Agent</div>
            </div>
            ${content}
        </div>
        ${showFooter ? `
        <div class="footer">
            <p>© ${new Date().getFullYear()} AI Sales Agent. All rights reserved.</p>
            <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">Unsubscribe</a> |
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/preferences">Email Preferences</a> |
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy">Privacy Policy</a>
            </p>
        </div>
        ` : ''}
    </div>
</body>
</html>
  `.trim();
}