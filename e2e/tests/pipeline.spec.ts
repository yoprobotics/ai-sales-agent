import { test, expect } from '@playwright/test';

// Use authenticated state
test.use({ storageState: 'e2e/.auth/user.json' });

test.describe('CRM Pipeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/pipeline');
  });

  test('should display pipeline stages', async ({ page }) => {
    // Should show all pipeline stages
    await expect(page.locator('text=New')).toBeVisible();
    await expect(page.locator('text=Contacted')).toBeVisible();
    await expect(page.locator('text=Meeting')).toBeVisible();
    await expect(page.locator('text=Negotiation')).toBeVisible();
    await expect(page.locator('text=Won')).toBeVisible();
    await expect(page.locator('text=Lost')).toBeVisible();
  });

  test('should drag and drop prospect between stages', async ({ page }) => {
    // Find a prospect card in 'New' stage
    const prospectCard = page.locator('[data-testid="prospect-card"]').first();
    const prospectName = await prospectCard.textContent();
    
    // Find 'Contacted' stage column
    const contactedColumn = page.locator('[data-testid="stage-contacted"]');
    
    // Drag and drop
    await prospectCard.dragTo(contactedColumn);
    
    // Wait for update
    await page.waitForTimeout(1000);
    
    // Verify prospect moved to 'Contacted'
    await expect(contactedColumn.locator(`text=${prospectName}`)).toBeVisible();
    
    // Should show success message
    await expect(page.locator('text=Prospect stage updated')).toBeVisible();
  });

  test('should open prospect details modal', async ({ page }) => {
    // Click on a prospect card
    await page.locator('[data-testid="prospect-card"]').first().click();
    
    // Should open modal
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Should show prospect details
    await expect(page.locator('h2:has-text("Prospect Details")')).toBeVisible();
    await expect(page.locator('text=Contact Information')).toBeVisible();
    await expect(page.locator('text=Company Details')).toBeVisible();
    await expect(page.locator('text=Qualification Score')).toBeVisible();
    
    // Should have action buttons
    await expect(page.locator('button:has-text("Send Email")')).toBeVisible();
    await expect(page.locator('button:has-text("Add Note")')).toBeVisible();
    await expect(page.locator('button:has-text("Schedule Activity")')).toBeVisible();
  });

  test('should add a note to prospect', async ({ page }) => {
    // Open prospect details
    await page.locator('[data-testid="prospect-card"]').first().click();
    
    // Click add note
    await page.click('button:has-text("Add Note")');
    
    // Enter note
    await page.fill('textarea[name="note"]', 'Had a great initial call. Very interested in our Pro plan.');
    
    // Save note
    await page.click('button:has-text("Save Note")');
    
    // Should show success message
    await expect(page.locator('text=Note added successfully')).toBeVisible();
    
    // Note should appear in timeline
    await expect(page.locator('text=Had a great initial call')).toBeVisible();
  });

  test('should schedule an activity', async ({ page }) => {
    // Open prospect details
    await page.locator('[data-testid="prospect-card"]').first().click();
    
    // Click schedule activity
    await page.click('button:has-text("Schedule Activity")');
    
    // Fill activity form
    await page.selectOption('select[name="type"]', 'meeting');
    await page.fill('input[name="title"]', 'Product Demo');
    await page.fill('textarea[name="description"]', 'Demo of Pro features');
    
    // Set date and time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.fill('input[name="scheduledAt"]', tomorrow.toISOString().slice(0, 16));
    
    // Enable reminder
    await page.check('input[name="reminder.enabled"]');
    await page.selectOption('select[name="reminder.beforeMinutes"]', '60');
    
    // Save activity
    await page.click('button:has-text("Schedule")');
    
    // Should show success message
    await expect(page.locator('text=Activity scheduled')).toBeVisible();
    
    // Should appear in activities list
    await expect(page.locator('text=Product Demo')).toBeVisible();
  });

  test('should filter pipeline by score', async ({ page }) => {
    // Open filter panel
    await page.click('button:has-text("Filters")');
    
    // Set minimum score
    await page.fill('input[name="minScore"]', '70');
    
    // Apply filter
    await page.click('button:has-text("Apply Filters")');
    
    // Wait for filtered results
    await page.waitForTimeout(500);
    
    // Check all visible prospects have score >= 70
    const scores = await page.locator('[data-testid="prospect-score"]').allTextContents();
    scores.forEach(score => {
      const numericScore = parseInt(score);
      expect(numericScore).toBeGreaterThanOrEqual(70);
    });
  });

  test('should show pipeline metrics', async ({ page }) => {
    // Metrics should be visible
    await expect(page.locator('text=Total Prospects')).toBeVisible();
    await expect(page.locator('text=Qualified')).toBeVisible();
    await expect(page.locator('text=Conversion Rate')).toBeVisible();
    await expect(page.locator('text=Avg. Score')).toBeVisible();
    
    // Should show stage distribution
    await expect(page.locator('[data-testid="stage-count-new"]')).toBeVisible();
    await expect(page.locator('[data-testid="stage-count-contacted"]')).toBeVisible();
    await expect(page.locator('[data-testid="stage-count-meeting"]')).toBeVisible();
  });
});
