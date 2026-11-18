'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Layers, CheckCircle2, Clock, Percent } from 'lucide-react';
import { useGlass } from '../ui/GlassControls';

interface TopStatsBarProps {
  totalUnits: number;
  completedUnits: number;
  remainingUnits: number;
  overallProgress: number;
  totalChapters?: number;
  completedChapters?: number;
}

export function TopStatsBar({
  totalUnits,
  completedUnits,
  remainingUnits,
  overallProgress,
  totalChapters,
  completedChapters,
}: TopStatsBarProps) {
  const { isGlassEnabled, styleCard } = useGlass();

  const cardHoverSpring = {
    whileHover: { scale: 1.025, y: -3 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring' as const, stiffness: 420, damping: 25 },
  };

  return (
    <div className="grid grid-cols-1 gap-3 xs:gap-4 sm:grid-cols-2 lg:grid-cols-4 3xl:gap-6">
      {/* 1. Total units */}
      <motion.div
        {...cardHoverSpring}
        style={isGlassEnabled ? styleCard : undefined}
        className={`rounded-2xl p-4 sm:p-5 3xl:p-6 transition-all cursor-pointer ${
          isGlassEnabled
            ? 'shadow-lg border border-white/20 dark:border-white/10'
            : 'border border-line bg-surface hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-ink-3">
          <span className="text-xs font-semibold text-ink-2">Total units</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-2 text-ink-2">
            <Layers className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-3xl font-bold tracking-tight text-ink tabular-nums">
          {totalUnits}
        </div>
        <p className="mt-1 text-xs text-ink-3">Across your curriculum</p>
      </motion.div>

      {/* 2. Completed */}
      <motion.div
        {...cardHoverSpring}
        style={isGlassEnabled ? styleCard : undefined}
        className={`rounded-2xl p-4 sm:p-5 3xl:p-6 transition-all cursor-pointer ${
          isGlassEnabled
            ? 'shadow-lg border border-white/20 dark:border-white/10'
            : 'border border-line bg-surface hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-ink-3">
          <span className="text-xs font-semibold text-ink-2">Completed</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green/10 text-green">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-3xl font-bold tracking-tight text-green tabular-nums">
          {completedUnits}
        </div>
        <p className="mt-1 text-xs text-ink-3">Every unit is a step forward</p>
      </motion.div>

      {/* 3. Remaining */}
      <motion.div
        {...cardHoverSpring}
        style={isGlassEnabled ? styleCard : undefined}
        className={`rounded-2xl p-4 sm:p-5 3xl:p-6 transition-all cursor-pointer ${
          isGlassEnabled
            ? 'shadow-lg border border-white/20 dark:border-white/10'
            : 'border border-line bg-surface hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-ink-3">
          <span className="text-xs font-semibold text-ink-2">Remaining</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-2 text-ink-2">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-3xl font-bold tracking-tight text-ink tabular-nums">
          {remainingUnits}
        </div>
        <p className="mt-1 text-xs text-ink-3">Ready when you are</p>
      </motion.div>

      {/* 4. Overall progress */}
      <motion.div
        {...cardHoverSpring}
        style={isGlassEnabled ? styleCard : undefined}
        className={`rounded-2xl p-4 sm:p-5 3xl:p-6 transition-all cursor-pointer ${
          isGlassEnabled
            ? 'shadow-lg border border-white/20 dark:border-white/10'
            : 'border border-line bg-surface hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-ink-3">
          <span className="text-xs font-semibold text-ink-2">Overall progress</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green/10 text-green">
            <Percent className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-3xl font-bold tracking-tight text-ink tabular-nums">
          {overallProgress}%
        </div>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-green rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-ink-3 tabular-nums">
          {completedChapters !== undefined && totalChapters !== undefined
            ? `${completedChapters} of ${totalChapters} chapters (${completedUnits} units)`
            : `${completedUnits} of ${totalUnits} units completed`}
        </p>
      </motion.div>
    </div>
  );
}
