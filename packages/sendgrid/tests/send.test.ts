import { sendEmail, sendBulkEmails, scheduleEmail } from '../src/send';
import { resetSendGrid } from '../src/client';

// Mock SendGrid
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue([{
    statusCode: 202,
    headers: { 'x-message-id': 'test-message-id' },
  }]),
}));

jest.mock('@sendgrid/client', () => ({
  setApiKey: jest.fn(),
}));

describe('SendGrid Send Module', () => {
  beforeEach(() => {
    resetSendGrid();
    process.env.SENDGRID_API_KEY = 'SG.test_key';
    process.env.SENDGRID_FROM_EMAIL = 'test@example.com';
    process.env.SENDGRID_FROM_NAME = 'Test Sender';
  });

  describe('sendEmail', () => {
    it('should send a simple email', async () => {
      const response = await sendEmail({
        to: 'recipient@example.com',
        subject: 'Test Email',
        text: 'This is a test',
        html: '<p>This is a test</p>',
      });

      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.messageId).toBe('test-message-id');
    });

    it('should send email with template', async () => {
      const response = await sendEmail({
        to: 'recipient@example.com',
        subject: 'Template Email',
        templateId: 'template_123',
        dynamicTemplateData: {
          firstName: 'John',
          company: 'Acme Corp',
        },
      });

      expect(response.success).toBe(true);
    });

    it('should send to multiple recipients', async () => {
      const response = await sendEmail({
        to: ['user1@example.com', 'user2@example.com'],
        subject: 'Multi Recipient',
        text: 'Hello everyone',
      });

      expect(response.success).toBe(true);
    });

    it('should handle attachments', async () => {
      const response = await sendEmail({
        to: 'recipient@example.com',
        subject: 'Email with Attachment',
        text: 'See attached',
        attachments: [{
          content: 'base64content',
          filename: 'document.pdf',
          type: 'application/pdf',
        }],
      });

      expect(response.success).toBe(true);
    });
  });

  describe('sendBulkEmails', () => {
    it('should send multiple emails', async () => {
      const emails = [
        {
          to: 'user1@example.com',
          subject: 'Email 1',
          text: 'Content 1',
        },
        {
          to: 'user2@example.com',
          subject: 'Email 2',
          text: 'Content 2',
        },
      ];

      const results = await sendBulkEmails(emails);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
    });

    it('should handle partial failures', async () => {
      const sgMail = require('@sendgrid/mail');
      
      // Make second email fail
      sgMail.send
        .mockResolvedValueOnce([{ statusCode: 202, headers: { 'x-message-id': 'msg1' } }])
        .mockRejectedValueOnce(new Error('Failed to send'));

      const emails = [
        {
          to: 'user1@example.com',
          subject: 'Email 1',
          text: 'Content 1',
        },
        {
          to: 'user2@example.com',
          subject: 'Email 2',
          text: 'Content 2',
        },
      ];

      const results = await sendBulkEmails(emails);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toBe('Failed to send');
    });
  });

  describe('scheduleEmail', () => {
    it('should schedule email for future', async () => {
      const sendAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

      const response = await scheduleEmail(
        {
          to: 'recipient@example.com',
          subject: 'Scheduled Email',
          text: 'This is scheduled',
        },
        sendAt
      );

      expect(response.success).toBe(true);
    });

    it('should reject if sendAt is too soon', async () => {
      const sendAt = new Date(Date.now() + 30 * 1000); // 30 seconds from now

      await expect(
        scheduleEmail(
          {
            to: 'recipient@example.com',
            subject: 'Too Soon',
            text: 'This is too soon',
          },
          sendAt
        )
      ).rejects.toThrow('Scheduled time must be at least 60 seconds in the future');
    });
  });
});