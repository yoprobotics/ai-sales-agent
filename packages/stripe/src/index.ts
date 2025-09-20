/**
 * @ai-sales-agent/stripe
 * 
 * Modular Stripe integration package for AI Sales Agent
 * Each module is independent and can be tested/debugged separately
 */

// Core client and utilities
export {
  getStripeClient,
  resetStripeClient,
  isTestMode,
  formatAmountForStripe,
  formatAmountFromStripe,
} from './client';

// Customer management
export {
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  listCustomers,
  getOrCreateCustomer,
} from './customers';

// Product and pricing management
export {
  createProduct,
  createPrice,
  getProduct,
  listProducts,
  listPrices,
  initializeSubscriptionProducts,
  getPriceForPlan,
} from './products';

// Subscription management
export {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
  listSubscriptions,
  getActiveSubscription,
} from './subscriptions';

// Checkout sessions
export {
  createCheckoutSession,
  getCheckoutSession,
  expireCheckoutSession,
  listCheckoutLineItems,
  createSubscriptionUpdateSession,
} from './checkout';

// Customer portal
export {
  createPortalSession,
  configurePortal,
  listPortalConfigurations,
  updatePortalConfiguration,
} from './portal';

// Webhooks
export { webhooks } from './webhooks';
export { constructWebhookEvent, handleWebhookEvent } from './webhooks';

// Types
export type {
  CreateCustomerData,
  CreateSubscriptionData,
  CreateCheckoutSessionData,
  UpdateSubscriptionData,
  WebhookEvent,
  SubscriptionPlan,
} from './types';

export { SUBSCRIPTION_PLANS } from './types';

// Errors
export { StripeServiceError, handleStripeError, isRetryableError, retryWithBackoff } from './errors';

// Re-export commonly used Stripe types
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