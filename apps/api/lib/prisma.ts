import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper function to exclude fields from Prisma results
export function exclude<T, Key extends keyof T>(
  model: T,
  keys: Key[]
): Omit<T, Key> {
  for (let key of keys) {
    delete model[key];
  }
  return model;
}

// Helper function for soft delete queries
export function withSoftDelete(where: any = {}) {
  return {
    ...where,
    deletedAt: null,
  };
}

// Helper function to add soft delete
export function softDelete() {
  return {
    deletedAt: new Date(),
  };
}

// Transaction wrapper with automatic retry
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error.code === 'P2034' || // Transaction failed
         error.code === 'P2028' || // Transaction API error
         error.code === 'P1001')   // Can't reach database
      ) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      
      // Non-retryable error, throw immediately
      throw error;
    }
  }
  
  throw lastError;
}

// Pagination helper
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function getPaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;
  
  return {
    skip,
    take: limit,
    orderBy: params.sortBy
      ? { [params.sortBy]: params.sortOrder || 'desc' }
      : undefined,
  };
}

// Pagination response helper
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function createPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): Promise<PaginatedResponse<T>> {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Clean up expired sessions
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  
  return result.count;
}

// Clean up soft deleted records (after retention period)
export async function cleanupSoftDeletedRecords(
  retentionDays = 30
): Promise<void> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
  
  // Clean up users
  await prisma.user.deleteMany({
    where: {
      deletedAt: {
        lt: cutoffDate,
      },
    },
  });
  
  // Clean up prospects
  await prisma.prospect.deleteMany({
    where: {
      deletedAt: {
        lt: cutoffDate,
      },
    },
  });
  
  // Clean up other entities as needed
  await prisma.iCP.deleteMany({
    where: {
      deletedAt: {
        lt: cutoffDate,
      },
    },
  });
  
  await prisma.campaign.deleteMany({
    where: {
      deletedAt: {
        lt: cutoffDate,
      },
    },
  });
  
  await prisma.emailSequence.deleteMany({
    where: {
      deletedAt: {
        lt: cutoffDate,
      },
    },
  });
  
  await prisma.activity.deleteMany({
    where: {
      deletedAt: {
        lt: cutoffDate,
      },
    },
  });
}

// Export types
export type { PrismaClient } from '@prisma/client';
