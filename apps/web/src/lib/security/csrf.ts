// Temporary CSRF module - will be properly implemented after deployment

import { NextRequest } from 'next/server';

export function verifyCSRFToken(request: NextRequest): boolean {
  // Temporary implementation - always return true for now
  return true;
}

export function generateCSRFToken(): string {
  // Temporary implementation
  return 'temp-csrf-token';
}
