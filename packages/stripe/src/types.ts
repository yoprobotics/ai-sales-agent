import type Stripe from 'stripe';

// Custom types for our application

export interface CreateCustomerData {
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionData {
  customerId: string;
  priceId: string;
  trialDays?: number;
  metadata?: Record<string, string>;
  couponId?: string;
  paymentMethodId?: string;
}

export interface CreateCheckoutSessionData {
  customerId?: string;
  customerEmail?: string;
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  trialDays?: number;
  allowPromotionCodes?: boolean;
}

export interface UpdateSubscriptionData {
  priceId?: string;
  quantity?: number;
  cancelAtPeriodEnd?: boolean;
  metadata?: Record<string, string>;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
    previous_attributes?: any;
  };
  created: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: {
    icps: number;
    prospects: number;
    sequences: number;
    messages: number;
    teamMembers: number;
  };
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  STARTER: {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small businesses getting started',
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: [
      '1 ICP',
      '200 prospects/month',
      '1 email sequence',
      'Basic AI features',
      'Email support',
    ],
    limits: {
      icps: 1,
      prospects: 200,
      sequences: 1,
      messages: 1000,
      teamMembers: 1,
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams that need more power',
    monthlyPrice: 149,
    yearlyPrice: 1490,
    features: [
      '5 ICPs',
      '2,000 prospects/month',
      '10 email sequences',
      'Advanced AI features',
      'Multi-channel outreach',
      'Priority support',
      'API access',
    ],
    limits: {
      icps: 5,
      prospects: 2000,
      sequences: 10,
      messages: 10000,
      teamMembers: 3,
    },
  },
  BUSINESS: {
    id: 'business',
    name: 'Business',
    description: 'For enterprises that need unlimited scale',
    monthlyPrice: 499,
    yearlyPrice: 4990,
    features: [
      'Unlimited ICPs',
      'Unlimited prospects',
      'Unlimited sequences',
      'Premium AI features',
      'CRM integrations',
      'Custom branding',
      'Dedicated support',
      'Advanced analytics',
    ],
    limits: {
      icps: -1, // unlimited
      prospects: -1,
      sequences: -1,
      messages: -1,
      teamMembers: 10,
    },
  },
};

// Error types
export class StripeError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'StripeError';
  }
}

// Re-export Stripe types we use
export type {
  Stripe,
  Customer,
  Product,
  Price,
  Subscription,
  PaymentIntent,
  PaymentMethod,
  Invoice,
  Coupon,
  Checkout,
} from 'stripe';