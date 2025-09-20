# Stripe Integration Setup Guide

This guide will walk you through setting up Stripe integration for AI Sales Agent.

## Prerequisites

- Stripe account (test mode for development)
- Access to Stripe Dashboard
- Node.js environment configured

## Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Verify your email
3. Complete your business profile (optional for test mode)

## Step 2: Get API Keys

1. Log into [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers → API keys**
3. Copy your test keys:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

## Step 3: Create Products and Prices

### Create Products

1. Go to **Products** in Stripe Dashboard
2. Click **Add product** for each plan:

#### Starter Plan
- **Name**: AI Sales Agent Starter
- **Description**: Perfect for small teams getting started with AI prospecting
- **Features**:
  - 1 ICP
  - 200 prospects/month
  - 1 email sequence
  - Basic AI features

#### Pro Plan
- **Name**: AI Sales Agent Pro
- **Description**: Advanced features for growing sales teams
- **Features**:
  - 5 ICPs
  - 2,000 prospects/month
  - 10 email sequences
  - Advanced AI features
  - Multi-channel sequences

#### Business Plan
- **Name**: AI Sales Agent Business
- **Description**: Enterprise features with unlimited usage
- **Features**:
  - Unlimited ICPs
  - Unlimited prospects
  - Unlimited sequences
  - CRM integrations
  - Dedicated support

### Create Prices

For each product, create both monthly and yearly prices:

1. Click on the product
2. Click **Add price**
3. Create prices:

#### Starter Prices
- Monthly: $49.00/month
- Yearly: $490.00/year (save ~17%)

#### Pro Prices
- Monthly: $149.00/month
- Yearly: $1,490.00/year (save ~17%)

#### Business Prices
- Monthly: $499.00/month
- Yearly: $4,990.00/year (save ~17%)

## Step 4: Configure Webhook Endpoint

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL:
   - **Development**: `https://your-ngrok-url.ngrok.io/api/webhooks/stripe`
   - **Production**: `https://your-domain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_method.attached`
5. Copy the **Webhook signing secret**: `whsec_...`

## Step 5: Configure Billing Portal

1. Go to **Settings → Billing → Customer portal**
2. Enable the customer portal
3. Configure features:
   - ✅ Allow customers to update payment methods
   - ✅ Allow customers to update billing addresses
   - ✅ Allow customers to view billing history
   - ✅ Allow customers to download invoices
   - ✅ Allow subscription cancellation
   - ✅ Allow plan switching (configure allowed plans)

## Step 6: Update Environment Variables

Update your `.env.local` file with the values from Stripe:

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
STRIPE_SECRET_KEY="sk_test_your_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# Stripe Price IDs (copy from your created prices)
STRIPE_PRICE_STARTER_MONTHLY="price_..."
STRIPE_PRICE_STARTER_YEARLY="price_..."
STRIPE_PRICE_PRO_MONTHLY="price_..."
STRIPE_PRICE_PRO_YEARLY="price_..."
STRIPE_PRICE_BUSINESS_MONTHLY="price_..."
STRIPE_PRICE_BUSINESS_YEARLY="price_..."

# Trial Configuration
STRIPE_TRIAL_ENABLED="true"
STRIPE_TRIAL_DAYS="14"
```

## Step 7: Run Database Migrations

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed database with test data
npm run db:seed
```

## Step 8: Test the Integration

### Test Webhook Locally

For local development, use ngrok to expose your localhost:

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Update webhook endpoint in Stripe Dashboard with ngrok URL
```

### Test Card Numbers

Use these test card numbers for different scenarios:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`
- **Insufficient funds**: `4000 0000 0000 9995`

### Test Subscription Flow

1. Create a new user account
2. Navigate to billing page
3. Select a plan
4. Complete checkout with test card
5. Verify subscription is activated
6. Check webhook logs in Stripe Dashboard

## Step 9: Monitor Subscription Statuses

The integration handles these subscription statuses:

- **TRIALING**: Free trial period active
- **ACTIVE**: Subscription is active and paid
- **PAST_DUE**: Payment failed, grace period
- **CANCELED**: Subscription canceled
- **UNPAID**: Multiple payment failures
- **INCOMPLETE**: Awaiting initial payment

## Step 10: Production Checklist

Before going to production:

- [ ] Switch to live API keys
- [ ] Update webhook endpoint to production URL
- [ ] Configure production prices
- [ ] Test with real payment methods
- [ ] Enable Stripe Tax if needed
- [ ] Configure fraud prevention rules
- [ ] Set up email receipts
- [ ] Configure dunning emails for failed payments
- [ ] Enable SCA (Strong Customer Authentication)
- [ ] Review and test all webhook handlers

## Troubleshooting

### Common Issues

1. **Webhook signature verification failed**
   - Ensure `STRIPE_WEBHOOK_SECRET` is correct
   - Check that you're using the raw request body
   - Verify the webhook endpoint URL matches

2. **Subscription not updating after payment**
   - Check webhook logs in Stripe Dashboard
   - Verify database connection
   - Check Prisma schema is up to date

3. **Checkout session not creating**
   - Verify API keys are correct
   - Check price IDs exist in Stripe
   - Ensure customer ID is valid

### Debug Mode

Enable debug logging for Stripe:

```javascript
// In your stripe.ts file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
  maxNetworkRetries: 2,
  telemetry: false,
  appInfo: {
    name: 'AI Sales Agent',
    version: '1.0.0',
  },
});

// Enable request logging
stripe.on('request', (event) => {
  console.log('Stripe Request:', event);
});

stripe.on('response', (event) => {
  console.log('Stripe Response:', event);
});
```

## Security Best Practices

1. **Never expose secret keys**: Keep `STRIPE_SECRET_KEY` server-side only
2. **Validate webhooks**: Always verify webhook signatures
3. **Use HTTPS**: Ensure all communication is over HTTPS
4. **Implement rate limiting**: Protect endpoints from abuse
5. **Log all transactions**: Keep audit trail of all payment events
6. **Handle errors gracefully**: Don't expose internal errors to users
7. **Regular key rotation**: Rotate API keys periodically
8. **Monitor for anomalies**: Set up alerts for unusual patterns

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Discord](https://discord.gg/stripe)

For AI Sales Agent issues:
- Check `/docs/TROUBLESHOOTING.md`
- Open an issue on GitHub
- Contact support@aisalesagent.com
