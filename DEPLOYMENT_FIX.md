# Deployment Fix

This branch fixes critical deployment errors that were preventing the application from building on Vercel.

## Issues Fixed

### 1. TypeScript Compilation Errors
- **Problem**: The `User` model was trying to use `refreshToken` and `refreshTokenExp` fields that don't exist in the Prisma schema
- **Solution**: Updated authentication routes to use the `Session` model for storing tokens instead of the `User` model

### 2. Authentication Routes Updated
- `apps/web/src/app/api/auth/login/route.ts`: Now creates a Session record for token storage
- `apps/web/src/app/api/auth/refresh/route.ts`: Now queries the Session model for refresh token validation

### 3. Removed Non-existent References
- Removed references to `user.plan` field which doesn't exist
- Removed `AuditLog` model usage which wasn't defined in the schema

## Changes Made

1. **Login Route (`/api/auth/login`)**
   - Creates a new Session record with access and refresh tokens
   - Deletes old sessions for the user before creating a new one
   - Updates only the `lastLoginAt` field on the User model

2. **Refresh Route (`/api/auth/refresh`)**
   - Queries the Session model by refresh token
   - Validates session expiration
   - Updates the existing session with new tokens

3. **Environment Variables**
   - Added `.env.example` file documenting required environment variables
   - Ensures JWT_SECRET and JWT_REFRESH_SECRET are properly configured

## Testing

To test these changes locally:

```bash
# Install dependencies
cd apps/web
npm install

# Generate Prisma client
npx prisma generate

# Run the development server
npm run dev
```

## Deployment

Once merged, Vercel will automatically:
1. Install dependencies
2. Generate Prisma client
3. Build the Next.js application
4. Deploy to production

## Required Environment Variables

Make sure these are set in Vercel:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens

## Verification

After deployment, verify the application works:
1. Visit the homepage: Should display the landing page
2. Check API health: Visit `/api/health` for health check
3. Test authentication: Login/refresh endpoints should work without TypeScript errors
