import { jwtVerify, SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-refresh-secret-key-change-in-production'
)

// Rename our custom interface to avoid conflict with jose's JWTPayload
export interface AuthPayload {
  id: string  // Changed from userId to id to match the token generation
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  companyName?: string | null
  language: string
  dataRegion: string
}

export async function createAccessToken(user: User) {
  const payload = {
    id: user.id,
    userId: user.id,
    email: user.email,
    role: user.role
  }
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET)
}

export async function createRefreshToken(user: User) {
  const payload = {
    id: user.id,
    userId: user.id,
    email: user.email,
    role: user.role
  }
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_REFRESH_SECRET)
}

export async function verifyAccessToken(token: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  
  // Validate that the payload has the required fields
  if (!payload.id || !payload.userId || !payload.email || !payload.role) {
    throw new Error('Invalid token payload')
  }
  
  return {
    id: payload.id as string,
    userId: payload.userId as string,
    email: payload.email as string,
    role: payload.role as string,
    iat: payload.iat,
    exp: payload.exp
  }
}

export async function verifyRefreshToken(token: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET)
  
  // Validate that the payload has the required fields
  if (!payload.id || !payload.userId || !payload.email || !payload.role) {
    throw new Error('Invalid token payload')
  }
  
  return {
    id: payload.id as string,
    userId: payload.userId as string,
    email: payload.email as string,
    role: payload.role as string,
    iat: payload.iat,
    exp: payload.exp
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = cookies()
  
  // Set access token cookie (httpOnly, secure, sameSite)
  cookieStore.set('auth-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  })
  
  // Set refresh token cookie (httpOnly, secure, sameSite)
  cookieStore.set('refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  })
}

export async function getAuthFromCookies() {
  const cookieStore = cookies()
  
  return {
    accessToken: cookieStore.get('auth-token')?.value,
    refreshToken: cookieStore.get('refresh-token')?.value,
  }
}

export async function clearAuthCookies() {
  const cookieStore = cookies()
  
  cookieStore.delete('auth-token')
  cookieStore.delete('refresh-token')
}

export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) {
    return null
  }
  
  try {
    const payload = await verifyAccessToken(token)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        companyName: true,
        plan: true,
        language: true,
        timezone: true,
      },
    })
    
    return user
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}

export async function requireRole(roles: string[]) {
  const user = await requireAuth()
  
  if (!roles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }
  
  return user
}
