import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'development-refresh-secret';

interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  plan: string;
}

export async function generateTokens(user: UserPayload) {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan,
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

export async function verifyAccessToken(token: string): Promise<UserPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
      plan: decoded.plan,
    };
  } catch (error) {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<{ id: string; email: string } | null> {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
    };
  } catch (error) {
    return null;
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) return null;

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
  });

  if (!user || user.refreshToken !== refreshToken) {
    return null;
  }

  if (user.refreshTokenExp && user.refreshTokenExp < new Date()) {
    return null;
  }

  return generateTokens(user);
}

export async function validatePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
