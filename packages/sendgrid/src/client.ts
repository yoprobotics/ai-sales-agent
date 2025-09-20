import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';

// Debug logger
const DEBUG = process.env.DEBUG?.includes('sendgrid');

function log(action: string, data?: any) {
  if (DEBUG) {
    console.log(`[SENDGRID] ${action}`, data ? JSON.stringify(data, null, 2) : '');
  }
}

// Singleton initialization flag
let isInitialized = false;

export interface SendGridConfig {
  apiKey?: string;
  fromEmail?: string;
  fromName?: string;
  debug?: boolean;
  sandboxMode?: boolean;
}

const defaultConfig: SendGridConfig = {
  fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@aisalesagent.com',
  fromName: process.env.SENDGRID_FROM_NAME || 'AI Sales Agent',
  sandboxMode: process.env.NODE_ENV === 'development',
};

/**
 * Initialize SendGrid client
 */
export function initializeSendGrid(config?: SendGridConfig): void {
  if (isInitialized && !config) {
    return;
  }

  const apiKey = config?.apiKey || process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    throw new Error('SendGrid API key not configured');
  }

  sgMail.setApiKey(apiKey);
  sgClient.setApiKey(apiKey);
  
  isInitialized = true;
  
  log('client.init', { 
    sandboxMode: config?.sandboxMode || defaultConfig.sandboxMode,
    debug: config?.debug || DEBUG,
    fromEmail: config?.fromEmail || defaultConfig.fromEmail,
  });
}

/**
 * Get SendGrid mail client
 */
export function getSendGridMail() {
  if (!isInitialized) {
    initializeSendGrid();
  }
  return sgMail;
}

/**
 * Get SendGrid API client
 */
export function getSendGridClient() {
  if (!isInitialized) {
    initializeSendGrid();
  }
  return sgClient;
}

/**
 * Reset SendGrid client (useful for testing)
 */
export function resetSendGrid(): void {
  isInitialized = false;
  log('client.reset');
}

/**
 * Get default sender configuration
 */
export function getDefaultSender(): { email: string; name: string } {
  return {
    email: defaultConfig.fromEmail!,
    name: defaultConfig.fromName!,
  };
}

/**
 * Check if in sandbox mode (for testing)
 */
export function isSandboxMode(): boolean {
  return defaultConfig.sandboxMode || false;
}

export { log };