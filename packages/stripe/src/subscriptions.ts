import { getStripeClient, log } from './client';
import { handleStripeError, retryWithBackoff } from './errors';
import { CreateSubscriptionData, UpdateSubscriptionData } from './types';
import type { Stripe } from 'stripe';

/**
 * Create a new subscription
 */
export async function createSubscription(
  data: CreateSubscriptionData
): Promise<Stripe.Subscription> {
  log('subscription.create.start', data);

  try {
    const stripe = getStripeClient();
    
    const subscriptionData: Stripe.SubscriptionCreateParams = {
      customer: data.customerId,
      items: [{ price: data.priceId }],
      metadata: {
        ...data.metadata,
        source: 'ai-sales-agent',
      },
    };

    // Add trial period if specified
    if (data.trialDays) {
      subscriptionData.trial_period_days = data.trialDays;
    }

    // Add coupon if specified
    if (data.couponId) {
      subscriptionData.coupon = data.couponId;
    }

    // Add payment method if specified
    if (data.paymentMethodId) {
      subscriptionData.default_payment_method = data.paymentMethodId;
    }

    const subscription = await retryWithBackoff(() =>
      stripe.subscriptions.create(subscriptionData)
    );

    log('subscription.create.success', {
      id: subscription.id,
      status: subscription.status,
      customerId: subscription.customer,
    });

    return subscription;
  } catch (error) {
    log('subscription.create.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Get a subscription by ID
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  log('subscription.get.start', { subscriptionId });

  try {
    const stripe = getStripeClient();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    log('subscription.get.success', {
      id: subscription.id,
      status: subscription.status,
    });

    return subscription;
  } catch (error: any) {
    if (error.statusCode === 404) {
      log('subscription.get.not_found', { subscriptionId });
      return null;
    }

    log('subscription.get.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Update a subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  data: UpdateSubscriptionData
): Promise<Stripe.Subscription> {
  log('subscription.update.start', { subscriptionId, data });

  try {
    const stripe = getStripeClient();
    
    const updateData: Stripe.SubscriptionUpdateParams = {};

    // Update price if specified (for plan changes)
    if (data.priceId) {
      const subscription = await getSubscription(subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      updateData.items = [
        {
          id: subscription.items.data[0].id,
          price: data.priceId,
        },
      ];

      // Set proration behavior
      updateData.proration_behavior = data.prorationBehavior || 'create_prorations';
    }

    // Update quantity if specified
    if (data.quantity !== undefined) {
      updateData.quantity = data.quantity;
    }

    // Update cancellation status
    if (data.cancelAtPeriodEnd !== undefined) {
      updateData.cancel_at_period_end = data.cancelAtPeriodEnd;
    }

    // Update metadata
    if (data.metadata) {
      updateData.metadata = data.metadata;
    }

    const subscription = await stripe.subscriptions.update(
      subscriptionId,
      updateData
    );

    log('subscription.update.success', {
      id: subscription.id,
      status: subscription.status,
    });

    return subscription;
  } catch (error) {
    log('subscription.update.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription> {
  log('subscription.cancel.start', { subscriptionId, immediately });

  try {
    const stripe = getStripeClient();
    
    let subscription: Stripe.Subscription;

    if (immediately) {
      // Cancel immediately
      subscription = await stripe.subscriptions.cancel(subscriptionId);
    } else {
      // Cancel at end of period
      subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }

    log('subscription.cancel.success', {
      id: subscription.id,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

    return subscription;
  } catch (error) {
    log('subscription.cancel.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Pause a subscription
 */
export async function pauseSubscription(
  subscriptionId: string,
  resumeAt?: Date
): Promise<Stripe.Subscription> {
  log('subscription.pause.start', { subscriptionId, resumeAt });

  try {
    const stripe = getStripeClient();
    
    const pauseData: Stripe.SubscriptionUpdateParams = {
      pause_collection: {
        behavior: 'mark_uncollectible',
      },
    };

    if (resumeAt) {
      pauseData.pause_collection.resumes_at = Math.floor(resumeAt.getTime() / 1000);
    }

    const subscription = await stripe.subscriptions.update(
      subscriptionId,
      pauseData
    );

    log('subscription.pause.success', {
      id: subscription.id,
      status: subscription.status,
    });

    return subscription;
  } catch (error) {
    log('subscription.pause.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Resume a paused subscription
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  log('subscription.resume.start', { subscriptionId });

  try {
    const stripe = getStripeClient();
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: '',
    });

    log('subscription.resume.success', {
      id: subscription.id,
      status: subscription.status,
    });

    return subscription;
  } catch (error) {
    log('subscription.resume.error', error);
    throw handleStripeError(error);
  }
}

/**
 * List subscriptions for a customer
 */
export async function listSubscriptions(
  customerId: string,
  params?: {
    status?: Stripe.SubscriptionListParams.Status;
    limit?: number;
  }
): Promise<Stripe.ApiList<Stripe.Subscription>> {
  log('subscription.list.start', { customerId, params });

  try {
    const stripe = getStripeClient();
    
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: params?.status,
      limit: params?.limit || 10,
    });

    log('subscription.list.success', {
      customerId,
      count: subscriptions.data.length,
    });

    return subscriptions;
  } catch (error) {
    log('subscription.list.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Get active subscription for a customer
 */
export async function getActiveSubscription(
  customerId: string
): Promise<Stripe.Subscription | null> {
  log('subscription.getActive.start', { customerId });

  try {
    const subscriptions = await listSubscriptions(customerId, {
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      log('subscription.getActive.not_found', { customerId });
      return null;
    }

    const subscription = subscriptions.data[0];
    log('subscription.getActive.success', {
      id: subscription.id,
      customerId,
    });

    return subscription;
  } catch (error) {
    log('subscription.getActive.error', error);
    throw handleStripeError(error);
  }
}