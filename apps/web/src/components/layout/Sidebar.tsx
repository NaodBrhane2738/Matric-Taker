'use client';

import React, { useState } from 'react';
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
  Sun,
  Moon,
  Globe,
  Settings,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  totalUnits: number;
  completedUnits: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  totalUnits,
  completedUnits,
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const {
    preferences,
    toggleTheme,
    setLanguage,
    hideSidebarItem,
    restoreSidebarItem,
    resetSidebarLayout,
  } = usePreferences();

  const [showOthers, setShowOthers] = useState(false);

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
    <div className="w-64 flex flex-col justify-between border-r border-line bg-surface h-screen sticky top-0 p-4 select-none overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green text-white shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-ink leading-tight">Matric Tracker</h1>
              <p className="text-2xs text-ink-3">Your path to exam day</p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1 text-ink-3 hover:text-ink transition-colors"
              aria-label="Close navigation drawer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Section: Workspace */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 text-3xs font-semibold uppercase tracking-wider text-ink-3">
            <span>Workspace</span>
            <span className="text-3xs text-ink-3/70">Navigation</span>
          </div>

          <div className="space-y-0.5 pt-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="group flex items-center justify-between rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`flex flex-1 items-center justify-between px-2.5 py-2 text-xs font-medium rounded-xl transition-colors ${
                      isActive
                        ? 'bg-surface-2 text-ink shadow-xs border border-line/80'
                        : 'text-ink-2 hover:bg-surface-2/60 hover:text-ink'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-green' : 'text-ink-3'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-2xs text-ink-3 tabular-nums font-normal">
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Hide option */}
                  <button
                    type="button"
                    onClick={() => hideSidebarItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-ink-3 hover:text-ink transition-opacity text-3xs"
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
                className="w-full text-left px-2 py-1 text-3xs text-ink-3 hover:text-ink"
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
                      className="block text-2xs text-ink-2 hover:text-green"
                    >
                      + Restore {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Grade Quick Jump */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 text-3xs font-semibold uppercase tracking-wider text-ink-3">
            <span>Grades</span>
            <button
              type="button"
              onClick={() => handleTabClick('all_units')}
              className="text-ink-3 hover:text-ink"
              title="All units"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-0.5 pt-1 text-xs">
            {[9, 10, 11, 12].map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => handleTabClick(`grade_${g}`)}
                className={`w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition-colors ${
                  activeTab === `grade_${g}`
                    ? 'bg-surface-2 text-ink font-medium border border-line'
                    : 'text-ink-2 hover:bg-surface-2/60 hover:text-ink'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="h-3.5 w-3.5 text-ink-3" />
                  <span>Grade {g}</span>
                </div>
                {g === 12 && (
                  <span className="rounded-full bg-green/10 px-1.5 py-0.2 text-3xs font-semibold text-green">
                    National
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="space-y-3 pt-4 border-t border-line">
        {/* Motivation Card */}
        <div className="rounded-2xl border border-line bg-surface-2/50 p-3.5">
          <div className="flex items-center gap-1.5 text-green text-xs font-semibold">
            <Sprout className="h-3.5 w-3.5" />
            <span>Small steps. Big progress.</span>
          </div>
          <p className="mt-1 text-3xs text-ink-3 leading-relaxed">
            One unit at a time, you&apos;re building a stronger foundation.
          </p>
        </div>

        {/* User Account Row */}
        <div className="flex items-center justify-between rounded-xl bg-canvas p-2.5 border border-line">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-ink">
              {user?.nickname?.[0] || 'S'}
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-ink truncate">
                {user?.nickname || 'Student'}
              </div>
              <div className="text-3xs text-ink-3 truncate">
                {user?.isGuest ? 'Guest profile' : 'Permanent account'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="text-ink-3 hover:text-red-500 transition-colors p-1"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
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
