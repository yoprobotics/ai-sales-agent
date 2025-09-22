import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromCookies, verifyAccessToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { accessToken } = await getAuthFromCookies();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify access token
    const payload = verifyAccessToken(accessToken);
    
    // Check if payload is valid
    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Get user data - using 'id' field from JWT payload
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
        firstName: true,
        lastName: true,
        companyName: true,
        role: true,
        dataRegion: true,
        language: true,
        timezone: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
