# 🧪 AI Sales Agent - Test Infrastructure Documentation

## 📊 Test Coverage Status

| Component | Coverage | Status |
|-----------|----------|--------|
| Core Package | 80%+ | ✅ Implemented |
| Ingest Package | 75%+ | ✅ Implemented |
| Qualify Package | 75%+ | ✅ Implemented |
| API Integration | 70%+ | ✅ Implemented |
| Security Tests | - | ✅ Implemented |
| Stripe Integration | - | ✅ Implemented |
| SendGrid Integration | - | ✅ Implemented |
| E2E Tests | - | ✅ Implemented |

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
npm run playwright:install  # For E2E tests
```

### Run All Tests
```bash
npm test                    # Run all test suites
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only  
npm run test:e2e           # E2E tests only
```

### Run with Coverage
```bash
npm run test:coverage      # Generate coverage report
```

### Watch Mode (Development)
```bash
npm run test:watch         # Run tests in watch mode
```

## 📁 Test Structure

```
.
├── apps/
│   ├── web/
│   │   ├── src/__tests__/        # Web app unit tests
│   │   ├── jest.config.js
│   │   └── jest.setup.js
│   └── api/
│       ├── src/__tests__/        # API tests
│       │   ├── auth.test.ts      # Authentication tests
│       │   ├── prospects.test.ts # Prospects API tests
│       │   ├── security.test.ts  # Security tests
│       │   ├── stripe.test.ts    # Stripe integration
│       │   └── sendgrid.test.ts  # SendGrid integration
│       ├── jest.config.js
│       └── jest.setup.js
├── packages/
│   ├── core/src/__tests__/       # Core utilities tests
│   ├── ingest/src/__tests__/     # CSV parsing tests
│   └── qualify/src/__tests__/    # AI qualification tests
├── e2e/
│   ├── tests/
│   │   ├── auth.spec.ts         # Auth E2E tests
│   │   ├── prospects.spec.ts    # Prospects E2E tests
│   │   ├── pipeline.spec.ts     # Pipeline E2E tests
│   │   └── workflow-complete.spec.ts # Full workflow test
│   ├── fixtures/                 # Test data files
│   └── playwright.config.ts
├── jest.config.js                # Root Jest config
├── test-setup.js                 # Global test setup
└── .env.test                     # Test environment variables
```

## 🎯 Test Types

### 1. Unit Tests
Test individual functions and components in isolation.

**Location**: `*/src/__tests__/*.test.ts`

**Coverage Requirements**:
- Core: 80%
- Packages: 75%
- API: 70%

**Example**:
```typescript
// packages/core/src/__tests__/utils.test.ts
describe('hashPassword', () => {
  it('should hash and verify password correctly', async () => {
    const password = 'Test123!@#';
    const hash = await hashPassword(password);
    expect(await verifyPassword(password, hash)).toBe(true);
  });
});
```

### 2. Integration Tests
Test API endpoints with database interactions.

**Location**: `apps/api/src/__tests__/*.test.ts`

**Features**:
- Real database operations (test DB)
- JWT authentication flow
- Request/response validation
- Error handling

**Example**:
```typescript
// apps/api/src/__tests__/auth.test.ts
it('should register a new user', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { email: 'test@example.com', ... }
  });
  await register(req, res);
  expect(res._getStatusCode()).toBe(201);
});
```

### 3. E2E Tests
Test complete user workflows through the UI.

**Location**: `e2e/tests/*.spec.ts`

**Framework**: Playwright

**Features**:
- Multi-browser support (Chrome, Firefox, Safari)
- Mobile testing
- Visual regression
- Network interception

**Example**:
```typescript
// e2e/tests/workflow-complete.spec.ts
test('complete workflow: Auth → ICP → Import → Qualify', async ({ page }) => {
  await page.goto('/register');
  // ... complete user journey
});
```

### 4. Security Tests
Validate security measures and protections.

**Coverage**:
- ✅ Rate limiting
- ✅ CSRF protection
- ✅ JWT security
- ✅ Password validation
- ✅ XSS prevention
- ✅ SQL injection protection
- ✅ File upload validation
- ✅ Security headers

### 5. External Service Tests
Test integrations with mocked external services.

**Services**:
- ✅ Stripe (payments)
- ✅ SendGrid (emails)
- ✅ OpenAI (AI qualification)
- ✅ S3 (file storage)

## 🔧 Test Configuration

### Environment Variables
```bash
# .env.test
DATABASE_URL=postgresql://test:test@localhost:5432/test
JWT_SECRET=test-jwt-secret-32-characters-long
STRIPE_SECRET_KEY=sk_test_mock
SENDGRID_API_KEY=SG.test_mock
OPENAI_API_KEY=sk-test-mock
SUPPRESS_LOGS=true
```

### Database Setup
Tests use a separate test database that's reset between test runs.

```bash
# Setup test database
cd apps/api
DATABASE_URL=$TEST_DATABASE_URL npx prisma migrate deploy
```

### Mocking Strategy

**External Services**: All external APIs are mocked
```typescript
jest.mock('stripe');
jest.mock('@sendgrid/mail');
jest.mock('openai');
```

**Database**: Real test database for integration tests
```typescript
beforeEach(async () => {
  await prisma.user.deleteMany();
  // Clean slate for each test
});
```

## 🏃 Running Tests in CI/CD

GitHub Actions workflow automatically runs:

1. **Unit Tests** - On every push/PR
2. **Integration Tests** - With PostgreSQL service
3. **E2E Tests** - With full app deployment
4. **Coverage Report** - Uploaded to Codecov

```yaml
# .github/workflows/test.yml
jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:unit
  
  integration-tests:
    services:
      postgres:
        image: postgres:15
    steps:
      - run: npm run test:integration
  
  e2e-tests:
    steps:
      - run: npx playwright install
      - run: npm run test:e2e
```

## 📈 Coverage Requirements

Minimum coverage thresholds:

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 60,
    functions: 60,
    lines: 60,
    statements: 60
  }
}
```

Package-specific thresholds:
- Core: 80% all metrics
- Ingest: 75% all metrics  
- Qualify: 75% all metrics
- API: 70% all metrics

## 🐛 Debugging Tests

### Debug Unit/Integration Tests
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Debug E2E Tests
```bash
npm run test:e2e:debug    # Opens Playwright inspector
npm run test:e2e:ui       # Opens Playwright UI mode
```

### View Test Report
```bash
npx playwright show-report
```

## 🎯 Test Best Practices

### 1. Test Structure
```typescript
describe('Feature', () => {
  beforeEach(() => {
    // Setup
  });
  
  afterEach(() => {
    // Cleanup
  });
  
  it('should do something specific', () => {
    // Arrange
    // Act  
    // Assert
  });
});
```

### 2. Naming Convention
- Test files: `*.test.ts` or `*.spec.ts`
- Describe blocks: Feature or module name
- It blocks: "should" + expected behavior

### 3. Test Data
- Use factories for consistent test data
- Clean up after each test
- Don't rely on test execution order

### 4. Mocking
- Mock external services
- Use real implementations when possible
- Clear mocks between tests

### 5. Assertions
- One logical assertion per test
- Use specific matchers
- Test both success and failure paths

## 🔍 Troubleshooting

### Common Issues

**1. Database Connection Errors**
```bash
# Ensure test database is running
docker-compose up -d postgres-test
```

**2. Playwright Browser Issues**
```bash
# Reinstall browsers
npx playwright install --with-deps
```

**3. Jest Memory Issues**
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm test
```

**4. Flaky E2E Tests**
- Add explicit waits: `await page.waitForSelector()`
- Increase timeout: `test.setTimeout(60000)`
- Use retries: `test.describe.configure({ retries: 2 })`

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library](https://testing-library.com/docs/)
- [Node Test Patterns](https://github.com/goldbergyoni/nodebestpractices#4-testing-and-overall-quality-practices)

## ✅ Checklist for New Tests

- [ ] Test file in correct location
- [ ] Follows naming convention
- [ ] Has proper setup/teardown
- [ ] Tests both success and failure cases
- [ ] Mocks external dependencies
- [ ] Cleans up test data
- [ ] Meets coverage requirements
- [ ] Passes in CI/CD
- [ ] Documentation updated if needed

---

**Last Updated**: December 2024
**Maintained By**: AI Sales Agent Team
