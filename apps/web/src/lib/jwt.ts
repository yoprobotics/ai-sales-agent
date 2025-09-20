import jwt from 'jsonwebtoken';

// JWT configuration using jose library for edge runtime compatibility
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets are not configured');
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  plan: string;
}

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
  });
}

export function signRefreshToken(payload: { id: string; email: string }): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { id: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { id: string; email: string };
  } catch {
    return null;
  }
}
