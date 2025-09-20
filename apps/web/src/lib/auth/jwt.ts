import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// JWT configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-min-32-chars'
);
const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-this-in-production-32chr'
);

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface JWTUser {
  id: string;
  email: string;
  role: string;
  plan: string;
  firstName: string;
  lastName: string;
  language: string;
  dataRegion: string;
}

interface TokenPayload extends JWTPayload {
  user: JWTUser;
  type: 'access' | 'refresh';
}

// Generate access token
export async function generateAccessToken(user: JWTUser): Promise<string> {
  const token = await new SignJWT({ user, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .setSubject(user.id)
    .sign(JWT_SECRET);

  return token;
}

// Generate refresh token
export async function generateRefreshToken(user: JWTUser): Promise<string> {
  const token = await new SignJWT({ user, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_REFRESH_EXPIRES_IN)
    .setSubject(user.id)
    .sign(JWT_REFRESH_SECRET);

  return token;
}

// Verify access token
export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as TokenPayload;
  } catch (error) {
    return null;
  }
}

// Verify refresh token
export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_REFRESH_SECRET);
    return verified.payload as TokenPayload;
  } catch (error) {
    return null;
  }
}

// Set auth cookies
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = cookies();
  
  // Set access token cookie (httpOnly, secure, sameSite)
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  // Set refresh token cookie (httpOnly, secure, sameSite)
  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

// Clear auth cookies
export async function clearAuthCookies() {
  const cookieStore = cookies();
  
  cookieStore.set('access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  cookieStore.set('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

// Get current user from request
export async function getCurrentUser(request: NextRequest): Promise<JWTUser | null> {
  const accessToken = request.cookies.get('access_token')?.value;
  
  if (!accessToken) {
    return null;
  }

  const payload = await verifyAccessToken(accessToken);
  
  if (!payload || payload.type !== 'access') {
    return null;
  }

  return payload.user;
}

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  user: JWTUser;
} | null> {
  const payload = await verifyRefreshToken(refreshToken);
  
  if (!payload || payload.type !== 'refresh') {
    return null;
  }

  const newAccessToken = await generateAccessToken(payload.user);
  
  return {
    accessToken: newAccessToken,
    user: payload.user,
  };
}