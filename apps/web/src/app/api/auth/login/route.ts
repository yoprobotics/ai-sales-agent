import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { createSession } from '@/lib/auth/session';
import { loginRateLimit } from '@/lib/auth/rate-limit';
import { UserLoginSchema } from '@ai-sales-agent/core';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = loginRateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many login attempts',
          remaining: rateLimitResult.remaining,
          resetAt: rateLimitResult.resetAt,
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = UserLoginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(
      validatedData.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Reset rate limit on successful login
    loginRateLimit.reset(request);

    // Create JWT tokens
    const jwtUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan,
      firstName: user.firstName,
      lastName: user.lastName,
      language: user.language,
      dataRegion: user.dataRegion,
    };

    const accessToken = await generateAccessToken(jwtUser);
    const refreshToken = await generateRefreshToken(jwtUser);

    // Create session
    await createSession(
      user.id,
      accessToken,
      refreshToken,
      request.headers.get('user-agent') || undefined,
      request.ip || request.headers.get('x-forwarded-for') || undefined
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Set cookies and return response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        plan: user.plan,
        isEmailVerified: user.isEmailVerified,
      },
    });

    // Set auth cookies
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: validatedData.rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30 days if remember me
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}