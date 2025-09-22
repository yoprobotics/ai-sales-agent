# 🐛 Fix Registration Build Error - Subscription Status Enum

## Problem
The build was failing with a TypeScript error in the registration route:
```
Type error: Type '"trial"' is not assignable to type 'SubscriptionStatus | undefined'.
```

## Root Cause
1. Using `'trial'` instead of the correct enum value `'TRIALING'`
2. Incorrect subscription creation structure - trying to set `usage` and `limits` directly instead of using the related `SubscriptionUsage` model

## Solution

### Fixed Enum Value
- Changed from `status: 'trial'` to `status: 'TRIALING'`
- This matches the actual `SubscriptionStatus` enum in Prisma schema

### Fixed Subscription Structure
- Properly create `SubscriptionUsage` as a related model
- Set usage limits in the correct nested structure
- Added `currentPeriodStart` and `currentPeriodEnd` fields

## Changes Made
- Updated `apps/web/src/app/api/auth/register/route.ts`
- Fixed subscription status enum value
- Corrected subscription usage creation structure
- Enhanced user response to include subscription details

## Testing
- TypeScript compilation will now succeed
- Registration flow will properly create subscription with trial status
- Usage tracking will be correctly initialized

## Impact
- No breaking changes
- Fixes critical build error
- Improves subscription initialization
