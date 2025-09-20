import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken } from './src/lib/auth'

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
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/health',
  '/api/webhooks/stripe',
]

// API routes that require authentication
const protectedApiRoutes = [
  '/api/dashboard',
  '/api/prospects',
  '/api/icps',
  '/api/sequences',
  '/api/campaigns',
  '/api/messages',
  '/api/activities',
  '/api/reports',
  '/api/user',
]

// Admin routes that require admin role
const adminRoutes = [
  '/admin',
  '/api/admin',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Get access token from cookies
  const accessToken = request.cookies.get('access_token')?.value

  // If route is public, allow access
  if (isPublicRoute) {
    // If user is already authenticated and trying to access login/register, redirect to dashboard
    if (accessToken && (pathname === '/login' || pathname === '/register')) {
      const payload = await verifyAccessToken(accessToken)
      if (payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
    return NextResponse.next()
  }

  // For protected routes, check authentication
  if (!accessToken) {
    // If it's an API route, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    // For pages, redirect to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verify the access token
  const payload = await verifyAccessToken(accessToken)
  
  if (!payload) {
    // Token is invalid, clear cookies and redirect
    const response = pathname.startsWith('/api/')
      ? NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      : NextResponse.redirect(new URL('/login', request.url))
    
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    return response
  }

  // Check admin routes
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isAdminRoute && payload.role !== 'ADMIN') {
    return pathname.startsWith('/api/')
      ? NextResponse.json({ error: 'Admin access required' }, { status: 403 })
      : NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Add user information to request headers for API routes
  if (pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.sub as string)
    requestHeaders.set('x-user-email', payload.email as string)
    requestHeaders.set('x-user-role', payload.role as string)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Set security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // CSP header
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob: https:;
    connect-src 'self' https://api.stripe.com https://api.openai.com;
    frame-src https://js.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()
  
  response.headers.set('Content-Security-Policy', cspHeader)
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
