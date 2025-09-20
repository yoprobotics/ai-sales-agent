import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/get-user';
import { sendEmail } from '@ai-sales-agent/sendgrid';
import { z } from 'zod';

const SendEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  subject: z.string().min(1).max(200),
  text: z.string().optional(),
  html: z.string().optional(),
  templateId: z.string().optional(),
  dynamicTemplateData: z.record(z.any()).optional(),
  categories: z.array(z.string()).optional(),
}).refine(data => data.text || data.html || data.templateId, {
  message: 'Either text, html, or templateId must be provided',
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
    const validatedData = SendEmailSchema.parse(body);

    // Add user context to email metadata
    const emailData = {
      ...validatedData,
      customArgs: {
        userId: user.id,
        userEmail: user.email,
      },
      categories: [
        ...(validatedData.categories || []),
        'user-sent',
      ],
    };

    const response = await sendEmail(emailData);

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

    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}