import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '@/lib/auth/jwt';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/health',
];

// Admin-only routes
const adminRoutes = [
  '/admin',
  '/api/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip authentication for public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get tokens from cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // If no tokens, redirect to login
  if (!accessToken && !refreshToken) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Try to verify access token
  let user = null;
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload && payload.type === 'access') {
      user = payload.user;
    }
  }

  // If access token is invalid, try refresh token
  if (!user && refreshToken) {
    const payload = await verifyRefreshToken(refreshToken);
    if (payload && payload.type === 'refresh') {
      // Generate new access token
      const newAccessToken = await generateAccessToken(payload.user);
      
      // Create response with new access token
      const response = NextResponse.next();
      response.cookies.set('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 minutes
        path: '/',
      });
      
      user = payload.user;
      
      // Add user to request headers for API routes
      response.headers.set('x-user', JSON.stringify(user));
      
      return response;
    }
  }

  // If still no user, redirect to login
  if (!user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (user.role !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Add user to request headers for API routes
  const response = NextResponse.next();
  response.headers.set('x-user', JSON.stringify(user));
  
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
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};