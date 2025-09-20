import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

test.describe('Authentication Flow', () => {
  test('should register a new user', async ({ page }) => {
    const uniqueEmail = `test-${uuidv4()}@example.com`;

    await page.goto('/register');

    // Fill registration form
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'Test123!@#');
    await page.fill('input[name="confirmPassword"]', 'Test123!@#');
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="companyName"]', 'Test Company');
    
    // Select language and region
    await page.selectOption('select[name="language"]', 'en');
    await page.selectOption('select[name="dataRegion"]', 'US');
    
    // Accept terms
    await page.check('input[name="acceptTerms"]');
    
    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Should show welcome message
    await expect(page.locator('text=Welcome to AI Sales Agent')).toBeVisible();
    
    // Should show user name in header
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('should login with existing user', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="email"]', 'e2e@test.com');
    await page.fill('input[name="password"]', 'Test123!@#');
    
    // Remember me option
    await page.check('input[name="rememberMe"]');
    
    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Should show dashboard content
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  });

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.goto('/login');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();

    // Try invalid email format
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid email format')).toBeVisible();
  });

  test('should handle incorrect credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
    
    // Should stay on login page
    await expect(page).toHaveURL('/login');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'e2e@test.com');
    await page.fill('input[name="password"]', 'Test123!@#');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Find and click logout button
    await page.click('button[aria-label="User menu"]');
    await page.click('text=Logout');

    // Should redirect to login page
    await expect(page).toHaveURL('/login');
    
    // Should show logged out message
    await expect(page.locator('text=You have been logged out')).toBeVisible();

    // Should not be able to access protected route
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('should handle password reset flow', async ({ page }) => {
    await page.goto('/login');
    
    // Click forgot password link
    await page.click('text=Forgot password?');
    
    // Should navigate to reset password page
    await expect(page).toHaveURL('/reset-password');
    
    // Enter email
    await page.fill('input[name="email"]', 'e2e@test.com');
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Reset link sent to your email')).toBeVisible();
  });
});
