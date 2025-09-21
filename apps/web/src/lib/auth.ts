// Temporary auth module - will be properly implemented after deployment

export async function verifyAccessToken(token: string): Promise<any> {
  // Temporary implementation - always return null for now
  return null;
}

export function generateAccessToken(payload: any): string {
  // Temporary implementation
  return 'temp-token';
}

export function generateRefreshToken(payload: any): string {
  // Temporary implementation
  return 'temp-refresh-token';
}
