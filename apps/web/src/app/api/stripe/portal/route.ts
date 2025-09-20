import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/get-user';
import { createPortalSession } from '@ai-sales-agent/stripe';
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

    // Get user's Stripe customer ID
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { subscription: true },
    });

    if (!dbUser?.subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 400 }
      );
    }

    // Create portal session
    const session = await createPortalSession(
      dbUser.subscription.stripeCustomerId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`
    );

    return NextResponse.json({
      success: true,
      portalUrl: session.url,
    });
  } catch (error) {
    console.error('Portal session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}