import { z } from 'zod';
import type { CurriculumRoot } from './types';

export const SourceDocumentSchema = z.object({
  id: z.string().regex(/^[a-z0-9_-]+$/, 'Invalid document ID format'),
  filename: z.string().min(1),
  grade: z.union([z.literal(9), z.literal(10), z.literal(11), z.literal(12)]),
  subject_id: z.string().regex(/^[a-z0-9_-]+$/),
  document_type: z.enum(['textbook', 'syllabus', 'curriculum_guide', 'other']),
});

export const SourceRefSchema = z.object({
  document_id: z.string().regex(/^[a-z0-9_-]+$/),
  pdf_page_start: z.number().int().min(1),
  pdf_page_end: z.number().int().min(1),
  printed_page_label: z.string().optional(),
});

export const SubtopicSchema = z.object({
  id: z.string().regex(/^g(09|10|11|12)-[a-z0-9_-]+-u[0-9]{2,}-c[0-9]{2,}-s[0-9]{2,}$/),
  number: z.string(),
  title: z.string().min(1),
  order: z.number().int().min(1),
  review_status: z.enum(['verified', 'needs_review']),
  source_refs: z.array(SourceRefSchema).optional().default([]),
});

export const ChapterSchema = z.object({
  id: z.string().regex(/^g(09|10|11|12)-[a-z0-9_-]+-u[0-9]{2,}-c[0-9]{2,}$/),
  number: z.string(),
  title: z.string().min(1),
  order: z.number().int().min(1),
  review_status: z.enum(['verified', 'needs_review']),
  source_refs: z.array(SourceRefSchema).optional().default([]),
  prerequisite_ids: z.array(z.string()).optional().default([]),
  subtopics: z.array(SubtopicSchema).optional().default([]),
});

export const UnitSchema = z.object({
  id: z.string().regex(/^g(09|10|11|12)-[a-z0-9_-]+-u[0-9]{2,}$/),
  number: z.string(),
  title: z.string().min(1),
  order: z.number().int().min(1),
  review_status: z.enum(['verified', 'needs_review']),
  source_refs: z.array(SourceRefSchema).optional().default([]),
  chapters: z.array(ChapterSchema),
});

export const SubjectSchema = z.object({
  id: z.string().regex(/^g(09|10|11|12)-[a-z0-9_-]+$/),
  name: z.string().min(1),
  order: z.number().int().min(1),
  review_status: z.enum(['verified', 'needs_review']),
  source_refs: z.array(SourceRefSchema).optional().default([]),
  units: z.array(UnitSchema),
});

export const GradeCurriculumSchema = z.object({
  grade: z.union([z.literal(9), z.literal(10), z.literal(11), z.literal(12)]),
  subjects: z.array(SubjectSchema),
});

export const CurriculumRootSchema = z.object({
  schema_version: z.literal('1.0.0'),
  curriculum: z.object({
    id: z.string().regex(/^[a-z0-9_-]+$/),
    name: z.string().min(3),
    country_code: z.literal('ET'),
    language: z.enum(['en', 'am']),
    source_documents: z.array(SourceDocumentSchema),
    grades: z.array(GradeCurriculumSchema),
  }),
});

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  stats?: {
    gradesCount: number;
    subjectsCount: number;
    unitsCount: number;
    chaptersCount: number;
    subtopicsCount: number;
    sourceDocumentsCount: number;
  };
}

export function validateCurriculumJson(json: unknown): ValidationResult {
  const parseResult = CurriculumRootSchema.safeParse(json);
  if (!parseResult.success) {
    return {
      valid: false,
      errors: parseResult.error.errors.map(
        (err) => `${err.path.join('.') || 'root'}: ${err.message}`
      ),
    };
  }

  const data = parseResult.data as CurriculumRoot;
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const chapterIds = new Set<string>();
  const docIds = new Set<string>(data.curriculum.source_documents.map((d) => d.id));

  // Check unique doc IDs
  const seenDocIds = new Set<string>();
  for (const doc of data.curriculum.source_documents) {
    if (seenDocIds.has(doc.id)) {
      errors.push(`Duplicate source_document ID: "${doc.id}"`);
    }
    seenDocIds.add(doc.id);
  }

  let unitsCount = 0;
  let chaptersCount = 0;
  let subtopicsCount = 0;
  let subjectsCount = 0;

  // First pass: collect IDs and verify uniqueness
  for (const gradeItem of data.curriculum.grades) {
    for (const subject of gradeItem.subjects) {
      subjectsCount++;
      if (seenIds.has(subject.id)) {
        errors.push(`Duplicate subject ID: "${subject.id}"`);
      }
      seenIds.add(subject.id);

      for (const unit of subject.units) {
        unitsCount++;
        if (seenIds.has(unit.id)) {
          errors.push(`Duplicate unit ID: "${unit.id}"`);
        }
        seenIds.add(unit.id);

        for (const chapter of unit.chapters) {
          chaptersCount++;
          if (seenIds.has(chapter.id)) {
            errors.push(`Duplicate chapter ID: "${chapter.id}"`);
          }
          seenIds.add(chapter.id);
          chapterIds.add(chapter.id);

          if (chapter.subtopics) {
            for (const sub of chapter.subtopics) {
              subtopicsCount++;
              if (seenIds.has(sub.id)) {
                errors.push(`Duplicate subtopic ID: "${sub.id}"`);
              }
              seenIds.add(sub.id);
            }
          }
        }
      }
    }
  }

  // Second pass: verify source refs and prerequisites
  for (const gradeItem of data.curriculum.grades) {
    for (const subject of gradeItem.subjects) {
      // Validate source references
      for (const ref of subject.source_refs || []) {
        if (!docIds.has(ref.document_id)) {
          errors.push(`Subject "${subject.id}" references non-existent document ID "${ref.document_id}"`);
        }
        if (ref.pdf_page_start > ref.pdf_page_end) {
          errors.push(`Subject "${subject.id}" has invalid page range: start (${ref.pdf_page_start}) > end (${ref.pdf_page_end})`);
        }
      }

      for (const unit of subject.units) {
        for (const ref of unit.source_refs || []) {
          if (!docIds.has(ref.document_id)) {
            errors.push(`Unit "${unit.id}" references non-existent document ID "${ref.document_id}"`);
          }
        }

        for (const chapter of unit.chapters) {
          for (const ref of chapter.source_refs || []) {
            if (!docIds.has(ref.document_id)) {
              errors.push(`Chapter "${chapter.id}" references non-existent document ID "${ref.document_id}"`);
            }
          }

          // Validate prerequisites
          for (const prereqId of chapter.prerequisite_ids || []) {
            if (!chapterIds.has(prereqId)) {
              errors.push(`Chapter "${chapter.id}" references non-existent prerequisite chapter ID "${prereqId}"`);
            }
            if (prereqId === chapter.id) {
              errors.push(`Chapter "${chapter.id}" cannot declare itself as a prerequisite`);
            }
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    stats: {
      gradesCount: data.curriculum.grades.length,
      subjectsCount,
      unitsCount,
      chaptersCount,
      subtopicsCount,
      sourceDocumentsCount: data.curriculum.source_documents.length,
    },
  };
}
