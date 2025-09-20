import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '@/lib/auth';
import { setCookie, getCookie } from '@/lib/cookies';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
    }
    
    const tokens = await refreshAccessToken(refreshToken);
    
    if (!tokens) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }
    
    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        accessToken: tokens.accessToken
      }
    });
    
    // Update cookies
    setCookie(response, 'accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });
    
    setCookie(response, 'refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    console.error('Token refresh error:', error);
    
    return NextResponse.json(
      { error: 'Token refresh failed' },
      { status: 500 }
    );
  }
}
