import { NextApiRequest, NextApiResponse } from 'next';
import { CompliantEmailService } from '../../services/email-management';
import { StructuredLogger } from '../../services/monitoring';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      error: 'INVALID_TOKEN',
      message: 'Unsubscribe token is required',
    });
  }

  try {
    const ip = (req.headers['x-forwarded-for'] as string) || 
                req.socket.remoteAddress || 
                'unknown';

    const result = await CompliantEmailService.processUnsubscribeToken(token, ip);

    if (result.success) {
      await StructuredLogger.info('Email', 'User unsubscribed successfully', {
        token: token.substring(0, 10) + '...',
        ip,
      });

      // Render a simple HTML page confirming unsubscribe
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribed - AI Sales Agent</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 48px;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
              max-width: 500px;
              text-align: center;
            }
            h1 {
              color: #1a202c;
              margin-bottom: 16px;
            }
            p {
              color: #4a5568;
              line-height: 1.6;
              margin-bottom: 24px;
            }
            .icon {
              width: 64px;
              height: 64px;
              margin: 0 auto 24px;
              background: #48bb78;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .icon svg {
              width: 32px;
              height: 32px;
              fill: white;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: #5a67d8;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              transition: background 0.2s;
            }
            .button:hover {
              background: #4c51bf;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
              </svg>
            </div>
            <h1>Successfully Unsubscribed</h1>
            <p>${result.message}</p>
            <p>We're sorry to see you go. You will no longer receive marketing emails from AI Sales Agent.</p>
            <p>Note: You may still receive transactional emails related to your account.</p>
            <a href="${process.env.APP_BASE_URL}" class="button">Return to Homepage</a>
          </div>
        </body>
        </html>
      `);
    } else {
      res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribe Error - AI Sales Agent</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #f7fafc;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 48px;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
              max-width: 500px;
              text-align: center;
            }
            h1 {
              color: #e53e3e;
              margin-bottom: 16px;
            }
            p {
              color: #4a5568;
              line-height: 1.6;
              margin-bottom: 24px;
            }
            .icon {
              width: 64px;
              height: 64px;
              margin: 0 auto 24px;
              background: #fc8181;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .icon svg {
              width: 32px;
              height: 32px;
              fill: white;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: #5a67d8;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              transition: background 0.2s;
            }
            .button:hover {
              background: #4c51bf;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>
              </svg>
            </div>
            <h1>Unsubscribe Error</h1>
            <p>${result.message}</p>
            <p>If you continue to have issues, please contact our support team.</p>
            <a href="${process.env.APP_BASE_URL}/contact" class="button">Contact Support</a>
          </div>
        </body>
        </html>
      `);
    }
  } catch (error: any) {
    await StructuredLogger.error('Email', 'Unsubscribe failed', {
      error: error.message,
      token: token.substring(0, 10) + '...',
    });

    res.status(500).json({
      error: 'UNSUBSCRIBE_FAILED',
      message: 'Unable to process unsubscribe request',
    });
  }
}
