'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Plus,
  Edit2,
  Trash2,
  FastForward,
  Play,
} from 'lucide-react';
import { useCurriculum } from '../../context/CurriculumContext';
import { usePreferences } from '../../context/PreferencesContext';
import { toEthiopian, formatEthiopianDate } from '@matric/shared-utils';
import type { StudySession } from '@matric/shared-types';
import { ScheduleStudyModal } from './ScheduleStudyModal';
import { ManageScheduleModal } from './ManageScheduleModal';

interface StudyPlannerWorkspaceProps {
  onStartFocusSession?: (sessionTitle: string, durationMinutes: number) => void;
}

export function StudyPlannerWorkspace({ onStartFocusSession }: StudyPlannerWorkspaceProps) {
  const {
    curriculum,
    studySessions,
    scheduleSession,
    updateSession,
    postponeSession,
    deleteSession,
    clearAllSessions,
  } = useCurriculum();
  const { preferences, setCalendar } = usePreferences();

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Today in Gregorian and Ethiopian
  const today = new Date();
  const ethToday = toEthiopian(today);

  const handleCreateSchedule = async (data: {
    grade: number;
    subjectId: string;
    subjectName: string;
    unitTitle: string;
    chapterRange: string;
    scheduledDateTime: string;
    durationMinutes: number;
    focusModeEnforced: boolean;
  }) => {
    const startTime = `${data.scheduledDateTime}:00Z`;
    const endTime = new Date(new Date(data.scheduledDateTime).getTime() + data.durationMinutes * 60000).toISOString();

    await scheduleSession({
      title: `${data.subjectName} (Grade ${data.grade}): ${data.chapterRange}`,
      grade: data.grade as any,
      subjectId: data.subjectId,
      unitIds: [],
      chapterIds: [],
      startTime,
      endTime,
      plannedDurationMinutes: data.durationMinutes,
      studyMethod: data.focusModeEnforced ? 'active_recall' : 'reading',
      status: 'planned',
      sessionObjective: `Unit: ${data.unitTitle} | ${data.focusModeEnforced ? 'Focus mode enforced' : 'Standard study'}`,
    });

    setToastMessage(`Scheduled "${data.subjectName}" for ${data.scheduledDateTime.replace('T', ' at ')}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveEditedSession = async (sessionId: string, updates: Partial<StudySession>) => {
    await updateSession(sessionId, updates);
    setToastMessage('Schedule updated successfully.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePostpone = async (sessionId: string, minutes: number) => {
    await postponeSession(sessionId, minutes);
    const hrs = minutes >= 60 ? `${Math.round(minutes / 60)}h` : `${minutes}m`;
    setToastMessage(`Session postponed by ${hrs}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDelete = async (sessionId: string) => {
    await deleteSession(sessionId);
    setToastMessage('Schedule deleted.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClearAll = async () => {
    await clearAllSessions();
    setShowClearConfirm(false);
    setToastMessage('All scheduled sessions cleared.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="rounded-xl border border-green/30 bg-green/10 px-4 py-2.5 text-xs text-green font-medium animate-in fade-in flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs text-green hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header with Calendar Toggle & Schedule Study Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">Study Planner</h2>
          <p className="text-xs text-ink-3 mt-0.5">
            Timezone: <span className="font-medium text-ink">Africa/Addis_Ababa</span> •{' '}
            {preferences.calendarPreference === 'ethiopian'
              ? formatEthiopianDate(ethToday, preferences.language)
              : today.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Gregorian / Ethiopian Toggle */}
          <div className="inline-flex rounded-lg border border-line bg-surface p-1 text-xs">
            <button
              type="button"
              onClick={() => setCalendar('gregorian')}
              className={`rounded-md px-3 py-1 transition-colors ${
                preferences.calendarPreference === 'gregorian'
                  ? 'bg-green text-white font-medium'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              Gregorian
            </button>
            <button
              type="button"
              onClick={() => setCalendar('ethiopian')}
              className={`rounded-md px-3 py-1 transition-colors ${
                preferences.calendarPreference === 'ethiopian'
                  ? 'bg-green text-white font-medium'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              Ethiopian (ዓ.ም)
            </button>
          </div>

          {/* Clear All Schedules Button */}
          {studySessions.length > 0 && !showClearConfirm && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface px-3 py-2 text-2xs font-medium text-ink-3 hover:text-red-600 hover:border-red-200 transition-colors shadow-2xs"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear Schedules</span>
            </button>
          )}

          {showClearConfirm && (
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 p-1 dark:border-red-900/40 dark:bg-red-950/20 text-3xs">
              <span className="text-red-700 dark:text-red-300 font-medium px-1">Clear all?</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-lg bg-red-600 px-2 py-1 font-semibold text-white hover:bg-red-700"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="rounded-lg bg-surface px-2 py-1 text-ink hover:bg-surface-2"
              >
                No
              </button>
            </div>
          )}

          {/* Schedule Study Button */}
          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-green px-4 py-2 text-xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Schedule Study</span>
          </button>
        </div>
      </div>

      {/* Calendar View Switcher & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('day')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium border border-line transition-colors ${
              viewMode === 'day' ? 'bg-surface-2 text-ink' : 'bg-surface text-ink-3 hover:text-ink'
            }`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium border border-line transition-colors ${
              viewMode === 'week' ? 'bg-surface-2 text-ink' : 'bg-surface text-ink-3 hover:text-ink'
            }`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium border border-line transition-colors ${
              viewMode === 'month' ? 'bg-surface-2 text-ink' : 'bg-surface text-ink-3 hover:text-ink'
            }`}
          >
            Month
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink font-medium">
          <button
            type="button"
            className="p-1 rounded border border-line text-ink-3 hover:text-ink transition-colors"
            aria-label="Previous period"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span>Current Period</span>
          <button
            type="button"
            className="p-1 rounded border border-line text-ink-3 hover:text-ink transition-colors"
            aria-label="Next period"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Planned Sessions List & Empty State */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-3 flex items-center gap-2">
            <span>Scheduled Sessions</span>
            <span className="rounded-full bg-surface-2 text-ink px-2 py-0.5 text-3xs font-mono">
              {studySessions.length}
            </span>
          </h3>

          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="text-xs font-medium text-green hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>Schedule New Session</span>
          </button>
        </div>

        {studySessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-canvas/30 py-12 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-ink-3 mb-3 shadow-2xs">
              <CalendarIcon className="h-6 w-6 text-green" />
            </div>
            <h4 className="text-sm font-semibold text-ink">No scheduled study sessions</h4>
            <p className="text-xs text-ink-3 max-w-md mt-1 mb-4">
              Your study planner is completely clean. Click the button below to schedule specific Ethiopian curriculum chapters and track your preparation.
            </p>
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-green px-4 py-2 text-xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Schedule Study Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {studySessions.map((sess) => {
              const startDate = sess.startTime ? new Date(sess.startTime) : new Date();
              const dateStr = !isNaN(startDate.getTime())
                ? startDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Upcoming';
              const timeStr = !isNaN(startDate.getTime())
                ? startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '09:00 AM';

              return (
                <div
                  key={sess.id}
                  className="flex flex-col justify-between rounded-xl border border-line bg-surface p-4 hover:shadow-xs hover:border-line-strong transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-3xs font-medium text-ink">
                          Grade {sess.grade}
                        </span>
                        <span className="rounded-sm bg-green/10 text-green px-1.5 py-0.5 text-3xs font-medium capitalize">
                          {sess.studyMethod ? sess.studyMethod.replace('_', ' ') : 'reading'}
                        </span>
                        {sess.status === 'rescheduled' && (
                          <span className="rounded-sm bg-accent/10 text-accent px-1.5 py-0.5 text-3xs font-medium">
                            Postponed
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-2xs text-ink-3 font-mono">
                        <Clock className="h-3 w-3 text-ink-3" />
                        <span>{timeStr}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-semibold text-ink leading-snug line-clamp-2">
                      {sess.title}
                    </h4>

                    <div className="flex items-center gap-3 text-2xs text-ink-3">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{sess.plannedDurationMinutes || 60} mins</span>
                      </div>
                      {sess.studyMethod === 'active_recall' && (
                        <div className="flex items-center gap-1 text-accent font-medium">
                          <Flame className="h-3 w-3" />
                          <span>Focus Enforced</span>
                        </div>
                      )}
                    </div>

                    {sess.sessionObjective && (
                      <p className="text-3xs text-ink-3 italic line-clamp-1">
                        {sess.sessionObjective}
                      </p>
                    )}
                  </div>

                  {/* Management Action Bar */}
                  <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {/* Postpone +24h */}
                      <button
                        type="button"
                        onClick={() => handlePostpone(sess.id, 1440)}
                        title="Postpone by 24 hours"
                        className="p-1.5 rounded-lg border border-line bg-surface text-ink-3 hover:text-accent hover:border-accent/40 transition-colors"
                      >
                        <FastForward className="h-3.5 w-3.5" />
                      </button>

                      {/* Modify/Edit */}
                      <button
                        type="button"
                        onClick={() => setEditingSession(sess)}
                        title="Edit schedule details"
                        className="p-1.5 rounded-lg border border-line bg-surface text-ink-3 hover:text-ink hover:border-line-strong transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(sess.id)}
                        title="Delete schedule"
                        className="p-1.5 rounded-lg border border-line bg-surface text-ink-3 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onStartFocusSession) {
                          onStartFocusSession(sess.title, sess.plannedDurationMinutes || 60);
                        } else {
                          setToastMessage(`Starting focus mode for: ${sess.title}`);
                          setTimeout(() => setToastMessage(null), 3000);
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-green px-3 py-1.5 text-2xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Start Focus</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule Study Modal */}
      <ScheduleStudyModal
        isOpen={isScheduleModalOpen}
        curriculum={curriculum}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleCreateSchedule}
      />

      {/* Manage/Edit Schedule Modal */}
      <ManageScheduleModal
        isOpen={!!editingSession}
        session={editingSession}
        curriculum={curriculum}
        onClose={() => setEditingSession(null)}
        onSave={handleSaveEditedSession}
        onPostpone={handlePostpone}
        onDelete={handleDelete}
        onStartFocus={(sess) => {
          if (onStartFocusSession) {
            onStartFocusSession(sess.title, sess.plannedDurationMinutes || 60);
          }
        }}
      />
    </div>
  );
}
