# @ai-sales-agent/ai-assist

AI-powered qualification and content generation for B2B sales.

## Features

### OpenAI Service
- ✅ Automatic retry with exponential backoff
- ✅ Rate limiting (50 requests/minute by default)
- ✅ PII sanitization before API calls
- ✅ Comprehensive metrics and cost tracking
- ✅ Structured JSON logging

### Qualification Service
- BANT scoring (Budget, Authority, Need, Timing)
- Transparent explanations in FR/EN
- Signal detection and confidence levels
- Fallback scoring when API fails

### Email Generation Service  
- Personalized cold emails in FR/EN
- Multiple tones (formal, casual, friendly, professional)
- Variable length (short, medium, long)
- HTML and plain text versions
- Fallback templates when API fails

## Installation

```bash
npm install @ai-sales-agent/ai-assist
```

## Usage

```typescript
import { createAIServices } from '@ai-sales-agent/ai-assist';

// Initialize services
const services = createAIServices({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'gpt-4-turbo-preview',
  maxRetries: 3,
  rateLimit: {
    interval: 60000,
    intervalCap: 50
  }
});

// Qualify a prospect
const score = await services.qualification.qualifyProspect({
  prospect: {
    email: 'john@example.com',
    firstName: 'John',
    company: {
      name: 'Example Corp',
      industry: 'Technology',
      size: 'medium'
    }
  },
  icp: {
    industry: ['Technology', 'Software'],
    companySize: ['medium', 'large'],
    location: ['US', 'Canada']
  },
  language: 'en'
});

// Generate an email
const email = await services.emailGeneration.generateEmail({
  prospect: {
    firstName: 'John',
    company: { name: 'Example Corp' }
  },
  sender: {
    firstName: 'Jane',
    lastName: 'Smith',
    company: 'AI Sales Agent',
    value_proposition: 'Automate your B2B prospecting'
  },
  context: {
    campaign_goal: 'Book a demo',
    call_to_action: 'Schedule a 15-minute call'
  },
  language: 'en',
  tone: 'professional',
  length: 'medium'
});

// Get metrics
const metrics = services.openai.getMetrics();
console.log(`Total cost: $${metrics.totalCost}`);
console.log(`Average latency: ${metrics.averageLatency}ms`);
```

## Security

### PII Protection
The service automatically sanitizes sensitive data before sending to OpenAI:
- Email addresses → `[EMAIL_REDACTED]`
- Phone numbers → `[PHONE_REDACTED]`
- SSN, credit cards, passwords → `[REDACTED]`
- API keys in URLs → `api_key=[REDACTED]`

### Rate Limiting
Default: 50 requests/minute, configurable via `rateLimit` option.

### Error Handling
- Automatic retry with exponential backoff
- Fallback to local logic when API fails
- Comprehensive error logging with request IDs

## Metrics & Monitoring

Every request is logged with:
- Request ID
- Latency (ms)
- Token usage (prompt/completion/total)
- Estimated cost
- Error details if failed

Example log:
```json
{
  "type": "openai_request",
  "requestId": "openai_1234567890_abc123",
  "model": "gpt-4-turbo-preview",
  "latencyMs": 2341,
  "promptTokens": 523,
  "completionTokens": 147,
  "totalTokens": 670,
  "estimatedCost": 0.0201
}
```

## Testing

```bash
npm test
npm run test:coverage
```

## License

Proprietary - AI Sales Agent © 2024