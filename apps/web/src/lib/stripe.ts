// Stripe service mock for MVP
// TODO: Replace with actual Stripe integration

export const STRIPE_PRICE_IDS = {
  STARTER_MONTHLY: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || 'price_starter_monthly',
  STARTER_YEARLY: process.env.STRIPE_STARTER_YEARLY_PRICE_ID || 'price_starter_yearly',
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
  PRO_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
  BUSINESS_MONTHLY: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || 'price_business_monthly',
  BUSINESS_YEARLY: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || 'price_business_yearly',
} as const

export function getPlanFromPriceId(priceId: string): string | null {
  const priceMap: { [key: string]: string } = {
    [STRIPE_PRICE_IDS.STARTER_MONTHLY]: 'STARTER',
    [STRIPE_PRICE_IDS.STARTER_YEARLY]: 'STARTER',
    [STRIPE_PRICE_IDS.PRO_MONTHLY]: 'PRO',
    [STRIPE_PRICE_IDS.PRO_YEARLY]: 'PRO',
    [STRIPE_PRICE_IDS.BUSINESS_MONTHLY]: 'BUSINESS',
    [STRIPE_PRICE_IDS.BUSINESS_YEARLY]: 'BUSINESS',
  }
  return priceMap[priceId] || null
}

// Mock Stripe service for MVP
export const stripeService = {
  createCustomer: async (email: string, name: string) => {
    // In production, this would call Stripe API
    return {
      id: `cus_mock_${Date.now()}`,
      email,
      name,
    }
  },

  createCheckoutSession: async (params: {
    customerId: string
    priceId: string
    successUrl: string
    cancelUrl: string
  }) => {
    // In production, this would call Stripe API
    return {
      id: `cs_mock_${Date.now()}`,
      url: params.successUrl + '&mock=true',
    }
  },

  createBillingPortalSession: async (customerId: string, returnUrl: string) => {
    // In production, this would call Stripe API
    return {
      url: returnUrl + '?portal=mock',
    }
  },
}