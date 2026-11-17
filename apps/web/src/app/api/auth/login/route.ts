import { NextResponse } from 'next/server';
import crypto from 'crypto';
import type { UserProfile } from '@matric/shared-types';

// Pre-computed SHA-256 hash fallback so authentication works on hosting platforms (e.g. Render)
// without hardcoding plaintext credentials in source code or client bundles.
const FALLBACK_ACCOUNT_HASH = 'd2bc50efea3467896011574e8306b4e532d114732b1dbab9543e1f5231e2906d';

function verifyPassword(inputPassword: string, envPassword?: string): boolean {
  if (!inputPassword) return false;

  const inputHash = crypto.createHash('sha256').update(inputPassword).digest();

  if (envPassword) {
    const expectedHash = crypto.createHash('sha256').update(envPassword).digest();
    return crypto.timingSafeEqual(inputHash, expectedHash);
  }

  // Fallback to secure precomputed hash if env variable is not yet populated on host
  const expectedHash = Buffer.from(FALLBACK_ACCOUNT_HASH, 'hex');
  return crypto.timingSafeEqual(inputHash, expectedHash);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, action = 'login', contactEmail } = body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    const expectedUsername = process.env.VIXY_ACCOUNT_USERNAME || 'Vixy';
    const envPassword = process.env.VIXY_ACCOUNT_PASSWORD;

    const usernameMatch = username.trim().toLowerCase() === expectedUsername.toLowerCase();
    const passwordMatch = verifyPassword(password, envPassword);

    if (!usernameMatch || !passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Single authorized account profile
    const userProfile: UserProfile = {
      id: 'usr_vixy',
      username: expectedUsername,
      nickname: expectedUsername,
      contactEmail: typeof contactEmail === 'string' && contactEmail.trim() ? contactEmail.trim() : undefined,
      role: 'admin',
      isGuest: false,
      xp: 500,
      level: 5,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: action === 'register' ? 'Account registered successfully' : 'Login successful',
      user: userProfile,
    });
  } catch (error) {
    console.error('[Auth API] Unexpected error during authentication:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred' },
      { status: 500 }
    );
  }
}
