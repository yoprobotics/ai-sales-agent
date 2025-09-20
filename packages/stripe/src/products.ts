import { getStripeClient, log, formatAmountForStripe } from './client';
import { handleStripeError, retryWithBackoff } from './errors';
import { SUBSCRIPTION_PLANS } from './types';
import type { Stripe } from 'stripe';

/**
 * Create a product in Stripe
 */
export async function createProduct(
  name: string,
  description?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Product> {
  log('product.create.start', { name, description });

  try {
    const stripe = getStripeClient();
    
    const product = await retryWithBackoff(() =>
      stripe.products.create({
        name,
        description,
        metadata: {
          ...metadata,
          source: 'ai-sales-agent',
        },
      })
    );

    log('product.create.success', { id: product.id, name: product.name });
    return product;
  } catch (error) {
    log('product.create.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Create a price for a product
 */
export async function createPrice(
  productId: string,
  amount: number,
  interval?: 'month' | 'year',
  currency: string = 'usd'
): Promise<Stripe.Price> {
  log('price.create.start', { productId, amount, interval, currency });

  try {
    const stripe = getStripeClient();
    
    const priceData: Stripe.PriceCreateParams = {
      product: productId,
      unit_amount: formatAmountForStripe(amount, currency),
      currency,
    };

    if (interval) {
      priceData.recurring = { interval };
    }

    const price = await stripe.prices.create(priceData);

    log('price.create.success', {
      id: price.id,
      productId,
      amount: price.unit_amount,
    });

    return price;
  } catch (error) {
    log('price.create.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Get a product by ID
 */
export async function getProduct(
  productId: string
): Promise<Stripe.Product | null> {
  log('product.get.start', { productId });

  try {
    const stripe = getStripeClient();
    const product = await stripe.products.retrieve(productId);

    log('product.get.success', { id: product.id, name: product.name });
    return product;
  } catch (error: any) {
    if (error.statusCode === 404) {
      log('product.get.not_found', { productId });
      return null;
    }

    log('product.get.error', error);
    throw handleStripeError(error);
  }
}

/**
 * List all products
 */
export async function listProducts(
  params?: {
    active?: boolean;
    limit?: number;
  }
): Promise<Stripe.ApiList<Stripe.Product>> {
  log('product.list.start', params);

  try {
    const stripe = getStripeClient();
    
    const products = await stripe.products.list({
      active: params?.active,
      limit: params?.limit || 100,
    });

    log('product.list.success', { count: products.data.length });
    return products;
  } catch (error) {
    log('product.list.error', error);
    throw handleStripeError(error);
  }
}

/**
 * List prices for a product
 */
export async function listPrices(
  productId?: string,
  params?: {
    active?: boolean;
    limit?: number;
  }
): Promise<Stripe.ApiList<Stripe.Price>> {
  log('price.list.start', { productId, params });

  try {
    const stripe = getStripeClient();
    
    const prices = await stripe.prices.list({
      product: productId,
      active: params?.active,
      limit: params?.limit || 100,
    });

    log('price.list.success', { count: prices.data.length });
    return prices;
  } catch (error) {
    log('price.list.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Initialize subscription products and prices
 * This should be run once during setup
 */
export async function initializeSubscriptionProducts(): Promise<void> {
  log('products.initialize.start');

  try {
    const stripe = getStripeClient();

    for (const [key, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
      // Check if product already exists
      let product: Stripe.Product | null = null;
      const existingProducts = await listProducts({ active: true });
      
      product = existingProducts.data.find(
        (p) => p.metadata.plan_key === key
      ) || null;

      // Create product if it doesn't exist
      if (!product) {
        product = await createProduct(
          plan.name,
          plan.description,
          {
            plan_key: key,
            features: JSON.stringify(plan.features),
            limits: JSON.stringify(plan.limits),
          }
        );
      }

      // Check if prices exist
      const existingPrices = await listPrices(product.id, { active: true });
      
      const hasMonthlyPrice = existingPrices.data.some(
        (p) => p.recurring?.interval === 'month'
      );
      
      const hasYearlyPrice = existingPrices.data.some(
        (p) => p.recurring?.interval === 'year'
      );

      // Create monthly price if it doesn't exist
      if (!hasMonthlyPrice) {
        await createPrice(product.id, plan.monthlyPrice, 'month');
      }

      // Create yearly price if it doesn't exist
      if (!hasYearlyPrice) {
        await createPrice(product.id, plan.yearlyPrice, 'year');
      }

      log('products.initialize.plan', {
        key,
        productId: product.id,
        name: plan.name,
      });
    }

    log('products.initialize.success');
  } catch (error) {
    log('products.initialize.error', error);
    throw handleStripeError(error);
  }
}

/**
 * Get price ID for a plan
 */
export async function getPriceForPlan(
  planKey: string,
  interval: 'month' | 'year'
): Promise<string | null> {
  log('price.getForPlan.start', { planKey, interval });

  try {
    // Find product with matching plan_key
    const products = await listProducts({ active: true });
    const product = products.data.find(
      (p) => p.metadata.plan_key === planKey
    );

    if (!product) {
      log('price.getForPlan.product_not_found', { planKey });
      return null;
    }

    // Find price with matching interval
    const prices = await listPrices(product.id, { active: true });
    const price = prices.data.find(
      (p) => p.recurring?.interval === interval
    );

    if (!price) {
      log('price.getForPlan.price_not_found', { planKey, interval });
      return null;
    }

    log('price.getForPlan.success', {
      planKey,
      interval,
      priceId: price.id,
    });

    return price.id;
  } catch (error) {
    log('price.getForPlan.error', error);
    throw handleStripeError(error);
  }
}