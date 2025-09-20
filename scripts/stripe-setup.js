#!/usr/bin/env node

/**
 * Script de configuration Stripe
 * Configure les produits et prix pour les plans d'abonnement
 */

const Stripe = require('stripe');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set in .env.local');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const PLANS = [
  {
    name: 'Starter',
    id: 'starter',
    price: {
      monthly: 4900, // $49 in cents
      yearly: 49000, // $490 in cents
    },
    features: [
      '1 ICP',
      '200 prospects per month',
      '1 email sequence',
      'Basic AI qualification',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    id: 'pro',
    price: {
      monthly: 14900, // $149 in cents
      yearly: 149000, // $1490 in cents
    },
    features: [
      '5 ICPs',
      '2000 prospects per month',
      '10 email sequences',
      'Advanced AI features',
      'Multi-channel outreach',
      'API access',
      'Priority support',
    ],
  },
  {
    name: 'Business',
    id: 'business',
    price: {
      monthly: 49900, // $499 in cents
      yearly: 499000, // $4990 in cents
    },
    features: [
      'Unlimited ICPs',
      'Unlimited prospects',
      'Unlimited sequences',
      'Enterprise AI features',
      'CRM integrations',
      'Custom branding',
      'Dedicated support',
      'Team collaboration',
    ],
  },
];

async function setupStripe() {
  console.log('🚀 Setting up Stripe products and prices...\n');

  const products = {};
  const prices = {};

  try {
    // Create or update products
    for (const plan of PLANS) {
      console.log(`📦 Creating/updating product: ${plan.name}`);
      
      // Check if product exists
      let product;
      const existingProducts = await stripe.products.search({
        query: `metadata['plan_id']:'${plan.id}'`,
        limit: 1,
      });

      if (existingProducts.data.length > 0) {
        product = existingProducts.data[0];
        console.log(`  ✓ Found existing product: ${product.id}`);
      } else {
        product = await stripe.products.create({
          name: `AI Sales Agent - ${plan.name}`,
          description: plan.features.join(', '),
          metadata: {
            plan_id: plan.id,
          },
        });
        console.log(`  ✓ Created new product: ${product.id}`);
      }

      products[plan.id] = product;

      // Create prices
      console.log(`💰 Creating prices for ${plan.name}:`);
      
      // Monthly price
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price.monthly,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        metadata: {
          plan_id: plan.id,
          billing_period: 'monthly',
        },
      });
      console.log(`  ✓ Monthly price: ${monthlyPrice.id} ($${plan.price.monthly / 100}/month)`);
      prices[`${plan.id}_monthly`] = monthlyPrice;

      // Yearly price
      const yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price.yearly,
        currency: 'usd',
        recurring: {
          interval: 'year',
        },
        metadata: {
          plan_id: plan.id,
          billing_period: 'yearly',
        },
      });
      console.log(`  ✓ Yearly price: ${yearlyPrice.id} ($${plan.price.yearly / 100}/year)`);
      prices[`${plan.id}_yearly`] = yearlyPrice;
      
      console.log();
    }

    // Create webhook endpoint if not exists
    console.log('🔗 Setting up webhook endpoint...');
    
    const webhookUrl = process.env.NODE_ENV === 'production'
      ? `${process.env.APP_BASE_URL}/api/webhooks/stripe`
      : 'https://your-ngrok-url.ngrok.io/api/webhooks/stripe'; // Use ngrok for local testing
    
    const existingWebhooks = await stripe.webhookEndpoints.list({ limit: 100 });
    const existingWebhook = existingWebhooks.data.find(w => w.url === webhookUrl);
    
    if (!existingWebhook) {
      const webhook = await stripe.webhookEndpoints.create({
        url: webhookUrl,
        enabled_events: [
          'customer.subscription.created',
          'customer.subscription.updated',
          'customer.subscription.deleted',
          'invoice.payment_succeeded',
          'invoice.payment_failed',
          'customer.created',
          'customer.updated',
        ],
      });
      console.log(`  ✓ Created webhook: ${webhook.id}`);
      console.log(`  📌 Webhook secret: ${webhook.secret}`);
      console.log(`  ⚠️  Add this to your .env.local: STRIPE_WEBHOOK_SECRET=${webhook.secret}`);
    } else {
      console.log(`  ✓ Webhook already exists: ${existingWebhook.id}`);
    }

    // Output environment variables to set
    console.log('\n' + '='.repeat(60));
    console.log('✅ Stripe setup complete!\n');
    console.log('Add these to your .env.local file:\n');
    console.log('# Stripe Price IDs');
    
    Object.entries(prices).forEach(([key, price]) => {
      const envKey = `STRIPE_PRICE_ID_${key.toUpperCase()}`;
      console.log(`${envKey}=${price.id}`);
    });

    console.log('\n# Stripe Product IDs');
    Object.entries(products).forEach(([key, product]) => {
      const envKey = `STRIPE_PRODUCT_ID_${key.toUpperCase()}`;
      console.log(`${envKey}=${product.id}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 Setup complete! Your Stripe products and prices are ready.');
    console.log('\nNext steps:');
    console.log('1. Copy the environment variables above to your .env.local');
    console.log('2. If testing locally, set up ngrok and update the webhook URL');
    console.log('3. Run "npm run stripe:webhook" to listen for webhooks locally');
    
  } catch (error) {
    console.error('❌ Error setting up Stripe:', error.message);
    process.exit(1);
  }
}

// Run setup
setupStripe();
