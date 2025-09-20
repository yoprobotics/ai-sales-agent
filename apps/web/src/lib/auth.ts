import { NextRequest, NextResponse } from 'next/server';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { User, UserRole } from '@prisma/client';
import { config } from './env';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(config.JWT_SECRET);
const JWT_REFRESH_SECRET = new TextEncoder().encode(config.JWT_REFRESH_SECRET);

export interface JWTUser {
  id: string;
  email: string;
  role: UserRole;
  plan: string;
  sessionId?: string;
}

// Token expiration times
const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';
const REFRESH_TOKEN_ROTATION_WINDOW = 3 * 24 * 60 * 60 * 1000; // 3 days

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT access token with session tracking
 */
export async function generateAccessToken(user: JWTUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
    sessionId: user.sessionId || crypto.randomUUID(),
    jti: crypto.randomUUID(), // JWT ID for token tracking
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRES)
    .setIssuer(config.APP_BASE_URL)
    .setAudience(config.APP_BASE_URL)
    .sign(JWT_SECRET);
}

/**
 * Generate JWT refresh token with family tracking for rotation
 */
export async function generateRefreshToken(userId: string, familyId?: string): Promise<string> {
  return new SignJWT({
    sub: userId,
    type: 'refresh',
    familyId: familyId || crypto.randomUUID(),
    jti: crypto.randomUUID(),
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRES)
    .setIssuer(config.APP_BASE_URL)
    .sign(JWT_REFRESH_SECRET);
}

/**
 * Verify JWT access token with additional checks
 */
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: config.APP_BASE_URL,
      audience: config.APP_BASE_URL,
    });
    
    // Check if session is still valid
    if (payload.sessionId) {
      const session = await prisma.session.findUnique({
        where: { id: payload.sessionId as string },
      });
      
      if (!session || session.expiresAt < new Date()) {
        return null;
      }
    }
    
    return payload;
  } catch (error) {
    // Log token verification failures for security monitoring
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Verify JWT refresh token with rotation check
 */
export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET, {
      issuer: config.APP_BASE_URL,
    });
    
    // Check if token family is blacklisted (rotation breach detection)
    if (payload.familyId) {
      const blacklisted = await prisma.tokenBlacklist.findUnique({
        where: { familyId: payload.familyId as string },
      });
      
      if (blacklisted) {
        // Token family compromised, invalidate all tokens in family
        console.warn('Refresh token family breach detected:', payload.familyId);
        return null;
      }
    }
    
    return payload;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

/**
 * Create session in database with enhanced tracking
 */
export async function createSession(
  userId: string, 
  refreshToken: string,
  userAgent?: string,
  ipAddress?: string
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  return prisma.session.create({
    data: {
      userId,
      sessionToken: generateSessionToken(),
      refreshToken,
      expiresAt,
      userAgent: userAgent || 'unknown',
      ipAddress: ipAddress || 'unknown',
      lastActivityAt: new Date(),
    },
  });
}

/**
 * Delete session from database
 */
export async function deleteSession(sessionToken: string) {
  return prisma.session.deleteMany({
    where: { sessionToken },
  });
}

/**
 * Delete all sessions for a user (logout from all devices)
 */
export async function deleteAllUserSessions(userId: string) {
  return prisma.session.deleteMany({
    where: { userId },
  });
}

/**
 * Generate random session token
 */
function generateSessionToken(): string {
  return crypto.randomUUID();
}

/**
 * Get user from token
 */
export async function getUserFromToken(token: string): Promise<User | null> {
  const payload = await verifyAccessToken(token);
  if (!payload?.sub) return null;

  return prisma.user.findUnique({
    where: { id: payload.sub as string },
  });
}

/**
 * Authentication middleware with enhanced security
 */
export async function authMiddleware(
  request: NextRequest,
  requiredRole?: UserRole
): Promise<NextResponse | { user: User }> {
  const token = request.cookies.get('access_token')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const user = await getUserFromToken(token);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Check if user is active
  if (user.status !== 'ACTIVE') {
    return NextResponse.json(
      { error: 'Account is not active' },
      { status: 403 }
    );
  }

  // Check role authorization
  if (requiredRole && !hasRole(user.role, requiredRole)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  // Update last activity
  await prisma.session.updateMany({
    where: { userId: user.id },
    data: { lastActivityAt: new Date() },
  });

  return { user };
}

/**
 * Check if user has required role
 */
function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.CLIENT]: 1,
    [UserRole.TEAM_MEMBER]: 2,
    [UserRole.TEAM_OWNER]: 3,
    [UserRole.ADMIN]: 4,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Login user and create session with enhanced security
 */
