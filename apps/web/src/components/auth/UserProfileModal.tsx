'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Shield,
  Award,
  Sparkles,
  Zap,
  Mail,
  Lock,
  LogOut,
  Save,
  CheckCircle2,
  Clock,
  Layers,
  Dices,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurriculum } from '../../context/CurriculumContext';
import { useGlass } from '../ui/GlassControls';
import { generateSuperheroNickname } from '@matric/shared-utils';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConvert?: () => void;
}

export function UserProfileModal({
  isOpen,
  onClose,
  onOpenConvert,
}: UserProfileModalProps) {
  const { user, updateUserProfile, logout } = useAuth();
  const { completedUnitsCount, completedChaptersCount } = useCurriculum();
  const { isGlassEnabled, styleCard } = useGlass();

  const [nickname, setNickname] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || user.username || '');
      setContactEmail(user.contactEmail || '');
      setNewPassword('');
      setConfirmPassword('');
      setStatusMessage(null);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const userXp = (user.xp || 100) + (completedChaptersCount * 25);
  const userLevel = Math.max(1, Math.floor(userXp / 150));
  const getLevelTitle = (lvl: number) => {
    if (lvl >= 5) return 'EUEE National Champion';
    if (lvl >= 4) return 'Distinction Scholar';
    if (lvl >= 3) return 'Master of Units';
    if (lvl >= 2) return 'Cadet Scholar';
    return 'Matric Novice';
  };

  const handleRandomizeNickname = () => {
    const randomHero = generateSuperheroNickname();
    setNickname(randomHero);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword && newPassword.length < 4) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 4 characters long' });
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateUserProfile({
        nickname: nickname.trim(),
        contactEmail: contactEmail.trim() || undefined,
        newPassword: newPassword ? newPassword : undefined,
      });

      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setStatusMessage(null);
        }, 3000);
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to update profile' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          style={isGlassEnabled ? styleCard : undefined}
          className={`w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl ${
            isGlassEnabled ? 'bg-surface/90 border border-white/20' : 'bg-surface border border-line'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line p-5 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green text-white shadow-xs font-semibold text-lg">
                {nickname?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-ink truncate max-w-[200px]">
                    {nickname || user.username}
                  </h2>
                  {user.isGuest ? (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-3xs font-semibold text-amber-600 border border-amber-500/20">
                      Guest
                    </span>
                  ) : user.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-3xs font-semibold text-purple-600 border border-purple-500/20">
                      <Shield className="h-2.5 w-2.5" /> Admin
                    </span>
                  ) : (
                    <span className="rounded-full bg-green/10 px-2 py-0.5 text-3xs font-semibold text-green border border-green/20">
                      Student
                    </span>
                  )}
                </div>
                <p className="text-2xs text-ink-3">Level {userLevel} · {getLevelTitle(userLevel)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Achievement & Stats Pill */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl bg-surface-2/60 p-3.5 border border-line/60">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-ink-3 text-3xs font-semibold uppercase tracking-wider">
                  <Zap className="h-3 w-3 text-amber-500" />
                  <span>Total XP</span>
                </div>
                <div className="mt-1 text-lg font-bold text-ink tabular-nums">{userXp}</div>
                <div className="text-3xs text-ink-3">Points earned</div>
              </div>

              <div className="text-center border-x border-line/60">
                <div className="flex items-center justify-center gap-1 text-ink-3 text-3xs font-semibold uppercase tracking-wider">
                  <Layers className="h-3 w-3 text-green" />
                  <span>Units</span>
                </div>
                <div className="mt-1 text-lg font-bold text-ink tabular-nums">{completedUnitsCount}</div>
                <div className="text-3xs text-ink-3">Completed</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-ink-3 text-3xs font-semibold uppercase tracking-wider">
                  <Award className="h-3 w-3 text-purple-500" />
                  <span>Chapters</span>
                </div>
                <div className="mt-1 text-lg font-bold text-ink tabular-nums">{completedChaptersCount}</div>
                <div className="text-3xs text-ink-3">Mastered</div>
              </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium ${
                  statusMessage.type === 'success'
                    ? 'bg-green/10 text-green border border-green/30'
                    : 'bg-red-500/10 text-red-500 border border-red-500/30'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{statusMessage.text}</span>
              </motion.div>
            )}

            {/* Profile Edit Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                  Superhero Nickname / Handle
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-ink-3" />
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                      placeholder="e.g. Iron Heart, Spider-Gwen"
                      className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-xs text-ink placeholder:text-ink-3/50 focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
                    />
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRandomizeNickname}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-2 text-ink-2 hover:text-green hover:bg-line border border-line/70 text-2xs font-semibold transition-all cursor-pointer shadow-xs"
                    title="Generate random Marvel/DC superhero nickname"
                  >
                    <Dices className="h-3.5 w-3.5 text-green" />
                    <span>Randomize</span>
                  </motion.button>
                </div>
              </div>

              {!user.isGuest && (
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                    Contact Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-ink-3" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-xs text-ink placeholder:text-ink-3/50 focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
                    />
                  </div>
                </div>
              )}

              {!user.isGuest && (
                <div className="pt-2 border-t border-line/60 space-y-3">
                  <div className="text-2xs font-semibold uppercase tracking-wider text-ink-3">
                    Change Password (Optional)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password (min 4)"
                        className="w-full rounded-xl border border-line bg-surface py-2 pl-8 pr-3 text-xs text-ink placeholder:text-ink-3/50 focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full rounded-xl border border-line bg-surface py-2 pl-8 pr-3 text-xs text-ink placeholder:text-ink-3/50 focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3">
                <motion.button
                  type="submit"
                  disabled={isSaving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-green py-2.5 text-xs font-semibold text-white hover:bg-green-dark transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </motion.button>
              </div>
            </form>

            {/* Guest Conversion CTA */}
            {user.isGuest && onOpenConvert && (
              <div className="rounded-2xl border border-green/30 bg-green/10 p-4 space-y-2">
                <div className="flex items-center gap-2 text-green text-xs font-bold">
                  <Sparkles className="h-4 w-4" />
                  <span>Save Progress to Permanent Account</span>
                </div>
                <p className="text-2xs text-ink-2 leading-relaxed">
                  Convert your guest session to keep your study sessions, checkmarks, and streaks safe across devices.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenConvert();
                  }}
                  className="w-full py-2 rounded-xl bg-green text-white font-semibold text-xs hover:bg-green-dark transition-colors cursor-pointer shadow-xs"
                >
                  Convert to Permanent Account
                </button>
              </div>
            )}

            {/* Sign Out Action with Cache Wipe */}
            <div className="pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 py-2 text-xs font-medium transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out & Privacy Cache Wipe</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
