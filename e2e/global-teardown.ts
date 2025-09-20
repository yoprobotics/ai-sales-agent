import { FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global E2E teardown...');

  if (process.env.CLEANUP_TEST_DB === 'true') {
    try {
      console.log('🗑️  Cleaning up test database...');
      execSync('cd apps/api && npx prisma migrate reset --force --skip-seed', {
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
        stdio: 'inherit'
      });
    } catch (error) {
      console.error('❌ Database cleanup failed:', error);
    }
  }

  console.log('✅ Global teardown completed');
}

export default globalTeardown;
