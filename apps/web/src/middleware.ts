import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/webhooks',
];

// API paths that require authentication
const protectedApiPaths = [
  '/api/prospects',
  '/api/icps',
  '/api/sequences',
  '/api/campaigns',
  '/api/messages',
  '/api/analytics',
  '/api/settings',
  '/api/billing',
];

// Admin only paths
const adminPaths = [
  '/admin',
  '/api/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Create response
  let response = NextResponse.next();

  // 1. Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.vercel-insights.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' https://api.stripe.com https://api.openai.com https://api.sendgrid.com;
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
    form-action 'self';
    base-uri 'self';
    object-src 'none';
    script-src-attr 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  // 2. CORS for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      'http://localhost:3000',
      'https://app.aisalesagent.com',
    ].filter(Boolean);

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS, PATCH'
      );
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-CSRF-Token, X-Requested-With'
      );
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }

  // 3. Language Detection
  const acceptLanguage = request.headers.get('accept-language');
  const cookieLanguage = request.cookies.get('language')?.value;
  
  let language = 'en'; // default
  
  if (cookieLanguage && ['en', 'fr'].includes(cookieLanguage)) {
    language = cookieLanguage;
  } else if (acceptLanguage) {
    // Parse accept-language header
    const preferredLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
    if (preferredLang === 'fr') {
      language = 'fr';
    }
  }
  
  response.headers.set('x-language', language);
  
  // Set language cookie if not present
  if (!cookieLanguage) {
    response.cookies.set('language', language, {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 31536000, // 1 year
    });
  }

  // 4. CSRF Protection for mutations
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    // Skip CSRF for webhooks and public auth endpoints
    const skipCSRF = [
      '/api/webhooks',
      '/api/auth/login',
      '/api/auth/signup',
      '/api/auth/forgot-password',
    ].some(path => pathname.startsWith(path));

    if (!skipCSRF) {
      const csrfToken = request.headers.get('x-csrf-token');
      const sessionToken = request.cookies.get('csrf-token')?.value;

      if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        );
      }
    }
  }

  // 5. Authentication Check
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  const isProtectedPath = protectedApiPaths.some(path =>
    pathname.startsWith(path)
  ) || pathname.startsWith('/dashboard');

  const isAdminPath = adminPaths.some(path =>
    pathname.startsWith(path)
  );

  if (!isPublicPath && (isProtectedPath || isAdminPath)) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // Redirect to login for web pages, return 401 for API
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      } else {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    try {
      // Verify JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      
      // Check if admin path requires admin role
      if (isAdminPath && payload.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }

      // Add user info to headers for downstream use
      response.headers.set('x-user-id', payload.sub as string);
      response.headers.set('x-user-role', payload.role as string);
      response.headers.set('x-user-email', payload.email as string);

    } catch (error) {
      // Invalid or expired token
      console.error('JWT verification failed:', error);
      
      // Clear invalid token
      response.cookies.delete('auth-token');
      
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      } else {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // 6. Rate Limiting Headers (actual limiting would be done in API routes)
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  response.headers.set('x-client-ip', ip);
  response.headers.set('x-rate-limit-limit', '100');
  response.headers.set('x-rate-limit-remaining', '99'); // This would be calculated
  response.headers.set('x-rate-limit-reset', new Date(Date.now() + 60000).toISOString());

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
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
