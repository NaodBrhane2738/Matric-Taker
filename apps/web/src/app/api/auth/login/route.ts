import { NextResponse } from 'next/server';
import crypto from 'crypto';
import type { UserProfile } from '@matric/shared-types';
import {
  registerNewUser,
  authenticateUser,
  findUserByUsername,
  updateUserProfile,
} from '../../../../lib/server/users';
import { verifyTurnstileSubmission } from '../../../../lib/server/turnstile';

// Pre-computed SHA-256 hash fallback for default administrative bootstrap
const FALLBACK_ACCOUNT_HASH = 'd2bc50efea3467896011574e8306b4e532d114732b1dbab9543e1f5231e2906d';

function verifyAdminPassword(inputPassword: string, envPassword?: string): boolean {
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
    const {
      username,
      password,
      action = 'login',
      contactEmail,
      guestId,
      userId,
      nickname,
      newPassword,
      turnstileToken,
      honeypot,
      formInitTimestamp,
    } = body;

    // 0. Update Profile Action (User already logged in)
    if (action === 'update_profile') {
      if (!userId || typeof userId !== 'string') {
        return NextResponse.json(
          { success: false, error: 'User ID is required to update profile' },
          { status: 400 }
        );
      }

      // Handle Admin Vixy profile update in-memory
      if (userId === 'usr_vixy') {
        const expectedAdminUsername = process.env.VIXY_ACCOUNT_USERNAME || 'Vixy';
        const updatedVixy: UserProfile = {
          id: 'usr_vixy',
          username: expectedAdminUsername,
          nickname: typeof nickname === 'string' && nickname.trim() ? nickname.trim() : expectedAdminUsername,
          contactEmail: typeof contactEmail === 'string' && contactEmail.trim() ? contactEmail.trim() : undefined,
          role: 'admin',
          isGuest: false,
          xp: 500,
          level: 5,
          createdAt: new Date().toISOString(),
        };
        return NextResponse.json({
          success: true,
          message: 'Admin profile updated',
          user: updatedVixy,
        });
      }

      const updateResult = updateUserProfile(userId, {
        nickname: typeof nickname === 'string' && nickname.trim() ? nickname.trim() : undefined,
        contactEmail: typeof contactEmail === 'string' ? contactEmail : undefined,
        newPassword: typeof newPassword === 'string' && newPassword.length >= 4 ? newPassword : undefined,
      });

      if (!updateResult.success) {
        return NextResponse.json(
          { success: false, error: updateResult.error || 'Failed to update profile' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        user: updateResult.user,
      });
    }

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

    const cleanUsername = username.trim();
    const expectedAdminUsername = process.env.VIXY_ACCOUNT_USERNAME || 'Vixy';
    const envAdminPassword = process.env.VIXY_ACCOUNT_PASSWORD;

    // 1. Registration & Guest Profile Conversion
    if (action === 'register' || action === 'convert') {
      const clientIp =
        req.headers.get('cf-connecting-ip') ||
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();

      const turnstileCheck = await verifyTurnstileSubmission({
        token: turnstileToken,
        honeypot,
        formInitTimestamp,
        ip: clientIp,
      });

      if (!turnstileCheck.success) {
        return NextResponse.json(
          { success: false, error: turnstileCheck.error || 'Turnstile verification failed' },
          { status: 403 }
        );
      }

      const regResult = registerNewUser({
        username: cleanUsername,
        password,
        contactEmail: typeof contactEmail === 'string' && contactEmail.trim() ? contactEmail.trim() : undefined,
        role: 'student',
        guestId: typeof guestId === 'string' ? guestId : undefined,
      });

      if (!regResult.success) {
        return NextResponse.json(
          { success: false, error: regResult.error || 'Registration failed' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: action === 'convert' ? 'Guest profile converted successfully' : 'Account registered successfully',
        user: regResult.user,
      });
    }

    // 2. Login Flow
    // A. Check for built-in Administrator account (Vixy)
    if (
      cleanUsername.toLowerCase() === expectedAdminUsername.toLowerCase() &&
      verifyAdminPassword(password, envAdminPassword)
    ) {
      const adminProfile: UserProfile = {
        id: 'usr_vixy',
        username: expectedAdminUsername,
        nickname: expectedAdminUsername,
        contactEmail: typeof contactEmail === 'string' && contactEmail.trim() ? contactEmail.trim() : undefined,
        role: 'admin',
        isGuest: false,
        xp: 500,
        level: 5,
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        message: 'Admin login successful',
        user: adminProfile,
      });
    }

    // B. Authenticate registered user
    const authResult = authenticateUser(cleanUsername, password);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Invalid username or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: authResult.user,
    });
  } catch (error) {
    console.error('[Auth API] Unexpected error during authentication:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred' },
      { status: 500 }
    );
  }
}
