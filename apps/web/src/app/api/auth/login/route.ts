import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock database - In production, use Prisma with PostgreSQL
const DEMO_USER = {
  id: '1',
  email: 'demo@aisalesagent.com',
  password: '$2a$10$mKJFQxpN7vX3gT9hW9Qy4.Zh8KzR6hl2I9XvZpQh4.a9Lv0K6tXEi', // Demo123!
  firstName: 'John',
  lastName: 'Doe',
  companyName: 'Demo Company',
  role: 'CLIENT',
  plan: 'PRO',
  dataRegion: 'EU',
  language: 'en',
  createdAt: new Date('2024-01-01')
}

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

    // Check if demo user (in production, query database)
    if (email.toLowerCase() !== DEMO_USER.email.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, DEMO_USER.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: DEMO_USER.id,
        email: DEMO_USER.email,
        role: DEMO_USER.role
      },
      process.env.JWT_SECRET || 'development-secret-key-change-in-production',
      {
        expiresIn: rememberMe ? '30d' : '7d'
      }
    )

    // Create user response (exclude password)
    const userResponse = {
      id: DEMO_USER.id,
      email: DEMO_USER.email,
      firstName: DEMO_USER.firstName,
      lastName: DEMO_USER.lastName,
      companyName: DEMO_USER.companyName,
      role: DEMO_USER.role,
      plan: DEMO_USER.plan,
      dataRegion: DEMO_USER.dataRegion,
      language: DEMO_USER.language
    }

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    })

    // Set HTTP-only cookie for production
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7 // 30 days or 7 days
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