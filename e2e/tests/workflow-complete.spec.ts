import { test, expect } from '@playwright/test';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

test.describe('Complete E2E Workflow', () => {
  test('complete workflow: Auth → ICP → Import → Qualify → Pipeline → Message', async ({ page }) => {
    const uniqueEmail = `e2e-${uuidv4()}@test.com`;

    // Step 1: Register new user
    await test.step('Register new user', async () => {
      await page.goto('/register');
      await page.fill('input[name="email"]', uniqueEmail);
      await page.fill('input[name="password"]', 'Test123!@#');
      await page.fill('input[name="confirmPassword"]', 'Test123!@#');
      await page.fill('input[name="firstName"]', 'E2E');
      await page.fill('input[name="lastName"]', 'Test');
      await page.fill('input[name="companyName"]', 'E2E Test Corp');
      await page.selectOption('select[name="language"]', 'en');
      await page.selectOption('select[name="dataRegion"]', 'US');
      await page.check('input[name="acceptTerms"]');
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/dashboard');
    });

    // Step 2: Create ICP
    await test.step('Create Ideal Customer Profile', async () => {
      await page.goto('/dashboard/icps');
      await page.click('button:has-text("Create ICP")');
      
      await page.fill('input[name="name"]', 'Enterprise SaaS');
      await page.fill('textarea[name="description"]', 'Large software companies with 500+ employees');
      
      // Set criteria
      await page.click('text=Technology');
      await page.click('text=Software');
      await page.click('text=Large');
      await page.click('text=Enterprise');
      await page.fill('input[name="keywords"]', 'SaaS, B2B, Cloud');
      await page.selectOption('select[name="revenue"]', '50m_100m');
      
      await page.click('button:has-text("Create ICP")');
      await expect(page.locator('text=ICP created successfully')).toBeVisible();
    });

    // Step 3: Import prospects from CSV
    await test.step('Import prospects from CSV', async () => {
      await page.goto('/dashboard/prospects');
      await page.click('button:has-text("Import CSV")');
      
      const csvPath = path.join(__dirname, '../fixtures/prospects.csv');
      await page.setInputFiles('input[type="file"]', csvPath);
      
      await expect(page.locator('text=Preview Import')).toBeVisible();
      await page.selectOption('select[name="icpId"]', 'Enterprise SaaS');
      await page.click('button:has-text("Start Import")');
      
      await expect(page.locator('text=Import completed')).toBeVisible({ timeout: 30000 });
    });

    // Step 4: Qualify prospects with AI
    await test.step('Qualify prospects with AI', async () => {
      // Refresh to see imported prospects
      await page.reload();
      
      // Select first 3 prospects for qualification
      const prospects = page.locator('[data-testid="prospect-row"]');
      const count = Math.min(await prospects.count(), 3);
      
      for (let i = 0; i < count; i++) {
        const row = prospects.nth(i);
        await row.locator('input[type="checkbox"]').check();
      }
      
      // Bulk qualify
      await page.click('button:has-text("Bulk Actions")');
      await page.click('text=Qualify Selected');
      
      await expect(page.locator('text=Qualifying prospects...')).toBeVisible();
      await expect(page.locator('text=Qualification completed')).toBeVisible({ timeout: 30000 });
      
      // Verify scores are displayed
      await expect(page.locator('[data-testid="prospect-score"]:not(:has-text("0"))')).toHaveCount(count);
    });

    // Step 5: Move prospect through pipeline
    await test.step('Move prospect through pipeline stages', async () => {
      await page.goto('/dashboard/pipeline');
      
      // Find a qualified prospect
      const prospectCard = page.locator('[data-testid="prospect-card"]')
        .filter({ has: page.locator('[data-testid="score-badge"]') })
        .first();
      
      // Move from New to Contacted
      await prospectCard.dragTo(page.locator('[data-testid="stage-contacted"]'));
      await expect(page.locator('text=Stage updated to Contacted')).toBeVisible();
      
      // Move from Contacted to Meeting
      await page.waitForTimeout(1000);
      await prospectCard.dragTo(page.locator('[data-testid="stage-meeting"]'));
      await expect(page.locator('text=Stage updated to Meeting')).toBeVisible();
    });

    // Step 6: Generate and send personalized message
    await test.step('Generate AI message and add to sequence', async () => {
      // Open prospect details
      const prospectCard = page.locator('[data-testid="prospect-card"]').first();
      await prospectCard.click();
      
      // Generate AI message
      await page.click('button:has-text("Generate Message")');
      await page.selectOption('select[name="messageType"]', 'initial_outreach');
      await page.selectOption('select[name="tone"]', 'professional');
      await page.click('button:has-text("Generate with AI")');
      
      await expect(page.locator('text=Generating message...')).toBeVisible();
      await expect(page.locator('textarea[name="generatedMessage"]')).toHaveValue(/.+/, { timeout: 15000 });
      
      // Add to sequence
      await page.click('button:has-text("Add to Sequence")');
      await page.selectOption('select[name="sequenceId"]', { index: 1 });
      await page.click('button:has-text("Add to Sequence")');
      
      await expect(page.locator('text=Added to sequence')).toBeVisible();
    });

    // Step 7: Verify dashboard metrics updated
    await test.step('Verify dashboard shows updated metrics', async () => {
      await page.goto('/dashboard');
      
      // Should show prospects count
      await expect(page.locator('[data-testid="total-prospects"]')).not.toHaveText('0');
      
      // Should show qualified prospects
      await expect(page.locator('[data-testid="qualified-prospects"]')).not.toHaveText('0');
      
      // Should show pipeline distribution
      await expect(page.locator('[data-testid="pipeline-chart"]')).toBeVisible();
      
      // Should show recent activity
      await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();
      await expect(page.locator('text=Prospect qualified')).toBeVisible();
      await expect(page.locator('text=Stage updated')).toBeVisible();
    });

    // Step 8: Generate report
    await test.step('Generate and download report', async () => {
      await page.goto('/dashboard/reports');
      
      await page.click('button:has-text("Generate Report")');
      await page.selectOption('select[name="reportType"]', 'performance');
      await page.selectOption('select[name="timeRange"]', 'last_7_days');
      await page.click('button:has-text("Generate")');
      
      await expect(page.locator('text=Generating report...')).toBeVisible();
      await expect(page.locator('text=Report ready')).toBeVisible({ timeout: 20000 });
      
      // Download report
      const downloadPromise = page.waitForEvent('download');
      await page.click('button:has-text("Download PDF")');
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toContain('report');
      expect(download.suggestedFilename()).toContain('.pdf');
    });

    console.log('✅ Complete E2E workflow test passed!');
  });
});
