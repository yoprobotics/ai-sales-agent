import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

// Temporary implementation - SendGrid stats will be added later
export async function GET(req: NextRequest) {
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

    // TODO: Implement real SendGrid stats
    // Return mock stats for now
    return NextResponse.json({
      success: true,
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        spam: 0,
        unsubscribed: 0,
        lastUpdated: new Date().toISOString()
      },
      message: 'SendGrid integration pending',
      development: true
    })
  } catch (error) {
    console.error('Email stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email stats' },
      { status: 500 }
    )
  }
}