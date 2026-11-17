export type ReviewStatus = 'verified' | 'needs_review';
export type DocumentType = 'textbook' | 'syllabus' | 'curriculum_guide' | 'other';

export interface SourceDocument {
  id: string;
  filename: string;
  grade: 9 | 10 | 11 | 12;
  subject_id: string;
  document_type: DocumentType;
}

export interface SourceRef {
  document_id: string;
  pdf_page_start: number;
  pdf_page_end: number;
  printed_page_label?: string;
}

export interface Subtopic {
  id: string;
  number: string;
  title: string;
  order: number;
  review_status: ReviewStatus;
  source_refs?: SourceRef[];
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  order: number;
  review_status: ReviewStatus;
  source_refs?: SourceRef[];
  prerequisite_ids?: string[];
  subtopics?: Subtopic[];
}

export interface Unit {
  id: string;
  number: string;
  title: string;
  order: number;
  review_status: ReviewStatus;
  source_refs?: SourceRef[];
  chapters: Chapter[];
}

export interface Subject {
  id: string;
  name: string;
  order: number;
  review_status: ReviewStatus;
  source_refs?: SourceRef[];
  units: Unit[];
}

export interface GradeCurriculum {
  grade: 9 | 10 | 11 | 12;
  subjects: Subject[];
}

export interface CurriculumRoot {
  schema_version: '1.0.0';
  curriculum: {
    id: string;
    name: string;
    country_code: 'ET';
    language: 'en' | 'am';
    source_documents: SourceDocument[];
    grades: GradeCurriculum[];
  };
}
