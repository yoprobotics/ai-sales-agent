import Stripe from 'stripe';

// Singleton Stripe client
let stripeClient: Stripe | null = null;

// Debug logger
const DEBUG = process.env.DEBUG?.includes('stripe');

function log(action: string, data?: any) {
  if (DEBUG) {
    console.log(`[STRIPE] ${action}`, data ? JSON.stringify(data, null, 2) : '');
  }
}

export interface StripeConfig {
  apiKey?: string;
  apiVersion?: string;
  testMode?: boolean;
  debug?: boolean;
}

/**
 * Create or get Stripe client singleton
 * @param config - Stripe configuration
 * @returns Stripe client instance
 */
export function getStripeClient(config?: StripeConfig): Stripe {
  if (!stripeClient) {
    const apiKey = config?.apiKey || process.env.STRIPE_SECRET_KEY;
    
    if (!apiKey) {
      throw new Error('Stripe API key not configured');
    }

    log('client.init', { 
      testMode: config?.testMode || apiKey.startsWith('sk_test'),
      debug: config?.debug || DEBUG 
    });

    stripeClient = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
      typescript: true,
      telemetry: false, // Disable telemetry for privacy
    });
  }

  return stripeClient;
}

/**
 * Reset Stripe client (useful for testing)
 */
export function resetStripeClient(): void {
  stripeClient = null;
  log('client.reset');
}

/**
 * Check if Stripe is in test mode
 */
export function isTestMode(): boolean {
  const apiKey = process.env.STRIPE_SECRET_KEY || '';
  return apiKey.startsWith('sk_test');
}

/**
 * Format amount for Stripe (convert to cents)
 * @param amount - Amount in dollars
 * @param currency - Currency code
 */
export function formatAmountForStripe(amount: number, currency: string = 'usd'): number {
  // Stripe expects amounts in smallest currency unit (cents for USD)
  const multiplier = currency.toLowerCase() === 'jpy' ? 1 : 100;
  return Math.round(amount * multiplier);
}

/**
 * Format amount from Stripe (convert from cents)
 * @param amount - Amount in cents
 * @param currency - Currency code
 */
export function formatAmountFromStripe(amount: number, currency: string = 'usd'): number {
  const divisor = currency.toLowerCase() === 'jpy' ? 1 : 100;
  return amount / divisor;
}

export { log };