import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies, getAuthFromCookies, verifyAccessToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await getAuthFromCookies();
    
    if (accessToken) {
      try {
        const payload = verifyAccessToken(accessToken);
        
        // Delete all sessions for this user
        await prisma.session.deleteMany({
          where: { userId: payload.userId },
        });
        
      } catch (error) {
        // Token might be expired, but we still want to clear cookies
        console.error('Token verification error during logout:', error);
      }
    }
    
    // Clear cookies
    await clearAuthCookies();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
