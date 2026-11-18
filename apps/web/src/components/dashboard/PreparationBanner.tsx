'use client';

import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, ArrowUpRight } from 'lucide-react';
import { useGlass } from '../ui/GlassControls';

interface PreparationBannerProps {
  onStartStudy?: () => void;
}

export function PreparationBanner({ onStartStudy }: PreparationBannerProps) {
  const { isGlassEnabled, styleCard, texts } = useGlass();

  return (
    <motion.div
      whileHover={{ scale: 1.012, y: -2 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={isGlassEnabled ? styleCard : undefined}
      className={`flex flex-col gap-4 rounded-2xl p-4 sm:p-5 3xl:p-6 sm:flex-row sm:items-center sm:justify-between transition-all ${
        isGlassEnabled
          ? 'shadow-lg border border-green-400/20 bg-green-500/10 backdrop-blur-md'
          : 'border border-green-200/60 bg-green-50/50 dark:border-green-900/30 dark:bg-green-950/20'
      }`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4">
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-green-200 text-green shadow-xs dark:bg-green-900/40 dark:border-green-800">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm 3xl:text-base font-bold text-ink">
            {texts.prepBannerTitle || 'Your preparation starts here'}
          </h2>
          <p className="text-xs 3xl:text-sm text-ink-2 mt-0.5">
            {texts.prepBannerSubtitle || 'Keep your momentum going. Every completed unit brings you closer.'}
          </p>
        </div>
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        onClick={onStartStudy}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2.5 sm:py-2 text-xs font-semibold text-ink hover:bg-surface-2 transition-all shadow-xs cursor-pointer"
      >
        <span>Let&apos;s study</span>
        <ArrowUpRight className="h-3.5 w-3.5 text-ink-2" />
      </motion.button>
    </motion.div>
  );
}
