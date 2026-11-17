'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Clock, BookOpen, ShieldCheck, Flame } from 'lucide-react';
import type { CurriculumRoot, GradeCurriculum } from '@matric/curriculum-schema';

interface ScheduleStudyModalProps {
  isOpen: boolean;
  curriculum: CurriculumRoot | null;
  onClose: () => void;
  onSchedule: (sessionData: {
    grade: number;
    subjectId: string;
    subjectName: string;
    unitTitle: string;
    chapterRange: string;
    scheduledDateTime: string;
    durationMinutes: number;
    focusModeEnforced: boolean;
  }) => void;
}

export function ScheduleStudyModal({
  isOpen,
  curriculum,
  onClose,
  onSchedule,
}: ScheduleStudyModalProps) {
  const [grade, setGrade] = useState<number>(12);
  const [subjectId, setSubjectId] = useState<string>('');
  const [fromUnitId, setFromUnitId] = useState<string>('');
  const [toUnitId, setToUnitId] = useState<string>('');
  const [startChapter, setStartChapter] = useState<string>('');
  const [endChapter, setEndChapter] = useState<string>('');
  const [scheduledDateTime, setScheduledDateTime] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);
  const [focusModeEnforced, setFocusModeEnforced] = useState<boolean>(true);

  // Set default scheduled date/time 24 hours ahead from current date/time
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
      tomorrow.setHours(9, 0, 0, 0); // Default 9:00 AM tomorrow
      const formatted = tomorrow.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
      setScheduledDateTime(formatted);
    }
  }, [isOpen]);

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

  const currentSubjectObj =
    availableSubjects.find((s) => s.id === subjectId) || availableSubjects[0];
  const availableUnits = currentSubjectObj?.units || [];

  const fromUnitObj = availableUnits.find((u) => u.id === fromUnitId) || availableUnits[0];
  const toUnitObj = availableUnits.find((u) => u.id === toUnitId) || fromUnitObj;

  const fromUnitChapters = fromUnitObj?.chapters || [];
  const toUnitChapters = toUnitObj?.chapters || [];

  // Initialize/sync state on open or grade change
  useEffect(() => {
    if (isOpen && availableSubjects.length > 0) {
      const activeSubj =
        availableSubjects.find((s) => s.id === subjectId) || availableSubjects[0];
      setSubjectId(activeSubj.id);

      const activeUnits = activeSubj.units || [];
      if (activeUnits.length > 0) {
        const u = activeUnits.find((unit) => unit.id === fromUnitId) || activeUnits[0];
        setFromUnitId(u.id);
        setToUnitId(u.id);

        if (u.chapters && u.chapters.length > 0) {
          setStartChapter(u.chapters[0].title);
          setEndChapter(u.chapters[u.chapters.length - 1].title);
        }
      }
    }
  }, [isOpen, grade, availableSubjects.length]);

  const handleGradeChange = (newGrade: number) => {
    setGrade(newGrade);
    const gr = gradesList.find((g) => g.grade === newGrade);
    const subjs = gr?.subjects || [];
    if (subjs.length > 0) {
      const s = subjs[0];
      setSubjectId(s.id);
      const units = s.units || [];
      if (units.length > 0) {
        const u = units[0];
        setFromUnitId(u.id);
        setToUnitId(u.id);
        if (u.chapters && u.chapters.length > 0) {
          setStartChapter(u.chapters[0].title);
          setEndChapter(u.chapters[u.chapters.length - 1].title);
        }
      }
    }
  };

  const handleSubjectChange = (newSubjectId: string) => {
    setSubjectId(newSubjectId);
    const s = availableSubjects.find((subj) => subj.id === newSubjectId);
    const units = s?.units || [];
    if (units.length > 0) {
      const u = units[0];
      setFromUnitId(u.id);
      setToUnitId(u.id);
      if (u.chapters && u.chapters.length > 0) {
        setStartChapter(u.chapters[0].title);
        setEndChapter(u.chapters[u.chapters.length - 1].title);
      }
    }
  };

  const handleFromUnitChange = (newUnitId: string) => {
    setFromUnitId(newUnitId);
    const u = availableUnits.find((unit) => unit.id === newUnitId);
    if (u && u.chapters && u.chapters.length > 0) {
      setStartChapter(u.chapters[0].title);
    }
    // Automatically sync To Unit to the same unit for seamless single-unit scheduling
    setToUnitId(newUnitId);
    if (u && u.chapters && u.chapters.length > 0) {
      setEndChapter(u.chapters[u.chapters.length - 1].title);
    }
  };

  const handleToUnitChange = (newUnitId: string) => {
    setToUnitId(newUnitId);
    const u = availableUnits.find((unit) => unit.id === newUnitId);
    if (u && u.chapters && u.chapters.length > 0) {
      setEndChapter(u.chapters[u.chapters.length - 1].title);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isSameUnit = fromUnitObj?.id === toUnitObj?.id;
    const unitTitle = isSameUnit
      ? fromUnitObj?.title || 'Unit'
      : `${fromUnitObj?.title || 'Unit'} to ${toUnitObj?.title || 'Unit'}`;

    const chapterRange = isSameUnit
      ? `${fromUnitObj?.title || 'Unit'}: ${startChapter} → ${endChapter}`
      : `From ${fromUnitObj?.title || 'Unit'} [${startChapter}] to ${toUnitObj?.title || 'Unit'} [${endChapter}]`;

    onSchedule({
      grade,
      subjectId: currentSubjectObj?.id || 'subject',
      subjectName: currentSubjectObj?.name || 'Subject',
      unitTitle,
      chapterRange,
      scheduledDateTime,
      durationMinutes,
      focusModeEnforced,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-study-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-surface p-6 shadow-xl border border-line animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-ink-3 hover:text-ink transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green/10 text-green">
            <Calendar className="h-4 w-4" />
          </div>
          <h2 id="schedule-study-title" className="text-base font-semibold text-ink">
            Schedule Study Session
          </h2>
        </div>
        <p className="text-xs text-ink-3">
          Plan specific curriculum chapters and commit to focused study.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Row 1: Grade and Subject */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sched-grade" className="block text-2xs font-medium text-ink-2 mb-1">
                Grade
              </label>
              <select
                id="sched-grade"
                value={grade}
                onChange={(e) => handleGradeChange(Number(e.target.value))}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value={9}>Grade 9</option>
                <option value={10}>Grade 10</option>
                <option value={11}>Grade 11</option>
                <option value={12}>Grade 12 (National Exam)</option>
              </select>
            </div>

            <div>
              <label htmlFor="sched-subject" className="block text-2xs font-medium text-ink-2 mb-1">
                Subject
              </label>
              <select
                id="sched-subject"
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
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

          {/* Row 2: Starting Unit and Chapter */}
          <div className="rounded-xl border border-line/70 bg-surface-2/30 p-3 space-y-2.5">
            <span className="text-3xs font-semibold text-green uppercase tracking-wider block">
              Starting Point
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="sched-from-unit" className="block text-3xs font-medium text-ink-3 mb-1">
                  From Unit
                </label>
                <select
                  id="sched-from-unit"
                  value={fromUnitId}
                  onChange={(e) => handleFromUnitChange(e.target.value)}
                  className="w-full rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {availableUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sched-from-ch" className="block text-3xs font-medium text-ink-3 mb-1">
                  From Chapter / Subtopic
                </label>
                <select
                  id="sched-from-ch"
                  value={startChapter}
                  onChange={(e) => setStartChapter(e.target.value)}
                  className="w-full rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {fromUnitChapters.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: Ending Unit and Chapter */}
          <div className="rounded-xl border border-line/70 bg-surface-2/30 p-3 space-y-2.5">
            <span className="text-3xs font-semibold text-accent uppercase tracking-wider block">
              Ending Point (Study Target)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="sched-to-unit" className="block text-3xs font-medium text-ink-3 mb-1">
                  To Unit
                </label>
                <select
                  id="sched-to-unit"
                  value={toUnitId}
                  onChange={(e) => handleToUnitChange(e.target.value)}
                  className="w-full rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {availableUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sched-to-ch" className="block text-3xs font-medium text-ink-3 mb-1">
                  To Chapter / Subtopic
                </label>
                <select
                  id="sched-to-ch"
                  value={endChapter}
                  onChange={(e) => setEndChapter(e.target.value)}
                  className="w-full rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {toUnitChapters.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 4: Date, Time & Expected Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sched-datetime" className="block text-2xs font-medium text-ink-2 mb-1">
                Date &amp; Time (24h Ahead by Default)
              </label>
              <input
                id="sched-datetime"
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="sched-duration" className="block text-2xs font-medium text-ink-2">
                  Expected Duration
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomDuration(!isCustomDuration)}
                  className="text-3xs text-green hover:underline font-medium"
                >
                  {isCustomDuration ? 'Use Presets' : 'Custom Duration'}
                </button>
              </div>

              {isCustomDuration ? (
                <div className="relative">
                  <input
                    id="sched-duration-custom"
                    type="number"
                    min={5}
                    max={720}
                    step={5}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Math.max(5, Number(e.target.value)))}
                    className="w-full rounded-xl border border-line bg-canvas pl-3 pr-16 py-2 text-ink text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Minutes (e.g. 75)"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-2xs text-ink-3 pointer-events-none">
                    minutes
                  </span>
                </div>
              ) : (
                <select
                  id="sched-duration"
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
                  <option value={25}>25 minutes (Pomodoro Sprint)</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour (Recommended)</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours (Deep Work)</option>
                  <option value={-1}>Custom Duration (enter minutes)...</option>
                </select>
              )}
            </div>
          </div>

          {/* Row 5: Focus Mode Enforced Switch */}
          <div className="flex items-center justify-between rounded-xl border border-line bg-canvas/60 p-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-accent" />
              <div>
                <span className="font-semibold text-ink block text-xs">Focus Mode Enforced</span>
                <span className="text-3xs text-ink-3 block">
                  Activate website blocking and strict interruption tracking during this session.
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={focusModeEnforced}
              onClick={() => setFocusModeEnforced(!focusModeEnforced)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                focusModeEnforced ? 'bg-green' : 'bg-line-strong'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  focusModeEnforced ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-line/60">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line bg-canvas px-4 py-2 text-xs font-medium text-ink hover:bg-surface-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-green px-5 py-2 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs"
            >
              Schedule Study Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
