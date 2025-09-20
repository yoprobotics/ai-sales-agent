import { createMocks } from 'node-mocks-http';
import sgMail from '@sendgrid/mail';
import { EmailService } from '../services/email';
import { PrismaClient } from '@prisma/client';

const prisma = global.prisma as PrismaClient;

jest.mock('@sendgrid/mail');

describe('SendGrid Email Service', () => {
  let emailService: EmailService;
  let userId: string;
  let prospectId: string;

  beforeEach(async () => {
    emailService = new EmailService();
    
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'sender@test.com',
        password: 'hashed',
        firstName: 'Sender',
        lastName: 'Test',
        role: 'CLIENT',
        plan: 'PRO',
        dataRegion: 'US',
        language: 'en',
        isEmailVerified: true,
        companyName: 'Test Company'
      }
    });
    userId = user.id;

    // Create test prospect
    const icp = await prisma.iCP.create({
      data: {
        userId,
        name: 'Test ICP',
        criteria: {},
        isActive: true
      }
    });

    const prospect = await prisma.prospect.create({
      data: {
        userId,
        icpId: icp.id,
        email: 'prospect@company.com',
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'CEO',
        company: {
          name: 'Prospect Company'
        },
        score: 85,
        stage: 'contacted',
        source: 'manual',
        isOptedOut: false
      }
    });
    prospectId = prospect.id;
  });

  describe('Transactional Emails', () => {
    it('should send welcome email to new user', async () => {
      const mockSend = sgMail.send as jest.Mock;
      mockSend.mockResolvedValue([{ statusCode: 202 }]);

      await emailService.sendWelcomeEmail({
        to: 'newuser@test.com',
        firstName: 'New',
        language: 'en'
      });

      expect(mockSend).toHaveBeenCalledWith({
        to: 'newuser@test.com',
        from: expect.any(String),
        subject: 'Welcome to AI Sales Agent!',
        html: expect.stringContaining('Welcome'),
        text: expect.any(String),
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true }
        }
      });
    });

    it('should send welcome email in French', async () => {
      const mockSend = sgMail.send as jest.Mock;
      mockSend.mockResolvedValue([{ statusCode: 202 }]);

      await emailService.sendWelcomeEmail({
        to: 'french@test.com',
        firstName: 'Pierre',
        language: 'fr'
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Bienvenue sur AI Sales Agent!',
          html: expect.stringContaining('Bienvenue')
        })
      );
    });

    it('should send password reset email', async () => {
      const mockSend = sgMail.send as jest.Mock;
      mockSend.mockResolvedValue([{ statusCode: 202 }]);

      await emailService.sendPasswordResetEmail({
        to: 'reset@test.com',
        resetToken: 'reset-token-123',
        language: 'en'
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Reset Your Password',
          html: expect.stringContaining('reset-token-123'),
          priority: 'high'
        })
      );
    });

    it('should send subscription confirmation email', async () => {
      const mockSend = sgMail.send as jest.Mock;
      mockSend.mockResolvedValue([{ statusCode: 202 }]);

      await emailService.sendSubscriptionConfirmation({
        to: 'subscriber@test.com',
        plan: 'PRO',
        billingCycle: 'monthly',
        amount: 149,
        currency: 'USD',
        language: 'en'
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Subscription Confirmed - PRO Plan',
          html: expect.stringContaining('$149'),
          html: expect.stringContaining('PRO')
        })
      );
    });
  });

  describe('Prospect Outreach Emails', () => {
    it('should send personalized prospect email', async () => {
      const mockSend = sgMail.send as jest.Mock;
      mockSend.mockResolvedValue([{ statusCode: 202 }]);

      await emailService.sendProspectEmail({
        from: 'sender@test.com',
        to: 'prospect@company.com',
        subject: 'Quick question about {{company}}',
        content: 'Hi {{firstName}}, I noticed {{company}} is growing...',
        prospectData: {
          firstName: 'John',
          lastName: 'Doe',
          company: 'Prospect Company',
          jobTitle: 'CEO'
        },
        trackingPixel: true,
        messageId: 'msg-123'
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'prospect@company.com',
          from: 'sender@test.com',
          subject: 'Quick question about Prospect Company',
          html: expect.stringContaining('Hi John'),
          html: expect.stringContaining('Prospect Company is growing'),
          customArgs: {
            messageId: 'msg-123',
            userId: expect.any(String)
          },
          trackingSettings: {
            clickTracking: { enable: true },
            openTracking: { enable: true }
          }
        })
      );
    });

    it('should handle email templates with variables', async () => {
      const template = {
        subject: '{{firstName}}, saw {{company}} is hiring {{jobCount}} {{jobTitle}}s',
        content: 'Hi {{firstName}} {{lastName}},\n\n{{company}} seems to be scaling. {{customField1}}'
      };

      const variables = {
        firstName: 'Jane',
        lastName: 'Smith',
        company: 'Tech Corp',
        jobTitle: 'Engineer',
        jobCount: '5',
        customField1: 'Would love to connect!'
      };

      const processed = emailService.processTemplate(template, variables);

      expect(processed.subject).toBe('Jane, saw Tech Corp is hiring 5 Engineers');
      expect(processed.content).toContain('Hi Jane Smith');
      expect(processed.content).toContain('Tech Corp seems to be scaling');
      expect(processed.content).toContain('Would love to connect!');
    });

    it('should add unsubscribe link to prospect emails', async () => {
      const mockSend = sgMail.send as jest.Mock;
      mockSend.mockResolvedValue([{ statusCode: 202 }]);

      await emailService.sendProspectEmail({
        from: 'sender@test.com',
        to: 'prospect@company.com',
        subject: 'Test',
        content: 'Test email content',
        prospectData: { prospectId },
        includeUnsubscribe: true
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('unsubscribe'),
          html: expect.stringContaining(`/unsubscribe?token=`),
          list: {
            unsubscribe: expect.stringContaining('unsubscribe')
          }
        })
      );
    });
  });

  describe('Bulk Email Sending', () => {
    it('should send bulk emails with personalization', async () => {
      const mockSendMultiple = sgMail.sendMultiple as jest.Mock;
      mockSendMultiple.mockResolvedValue([{ statusCode: 202 }]);

      const recipients = [
        {
          to: 'prospect1@company.com',
          substitutions: {
            firstName: 'John',
            company: 'Company A'
          }
        },
        {
          to: 'prospect2@company.com',
          substitutions: {
            firstName: 'Jane',
            company: 'Company B'
          }
        }
      ];

      await emailService.sendBulkEmails({
        from: 'sender@test.com',
        subject: 'Hi {{firstName}} from {{company}}',
        content: 'Personalized content for {{firstName}}',
        recipients,
        campaignId: 'campaign-123'
      });

      expect(mockSendMultiple).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'sender@test.com',
          personalizations: expect.arrayContaining([
            expect.objectContaining({
              to: [{ email: 'prospect1@company.com' }],
              substitutions: {
                firstName: 'John',
                company: 'Company A'
              }
            }),
            expect.objectContaining({
              to: [{ email: 'prospect2@company.com' }],
              substitutions: {
                firstName: 'Jane',
                company: 'Company B'
              }
            })
          ]),
          customArgs: {
            campaignId: 'campaign-123'
          }
        })
      );
    });

    it('should respect rate limits for bulk sending', async () => {
      const mockSendMultiple = sgMail.sendMultiple as jest.Mock;
      mockSendMultiple.mockResolvedValue([{ statusCode: 202 }]);

      // Create 100 recipients
      const recipients = Array(100).fill(null).map((_, i) => ({
        to: `prospect${i}@company.com`,
        substitutions: { firstName: `User${i}` }
      }));

      await emailService.sendBulkEmails({
        from: 'sender@test.com',
        subject: 'Test',
        content: 'Test content',
        recipients,
        batchSize: 50, // SendGrid recommends batches of 1000 max
        delayMs: 100
      });

      // Should be called twice (100 recipients / 50 batch size)
      expect(mockSendMultiple).toHaveBeenCalledTimes(2);
    });
  });

  describe('Email Tracking', () => {
    it('should handle email open webhook', async () => {
      const event = {
        email: 'prospect@company.com',
        event: 'open',
        timestamp: Date.now() / 1000,
        'message-id': 'msg-123',
        userId,
        prospectId
      };

      await emailService.handleWebhookEvent(event);

      // Verify message was updated
      const message = await prisma.message.findFirst({
        where: { id: 'msg-123' }
      });

      expect(message?.status).toBe('opened');
      expect(message?.openedAt).toBeDefined();
    });

    it('should handle email click webhook', async () => {
      const event = {
        email: 'prospect@company.com',
        event: 'click',
        url: 'https://example.com/demo',
        timestamp: Date.now() / 1000,
        'message-id': 'msg-123',
        userId,
        prospectId
      };

      await emailService.handleWebhookEvent(event);

      // Verify message was updated
      const message = await prisma.message.findFirst({
        where: { id: 'msg-123' }
      });

      expect(message?.status).toBe('clicked');
      expect(message?.clickedAt).toBeDefined();
      expect(message?.metadata?.clickedUrls).toContain('https://example.com/demo');
    });

    it('should handle email bounce webhook', async () => {
      const event = {
        email: 'invalid@nonexistent.com',
        event: 'bounce',
        type: 'bounce',
        reason: 'Invalid email address',
        timestamp: Date.now() / 1000,
        'message-id': 'msg-123',
        prospectId
      };

      await emailService.handleWebhookEvent(event);

      // Verify message was marked as bounced
      const message = await prisma.message.findFirst({
        where: { id: 'msg-123' }
      });

      expect(message?.status).toBe('bounced');

      // Verify prospect was marked as invalid
      const prospect = await prisma.prospect.findUnique({
        where: { id: prospectId }
      });

      expect(prospect?.metadata?.emailStatus).toBe('invalid');
      expect(prospect?.metadata?.bounceReason).toBe('Invalid email address');
    });

    it('should handle spam report webhook', async () => {
      const event = {
        email: 'prospect@company.com',
        event: 'spamreport',
        timestamp: Date.now() / 1000,
        prospectId
      };

      await emailService.handleWebhookEvent(event);

      // Verify prospect was opted out
      const prospect = await prisma.prospect.findUnique({
        where: { id: prospectId }
      });

      expect(prospect?.isOptedOut).toBe(true);
      expect(prospect?.metadata?.optOutReason).toBe('spam_report');
    });

    it('should handle unsubscribe webhook', async () => {
      const event = {
        email: 'prospect@company.com',
        event: 'unsubscribe',
        timestamp: Date.now() / 1000,
        prospectId
      };

      await emailService.handleWebhookEvent(event);

      // Verify prospect was opted out
      const prospect = await prisma.prospect.findUnique({
        where: { id: prospectId }
      });

      expect(prospect?.isOptedOut).toBe(true);
      expect(prospect?.metadata?.optOutReason).toBe('unsubscribed');
      expect(prospect?.metadata?.unsubscribedAt).toBeDefined();
    });
  });

  describe('Email Validation', () => {
    it('should validate email addresses before sending', async () => {
      const validEmails = [
        'valid@example.com',
        'user.name@company.co.uk',
        'first+last@domain.org'
      ];

      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user @example.com',
        'user@.com',
        'user@example .com'
      ];

      validEmails.forEach(email => {
        expect(emailService.validateEmail(email)).toBe(true);
      });

      invalidEmails.forEach(email => {
        expect(emailService.validateEmail(email)).toBe(false);
      });
    });

    it('should check for disposable email domains', () => {
      const disposableDomains = [
        'test@tempmail.com',
        'user@guerrillamail.com',
        'demo@mailinator.com',
        'test@10minutemail.com'
      ];

      const legitimateDomains = [
        'user@gmail.com',
        'contact@company.com',
        'john@microsoft.com'
      ];

      disposableDomains.forEach(email => {
        expect(emailService.isDisposableEmail(email)).toBe(true);
      });

      legitimateDomains.forEach(email => {
        expect(emailService.isDisposableEmail(email)).toBe(false);
      });
    });
  });

  describe('Email Templates', () => {
    it('should load and cache email templates', async () => {
      const template = await emailService.getTemplate('welcome', 'en');
      
      expect(template).toBeDefined();
      expect(template.subject).toContain('Welcome');
      expect(template.html).toBeDefined();
      expect(template.text).toBeDefined();

      // Second call should use cache
      const cachedTemplate = await emailService.getTemplate('welcome', 'en');
      expect(cachedTemplate).toBe(template); // Same object reference
    });

    it('should support multilingual templates', async () => {
      const enTemplate = await emailService.getTemplate('welcome', 'en');
      const frTemplate = await emailService.getTemplate('welcome', 'fr');

      expect(enTemplate.subject).toContain('Welcome');
      expect(frTemplate.subject).toContain('Bienvenue');
    });
  });

  describe('Error Handling', () => {
    it('should retry on temporary SendGrid failures', async () => {
      const mockSend = sgMail.send as jest.Mock;
      
      // First attempt fails with temporary error
      mockSend.mockRejectedValueOnce({
        code: 500,
        message: 'Internal Server Error'
      });
      
      // Second attempt succeeds
      mockSend.mockResolvedValueOnce([{ statusCode: 202 }]);

      const result = await emailService.sendWithRetry({
        to: 'test@example.com',
        from: 'sender@test.com',
        subject: 'Test',
        html: 'Test content'
      });

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(2);
    });

    it('should not retry on permanent failures', async () => {
      const mockSend = sgMail.send as jest.Mock;
      
      // Permanent failure (invalid API key)
      mockSend.mockRejectedValue({
        code: 401,
        message: 'Unauthorized'
      });

      const result = await emailService.sendWithRetry({
        to: 'test@example.com',
        from: 'sender@test.com',
        subject: 'Test',
        html: 'Test content'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
      expect(mockSend).toHaveBeenCalledTimes(1); // No retry
    });

    it('should log failed email sends', async () => {
      const mockSend = sgMail.send as jest.Mock;
      mockSend.mockRejectedValue(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await emailService.sendProspectEmail({
        from: 'sender@test.com',
        to: 'prospect@company.com',
        subject: 'Test',
        content: 'Test content'
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to send email'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
