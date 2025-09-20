import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/get-user';
import { createCheckoutSession, getOrCreateCustomer, getPriceForPlan } from '@ai-sales-agent/stripe';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan, interval = 'month' } = body;

    if (!plan || !['STARTER', 'PRO', 'BUSINESS'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { subscription: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let stripeCustomerId = dbUser.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      // Create Stripe customer
      const customer = await getOrCreateCustomer(dbUser.email, {
        name: `${dbUser.firstName} ${dbUser.lastName}`,
        metadata: {
          userId: dbUser.id,
          plan: dbUser.plan,
        },
      });

      stripeCustomerId = customer.id;

      // Create or update subscription record
      await prisma.subscription.upsert({
        where: { userId: dbUser.id },
        create: {
          userId: dbUser.id,
          plan: dbUser.plan,
          status: 'INCOMPLETE',
          stripeCustomerId,
        },
        update: {
          stripeCustomerId,
        },
      });
    }

    // Get price ID for the selected plan
    const priceId = await getPriceForPlan(plan, interval as 'month' | 'year');

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price not found for plan' },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await createCheckoutSession({
      customerId: stripeCustomerId,
      priceId,
      mode: 'subscription',
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: dbUser.id,
        plan,
        interval,
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}