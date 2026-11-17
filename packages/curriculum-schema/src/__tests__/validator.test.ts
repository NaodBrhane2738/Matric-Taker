import { describe, it, expect } from 'vitest';
import { validateCurriculumJson } from '../validator';
import fs from 'fs';
import path from 'path';

describe('Curriculum Schema Validator', () => {
  it('validates the official sample curriculum successfully', () => {
    const samplePath = path.resolve(__dirname, '../../../../samples/curriculum-example.json');
    const content = JSON.parse(fs.readFileSync(samplePath, 'utf8'));

    const result = validateCurriculumJson(content);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.stats?.subjectsCount).toBe(1);
    expect(result.stats?.unitsCount).toBe(1);
    expect(result.stats?.chaptersCount).toBe(2);
  });

  it('rejects JSON with duplicate IDs', () => {
    const invalidData = {
      schema_version: '1.0.0',
      curriculum: {
        id: 'test-curriculum',
        name: 'Test Curriculum',
        country_code: 'ET',
        language: 'en',
        source_documents: [
          {
            id: 'doc-1',
            filename: 'test.pdf',
            grade: 9,
            subject_id: 'g09-biology',
            document_type: 'textbook',
          },
        ],
        grades: [
          {
            grade: 9,
            subjects: [
              {
                id: 'g09-biology',
                name: 'Biology',
                order: 1,
                review_status: 'verified',
                units: [
                  {
                    id: 'g09-biology-u01',
                    number: '1',
                    title: 'Unit 1',
                    order: 1,
                    review_status: 'verified',
                    chapters: [
                      {
                        id: 'g09-biology-u01-c01',
                        number: '1.1',
                        title: 'Chapter 1',
                        order: 1,
                        review_status: 'verified',
                      },
                      {
                        id: 'g09-biology-u01-c01', // Duplicate!
                        number: '1.2',
                        title: 'Chapter 2',
                        order: 2,
                        review_status: 'verified',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    const result = validateCurriculumJson(invalidData);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Duplicate chapter ID'))).toBe(true);
  });

  it('rejects self-referencing prerequisites or broken prerequisite IDs', () => {
    const brokenPrereq = {
      schema_version: '1.0.0',
      curriculum: {
        id: 'test-curriculum',
        name: 'Test Curriculum',
        country_code: 'ET',
        language: 'en',
        source_documents: [],
        grades: [
          {
            grade: 9,
            subjects: [
              {
                id: 'g09-biology',
                name: 'Biology',
                order: 1,
                review_status: 'verified',
                units: [
                  {
                    id: 'g09-biology-u01',
                    number: '1',
                    title: 'Unit 1',
                    order: 1,
                    review_status: 'verified',
                    chapters: [
                      {
                        id: 'g09-biology-u01-c01',
                        number: '1.1',
                        title: 'Chapter 1',
                        order: 1,
                        review_status: 'verified',
                        prerequisite_ids: ['g09-biology-u01-c01'], // Self referencing!
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    const result = validateCurriculumJson(brokenPrereq);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('cannot declare itself as a prerequisite'))).toBe(true);
  });
});
