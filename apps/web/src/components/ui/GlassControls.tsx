'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDialKit, DialRoot } from 'dialkit';
import 'dialkit/styles.css';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, Flame, Layers, CheckCircle2, Award } from 'lucide-react';

export interface GlassControlValues {
  shape: string;
  scale: number;
  aberration: number;
  bevelDepth: number;
  frost: number;
  tint: number;
}

const DEFAULT_GLASS_CONTROLS: GlassControlValues = {
  shape: 'pill',
  scale: 48,
  aberration: 14,
  bevelDepth: 37,
  frost: 0.4,
  tint: 0.12,
};

const GlassContext = createContext<{
  controls: GlassControlValues;
  stylePill: React.CSSProperties;
  styleCard: React.CSSProperties;
}>({
  controls: DEFAULT_GLASS_CONTROLS,
  stylePill: {},
  styleCard: {},
});

export function useGlass() {
  return useContext(GlassContext);
}

export function GlassProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update the useDialKit configuration for "Controls" with the user's requested defaults:
  // { "shape": "pill", "scale": 48, "aberration": 14, "bevelDepth": 37, "frost": 0.4, "tint": 0.12 }
  const controls = useDialKit('Controls', {
    shape: 'pill',
    scale: 48,
    aberration: 14,
    bevelDepth: 37,
    frost: 0.4,
    tint: 0.12,
  });

  const activeControls = mounted && controls ? (controls as GlassControlValues) : DEFAULT_GLASS_CONTROLS;

  // Compute live glass style parameters based on DialKit values
  const frostPx = Math.max(6, Math.round(activeControls.frost * 28));
  const bevelOffset = Math.round(activeControls.bevelDepth * 0.25);
  const bevelBlur = Math.round(activeControls.bevelDepth * 0.75);

  const stylePill: React.CSSProperties = {
    borderRadius: activeControls.shape === 'pill' ? '9999px' : '16px',
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
  };

  const styleCard: React.CSSProperties = {
    borderRadius: '24px',
    backdropFilter: `blur(${frostPx}px) saturate(160%)`,
    WebkitBackdropFilter: `blur(${frostPx}px) saturate(160%)`,
    backgroundColor: `rgba(255, 255, 255, ${activeControls.tint})`,
    border: `1px solid rgba(255, 255, 255, ${Math.max(0.14, activeControls.aberration * 0.015)})`,
    boxShadow: `
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.35),
      0 ${bevelOffset}px ${bevelBlur}px -4px rgba(0, 0, 0, 0.2)
    `,
  };

  return (
    <GlassContext.Provider value={{ controls: activeControls, stylePill, styleCard }}>
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
  const { stylePill } = useGlass();

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
        className="flex items-center gap-2 p-1.5 px-3.5 shadow-2xl transition-all duration-200"
      >
        {/* All Units Button replacing the old Matric Focus text */}
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
