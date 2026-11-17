export type ChapterStudyStatus =
  | 'not_started'
  | 'learning'
  | 'studied'
  | 'practicing'
  | 'mastered'
  | 'needs_revision';

export type DifficultyRating = 1 | 2 | 3 | 4 | 5;

export interface StudentChapterProgress {
  id: string;
  userId: string;
  chapterId: string;
  status: ChapterStudyStatus;
  difficultyRating?: DifficultyRating;
  personalNotes?: string;
  lastStudiedAt?: string;
  masteredAt?: string;
  revisionCount: number;
  assessmentScoreAverage?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * The 3 Independent Performance Dimensions:
 * 1. Coverage: Proportion of curriculum that has been studied/read.
 * 2. Mastery: Proportion of curriculum validated with passing assessment scores.
 * 3. Exam Readiness: Composite readiness index based on mastery, retention, and recent practice.
 */
export interface PerformanceMetrics {
  totalChapters: number;
  studiedChapters: number;
  masteredChapters: number;
  needsRevisionChapters: number;
  
  // Dimensions (0.0 to 100.0)
  curriculumCoveragePercentage: number;
  knowledgeMasteryPercentage: number;
  examinationReadinessPercentage: number;
  
  // Grade-level breakdown
  gradeBreakdown: Record<number, {
    totalUnits: number;
    completedUnits: number;
    totalChapters: number;
    studiedChapters: number;
    masteredChapters: number;
    coveragePercentage: number;
    masteryPercentage: number;
  }>;
}
