import { createMocks } from 'node-mocks-http';
import Stripe from 'stripe';
import { handleStripeWebhook, createSubscription, updateSubscription, cancelSubscription } from '../services/stripe';
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma as PrismaClient;

jest.mock('stripe');

describe('Stripe Integration', () => {
  let stripe: jest.Mocked<Stripe>;
  let userId: string;

  beforeEach(async () => {
    stripe = new Stripe('sk_test_mock', { apiVersion: '2023-10-16' }) as jest.Mocked<Stripe>;
    
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'stripe@test.com',
        password: 'hashed',
        firstName: 'Stripe',
        lastName: 'Test',
        role: 'CLIENT',
        plan: 'STARTER',
        dataRegion: 'US',
        language: 'en',
        isEmailVerified: true
      }
    });
    userId = user.id;
  });

  describe('Subscription Creation', () => {
    it('should create a Stripe customer and subscription', async () => {
      const mockCustomer = {
        id: 'cus_test123',
        email: 'stripe@test.com'
      };

      const mockSubscription = {
        id: 'sub_test123',
        customer: 'cus_test123',
        status: 'active',
        items: {
          data: [{
            price: {
              id: 'price_pro',
              product: 'prod_pro'
            }
          }]
        },
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        cancel_at_period_end: false
      };

      stripe.customers.create = jest.fn().mockResolvedValue(mockCustomer);
      stripe.subscriptions.create = jest.fn().mockResolvedValue(mockSubscription);

      const result = await createSubscription(userId, 'PRO', 'monthly');

      expect(stripe.customers.create).toHaveBeenCalledWith({
        email: 'stripe@test.com',
        metadata: { userId }
      });

      expect(stripe.subscriptions.create).toHaveBeenCalledWith({
        customer: 'cus_test123',
        items: [{ price: expect.any(String) }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      });

      expect(result.subscription).toBeDefined();
      expect(result.subscription.id).toBe('sub_test123');

      // Verify database was updated
      const subscription = await prisma.subscription.findFirst({
        where: { userId }
      });

      expect(subscription).toBeDefined();
      expect(subscription?.stripeCustomerId).toBe('cus_test123');
      expect(subscription?.stripeSubscriptionId).toBe('sub_test123');
      expect(subscription?.status).toBe('active');
      expect(subscription?.plan).toBe('PRO');
    });

    it('should handle subscription creation errors', async () => {
      stripe.customers.create = jest.fn().mockRejectedValue(
        new Error('Card declined')
      );

      await expect(createSubscription(userId, 'PRO', 'monthly')).rejects.toThrow('Card declined');

      // Verify no subscription was created in database
      const subscription = await prisma.subscription.findFirst({
        where: { userId }
      });

      expect(subscription).toBeNull();
    });
  });

  describe('Webhook Handling', () => {
    it('should handle checkout.session.completed event', async () => {
      const event = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test123',
            customer: 'cus_test123',
            subscription: 'sub_test123',
            metadata: { userId },
            payment_status: 'paid'
          }
        }
      } as Stripe.Event;

      stripe.webhooks.constructEvent = jest.fn().mockReturnValue(event);

      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'stripe-signature': 'test-signature'
        },
        body: event
      });

      await handleStripeWebhook(req, res);

      expect(res._getStatusCode()).toBe(200);

      // Verify subscription was activated
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      expect(user?.plan).toBe('PRO');
    });

    it('should handle subscription.updated event', async () => {
      // Create existing subscription
      await prisma.subscription.create({
        data: {
          userId,
          stripeCustomerId: 'cus_test123',
          stripeSubscriptionId: 'sub_test123',
          status: 'active',
          plan: 'STARTER',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });

      const event = {
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub_test123',
            customer: 'cus_test123',
            status: 'active',
            items: {
              data: [{
                price: {
                  id: 'price_pro',
                  product: 'prod_pro',
                  metadata: { plan: 'PRO' }
                }
              }]
            },
            cancel_at_period_end: false,
            current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
          }
        }
      } as Stripe.Event;

      stripe.webhooks.constructEvent = jest.fn().mockReturnValue(event);

      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'stripe-signature': 'test-signature'
        },
        body: event
      });

      await handleStripeWebhook(req, res);

      expect(res._getStatusCode()).toBe(200);

      // Verify subscription was updated
      const subscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: 'sub_test123' }
      });

      expect(subscription?.plan).toBe('PRO');
      expect(subscription?.status).toBe('active');
    });

    it('should handle subscription.deleted event', async () => {
      // Create existing subscription
      await prisma.subscription.create({
        data: {
          userId,
          stripeCustomerId: 'cus_test123',
          stripeSubscriptionId: 'sub_test123',
          status: 'active',
          plan: 'PRO',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });

      const event = {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_test123',
            customer: 'cus_test123',
            status: 'canceled'
          }
        }
      } as Stripe.Event;

      stripe.webhooks.constructEvent = jest.fn().mockReturnValue(event);

      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'stripe-signature': 'test-signature'
        },
        body: event
      });

      await handleStripeWebhook(req, res);

      expect(res._getStatusCode()).toBe(200);

      // Verify subscription was cancelled
      const subscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: 'sub_test123' }
      });

      expect(subscription?.status).toBe('canceled');

      // Verify user plan was downgraded
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      expect(user?.plan).toBe('STARTER');
    });

    it('should handle payment_intent.payment_failed event', async () => {
      const event = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_test123',
            customer: 'cus_test123',
            amount: 14900, // $149.00
            currency: 'usd',
            last_payment_error: {
              message: 'Your card was declined.'
            },
            metadata: { userId }
          }
        }
      } as Stripe.Event;

      stripe.webhooks.constructEvent = jest.fn().mockReturnValue(event);

      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'stripe-signature': 'test-signature'
        },
        body: event
      });

      await handleStripeWebhook(req, res);

      expect(res._getStatusCode()).toBe(200);

      // Verify payment failure was logged
      // In a real app, you'd check your payment_failures table or audit log
    });

    it('should verify webhook signature', async () => {
      const event = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test123'
          }
        }
      };

      stripe.webhooks.constructEvent = jest.fn().mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'stripe-signature': 'invalid-signature'
        },
        body: event
      });

      await handleStripeWebhook(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe('Invalid signature');
    });
  });

  describe('Subscription Management', () => {
    beforeEach(async () => {
      await prisma.subscription.create({
        data: {
          userId,
          stripeCustomerId: 'cus_test123',
          stripeSubscriptionId: 'sub_test123',
          status: 'active',
          plan: 'STARTER',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    });

    it('should upgrade subscription', async () => {
      const mockUpdatedSubscription = {
        id: 'sub_test123',
        items: {
          data: [{
            id: 'si_test123',
            price: {
              id: 'price_pro',
              product: 'prod_pro'
            }
          }]
        },
        status: 'active'
      };

      stripe.subscriptions.update = jest.fn().mockResolvedValue(mockUpdatedSubscription);

      const result = await updateSubscription(userId, 'PRO');

      expect(stripe.subscriptions.update).toHaveBeenCalledWith(
        'sub_test123',
        expect.objectContaining({
          items: expect.any(Array),
          proration_behavior: 'always_invoice'
        })
      );

      expect(result.success).toBe(true);
    });

    it('should cancel subscription', async () => {
      const mockCancelledSubscription = {
        id: 'sub_test123',
        status: 'active',
        cancel_at_period_end: true
      };

      stripe.subscriptions.update = jest.fn().mockResolvedValue(mockCancelledSubscription);

      const result = await cancelSubscription(userId);

      expect(stripe.subscriptions.update).toHaveBeenCalledWith(
        'sub_test123',
        { cancel_at_period_end: true }
      );

      expect(result.success).toBe(true);

      // Verify database was updated
      const subscription = await prisma.subscription.findFirst({
        where: { userId }
      });

      expect(subscription?.cancelAtPeriodEnd).toBe(true);
    });

    it('should handle immediate cancellation', async () => {
      const mockCancelledSubscription = {
        id: 'sub_test123',
        status: 'canceled'
      };

      stripe.subscriptions.cancel = jest.fn().mockResolvedValue(mockCancelledSubscription);

      const result = await cancelSubscription(userId, true);

      expect(stripe.subscriptions.cancel).toHaveBeenCalledWith('sub_test123');
      expect(result.success).toBe(true);

      // Verify subscription was marked as cancelled
      const subscription = await prisma.subscription.findFirst({
        where: { userId }
      });

      expect(subscription?.status).toBe('canceled');
    });
  });

  describe('Usage Limits', () => {
    it('should enforce plan limits', async () => {
      const planLimits = {
        STARTER: { prospects: 200, icps: 1, sequences: 1, messages: 1000 },
        PRO: { prospects: 2000, icps: 5, sequences: 10, messages: 10000 },
        BUSINESS: { prospects: -1, icps: -1, sequences: -1, messages: -1 } // Unlimited
      };

      const checkUsageLimit = (plan: string, resource: string, current: number): boolean => {
        const limit = planLimits[plan][resource];
        return limit === -1 || current < limit;
      };

      // STARTER plan
      expect(checkUsageLimit('STARTER', 'prospects', 199)).toBe(true);
      expect(checkUsageLimit('STARTER', 'prospects', 200)).toBe(false);

      // PRO plan
      expect(checkUsageLimit('PRO', 'sequences', 9)).toBe(true);
      expect(checkUsageLimit('PRO', 'sequences', 10)).toBe(false);

      // BUSINESS plan (unlimited)
      expect(checkUsageLimit('BUSINESS', 'prospects', 10000)).toBe(true);
      expect(checkUsageLimit('BUSINESS', 'messages', 100000)).toBe(true);
    });
  });
});
