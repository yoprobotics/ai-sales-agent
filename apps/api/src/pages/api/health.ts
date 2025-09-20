import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { StructuredLogger } from '../../services/monitoring';

const prisma = new PrismaClient();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: boolean;
    environment: boolean;
    services: {
      stripe: boolean;
      sendgrid: boolean;
      openai: boolean;
    };
  };
  version: string;
  environment: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthStatus | { error: string }>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: false,
      environment: false,
      services: {
        stripe: false,
        sendgrid: false,
        openai: false,
      },
    },
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  };

  try {
    // Check database connectivity
    try {
      await prisma.$queryRaw`SELECT 1`;
      healthStatus.checks.database = true;
    } catch (error) {
      await StructuredLogger.error('Health', 'Database check failed', { error });
      healthStatus.status = 'unhealthy';
    }

    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'ENCRYPTION_KEY',
      'STRIPE_SECRET_KEY',
      'SENDGRID_API_KEY',
      'OPENAI_API_KEY',
    ];

    const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
    
    if (missingEnvVars.length === 0) {
      healthStatus.checks.environment = true;
    } else {
      await StructuredLogger.warn('Health', 'Missing environment variables', { 
        missing: missingEnvVars 
      });
      healthStatus.status = healthStatus.status === 'unhealthy' ? 'unhealthy' : 'degraded';
    }

    // Check external services (basic checks)
    healthStatus.checks.services.stripe = !!process.env.STRIPE_SECRET_KEY?.startsWith('sk_');
    healthStatus.checks.services.sendgrid = !!process.env.SENDGRID_API_KEY?.startsWith('SG.');
    healthStatus.checks.services.openai = !!process.env.OPENAI_API_KEY?.startsWith('sk-');

    // If any service check failed, mark as degraded
    if (!Object.values(healthStatus.checks.services).every(v => v)) {
      healthStatus.status = healthStatus.status === 'unhealthy' ? 'unhealthy' : 'degraded';
    }

    // Log health check
    await StructuredLogger.debug('Health', 'Health check completed', {
      status: healthStatus.status,
      duration: Date.now() - startTime,
    });

    // Set appropriate status code
    const statusCode = healthStatus.status === 'healthy' ? 200 : 
                       healthStatus.status === 'degraded' ? 503 : 500;

    res.status(statusCode).json(healthStatus);
  } catch (error: any) {
    await StructuredLogger.error('Health', 'Health check failed', { 
      error: error.message 
    });
    
    res.status(500).json({ 
      error: 'Health check failed' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