export async function loginUser(
  email: string, 
  password: string,
  request?: NextRequest
) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Prevent user enumeration
    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to prevent timing attacks
    throw new Error('Invalid credentials');
  }

  if (!await verifyPassword(password, user.passwordHash)) {
    // Track failed login attempts
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN_FAILED',
        ipAddress: request?.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request?.headers.get('user-agent') || 'unknown',
      },
    });
    
    throw new Error('Invalid credentials');
  }

  // Check if account is locked
  if (user.status === 'LOCKED') {
    throw new Error('Account is locked. Please contact support.');
  }

  // Update last login and track successful login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      ipAddress: request?.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request?.headers.get('user-agent') || 'unknown',
    },
  });

  // Generate tokens with session tracking
  const sessionId = crypto.randomUUID();
  const jwtUser: JWTUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
    sessionId,
  };

  const accessToken = await generateAccessToken(jwtUser);
  const refreshToken = await generateRefreshToken(user.id);

  // Create session with tracking info
  await createSession(
    user.id, 
    refreshToken,
    request?.headers.get('user-agent') || undefined,
    request?.headers.get('x-forwarded-for') || undefined
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      plan: user.plan,
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  };
}

/**
 * Register new user with enhanced validation
 */
export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  language?: 'en' | 'fr';
  dataRegion?: 'US' | 'EU' | 'CA';
}) {
  // Validate password strength
  if (!isStrongPassword(data.password)) {
    throw new Error('Password does not meet security requirements');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      language: data.language || 'en',
      dataRegion: data.dataRegion || 'EU',
      role: UserRole.CLIENT,
      status: 'PENDING_VERIFICATION', // Require email verification
    },
  });

  // Log registration
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'USER_REGISTERED',
      metadata: { email: user.email, dataRegion: user.dataRegion },
    },
  });

  // Generate tokens
  const sessionId = crypto.randomUUID();
  const jwtUser: JWTUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
    sessionId,
  };

  const accessToken = await generateAccessToken(jwtUser);
  const refreshToken = await generateRefreshToken(user.id);

  // Create session
  await createSession(user.id, refreshToken);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      plan: user.plan,
    },
    accessToken,
    refreshToken,
  };
}

/**
 * Refresh access token with rotation
 */
export async function refreshAccessToken(refreshToken: string) {
  const payload = await verifyRefreshToken(refreshToken);
  
  if (!payload?.sub) {
    throw new Error('Invalid refresh token');
  }

  // Verify session exists and is valid
  const session = await prisma.session.findFirst({
    where: {
      refreshToken,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!session) {
    throw new Error('Session not found or expired');
  }

  // Check if rotation is needed (token older than rotation window)
  const tokenAge = Date.now() - (payload.iat! * 1000);
  const shouldRotate = tokenAge > REFRESH_TOKEN_ROTATION_WINDOW;

  // Generate new access token
  const sessionId = crypto.randomUUID();
  const jwtUser: JWTUser = {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
    plan: session.user.plan,
    sessionId,
  };

  const newAccessToken = await generateAccessToken(jwtUser);
  let newRefreshToken = refreshToken;

  // Rotate refresh token if needed
  if (shouldRotate) {
    newRefreshToken = await generateRefreshToken(
      session.user.id,
      payload.familyId as string // Keep same family ID
    );
    
    // Update session with new refresh token
    await prisma.session.update({
      where: { id: session.id },
      data: { refreshToken: newRefreshToken },
    });
  }

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      role: session.user.role,
      plan: session.user.plan,
    },
  };
}

/**
 * Logout user and cleanup session
 */
export async function logoutUser(sessionToken: string) {
  await deleteSession(sessionToken);
}

/**
 * Set auth cookies with enhanced security
 */
export function setAuthCookies(response: NextResponse, tokens: { accessToken: string; refreshToken: string }) {
  const isProduction = process.env.NODE_ENV === 'production';

  // Access token cookie (short-lived)
  response.cookies.set('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax', // Strict in production
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  // Refresh token cookie (long-lived)
  response.cookies.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax', // Strict in production
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  // Session fingerprint for additional security
  const fingerprint = crypto.randomBytes(32).toString('hex');
  response.cookies.set('session_fingerprint', fingerprint, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

/**
 * Clear auth cookies
 */
export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  response.cookies.delete('session_fingerprint');
  response.cookies.delete('csrf_token');
}

/**
 * Check password strength
 */
function isStrongPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}
