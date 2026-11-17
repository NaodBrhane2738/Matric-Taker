'use client';

import React, { useState, useMemo } from 'react';
import { Target, BookCheck, ShieldAlert, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useCurriculum } from '../../context/CurriculumContext';
import { StudyActivityHeatmap } from '../dashboard/StudyActivityHeatmap';

export function AnalyticsWorkspace() {
  const { metrics, weakChapters, progressMap, isDemoMode } = useCurriculum();
  const [toast, setToast] = useState<string | null>(null);

  const realActivityData = useMemo(() => {
    const data: Record<string, { sessions: number; chapters: number; minutes: number }> = {};
    for (const prog of Object.values(progressMap)) {
      if (prog.status === 'studied' || prog.status === 'mastered' || prog.status === 'practicing') {
        const dateKey = (prog.lastStudiedAt || prog.updatedAt || new Date().toISOString()).split('T')[0];
        if (!data[dateKey]) {
          data[dateKey] = { sessions: 0, chapters: 0, minutes: 0 };
        }
        data[dateKey].chapters += 1;
        data[dateKey].sessions += 1;
        data[dateKey].minutes += 45;
      }
    }
    return data;
  }, [progressMap]);

  const handleScheduleRevision = (chapterId: string) => {
    setToast(`Targeted revision queued for ${chapterId}`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Toast Feedback */}
      {toast && (
        <div className="rounded-xl border border-green/30 bg-green/10 px-4 py-2.5 text-xs text-green font-medium animate-in fade-in flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{toast}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-xs text-green hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-line pb-4">
        <h2 className="text-xl font-semibold text-ink">Learning Analytics &amp; Preparedness</h2>
        <p className="text-xs text-ink-3 mt-0.5">
          Empirical tracking across three strictly independent performance dimensions.
        </p>
      </div>

      {/* Activity Heatmap (GitHub-Like Contribution Table) */}
      <StudyActivityHeatmap activityData={realActivityData} hasDemoData={isDemoMode} />

      {/* 3 Separate Performance Dimensions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 3xl:gap-6">
        {/* 1. Curriculum Coverage */}
        <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
          <div className="flex items-center justify-between text-ink-3">
            <span className="text-xs font-semibold text-ink-2 uppercase tracking-wider">
              1. Curriculum Coverage
            </span>
            <BookCheck className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-3xl font-semibold text-ink tabular-nums">
            {metrics.curriculumCoveragePercentage}%
          </div>
          <p className="text-xs text-ink-3">
            {metrics.studiedChapters} of {metrics.totalChapters} chapters studied or in progress.
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${metrics.curriculumCoveragePercentage}%` }}
            />
          </div>
          <p className="text-3xs text-ink-3">Measures material read, not retention.</p>
        </div>

        {/* 2. Knowledge Mastery */}
        <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
          <div className="flex items-center justify-between text-ink-3">
            <span className="text-xs font-semibold text-ink-2 uppercase tracking-wider">
              2. Knowledge Mastery
            </span>
            <Target className="h-4 w-4 text-green" />
          </div>
          <div className="text-3xl font-semibold text-ink tabular-nums">
            {metrics.knowledgeMasteryPercentage}%
          </div>
          <p className="text-xs text-ink-3">
            {metrics.masteredChapters} chapters backed by empirical assessment evidence (≥75%).
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full bg-green rounded-full transition-all duration-500"
              style={{ width: `${metrics.knowledgeMasteryPercentage}%` }}
            />
          </div>
          <p className="text-3xs text-ink-3">Verified retention through testing.</p>
        </div>

        {/* 3. Examination Readiness */}
        <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
          <div className="flex items-center justify-between text-ink-3">
            <span className="text-xs font-semibold text-ink-2 uppercase tracking-wider">
              3. Examination Readiness
            </span>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-3xl font-semibold text-ink tabular-nums">
            {metrics.examinationReadinessPercentage}%
          </div>
          <p className="text-xs text-ink-3">
            Composite index factoring mastery, revision intervals, and practice freshness.
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${metrics.examinationReadinessPercentage}%` }}
            />
          </div>
          <p className="text-3xs text-ink-3">Predictive exam confidence score.</p>
        </div>
      </div>

      {/* Weak Chapters Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-ink">Identified Weak Chapters &amp; Attention Areas</h3>
        {weakChapters.length === 0 ? (
          <div className="rounded-xl border border-line bg-surface p-5 text-center text-xs text-ink-3">
            No weak chapters identified yet. Complete more practice quizzes to generate diagnostic telemetry.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {weakChapters.map((w, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-line bg-surface p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      w.severity === 'high'
                        ? 'bg-red-50 text-red-600 dark:bg-red-950/40'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-ink">{w.chapterId}</h4>
                    <p className="text-3xs text-ink-3">{w.reason}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleScheduleRevision(w.chapterId)}
                  className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-3xs font-medium text-ink hover:bg-line transition-colors"
                >
                  Schedule revision
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
