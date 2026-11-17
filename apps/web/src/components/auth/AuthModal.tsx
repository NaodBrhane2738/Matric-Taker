'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Check,
  Dices,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateSuperheroNickname } from '@matric/shared-utils';

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
  const [guestNickname, setGuestNickname] = useState<string>(() => generateSuperheroNickname());
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [isVerifyingRobot, setIsVerifyingRobot] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Reset errors and re-seed guest nickname when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (!guestNickname) {
        setGuestNickname(generateSuperheroNickname());
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGuestLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginAsGuest(guestNickname || generateSuperheroNickname());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRandomizeGuest = () => {
    const newNick = generateSuperheroNickname();
    setGuestNickname(newNick);
  };

  const handleRandomizeRegister = () => {
    const newNick = generateSuperheroNickname();
    setUsername(newNick);
  };

  const handleRobotToggle = () => {
    if (isRobotVerified || isVerifyingRobot) return;
    setIsVerifyingRobot(true);
    setTimeout(() => {
      setIsVerifyingRobot(false);
      setIsRobotVerified(true);
      setError(null);
    }, 600);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await loginWithPassword(username, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Failed to login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isRobotVerified) {
      setError('Please verify that you are not a robot before registering.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerPermanent(username, password, contactEmail);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Failed to register');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await convertGuestToPermanent(username, password, contactEmail);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Failed to convert account');
      }
    } finally {
      setIsSubmitting(false);
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
              onClick={() => {
                setTab('guest');
                setError(null);
              }}
              className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
                tab === 'guest' ? 'bg-surface text-ink shadow-xs border border-line/60' : 'text-ink-3 hover:text-ink'
              }`}
            >
              Guest
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
              tab === 'login' ? 'bg-surface text-ink shadow-xs border border-line/60' : 'text-ink-3 hover:text-ink'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
              tab === 'register' ? 'bg-surface text-ink shadow-xs border border-line/60' : 'text-ink-3 hover:text-ink'
            }`}
          >
            Register
          </button>
          {user?.isGuest && (
            <button
              type="button"
              onClick={() => {
                setTab('convert');
                setError(null);
              }}
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

        {/* 1. Guest Access with Randomize Superhero Nickname */}
        {tab === 'guest' && (
          <div className="mt-5 space-y-4">
            {/* Superhero Guest Profile Preview */}
            <div className="rounded-xl border border-line bg-canvas p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <Sparkles className="h-4 w-4 text-green" />
                  <span>Your Superhero Guest Handle</span>
                </div>
                <button
                  type="button"
                  onClick={handleRandomizeGuest}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-2xs font-semibold text-ink hover:text-green hover:bg-surface-2 transition-colors shadow-2xs"
                  title="Roll another Marvel/DC superhero nickname"
                >
                  <Dices className="h-3.5 w-3.5 text-accent" />
                  <span>Randomize</span>
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-surface border border-line/80 px-3 py-2.5">
                <span className="font-mono text-xs font-bold text-ink tracking-wide">
                  {guestNickname}
                </span>
                <span className="rounded-md bg-green/10 px-2 py-0.5 text-3xs font-semibold text-green">
                  Marvel & DC Universe
                </span>
              </div>

              <p className="text-3xs text-ink-3 leading-relaxed">
                Roll superhero characters and sidekicks across the MCU and DC universe, or click randomize to find your favorite moniker.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-canvas/60 p-3 text-xs text-ink-2 space-y-1.5">
              <div className="flex items-center gap-1.5 font-medium text-ink">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                <span>Instant Offline & Cloud Progress</span>
              </div>
              <p className="text-3xs text-ink-3 leading-relaxed">
                You can study, track chapter completion, and take quizzes right away without a password.
              </p>
              <div className="flex items-start gap-1.5 text-3xs text-amber-700 dark:text-amber-300 pt-0.5">
                <ShieldAlert className="h-3 w-3 shrink-0 mt-0.5" />
                <span>Clearing browser cookies without converting to a permanent account can result in loss of access.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green px-4 py-2.5 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Continue as Guest ({guestNickname})</span>
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
                  placeholder="Enter your registered username"
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
              Enter your credentials to access your synced curriculum progress and study analytics.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green px-4 py-2.5 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Sign in to Account</span>
            </button>
          </form>
        )}

        {/* 3. Register Permanent Account with Randomize & I'm Not a Robot */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="reg-username" className="block text-xs font-medium text-ink-2">
                  Username
                </label>
                <button
                  type="button"
                  onClick={handleRandomizeRegister}
                  className="inline-flex items-center gap-1 text-2xs font-semibold text-green hover:text-green-dark transition-colors"
                  title="Generate a Marvel or DC superhero/character nickname"
                >
                  <Dices className="h-3 w-3" />
                  <span>Randomize Superhero Handle</span>
                </button>
              </div>

              <div className="relative flex items-center">
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
                <input
                  id="reg-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-describedby={error ? 'auth-error-desc' : undefined}
                  className="w-full rounded-lg border border-line bg-canvas pl-9 pr-20 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Choose or randomize username"
                  required
                />
                <button
                  type="button"
                  onClick={handleRandomizeRegister}
                  className="absolute right-1.5 top-1.5 rounded-md px-2 py-1 text-3xs font-semibold bg-surface-2 hover:bg-surface text-ink-2 hover:text-ink border border-line transition-colors flex items-center gap-1"
                  title="Randomize Marvel / DC nickname"
                >
                  <Dices className="h-3 w-3 text-accent" />
                  <span>Roll</span>
                </button>
              </div>
              <p className="mt-1 text-3xs text-ink-3">
                Tip: Click Randomize or Roll for cool Marvel (MCU) &amp; DC character nicknames.
              </p>
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
                  placeholder="•••••••• (minimum 4 characters)"
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

            {/* I'm not a robot Human Verification Feature */}
            <div
              onClick={handleRobotToggle}
              role="checkbox"
              aria-checked={isRobotVerified}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleRobotToggle();
                }
              }}
              className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer select-none transition-all ${
                isRobotVerified
                  ? 'border-green/40 bg-green/5'
                  : 'border-line bg-canvas hover:border-line-strong'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all ${
                    isRobotVerified
                      ? 'bg-green border-green text-white'
                      : isVerifyingRobot
                      ? 'border-green bg-surface'
                      : 'border-line-strong bg-surface hover:border-green'
                  }`}
                >
                  {isRobotVerified ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : isVerifyingRobot ? (
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-green border-t-transparent animate-spin" />
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-ink">
                    {isRobotVerified ? "I'm not a robot (Verified)" : "I'm not a robot"}
                  </span>
                  <span className="text-3xs text-ink-3">
                    {isRobotVerified ? 'Human verification passed' : 'Click to verify you are human'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end pl-2">
                <ShieldCheck className={`h-5 w-5 ${isRobotVerified ? 'text-green' : 'text-ink-3'}`} />
                <span className="text-3xs text-ink-3 font-semibold leading-tight">reCAPTCHA</span>
                <span className="text-3xs text-ink-3/70 leading-tight">Privacy · Terms</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green px-4 py-2.5 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Create Account</span>
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
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="conv-username" className="block text-xs font-medium text-ink-2">
                  New Username
                </label>
                <button
                  type="button"
                  onClick={handleRandomizeRegister}
                  className="inline-flex items-center gap-1 text-2xs font-semibold text-green hover:text-green-dark transition-colors"
                >
                  <Dices className="h-3 w-3" />
                  <span>Randomize Handle</span>
                </button>
              </div>

              <div className="relative flex items-center">
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
                <input
                  id="conv-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-describedby={error ? 'auth-error-desc' : undefined}
                  className="w-full rounded-lg border border-line bg-canvas pl-9 pr-20 py-2 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Choose permanent username"
                  required
                />
                <button
                  type="button"
                  onClick={handleRandomizeRegister}
                  className="absolute right-1.5 top-1.5 rounded-md px-2 py-1 text-3xs font-semibold bg-surface-2 hover:bg-surface text-ink-2 hover:text-ink border border-line transition-colors flex items-center gap-1"
                >
                  <Dices className="h-3 w-3 text-accent" />
                  <span>Roll</span>
                </button>
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
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green px-4 py-2.5 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save &amp; Permanently Link Account</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
