'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Layers,
  CheckCircle2,
  Circle,
  GraduationCap,
  Plus,
  Sprout,
  LogOut,
  Calendar,
  Timer,
  Award,
  BarChart3,
  FileCode2,
  Settings,
  X,
  LogIn,
  ShieldCheck,
  User,
  Shield,
  RotateCcw,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';
import { useGlass } from '../ui/GlassControls';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  totalUnits: number;
  completedUnits: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  onOpenAdmin?: () => void;
  onClearProgress?: () => void;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  totalUnits,
  completedUnits,
  mobileOpen = false,
  onCloseMobile,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
  onClearProgress,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const { isGlassEnabled, styleTabActive, texts } = useGlass();
  const {
    preferences,
    hideSidebarItem,
    restoreSidebarItem,
  } = usePreferences();

  const [showOthers, setShowOthers] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close expandable user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'all_units', label: 'All units', icon: Layers, badge: totalUnits },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, badge: completedUnits },
    { id: 'not_completed', label: 'Not completed', icon: Circle, badge: Math.max(0, totalUnits - completedUnits) },
    { id: 'study_planner', label: 'Study Planner', icon: Calendar },
    { id: 'focus_mode', label: 'Focus Mode', icon: Timer },
    { id: 'practice', label: 'Practice', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin_curriculum', label: 'JSON Manager', icon: FileCode2 },
  ];

  const visibleItems = navItems.filter(
    (item) => !preferences.sidebarHidden.includes(item.id)
  );
  const hiddenItems = navItems.filter((item) =>
    preferences.sidebarHidden.includes(item.id)
  );

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    onCloseMobile?.();
  };

  const sidebarContent = (
    <div className="w-64 3xl:w-80 flex flex-col justify-between border-r border-line bg-surface h-screen sticky top-0 p-4 3xl:p-6 select-none overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Header with dynamic Admin Texts */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green text-white shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-ink leading-tight">
                {texts.brandName || 'Matric Tracker'}
              </h1>
              <p className="text-2xs text-ink-3">
                {texts.brandSubtitle || 'Your path to exam day'}
              </p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1 text-ink-3 hover:text-ink transition-colors cursor-pointer"
              aria-label="Close navigation drawer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Section: Workspace with Liquid Glass Bubble Tabs */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 text-3xs font-semibold uppercase tracking-wider text-ink-3">
            <span>Workspace</span>
            <span className="text-3xs text-ink-3/70">Navigation</span>
          </div>

          <div className="space-y-0.5 pt-1 relative">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="group relative flex items-center justify-between rounded-xl">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    onClick={() => handleTabClick(item.id)}
                    className={`relative z-10 flex flex-1 items-center justify-between px-2.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                      isActive ? 'text-ink font-semibold' : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    {/* iPhone-like liquid bubble morphing active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActiveBubble"
                        style={isGlassEnabled ? styleTabActive : undefined}
                        className={`absolute inset-0 rounded-xl pointer-events-none -z-10 ${
                          !isGlassEnabled
                            ? 'bg-surface-2 text-ink shadow-xs border border-line/80'
                            : ''
                        }`}
                        transition={{
                          type: 'spring',
                          stiffness: 350,
                          damping: 30,
                          mass: 0.8,
                        }}
                      />
                    )}

                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-green' : 'text-ink-3'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-2xs tabular-nums font-normal ${isActive ? 'text-green font-semibold' : 'text-ink-3'}`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.button>

                  {/* Hide option */}
                  <button
                    type="button"
                    onClick={() => hideSidebarItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-ink-3 hover:text-ink transition-opacity text-3xs cursor-pointer z-20"
                    title="Hide item"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {/* Hidden items drawer toggle */}
          {hiddenItems.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowOthers(!showOthers)}
                className="w-full text-left px-2 py-1 text-3xs text-ink-3 hover:text-ink cursor-pointer"
              >
                + {hiddenItems.length} hidden item(s)
              </button>
              {showOthers && (
                <div className="space-y-1 pl-2">
                  {hiddenItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => restoreSidebarItem(item.id)}
                      className="block text-2xs text-ink-2 hover:text-green cursor-pointer"
                    >
                      + Restore {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Grade Quick Jump with Liquid Bubble */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 text-3xs font-semibold uppercase tracking-wider text-ink-3">
            <span>Grades</span>
            <button
              type="button"
              onClick={() => handleTabClick('all_units')}
              className="text-ink-3 hover:text-ink cursor-pointer"
              title="All units"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-0.5 pt-1 text-xs relative">
            {[9, 10, 11, 12].map((g) => {
              const isGradeActive = activeTab === `grade_${g}`;
              return (
                <div key={g} className="relative">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    onClick={() => handleTabClick(`grade_${g}`)}
                    className={`relative z-10 w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition-all cursor-pointer ${
                      isGradeActive
                        ? 'text-ink font-semibold'
                        : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    {isGradeActive && (
                      <motion.div
                        layoutId="sidebarGradeActiveBubble"
                        style={isGlassEnabled ? styleTabActive : undefined}
                        className={`absolute inset-0 rounded-xl pointer-events-none -z-10 ${
                          !isGlassEnabled ? 'bg-surface-2 border border-line shadow-xs' : ''
                        }`}
                        transition={{
                          type: 'spring',
                          stiffness: 350,
                          damping: 30,
                          mass: 0.8,
                        }}
                      />
                    )}
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className={`h-3.5 w-3.5 ${isGradeActive ? 'text-green' : 'text-ink-3'}`} />
                      <span>Grade {g}</span>
                    </div>
                    {g === 12 && (
                      <span className="rounded-full bg-green/10 px-1.5 py-0.2 text-3xs font-semibold text-green">
                        National
                      </span>
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Area with Motivation & Bottom-Left Expandable Profile Section */}
      <div className="space-y-3 pt-4 border-t border-line">
        {/* Dynamic Motivation Card */}
        <div className="rounded-2xl border border-line bg-surface-2/50 p-3.5">
          <div className="flex items-center gap-1.5 text-green text-xs font-semibold">
            <Sprout className="h-3.5 w-3.5" />
            <span>{texts.mottoTitle || 'Small steps. Big progress.'}</span>
          </div>
          <p className="mt-1 text-3xs text-ink-3 leading-relaxed">
            {texts.mottoSubtitle || "One unit at a time, you're building a stronger foundation."}
          </p>
        </div>

        {/* User Account Button with Upward Expandable Popover */}
        {user ? (
          <div className="relative" ref={userMenuRef}>
            {/* Popover Menu Floating Upward */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                  className={`absolute bottom-full mb-2 left-0 right-0 z-50 rounded-2xl p-1.5 shadow-xl border overflow-hidden ${
                    isGlassEnabled
                      ? 'bg-surface/90 backdrop-blur-xl border-white/20 dark:border-white/10'
                      : 'bg-surface border-line'
                  }`}
                >
                  <div className="px-3 py-2 border-b border-line/60">
                    <div className="text-xs font-bold text-ink truncate">
                      {user.nickname || user.username}
                    </div>
                    <div className="text-3xs text-ink-3">
                      {user.isGuest ? 'Guest Session' : user.role === 'admin' ? 'Administrator' : 'Registered Student'}
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5">
                    {/* Item 1: My Profile */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenProfile?.();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink rounded-xl hover:bg-surface-2 transition-colors cursor-pointer text-left"
                    >
                      <User className="h-4 w-4 text-green" />
                      <span>My Profile</span>
                    </button>

                    {/* Item 2: Admin Portal (Visible for Admin Vixy or any admin) */}
                    {(user.role === 'admin' || user.username.toLowerCase() === 'vixy') && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenAdmin?.();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-purple-600 rounded-xl hover:bg-purple-500/10 transition-colors cursor-pointer text-left"
                      >
                        <Shield className="h-4 w-4 text-purple-600" />
                        <span>Admin Super Portal</span>
                      </button>
                    )}

                    {/* Item 3: Clear Progress (Moved from top-right) */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onClearProgress?.();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink-2 rounded-xl hover:bg-amber-500/10 hover:text-amber-600 transition-colors cursor-pointer text-left"
                    >
                      <RotateCcw className="h-4 w-4 text-amber-500" />
                      <span>Clear Progress (0%)</span>
                    </button>

                    {/* Item 4: Sign Out & Privacy Wipe */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-500 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      <span>Sign Out (Wipe Cache)</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom-left user trigger button: displays username only and guest badge if guest */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between rounded-xl p-2.5 border transition-all cursor-pointer ${
                userMenuOpen
                  ? 'border-green bg-surface-2 ring-2 ring-green/20'
                  : 'border-line bg-canvas hover:bg-surface-2'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green text-xs font-semibold text-white shadow-xs">
                  {user.nickname?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'S'}
                </div>
                <div className="truncate text-left">
                  <div className="text-xs font-semibold text-ink truncate">
                    {user.nickname || user.username}
                  </div>
                  {user.isGuest && (
                    <div className="text-3xs text-amber-600 font-semibold truncate">
                      Guest
                    </div>
                  )}
                </div>
              </div>

              <ChevronUp
                className={`h-4 w-4 text-ink-3 transition-transform duration-200 ${
                  userMenuOpen ? 'rotate-180 text-green' : ''
                }`}
              />
            </motion.button>
          </div>
        ) : (
          <div className="rounded-xl border border-line bg-canvas/60 p-2.5 space-y-2">
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-green px-3 py-2 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign in / Register</span>
            </button>
            <div className="flex items-center justify-center gap-1.5 text-3xs text-ink-3 pt-0.5">
              <svg className="h-3 w-3 text-[#F38020]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
              </svg>
              <span>Cloudflare Turnstile protected</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Pinned Sidebar */}
      <aside className="hidden md:flex shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative flex flex-col w-64 max-w-xs bg-surface shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
