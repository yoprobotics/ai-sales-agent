import { getSendGridMail, log, getDefaultSender, isSandboxMode } from './client';
import { handleSendGridError, retryWithBackoff } from './errors';
import { SendEmailData, EmailResponse, EmailAddress } from './types';

/**
 * Normalize email address to SendGrid format
 */
function normalizeEmailAddress(email: EmailAddress | string): EmailAddress {
  if (typeof email === 'string') {
    return { email };
  }
  return email;
}

/**
 * Send a single email
 */
export async function sendEmail(data: SendEmailData): Promise<EmailResponse> {
  log('email.send.start', { 
    to: data.to, 
    subject: data.subject,
    templateId: data.templateId 
  });

  try {
    const sgMail = getSendGridMail();
    const defaultSender = getDefaultSender();
    
    // Normalize email addresses
    const to = Array.isArray(data.to) 
      ? data.to.map(normalizeEmailAddress)
      : normalizeEmailAddress(data.to);
    
    const from = data.from 
      ? normalizeEmailAddress(data.from)
      : defaultSender;

    // Build message
    const msg: any = {
      to,
      from,
      subject: data.subject,
    };

    // Add content
    if (data.templateId) {
      msg.templateId = data.templateId;
      if (data.dynamicTemplateData) {
        msg.dynamicTemplateData = data.dynamicTemplateData;
      }
    } else {
      if (data.html) msg.html = data.html;
      if (data.text) msg.text = data.text;
    }

    // Add optional fields
    if (data.cc) {
      msg.cc = Array.isArray(data.cc) 
        ? data.cc.map(normalizeEmailAddress)
        : normalizeEmailAddress(data.cc);
    }
    
    if (data.bcc) {
      msg.bcc = Array.isArray(data.bcc) 
        ? data.bcc.map(normalizeEmailAddress)
        : normalizeEmailAddress(data.bcc);
    }
    
    if (data.replyTo) {
      msg.replyTo = normalizeEmailAddress(data.replyTo);
    }
    
    if (data.attachments) {
      msg.attachments = data.attachments;
    }
    
    if (data.categories) {
      msg.categories = data.categories;
    }
    
    if (data.customArgs) {
      msg.customArgs = data.customArgs;
    }
    
    if (data.sendAt) {
      msg.sendAt = data.sendAt;
    }
    
    if (data.batchId) {
      msg.batchId = data.batchId;
    }

    // Set sandbox mode for testing
    if (data.sandboxMode || isSandboxMode()) {
      msg.mailSettings = {
        sandboxMode: {
          enable: true,
        },
      };
    }

    // Send email with retry
    const response = await retryWithBackoff(() => sgMail.send(msg));

    log('email.send.success', { 
      messageId: Array.isArray(response) ? response[0].headers['x-message-id'] : response.headers['x-message-id'],
      to: data.to,
    });

    return {
      success: true,
      messageId: Array.isArray(response) ? response[0].headers['x-message-id'] : response.headers['x-message-id'],
    };
  } catch (error) {
    log('email.send.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Send multiple emails in a batch
 */
export async function sendBulkEmails(
  emails: SendEmailData[]
): Promise<EmailResponse[]> {
  log('email.sendBulk.start', { count: emails.length });

  const results: EmailResponse[] = [];
  const batchSize = 100; // SendGrid limit

  try {
    // Process in batches
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      // Send batch in parallel
      const batchResults = await Promise.allSettled(
        batch.map(email => sendEmail(email))
      );

      // Process results
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            success: false,
            error: result.reason.message,
          });
        }
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    log('email.sendBulk.complete', { 
      total: emails.length,
      success: successCount,
      failed: failureCount,
    });

    return results;
  } catch (error) {
    log('email.sendBulk.error', error);
    throw handleSendGridError(error);
  }
}

/**
 * Send email with template
 */
export async function sendTemplateEmail(
  to: string | EmailAddress,
  templateId: string,
  templateData?: Record<string, any>,
  options?: Partial<SendEmailData>
): Promise<EmailResponse> {
  log('email.sendTemplate.start', { to, templateId });

  return sendEmail({
    to,
    subject: '', // Subject comes from template
    templateId,
    dynamicTemplateData: templateData,
    ...options,
  });
}

/**
 * Schedule an email to be sent later
 */
export async function scheduleEmail(
  data: SendEmailData,
  sendAt: Date
): Promise<EmailResponse> {
  log('email.schedule.start', { 
    to: data.to, 
    sendAt: sendAt.toISOString() 
  });

  const sendAtTimestamp = Math.floor(sendAt.getTime() / 1000);
  
  // SendGrid requires sendAt to be at least 60 seconds in the future
  const minSendAt = Math.floor(Date.now() / 1000) + 60;
  
  if (sendAtTimestamp < minSendAt) {
    throw new Error('Scheduled time must be at least 60 seconds in the future');
  }

  return sendEmail({
    ...data,
    sendAt: sendAtTimestamp,
  });
}