import { NextResponse } from 'next/server';
import crypto from 'crypto';
import type { UserProfile } from '@matric/shared-types';

function safeCompare(input: string, secret: string): boolean {
  if (!input || !secret) return false;
  const hashInput = crypto.createHash('sha256').update(input).digest();
  const hashSecret = crypto.createHash('sha256').update(secret).digest();
  return crypto.timingSafeEqual(hashInput, hashSecret);
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
    const expectedPassword = process.env.VIXY_ACCOUNT_PASSWORD;

    if (!expectedPassword) {
      console.error('[Auth API] VIXY_ACCOUNT_PASSWORD environment variable is not configured');
      return NextResponse.json(
        { success: false, error: 'Authentication service configuration error' },
        { status: 500 }
      );
    }

    const usernameMatch = username.trim().toLowerCase() === expectedUsername.toLowerCase();
    const passwordMatch = safeCompare(password, expectedPassword);

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
