'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDialKit } from 'dialkit';
import 'dialkit/styles.css';
import { motion } from 'motion/react';
import { Layers, Play, Flame, Award } from 'lucide-react';

export interface GlassControlValues {
  shape: 'pill' | 'rounded' | 'sharp';
  scale: number;
  aberration: number;
  bevelDepth: number;
  frost: number;
  tint: number;
  radius: number;
  accentColor: string;
}

export interface CustomTexts {
  brandName: string;
  brandSubtitle: string;
  mottoTitle: string;
  mottoSubtitle: string;
  prepBannerTitle: string;
  prepBannerSubtitle: string;
}

export const DEFAULT_GLASS_CONTROLS: GlassControlValues = {
  shape: 'pill',
  scale: 48,
  aberration: 14,
  bevelDepth: 37,
  frost: 0.4,
  tint: 0.12,
  radius: 20,
  accentColor: '#16a34a',
};

export const DEFAULT_CUSTOM_TEXTS: CustomTexts = {
  brandName: 'Matric Tracker',
  brandSubtitle: 'Your path to exam day',
  mottoTitle: 'Small steps. Big progress.',
  mottoSubtitle: "One unit at a time, you're building a stronger foundation.",
  prepBannerTitle: 'Ethiopian University Entrance Examination (EUEE)',
  prepBannerSubtitle: 'Interactive curriculum mastery tracking, smart revision schedules, and national exam prep.',
};

export const glassHoverProps = {
  whileHover: { scale: 1.04, y: -2 },
  whileTap: { scale: 0.96 },
  transition: { type: 'spring', stiffness: 420, damping: 25 },
};

export const glassCardHoverProps = {
  whileHover: { scale: 1.02, y: -3 },
  transition: { type: 'spring', stiffness: 350, damping: 26 },
};

interface GlassContextType {
  isGlassEnabled: boolean;
  setIsGlassEnabled: (enabled: boolean) => void;
  controls: GlassControlValues;
  updateControls: (newVals: Partial<GlassControlValues>) => void;
  resetControls: () => void;
  texts: CustomTexts;
  updateTexts: (newTexts: Partial<CustomTexts>) => void;
  resetTexts: () => void;
  stylePill: React.CSSProperties;
  styleCard: React.CSSProperties;
  styleTabActive: React.CSSProperties;
  styleButton: React.CSSProperties;
}

const GlassContext = createContext<GlassContextType>({
  isGlassEnabled: true,
  setIsGlassEnabled: () => {},
  controls: DEFAULT_GLASS_CONTROLS,
  updateControls: () => {},
  resetControls: () => {},
  texts: DEFAULT_CUSTOM_TEXTS,
  updateTexts: () => {},
  resetTexts: () => {},
  stylePill: {},
  styleCard: {},
  styleTabActive: {},
  styleButton: {},
});

export function useGlass() {
  return useContext(GlassContext);
}

const STORAGE_KEY_GLASS_ENABLED = 'matric_glass_ui_enabled';
const STORAGE_KEY_GLASS_CONTROLS = 'matric_glass_controls_v2';
const STORAGE_KEY_CUSTOM_TEXTS = 'matric_custom_texts_v2';

