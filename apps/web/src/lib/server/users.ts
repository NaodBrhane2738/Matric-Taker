import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { UserProfile } from '@matric/shared-types';

export interface StoredUser {
  id: string;
  username: string;
  nickname: string;
  passwordHash: string;
  salt: string;
  contactEmail?: string;
  role: 'student' | 'admin';
  isGuest: boolean;
  xp: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory fallback in case filesystem is restricted or read-only
const memoryUsers = new Map<string, StoredUser>();

function getUsersFilePath(): string {
  const candidates = [
    path.join(process.cwd(), 'data', 'users.json'),
    path.join(process.cwd(), 'apps', 'web', 'data', 'users.json'),
    path.join(process.cwd(), '..', '..', 'data', 'users.json'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c;
    }
  }

  // Default to first candidate
  return candidates[0];
}

function ensureDataDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // ignore
    }
  }
}

export function getAllUsers(): StoredUser[] {
  const filePath = getUsersFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const list = JSON.parse(content);
      if (Array.isArray(list)) {
        // Sync memory store
        list.forEach((u) => memoryUsers.set(u.username.toLowerCase(), u));
        return list;
      }
    }
  } catch (err) {
    console.warn('[UserStore] Could not read users file, using memory store:', err);
  }

  return Array.from(memoryUsers.values());
}

function saveAllUsers(users: StoredUser[]): boolean {
  const filePath = getUsersFilePath();
  try {
    ensureDataDir(filePath);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('[UserStore] Could not write users to disk, stored in-memory:', err);
    return false;
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function findUserByUsername(username: string): StoredUser | null {
  const normalized = username.trim().toLowerCase();
  const all = getAllUsers();
  const found = all.find((u) => u.username.toLowerCase() === normalized);
  if (found) return found;
  return memoryUsers.get(normalized) || null;
}

export function registerNewUser(params: {
  username: string;
  password: string;
  contactEmail?: string;
  role?: 'student' | 'admin';
  guestId?: string;
}): { success: boolean; user?: UserProfile; error?: string } {
  const { username, password, contactEmail, role = 'student', guestId } = params;
  const cleanUsername = username.trim();

  if (!cleanUsername) {
    return { success: false, error: 'Username is required' };
  }

  if (cleanUsername.length < 2) {
    return { success: false, error: 'Username must be at least 2 characters long' };
  }

  if (!password || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters long' };
  }

  // Prevent hijacking system admin username
  const expectedAdmin = process.env.VIXY_ACCOUNT_USERNAME || 'Vixy';
  if (cleanUsername.toLowerCase() === expectedAdmin.toLowerCase()) {
    return {
      success: false,
      error: 'This username is reserved for system administration.',
    };
  }

  // Check if username is already taken
  const existing = findUserByUsername(cleanUsername);
  if (existing) {
    return {
      success: false,
      error: 'Username is already taken. Please choose another username or use the randomize button.',
    };
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const now = new Date().toISOString();
  const userId = guestId && guestId.startsWith('usr_')
    ? guestId
    : `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newUser: StoredUser = {
    id: userId,
    username: cleanUsername,
    nickname: cleanUsername,
    passwordHash,
    salt,
    contactEmail: contactEmail?.trim() || undefined,
    role,
    isGuest: false,
    xp: 100,
    level: 1,
    createdAt: now,
    updatedAt: now,
  };

  const all = getAllUsers();
  all.push(newUser);
  memoryUsers.set(cleanUsername.toLowerCase(), newUser);
  saveAllUsers(all);

  const profile: UserProfile = {
    id: newUser.id,
    username: newUser.username,
    nickname: newUser.nickname,
    contactEmail: newUser.contactEmail,
    role: newUser.role,
    isGuest: false,
    xp: newUser.xp,
    level: newUser.level,
    createdAt: newUser.createdAt,
  };

  return { success: true, user: profile };
}

export function authenticateUser(
  username: string,
  pass: string
): { success: boolean; user?: UserProfile; error?: string } {
  const cleanUsername = username.trim();
  if (!cleanUsername || !pass) {
    return { success: false, error: 'Username and password are required' };
  }

  const user = findUserByUsername(cleanUsername);
  if (!user) {
    return { success: false, error: 'Invalid username or password' };
  }

  const computedHash = hashPassword(pass, user.salt);
  const bufA = Buffer.from(computedHash, 'hex');
  const bufB = Buffer.from(user.passwordHash, 'hex');

  if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
    return { success: false, error: 'Invalid username or password' };
  }

  const profile: UserProfile = {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    contactEmail: user.contactEmail,
    role: user.role,
    isGuest: false,
    xp: user.xp,
    level: user.level,
    createdAt: user.createdAt,
  };

  return { success: true, user: profile };
}

export function updateUserProfile(
  userId: string,
  updates: {
    nickname?: string;
    contactEmail?: string;
    newPassword?: string;
  }
): { success: boolean; user?: UserProfile; error?: string } {
  const all = getAllUsers();
  const user = all.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (updates.nickname && updates.nickname.trim()) {
    user.nickname = updates.nickname.trim();
  }
  if (updates.contactEmail !== undefined) {
    user.contactEmail = updates.contactEmail.trim() || undefined;
  }
  if (updates.newPassword && updates.newPassword.length >= 4) {
    const salt = crypto.randomBytes(16).toString('hex');
    user.salt = salt;
    user.passwordHash = hashPassword(updates.newPassword, salt);
  }
  user.updatedAt = new Date().toISOString();

  memoryUsers.set(user.username.toLowerCase(), user);
  saveAllUsers(all);

  const profile: UserProfile = {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    contactEmail: user.contactEmail,
    role: user.role,
    isGuest: user.isGuest,
    xp: user.xp,
    level: user.level,
    createdAt: user.createdAt,
  };

  return { success: true, user: profile };
}


