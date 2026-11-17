# CURRICULUM EXTRACTION AGENT — ETHIOPIAN GRADES 9–12
## Master Extraction & Validation Agent Specification

### Overview
This prompt guides automated and human agents in inspecting official Ethiopian Grade 9–12 secondary textbook PDFs and producing standardized, verified JSON curriculum data conforming to `curriculum.schema.json` (version 1.0.0).

---

### 1. Extraction Mandate
1. **Authoritative Source Hierarchy:**
   - The PDF textbooks in the curriculum library are the single source of truth.
   - Extract the curriculum hierarchy:
     `Grade` → `Subject` → `Unit` → `Chapter` → `Subtopic`.
2. **Preserve Exact Source Strings:**
   - Preserve original titles, numbering, casing, and sequence.
   - Do NOT abbreviate, paraphrase, or invent missing chapters.
3. **Traceable Source References:**
   - Every unit and chapter must include:
     - `document_id`: unique identifier for the PDF
     - `pdf_page_start`: 1-based physical PDF page number
     - `pdf_page_end`: 1-based physical PDF page number
     - `printed_page_label`: optional printed textbook folio
4. **Stable Identifier Conventions:**
   - Grade 9: `g09-<subject>`, `g09-<subject>-u<XX>`, `g09-<subject>-u<XX>-c<YY>`, `g09-<subject>-u<XX>-c<YY>-s<ZZ>`
   - Grade 10: `g10-<subject>`, `g10-<subject>-u<XX>`, `g10-<subject>-u<XX>-c<YY>`
   - Grade 11: `g11-<subject>`, `g11-<subject>-u<XX>`, `g11-<subject>-u<XX>-c<YY>`
   - Grade 12: `g12-<subject>`, `g12-<subject>-u<XX>`, `g12-<subject>-u<XX>-c<YY>`
5. **Review Status:**
   - `verified`: Directly supported by Table of Contents and chapter heading inspection.
   - `needs_review`: OCR uncertainty or heading hierarchy ambiguity.

---

### 2. JSON Structure Template (Schema Version 1.0.0)
```json
{
  "schema_version": "1.0.0",
  "curriculum": {
    "id": "ethiopia-national-exam-g9-g12",
    "name": "Ethiopian Secondary Curriculum",
    "country_code": "ET",
    "language": "en",
    "source_documents": [
      {
        "id": "g09-chemistry-textbook",
        "filename": "Chemistry Student Textbook Grade 9.pdf",
        "grade": 9,
        "subject_id": "g09-chemistry",
        "document_type": "textbook"
      }
    ],
    "grades": [
      {
        "grade": 9,
        "subjects": [
          {
            "id": "g09-chemistry",
            "name": "Chemistry",
            "order": 1,
            "review_status": "verified",
            "source_refs": [
              {
                "document_id": "g09-chemistry-textbook",
                "pdf_page_start": 5,
                "pdf_page_end": 6,
                "printed_page_label": "Contents"
              }
            ],
            "units": [
              {
                "id": "g09-chemistry-u01",
                "number": "1",
                "title": "CHEMISTRY AND ITS IMPORTANCE",
                "order": 1,
                "review_status": "verified",
                "source_refs": [
                  {
                    "document_id": "g09-chemistry-textbook",
                    "pdf_page_start": 7,
                    "pdf_page_end": 18
                  }
                ],
                "chapters": [
                  {
                    "id": "g09-chemistry-u01-c01",
                    "number": "1.1",
                    "title": "Definition and Scope of Chemistry",
                    "order": 1,
                    "review_status": "verified",
                    "source_refs": [
                      {
                        "document_id": "g09-chemistry-textbook",
                        "pdf_page_start": 8,
                        "pdf_page_end": 13
                      }
                    ],
                    "prerequisite_ids": [],
                    "subtopics": []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

### 3. Safety and Validation Rules
- No student data (progress, ratings, XP, notes) inside curriculum files.
- All numbers must be preserved as strings (`"1"`, `"1.1"`).
- All display orders must be integers (`1`, `2`, `3`).
- Run structural validation via `validateCurriculumJson()` before administrative publication.
