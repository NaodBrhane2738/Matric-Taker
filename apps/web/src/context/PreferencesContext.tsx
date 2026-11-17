'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserPreferences } from '@matric/shared-types';

export const DEFAULT_SIDEBAR_ORDER = [
  'overview',
  'all_units',
  'completed',
  'not_completed',
  'study_planner',
  'focus_mode',
  'practice',
  'analytics',
  'admin_curriculum',
];

interface PreferencesContextType {
  preferences: UserPreferences;
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'am') => void;
  setCalendar: (cal: 'gregorian' | 'ethiopian') => void;
  isSidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;
  pinSidebarItem: (itemId: string) => void;
  unpinSidebarItem: (itemId: string) => void;
  hideSidebarItem: (itemId: string) => void;
  restoreSidebarItem: (itemId: string) => void;
  reorderSidebarItems: (newOrder: string[]) => void;
  resetSidebarLayout: () => void;
}

const PREF_STORAGE_KEY = 'matric_tracker_user_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  userId: 'local',
  language: 'en',
  calendarPreference: 'gregorian',
  theme: 'light',
  sidebarPinned: DEFAULT_SIDEBAR_ORDER,
  sidebarHidden: [],
  sidebarOrder: DEFAULT_SIDEBAR_ORDER,
  dailyStudyGoalMinutes: 120,
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREF_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences((prev) => ({ ...prev, ...parsed }));
        if (parsed.theme) {
          document.documentElement.setAttribute('data-theme', parsed.theme);
          if (parsed.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
    } catch (e) {
      console.error('Failed reading preferences', e);
    }
  }, []);

  const savePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    try {
      localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify(newPrefs));
    } catch (e) {
      console.error('Failed saving preferences', e);
    }
  };

  const toggleTheme = () => {
    const nextTheme = preferences.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    savePreferences({ ...preferences, theme: nextTheme });
  };

  const setLanguage = (lang: 'en' | 'am') => {
    savePreferences({ ...preferences, language: lang });
  };

  const setCalendar = (cal: 'gregorian' | 'ethiopian') => {
    savePreferences({ ...preferences, calendarPreference: cal });
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const pinSidebarItem = (itemId: string) => {
    if (!preferences.sidebarPinned.includes(itemId)) {
      savePreferences({
        ...preferences,
        sidebarPinned: [...preferences.sidebarPinned, itemId],
      });
    }
  };

  const unpinSidebarItem = (itemId: string) => {
    savePreferences({
      ...preferences,
      sidebarPinned: preferences.sidebarPinned.filter((id) => id !== itemId),
    });
  };

  const hideSidebarItem = (itemId: string) => {
    if (!preferences.sidebarHidden.includes(itemId)) {
      savePreferences({
        ...preferences,
        sidebarHidden: [...preferences.sidebarHidden, itemId],
      });
    }
  };

  const restoreSidebarItem = (itemId: string) => {
    savePreferences({
      ...preferences,
      sidebarHidden: preferences.sidebarHidden.filter((id) => id !== itemId),
    });
  };

  const reorderSidebarItems = (newOrder: string[]) => {
    savePreferences({ ...preferences, sidebarOrder: newOrder });
  };

  const resetSidebarLayout = () => {
    savePreferences({
      ...preferences,
      sidebarPinned: DEFAULT_SIDEBAR_ORDER,
      sidebarHidden: [],
      sidebarOrder: DEFAULT_SIDEBAR_ORDER,
    });
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        toggleTheme,
        setLanguage,
        setCalendar,
        isSidebarCollapsed,
        toggleSidebarCollapse,
        pinSidebarItem,
        unpinSidebarItem,
        hideSidebarItem,
        restoreSidebarItem,
        reorderSidebarItems,
        resetSidebarLayout,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
}
