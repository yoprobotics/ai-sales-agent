import { SignJWT, jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'development-secret-change-in-production'
)
const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'development-refresh-secret'
)

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

interface TokenPayload {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
  plan?: string
}

export async function generateAccessToken(user: any): string {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    plan: user.plan,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .setIssuedAt()
    .sign(JWT_SECRET)

  return token
}

export async function generateRefreshToken(userId: string): string {
  const token = await new SignJWT({ userId, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_REFRESH_EXPIRES_IN)
    .setIssuedAt()
    .sign(JWT_REFRESH_SECRET)

  return token
}

export async function verifyToken(token: string, isRefresh = false): Promise<TokenPayload | null> {
  try {
    const secret = isRefresh ? JWT_REFRESH_SECRET : JWT_SECRET
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as TokenPayload
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  // Set access token cookie
  response.cookies.set('access-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  })

  // Set refresh token cookie
  response.cookies.set('refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  })
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete('access-token')
  response.cookies.delete('refresh-token')
}