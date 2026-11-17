import { pgTable, text, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

export const curricula = pgTable('curricula', {
  id: text('id').primaryKey(), // e.g. ethiopia-national-exam-g9-g12
  name: text('name').notNull(),
  version: text('version').default('1.0.0').notNull(),
  countryCode: text('country_code').default('ET').notNull(),
  language: text('language').default('en').notNull(),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).default('draft').notNull(),
  rawJson: jsonb('raw_json').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const sourceDocuments = pgTable('source_documents', {
  id: text('id').primaryKey(),
  curriculumId: text('curriculum_id').notNull().references(() => curricula.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  grade: integer('grade').notNull(),
  subjectId: text('subject_id').notNull(),
  documentType: text('document_type').default('textbook').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const subjects = pgTable('subjects', {
  id: text('id').primaryKey(), // e.g. g09-biology
  curriculumId: text('curriculum_id').notNull().references(() => curricula.id, { onDelete: 'cascade' }),
  grade: integer('grade').notNull(), // 9, 10, 11, 12
  name: text('name').notNull(),
  displayOrder: integer('display_order').notNull(),
  reviewStatus: text('review_status', { enum: ['verified', 'needs_review'] }).default('verified').notNull(),
  sourceRefs: jsonb('source_refs').$type<any[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('subjects_grade_idx').on(table.grade),
]);

export const units = pgTable('units', {
  id: text('id').primaryKey(), // e.g. g09-biology-u01
  subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  number: text('number').notNull(), // e.g. '1'
  title: text('title').notNull(),
  displayOrder: integer('display_order').notNull(),
  reviewStatus: text('review_status', { enum: ['verified', 'needs_review'] }).default('verified').notNull(),
  sourceRefs: jsonb('source_refs').$type<any[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('units_subject_id_idx').on(table.subjectId),
]);

export const chapters = pgTable('chapters', {
  id: text('id').primaryKey(), // e.g. g09-biology-u01-c01
  unitId: text('unitId').notNull().references(() => units.id, { onDelete: 'cascade' }),
  number: text('number').notNull(), // e.g. '1.1'
  title: text('title').notNull(),
  displayOrder: integer('display_order').notNull(),
  reviewStatus: text('review_status', { enum: ['verified', 'needs_review'] }).default('verified').notNull(),
  sourceRefs: jsonb('source_refs').$type<any[]>().default([]),
  prerequisiteIds: jsonb('prerequisite_ids').$type<string[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('chapters_unit_id_idx').on(table.unitId),
]);

export const subtopics = pgTable('subtopics', {
  id: text('id').primaryKey(), // e.g. g09-biology-u01-c01-s01
  chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  number: text('number').notNull(),
  title: text('title').notNull(),
  displayOrder: integer('display_order').notNull(),
  reviewStatus: text('review_status', { enum: ['verified', 'needs_review'] }).default('verified').notNull(),
  sourceRefs: jsonb('source_refs').$type<any[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('subtopics_chapter_id_idx').on(table.chapterId),
]);
