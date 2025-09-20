/**
 * SendGrid Webhooks Handler
 * Handles bounces, spam reports, unsubscribes, and other events
 * RGPD/CCPA compliant
 */

import crypto from 'crypto';
import { getSendGridClient, log } from './client';
import { addToSuppressionList } from './suppression';
import { EventWebhook, EventWebhookHeader } from '@sendgrid/eventwebhook';

export interface SendGridWebhookEvent {
  email: string;
  timestamp: number;
  event: 'bounce' | 'dropped' | 'spamreport' | 'unsubscribe' | 'group_unsubscribe' | 
         'click' | 'open' | 'delivered' | 'processed' | 'deferred';
  sg_event_id: string;
  sg_message_id: string;
  category?: string[];
  reason?: string;
  status?: string;
  attempt?: string;
  response?: string;
  url?: string;
  ip?: string;
  useragent?: string;
  type?: string;
}

/**
 * Verify SendGrid webhook signature
 */
export function verifyWebhookSignature(
  publicKey: string,
  payload: string | Buffer,
  signature: string,
  timestamp: string
): boolean {
  const eventWebhook = new EventWebhook();
  const ecdsaPublicKey = publicKey || process.env.SENDGRID_WEBHOOK_PUBLIC_KEY || '';
  
  try {
    return eventWebhook.verifySignature(
      ecdsaPublicKey,
      payload,
      signature,
      timestamp
    );
  } catch (error) {
    log('webhook.verify.error', error);
    return false;
  }
}

/**
 * Process SendGrid webhook events
 */
export async function processWebhookEvents(
  events: SendGridWebhookEvent[],
  options?: {
    storeEvents?: boolean;
    processUnsubscribes?: boolean;
    processBounces?: boolean;
    processSpam?: boolean;
  }
): Promise<void> {
  log('webhook.process.start', { eventCount: events.length });
  
  const config = {
    storeEvents: options?.storeEvents ?? true,
    processUnsubscribes: options?.processUnsubscribes ?? true,
    processBounces: options?.processBounces ?? true,
    processSpam: options?.processSpam ?? true,
  };

  for (const event of events) {
    try {
      log('webhook.event', { 
        event: event.event, 
        email: event.email,
        timestamp: new Date(event.timestamp * 1000).toISOString()
      });

      switch (event.event) {
        case 'bounce':
          if (config.processBounces) {
            await handleBounce(event);
          }
          break;
          
        case 'spamreport':
          if (config.processSpam) {
            await handleSpamReport(event);
          }
          break;
          
        case 'unsubscribe':
        case 'group_unsubscribe':
          if (config.processUnsubscribes) {
            await handleUnsubscribe(event);
          }
          break;
          
        case 'dropped':
          await handleDropped(event);
          break;
          
        case 'delivered':
          await handleDelivered(event);
          break;
          
        case 'open':
          await handleOpen(event);
          break;
          
        case 'click':
          await handleClick(event);
          break;
          
        default:
          log('webhook.event.unhandled', { event: event.event });
      }

      // Store event in database if enabled
      if (config.storeEvents) {
        await storeWebhookEvent(event);
      }
      
    } catch (error) {
      log('webhook.event.error', { event: event.event, error });
      // Continue processing other events
    }
  }
  
  log('webhook.process.complete', { eventCount: events.length });
}

/**
 * Handle bounce events
 */
async function handleBounce(event: SendGridWebhookEvent): Promise<void> {
  log('webhook.bounce', { email: event.email, reason: event.reason });
  
  // Add to suppression list
  await addToSuppressionList(event.email, 'bounce');
  
  // Store bounce details in database
  // TODO: Store in database with reason for analytics
}

/**
 * Handle spam report events
 */
async function handleSpamReport(event: SendGridWebhookEvent): Promise<void> {
  log('webhook.spam', { email: event.email });
  
  // Add to suppression list immediately
  await addToSuppressionList(event.email, 'spam');
  
  // RGPD/CCPA compliance: Mark as spam in database
  // TODO: Update database to mark contact as spam reporter
}

