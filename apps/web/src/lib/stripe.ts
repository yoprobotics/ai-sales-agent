// Stripe configuration and utilities

export interface StripeConfig {
  publishableKey: string
  secretKey: string
  webhookSecret: string
}

// Mock Stripe functionality until properly configured
class StripeService {
  private isConfigured: boolean = false

  constructor() {
    this.isConfigured = !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY)
  }

  async createCustomer(email: string, name?: string) {
    if (!this.isConfigured) {
      console.log('Stripe not configured - mock customer creation')
      return { id: `mock_customer_${Date.now()}`, email, name }
    }
    
    // TODO: Implement actual Stripe customer creation
    const stripe = await this.getStripe()
    if (!stripe) return null
    
    return { id: `cus_mock_${Date.now()}`, email, name }
  }

  async createSubscription(customerId: string, priceId: string) {
    if (!this.isConfigured) {
      console.log('Stripe not configured - mock subscription')
      return { 
        id: `mock_sub_${Date.now()}`,
        customer: customerId,
        price: priceId,
        status: 'active'
      }
    }

    // TODO: Implement actual Stripe subscription
    return {
      id: `sub_mock_${Date.now()}`,
      customer: customerId,
      price: priceId,
      status: 'active'
    }
  }

  async createBillingPortalSession(customerId: string, returnUrl: string) {
    if (!this.isConfigured) {
      console.log('Stripe not configured - mock portal session')
      return { url: returnUrl }
    }

    // TODO: Implement actual billing portal session
    return { url: `${returnUrl}?session=mock` }
  }

  async createCheckoutSession({
    customerId,
    priceId,
    successUrl,
    cancelUrl
  }: {
    customerId: string
    priceId: string
    successUrl: string
    cancelUrl: string
  }) {
    if (!this.isConfigured) {
      console.log('Stripe not configured - mock checkout')
      return { url: successUrl }
    }

    // TODO: Implement actual checkout session
    return { url: `${successUrl}?session=mock` }
  }

  private async getStripe() {
    if (!this.isConfigured) return null
    
    try {
      // Dynamic import to avoid build errors when Stripe is not configured
      const Stripe = (await import('stripe')).default
      return new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2023-10-16',
        typescript: true,
      })
    } catch (error) {
      console.error('Failed to initialize Stripe:', error)
      return null
    }
  }
}

// Export singleton instance
export const stripeService = new StripeService()

// Plan configuration
export const PLAN_FEATURES = {
  STARTER: {
    prospectsLimit: 200,
    icpsLimit: 1,
    sequencesLimit: 1,
    messagesLimit: 1000,
  },
  PRO: {
    prospectsLimit: 2000,
    icpsLimit: 5,
    sequencesLimit: 10,
    messagesLimit: 10000,
  },
  BUSINESS: {
    prospectsLimit: -1, // unlimited
    icpsLimit: -1,
    sequencesLimit: -1,
    messagesLimit: -1,
  },
} as const

// Price IDs mapping (replace with actual Stripe price IDs)
export const STRIPE_PRICE_IDS = {
  STARTER_MONTHLY: process.env.STRIPE_PRICE_STARTER_MONTHLY || 'price_starter_monthly',
  STARTER_YEARLY: process.env.STRIPE_PRICE_STARTER_YEARLY || 'price_starter_yearly',
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
  PRO_YEARLY: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
  BUSINESS_MONTHLY: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || 'price_business_monthly',
  BUSINESS_YEARLY: process.env.STRIPE_PRICE_BUSINESS_YEARLY || 'price_business_yearly',
} as const

export function getPlanFromPriceId(priceId: string | undefined): 'STARTER' | 'PRO' | 'BUSINESS' {
  if (!priceId) return 'STARTER'
  
  if (priceId.includes('starter')) return 'STARTER'
  if (priceId.includes('pro')) return 'PRO'
  if (priceId.includes('business')) return 'BUSINESS'
  
  // Check against actual price IDs
  if (
    priceId === STRIPE_PRICE_IDS.STARTER_MONTHLY ||
    priceId === STRIPE_PRICE_IDS.STARTER_YEARLY
  ) {
    return 'STARTER'
  }
  
  if (
    priceId === STRIPE_PRICE_IDS.PRO_MONTHLY ||
    priceId === STRIPE_PRICE_IDS.PRO_YEARLY
  ) {
    return 'PRO'
  }
  
  if (
    priceId === STRIPE_PRICE_IDS.BUSINESS_MONTHLY ||
    priceId === STRIPE_PRICE_IDS.BUSINESS_YEARLY
  ) {
    return 'BUSINESS'
  }
  
  return 'STARTER'
}

// Webhook signature verification
export function constructWebhookEvent(body: string, signature: string, secret: string) {
  // Mock implementation for development
  if (!secret || secret === 'mock_webhook_secret') {
    return JSON.parse(body)
  }
  
  // TODO: Implement actual Stripe webhook verification
  try {
    return JSON.parse(body)
  } catch (error) {
    throw new Error('Invalid webhook payload')
  }
}