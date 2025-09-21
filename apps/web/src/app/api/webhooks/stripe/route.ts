import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import type { Stripe } from 'stripe';
import { getPlanFromPriceId, PLAN_FEATURES } from '@/lib/stripe';

// Type helper for plan names
type PlanType = 'STARTER' | 'PRO' | 'BUSINESS';

// Disable body parsing, we need raw body for Stripe webhook signature verification
export const runtime = 'nodejs';

// Stripe webhook handler
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  console.log(`Processing webhook event: ${event.type}`);

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleTrialWillEnd(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case 'payment_method.attached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        await handlePaymentMethodAttached(paymentMethod);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle successful checkout
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id);

  if (!session.customer || !session.subscription) {
    console.error('Missing customer or subscription in checkout session');
    return;
  }

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  // Find user by Stripe customer ID
  const subscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
    include: { user: true },
  });

  if (!subscription) {
    console.error('Subscription not found for customer:', customerId);
    return;
  }

  // Update subscription in database
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      stripeSubscriptionId: subscriptionId,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  // Send welcome email
  // TODO: Implement email sending via SendGrid

  console.log('Subscription activated for user:', subscription.user.id);
}

// Handle subscription created
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.created:', subscription.id);

  const customerId = subscription.customer as string;

  // Find subscription by Stripe customer ID
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
    include: { user: true },
  });

  if (!dbSubscription) {
    console.error('Subscription not found for customer:', customerId);
    return;
  }

  // Get plan from price ID
  const priceId = subscription.items.data[0]?.price.id;
  const plan = (getPlanFromPriceId(priceId) || 'STARTER') as PlanType;

  // Update user plan
  await prisma.user.update({
    where: { id: dbSubscription.userId },
    data: { plan },
  });

  // Update subscription
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan,
      status: mapStripeStatus(subscription.status),
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  // Initialize or update usage limits
  const planFeatures = PLAN_FEATURES[plan];
  await prisma.subscriptionUsage.upsert({
    where: { subscriptionId: dbSubscription.id },
    create: {
      subscriptionId: dbSubscription.id,
      prospectsLimit: planFeatures.prospectsLimit,
      icpsLimit: planFeatures.icpsLimit,
      sequencesLimit: planFeatures.sequencesLimit,
      messagesLimit: planFeatures.messagesLimit,
      periodStart: new Date(subscription.current_period_start * 1000),
      periodEnd: new Date(subscription.current_period_end * 1000),
    },
    update: {
      prospectsLimit: planFeatures.prospectsLimit,
      icpsLimit: planFeatures.icpsLimit,
      sequencesLimit: planFeatures.sequencesLimit,
      messagesLimit: planFeatures.messagesLimit,
      periodStart: new Date(subscription.current_period_start * 1000),
      periodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.updated:', subscription.id);

  // Find subscription in database
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    console.error('Subscription not found:', subscription.id);
    return;
  }

  // Get plan from price ID
  const priceId = subscription.items.data[0]?.price.id;
  const plan = (getPlanFromPriceId(priceId) || 'STARTER') as PlanType;

  // Update subscription
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      stripePriceId: priceId,
      plan,
      status: mapStripeStatus(subscription.status),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  // Update user plan
  await prisma.user.update({
    where: { id: dbSubscription.userId },
    data: { plan },
  });

  // Update usage limits if plan changed
  const planFeatures = PLAN_FEATURES[plan];
  await prisma.subscriptionUsage.update({
    where: { subscriptionId: dbSubscription.id },
    data: {
      prospectsLimit: planFeatures.prospectsLimit,
      icpsLimit: planFeatures.icpsLimit,
      sequencesLimit: planFeatures.sequencesLimit,
      messagesLimit: planFeatures.messagesLimit,
    },
  });
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.deleted:', subscription.id);

  // Find subscription in database
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    console.error('Subscription not found:', subscription.id);
    return;
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
    },
  });

  // Update user plan to STARTER
  await prisma.user.update({
    where: { id: dbSubscription.userId },
    data: { plan: 'STARTER' },
  });

  // Reset usage limits to STARTER plan
  const starterFeatures = PLAN_FEATURES.STARTER;
  await prisma.subscriptionUsage.update({
    where: { subscriptionId: dbSubscription.id },
    data: {
      prospectsLimit: starterFeatures.prospectsLimit,
      icpsLimit: starterFeatures.icpsLimit,
      sequencesLimit: starterFeatures.sequencesLimit,
      messagesLimit: starterFeatures.messagesLimit,
    },
  });

  // Send cancellation email
  // TODO: Implement email sending via SendGrid
}

// Handle trial will end (3 days before)
async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.trial_will_end:', subscription.id);

  // Find subscription in database
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    include: { user: true },
  });

  if (!dbSubscription) {
    console.error('Subscription not found:', subscription.id);
    return;
  }

  // Send trial ending email
  // TODO: Implement email sending via SendGrid
  console.log(`Trial ending soon for user: ${dbSubscription.user.email}`);
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_succeeded:', invoice.id);

  if (!invoice.subscription) return;

  // Find subscription
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: invoice.subscription as string },
  });

  if (!subscription) {
    console.error('Subscription not found for invoice:', invoice.id);
    return;
  }

  // Create payment record
  await prisma.payment.create({
    data: {
      subscriptionId: subscription.id,
      stripePaymentId: invoice.payment_intent as string || invoice.id,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'SUCCEEDED',
      billingPeriodStart: new Date(invoice.period_start * 1000),
      billingPeriodEnd: new Date(invoice.period_end * 1000),
      paidAt: new Date(),
    },
  });

  // Update subscription status to ACTIVE if it was PAST_DUE
  if (subscription.status === 'PAST_DUE') {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'ACTIVE' },
    });
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_failed:', invoice.id);

  if (!invoice.subscription) return;

  // Find subscription
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: invoice.subscription as string },
    include: { user: true },
  });

  if (!dbSubscription) {
    console.error('Subscription not found for invoice:', invoice.id);
    return;
  }

  // Create failed payment record
  await prisma.payment.create({
    data: {
      subscriptionId: dbSubscription.id,
      stripePaymentId: invoice.payment_intent as string || invoice.id,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'FAILED',
      failureReason: invoice.last_finalization_error?.message || 'Payment failed',
      billingPeriodStart: new Date(invoice.period_start * 1000),
      billingPeriodEnd: new Date(invoice.period_end * 1000),
    },
  });

  // Update subscription status based on attempt count
  if (invoice.attempt_count >= 2) {
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: { status: 'PAST_DUE' },
    });

    // Send payment failed email
    // TODO: Implement email sending via SendGrid
    console.log(`Payment failed for user: ${dbSubscription.user.email}, attempts: ${invoice.attempt_count}`);
  }
}

// Handle payment method attached
async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  console.log('Processing payment_method.attached:', paymentMethod.id);

  // Log for audit purposes
  console.log(`Payment method ${paymentMethod.id} attached to customer ${paymentMethod.customer}`);
}

// Helper function to map Stripe status to our enum
function mapStripeStatus(stripeStatus: string): any {
  const statusMap: Record<string, string> = {
    'trialing': 'TRIALING',
    'active': 'ACTIVE',
    'past_due': 'PAST_DUE',
    'canceled': 'CANCELED',
    'unpaid': 'UNPAID',
    'incomplete': 'INCOMPLETE',
    'incomplete_expired': 'INCOMPLETE',
    'paused': 'PAST_DUE',
  };

  return statusMap[stripeStatus] || 'INCOMPLETE';
}