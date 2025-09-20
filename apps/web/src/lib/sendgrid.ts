import sgMail from '@sendgrid/mail';
import { Language } from '@/packages/i18n';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailData {
  to: string | string[];
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  attachments?: Array<{
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
  }>;
  categories?: string[];
  sendAt?: number;
}

// Send a single email
export async function sendEmail(data: EmailData): Promise<void> {
  const msg = {
    ...data,
    from: data.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@aisalesagent.com',
    categories: data.categories || ['transactional'],
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${data.to}`);
  } catch (error: any) {
    console.error('SendGrid Error:', error?.response?.body || error);
    throw new Error(`Failed to send email: ${error?.message || 'Unknown error'}`);
  }
}

// Send multiple emails
export async function sendBulkEmails(emails: EmailData[]): Promise<void> {
  const messages = emails.map((email) => ({
    ...email,
    from: email.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@aisalesagent.com',
    categories: email.categories || ['bulk'],
  }));

  try {
    await sgMail.send(messages);
    console.log(`Bulk emails sent successfully (${emails.length} recipients)`);
  } catch (error: any) {
    console.error('SendGrid Bulk Error:', error?.response?.body || error);
    throw new Error(`Failed to send bulk emails: ${error?.message || 'Unknown error'}`);
  }
}

// Email templates
export const EmailTemplates = {
  // Welcome email template
  async sendWelcomeEmail(
    email: string,
    firstName: string,
    language: Language = 'en'
  ): Promise<void> {
    const templateId = language === 'fr'
      ? process.env.SENDGRID_WELCOME_FR_TEMPLATE_ID
      : process.env.SENDGRID_WELCOME_EN_TEMPLATE_ID;

    if (templateId) {
      // Use SendGrid template
      await sendEmail({
        to: email,
        templateId,
        dynamicTemplateData: {
          firstName,
          loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.aisalesagent.com'}/login`,
          supportEmail: 'support@aisalesagent.com',
        },
      });
    } else {
      // Fallback to HTML template
      const subject = language === 'fr'
        ? `Bienvenue chez AI Sales Agent, ${firstName}!`
        : `Welcome to AI Sales Agent, ${firstName}!`;

      const html = language === 'fr'
        ? `
          <h2>Bienvenue ${firstName}!</h2>
          <p>Merci de vous être inscrit à AI Sales Agent.</p>
          <p>Vous pouvez maintenant vous connecter et commencer à qualifier vos prospects avec l'IA.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Se connecter</a>
          <p>Cordialement,<br>L'équipe AI Sales Agent</p>
        `
        : `
          <h2>Welcome ${firstName}!</h2>
          <p>Thank you for signing up for AI Sales Agent.</p>
          <p>You can now log in and start qualifying your prospects with AI.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Log In</a>
          <p>Best regards,<br>The AI Sales Agent Team</p>
        `;

      await sendEmail({
        to: email,
        subject,
        html,
        categories: ['welcome'],
      });
    }
  },

  // Password reset email
  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    language: Language = 'en'
  ): Promise<void> {
    const templateId = language === 'fr'
      ? process.env.SENDGRID_RESET_FR_TEMPLATE_ID
      : process.env.SENDGRID_RESET_EN_TEMPLATE_ID;

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    if (templateId) {
      await sendEmail({
        to: email,
        templateId,
        dynamicTemplateData: {
          resetUrl,
          expirationTime: '1 hour',
        },
      });
    } else {
      const subject = language === 'fr'
        ? 'Réinitialisation de votre mot de passe'
        : 'Reset Your Password';

      const html = language === 'fr'
        ? `
          <h2>Réinitialisation du mot de passe</h2>
          <p>Vous avez demandé une réinitialisation de mot de passe.</p>
          <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:</p>
          <a href="${resetUrl}">Réinitialiser le mot de passe</a>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet e-mail.</p>
        `
        : `
          <h2>Password Reset</h2>
          <p>You requested a password reset.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
        `;

      await sendEmail({
        to: email,
        subject,
        html,
        categories: ['password-reset'],
      });
    }
  },

  // Subscription confirmation email
  async sendSubscriptionEmail(
    email: string,
    planName: string,
    firstName: string,
    language: Language = 'en'
  ): Promise<void> {
    const subject = language === 'fr'
      ? `Confirmation d'abonnement - Plan ${planName}`
      : `Subscription Confirmation - ${planName} Plan`;

    const html = language === 'fr'
      ? `
        <h2>Merci pour votre abonnement, ${firstName}!</h2>
        <p>Votre abonnement au plan <strong>${planName}</strong> est maintenant actif.</p>
        <p>Vous pouvez gérer votre abonnement dans les paramètres de votre compte.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings/billing">Gérer l'abonnement</a>
      `
      : `
        <h2>Thank you for subscribing, ${firstName}!</h2>
        <p>Your subscription to the <strong>${planName}</strong> plan is now active.</p>
        <p>You can manage your subscription in your account settings.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings/billing">Manage Subscription</a>
      `;

    await sendEmail({
      to: email,
      subject,
      html,
      categories: ['subscription'],
    });
  },

  // Prospect qualified notification
  async sendProspectQualifiedEmail(
    email: string,
    prospectName: string,
    score: number,
    language: Language = 'en'
  ): Promise<void> {
    const subject = language === 'fr'
      ? `Nouveau prospect qualifié: ${prospectName} (Score: ${score})`
      : `New Qualified Prospect: ${prospectName} (Score: ${score})`;

    const html = language === 'fr'
      ? `
        <h2>Nouveau prospect qualifié!</h2>
        <p><strong>${prospectName}</strong> a été qualifié avec un score de <strong>${score}/100</strong>.</p>
        <p>Connectez-vous pour voir les détails et prendre action.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/prospects">Voir les prospects</a>
      `
      : `
        <h2>New Qualified Prospect!</h2>
        <p><strong>${prospectName}</strong> has been qualified with a score of <strong>${score}/100</strong>.</p>
        <p>Log in to view details and take action.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/prospects">View Prospects</a>
      `;

    await sendEmail({
      to: email,
      subject,
      html,
      categories: ['notification', 'prospect'],
    });
  },

  // Sequence completed notification
  async sendSequenceCompletedEmail(
    email: string,
    sequenceName: string,
    stats: {
      sent: number;
      opened: number;
      replied: number;
    },
    language: Language = 'en'
  ): Promise<void> {
    const subject = language === 'fr'
      ? `Séquence terminée: ${sequenceName}`
      : `Sequence Completed: ${sequenceName}`;

    const html = language === 'fr'
      ? `
        <h2>Séquence d'emails terminée</h2>
        <p>La séquence <strong>${sequenceName}</strong> est maintenant terminée.</p>
        <h3>Statistiques:</h3>
        <ul>
          <li>Emails envoyés: ${stats.sent}</li>
          <li>Emails ouverts: ${stats.opened}</li>
          <li>Réponses reçues: ${stats.replied}</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/sequences">Voir les séquences</a>
      `
      : `
        <h2>Email Sequence Completed</h2>
        <p>The sequence <strong>${sequenceName}</strong> has been completed.</p>
        <h3>Statistics:</h3>
        <ul>
          <li>Emails sent: ${stats.sent}</li>
          <li>Emails opened: ${stats.opened}</li>
          <li>Replies received: ${stats.replied}</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/sequences">View Sequences</a>
      `;

    await sendEmail({
      to: email,
      subject,
      html,
      categories: ['notification', 'sequence'],
    });
  },

  // Weekly report email
  async sendWeeklyReportEmail(
    email: string,
    firstName: string,
    stats: {
      newProspects: number;
      qualifiedProspects: number;
      emailsSent: number;
      responseRate: number;
    },
    language: Language = 'en'
  ): Promise<void> {
    const subject = language === 'fr'
      ? 'Votre rapport hebdomadaire AI Sales Agent'
      : 'Your Weekly AI Sales Agent Report';

    const html = language === 'fr'
      ? `
        <h2>Bonjour ${firstName},</h2>
        <p>Voici votre rapport hebdomadaire:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Nouveaux prospects</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${stats.newProspects}</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Prospects qualifiés</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${stats.qualifiedProspects}</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Emails envoyés</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${stats.emailsSent}</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Taux de réponse</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${stats.responseRate}%</strong></td>
          </tr>
        </table>
        <p>Continuez votre excellent travail!</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/analytics">Voir les analyses complètes</a>
      `
      : `
        <h2>Hello ${firstName},</h2>
        <p>Here's your weekly report:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">New Prospects</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${stats.newProspects}</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Qualified Prospects</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${stats.qualifiedProspects}</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Emails Sent</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${stats.emailsSent}</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Response Rate</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${stats.responseRate}%</strong></td>
          </tr>
        </table>
        <p>Keep up the great work!</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/analytics">View Full Analytics</a>
      `;

    await sendEmail({
      to: email,
      subject,
      html,
      categories: ['report', 'weekly'],
    });
  },
};

// Validate email configuration
export function isEmailConfigured(): boolean {
  return !!(
    process.env.SENDGRID_API_KEY &&
    process.env.SENDGRID_FROM_EMAIL
  );
}

// Get email stats (for admin dashboard)
export async function getEmailStats(startDate: Date, endDate: Date) {
  // This would typically call SendGrid's statistics API
  // For now, return mock data
  return {
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    spam: 0,
  };
}
