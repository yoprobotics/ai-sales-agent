import { NextRequest, NextResponse } from 'next/server'
import { registerUser, setAuthCookies } from '@/lib/auth'
import { UserRegistrationSchema } from '@ai-sales-agent/core'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = UserRegistrationSchema.parse(body)
    
    // Register user
    const result = await registerUser({
      email: validatedData.email,
      password: validatedData.password,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      companyName: validatedData.companyName,
      language: validatedData.language,
      dataRegion: validatedData.dataRegion,
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        user: result.user,
        message: 'Account created successfully',
      },
    }, { status: 201 })

    // Set auth cookies
    setAuthCookies(response, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    })

    return response

  } catch (error) {
    console.error('Registration error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors,
        },
      }, { status: 400 })
    }

    if (error instanceof Error && error.message === 'User already exists') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'An account with this email already exists',
        },
      }, { status: 409 })
    }

    return NextResponse.json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: 'Failed to create account. Please try again.',
      },
    }, { status: 500 })
  }
}
