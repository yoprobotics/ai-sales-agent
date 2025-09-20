import { NextApiRequest, NextApiResponse } from 'next';
import { 
  verifyWebhookSignature,
  processWebhookEvents,
  type SendGridWebhookEvent 
} from '@ai-sales-agent/sendgrid';
import { log } from '@ai-sales-agent/core/utils';

/**
 * SendGrid Webhook Handler
 * Processes bounces, spam reports, unsubscribes, and other email events
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook signature for security
    const signature = req.headers['x-twilio-email-event-webhook-signature'] as string;
    const timestamp = req.headers['x-twilio-email-event-webhook-timestamp'] as string;
    const publicKey = process.env.SENDGRID_WEBHOOK_PUBLIC_KEY || '';
    
    // Get raw body for signature verification
    const rawBody = JSON.stringify(req.body);
    
    // Verify signature if public key is configured
    if (publicKey) {
      const isValid = verifyWebhookSignature(
        publicKey,
        rawBody,
        signature,
        timestamp
      );
      
      if (!isValid) {
        log('webhook.invalid_signature', { 
          signature,
          timestamp,
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        });
        
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }
    
    // Parse webhook events
    const events: SendGridWebhookEvent[] = req.body;
    
    if (!Array.isArray(events)) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }
    
    log('webhook.received', { 
      eventCount: events.length,
      types: [...new Set(events.map(e => e.event))],
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });
    
    // Process events asynchronously
    await processWebhookEvents(events, {
      storeEvents: true,
      processUnsubscribes: true,
      processBounces: true,
      processSpam: true,
    });
    
    // Return success immediately (SendGrid expects 2xx response)
    res.status(200).json({ 
      success: true,
      processed: events.length 
    });
    
  } catch (error) {
    log('webhook.error', error);
    
    // Return success even on error to prevent SendGrid retries
    // Log the error for debugging
    res.status(200).json({ 
      success: false,
      error: 'Internal error logged' 
    });
  }
}

// Disable body parser to get raw body for signature verification
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
