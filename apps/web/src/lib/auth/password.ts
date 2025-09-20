import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function isStrongPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

export function getPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  // Length
  if (password.length >= 8) score += 1;
  else feedback.push('Password should be at least 8 characters');
  
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Complexity
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('Add numbers');
  
  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push('Add special characters (@$!%*?&)');

  // Common patterns to avoid
  if (/^[a-zA-Z]+$/.test(password)) {
    score -= 1;
    feedback.push('Avoid using only letters');
  }
  
  if (/^\d+$/.test(password)) {
    score -= 2;
    feedback.push('Avoid using only numbers');
  }

  // Normalize score to 0-100
  const normalizedScore = Math.max(0, Math.min(100, (score / 7) * 100));

  return {
    score: Math.round(normalizedScore),
    feedback,
  };
}