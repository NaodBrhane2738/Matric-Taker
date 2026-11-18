'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGlass } from './GlassControls';

interface NavigationHistoryArrowsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  previousTabName?: string;
  nextTabName?: string;
  className?: string;
}

export function NavigationHistoryArrows({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  previousTabName,
  nextTabName,
  className = '',
}: NavigationHistoryArrowsProps) {
  const { isGlassEnabled, stylePill } = useGlass();

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 rounded-xl select-none transition-all ${
        isGlassEnabled
          ? 'backdrop-blur-md bg-surface/60 border border-white/20 shadow-xs dark:border-white/10'
          : 'bg-surface-2 border border-line shadow-xs'
      } ${className}`}
      role="navigation"
      aria-label="History Navigation"
    >
      {/* Back Arrow */}
      <motion.button
        type="button"
        disabled={!canGoBack}
        onClick={onGoBack}
        whileHover={canGoBack ? { scale: 1.08, x: -1 } : {}}
        whileTap={canGoBack ? { scale: 0.92 } : {}}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
          canGoBack
            ? 'text-ink hover:bg-surface-2 hover:text-green cursor-pointer'
            : 'text-ink-3/40 cursor-not-allowed opacity-40'
        }`}
        title={canGoBack ? `Go back to ${previousTabName || 'previous view'}` : 'No previous history'}
        aria-label="Go back"
      >
        <ChevronLeft className="h-4 w-4" />
      </motion.button>

      {/* Subtle Divider */}
      <div className="h-3.5 w-px bg-line/60" />

      {/* Forward Arrow */}
      <motion.button
        type="button"
        disabled={!canGoForward}
        onClick={onGoForward}
        whileHover={canGoForward ? { scale: 1.08, x: 1 } : {}}
        whileTap={canGoForward ? { scale: 0.92 } : {}}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
          canGoForward
            ? 'text-ink hover:bg-surface-2 hover:text-green cursor-pointer'
            : 'text-ink-3/40 cursor-not-allowed opacity-40'
        }`}
        title={canGoForward ? `Go forward to ${nextTabName || 'next view'}` : 'No forward history'}
        aria-label="Go forward"
      >
        <ChevronRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
}
