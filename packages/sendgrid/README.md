# 📧 @ai-sales-agent/sendgrid

Modular SendGrid integration package for AI Sales Agent.

## 🎯 Philosophy

Designed with the same modular architecture as our Stripe package:

- **Independent modules**: Each function can be tested separately
- **Detailed logging**: Debug with `DEBUG=sendgrid:* npm test`
- **Type-safe**: Full TypeScript support
- **Error handling**: Comprehensive error management
- **Retry logic**: Automatic retry for rate-limited requests
- **Template system**: Built-in Handlebars templating

## 📦 Installation

```bash
npm install @ai-sales-agent/sendgrid
```

## 🔧 Configuration

Set your SendGrid API key:

```env
SENDGRID_API_KEY=SG.xxx...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Your Company
```

## 🚀 Usage

### Basic Email Sending

```typescript
import { sendEmail } from '@ai-sales-agent/sendgrid';

// Send simple email
const response = await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  text: 'Thanks for signing up!',
  html: '<p>Thanks for signing up!</p>',
});

// Send to multiple recipients
const response = await sendEmail({
  to: ['user1@example.com', 'user2@example.com'],
  subject: 'Team Update',
  html: '<p>Here is our weekly update...</p>',
  categories: ['weekly-update', 'team'],
});
```

### Template Emails

```typescript
import { 
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail 
} from '@ai-sales-agent/sendgrid';

// Send welcome email
await sendWelcomeEmail('user@example.com', {
  firstName: 'John',
  companyName: 'Acme Corp',
});

// Send verification email
await sendVerificationEmail('user@example.com', {
  firstName: 'John',
  verificationUrl: 'https://app.com/verify?token=xxx',
  expiresIn: '24 hours',
});

// Send password reset
await sendPasswordResetEmail('user@example.com', {
  firstName: 'John',
  resetUrl: 'https://app.com/reset?token=xxx',
  expiresIn: '1 hour',
});
```

### Bulk Emails

```typescript
import { sendBulkEmails } from '@ai-sales-agent/sendgrid';

const emails = [
  {
    to: 'user1@example.com',
    subject: 'Your weekly report',
    templateId: 'template_123',
    dynamicTemplateData: { name: 'User 1', stats: {...} },
  },
  {
    to: 'user2@example.com',
    subject: 'Your weekly report',
    templateId: 'template_123',
    dynamicTemplateData: { name: 'User 2', stats: {...} },
  },
];

const results = await sendBulkEmails(emails);
console.log(`Sent: ${results.filter(r => r.success).length}`);
```

### Scheduled Emails

```typescript
import { scheduleEmail } from '@ai-sales-agent/sendgrid';

// Schedule email for 1 hour from now
const sendAt = new Date(Date.now() + 60 * 60 * 1000);

await scheduleEmail(
  {
    to: 'user@example.com',
    subject: 'Reminder',
    text: 'Don\'t forget about your meeting!',
  },
  sendAt
);
```

### Custom Templates with Handlebars

```typescript
import { renderTemplate, createHtmlTemplate } from '@ai-sales-agent/sendgrid';

// Render template with data
const html = renderTemplate(
  'Hello {{firstName}}, you have {{count}} new {{pluralize count "message"}}!',
  { firstName: 'John', count: 3 }
);
// Output: "Hello John, you have 3 new messages!"

// Create full HTML email
const emailHtml = createHtmlTemplate(
  `
    <h1>Welcome {{firstName}}!</h1>
    <p>Thanks for joining us.</p>
    <a href="{{loginUrl}}" class="button">Get Started</a>
  `,
  {
    title: 'Welcome Email',
    preheader: 'Thanks for signing up!',
  }
);
```

### Suppression List Management

```typescript
import { 
  unsubscribeEmail, 
  resubscribeEmail,
  isEmailSuppressed,
  getSuppressionList 
} from '@ai-sales-agent/sendgrid';

// Unsubscribe an email
await unsubscribeEmail('user@example.com');

// Check if email is suppressed
const isSuppressed = await isEmailSuppressed('user@example.com');

// Get all unsubscribed emails
const unsubscribed = await getSuppressionList('unsubscribe', {
  startTime: new Date('2024-01-01'),
  limit: 100,
});

// Resubscribe an email
await resubscribeEmail('user@example.com');
```

### Email Statistics

```typescript
import { 
  getEmailStats, 
  getCategoryStats,
  getEmailActivity 
} from '@ai-sales-agent/sendgrid';

// Get overall stats
const stats = await getEmailStats(
  new Date('2024-01-01'),
  new Date(),
  'week'
);
console.log(`Sent: ${stats.sent}, Delivered: ${stats.delivered}`);

// Get stats by category
const categoryStats = await getCategoryStats(
  ['welcome', 'weekly-report'],
  new Date('2024-01-01')
);

// Get activity for specific email
const activity = await getEmailActivity('user@example.com');
```

## 🐛 Debugging

Enable debug logs:

```bash
# Debug all SendGrid operations
DEBUG=sendgrid:* npm run dev

# Debug specific modules
DEBUG=sendgrid:email.* npm run dev
DEBUG=sendgrid:template.* npm run dev
DEBUG=sendgrid:stats.* npm run dev
```

## 🧪 Testing

### Sandbox Mode

Use sandbox mode to test without sending real emails:

```typescript
import { sendEmail } from '@ai-sales-agent/sendgrid';

// Enable sandbox mode
await sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'This won\'t actually be sent',
  sandboxMode: true, // Email validated but not sent
});
```

### Unit Tests

```bash
# Run all tests
npm test

# Run specific test
npm test send.test.ts

# Run with coverage
npm run test:coverage
```

## 📊 Pre-configured Templates

Built-in email templates:

- `WELCOME` - New user welcome
- `VERIFY_EMAIL` - Email verification
- `RESET_PASSWORD` - Password reset
- `SUBSCRIPTION_ACTIVATED` - Plan activated
- `SUBSCRIPTION_CANCELED` - Plan canceled
- `PAYMENT_FAILED` - Payment issue
- `PROSPECT_REPLIED` - New prospect reply
- `WEEKLY_REPORT` - Weekly statistics
- `QUOTA_WARNING` - Usage warning
- `AI_INSIGHT` - AI recommendations

## 🔄 Error Handling

```typescript
import { sendEmail, SendGridError, isRateLimitError } from '@ai-sales-agent/sendgrid';

try {
  await sendEmail({ ... });
} catch (error) {
  if (error instanceof SendGridError) {
    console.log('SendGrid error:', error.code, error.statusCode);
    
    if (isRateLimitError(error)) {
      // Wait and retry
      await new Promise(r => setTimeout(r, 60000));
      await sendEmail({ ... });
    }
  }
}
```

## 🛠️ Development

### Project Structure

```
packages/sendgrid/
├── src/
│   ├── client.ts         # SendGrid client singleton
│   ├── send.ts           # Email sending functions
│   ├── templates.ts      # Template management
│   ├── suppression.ts    # Suppression lists
│   ├── stats.ts          # Statistics & analytics
│   ├── errors.ts         # Error management
│   ├── types.ts          # TypeScript types
│   └── index.ts          # Package exports
└── tests/
    ├── send.test.ts
    ├── templates.test.ts
    └── suppression.test.ts
```

### Adding New Functions

1. Create function in appropriate module
2. Add logging with `log()` helper
3. Handle errors with `handleSendGridError()`
4. Export from `index.ts`
5. Add tests
6. Update documentation

## 📝 License

Proprietary - AI Sales Agent