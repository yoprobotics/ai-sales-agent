import { getStripeClient, log } from './client';
import { handleStripeError, retryWithBackoff } from './errors';
import { CreateCustomerData } from './types';
import type { Stripe } from 'stripe';

/**
 * Create a new Stripe customer
 */
export async function createCustomer(
  data: CreateCustomerData
): Promise<Stripe.Customer> {
  log('customer.create.start', data);

  try {
    const stripe = getStripeClient();
    
    const customer = await retryWithBackoff(() =>
      stripe.customers.create({
        email: data.email,
        name: data.name,
        phone: data.phone,
        metadata: {
          ...data.metadata,
          source: 'ai-sales-agent',
          created_at: new Date().toISOString(),
        },
      })
    );

    log('customer.create.success', { id: customer.id, email: customer.email });
    return customer;
  } catch (error) {
    log('customer.create.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Get a Stripe customer by ID
 */
export async function getCustomer(
  customerId: string
): Promise<Stripe.Customer | null> {
  log('customer.get.start', { customerId });

  try {
    const stripe = getStripeClient();
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      log('customer.get.deleted', { customerId });
      return null;
    }

    log('customer.get.success', { id: customer.id });
    return customer as Stripe.Customer;
  } catch (error: any) {
    if (error.statusCode === 404) {
      log('customer.get.not_found', { customerId });
      return null;
    }
    
    log('customer.get.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Update a Stripe customer
 */
export async function updateCustomer(
  customerId: string,
  data: Partial<CreateCustomerData>
): Promise<Stripe.Customer> {
  log('customer.update.start', { customerId, data });

  try {
    const stripe = getStripeClient();
    
    const customer = await stripe.customers.update(customerId, {
      email: data.email,
      name: data.name,
      phone: data.phone,
      metadata: data.metadata,
    });

    log('customer.update.success', { id: customer.id });
    return customer;
  } catch (error) {
    log('customer.update.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Delete a Stripe customer
 */
export async function deleteCustomer(
  customerId: string
): Promise<boolean> {
  log('customer.delete.start', { customerId });

  try {
    const stripe = getStripeClient();
    const result = await stripe.customers.del(customerId);

    log('customer.delete.success', { customerId, deleted: result.deleted });
    return result.deleted;
  } catch (error) {
    log('customer.delete.error', error);
    throw handleStripeError(error);
  }
}

/**
 * List customers with pagination
 */
export async function listCustomers(
  params?: {
    email?: string;
    limit?: number;
    startingAfter?: string;
  }
): Promise<Stripe.ApiList<Stripe.Customer>> {
  log('customer.list.start', params);

  try {
    const stripe = getStripeClient();
    
    const customers = await stripe.customers.list({
      email: params?.email,
      limit: params?.limit || 10,
      starting_after: params?.startingAfter,
    });

    log('customer.list.success', { count: customers.data.length });
    return customers;
  } catch (error) {
    log('customer.list.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Get or create a customer by email
 */
export async function getOrCreateCustomer(
  email: string,
  data?: Omit<CreateCustomerData, 'email'>
): Promise<Stripe.Customer> {
  log('customer.getOrCreate.start', { email });

  try {
    // First, try to find existing customer
    const existingCustomers = await listCustomers({ email, limit: 1 });
    
    if (existingCustomers.data.length > 0) {
      const customer = existingCustomers.data[0];
      log('customer.getOrCreate.existing', { id: customer.id, email });
      return customer;
    }

    // Create new customer if not found
    const newCustomer = await createCustomer({
      email,
      ...data,
    });

    log('customer.getOrCreate.created', { id: newCustomer.id, email });
    return newCustomer;
  } catch (error) {
    log('customer.getOrCreate.error', error);
    throw handleStripeError(error);
  }
}