'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '@matric/shared-types';
import { generateGuestNickname, generateSuperheroNickname } from '@matric/shared-utils';
import { offlineDb } from '../lib/offline/db';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  loginAsGuest: (customNickname?: string) => Promise<void>;
  loginWithPassword: (username: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerPermanent: (username: string, pass: string, contactEmail?: string) => Promise<{ success: boolean; error?: string }>;
  convertGuestToPermanent: (username: string, pass: string, contactEmail?: string) => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (updates: { nickname?: string; contactEmail?: string; newPassword?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'matric_tracker_user_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local session
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed reading session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsGuest = async (customNickname?: string) => {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nickname = customNickname?.trim() || generateSuperheroNickname();
    const guestUser: UserProfile = {
      id: guestId,
      username: guestId,
      nickname,
      role: 'student',
      isGuest: true,
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
    setUser(guestUser);
  };

  const loginWithPassword = async (username: string, pass: string) => {
    if (!username.trim()) {
      return { success: false, error: 'Username is required' };
    }
    if (!pass) {
      return { success: false, error: 'Password is required' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username: username.trim(),
          password: pass,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Invalid credentials or unauthorized account.',
        };
      }

      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.error('Login request failed', err);
      return { success: false, error: 'Authentication service is unreachable.' };
    }
  };

  const registerPermanent = async (username: string, pass: string, contactEmail?: string) => {
    if (!username.trim()) {
      return { success: false, error: 'Username is required' };
    }
    if (!pass) {
      return { success: false, error: 'Password is required' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          username: username.trim(),
          password: pass,
          contactEmail: contactEmail?.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Registration failed. Check your credentials.',
        };
      }

      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.error('Registration request failed', err);
      return { success: false, error: 'Authentication service is unreachable.' };
    }
  };

  const convertGuestToPermanent = async (username: string, pass: string, contactEmail?: string) => {
    if (!user) {
      return { success: false, error: 'No active guest session found' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'convert',
          username: username.trim(),
          password: pass,
          contactEmail: contactEmail?.trim() || undefined,
          guestId: user.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Conversion failed. Check your credentials.',
        };
      }

      const updatedUser: UserProfile = {
        ...user,
        ...data.user,
        id: data.user.id || user.id,
        isGuest: false,
      };

      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      console.error('Convert account request failed', err);
      return { success: false, error: 'Authentication service is unreachable.' };
    }
  };

  const updateUserProfile = async (updates: { nickname?: string; contactEmail?: string; newPassword?: string }) => {
    if (!user) {
      return { success: false, error: 'No active session' };
    }

    // Guest update: persist directly to localStorage
    if (user.isGuest) {
      const updatedUser: UserProfile = {
        ...user,
        nickname: updates.nickname?.trim() || user.nickname,
        contactEmail: updates.contactEmail?.trim() || user.contactEmail,
      };
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          userId: user.id,
          nickname: updates.nickname,
          contactEmail: updates.contactEmail,
          newPassword: updates.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to update profile' };
      }

      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (e) {
      console.error('Update profile error:', e);
      return { success: false, error: 'Could not connect to profile service' };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
      localStorage.removeItem('matric_demo_cleared');
      // Complete privacy wipe: clear local IndexedDB tables
      await offlineDb.chapterProgress.clear();
      await offlineDb.studySessions.clear();
      await offlineDb.focusSessions.clear();
      await offlineDb.quizAttempts.clear();
      await offlineDb.userPreferences.clear();
      await offlineDb.syncQueue.clear();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('matric:logout'));
      }
    } catch (e) {
      console.warn('Error during logout cache wipe:', e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginAsGuest,
        loginWithPassword,
        registerPermanent,
        convertGuestToPermanent,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
