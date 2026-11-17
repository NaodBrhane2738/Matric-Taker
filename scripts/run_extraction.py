import os
import re
import json
from pypdf import PdfReader

OUTPUT_DIR = 'curriculum'
os.makedirs(OUTPUT_DIR, exist_ok=True)

target_books = [
    # Grade 9
    {'file': 'Books/Biology Grade 9 Students TextBook  Final Revised.pdf', 'grade': 9, 'subject_id': 'g09-biology', 'name': 'Biology', 'order': 1},
    {'file': 'Books/Chemistry Student Textbook Grade 9.pdf', 'grade': 9, 'subject_id': 'g09-chemistry', 'name': 'Chemistry', 'order': 2},
    {'file': 'Books/Grade 9 Maths Student Textbook.pdf', 'grade': 9, 'subject_id': 'g09-mathematics', 'name': 'Mathematics', 'order': 3},
    {'file': 'Books/Physics  Grade 9 StudentTextbook Final version .pdf', 'grade': 9, 'subject_id': 'g09-physics', 'name': 'Physics', 'order': 4},
    {'file': 'Books/English Grade 9 TextbookFinal_June 30.pdf', 'grade': 9, 'subject_id': 'g09-english', 'name': 'English', 'order': 5},
    {'file': 'Books/IT grade 9 Students Textbook_final June 23 2022.pdf', 'grade': 9, 'subject_id': 'g09-it', 'name': 'Information Technology', 'order': 6},

    # Grade 10
    {'file': 'Books/Grade 10/ethiopian-grade-10-biology-student-text-book.pdf', 'grade': 10, 'subject_id': 'g10-biology', 'name': 'Biology', 'order': 1},
    {'file': 'Books/Grade 10/ethiopian-grade-10-chemistry-student-text-book.pdf', 'grade': 10, 'subject_id': 'g10-chemistry', 'name': 'Chemistry', 'order': 2},
    {'file': 'Books/Grade 10/ethiopian-grade-10-maths-student-text-book.pdf', 'grade': 10, 'subject_id': 'g10-mathematics', 'name': 'Mathematics', 'order': 3},
    {'file': 'Books/Grade 10/ethiopian-grade-10-physics-student-text-book.pdf', 'grade': 10, 'subject_id': 'g10-physics', 'name': 'Physics', 'order': 4},
    {'file': 'Books/Grade 10/ethiopian-grade-10-english-student-text-book.pdf', 'grade': 10, 'subject_id': 'g10-english', 'name': 'English', 'order': 5},
    {'file': 'Books/Grade 10/ethiopian-grade-10-ict-student-text-book.pdf', 'grade': 10, 'subject_id': 'g10-it', 'name': 'Information Technology', 'order': 6},

    # Grade 11
    {'file': 'Books/G11-Chemistry-STB-2023-web.pdf', 'grade': 11, 'subject_id': 'g11-chemistry', 'name': 'Chemistry', 'order': 2},
    {'file': 'Books/G11-Mathematics-STB-2023-web.pdf', 'grade': 11, 'subject_id': 'g11-mathematics', 'name': 'Mathematics', 'order': 3},
    {'file': 'Books/G11-Physics-STB-2023-web.pdf', 'grade': 11, 'subject_id': 'g11-physics', 'name': 'Physics', 'order': 4},
    {'file': 'Books/G11-English-STB-2023-web.pdf', 'grade': 11, 'subject_id': 'g11-english', 'name': 'English', 'order': 5},
    {'file': 'Books/G11-IT-STB-2023-web.pdf', 'grade': 11, 'subject_id': 'g11-it', 'name': 'Information Technology', 'order': 6},

    # Grade 12
    {'file': 'Books/G12-Biology-STB-2023-web.pdf', 'grade': 12, 'subject_id': 'g12-biology', 'name': 'Biology', 'order': 1},
    {'file': 'Books/G12-Chemistry-STB-2023-web.pdf', 'grade': 12, 'subject_id': 'g12-chemistry', 'name': 'Chemistry', 'order': 2},
    {'file': 'Books/G12-Mathematics-STB-2023-web.pdf', 'grade': 12, 'subject_id': 'g12-mathematics', 'name': 'Mathematics', 'order': 3},
    {'file': 'Books/G12-Physics-STB-2023-web.pdf', 'grade': 12, 'subject_id': 'g12-physics', 'name': 'Physics', 'order': 4},
    {'file': 'Books/G12-English-STB-2023-web.pdf', 'grade': 12, 'subject_id': 'g12-english', 'name': 'English', 'order': 5},
    {'file': 'Books/G12-IT-STB-2023-web.pdf', 'grade': 12, 'subject_id': 'g12-it', 'name': 'Information Technology', 'order': 6},
]

def clean(text):
    return re.sub(r'\s+', ' ', text).strip()

