import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import { stripeService, STRIPE_PRICE_IDS, getPlanFromPriceId } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema validation for checkout request
const CheckoutSchema = z.object({
  plan: z.enum(['STARTER', 'PRO', 'BUSINESS']),
  interval: z.enum(['monthly', 'yearly']),
})

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
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

    // Parse and validate request body
    const body = await request.json()
    const validationResult = CheckoutSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { plan, interval } = validationResult.data
    const userId = payload.userId

    // Get user with subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user already has an active subscription
    if (user.subscription?.status === 'ACTIVE' || user.subscription?.status === 'TRIALING') {
      return NextResponse.json(
        { error: 'You already have an active subscription. Please manage it from the billing portal.' },
        { status: 400 }
      )
    }

    // Get Stripe customer ID or create new customer
    let stripeCustomerId = user.subscription?.stripeCustomerId
    
    if (!stripeCustomerId) {
      // Create new Stripe customer
      const customer = await stripeService.createCustomer(
        user.email,
        `${user.firstName} ${user.lastName}`
      )
      
      stripeCustomerId = customer.id

      // Create or update subscription record
      await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          stripeCustomerId,
          plan,
          status: 'INCOMPLETE',
        },
        update: {
          stripeCustomerId,
          plan,
        },
      })
    }

    // Get price ID for the selected plan
    const priceKey = `${plan}_${interval.toUpperCase()}` as keyof typeof STRIPE_PRICE_IDS
    const priceId = STRIPE_PRICE_IDS[priceKey]
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan or interval' },
        { status: 400 }
      )
    }

    // Create checkout session
    const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await stripeService.createCheckoutSession({
      customerId: stripeCustomerId,
      priceId,
      successUrl: `${baseUrl}/dashboard/billing?success=true`,
      cancelUrl: `${baseUrl}/dashboard/billing?canceled=true`,
    })

    return NextResponse.json({
      url: session.url,
      sessionId: 'mock_session_' + Date.now(),
    })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Stripe checkout endpoint',
    status: 'ready',
    plans: ['STARTER', 'PRO', 'BUSINESS'],
    intervals: ['monthly', 'yearly']
  })
}