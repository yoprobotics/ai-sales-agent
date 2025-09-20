import {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  listSubscriptions,
  getActiveSubscription,
} from '../src/subscriptions';
import { resetStripeClient } from '../src/client';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    subscriptions: {
      create: jest.fn().mockResolvedValue({
        id: 'sub_test123',
        customer: 'cus_test123',
        status: 'active',
        items: {
          data: [{
            id: 'si_test123',
            price: { id: 'price_test123' },
          }],
        },
      }),
      retrieve: jest.fn().mockResolvedValue({
        id: 'sub_test123',
        customer: 'cus_test123',
        status: 'active',
        items: {
          data: [{
            id: 'si_test123',
            price: { id: 'price_test123' },
          }],
        },
      }),
      update: jest.fn().mockResolvedValue({
        id: 'sub_test123',
        customer: 'cus_test123',
        status: 'active',
        cancel_at_period_end: false,
      }),
      cancel: jest.fn().mockResolvedValue({
        id: 'sub_test123',
        status: 'canceled',
      }),
      list: jest.fn().mockResolvedValue({
        data: [{
          id: 'sub_test123',
          customer: 'cus_test123',
          status: 'active',
        }],
        has_more: false,
      }),
    },
  }));
});

describe('Stripe Subscriptions Module', () => {
  beforeEach(() => {
    resetStripeClient();
  });

  describe('createSubscription', () => {
    it('should create a subscription', async () => {
      const subscription = await createSubscription({
        customerId: 'cus_test123',
        priceId: 'price_test123',
      });

      expect(subscription).toBeDefined();
      expect(subscription.id).toBe('sub_test123');
      expect(subscription.customer).toBe('cus_test123');
      expect(subscription.status).toBe('active');
    });

    it('should create subscription with trial', async () => {
      const subscription = await createSubscription({
        customerId: 'cus_test123',
        priceId: 'price_test123',
        trialDays: 14,
      });

      expect(subscription).toBeDefined();
      expect(subscription.id).toBe('sub_test123');
    });
  });

  describe('getSubscription', () => {
    it('should retrieve a subscription', async () => {
      const subscription = await getSubscription('sub_test123');

      expect(subscription).toBeDefined();
      expect(subscription?.id).toBe('sub_test123');
      expect(subscription?.status).toBe('active');
    });

    it('should return null for non-existent subscription', async () => {
      const mockStripe = require('stripe');
      const instance = mockStripe();
      instance.subscriptions.retrieve.mockRejectedValueOnce({ statusCode: 404 });

      const subscription = await getSubscription('sub_notfound');
      expect(subscription).toBeNull();
    });
  });

  describe('updateSubscription', () => {
    it('should update subscription', async () => {
      const subscription = await updateSubscription('sub_test123', {
        cancelAtPeriodEnd: false,
      });

      expect(subscription).toBeDefined();
      expect(subscription.cancel_at_period_end).toBe(false);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription immediately', async () => {
      const subscription = await cancelSubscription('sub_test123', true);

      expect(subscription).toBeDefined();
      expect(subscription.status).toBe('canceled');
    });

    it('should cancel subscription at period end', async () => {
      const mockStripe = require('stripe');
      const instance = mockStripe();
      instance.subscriptions.update.mockResolvedValueOnce({
        id: 'sub_test123',
        status: 'active',
        cancel_at_period_end: true,
      });

      const subscription = await cancelSubscription('sub_test123', false);

      expect(subscription).toBeDefined();
      expect(subscription.cancel_at_period_end).toBe(true);
    });
  });

  describe('listSubscriptions', () => {
    it('should list customer subscriptions', async () => {
      const subscriptions = await listSubscriptions('cus_test123');

      expect(subscriptions).toBeDefined();
      expect(subscriptions.data).toHaveLength(1);
      expect(subscriptions.data[0].id).toBe('sub_test123');
    });
  });

  describe('getActiveSubscription', () => {
    it('should get active subscription', async () => {
      const subscription = await getActiveSubscription('cus_test123');

      expect(subscription).toBeDefined();
      expect(subscription?.id).toBe('sub_test123');
      expect(subscription?.status).toBe('active');
    });

    it('should return null if no active subscription', async () => {
      const mockStripe = require('stripe');
      const instance = mockStripe();
      instance.subscriptions.list.mockResolvedValueOnce({
        data: [],
        has_more: false,
      });

      const subscription = await getActiveSubscription('cus_test123');
      expect(subscription).toBeNull();
    });
  });
});