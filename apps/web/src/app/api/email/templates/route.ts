import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/get-user';
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendSubscriptionActivatedEmail,
  sendPaymentFailedEmail,
} from '@ai-sales-agent/sendgrid';
import { z } from 'zod';

const TemplateEmailSchema = z.object({
  template: z.enum([
    'welcome',
    'verification',
    'password-reset',
    'subscription-activated',
    'payment-failed',
  ]),
  to: z.string().email(),
  data: z.record(z.any()),
});

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
    const validatedData = TemplateEmailSchema.parse(body);

    let response;

    switch (validatedData.template) {
      case 'welcome':
        response = await sendWelcomeEmail(validatedData.to, validatedData.data);
        break;

      case 'verification':
        response = await sendVerificationEmail(validatedData.to, validatedData.data);
        break;

      case 'password-reset':
        response = await sendPasswordResetEmail(validatedData.to, validatedData.data);
        break;

      case 'subscription-activated':
        response = await sendSubscriptionActivatedEmail(validatedData.to, validatedData.data);
        break;

      case 'payment-failed':
        response = await sendPaymentFailedEmail(validatedData.to, validatedData.data);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid template' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      messageId: response.messageId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Template email error:', error);
    return NextResponse.json(
      { error: 'Failed to send template email' },
      { status: 500 }
    );
  }
}