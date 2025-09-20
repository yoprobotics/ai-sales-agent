import { headers } from 'next/headers';
import { JWTUser } from './jwt';

// Get current user from headers (set by middleware)
export function getCurrentUser(): JWTUser | null {
  const headersList = headers();
  const userHeader = headersList.get('x-user');
  
  if (!userHeader) {
    return null;
  }
  
  try {
    return JSON.parse(userHeader) as JWTUser;
  } catch (error) {
    return null;
  }
}

// Get current user or throw error (for protected routes)
export function requireUser(): JWTUser {
  const user = getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

// Check if user has a specific role
export function requireRole(role: string | string[]): JWTUser {
  const user = requireUser();
  
  const roles = Array.isArray(role) ? role : [role];
  
  if (!roles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  
  return user;
}

// Check if user has a specific permission
export function requirePermission(permission: string): JWTUser {
  const user = requireUser();
  
  // Import hasPermission from rbac
  const { hasPermission } = require('./rbac');
  
  if (!hasPermission(user.role, permission)) {
    throw new Error('Forbidden');
  }
  
  return user;
}