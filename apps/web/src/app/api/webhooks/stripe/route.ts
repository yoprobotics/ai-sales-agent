import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent, handleWebhookEvent } from '@ai-sales-agent/stripe';
import prisma from '@/lib/prisma';
import type { Stripe } from 'stripe';

// Stripe webhook handler
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
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
  const user = await prisma.user.findFirst({
    where: {
      subscription: {
        stripeCustomerId: customerId,
      },
    },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Update subscription in database
  await prisma.subscription.update({
    where: { userId: user.id },
    data: {
      stripeSubscriptionId: subscriptionId,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  console.log('Subscription activated for user:', user.id);
}

// Handle subscription created
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.created:', subscription.id);

  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const user = await prisma.user.findFirst({
    where: {
      subscription: {
        stripeCustomerId: customerId,
      },
    },
  });

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Map Stripe price to plan
  const planMap: Record<string, any> = {
    [process.env.STRIPE_PRICE_STARTER_MONTHLY || '']: 'STARTER',
    [process.env.STRIPE_PRICE_PRO_MONTHLY || '']: 'PRO',
    [process.env.STRIPE_PRICE_BUSINESS_MONTHLY || '']: 'BUSINESS',
  };

  const priceId = subscription.items.data[0]?.price.id;
  const plan = planMap[priceId] || 'STARTER';

  // Update user plan
  await prisma.user.update({
    where: { id: user.id },
    data: { plan },
  });

  // Update subscription
  await prisma.subscription.update({
    where: { userId: user.id },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan,
      status: subscription.status.toUpperCase() as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.updated:', subscription.id);

  // Update subscription in database
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    console.error('Subscription not found:', subscription.id);
    return;
  }

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: subscription.status.toUpperCase() as any,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.deleted:', subscription.id);

  // Update subscription status
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    console.error('Subscription not found:', subscription.id);
    return;
  }

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
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_succeeded:', invoice.id);

  if (!invoice.subscription) return;

  // Create payment record
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: invoice.subscription as string },
  });

  if (!subscription) {
    console.error('Subscription not found for invoice:', invoice.id);
    return;
  }

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
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_failed:', invoice.id);

  if (!invoice.subscription) return;

  // Update subscription status if payment failed multiple times
  if (invoice.attempt_count >= 3) {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription as string },
    });

    if (subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'PAST_DUE' },
      });

      // TODO: Send email notification to user
      console.log('Subscription marked as past due:', subscription.id);
    }
  }
}