import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/auth/jwt';
import { createSession } from '@/lib/auth/session';
import { UserRegistrationSchema } from '@ai-sales-agent/core';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = UserRegistrationSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        companyName: validatedData.companyName,
        language: validatedData.language,
        dataRegion: validatedData.dataRegion,
        timezone: validatedData.timezone,
        role: 'CLIENT',
        plan: 'STARTER',
      },
    });

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
      maxAge: 7 * 24 * 60 * 60, // 7 days
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

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}