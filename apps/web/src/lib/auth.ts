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

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export async function createAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET)
}

export async function createRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_REFRESH_SECRET)
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload as JWTPayload
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET)
  return payload as JWTPayload
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
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
