import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config({ path: '.env.test' });

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global E2E setup...');

  // Ensure test database exists and is migrated
  try {
    console.log('📦 Setting up test database...');
    execSync('cd apps/api && npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: 'inherit'
    });

    // Seed test data
    execSync('cd apps/api && npx tsx prisma/seed.test.ts', {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: 'inherit'
    });
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }

  // Create storage state for authenticated tests
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Login to create authenticated state
    await page.goto(`${config.projects[0].use.baseURL}/login`);
    await page.fill('input[name="email"]', 'e2e@test.com');
    await page.fill('input[name="password"]', 'Test123!@#');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard');

    // Save authentication state
    await context.storageState({ path: 'e2e/.auth/user.json' });
    console.log('✅ Authentication state saved');
  } catch (error) {
    console.error('❌ Failed to create authentication state:', error);
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup completed');
}

export default globalSetup;
