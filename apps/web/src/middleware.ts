import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/auth';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
];

const ADMIN_PATHS = [
  '/admin',
  '/api/admin',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow public paths
  if (PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next();
  }
  
  // Check for access token
  const accessToken = request.cookies.get('accessToken')?.value;
  
  if (!accessToken) {
    // Redirect to login for web pages
    if (!path.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Return 401 for API routes
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  // Verify token
  const user = await verifyAccessToken(accessToken);
  
  if (!user) {
    // Try to refresh token
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    if (refreshToken) {
      // Redirect to refresh endpoint
      if (!path.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/api/auth/refresh?redirect=' + path, request.url));
      }
    }
    
    // Token invalid, redirect to login
    if (!path.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
  
  // Check admin access
  if (ADMIN_PATHS.some(adminPath => path.startsWith(adminPath))) {
    if (user.role !== 'ADMIN') {
      if (!path.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
  }
  
  // Add user to request headers for use in API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.id);
  requestHeaders.set('x-user-email', user.email);
  requestHeaders.set('x-user-role', user.role);
  requestHeaders.set('x-user-plan', user.plan);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
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
