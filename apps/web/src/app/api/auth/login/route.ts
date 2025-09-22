import { NextResponse } from 'next/server'
import { createAccessToken, createRefreshToken, verifyPassword, setAuthCookies } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password - using hashedPassword field from database
    const isValidPassword = await verifyPassword(password, user.hashedPassword)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { success: false, message: 'Please verify your email before logging in' },
        { status: 401 }
      )
    }

    // Generate tokens
    const accessToken = await createAccessToken(user)
    const refreshToken = await createRefreshToken(user)

    // Create or update session
    await prisma.session.upsert({
      where: {
        userId: user.id
      },
      update: {
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
      create: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    })

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        resource: 'auth',
        resourceId: user.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        metadata: {
          email: user.email,
          rememberMe
        }
      }
    })

    // Create user response (exclude sensitive data)
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      role: user.role,
      plan: user.plan,
      dataRegion: user.dataRegion,
      language: user.language,
      timezone: user.timezone
    }

    // Set auth cookies
    await setAuthCookies(accessToken, refreshToken)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token: accessToken,
      user: userResponse
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
