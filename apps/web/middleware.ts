import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './src/lib/auth';
import { verifyCSRFToken } from './src/lib/security/csrf';
import { apiRateLimiter, loginRateLimiter } from './src/lib/rate-limiter';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
  '/contact',
  '/disclaimer',
  '/disclosure',
  '/cookies',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/csrf',
  '/api/health',
  '/api/webhooks/stripe',
];

// Admin routes that require admin role
const adminRoutes = [
  '/admin',
  '/api/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    
    // Special rate limiting for login attempts
    if (pathname === '/api/auth/login') {
      const allowed = await loginRateLimiter.check(ip, 5);
      if (!allowed) {
        return NextResponse.json(
          { error: 'Too many login attempts. Please try again later.' },
          { status: 429 }
        );
      }
    } else {
      // General API rate limiting
      const allowed = await apiRateLimiter.check(ip, 100);
      if (!allowed) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }
    
    // CSRF protection for non-GET API routes
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const csrfValid = verifyCSRFToken(request);
      if (!csrfValid && !pathname.startsWith('/api/webhooks/')) {
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        );
      }
    }
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Get access token from cookies
  const accessToken = request.cookies.get('access_token')?.value;

  // If route is public, allow access
  if (isPublicRoute) {
    // If user is already authenticated and trying to access login/register, redirect to dashboard
    if (accessToken && (pathname === '/login' || pathname === '/register')) {
      const payload = await verifyAccessToken(accessToken);
      if (payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // For protected routes, check authentication
  if (!accessToken) {
    // If it's an API route, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    // For pages, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the access token
  const payload = await verifyAccessToken(accessToken);
  
  if (!payload) {
    // Token is invalid, clear cookies and redirect
    const response = pathname.startsWith('/api/')
      ? NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      : NextResponse.redirect(new URL('/login', request.url));
    
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('csrf_token');
    return response;
  }

  // Check admin routes
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAdminRoute && payload.role !== 'ADMIN') {
    return pathname.startsWith('/api/')
      ? NextResponse.json({ error: 'Admin access required' }, { status: 403 })
      : NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add user information to request headers for API routes
  if (pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.sub as string);
    requestHeaders.set('x-user-email', payload.email as string);
    requestHeaders.set('x-user-role', payload.role as string);
    requestHeaders.set('x-request-id', crypto.randomUUID());
    
    return addSecurityHeaders(NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    }));
  }

  return addSecurityHeaders(NextResponse.next());
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Strict Transport Security (only in production)
  if (isProduction) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://cdn.vercel-insights.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com data:;
    img-src 'self' data: blob: https:;
    connect-src 'self' https://api.stripe.com https://api.openai.com https://vitals.vercel-insights.com;
    frame-src https://js.stripe.com https://hooks.stripe.com;
    frame-ancestors 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    ${isProduction ? 'upgrade-insecure-requests;' : ''}
  `.replace(/\s{2,}/g, ' ').trim();
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
