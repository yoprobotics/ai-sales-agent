import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { generateAccessToken, generateRefreshToken, verifyToken } from '@/lib/jwt'

interface UserPayload {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  plan: string
}

export async function generateTokens(user: UserPayload) {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user.id)
  return { accessToken, refreshToken }
}

export async function verifyAccessToken(token: string): Promise<UserPayload | null> {
  const payload = await verifyToken(token)
  if (!payload) return null
  
  return {
    id: payload.userId,
    email: payload.email,
    firstName: payload.firstName || '',
    lastName: payload.lastName || '',
    role: payload.role as UserRole,
    plan: payload.plan || 'STARTER',
  }
}

export async function verifyRefreshToken(token: string): Promise<{ id: string; email: string } | null> {
  const payload = await verifyToken(token, true)
  if (!payload) return null
  
  return {
    id: payload.userId,
    email: payload.email,
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  const payload = await verifyRefreshToken(refreshToken)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      plan: true,
      refreshToken: true,
      refreshTokenExp: true,
    },
  })

  if (!user || user.refreshToken !== refreshToken) {
    return null
  }

  if (user.refreshTokenExp && user.refreshTokenExp < new Date()) {
    return null
  }

  return generateTokens(user)
}

export async function validatePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify auth from NextRequest
export async function verifyAuth(request: Request): Promise<{ authenticated: boolean; userId?: string; email?: string }> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return { authenticated: false }
  }
  
  const payload = await verifyToken(token)
  if (!payload) {
    return { authenticated: false }
  }
  
  return {
    authenticated: true,
    userId: payload.userId,
    email: payload.email,
  }
}