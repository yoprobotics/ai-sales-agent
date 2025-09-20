import Stripe from 'stripe';

// Initialize Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Stripe configuration
export const STRIPE_CONFIG = {
  // Price IDs for different plans (set these in your .env)
  prices: {
    starter: {
      monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
      yearly: process.env.STRIPE_PRICE_STARTER_YEARLY!,
    },
    pro: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY!,
    },
    business: {
      monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY!,
      yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY!,
    },
  },
  
  // Trial period settings
  trial: {
    enabled: process.env.STRIPE_TRIAL_ENABLED === 'true',
    days: parseInt(process.env.STRIPE_TRIAL_DAYS || '14'),
  },
  
  // Webhook endpoint
  webhook: {
    secret: process.env.STRIPE_WEBHOOK_SECRET!,
    tolerance: 300, // 5 minutes
  },
};

// Plan features and limits
export const PLAN_FEATURES = {
  STARTER: {
    name: 'Starter',
    prospectsLimit: 200,
    icpsLimit: 1,
    sequencesLimit: 1,
    messagesLimit: 1000,
    features: {
      basicAI: true,
      emailSequences: true,
      basicReports: true,
      emailSupport: true,
      multiChannel: false,
      apiAccess: false,
      customIntegrations: false,
      advancedAI: false,
    },
  },
  PRO: {
    name: 'Pro',
    prospectsLimit: 2000,
    icpsLimit: 5,
    sequencesLimit: 10,
    messagesLimit: 10000,
    features: {
      basicAI: true,
      emailSequences: true,
      basicReports: true,
      emailSupport: true,
      multiChannel: true,
      apiAccess: true,
      customIntegrations: false,
      advancedAI: true,
      keywordWatching: true,
      prioritySupport: true,
    },
  },
  BUSINESS: {
    name: 'Business',
    prospectsLimit: -1, // unlimited
    icpsLimit: -1, // unlimited
    sequencesLimit: -1, // unlimited
    messagesLimit: -1, // unlimited
    features: {
      basicAI: true,
      emailSequences: true,
      basicReports: true,
      emailSupport: true,
      multiChannel: true,
      apiAccess: true,
      customIntegrations: true,
      advancedAI: true,
      keywordWatching: true,
      prioritySupport: true,
      crmIntegrations: true,
      predictiveAnalytics: true,
      customBranding: true,
      dedicatedSupport: true,
    },
  },
};

// Helper to construct webhook event with signature verification
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

// Create a customer in Stripe
export async function createStripeCustomer(
  email: string,
  name: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      ...metadata,
      created_via: 'ai-sales-agent',
    },
  });
}

// Create a checkout session for subscription
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
): Promise<Stripe.Checkout.Session> {
  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    customer_update: {
      address: 'auto',
      name: 'auto',
    },
  };

  // Add trial period if enabled
  if (STRIPE_CONFIG.trial.enabled) {
    sessionConfig.subscription_data = {
      trial_period_days: STRIPE_CONFIG.trial.days,
    };
  }

  return await stripe.checkout.sessions.create(sessionConfig);
}

// Create a billing portal session
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

// Get subscription by ID
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

// Update subscription
export async function updateSubscription(
  subscriptionId: string,
  params: Stripe.SubscriptionUpdateParams
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.update(subscriptionId, params);
}

// Cancel subscription
export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription> {
  if (immediately) {
    return await stripe.subscriptions.cancel(subscriptionId);
  }
  
  // Cancel at period end
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

// Resume a canceled subscription
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

// Get customer's invoices
export async function getCustomerInvoices(
  customerId: string,
  limit: number = 10
): Promise<Stripe.Invoice[]> {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
  });
  return invoices.data;
}

// Get upcoming invoice
export async function getUpcomingInvoice(
  customerId: string
): Promise<Stripe.Invoice | null> {
  try {
    return await stripe.invoices.retrieveUpcoming({
      customer: customerId,
    });
  } catch (error) {
    console.error('Error fetching upcoming invoice:', error);
    return null;
  }
}

// Helper to check if a user can use a feature based on their plan
export function canUseFeature(
  plan: keyof typeof PLAN_FEATURES,
  feature: string
): boolean {
  const planFeatures = PLAN_FEATURES[plan];
  return planFeatures.features[feature as keyof typeof planFeatures.features] === true;
}

// Helper to check usage limits
export function checkUsageLimit(
  plan: keyof typeof PLAN_FEATURES,
  resource: 'prospectsLimit' | 'icpsLimit' | 'sequencesLimit' | 'messagesLimit',
  currentUsage: number
): { allowed: boolean; limit: number; remaining: number } {
  const limit = PLAN_FEATURES[plan][resource];
  
  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }
  
  const allowed = currentUsage < limit;
  const remaining = Math.max(0, limit - currentUsage);
  
  return { allowed, limit, remaining };
}

// Map Stripe price ID to plan
export function getPlanFromPriceId(priceId: string): keyof typeof PLAN_FEATURES | null {
  const priceMap: Record<string, keyof typeof PLAN_FEATURES> = {
    [STRIPE_CONFIG.prices.starter.monthly]: 'STARTER',
    [STRIPE_CONFIG.prices.starter.yearly]: 'STARTER',
    [STRIPE_CONFIG.prices.pro.monthly]: 'PRO',
    [STRIPE_CONFIG.prices.pro.yearly]: 'PRO',
    [STRIPE_CONFIG.prices.business.monthly]: 'BUSINESS',
    [STRIPE_CONFIG.prices.business.yearly]: 'BUSINESS',
  };
  
  return priceMap[priceId] || null;
}

// Map plan to Stripe price ID
export function getPriceIdFromPlan(
  plan: keyof typeof PLAN_FEATURES,
  interval: 'monthly' | 'yearly'
): string | null {
  const planKey = plan.toLowerCase() as 'starter' | 'pro' | 'business';
  return STRIPE_CONFIG.prices[planKey]?.[interval] || null;
}

// Format amount from cents to dollars
export function formatAmount(amountInCents: number): string {
  return (amountInCents / 100).toFixed(2);
}

// Get subscription status display
export function getSubscriptionStatusDisplay(status: string): {
  label: string;
  color: string;
  description: string;
} {
  const statusMap: Record<string, { label: string; color: string; description: string }> = {
    trialing: {
      label: 'Trial',
      color: 'blue',
      description: 'Your free trial is active',
    },
    active: {
      label: 'Active',
      color: 'green',
      description: 'Your subscription is active',
    },
    past_due: {
      label: 'Past Due',
      color: 'orange',
      description: 'Payment failed. Please update your payment method',
    },
    canceled: {
      label: 'Canceled',
      color: 'gray',
      description: 'Your subscription has been canceled',
    },
    unpaid: {
      label: 'Unpaid',
      color: 'red',
      description: 'Your subscription is unpaid. Please update your payment method',
    },
    incomplete: {
      label: 'Incomplete',
      color: 'yellow',
      description: 'Please complete your subscription setup',
    },
  };
  
  return statusMap[status.toLowerCase()] || {
    label: 'Unknown',
    color: 'gray',
    description: 'Unknown subscription status',
  };
}

export default stripe;
