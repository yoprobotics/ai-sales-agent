import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { UserRegistrationSchema } from '@/lib/schemas'
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate request body
    const validatedData = UserRegistrationSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        companyName: validatedData.companyName,
        language: validatedData.language || 'en',
        dataRegion: validatedData.dataRegion || 'EU',
        timezone: validatedData.timezone || 'UTC',
        role: 'CLIENT',
        plan: 'STARTER'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        plan: true
      }
    })
    
    // Generate tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user.id)
    
    // Update user with refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        refreshTokenExp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    })
    
    // Create response with cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        plan: user.plan
      },
      accessToken
    })
    
    // Set auth cookies
    setAuthCookies(response, accessToken, refreshToken)
    
    return response
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}