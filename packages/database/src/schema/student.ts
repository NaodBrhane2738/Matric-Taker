import { pgTable, text, integer, timestamp, boolean, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { chapters } from './curriculum';

export const studentChapterProgress = pgTable('student_chapter_progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  status: text('status', {
    enum: ['not_started', 'learning', 'studied', 'practicing', 'mastered', 'needs_revision'],
  }).default('not_started').notNull(),
  difficultyRating: integer('difficulty_rating'), // 1-5
  personalNotes: text('personal_notes'),
  assessmentScoreAverage: integer('assessment_score_average'),
  revisionCount: integer('revision_count').default(0).notNull(),
  lastStudiedAt: timestamp('last_studied_at', { withTimezone: true }),
  masteredAt: timestamp('mastered_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('user_chapter_unique_idx').on(table.userId, table.chapterId),
  index('progress_user_id_idx').on(table.userId),
  index('progress_status_idx').on(table.status),
]);

export const studySessions = pgTable('study_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  grade: integer('grade').notNull(),
  subjectId: text('subject_id').notNull(),
  unitIds: jsonb('unit_ids').$type<string[]>().default([]).notNull(),
  chapterIds: jsonb('chapter_ids').$type<string[]>().default([]).notNull(),
  subtopicIds: jsonb('subtopic_ids').$type<string[]>().default([]),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  plannedDurationMinutes: integer('planned_duration_minutes').notNull(),
  actualDurationMinutes: integer('actual_duration_minutes'),
  breakDurationMinutes: integer('break_duration_minutes').default(0),
  studyMethod: text('study_method', {
    enum: ['reading', 'active_recall', 'practice_problems', 'flashcards', 'summary_writing', 'revision'],
  }).default('reading').notNull(),
  sessionObjective: text('session_objective'),
  notes: text('notes'),
  status: text('status', {
    enum: ['planned', 'in_progress', 'completed', 'missed', 'cancelled', 'rescheduled'],
  }).default('planned').notNull(),
  recurrenceRule: text('recurrence_rule'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('study_sessions_user_id_idx').on(table.userId),
  index('study_sessions_start_time_idx').on(table.startTime),
]);

export const focusSessions = pgTable('focus_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: text('chapter_id'),
  mode: text('mode', { enum: ['pomodoro', 'deep_work', 'custom'] }).default('pomodoro').notNull(),
  plannedSeconds: integer('planned_seconds').notNull(),
  actualFocusedSeconds: integer('actual_focused_seconds').default(0).notNull(),
  breakSeconds: integer('break_seconds').default(0).notNull(),
  interruptionCount: integer('interruption_count').default(0).notNull(),
  tabSwitchCount: integer('tab_switch_count').default(0).notNull(),
  completed: boolean('completed').default(false).notNull(),
  xpEarned: integer('xp_earned').default(0).notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  notes: text('notes'),
}, (table) => [
  index('focus_sessions_user_id_idx').on(table.userId),
  index('focus_sessions_started_at_idx').on(table.startedAt),
]);

export const quizQuestions = pgTable('quiz_questions', {
  id: text('id').primaryKey(),
  chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  options: jsonb('options').$type<string[]>().notNull(),
  correctOptionIndex: integer('correct_option_index').notNull(),
  explanation: text('explanation').notNull(),
  difficulty: integer('difficulty').default(2).notNull(), // 1, 2, 3
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('quiz_questions_chapter_idx').on(table.chapterId),
]);

export const quizAttempts = pgTable('quiz_attempts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  totalQuestions: integer('total_questions').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  scorePercentage: integer('score_percentage').notNull(),
  timeSpentSeconds: integer('time_spent_seconds').notNull(),
  passed: boolean('passed').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('quiz_attempts_user_id_idx').on(table.userId),
  index('quiz_attempts_chapter_idx').on(table.chapterId),
]);

export const userPreferences = pgTable('user_preferences', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  language: text('language', { enum: ['en', 'am'] }).default('en').notNull(),
  calendarPreference: text('calendar_preference', { enum: ['gregorian', 'ethiopian'] }).default('gregorian').notNull(),
  theme: text('theme', { enum: ['light', 'dark', 'system'] }).default('light').notNull(),
  sidebarPinned: jsonb('sidebar_pinned').$type<string[]>().default(['overview', 'all_units', 'study_planner', 'focus_mode', 'my_mastery', 'analytics']),
  sidebarHidden: jsonb('sidebar_hidden').$type<string[]>().default([]),
  sidebarOrder: jsonb('sidebar_order').$type<string[]>().default(['overview', 'all_units', 'study_planner', 'focus_mode', 'my_mastery', 'analytics']),
  dailyStudyGoalMinutes: integer('daily_study_goal_minutes').default(120).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const extensionTokens = pgTable('extension_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  name: text('name').default('Browser Extension').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('ext_tokens_user_id_idx').on(table.userId),
]);

export const blockedRules = pgTable('blocked_rules', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  domain: text('domain').notNull(), // e.g. 'youtube.com', 'tiktok.com'
  isBlocked: boolean('is_blocked').default(true).notNull(),
  allowlisted: boolean('allowlisted').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('blocked_rules_user_id_idx').on(table.userId),
]);

export const syncQueue = pgTable('sync_queue', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  operationId: text('operation_id').notNull().unique(),
  entity: text('entity').notNull(),
  action: text('action', { enum: ['CREATE', 'UPDATE', 'DELETE'] }).notNull(),
  payload: jsonb('payload').notNull(),
  status: text('status', { enum: ['pending', 'synced', 'failed'] }).default('pending').notNull(),
  retryCount: integer('retry_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
