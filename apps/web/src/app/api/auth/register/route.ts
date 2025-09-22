import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAccessToken, createRefreshToken, hashPassword, setAuthCookies } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    })
    
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
    const hashedPassword = await hashPassword(data.password)

    // Create new user with subscription
    const newUser = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        role: 'CLIENT',
        plan: 'STARTER', // Default plan for new users
        dataRegion: data.dataRegion,
        language: data.language,
        timezone: 'UTC',
        isEmailVerified: false, // Will need email verification
        subscription: {
          create: {
            plan: 'STARTER',
            status: 'trial',
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
            usage: {
              prospects: 0,
              icps: 0,
              sequences: 0,
              messages: 0,
            },
            limits: {
              prospects: 200,
              icps: 1,
              sequences: 1,
              messages: 1000,
              teamMembers: 1,
            }
          }
        }
      },
      include: {
        subscription: true
      }
    })

    // Generate tokens
    const accessToken = await createAccessToken(newUser)
    const refreshToken = await createRefreshToken(newUser)

    // Create session
    await prisma.session.create({
      data: {
        userId: newUser.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        action: 'USER_REGISTERED',
        resource: 'auth',
        resourceId: newUser.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        metadata: {
          email: newUser.email,
          dataRegion: newUser.dataRegion,
          language: newUser.language
        }
      }
    })

    // TODO: Send verification email via SendGrid
    // await sendVerificationEmail(newUser.email, verificationToken)

    // Create user response (exclude sensitive data)
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
      trialEndsAt: newUser.subscription?.trialEndsAt
    }

    // Set auth cookies
    await setAuthCookies(accessToken, refreshToken)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      token: accessToken,
      user: userResponse
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
