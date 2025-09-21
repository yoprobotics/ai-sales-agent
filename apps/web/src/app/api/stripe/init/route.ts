import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

// Temporary Stripe initialization endpoint
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // TODO: Implement Stripe customer creation
    // For now, return mock response
    return NextResponse.json({
      success: true,
      message: 'Stripe integration pending',
      customerId: `cus_mock_${Date.now()}`,
      development: true
    })
  } catch (error) {
    console.error('Stripe init error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize Stripe' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Stripe API endpoint',
    status: 'ready',
    provider: 'Stripe (pending implementation)'
  })
}