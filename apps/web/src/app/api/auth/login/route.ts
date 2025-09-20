import { NextRequest, NextResponse } from 'next/server'
import { loginUser, setAuthCookies } from '@/lib/auth'
import { UserLoginSchema } from '@ai-sales-agent/core'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = UserLoginSchema.parse(body)
    
    // Login user
    const result = await loginUser(validatedData.email, validatedData.password)

    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        user: result.user,
        message: 'Logged in successfully',
      },
    })

    // Set auth cookies
    setAuthCookies(response, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    })

    return response

  } catch (error) {
    console.error('Login error:', error)

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

    if (error instanceof Error && error.message === 'Invalid credentials') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      }, { status: 401 })
    }

    return NextResponse.json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: 'Login failed. Please try again.',
      },
    }, { status: 500 })
  }
}