export function GlassProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isGlassEnabled, setIsGlassEnabledState] = useState<boolean>(true);
  const [controls, setControls] = useState<GlassControlValues>(DEFAULT_GLASS_CONTROLS);
  const [texts, setTexts] = useState<CustomTexts>(DEFAULT_CUSTOM_TEXTS);

  // Optional DialKit hook integration
  const dialControls = useDialKit('Controls', {
    shape: 'pill',
    scale: 48,
    aberration: 14,
    bevelDepth: 37,
    frost: 0.4,
    tint: 0.12,
  });

  useEffect(() => {
    setMounted(true);
    try {
      const storedGlass = localStorage.getItem(STORAGE_KEY_GLASS_ENABLED);
      if (storedGlass !== null) {
        setIsGlassEnabledState(storedGlass === 'true');
      }

      const storedControls = localStorage.getItem(STORAGE_KEY_GLASS_CONTROLS);
      if (storedControls) {
        setControls((prev) => ({ ...prev, ...JSON.parse(storedControls) }));
      }

      const storedTexts = localStorage.getItem(STORAGE_KEY_CUSTOM_TEXTS);
      if (storedTexts) {
        setTexts((prev) => ({ ...prev, ...JSON.parse(storedTexts) }));
      }
    } catch (e) {
      console.warn('Error reading glass preferences from localStorage', e);
    }
  }, []);

  const setIsGlassEnabled = (enabled: boolean) => {
    setIsGlassEnabledState(enabled);
    try {
      localStorage.setItem(STORAGE_KEY_GLASS_ENABLED, String(enabled));
    } catch {
      // ignore
    }
  };

  const updateControls = (newVals: Partial<GlassControlValues>) => {
    setControls((prev) => {
      const updated = { ...prev, ...newVals };
      try {
        localStorage.setItem(STORAGE_KEY_GLASS_CONTROLS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const resetControls = () => {
    setControls(DEFAULT_GLASS_CONTROLS);
    try {
      localStorage.removeItem(STORAGE_KEY_GLASS_CONTROLS);
    } catch {
      // ignore
    }
  };

  const updateTexts = (newTexts: Partial<CustomTexts>) => {
    setTexts((prev) => {
      const updated = { ...prev, ...newTexts };
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_TEXTS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const resetTexts = () => {
    setTexts(DEFAULT_CUSTOM_TEXTS);
    try {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_TEXTS);
    } catch {
      // ignore
    }
  };

  const activeControls = controls;

  // Compute live glass style parameters based on values
  const frostPx = Math.max(6, Math.round(activeControls.frost * 28));
  const bevelOffset = Math.round(activeControls.bevelDepth * 0.25);
  const bevelBlur = Math.round(activeControls.bevelDepth * 0.75);
  const borderRadius =
    activeControls.shape === 'pill'
      ? '9999px'
      : activeControls.shape === 'sharp'
      ? '8px'
      : `${activeControls.radius || 20}px`;

  const stylePill: React.CSSProperties = isGlassEnabled
    ? {
        borderRadius,
        backdropFilter: `blur(${frostPx}px) saturate(180%)`,
        WebkitBackdropFilter: `blur(${frostPx}px) saturate(180%)`,
        backgroundColor: `rgba(255, 255, 255, ${activeControls.tint})`,
        border: `1px solid rgba(255, 255, 255, ${Math.max(0.18, activeControls.aberration * 0.02)})`,
        boxShadow: `
          inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.45),
          inset 0 -1px 2px 0 rgba(0, 0, 0, 0.2),
          0 ${bevelOffset}px ${bevelBlur}px -3px rgba(0, 0, 0, 0.25),
          0 0 ${activeControls.aberration * 0.8}px rgba(57, 211, 83, 0.12)
        `,
      }
    : {
        borderRadius: '16px',
        backgroundColor: 'var(--color-surface, #ffffff)',
        border: '1px solid var(--color-line, #e2e8f0)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      };

  const styleCard: React.CSSProperties = isGlassEnabled
    ? {
        borderRadius: `${activeControls.radius || 20}px`,
        backdropFilter: `blur(${frostPx}px) saturate(160%)`,
        WebkitBackdropFilter: `blur(${frostPx}px) saturate(160%)`,
        backgroundColor: `rgba(255, 255, 255, ${Math.min(0.25, activeControls.tint * 0.9)})`,
        border: `1px solid rgba(255, 255, 255, ${Math.max(0.14, activeControls.aberration * 0.015)})`,
        boxShadow: `
          inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.35),
          0 ${bevelOffset}px ${bevelBlur}px -4px rgba(0, 0, 0, 0.15)
        `,
      }
    : {
        borderRadius: '16px',
        backgroundColor: 'var(--color-surface, #ffffff)',
        border: '1px solid var(--color-line, #e2e8f0)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      };

  const styleTabActive: React.CSSProperties = isGlassEnabled
    ? {
        borderRadius: '12px',
        backdropFilter: `blur(${Math.max(8, frostPx)}px) saturate(190%)`,
        WebkitBackdropFilter: `blur(${Math.max(8, frostPx)}px) saturate(190%)`,
        backgroundColor: `rgba(34, 197, 94, 0.14)`,
        border: `1px solid rgba(34, 197, 94, 0.35)`,
        boxShadow: `
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.45),
          0 2px 8px -2px rgba(34, 197, 94, 0.25)
        `,
      }
    : {
        borderRadius: '12px',
        backgroundColor: 'var(--color-surface-2, #f1f5f9)',
        border: '1px solid var(--color-line, #cbd5e1)',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      };

  const styleButton: React.CSSProperties = isGlassEnabled
    ? {
        borderRadius: '12px',
        backdropFilter: `blur(${frostPx}px)`,
        WebkitBackdropFilter: `blur(${frostPx}px)`,
        backgroundColor: `rgba(255, 255, 255, ${activeControls.tint})`,
        border: `1px solid rgba(255, 255, 255, ${Math.max(0.16, activeControls.aberration * 0.018)})`,
        boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
      }
    : {
        borderRadius: '10px',
        backgroundColor: 'var(--color-surface, #ffffff)',
        border: '1px solid var(--color-line, #e2e8f0)',
      };

  return (
    <GlassContext.Provider
      value={{
        isGlassEnabled,
        setIsGlassEnabled,
        controls: activeControls,
        updateControls,
        resetControls,
        texts,
        updateTexts,
        resetTexts,
        stylePill,
        styleCard,
        styleTabActive,
        styleButton,
      }}
    >
      {children}
    </GlassContext.Provider>
  );
}

/**
 * Floating Reactive Glass Control Pill
 * Animates with smooth spring dynamics and gives immediate access to key study actions.
 */
export function FloatingGlassBar({
  activeTab,
  onOpenAllUnits,
  onQuickFocus,
  onOpenPlanner,
  onOpenPractice,
}: {
  activeTab?: string;
  onOpenAllUnits?: () => void;
  onQuickFocus?: () => void;
  onOpenPlanner?: () => void;
  onOpenPractice?: () => void;
}) {
  const { stylePill, isGlassEnabled } = useGlass();

  const isAllUnitsActive = activeTab === 'all_units';
  const isFocusActive = activeTab === 'focus_mode';
  const isPlannerActive = activeTab === 'study_planner';
  const isPracticeActive = activeTab === 'practice' || activeTab === 'my_mastery';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none">
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={stylePill}
        className={`flex items-center gap-2 p-1.5 px-3.5 shadow-2xl transition-all duration-200 ${
          !isGlassEnabled ? 'bg-surface border border-line' : ''
        }`}
      >
        {/* All Units Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.94 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenAllUnits?.();
          }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-2xs font-semibold transition-all border shadow-xs cursor-pointer ${
            isAllUnitsActive
              ? 'bg-green text-white border-green/60 shadow-md ring-2 ring-green/20'
              : 'bg-surface-2 text-ink hover:bg-line border-line/40'
          }`}
          title="Browse all curriculum units and chapters"
          aria-label="All Units"
        >
          <Layers className={`h-3.5 w-3.5 ${isAllUnitsActive ? 'text-white' : 'text-green'}`} />
          <span>All Units</span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.94 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickFocus?.();
          }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-2xs font-medium transition-all shadow-xs cursor-pointer ${
            isFocusActive
              ? 'bg-green-dark text-white ring-2 ring-green/30'
              : 'bg-green text-white hover:bg-green-dark'
          }`}
          title="Start 1H Pomodoro focus block"
          aria-label="Quick 1H Focus"
        >
          <Play className="h-3 w-3 fill-current" />
          <span>Quick 1H Focus</span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.94 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenPlanner?.();
          }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-2xs font-medium transition-all cursor-pointer ${
            isPlannerActive
              ? 'bg-accent text-white font-semibold shadow-md'
              : 'bg-surface-2 text-ink hover:bg-line'
          }`}
          title="Open study planner"
          aria-label="Study Planner"
        >
          <Flame className={`h-3 w-3 ${isPlannerActive ? 'text-white' : 'text-accent'}`} />
          <span>Schedule</span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.94 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenPractice?.();
          }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-2xs font-medium transition-all cursor-pointer ${
            isPracticeActive
              ? 'bg-purple-600 text-white font-semibold shadow-md'
              : 'bg-surface-2 text-ink hover:bg-line'
          }`}
          title="Open practice tests"
          aria-label="Practice"
        >
          <Award className={`h-3 w-3 ${isPracticeActive ? 'text-white' : 'text-purple-500'}`} />
          <span>Practice</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
