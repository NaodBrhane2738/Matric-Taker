'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Calendar,
  Clock,
  Trash2,
  FastForward,
  Play,
  Save,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
} from 'lucide-react';
import type { StudySession } from '@matric/shared-types';
import type { CurriculumRoot, GradeCurriculum } from '@matric/curriculum-schema';

interface ManageScheduleModalProps {
  isOpen: boolean;
  session: StudySession | null;
  curriculum: CurriculumRoot | null;
  onClose: () => void;
  onSave: (sessionId: string, updates: Partial<StudySession>) => void;
  onPostpone: (sessionId: string, minutes: number) => void;
  onDelete: (sessionId: string) => void;
  onStartFocus?: (session: StudySession) => void;
}

export function ManageScheduleModal({
  isOpen,
  session,
  curriculum,
  onClose,
  onSave,
  onPostpone,
  onDelete,
  onStartFocus,
}: ManageScheduleModalProps) {
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState<number>(12);
  const [subjectId, setSubjectId] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [focusModeEnforced, setFocusModeEnforced] = useState(true);
  const [sessionObjective, setSessionObjective] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (session) {
      setTitle(session.title || '');
      setGrade(session.grade || 12);
      setSubjectId(session.subjectId || '');
      setDurationMinutes(session.plannedDurationMinutes || 60);
      setSessionObjective(session.sessionObjective || '');
      setFocusModeEnforced(session.studyMethod === 'active_recall');
      setShowDeleteConfirm(false);

      if (session.startTime) {
        const d = new Date(session.startTime);
        if (!isNaN(d.getTime())) {
          // Format for datetime-local input YYYY-MM-DDTHH:mm
          const offset = d.getTimezoneOffset() * 60000;
          const localISOTime = new Date(d.getTime() - offset).toISOString().slice(0, 16);
          setScheduledDateTime(localISOTime);
        }
      }
    }
  }, [session, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const gradesList: GradeCurriculum[] = useMemo(() => {
    if (!curriculum) return [];
    if (curriculum.curriculum && curriculum.curriculum.grades) {
      return curriculum.curriculum.grades;
    }
    return (curriculum as any).grades || [];
  }, [curriculum]);

  const currentGradeObj = gradesList.find((g) => g.grade === grade);
  const availableSubjects = currentGradeObj?.subjects || [];

  if (!isOpen || !session) return null;

  const handleQuickPostpone = (minutes: number) => {
    onPostpone(session.id, minutes);
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStartTime = scheduledDateTime ? new Date(scheduledDateTime).toISOString() : session.startTime;
    const updatedEndTime = new Date(new Date(updatedStartTime).getTime() + durationMinutes * 60000).toISOString();

    onSave(session.id, {
      title,
      grade: grade as any,
      subjectId,
      startTime: updatedStartTime,
      endTime: updatedEndTime,
      plannedDurationMinutes: durationMinutes,
      studyMethod: focusModeEnforced ? 'active_recall' : 'reading',
      sessionObjective,
      status: 'rescheduled',
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(session.id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-schedule-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 xs:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-surface p-4 sm:p-6 shadow-2xl border border-line animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-ink-3 hover:text-ink transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h2 id="manage-schedule-title" className="text-base font-semibold text-ink">
              Manage Study Schedule
            </h2>
            <div className="flex items-center gap-2 text-2xs text-ink-3">
              <span>Status:</span>
              <span className="rounded-full bg-surface-2 px-2 py-0.5 font-medium uppercase text-3xs text-ink-2">
                {session.status}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Postpone Section */}
        <div className="mt-4 rounded-xl border border-line/70 bg-surface-2/40 p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-2xs font-semibold text-accent">
            <FastForward className="h-3.5 w-3.5" />
            <span>Quick Postpone Options</span>
          </div>
          <p className="text-3xs text-ink-3">
            Push this study session back without modifying curriculum details:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickPostpone(60)}
              className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-3xs font-medium text-ink hover:bg-surface-2 hover:border-line-strong transition-all shadow-2xs"
            >
              +1 Hour
            </button>
            <button
              type="button"
              onClick={() => handleQuickPostpone(1440)}
              className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-3xs font-medium text-green hover:bg-green/10 hover:border-green/40 transition-all shadow-2xs"
            >
              +24h (Tomorrow)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPostpone(2880)}
              className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-3xs font-medium text-ink hover:bg-surface-2 hover:border-line-strong transition-all shadow-2xs"
            >
              +48h (2 Days)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPostpone(10080)}
              className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-3xs font-medium text-ink hover:bg-surface-2 hover:border-line-strong transition-all shadow-2xs"
            >
              +1 Week
            </button>
          </div>
        </div>

        {/* Main Edit Form */}
        <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Title input */}
          <div>
            <label htmlFor="edit-title" className="block text-2xs font-medium text-ink-2 mb-1">
              Session Title / Topic
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink focus:outline-none focus:ring-1 focus:ring-accent"
              required
            />
          </div>

          {/* Grade & Subject */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-grade" className="block text-2xs font-medium text-ink-2 mb-1">
                Grade
              </label>
              <select
                id="edit-grade"
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value={9}>Grade 9</option>
                <option value={10}>Grade 10</option>
                <option value={11}>Grade 11</option>
                <option value={12}>Grade 12 (Matric Exam)</option>
              </select>
            </div>

            <div>
              <label htmlFor="edit-subject" className="block text-2xs font-medium text-ink-2 mb-1">
                Subject
              </label>
              <select
                id="edit-subject"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {availableSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Time & Expected Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-datetime" className="block text-2xs font-medium text-ink-2 mb-1">
                Scheduled Date &amp; Time
              </label>
              <input
                id="edit-datetime"
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="edit-duration" className="block text-2xs font-medium text-ink-2">
                  Expected Duration
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomDuration(!isCustomDuration)}
                  className="text-3xs text-green hover:underline font-medium"
                >
                  {isCustomDuration ? 'Use Presets' : 'Custom'}
                </button>
              </div>

              {isCustomDuration ? (
                <div className="relative">
                  <input
                    id="edit-duration-custom"
                    type="number"
                    min={5}
                    max={720}
                    step={5}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Math.max(5, Number(e.target.value)))}
                    className="w-full rounded-xl border border-line bg-canvas pl-3 pr-16 py-2 text-ink text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-2xs text-ink-3 pointer-events-none">
                    minutes
                  </span>
                </div>
              ) : (
                <select
                  id="edit-duration"
                  value={durationMinutes}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val === -1) {
                      setIsCustomDuration(true);
                    } else {
                      setDurationMinutes(val);
                    }
                  }}
                  className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value={25}>25 minutes (Sprint)</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours (Deep Work)</option>
                  <option value={-1}>Custom Duration...</option>
                </select>
              )}
            </div>
          </div>

          {/* Session Objective */}
          <div>
            <label htmlFor="edit-objective" className="block text-2xs font-medium text-ink-2 mb-1">
              Session Objective / Notes
            </label>
            <input
              id="edit-objective"
              type="text"
              value={sessionObjective}
              onChange={(e) => setSessionObjective(e.target.value)}
              placeholder="e.g. Master formula derivations and solve 5 exam items"
              className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink placeholder:text-ink-3 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Focus Mode Enforced Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-line bg-surface-2/20 p-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-accent" />
              <div>
                <span className="block text-2xs font-semibold text-ink">
                  Focus Mode Enforced
                </span>
                <span className="text-3xs text-ink-3">
                  Fullscreen timer, distraction blocking, and audible break alerts.
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={focusModeEnforced}
                onChange={(e) => setFocusModeEnforced(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-line peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-line-strong after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green"></div>
            </label>
          </div>

          {/* Delete Confirmation Box */}
          {showDeleteConfirm && (
            <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 dark:border-red-900/50 dark:bg-red-950/20 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span>Delete this study schedule?</span>
              </div>
              <p className="text-2xs text-ink-3 mb-3">
                This will permanently remove &quot;{session.title}&quot; from your study planner.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-2xs font-medium text-white hover:bg-red-700 transition-colors shadow-xs"
                >
                  Yes, Delete Session
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg border border-line bg-surface px-3 py-1.5 text-2xs font-medium text-ink hover:bg-surface-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-5 pt-3 border-t border-line flex items-center justify-between">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 text-2xs text-red-600 hover:text-red-700 hover:underline p-1 font-medium transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              {onStartFocus && (
                <button
                  type="button"
                  onClick={() => {
                    onStartFocus(session);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2 text-2xs font-medium text-ink hover:bg-surface-2 transition-colors shadow-xs"
                >
                  <Play className="h-3 w-3 text-green fill-current" />
                  <span>Start Focus Now</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-line bg-surface px-3 py-2 text-2xs font-medium text-ink hover:bg-surface-2 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-green px-4 py-2 text-2xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