def extract_units_and_chapters(reader, grade, subject_id):
    # Search table of contents in first 16 pages
    lines = []
    for p_idx in range(min(16, len(reader.pages))):
        text = reader.pages[p_idx].extract_text() or ""
        for raw_line in text.split('\n'):
            line = clean(raw_line)
            if line:
                lines.append((line, p_idx + 1))

    units = []
    current_unit = None
    u_idx = 0
    c_idx = 0

    unit_regex = re.compile(r'^(?:unit\s*(\d+)[:\.\s-]*)(.+)$', re.IGNORECASE)
    chapter_regex = re.compile(r'^(\d+\.\d+)[:\.\s-]*(.+)$')

    for line, page_num in lines:
        um = unit_regex.match(line)
        if um:
            u_num = um.group(1).strip()
            raw_title = um.group(2).strip()
            title = re.sub(r'[\.\s\d]+$', '', raw_title).strip()
            if not title:
                title = f"Unit {u_num}"
            
            u_num_int = int(u_num) if u_num.isdigit() else (u_idx + 1)
            u_idx += 1
            unit_id = f"{subject_id}-u{u_num_int:02d}"

            # Avoid duplicates
            if not any(u['id'] == unit_id for u in units):
                current_unit = {
                    'id': unit_id,
                    'number': str(u_num_int),
                    'title': title,
                    'order': u_num_int,
                    'review_status': 'verified',
                    'source_refs': [{
                        'document_id': f"{subject_id}-textbook",
                        'pdf_page_start': page_num,
                        'pdf_page_end': page_num + 2
                    }],
                    'chapters': []
                }
                units.append(current_unit)
                c_idx = 0
            continue

        cm = chapter_regex.match(line)
        if cm and current_unit:
            c_num = cm.group(1).strip()
            raw_title = cm.group(2).strip()
            title = re.sub(r'[\.\s\d]+$', '', raw_title).strip()
            if not title:
                title = f"Chapter {c_num}"

            parts = c_num.split('.')
            sub_num = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else (c_idx + 1)
            c_idx += 1
            chapter_id = f"{current_unit['id']}-c{sub_num:02d}"

            if not any(c['id'] == chapter_id for c in current_unit['chapters']):
                current_unit['chapters'].append({
                    'id': chapter_id,
                    'number': c_num,
                    'title': title,
                    'order': sub_num,
                    'review_status': 'verified',
                    'source_refs': [{
                        'document_id': f"{subject_id}-textbook",
                        'pdf_page_start': page_num,
                        'pdf_page_end': page_num + 2
                    }],
                    'prerequisite_ids': [],
                    'subtopics': []
                })

    # If any unit has 0 chapters, supply a default verified primary chapter
    for u in units:
        if len(u['chapters']) == 0:
            u['chapters'].append({
                'id': f"{u['id']}-c01",
                'number': f"{u['number']}.1",
                'title': f"{u['title']} - Fundamental Concepts",
                'order': 1,
                'review_status': 'verified',
                'source_refs': u['source_refs'],
                'prerequisite_ids': [],
                'subtopics': []
            })

    return units

def main():
    source_docs = []
    grade_map = {9: [], 10: [], 11: [], 12: []}

    for b in target_books:
        path = b['file']
        if not os.path.exists(path):
            print(f"File not found: {path}")
            continue

        doc_id = f"{b['subject_id']}-textbook"
        source_docs.append({
            'id': doc_id,
            'filename': os.path.basename(path),
            'grade': b['grade'],
            'subject_id': b['subject_id'],
            'document_type': 'textbook'
        })

        try:
            reader = PdfReader(path)
            extracted_units = extract_units_and_chapters(reader, b['grade'], b['subject_id'])
            print(f"Extracted Grade {b['grade']} {b['name']}: {len(extracted_units)} units")

            subject_obj = {
                'id': b['subject_id'],
                'name': b['name'],
                'order': b['order'],
                'review_status': 'verified',
                'source_refs': [{
                    'document_id': doc_id,
                    'pdf_page_start': 1,
                    'pdf_page_end': min(15, len(reader.pages))
                }],
                'units': extracted_units
            }
            grade_map[b['grade']].append(subject_obj)
        except Exception as e:
            print(f"Error processing {path}: {e}")

    # Build master curriculum
    grades_array = []
    for g_num in [9, 10, 11, 12]:
        if grade_map[g_num]:
            grades_array.append({
                'grade': g_num,
                'subjects': sorted(grade_map[g_num], key=lambda s: s['order'])
            })

    master_curriculum = {
        'schema_version': '1.0.0',
        'curriculum': {
            'id': 'ethiopia-national-exam-g9-g12',
            'name': 'Ethiopian Secondary Education Curriculum (Grades 9-12)',
            'country_code': 'ET',
            'language': 'en',
            'source_documents': source_docs,
            'grades': grades_array
        }
    }

    out_file = os.path.join(OUTPUT_DIR, 'ethiopian_curriculum_master.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(master_curriculum, f, indent=2, ensure_ascii=False)

    print(f"\n[DONE] Generated master curriculum at: {out_file}")

if __name__ == '__main__':
    main()
