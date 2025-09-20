import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, requireRole } from '@/lib/auth/get-user';
import { initializeSubscriptionProducts } from '@ai-sales-agent/stripe';

// Admin-only endpoint to initialize Stripe products
export async function POST(request: NextRequest) {
  try {
    // Require admin role
    const user = requireRole('ADMIN');

    // Initialize products and prices in Stripe
    await initializeSubscriptionProducts();

    return NextResponse.json({
      success: true,
      message: 'Stripe products initialized successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }

    console.error('Stripe initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize Stripe products' },
      { status: 500 }
    );
  }
}