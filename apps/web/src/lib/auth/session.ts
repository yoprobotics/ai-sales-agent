import prisma from '@/lib/prisma';
import { JWTUser } from './jwt';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Session management
export async function createSession(
  userId: string,
  token: string,
  refreshToken: string
) {
  // Calculate expiration times
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Create session in database
  const session = await prisma.session.create({
    data: {
      userId,
      token,
      refreshToken,
      expiresAt: refreshTokenExpiry,
    },
  });

  // Update user's last login
  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });

  return session;
}

// Validate session
export async function validateSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({
      where: { id: session.id },
    });
    return null;
  }

  return session;
}

// Refresh session
export async function refreshSession(refreshToken: string) {
  const session = await prisma.session.findUnique({
    where: { refreshToken },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({
      where: { id: session.id },
    });
    return null;
  }

  // Generate new tokens
  const newToken = crypto.randomBytes(32).toString('hex');
  const newRefreshToken = crypto.randomBytes(32).toString('hex');

  // Update session with new tokens
  const updatedSession = await prisma.session.update({
    where: { id: session.id },
    data: {
      token: newToken,
      refreshToken: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    include: { user: true },
  });

  return {
    session: updatedSession,
    newToken,
    newRefreshToken,
  };
}

// Delete session (logout)
export async function deleteSession(token: string) {
  try {
    await prisma.session.delete({
      where: { token },
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Delete all user sessions (logout from all devices)
export async function deleteAllUserSessions(userId: string) {
  try {
    await prisma.session.deleteMany({
      where: { userId },
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Clean up expired sessions
export async function cleanupExpiredSessions() {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}