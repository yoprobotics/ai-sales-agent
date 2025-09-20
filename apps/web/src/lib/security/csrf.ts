import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// CSRF token configuration
const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generate a secure CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Set CSRF token in cookies
 */
export function setCSRFCookie(response: NextResponse, token?: string): string {
  const csrfToken = token || generateCSRFToken();
  const isProduction = process.env.NODE_ENV === 'production';
  
  response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax', // Strict in production for better security
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  
  return csrfToken;
}

/**
 * Verify CSRF token from request
 */
export function verifyCSRFToken(request: NextRequest): boolean {
  // Skip CSRF check for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true;
  }
  
  // Skip for public auth endpoints
  const pathname = request.nextUrl.pathname;
  const csrfExemptPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/webhooks/stripe', // Stripe webhooks need exemption
  ];
  
  if (csrfExemptPaths.some(path => pathname === path)) {
    return true;
  }
  
  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  if (!cookieToken) {
    return false;
  }
  
  // Get token from header or body
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  
  // For form submissions, check body
  // Note: This requires parsing the body which should be done in the API route
  
  // Verify tokens match and are valid
  if (!headerToken || headerToken !== cookieToken) {
    return false;
  }
  
  // Additional validation: check token format
  const tokenRegex = /^[a-f0-9]{64}$/;
  return tokenRegex.test(cookieToken);
}

/**
 * CSRF protection middleware
 */
export async function csrfProtection(request: NextRequest): Promise<NextResponse | null> {
  if (!verifyCSRFToken(request)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }
  
  return null; // Continue processing
}

/**
 * Get CSRF token from request
 */
export function getCSRFToken(request: NextRequest): string | null {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value || null;
}

/**
 * Clear CSRF token
 */
export function clearCSRFToken(response: NextResponse): void {
  response.cookies.delete(CSRF_COOKIE_NAME);
}
