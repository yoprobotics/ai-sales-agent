import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { constructWebhookEvent } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(
      buf.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    logger.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Create or update subscription in database
        await prisma.subscription.upsert({
          where: {
            stripeSubscriptionId: session.subscription as string,
          },
          create: {
            userId: session.metadata?.userId || '',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            plan: session.metadata?.plan || 'STARTER',
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          update: {
            status: 'active',
          },
        });

        logger.info('Checkout session completed:', {
          sessionId: session.id,
          customerId: session.customer,
        });
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await prisma.subscription.create({
          data: {
            userId: subscription.metadata?.userId || '',
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            plan: subscription.metadata?.plan || 'STARTER',
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });

        logger.info('Subscription created:', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: subscription.status,
            plan: subscription.metadata?.plan || 'STARTER',
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        logger.info('Subscription updated:', {
          subscriptionId: subscription.id,
          status: subscription.status,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: 'canceled',
            cancelAtPeriodEnd: false,
          },
        });

        logger.info('Subscription deleted:', {
          subscriptionId: subscription.id,
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Log successful payment
        await prisma.payment.create({
          data: {
            userId: invoice.metadata?.userId || '',
            stripeInvoiceId: invoice.id,
            stripePaymentIntentId: invoice.payment_intent as string,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'succeeded',
          },
        });

        logger.info('Invoice payment succeeded:', {
          invoiceId: invoice.id,
          amount: invoice.amount_paid,
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Log failed payment
        await prisma.payment.create({
          data: {
            userId: invoice.metadata?.userId || '',
            stripeInvoiceId: invoice.id,
            stripePaymentIntentId: invoice.payment_intent as string,
            amount: invoice.amount_due,
            currency: invoice.currency,
            status: 'failed',
            failureReason: invoice.last_finalization_error?.message,
          },
        });

        // Update subscription status if needed
        if (invoice.subscription) {
          await prisma.subscription.update({
            where: {
              stripeSubscriptionId: invoice.subscription as string,
            },
            data: {
              status: 'past_due',
            },
          });
        }

        logger.warn('Invoice payment failed:', {
          invoiceId: invoice.id,
          amount: invoice.amount_due,
          error: invoice.last_finalization_error?.message,
        });
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        logger.info('Payment intent succeeded:', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        logger.warn('Payment intent failed:', {
          paymentIntentId: paymentIntent.id,
          error: paymentIntent.last_payment_error?.message,
        });
        break;
      }

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error: any) {
    logger.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}