/**
 * Handle unsubscribe events
 */
async function handleUnsubscribe(event: SendGridWebhookEvent): Promise<void> {
  log('webhook.unsubscribe', { email: event.email });
  
  // Add to global suppression list
  await addToSuppressionList(event.email, 'unsubscribe');
  
  // RGPD/CCPA compliance: Store unsubscribe with timestamp
  // TODO: Update database with unsubscribe timestamp and source
}

/**
 * Handle dropped events
 */
async function handleDropped(event: SendGridWebhookEvent): Promise<void> {
  log('webhook.dropped', { 
    email: event.email, 
    reason: event.reason 
  });
  
  // Mark as invalid if dropped due to invalid email
  if (event.reason?.toLowerCase().includes('invalid')) {
    await addToSuppressionList(event.email, 'invalid');
  }
}

/**
 * Handle delivered events
 */
async function handleDelivered(event: SendGridWebhookEvent): Promise<void> {
  log('webhook.delivered', { 
    email: event.email,
    response: event.response 
  });
  
  // TODO: Update message status in database
}

/**
 * Handle open events
 */
async function handleOpen(event: SendGridWebhookEvent): Promise<void> {
  log('webhook.open', { 
    email: event.email,
    ip: event.ip,
    useragent: event.useragent 
  });
  
  // TODO: Track engagement metrics in database
}

/**
 * Handle click events
 */
async function handleClick(event: SendGridWebhookEvent): Promise<void> {
  log('webhook.click', { 
    email: event.email,
    url: event.url,
    ip: event.ip 
  });
  
  // TODO: Track link clicks in database
}

/**
 * Store webhook event in database for analytics
 */
async function storeWebhookEvent(event: SendGridWebhookEvent): Promise<void> {
  // TODO: Implement database storage
  // This should store in an events table for analytics and debugging
  log('webhook.store', { 
    event: event.event,
    email: event.email,
    messageId: event.sg_message_id 
  });
}

/**
 * Setup webhook endpoint in SendGrid
 */
export async function setupWebhookEndpoint(
  url: string,
  events: string[] = [
    'bounce',
    'click',
    'deferred',
    'delivered',
    'dropped',
    'group_resubscribe',
    'group_unsubscribe',
    'open',
    'processed',
    'spamreport',
    'unsubscribe'
  ]
): Promise<void> {
  log('webhook.setup.start', { url, events });
  
  try {
    const client = getSendGridClient();
    
    // Update webhook settings
    await client.request({
      method: 'PATCH',
      url: '/v3/user/webhooks/event/settings',
      body: {
        enabled: true,
        url,
        group_resubscribe: events.includes('group_resubscribe'),
        delivered: events.includes('delivered'),
        group_unsubscribe: events.includes('group_unsubscribe'),
        spam_report: events.includes('spamreport'),
        bounce: events.includes('bounce'),
        deferred: events.includes('deferred'),
        unsubscribe: events.includes('unsubscribe'),
        processed: events.includes('processed'),
        open: events.includes('open'),
        click: events.includes('click'),
        dropped: events.includes('dropped'),
        oauth_client_id: '',
        oauth_client_secret: '',
        oauth_token_url: ''
      }
    });
    
    log('webhook.setup.success', { url });
  } catch (error) {
    log('webhook.setup.error', error);
    throw error;
  }
}

/**
 * Get webhook settings
 */
export async function getWebhookSettings(): Promise<any> {
  try {
    const client = getSendGridClient();
    
    const [response, body] = await client.request({
      method: 'GET',
      url: '/v3/user/webhooks/event/settings'
    });
    
    return body;
  } catch (error) {
    log('webhook.settings.error', error);
    throw error;
  }
}

/**
 * Test webhook endpoint
 */
export async function testWebhook(url?: string): Promise<void> {
  try {
    const client = getSendGridClient();
    
    await client.request({
      method: 'POST',
      url: '/v3/user/webhooks/event/test',
      body: url ? { url } : {}
    });
    
    log('webhook.test.sent', { url });
  } catch (error) {
    log('webhook.test.error', error);
    throw error;
  }
}
