import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    'Password must contain uppercase, lowercase, number and special character'
  ),
  company: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }
    
    const { firstName, lastName, email, password, company } = validation.data
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user - Fixed: using hashedPassword field name
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        hashedPassword, // Fixed: renamed from password to hashedPassword
        companyName: company,
        role: 'CLIENT',
        plan: 'STARTER',
        language: 'en',
        dataRegion: 'US',
        timezone: 'America/New_York',
        isEmailVerified: false,
      },
    })
    
    // Create default ICP
    await prisma.iCP.create({
      data: {
        userId: user.id,
        name: 'Default ICP',
        description: 'Your first Ideal Customer Profile',
        criteria: {
          industry: ['Technology'],
          companySize: ['medium', 'large'],
          location: ['United States'],
          keywords: ['B2B', 'SaaS'],
        },
        isActive: true,
      },
    })
    
    // TODO: Send verification email via SendGrid
    
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully. Please check your email to verify your account.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
