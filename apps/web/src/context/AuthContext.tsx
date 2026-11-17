'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '@matric/shared-types';
import { generateGuestNickname } from '@matric/shared-utils';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  loginAsGuest: () => Promise<void>;
  loginWithPassword: (username: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerPermanent: (username: string, pass: string, contactEmail?: string) => Promise<{ success: boolean; error?: string }>;
  convertGuestToPermanent: (username: string, pass: string, contactEmail?: string) => Promise<{ success: boolean; error?: string }>;
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

  const loginAsGuest = async () => {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nickname = generateGuestNickname();
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

  const loginWithPassword = async (username: string, _pass: string) => {
    if (!username.trim()) {
      return { success: false, error: 'Username is required' };
    }
    // Simulate / fetch verified account
    const registeredUser: UserProfile = {
      id: `usr_${username.toLowerCase()}`,
      username,
      nickname: username,
      role: username === 'admin' ? 'admin' : 'student',
      isGuest: false,
      xp: 150,
      level: 2,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(registeredUser));
    setUser(registeredUser);
    return { success: true };
  };

  const registerPermanent = async (username: string, _pass: string, contactEmail?: string) => {
    if (!username.trim()) {
      return { success: false, error: 'Username is required' };
    }

    const newUser: UserProfile = {
      id: `usr_${username.toLowerCase()}`,
      username,
      nickname: username,
      contactEmail,
      role: 'student',
      isGuest: false,
      xp: 50,
      level: 1,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const convertGuestToPermanent = async (username: string, _pass: string, contactEmail?: string) => {
    if (!user) {
      return { success: false, error: 'No active guest session found' };
    }

    const updatedUser: UserProfile = {
      ...user,
      username,
      nickname: username,
      contactEmail,
      isGuest: false,
    };

    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(GUEST_STORAGE_KEY);
    setUser(null);
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
