import { NextRequest, NextResponse } from 'next/server';
import { createBillingPortalSession } from '@/lib/stripe';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = authResult.userId;

    // Get user subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || !subscription.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No subscription found. Please subscribe to a plan first.' },
        { status: 404 }
      );
    }

    // Create billing portal session
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const session = await createBillingPortalSession(
      subscription.stripeCustomerId,
      `${baseUrl}/dashboard/billing`
    );

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error('Error creating billing portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session', details: error.message },
      { status: 500 }
    );
  }
}
