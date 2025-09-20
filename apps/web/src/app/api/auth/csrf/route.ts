import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFToken, setCSRFCookie } from '@/lib/security/csrf';

/**
 * GET /api/auth/csrf
 * Get CSRF token for forms and API requests
 */
export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
    });
    
    // Generate and set CSRF token
    const csrfToken = generateCSRFToken();
    setCSRFCookie(response, csrfToken);
    
    // Also return the token in response for client-side usage
    return NextResponse.json({
      success: true,
      csrfToken,
    });
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
