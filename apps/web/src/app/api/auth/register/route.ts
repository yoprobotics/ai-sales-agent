import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

// Registration schema
const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  companyName: z.string().min(1),
  password: z.string().min(8),
  dataRegion: z.enum(['US', 'EU', 'CA']),
  language: z.enum(['en', 'fr']).optional().default('en'),
  acceptTerms: z.boolean()
})

// Mock database - In production, use Prisma
const users: any[] = [
  {
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
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      )
    }

    // Check terms acceptance
    if (!data.acceptTerms) {
      return NextResponse.json(
        { success: false, message: 'You must accept the terms and conditions' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      role: 'CLIENT',
      plan: 'STARTER', // Default plan for new users
      dataRegion: data.dataRegion,
      language: data.language || 'en',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      createdAt: new Date()
    }

    // Save to mock database
    users.push(newUser)

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      process.env.JWT_SECRET || 'development-secret-key-change-in-production',
      {
        expiresIn: '7d'
      }
    )

    // Create user response (exclude password)
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      companyName: newUser.companyName,
      role: newUser.role,
      plan: newUser.plan,
      dataRegion: newUser.dataRegion,
      language: newUser.language,
      trialEndsAt: newUser.trialEndsAt
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userResponse
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}