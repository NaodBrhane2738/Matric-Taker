'use client';

import React from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Play,
  Edit2,
  Trash2,
  FastForward,
  Plus,
  Flame,
} from 'lucide-react';
import type { StudySession } from '@matric/shared-types';

interface UpcomingSchedulesProps {
  sessions?: StudySession[];
  onStartSession?: (session: StudySession) => void;
  onOpenPlanner?: () => void;
  onOpenScheduleModal?: () => void;
  onEditSession?: (session: StudySession) => void;
  onPostponeSession?: (sessionId: string, minutes: number) => void;
  onDeleteSession?: (sessionId: string) => void;
}

export function UpcomingSchedules({
  sessions = [],
  onStartSession,
  onOpenPlanner,
  onOpenScheduleModal,
  onEditSession,
  onPostponeSession,
  onDeleteSession,
}: UpcomingSchedulesProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5 3xl:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-line/60 gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green" />
            <span>Upcoming Study Schedules</span>
            {sessions.length > 0 && (
              <span className="rounded-full bg-green/10 text-green px-2 py-0.5 text-3xs font-semibold">
                {sessions.length}
              </span>
            )}
          </h2>
          <p className="text-xs text-ink-3 mt-0.5">
            Your planned study sessions for the upcoming examination days.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenScheduleModal && (
            <button
              type="button"
              onClick={onOpenScheduleModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-green px-3 py-1.5 text-2xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Schedule Study</span>
            </button>
          )}

          {onOpenPlanner && (
            <button
              type="button"
              onClick={onOpenPlanner}
              className="inline-flex items-center gap-1 text-xs font-medium text-green hover:underline ml-2"
            >
              <span>Planner</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-canvas/40 py-10 px-4 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-ink-3 mb-2.5">
            <Calendar className="h-5 w-5 text-green" />
          </div>
          <p className="text-xs font-semibold text-ink">No upcoming study sessions scheduled</p>
          <p className="text-2xs text-ink-3 max-w-sm mt-1 mb-4">
            Plan your first study session to track your chapters, enforce deep focus, and stay on schedule.
          </p>
          {onOpenScheduleModal ? (
            <button
              type="button"
              onClick={onOpenScheduleModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-green px-4 py-2 text-xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Schedule Your First Session</span>
            </button>
          ) : (
            onOpenPlanner && (
              <button
                type="button"
                onClick={onOpenPlanner}
                className="inline-flex items-center gap-1.5 rounded-xl bg-green px-4 py-2 text-xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Open Study Planner</span>
              </button>
            )
          )}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-3.5 3xl:gap-5">
          {sessions.slice(0, 6).map((s) => {
            const startDate = s.startTime ? new Date(s.startTime) : new Date();
            const dateStr = !isNaN(startDate.getTime())
              ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'Upcoming';
            const timeStr = !isNaN(startDate.getTime())
              ? startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '09:00 AM';

            return (
              <div
                key={s.id}
                className="flex flex-col justify-between rounded-xl border border-line bg-canvas/60 p-4 transition-all hover:border-line-strong hover:bg-surface-2/40 group"
              >
                <div>
                  <div className="flex items-center justify-between text-3xs text-ink-3 mb-2">
                    <span className="font-semibold text-ink flex items-center gap-1">
                      <Clock className="h-3 w-3 text-ink-3" />
                      {timeStr}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-ink-2">
                        {dateStr}
                      </span>
                      {s.status === 'rescheduled' && (
                        <span className="rounded-sm bg-accent/10 text-accent px-1.5 py-0.5 font-medium text-3xs">
                          Postponed
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xs font-semibold text-ink leading-snug line-clamp-2">
                    {s.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-3xs text-ink-3">
                    <span className="rounded-md border border-line bg-surface px-1.5 py-0.5 capitalize font-medium text-ink-2">
                      {s.studyMethod ? s.studyMethod.replace('_', ' ') : 'reading'}
                    </span>
                    <span>{s.plannedDurationMinutes || 60} mins</span>
                    {s.studyMethod === 'active_recall' && (
                      <span className="text-accent flex items-center gap-0.5 font-medium">
                        <Flame className="h-2.5 w-2.5" />
                        Focus
                      </span>
                    )}
                  </div>
                </div>

                {/* Management Action Buttons Row */}
                <div className="mt-4 pt-3 border-t border-line/50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {/* Quick Postpone +24h */}
                    {onPostponeSession && (
                      <button
                        type="button"
                        onClick={() => onPostponeSession(s.id, 1440)}
                        title="Postpone by 24 hours"
                        className="p-1 rounded text-ink-3 hover:text-accent hover:bg-surface-2 transition-colors"
                      >
                        <FastForward className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* Edit Session */}
                    {onEditSession && (
                      <button
                        type="button"
                        onClick={() => onEditSession(s)}
                        title="Modify schedule"
                        className="p-1 rounded text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* Delete Session */}
                    {onDeleteSession && (
                      <button
                        type="button"
                        onClick={() => onDeleteSession(s.id)}
                        title="Delete schedule"
                        className="p-1 rounded text-ink-3 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {onStartSession && (
                    <button
                      type="button"
                      onClick={() => onStartSession(s)}
                      className="inline-flex items-center gap-1 rounded-lg bg-green px-2.5 py-1 text-3xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs"
                    >
                      <Play className="h-2.5 w-2.5 fill-current" />
                      <span>Start Focus</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
