import { getStripeClient, log } from './client';
import { handleStripeError } from './errors';
import { CreateCheckoutSessionData } from './types';
import type { Stripe } from 'stripe';

/**
 * Create a Stripe Checkout Session
 */
export async function createCheckoutSession(
  data: CreateCheckoutSessionData
): Promise<Stripe.Checkout.Session> {
  log('checkout.create.start', data);

  try {
    const stripe = getStripeClient();
    
    const sessionData: Stripe.Checkout.SessionCreateParams = {
      mode: data.mode,
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      line_items: [
        {
          price: data.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        ...data.metadata,
        source: 'ai-sales-agent',
      },
    };

    // Set customer or email
    if (data.customerId) {
      sessionData.customer = data.customerId;
    } else if (data.customerEmail) {
      sessionData.customer_email = data.customerEmail;
    }

    // Add trial period for subscriptions
    if (data.mode === 'subscription' && data.trialDays) {
      sessionData.subscription_data = {
        trial_period_days: data.trialDays,
      };
    }

    // Allow promotion codes
    if (data.allowPromotionCodes) {
      sessionData.allow_promotion_codes = true;
    }

    // Enable automatic tax calculation (optional)
    sessionData.automatic_tax = { enabled: false };

    const session = await stripe.checkout.sessions.create(sessionData);

    log('checkout.create.success', {
      id: session.id,
      url: session.url,
      customerId: session.customer,
    });

    return session;
  } catch (error) {
    log('checkout.create.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Get a Checkout Session by ID
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session | null> {
  log('checkout.get.start', { sessionId });

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    log('checkout.get.success', {
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
    });

    return session;
  } catch (error: any) {
    if (error.statusCode === 404) {
      log('checkout.get.not_found', { sessionId });
      return null;
    }

    log('checkout.get.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Expire a Checkout Session
 */
export async function expireCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  log('checkout.expire.start', { sessionId });

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.expire(sessionId);

    log('checkout.expire.success', {
      id: session.id,
      status: session.status,
    });

    return session;
  } catch (error) {
    log('checkout.expire.error', error);
    throw handleStripeError(error);
  }
}

/**
 * List line items for a Checkout Session
 */
export async function listCheckoutLineItems(
  sessionId: string
): Promise<Stripe.ApiList<Stripe.LineItem>> {
  log('checkout.lineItems.start', { sessionId });

  try {
    const stripe = getStripeClient();
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

    log('checkout.lineItems.success', {
      sessionId,
      count: lineItems.data.length,
    });

    return lineItems;
  } catch (error) {
    log('checkout.lineItems.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Create a Checkout Session for subscription upgrade/downgrade
 */
export async function createSubscriptionUpdateSession(
  customerId: string,
  subscriptionId: string,
  newPriceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  log('checkout.subscriptionUpdate.start', {
    customerId,
    subscriptionId,
    newPriceId,
  });

  try {
    const stripe = getStripeClient();
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price: newPriceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          previous_subscription_id: subscriptionId,
          update_type: 'plan_change',
        },
      },
      metadata: {
        subscription_id: subscriptionId,
        update_type: 'plan_change',
        source: 'ai-sales-agent',
      },
    });

    log('checkout.subscriptionUpdate.success', {
      id: session.id,
      url: session.url,
    });

    return session;
  } catch (error) {
    log('checkout.subscriptionUpdate.error', error);
    throw handleStripeError(error);
  }
}