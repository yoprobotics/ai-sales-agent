import { NextRequest, NextResponse } from 'next/server'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { User, UserRole } from '@prisma/client'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!)

export interface JWTUser {
  id: string
  email: string
  role: UserRole
  plan: string
}

// Token expiration times
const ACCESS_TOKEN_EXPIRES = '15m'
const REFRESH_TOKEN_EXPIRES = '7d'

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate JWT access token
 */
export async function generateAccessToken(user: JWTUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRES)
    .sign(JWT_SECRET)
}

/**
 * Generate JWT refresh token
 */
export async function generateRefreshToken(userId: string): Promise<string> {
  return new SignJWT({
    sub: userId,
    type: 'refresh',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRES)
    .sign(JWT_REFRESH_SECRET)
}

/**
 * Verify JWT access token
 */
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

/**
 * Verify JWT refresh token
 */
export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET)
    return payload
  } catch {
    return null
  }
}

/**
 * Create session in database
 */
export async function createSession(userId: string, refreshToken: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  return prisma.session.create({
    data: {
      userId,
      sessionToken: generateSessionToken(),
      refreshToken,
      expiresAt,
    },
  })
}

/**
 * Delete session from database
 */
export async function deleteSession(sessionToken: string) {
  return prisma.session.deleteMany({
    where: { sessionToken },
  })
}

/**
 * Generate random session token
 */
function generateSessionToken(): string {
  return crypto.randomUUID()
}

/**
 * Get user from token
 */
export async function getUserFromToken(token: string): Promise<User | null> {
  const payload = await verifyAccessToken(token)
  if (!payload?.sub) return null

  return prisma.user.findUnique({
    where: { id: payload.sub as string },
  })
}

/**
 * Authentication middleware
 */
export async function authMiddleware(
  request: NextRequest,
  requiredRole?: UserRole
): Promise<NextResponse | { user: User }> {
  const token = request.cookies.get('access_token')?.value
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const user = await getUserFromToken(token)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  // Check role authorization
  if (requiredRole && !hasRole(user.role, requiredRole)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    )
  }

  return { user }
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
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

/**
 * Login user and create session
 */
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user || !await verifyPassword(password, user.passwordHash)) {
    throw new Error('Invalid credentials')
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  // Generate tokens
  const jwtUser: JWTUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
  }

  const accessToken = await generateAccessToken(jwtUser)
  const refreshToken = await generateRefreshToken(user.id)

  // Create session
  await createSession(user.id, refreshToken)

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
  }
}

/**
 * Register new user
 */
export async function registerUser(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  companyName?: string
  language?: 'en' | 'fr'
  dataRegion?: 'US' | 'EU' | 'CA'
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const passwordHash = await hashPassword(data.password)

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
    },
  })

  // Generate tokens
  const jwtUser: JWTUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
  }

  const accessToken = await generateAccessToken(jwtUser)
  const refreshToken = await generateRefreshToken(user.id)

  // Create session
  await createSession(user.id, refreshToken)

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
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken: string) {
  const payload = await verifyRefreshToken(refreshToken)
  
  if (!payload?.sub) {
    throw new Error('Invalid refresh token')
  }

  // Verify session exists
  const session = await prisma.session.findFirst({
    where: {
      refreshToken,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  })

  if (!session) {
    throw new Error('Session not found or expired')
  }

  // Generate new access token
  const jwtUser: JWTUser = {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
    plan: session.user.plan,
  }

  const newAccessToken = await generateAccessToken(jwtUser)

  return {
    accessToken: newAccessToken,
    user: {
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      role: session.user.role,
      plan: session.user.plan,
    },
  }
}

/**
 * Logout user and cleanup session
 */
export async function logoutUser(sessionToken: string) {
  await deleteSession(sessionToken)
}

/**
 * Set auth cookies
 */
export function setAuthCookies(response: NextResponse, tokens: { accessToken: string; refreshToken: string }) {
  const isProduction = process.env.NODE_ENV === 'production'

  response.cookies.set('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  })

  response.cookies.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  })
}

/**
 * Clear auth cookies
 */
export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete('access_token')
  response.cookies.delete('refresh_token')
}
