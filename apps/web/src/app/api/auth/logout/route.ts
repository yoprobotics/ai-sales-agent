import { NextRequest, NextResponse } from 'next/server';
import { deleteCookie } from '@/lib/cookies';
import { verifyAccessToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('accessToken')?.value;
    
    if (token) {
      const user = await verifyAccessToken(token);
      
      if (user) {
        // Clear refresh token in database
        await prisma.user.update({
          where: { id: user.id },
          data: {
            refreshToken: null,
            refreshTokenExp: null,
          }
        });
        
        // Log audit trail
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'USER_LOGOUT',
            entityType: 'User',
            entityId: user.id,
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            userAgent: req.headers.get('user-agent'),
          }
        });
      }
    }
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Clear cookies
    deleteCookie(response, 'accessToken');
    deleteCookie(response, 'refreshToken');
    
    return response;
    
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
