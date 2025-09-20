#!/usr/bin/env node

/**
 * Stripe Setup Script
 * 
 * This script initializes your Stripe account with the necessary products and prices
 * for the AI Sales Agent subscription plans.
 * 
 * Usage: node scripts/stripe-setup.js
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../apps/web/.env.local') });

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Product and price configurations
const PRODUCTS = [
  {
    name: 'AI Sales Agent Starter',
    description: 'Perfect for small teams getting started with AI prospecting',
    metadata: {
      plan: 'STARTER',
      features: JSON.stringify({
        icps: 1,
        prospects: 200,
        sequences: 1,
        messages: 1000,
      }),
    },
    prices: [
      {
        nickname: 'Starter Monthly',
        unit_amount: 4900, // $49.00
        recurring: { interval: 'month' as const },
        metadata: { interval: 'monthly' },
      },
      {
        nickname: 'Starter Yearly',
        unit_amount: 49000, // $490.00
        recurring: { interval: 'year' as const },
        metadata: { interval: 'yearly' },
      },
    ],
  },
  {
    name: 'AI Sales Agent Pro',
    description: 'Advanced features for growing sales teams',
    metadata: {
      plan: 'PRO',
      features: JSON.stringify({
        icps: 5,
        prospects: 2000,
        sequences: 10,
        messages: 10000,
      }),
    },
    prices: [
      {
        nickname: 'Pro Monthly',
        unit_amount: 14900, // $149.00
        recurring: { interval: 'month' as const },
        metadata: { interval: 'monthly' },
      },
      {
        nickname: 'Pro Yearly',
        unit_amount: 149000, // $1,490.00
        recurring: { interval: 'year' as const },
        metadata: { interval: 'yearly' },
      },
    ],
  },
  {
    name: 'AI Sales Agent Business',
    description: 'Enterprise features with unlimited usage',
    metadata: {
      plan: 'BUSINESS',
      features: JSON.stringify({
        icps: -1, // unlimited
        prospects: -1,
        sequences: -1,
        messages: -1,
      }),
    },
    prices: [
      {
        nickname: 'Business Monthly',
        unit_amount: 49900, // $499.00
        recurring: { interval: 'month' as const },
        metadata: { interval: 'monthly' },
      },
      {
        nickname: 'Business Yearly',
        unit_amount: 499000, // $4,990.00
        recurring: { interval: 'year' as const },
        metadata: { interval: 'yearly' },
      },
    ],
  },
];

async function setupStripe() {
  console.log('🚀 Starting Stripe setup...\n');

  const createdPrices: Record<string, string> = {};

  try {
    // Create products and prices
    for (const productConfig of PRODUCTS) {
      console.log(`📦 Creating product: ${productConfig.name}`);
      
      // Check if product already exists
      const existingProducts = await stripe.products.search({
        query: `name:'${productConfig.name}'`,
      });

      let product: Stripe.Product;
      
      if (existingProducts.data.length > 0) {
        product = existingProducts.data[0];
        console.log(`   ✅ Product already exists: ${product.id}`);
      } else {
        // Create product
        product = await stripe.products.create({
          name: productConfig.name,
          description: productConfig.description,
          metadata: productConfig.metadata,
        });
        console.log(`   ✅ Product created: ${product.id}`);
      }

      // Create prices for the product
      for (const priceConfig of productConfig.prices) {
        console.log(`   💰 Creating price: ${priceConfig.nickname}`);
        
        try {
          const price = await stripe.prices.create({
            product: product.id,
            nickname: priceConfig.nickname,
            currency: 'usd',
            unit_amount: priceConfig.unit_amount,
            recurring: priceConfig.recurring,
            metadata: priceConfig.metadata,
          });
          
          const planKey = `${productConfig.metadata.plan}_${priceConfig.metadata.interval}`.toUpperCase();
          createdPrices[planKey] = price.id;
          console.log(`      ✅ Price created: ${price.id}`);
        } catch (error: any) {
          console.log(`      ⚠️  Price might already exist: ${error.message}`);
        }
      }
      
      console.log('');
    }

    // Configure Customer Portal
    console.log('⚙️  Configuring Customer Portal...');
    
    try {
      const portalConfigurations = await stripe.billingPortal.configurations.list({ limit: 1 });
      
      if (portalConfigurations.data.length === 0) {
        // Create new portal configuration
        await stripe.billingPortal.configurations.create({
          business_profile: {
            headline: 'AI Sales Agent - Manage Your Subscription',
          },
          features: {
            customer_update: {
              enabled: true,
              allowed_updates: ['email', 'address', 'phone', 'tax_id'],
            },
            invoice_history: {
              enabled: true,
            },
            payment_method_update: {
              enabled: true,
            },
            subscription_cancel: {
              enabled: true,
              mode: 'at_period_end',
              cancellation_reason: {
                enabled: true,
                options: [
                  'too_expensive',
                  'missing_features',
                  'switched_service',
                  'unused',
                  'other',
                ],
              },
            },
            subscription_pause: {
              enabled: false,
            },
            subscription_update: {
              enabled: true,
              default_allowed_updates: ['price', 'quantity', 'promotion_code'],
              products: [
                {
                  product: 'all',
                  prices: 'all',
                },
              ],
            },
          },
        });
        console.log('   ✅ Customer Portal configured\n');
      } else {
        console.log('   ✅ Customer Portal already configured\n');
      }
    } catch (error: any) {
      console.log(`   ⚠️  Could not configure portal: ${error.message}\n`);
    }

    // Output environment variables to set
    console.log('📝 Add these price IDs to your .env.local file:\n');
    console.log('```');
    console.log(`STRIPE_PRICE_STARTER_MONTHLY="${createdPrices.STARTER_MONTHLY || 'price_...'}"`);
    console.log(`STRIPE_PRICE_STARTER_YEARLY="${createdPrices.STARTER_YEARLY || 'price_...'}"`);
    console.log(`STRIPE_PRICE_PRO_MONTHLY="${createdPrices.PRO_MONTHLY || 'price_...'}"`);
    console.log(`STRIPE_PRICE_PRO_YEARLY="${createdPrices.PRO_YEARLY || 'price_...'}"`);
    console.log(`STRIPE_PRICE_BUSINESS_MONTHLY="${createdPrices.BUSINESS_MONTHLY || 'price_...'}"`);
    console.log(`STRIPE_PRICE_BUSINESS_YEARLY="${createdPrices.BUSINESS_YEARLY || 'price_...'}"`);
    console.log('```\n');

    console.log('✅ Stripe setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Copy the price IDs above to your .env.local file');
    console.log('2. Configure webhook endpoint in Stripe Dashboard');
    console.log('3. Test the checkout flow with test cards');
    console.log('\nRefer to docs/STRIPE_SETUP.md for detailed instructions.');

  } catch (error: any) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupStripe().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
