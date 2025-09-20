import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserLoginSchema } from '@ai-sales-agent/core/schemas';
import { validatePassword, generateTokens } from '@/lib/auth';
import { setCookie } from '@/lib/cookies';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedData = UserLoginSchema.parse(body);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        role: true,
        plan: true,
        emailVerified: true,
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Validate password
    const isPasswordValid = await validatePassword(validatedData.password, user.passwordHash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: 'Please verify your email first' },
        { status: 403 }
      );
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user);
    
    // Update user with refresh token and last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        refreshTokenExp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        lastLoginAt: new Date()
      }
    });
    
    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          plan: user.plan,
        },
        accessToken
      }
    });
    
    // Set httpOnly cookies
    setCookie(response, 'accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });
    
    setCookie(response, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: validatedData.rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30 days if remember me, else 7 days
      path: '/'
    });
    
    // Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        userAgent: req.headers.get('user-agent'),
      }
    });
    
    return response;
    
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
