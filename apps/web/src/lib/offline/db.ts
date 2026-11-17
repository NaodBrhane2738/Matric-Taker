import Dexie, { type Table } from 'dexie';
import type {
  StudentChapterProgress,
  StudySession,
  FocusSession,
  QuizAttempt,
  UserPreferences,
  SyncOperation,
} from '@matric/shared-types';

export interface LocalCurriculumCache {
  id: string; // e.g. 'master'
  version: string;
  data: any; // full curriculum JSON
  cachedAt: number;
}

export class MatricOfflineDB extends Dexie {
  curriculum!: Table<LocalCurriculumCache, string>;
  chapterProgress!: Table<StudentChapterProgress, string>;
  studySessions!: Table<StudySession, string>;
  focusSessions!: Table<FocusSession, string>;
  quizAttempts!: Table<QuizAttempt, string>;
  userPreferences!: Table<UserPreferences, string>;
  syncQueue!: Table<SyncOperation, string>;

  constructor() {
    super('MatricTrackerOfflineDB');
    this.version(1).stores({
      curriculum: 'id, version',
      chapterProgress: 'id, userId, chapterId, status, lastStudiedAt',
      studySessions: 'id, userId, grade, subjectId, status, startTime',
      focusSessions: 'id, userId, chapterId, startedAt',
      quizAttempts: 'id, userId, chapterId, createdAt',
      userPreferences: 'userId',
      syncQueue: 'operationId, entity, timestamp, retryCount',
    });
  }
}

export const offlineDb = new MatricOfflineDB();
