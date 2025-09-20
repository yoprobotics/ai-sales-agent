import { test, expect } from '@playwright/test';
import path from 'path';

// Use authenticated state
test.use({ storageState: 'e2e/.auth/user.json' });

test.describe('Prospects Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/prospects');
  });

  test('should create a new prospect manually', async ({ page }) => {
    // Click add prospect button
    await page.click('button:has-text("Add Prospect")');

    // Fill prospect form
    await page.fill('input[name="email"]', 'newprospect@company.com');
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="jobTitle"]', 'CEO');
    
    // Company information
    await page.fill('input[name="company.name"]', 'Tech Startup Inc');
    await page.fill('input[name="company.domain"]', 'techstartup.com');
    await page.selectOption('select[name="company.industry"]', 'Technology');
    await page.selectOption('select[name="company.size"]', 'medium');
    await page.fill('input[name="company.location"]', 'San Francisco, CA');
    
    // Additional fields
    await page.fill('input[name="linkedinUrl"]', 'https://linkedin.com/in/johndoe');
    await page.fill('textarea[name="notes"]', 'High-value prospect, interested in our solution');
    
    // Select ICP
    await page.selectOption('select[name="icpId"]', { index: 1 });
    
    // Submit form
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(page.locator('text=Prospect added successfully')).toBeVisible();
    
    // Should appear in prospects list
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Tech Startup Inc')).toBeVisible();
  });

  test('should import prospects from CSV', async ({ page }) => {
    // Click import button
    await page.click('button:has-text("Import CSV")');

    // Upload CSV file
    const csvPath = path.join(__dirname, '../fixtures/prospects.csv');
    await page.setInputFiles('input[type="file"]', csvPath);

    // Wait for preview
    await expect(page.locator('text=Preview Import')).toBeVisible();
    
    // Should show column mapping
    await expect(page.locator('text=Map CSV Columns')).toBeVisible();
    
    // Verify auto-detected mappings
    await expect(page.locator('select[name="email_mapping"]')).toHaveValue('Email');
    await expect(page.locator('select[name="firstName_mapping"]')).toHaveValue('First Name');
    await expect(page.locator('select[name="company.name_mapping"]')).toHaveValue('Company');
    
    // Select ICP for import
    await page.selectOption('select[name="icpId"]', { index: 1 });
    
    // Start import
    await page.click('button:has-text("Start Import")');

    // Should show progress
    await expect(page.locator('text=Importing prospects...')).toBeVisible();
    
    // Wait for completion
    await expect(page.locator('text=Import completed')).toBeVisible({ timeout: 30000 });
    
    // Should show results
    await expect(page.locator('text=Successfully imported')).toBeVisible();
    await expect(page.locator('text=Duplicates skipped')).toBeVisible();
  });

  test('should qualify a prospect with AI', async ({ page }) => {
    // Find an unqualified prospect (score = 0)
    const prospectRow = page.locator('tr').filter({ hasText: 'Score: 0' }).first();
    
    // Click qualify button
    await prospectRow.locator('button:has-text("Qualify")', ).click();

    // Should show loading state
    await expect(page.locator('text=Qualifying prospect...')).toBeVisible();
    
    // Wait for qualification to complete
    await expect(page.locator('text=Qualification complete')).toBeVisible({ timeout: 15000 });
    
    // Should show score and explanation
    await expect(page.locator('text=/Score: \d+/')).toBeVisible();
    await expect(page.locator('text=Budget')).toBeVisible();
    await expect(page.locator('text=Authority')).toBeVisible();
    await expect(page.locator('text=Need')).toBeVisible();
    await expect(page.locator('text=Timing')).toBeVisible();
    
    // Should have confidence level
    await expect(page.locator('text=/Confidence: \d+%/')).toBeVisible();
  });

  test('should filter prospects by stage', async ({ page }) => {
    // Select filter
    await page.selectOption('select[name="stage"]', 'new');
    
    // Wait for filtered results
    await page.waitForTimeout(500);
    
    // All visible prospects should be in 'new' stage
    const stages = await page.locator('[data-testid="prospect-stage"]').allTextContents();
    expect(stages.every(stage => stage === 'New')).toBeTruthy();
    
    // Change filter to 'contacted'
    await page.selectOption('select[name="stage"]', 'contacted');
    await page.waitForTimeout(500);
    
    // Check updated results
    const contactedStages = await page.locator('[data-testid="prospect-stage"]').allTextContents();
    expect(contactedStages.every(stage => stage === 'Contacted')).toBeTruthy();
  });

  test('should search prospects', async ({ page }) => {
    // Enter search term
    await page.fill('input[placeholder="Search prospects..."]', 'John');
    
    // Press Enter or click search
    await page.press('input[placeholder="Search prospects..."]', 'Enter');
    
    // Wait for results
    await page.waitForTimeout(500);
    
    // All results should contain 'John'
    const names = await page.locator('[data-testid="prospect-name"]').allTextContents();
    expect(names.every(name => name.toLowerCase().includes('john'))).toBeTruthy();
  });

  test('should export prospects to CSV', async ({ page }) => {
    // Select some prospects
    await page.check('input[type="checkbox"][data-testid="select-all"]');
    
    // Click export button
    await page.click('button:has-text("Export Selected")');
    
    // Choose export format
    await page.click('text=Export as CSV');
    
    // Download should start
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download")');
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toContain('prospects');
    expect(download.suggestedFilename()).toContain('.csv');
  });
});
