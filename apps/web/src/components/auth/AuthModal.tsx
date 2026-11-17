'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Lock, Mail, ShieldAlert, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, loginAsGuest, loginWithPassword, registerPermanent, convertGuestToPermanent } = useAuth();
  const [tab, setTab] = useState<'guest' | 'login' | 'register' | 'convert'>(user?.isGuest ? 'convert' : 'guest');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGuestLogin = async () => {
    await loginAsGuest();
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await loginWithPassword(username, password);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to login');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await registerPermanent(username, password, contactEmail);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to register');
    }
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await convertGuestToPermanent(username, password, contactEmail);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to convert account');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl border border-line">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-ink-3 hover:text-ink transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 id="auth-modal-title" className="text-xl font-semibold text-ink">
          Account & Access
        </h2>
        <p className="mt-0.5 text-xs text-ink-3">
          Prepare for the Grade 12 National Exam with cloud-backed progress.
        </p>

        {/* Tab switchers */}
        <div className="mt-4 flex rounded-xl border border-line bg-canvas p-1 text-xs">
          {!user?.isGuest && (
            <button
              type="button"
              onClick={() => setTab('guest')}
              className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
                tab === 'guest' ? 'bg-surface text-ink shadow-xs border border-line/60' : 'text-ink-3 hover:text-ink'
              }`}
            >
              Guest
            </button>
          )}
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
              tab === 'login' ? 'bg-surface text-ink shadow-xs border border-line/60' : 'text-ink-3 hover:text-ink'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
              tab === 'register' ? 'bg-surface text-ink shadow-xs border border-line/60' : 'text-ink-3 hover:text-ink'
            }`}
          >
            Register
          </button>
          {user?.isGuest && (
            <button
              type="button"
              onClick={() => setTab('convert')}
              className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
                tab === 'convert' ? 'bg-surface text-green shadow-xs border border-line/60 font-semibold' : 'text-green hover:underline'
              }`}
            >
              Convert
            </button>
          )}
        </div>

        {error && (
          <div
            id="auth-error-desc"
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50/70 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* 1. Guest Access */}
        {tab === 'guest' && (
          <div className="mt-5 space-y-4 text-center">
            <div className="rounded-xl border border-line bg-canvas p-4 text-left space-y-2 text-xs text-ink-2">
              <div className="flex items-center gap-1.5 font-medium text-ink">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                <span>Instant Guest Profile</span>
              </div>
              <p className="text-3xs text-ink-3 leading-relaxed">
                Generates a secure, human-readable nickname (e.g. QuietFalcon42). You can study, track curriculum chapters, and take quizzes immediately.
              </p>
              <div className="flex items-start gap-1.5 text-3xs text-amber-700 dark:text-amber-300 pt-1">
                <ShieldAlert className="h-3 w-3 shrink-0 mt-0.5" />
                <span>Clearing browser cookies without converting to a permanent account can result in loss of access.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full rounded-xl bg-green px-4 py-2.5 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs"
            >
              Continue as Guest
            </button>
          </div>
        )}

        {/* 2. Sign In */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="login-username" className="block text-xs font-medium text-ink-2 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-describedby={error ? 'auth-error-desc' : undefined}
                  className="w-full rounded-lg border border-line bg-canvas pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-ink-2 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby={error ? 'auth-error-desc' : undefined}
                  className="w-full rounded-lg border border-line bg-canvas pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <p className="text-3xs text-ink-3">
              Note: Forgotten passwords currently cannot be reset through self-service. Please store credentials safely.
            </p>

            <button
              type="submit"
              className="w-full rounded-xl bg-green px-4 py-2.5 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs"
            >
              Sign in to Account
            </button>
          </form>
        )}

        {/* 3. Register Permanent */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="reg-username" className="block text-xs font-medium text-ink-2 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
                <input
                  id="reg-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-describedby={error ? 'auth-error-desc' : undefined}
                  className="w-full rounded-lg border border-line bg-canvas pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Choose a unique username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-medium text-ink-2 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby={error ? 'auth-error-desc' : undefined}
                  className="w-full rounded-lg border border-line bg-canvas pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-medium text-ink-2 mb-1.5">
                Optional Contact Email (for updates)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
                <input
                  id="reg-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  aria-describedby={error ? 'auth-error-desc' : undefined}
                  className="w-full rounded-lg border border-line bg-canvas pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="student@example.com (optional)"
                />
              </div>
            </div>

            <p className="text-3xs text-ink-3">
              Your account identity is tied to your username.
            </p>

            <button
              type="submit"
              className="w-full rounded-xl bg-green px-4 py-2.5 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs"
            >
              Create Account
            </button>
          </form>
        )}

        {/* 4. Convert Guest to Permanent */}
        {tab === 'convert' && (
          <form onSubmit={handleConvertSubmit} className="mt-5 space-y-4">
            <div className="rounded-xl border border-line bg-canvas p-3 text-xs text-ink-2">
              <span className="font-semibold text-ink">Convert Profile</span>
              <p className="mt-1 text-3xs text-ink-3 leading-relaxed">
                All your tracked chapters, focus sessions, and quiz achievements will be transferred to your new permanent credentials.
              </p>
            </div>

            <div>
              <label htmlFor="conv-username" className="block text-xs font-medium text-ink-2 mb-1.5">
                New Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
                <input
                  id="conv-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-describedby={error ? 'auth-error-desc' : undefined}
                  className="w-full rounded-lg border border-line bg-canvas pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Choose permanent username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="conv-password" className="block text-xs font-medium text-ink-2 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
                <input
                  id="conv-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby={error ? 'auth-error-desc' : undefined}
                  className="w-full rounded-lg border border-line bg-canvas pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="conv-email" className="block text-xs font-medium text-ink-2 mb-1.5">
                Optional Contact Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
                <input
                  id="conv-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  aria-describedby={error ? 'auth-error-desc' : undefined}
                  className="w-full rounded-lg border border-line bg-canvas pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="student@example.com (optional)"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-green px-4 py-2.5 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs"
            >
              Save & Permanently Link Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
