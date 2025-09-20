import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

// Utility function to handle Prisma errors
export function handlePrismaError(error: any): { message: string; code: string } {
  // Known Prisma error codes
  const errorMap: Record<string, { message: string; code: string }> = {
    P2002: {
      message: 'A unique constraint would be violated',
      code: 'UNIQUE_VIOLATION',
    },
    P2003: {
      message: 'Foreign key constraint failed',
      code: 'FOREIGN_KEY_VIOLATION',
    },
    P2025: {
      message: 'Record not found',
      code: 'NOT_FOUND',
    },
    P2016: {
      message: 'Query interpretation error',
      code: 'QUERY_ERROR',
    },
    P2000: {
      message: 'Value too long for column',
      code: 'VALUE_TOO_LONG',
    },
    P2001: {
      message: 'Record searched was not found',
      code: 'RECORD_NOT_FOUND',
    },
    P2014: {
      message: 'Relation violation',
      code: 'RELATION_VIOLATION',
    },
  };

  if (error.code && errorMap[error.code]) {
    return errorMap[error.code];
  }

  // Generic database error
  return {
    message: 'Database operation failed',
    code: 'DATABASE_ERROR',
  };
}

// Transaction helper with automatic retry
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on certain errors
      if (
        error.code === 'P2002' || // Unique constraint
        error.code === 'P2003' || // Foreign key constraint
        error.code === 'P2025' // Not found
      ) {
        throw error;
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
}
