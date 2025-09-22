import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

// Mock user data
const DEMO_USER = {
  id: '1',
  email: 'demo@aisalesagent.com',
  firstName: 'John',
  lastName: 'Doe',
  companyName: 'Demo Company',
  role: 'CLIENT',
  plan: 'PRO',
  dataRegion: 'EU',
  language: 'en'
}

export async function GET() {
  try {
    // Get token from Authorization header or cookie
    const headersList = await headers()
    const authorization = headersList.get('authorization')
    const cookieToken = headersList.get('cookie')?.match(/auth-token=([^;]+)/)?.[1]
    
    const token = authorization?.replace('Bearer ', '') || cookieToken

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify token
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'development-secret-key-change-in-production'
      ) as any

      // In production, fetch user from database using decoded.id
      // For demo, return mock user if ID matches
      if (decoded.id === '1') {
        return NextResponse.json({
          success: true,
          user: DEMO_USER
        })
      }

      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}