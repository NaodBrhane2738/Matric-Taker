import type {
  ChapterStudyStatus,
  PerformanceMetrics,
  StudentChapterProgress,
} from '@matric/shared-types';

export const MASTERY_THRESHOLD_PERCENT = 75; // Assessment score minimum to qualify for Mastery
export const PASSING_ATTEMPTS_REQUIRED = 1;

/**
 * Validates whether a chapter can transition to 'mastered'.
 * In accordance with product specification:
 * "Mastered must require assessment evidence. Do not permit checkbox-only mastery."
 */
export function canMarkMastered(
  status: ChapterStudyStatus,
  assessmentAverage?: number,
  attemptsCount: number = 0
): boolean {
  if (attemptsCount < PASSING_ATTEMPTS_REQUIRED) {
    return false;
  }
  if (assessmentAverage === undefined || assessmentAverage < MASTERY_THRESHOLD_PERCENT) {
    return false;
  }
  return true;
}

/**
 * Calculates the three distinct, independent performance dimensions:
 * 1. Curriculum Coverage = (studied + practicing + mastered) / totalChapters
 * 2. Knowledge Mastery = masteredChapters / totalChapters (verified by quizzes)
 * 3. Examination Readiness = composite weighting:
 *    - 50% Mastery score
 *    - 30% Coverage score
 *    - 20% Retention / Recency factor (penalizing chapters needing revision)
 */
export function calculatePerformanceDimensions(
  totalChapters: number,
  progressRecords: StudentChapterProgress[],
  totalUnits: number = 99
): PerformanceMetrics {
  if (totalChapters === 0) {
    return {
      totalChapters: 0,
      studiedChapters: 0,
      masteredChapters: 0,
      needsRevisionChapters: 0,
      curriculumCoveragePercentage: 0,
      knowledgeMasteryPercentage: 0,
      examinationReadinessPercentage: 0,
      gradeBreakdown: {},
    };
  }

  let studiedCount = 0;
  let masteredCount = 0;
  let needsRevisionCount = 0;

  for (const record of progressRecords) {
    if (
      record.status === 'studied' ||
      record.status === 'practicing' ||
      record.status === 'mastered'
    ) {
      studiedCount++;
    }
    if (record.status === 'mastered') {
      masteredCount++;
    }
    if (record.status === 'needs_revision') {
      needsRevisionCount++;
    }
  }

  const coverage = Math.min(100, Math.round((studiedCount / totalChapters) * 100));
  const mastery = Math.min(100, Math.round((masteredCount / totalChapters) * 100));

  // Readiness deduction for stale / needs-revision material.
  // If no chapters have been studied yet, readiness is 0% by default for accurate clean slate.
  let readiness = 0;
  if (studiedCount > 0) {
    const revisionPenalty = totalChapters > 0 ? (needsRevisionCount / totalChapters) * 20 : 0;
    const retentionFactor = Math.max(0, 100 - revisionPenalty * 5) * (studiedCount / totalChapters);
    const rawReadiness = 0.5 * mastery + 0.3 * coverage + 0.2 * retentionFactor;
    readiness = Math.min(100, Math.max(0, Math.round(rawReadiness)));
  }

  return {
    totalChapters,
    studiedChapters: studiedCount,
    masteredChapters: masteredCount,
    needsRevisionChapters: needsRevisionCount,
    curriculumCoveragePercentage: coverage,
    knowledgeMasteryPercentage: mastery,
    examinationReadinessPercentage: readiness,
    gradeBreakdown: {},
  };
}

/**
 * Identifies weak chapters based on low assessment scores, high difficulty rating, or multiple failed attempts.
 */
export function identifyWeakChapters(
  progressRecords: StudentChapterProgress[]
): { chapterId: string; reason: string; severity: 'high' | 'medium' }[] {
  const weak: { chapterId: string; reason: string; severity: 'high' | 'medium' }[] = [];

  for (const p of progressRecords) {
    if (p.status === 'needs_revision') {
      weak.push({
        chapterId: p.chapterId,
        reason: 'Marked for spaced revision',
        severity: 'medium',
      });
    } else if (p.assessmentScoreAverage !== undefined && p.assessmentScoreAverage < 60) {
      weak.push({
        chapterId: p.chapterId,
        reason: `Low quiz average (${p.assessmentScoreAverage}%)`,
        severity: 'high',
      });
    } else if (p.difficultyRating && p.difficultyRating >= 4) {
      weak.push({
        chapterId: p.chapterId,
        reason: `Rated high difficulty (${p.difficultyRating}/5)`,
        severity: 'medium',
      });
    }
  }

  return weak;
}
