import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Decode a JWT payload without verifying the signature (dev-only fallback)
function decodeJWTPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const padded = parts[1] + '='.repeat((4 - (parts[1].length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

// A real Clerk secret key is 72+ characters (sk_test_/sk_live_ + 64-char key)
const CLERK_SECRET = process.env.CLERK_SECRET_KEY || '';
const HAS_REAL_CLERK_KEY = CLERK_SECRET.length > 50 && CLERK_SECRET.startsWith('sk_');

const clerkMiddleware = HAS_REAL_CLERK_KEY ? ClerkExpressRequireAuth() : null;

if (HAS_REAL_CLERK_KEY) {
  console.log('🔐 Auth: Using Clerk JWT verification');
} else {
  console.warn('⚠️  Auth: CLERK_SECRET_KEY not set or is a placeholder — using dev JWT decode (no verification). Set a real key for production.');
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  // Production path: full Clerk verification
  if (HAS_REAL_CLERK_KEY && clerkMiddleware) {
    clerkMiddleware(req, res, next);
    return;
  }

  // Dev path: decode the token without signature verification
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthenticated' });
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!token || token === 'null' || token === 'undefined') {
    res.status(401).json({ error: 'Unauthenticated' });
    return;
  }

  const payload = decodeJWTPayload(token);
  const userId = payload?.sub || payload?.userId || 'dev_user';
  (req as any).auth = { userId };
  next();
};
