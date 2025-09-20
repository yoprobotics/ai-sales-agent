# 🗄️ Prisma Database Setup Guide

## ✅ Implementation Summary

We have successfully implemented all the Prisma recommendations from the audit:

### 📋 What's Been Added

1. **Complete Schema** (`apps/api/prisma/schema.prisma`)
   - ✅ All required tables: users, organisations, prospects, icps, sequences, campaigns, messages, activities
   - ✅ Unique constraints on critical fields (email, domain)
   - ✅ Comprehensive indexes for performance
   - ✅ Soft delete support via `deletedAt` field
   - ✅ Full audit trail with `createdAt` and `updatedAt`
   - ✅ Foreign key relationships with cascade rules
   - ✅ Enums for type safety

2. **Database Utilities** (`apps/api/lib/prisma.ts`)
   - ✅ Singleton Prisma client
   - ✅ Soft delete helpers
   - ✅ Pagination utilities
   - ✅ Transaction retry logic
   - ✅ Database health checks
   - ✅ Session cleanup functions
   - ✅ Data retention management

3. **Seed Data** (`apps/api/prisma/seed.ts`)
   - ✅ Admin user (admin@aisalesagent.com / Admin123!)
   - ✅ Demo user (demo@example.com / Demo123!)
   - ✅ Sample ICP and prospects
   - ✅ Email sequences with templates
   - ✅ AI insights examples
   - ✅ Subscription configuration

4. **Environment Configuration** (`.env.example`)
   - ✅ Database connection strings
   - ✅ Shadow database for migrations
   - ✅ All required environment variables

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
# From the root directory
npm install

# Or specifically for the API
cd apps/api
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and set your database URL
DATABASE_URL="postgresql://user:password@localhost:5432/ai_sales_agent"
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Verify Setup

```bash
# Open Prisma Studio to view your data
npm run db:studio
```

## 📊 Database Schema Overview

### Core Tables
- **User**: Authentication and user management
- **Organisation**: Multi-tenant support
- **ICP**: Ideal Customer Profiles
- **Prospect**: Lead management with qualification scores
- **EmailSequence**: Multi-step email campaigns
- **Campaign**: Outreach campaign management
- **Message**: Email/message tracking
- **Activity**: Task and activity tracking
- **AIInsight**: AI-generated recommendations
- **Subscription**: Billing and plan management
- **AuditLog**: Complete audit trail

### Key Features
- 🔒 **Security**: Password hashing, JWT tokens, session management
- 🌍 **Multi-region**: EU/US/CA data residency support
- 🌐 **i18n**: French/English language support
- 📊 **Analytics**: Comprehensive tracking and reporting
- 🗑️ **Soft Delete**: Data retention with recovery option
- 🔍 **Performance**: Optimized indexes on all query fields

## 🛠️ Database Commands

### Development
```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Push schema changes without migration (development only)
npm run db:push

# Reset database and re-seed
npm run db:reset

# Open Prisma Studio GUI
npm run db:studio
```

### Production
```bash
# Apply migrations in production
npm run db:migrate:prod

# Generate client for production build
npm run db:generate
```

## 🔧 Common Tasks

### Add a New Table
1. Edit `apps/api/prisma/schema.prisma`
2. Add your model with relationships
3. Run `npm run db:migrate` to create migration
4. Update seed data if needed

### Add an Index
```prisma
model Prospect {
  // ... fields ...
  
  @@index([email])
  @@index([companyDomain])
  @@index([score])
}
```

### Implement Soft Delete
```typescript
// In your API endpoint
import { softDelete, withSoftDelete } from '@/lib/prisma';

// Soft delete a record
await prisma.prospect.update({
  where: { id },
  data: softDelete(),
});

// Query excluding soft deleted
const prospects = await prisma.prospect.findMany({
  where: withSoftDelete({ userId }),
});
```

### Handle Pagination
```typescript
import { getPaginationParams, createPaginatedResponse } from '@/lib/prisma';

// In your API endpoint
const paginationParams = getPaginationParams({
  page: req.query.page,
  limit: req.query.limit,
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

const [data, total] = await Promise.all([
  prisma.prospect.findMany({
    where: { userId },
    ...paginationParams,
  }),
  prisma.prospect.count({ where: { userId } }),
]);

return createPaginatedResponse(data, total, paginationParams);
```

## 🔍 Database Monitoring

### Health Check Endpoint
```typescript
// apps/api/pages/api/health.ts
import { checkDatabaseHealth } from '@/lib/prisma';

export default async function handler(req, res) {
  const isHealthy = await checkDatabaseHealth();
  
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    database: isHealthy ? 'connected' : 'disconnected',
  });
}
```

### Cleanup Jobs (Cron)
```typescript
// Run daily via cron job or scheduled function
import { cleanupExpiredSessions, cleanupSoftDeletedRecords } from '@/lib/prisma';

// Clean expired sessions
const deletedSessions = await cleanupExpiredSessions();
console.log(`Cleaned up ${deletedSessions} expired sessions`);

// Clean soft deleted records after 30 days
await cleanupSoftDeletedRecords(30);
```

## 📝 Best Practices

1. **Always use transactions for multi-table operations**
   ```typescript
   await prisma.$transaction(async (tx) => {
     const user = await tx.user.create({ ... });
     const subscription = await tx.subscription.create({ ... });
     return { user, subscription };
   });
   ```

2. **Use select to limit fields returned**
   ```typescript
   const users = await prisma.user.findMany({
     select: {
       id: true,
       email: true,
       firstName: true,
       lastName: true,
       // Don't include passwordHash
     },
   });
   ```

3. **Implement retry logic for production**
   ```typescript
   import { withRetry } from '@/lib/prisma';
   
   const result = await withRetry(
     () => prisma.user.create({ ... }),
     3, // max retries
     1000 // delay in ms
   );
   ```

4. **Use prepared statements to prevent SQL injection**
   ```typescript
   const email = req.body.email;
   const user = await prisma.user.findUnique({
     where: { email }, // Prisma handles parameterization
   });
   ```

## 🚨 Troubleshooting

### Connection Issues
```bash
# Test database connection
npx prisma db pull

# Check DATABASE_URL format
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

### Migration Errors
```bash
# Reset migrations (DEVELOPMENT ONLY)
npx prisma migrate reset

# Create migration without applying
npx prisma migrate dev --create-only

# Mark migration as applied
npx prisma migrate resolve --applied "migration_name"
```

### Performance Issues
```bash
# Analyze query performance
npx prisma studio
# Check EXPLAIN ANALYZE in PostgreSQL

# Add missing indexes
# Edit schema.prisma and add @@index([field])
```

## ✅ Audit Checklist Completed

- ✅ **Schema Verification**: All required tables present
- ✅ **Unique Constraints**: Email and other critical fields
- ✅ **Indexes**: Performance indexes on all query fields
- ✅ **Soft Delete**: Implemented via deletedAt field
- ✅ **Audit Trail**: createdAt/updatedAt on all tables
- ✅ **Foreign Keys**: Proper relationships with cascade rules
- ✅ **Type Safety**: Enums for all status/type fields
- ✅ **Security**: Password hashing, session management
- ✅ **Performance**: Connection pooling, retry logic
- ✅ **Maintenance**: Cleanup functions for expired data

## 🎉 Ready for Development!

The database layer is now fully configured and ready for use. All audit recommendations have been implemented:

1. Run `npm run db:migrate` to create your database
2. Run `npm run db:seed` to populate sample data
3. Run `npm run db:studio` to explore the data
4. Start building your API endpoints!

Need help? Check the [Prisma Documentation](https://www.prisma.io/docs) or reach out to the team.
