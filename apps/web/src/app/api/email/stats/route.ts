import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/get-user';
import { getEmailStats, getCategoryStats } from '@ai-sales-agent/sendgrid';
import { z } from 'zod';

const StatsQuerySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  aggregatedBy: z.enum(['day', 'week', 'month']).optional(),
  categories: z.string().optional(), // comma-separated
});

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const params = {
      startDate: searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: searchParams.get('endDate') || undefined,
      aggregatedBy: searchParams.get('aggregatedBy') || undefined,
      categories: searchParams.get('categories') || undefined,
    };

    const validatedParams = StatsQuerySchema.parse(params);

    let stats;

    if (validatedParams.categories) {
      // Get category-specific stats
      const categories = validatedParams.categories.split(',');
      stats = await getCategoryStats(
        categories,
        new Date(validatedParams.startDate),
        validatedParams.endDate ? new Date(validatedParams.endDate) : undefined
      );
    } else {
      // Get overall stats
      stats = await getEmailStats(
        new Date(validatedParams.startDate),
        validatedParams.endDate ? new Date(validatedParams.endDate) : undefined,
        validatedParams.aggregatedBy as any
      );
    }

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Email stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get email stats' },
      { status: 500 }
    );
  }
}