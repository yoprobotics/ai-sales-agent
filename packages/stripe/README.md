# 💳 @ai-sales-agent/stripe

Modular Stripe integration package for AI Sales Agent.

## 🎯 Philosophy

This package is designed with **modularity** and **debuggability** in mind:

- **Independent modules**: Each function can be tested separately
- **Detailed logging**: Debug with `DEBUG=stripe:* npm test`
- **Type-safe**: Full TypeScript support
- **Error handling**: Comprehensive error management
- **Retry logic**: Automatic retry with exponential backoff

## 📦 Installation

```bash
npm install @ai-sales-agent/stripe
```

## 🔧 Configuration

Set your Stripe API key:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🚀 Usage

### Customer Management

```typescript
import { createCustomer, getCustomer, getOrCreateCustomer } from '@ai-sales-agent/stripe';

// Create a new customer
const customer = await createCustomer({
  email: 'user@example.com',
  name: 'John Doe',
  metadata: {
    userId: 'user_123',
  },
});

// Get existing customer
const existing = await getCustomer('cus_123');

// Get or create (idempotent)
const customer = await getOrCreateCustomer('user@example.com', {
  name: 'John Doe',
});
```

### Subscription Management

```typescript
import { 
  createSubscription, 
  updateSubscription, 
  cancelSubscription,
  getActiveSubscription 
} from '@ai-sales-agent/stripe';

// Create subscription
const subscription = await createSubscription({
  customerId: 'cus_123',
  priceId: 'price_123',
  trialDays: 14,
});

// Update subscription (upgrade/downgrade)
const updated = await updateSubscription('sub_123', {
  priceId: 'price_456',
  prorationBehavior: 'create_prorations',
});

// Cancel subscription
const canceled = await cancelSubscription('sub_123', false); // Cancel at period end

// Get active subscription
const active = await getActiveSubscription('cus_123');
```

### Checkout Sessions

```typescript
import { createCheckoutSession } from '@ai-sales-agent/stripe';

// Create checkout session
const session = await createCheckoutSession({
  customerId: 'cus_123',
  priceId: 'price_123',
  mode: 'subscription',
  successUrl: 'https://app.com/success',
  cancelUrl: 'https://app.com/cancel',
  metadata: {
    userId: 'user_123',
  },
});

// Redirect user to session.url
```

### Customer Portal

```typescript
import { createPortalSession } from '@ai-sales-agent/stripe';

// Create portal session for customer self-service
const portal = await createPortalSession(
  'cus_123',
  'https://app.com/dashboard'
);

// Redirect user to portal.url
```

### Webhooks

```typescript
import { constructWebhookEvent, handleWebhookEvent } from '@ai-sales-agent/stripe';

// In your webhook endpoint
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  // Verify and construct event
  const event = constructWebhookEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  // Handle event
  await handleWebhookEvent(event);
  
  return Response.json({ received: true });
}
```

### Product Initialization

```typescript
import { initializeSubscriptionProducts } from '@ai-sales-agent/stripe';

// Run once to create products and prices in Stripe
await initializeSubscriptionProducts();
```

## 🐛 Debugging

Enable debug logs:

```bash
# Debug all Stripe operations
DEBUG=stripe:* npm run dev

# Debug specific modules
DEBUG=stripe:customer.* npm run dev
DEBUG=stripe:subscription.* npm run dev
DEBUG=stripe:webhook.* npm run dev
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run specific test
npm test customers.test.ts

# Run with coverage
npm run test:coverage
```

### Integration Tests

Use Stripe test mode:

```typescript
import { isTestMode } from '@ai-sales-agent/stripe';

if (isTestMode()) {
  console.log('Using Stripe test mode');
}
```

### Test with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

## 📊 Error Handling

```typescript
import { handleStripeError, StripeServiceError, isRetryableError } from '@ai-sales-agent/stripe';

try {
  const customer = await createCustomer({ email: 'invalid' });
} catch (error) {
  if (error instanceof StripeServiceError) {
    console.log('Stripe error:', error.code, error.message);
    
    if (isRetryableError(error)) {
      // Retry the operation
    }
  }
}
```

## 📝 Subscription Plans

Pre-configured plans:

```typescript
import { SUBSCRIPTION_PLANS } from '@ai-sales-agent/stripe';

const plans = {
  STARTER: {
    monthlyPrice: 49,
    yearlyPrice: 490,
    limits: {
      icps: 1,
      prospects: 200,
      sequences: 1,
      messages: 1000,
      teamMembers: 1,
    },
  },
  PRO: {
    monthlyPrice: 149,
    yearlyPrice: 1490,
    limits: {
      icps: 5,
      prospects: 2000,
      sequences: 10,
      messages: 10000,
      teamMembers: 3,
    },
  },
  BUSINESS: {
    monthlyPrice: 499,
    yearlyPrice: 4990,
    limits: {
      icps: -1, // unlimited
      prospects: -1,
      sequences: -1,
      messages: -1,
      teamMembers: 10,
    },
  },
};
```

## 🔄 Webhook Events

Handled events:

- `checkout.session.completed` - Subscription activated
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Plan changed
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Payment successful
- `invoice.payment_failed` - Payment failed
- `payment_intent.succeeded` - One-time payment

## 🛠️ Development

### Project Structure

```
packages/stripe/
├── src/
│   ├── client.ts           # Stripe client singleton
│   ├── customers.ts        # Customer operations
│   ├── products.ts         # Products & pricing
│   ├── subscriptions.ts    # Subscription management
│   ├── checkout.ts         # Checkout sessions
│   ├── portal.ts           # Customer portal
│   ├── webhooks.ts         # Webhook handling
│   ├── errors.ts           # Error management
│   ├── types.ts            # TypeScript types
│   └── index.ts            # Package exports
└── tests/
    ├── customers.test.ts
    ├── subscriptions.test.ts
    └── webhooks.test.ts
```

### Adding New Functions

1. Create function in appropriate module
2. Add logging with `log()` helper
3. Handle errors with `handleStripeError()`
4. Export from `index.ts`
5. Add tests
6. Update documentation

## 📄 License

Proprietary - AI Sales Agent
