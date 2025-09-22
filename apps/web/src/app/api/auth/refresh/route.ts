import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRefreshToken, createAccessToken, createRefreshToken, setAuthCookies, getAuthFromCookies } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await getAuthFromCookies();
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
    }
    
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    
    // Check if payload is not null
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }
    
    // Find session with refresh token
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });
    
    // Using 'id' instead of 'userId' to match the JWT payload structure
    if (!session || session.userId !== payload.id) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }
    
    // Check if session is expired
    if (session.expiresAt < new Date()) {
      // Delete expired session
      await prisma.session.delete({
        where: { id: session.id },
      });
      
      return NextResponse.json(
        { error: 'Refresh token expired' },
        { status: 401 }
      );
    }
    
    const user = session.user;
    
    // Generate new tokens - using createAccessToken and createRefreshToken
    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);
    
    // Update session with new tokens
    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
    
    // Set new cookies
    await setAuthCookies(newAccessToken, newRefreshToken);
    
    return NextResponse.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyName: user.companyName,
        language: user.language,
        dataRegion: user.dataRegion,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Invalid or expired refresh token' },
      { status: 401 }
    );
  }
}
