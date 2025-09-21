// Prisma client singleton - with graceful fallback
import type { PrismaClient as PrismaClientType } from '@prisma/client';

let prisma: PrismaClientType | null = null;

// Only initialize Prisma if DATABASE_URL is set
if (process.env.DATABASE_URL) {
  try {
    const { PrismaClient } = require('@prisma/client');
    const globalForPrisma = globalThis as unknown as {
      prisma: PrismaClientType | undefined;
    };
    
    prisma = globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma as PrismaClientType;
    }
  } catch (error) {
    console.warn('Prisma client could not be initialized:', error);
  }
} else {
  console.info('DATABASE_URL not set, database features disabled');
}

export { prisma };
