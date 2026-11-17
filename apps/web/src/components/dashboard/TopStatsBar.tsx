'use client';

import React from 'react';
import { Layers, CheckCircle2, Clock, Percent } from 'lucide-react';

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
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total units */}
      <div className="rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between text-ink-3">
          <span className="text-xs font-medium text-ink-2">Total units</span>
          <Layers className="h-4 w-4" />
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight text-ink tabular-nums">
          {totalUnits}
        </div>
        <p className="mt-1 text-xs text-ink-3">Across your curriculum</p>
      </div>

      {/* 2. Completed */}
      <div className="rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between text-ink-3">
          <span className="text-xs font-medium text-ink-2">Completed</span>
          <CheckCircle2 className="h-4 w-4 text-green" />
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight text-ink tabular-nums">
          {completedUnits}
        </div>
        <p className="mt-1 text-xs text-ink-3">Every unit is a step forward</p>
      </div>

      {/* 3. Remaining */}
      <div className="rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between text-ink-3">
          <span className="text-xs font-medium text-ink-2">Remaining</span>
          <Clock className="h-4 w-4" />
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight text-ink tabular-nums">
          {remainingUnits}
        </div>
        <p className="mt-1 text-xs text-ink-3">Ready when you are</p>
      </div>

      {/* 4. Overall progress */}
      <div className="rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between text-ink-3">
          <span className="text-xs font-medium text-ink-2">Overall progress</span>
          <Percent className="h-4 w-4" />
        </div>
        <div className="mt-3 text-3xl font-semibold tracking-tight text-ink tabular-nums">
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
      </div>
    </div>
  );
}
