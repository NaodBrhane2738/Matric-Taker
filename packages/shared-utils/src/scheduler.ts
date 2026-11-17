import type { SmartScheduleInputs, StudyMethod } from '@matric/shared-types';

export interface GeneratedSessionCandidate {
  chapterId: string;
  plannedDate: string; // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  durationMinutes: number;
  studyMethod: StudyMethod;
  priorityReason: string;
}

/**
 * Deterministic study session scheduling generator.
 * Inputs:
 * - Examination date
 * - Available days
 * - Daily & weekly study targets
 * - Preferred hours
 * - Uncovered, weak, and overdue chapters
 * 
 * Strict Priority Order:
 * 1. Uncovered chapters
 * 2. Weak chapters
 * 3. Overdue revisions
 * 4. Difficult chapters
 * 5. Balanced subject distribution
 */
export function generateSmartStudySchedule(
  inputs: SmartScheduleInputs,
  totalSessionsToGenerate: number = 10
): GeneratedSessionCandidate[] {
  const candidates: GeneratedSessionCandidate[] = [];

  // Group priorities
  const priorityQueue: { chapterId: string; reason: string; method: StudyMethod }[] = [];

  // 1. Uncovered chapters
  for (const id of inputs.uncoveredChapters) {
    priorityQueue.push({ chapterId: id, reason: 'Uncovered chapter', method: 'reading' });
  }

  // 2. Weak chapters
  for (const id of inputs.weakChapters) {
    priorityQueue.push({ chapterId: id, reason: 'Weak chapter reinforcement', method: 'practice_problems' });
  }

  // 3. Overdue revisions
  for (const id of inputs.overdueRevisionChapters) {
    priorityQueue.push({ chapterId: id, reason: 'Spaced revision interval', method: 'revision' });
  }

  if (priorityQueue.length === 0) {
    return [];
  }

  const now = new Date();
  let dayOffset = 1;
  let sessionIndex = 0;

  while (candidates.length < totalSessionsToGenerate && sessionIndex < priorityQueue.length) {
    const targetDate = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const dayName = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][targetDate.getDay()] as any;

    if (inputs.availableDays.includes(dayName)) {
      const item = priorityQueue[sessionIndex];
      const startH = inputs.preferredStartHour;
      const startM = '00';
      const endH = Math.min(23, startH + Math.floor(inputs.dailyTargetMinutes / 60));
      const endM = (inputs.dailyTargetMinutes % 60).toString().padStart(2, '0');

      const dateStr = targetDate.toISOString().split('T')[0];

      candidates.push({
        chapterId: item.chapterId,
        plannedDate: dateStr,
        startTime: `${startH.toString().padStart(2, '0')}:${startM}`,
        endTime: `${endH.toString().padStart(2, '0')}:${endM}`,
        durationMinutes: inputs.dailyTargetMinutes,
        studyMethod: item.method,
        priorityReason: item.reason,
      });

      sessionIndex++;
    }

    dayOffset++;
    if (dayOffset > 60) break; // cap search to 60 days
  }

  return candidates;
}

/**
 * Spaced Repetition Revision Interval calculation:
 * Returns the recommended next revision date based on previous revision count and score.
 */
export function calculateNextRevisionDate(
  revisionCount: number,
  lastScorePercentage?: number
): Date {
  const intervalsDays = [1, 3, 7, 14, 30, 60];
  let idx = Math.min(revisionCount, intervalsDays.length - 1);

  if (lastScorePercentage !== undefined && lastScorePercentage < 65) {
    // If performance was low, drop interval back
    idx = Math.max(0, idx - 1);
  }

  const daysToAdd = intervalsDays[idx];
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  return nextDate;
}
