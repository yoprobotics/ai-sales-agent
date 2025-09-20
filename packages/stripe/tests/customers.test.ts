import { 
  createCustomer, 
  getCustomer, 
  updateCustomer, 
  deleteCustomer,
  listCustomers,
  getOrCreateCustomer 
} from '../src/customers';
import { resetStripeClient } from '../src/client';

// Mock Stripe for testing
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn().mockResolvedValue({
        id: 'cus_test123',
        email: 'test@example.com',
        name: 'Test User',
      }),
      retrieve: jest.fn().mockResolvedValue({
        id: 'cus_test123',
        email: 'test@example.com',
        deleted: false,
      }),
      update: jest.fn().mockResolvedValue({
        id: 'cus_test123',
        email: 'updated@example.com',
      }),
      del: jest.fn().mockResolvedValue({
        id: 'cus_test123',
        deleted: true,
      }),
      list: jest.fn().mockResolvedValue({
        data: [{
          id: 'cus_test123',
          email: 'test@example.com',
        }],
        has_more: false,
      }),
    },
  }));
});

describe('Stripe Customers Module', () => {
  beforeEach(() => {
    resetStripeClient();
  });

  describe('createCustomer', () => {
    it('should create a customer successfully', async () => {
      const customer = await createCustomer({
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(customer).toBeDefined();
      expect(customer.id).toBe('cus_test123');
      expect(customer.email).toBe('test@example.com');
    });

    it('should include metadata', async () => {
      const customer = await createCustomer({
        email: 'test@example.com',
        metadata: {
          userId: 'user_123',
        },
      });

      expect(customer).toBeDefined();
      expect(customer.id).toBe('cus_test123');
    });
  });

  describe('getCustomer', () => {
    it('should retrieve a customer by ID', async () => {
      const customer = await getCustomer('cus_test123');

      expect(customer).toBeDefined();
      expect(customer?.id).toBe('cus_test123');
    });

    it('should return null for non-existent customer', async () => {
      const mockStripe = require('stripe');
      const instance = mockStripe();
      instance.customers.retrieve.mockRejectedValueOnce({ statusCode: 404 });

      const customer = await getCustomer('cus_notfound');
      expect(customer).toBeNull();
    });
  });

  describe('updateCustomer', () => {
    it('should update customer details', async () => {
      const customer = await updateCustomer('cus_test123', {
        email: 'updated@example.com',
      });

      expect(customer).toBeDefined();
      expect(customer.email).toBe('updated@example.com');
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer', async () => {
      const result = await deleteCustomer('cus_test123');

      expect(result).toBe(true);
    });
  });

  describe('listCustomers', () => {
    it('should list customers', async () => {
      const customers = await listCustomers({ limit: 10 });

      expect(customers).toBeDefined();
      expect(customers.data).toHaveLength(1);
      expect(customers.data[0].id).toBe('cus_test123');
    });

    it('should filter by email', async () => {
      const customers = await listCustomers({ 
        email: 'test@example.com',
        limit: 1,
      });

      expect(customers).toBeDefined();
      expect(customers.data).toHaveLength(1);
    });
  });

  describe('getOrCreateCustomer', () => {
    it('should return existing customer if found', async () => {
      const customer = await getOrCreateCustomer('test@example.com');

      expect(customer).toBeDefined();
      expect(customer.id).toBe('cus_test123');
    });

    it('should create new customer if not found', async () => {
      const mockStripe = require('stripe');
      const instance = mockStripe();
      instance.customers.list.mockResolvedValueOnce({
        data: [],
        has_more: false,
      });

      const customer = await getOrCreateCustomer('new@example.com', {
        name: 'New User',
      });

      expect(customer).toBeDefined();
      expect(customer.id).toBe('cus_test123');
    });
  });
});