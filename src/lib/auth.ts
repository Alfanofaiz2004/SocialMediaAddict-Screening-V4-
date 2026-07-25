import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '10123406';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'mindscroll_svas6_super_secret_key_2026';

export const ADMIN_COOKIE_NAME = 'mindscroll_admin_token';

// Generate a secure signed token string
export function generateAdminToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(`${ADMIN_USERNAME}:${timestamp}`)
    .digest('hex');
  return `${timestamp}.${signature}`;
}

// Verify if the token string is valid and not expired (24-hour expiry)
export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check 24-hour expiration (86,400,000 ms)
  const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
  if (isExpired) return false;

  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(`${ADMIN_USERNAME}:${timestampStr}`)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

// Helper to check admin authentication from incoming Request cookies or headers
export async function isAuthenticatedAdmin(request: Request): Promise<boolean> {
  // 1. Check Cookie header
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const tokenFromCookie = match ? match[1] : null;

  if (verifyAdminToken(tokenFromCookie)) {
    return true;
  }

  // 2. Check Authorization Bearer header as fallback
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    if (verifyAdminToken(bearerToken)) {
      return true;
    }
  }

  return false;
}

export function validateAdminCredentials(u: string, p: string): boolean {
  const isUserValid = u === ADMIN_USERNAME;
  const isPassValid = p === ADMIN_PASSWORD;
  return isUserValid && isPassValid;
}
