'use client';

import React from 'react';
import { GraduationCap, ArrowUpRight } from 'lucide-react';

interface PreparationBannerProps {
  onStartStudy?: () => void;
}

export function PreparationBanner({ onStartStudy }: PreparationBannerProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-green-200/60 bg-green-50/50 p-5 dark:border-green-900/30 dark:bg-green-950/20 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-green-200 text-green shadow-xs dark:bg-green-900/40 dark:border-green-800">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Your preparation starts here</h2>
          <p className="text-xs text-ink-2 mt-0.5">
            Keep your momentum going. Every completed unit brings you closer.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onStartStudy}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2 text-xs font-medium text-ink hover:bg-surface-2 transition-colors shadow-xs"
      >
        <span>Let&apos;s study</span>
        <ArrowUpRight className="h-3.5 w-3.5 text-ink-2" />
      </button>
    </div>
  );
}
