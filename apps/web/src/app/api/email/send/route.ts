import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

// Temporary implementation - SendGrid will be added later
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

    const body = await req.json()
    const { to, subject, text, html } = body

    // TODO: Implement SendGrid integration
    // For now, just log the email
    console.log('Email would be sent:', {
      to,
      subject,
      text,
      html,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@aisalesagent.com'
    })

    // Return success for now
    return NextResponse.json({
      success: true,
      message: 'Email functionality will be implemented with SendGrid',
      messageId: `mock-${Date.now()}`,
      development: true
    })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email API endpoint',
    status: 'ready',
    provider: 'SendGrid (pending implementation)'
  })
}