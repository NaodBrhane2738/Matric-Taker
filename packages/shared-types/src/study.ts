export type SessionStatus =
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'missed'
  | 'cancelled'
  | 'rescheduled';

export type StudyMethod =
  | 'reading'
  | 'active_recall'
  | 'practice_problems'
  | 'flashcards'
  | 'summary_writing'
  | 'revision';

export interface StudySession {
  id: string;
  userId: string;
  title: string;
  grade: 9 | 10 | 11 | 12;
  subjectId: string;
  unitIds: string[];
  chapterIds: string[];
  subtopicIds?: string[];
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  plannedDurationMinutes: number;
  actualDurationMinutes?: number;
  breakDurationMinutes?: number;
  studyMethod: StudyMethod;
  sessionObjective?: string;
  notes?: string;
  status: SessionStatus;
  recurrenceRule?: string; // e.g. 'FREQ=WEEKLY;BYDAY=MO,WE,FR'
  createdAt: string;
  updatedAt: string;
}

export interface SmartScheduleInputs {
  examinationDate: string; // ISO string
  availableDays: ('MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU')[];
  dailyTargetMinutes: number;
  weeklyTargetMinutes: number;
  preferredStartHour: number; // 0-23
  preferredEndHour: number;
  uncoveredChapters: string[];
  weakChapters: string[];
  overdueRevisionChapters: string[];
}
