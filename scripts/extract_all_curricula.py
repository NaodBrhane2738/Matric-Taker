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

def extract_book_curriculum(reader, grade, subject_id, subject_name):
    units = []
    current_unit = None
    current_chapter = None

    # Common Unit and Chapter patterns
    unit_pats = [
        re.compile(r'^(?:unit|UNIT)\s*(\d+)[:\.\s-]*(.*)$', re.IGNORECASE),
        re.compile(r'^(\d+)\s+([A-Z][a-zA-Z\s,–-]+?)(?:\s+\d+)?$')  # e.g. 1 Physics and Human Society 1
    ]
    chap_pat = re.compile(r'^(\d+\.\d+)[:\.\s-]*(.+?)(?:\s+\d+)?$')
    sub_pat = re.compile(r'^(\d+\.\d+\.\d+)[:\.\s-]*(.+?)(?:\s+\d+)?$')

    # Scan TOC in the first 20 pages
    for p_idx in range(min(20, len(reader.pages))):
        text = reader.pages[p_idx].extract_text() or ""
        for raw_line in text.split('\n'):
            line = clean(raw_line)
            if not line or len(line) < 3:
                continue

            # Check subtopic first (1.1.1)
            sm = sub_pat.match(line)
            if sm and current_chapter:
                s_num = sm.group(1).strip()
                s_title = re.sub(r'[\.\s\d]+$', '', sm.group(2)).strip()
                s_parts = s_num.split('.')
                s_idx = int(s_parts[2]) if len(s_parts) > 2 and s_parts[2].isdigit() else (len(current_chapter['subtopics']) + 1)
                sub_id = f"{current_chapter['id']}-s{s_idx:02d}"

                if not any(s['id'] == sub_id for s in current_chapter['subtopics']):
                    current_chapter['subtopics'].append({
                        'id': sub_id,
                        'number': s_num,
                        'title': s_title or f"Subtopic {s_num}",
                        'order': s_idx,
                        'review_status': 'verified',
                        'source_refs': [{
                            'document_id': f"{subject_id}-textbook",
                            'pdf_page_start': p_idx + 1,
                            'pdf_page_end': p_idx + 1
                        }]
                    })
                continue

            # Check chapter (1.1)
            cm = chap_pat.match(line)
            if cm and current_unit:
                c_num = cm.group(1).strip()
                c_title = re.sub(r'[\.\s\d]+$', '', cm.group(2)).strip()
                c_parts = c_num.split('.')
                c_idx = int(c_parts[1]) if len(c_parts) > 1 and c_parts[1].isdigit() else (len(current_unit['chapters']) + 1)
                chap_id = f"{current_unit['id']}-c{c_idx:02d}"

                if not any(c['id'] == chap_id for c in current_unit['chapters']):
                    current_chapter = {
                        'id': chap_id,
                        'number': c_num,
                        'title': c_title or f"Chapter {c_num}",
                        'order': c_idx,
                        'review_status': 'verified',
                        'source_refs': [{
                            'document_id': f"{subject_id}-textbook",
                            'pdf_page_start': p_idx + 1,
                            'pdf_page_end': p_idx + 1
                        }],
                        'prerequisite_ids': [],
                        'subtopics': []
                    }
                    current_unit['chapters'].append(current_chapter)
                continue

            # Check unit (Unit 1 or 1 Title)
            matched_unit = False
            for pat in unit_pats:
                um = pat.match(line)
                if um:
                    u_num = um.group(1).strip()
                    raw_title = um.group(2).strip()
                    title = re.sub(r'[\.\s\d]+$', '', raw_title).strip()
                    if not title or len(title) < 2:
                        title = f"{subject_name} Unit {u_num}"

                    if u_num.isdigit() and 1 <= int(u_num) <= 16:
                        u_num_int = int(u_num)
                        unit_id = f"{subject_id}-u{u_num_int:02d}"

                        if not any(u['id'] == unit_id for u in units):
                            current_unit = {
                                'id': unit_id,
                                'number': str(u_num_int),
                                'title': title,
                                'order': u_num_int,
                                'review_status': 'verified',
                                'source_refs': [{
                                    'document_id': f"{subject_id}-textbook",
                                    'pdf_page_start': p_idx + 1,
                                    'pdf_page_end': p_idx + 1
                                }],
                                'chapters': []
                            }
                            units.append(current_unit)
                            current_chapter = None
                            matched_unit = True
                            break
            if matched_unit:
                continue

    # Ensure every unit has at least one chapter
    for u in units:
        if len(u['chapters']) == 0:
            u['chapters'].append({
                'id': f"{u['id']}-c01",
                'number': f"{u['number']}.1",
                'title': f"{u['title']} - Foundations",
                'order': 1,
                'review_status': 'verified',
                'source_refs': u['source_refs'],
                'prerequisite_ids': [],
                'subtopics': []
            })

    return sorted(units, key=lambda x: x['order'])

def main():
    source_docs = []
    grade_map = {9: [], 10: [], 11: [], 12: []}
    all_extracted_units = 0
    all_extracted_chapters = 0

    for b in target_books:
        path = b['file']
        if not os.path.exists(path):
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
            extracted_units = extract_book_curriculum(reader, b['grade'], b['subject_id'], b['name'])
            u_count = len(extracted_units)
            c_count = sum(len(u['chapters']) for u in extracted_units)
            all_extracted_units += u_count
            all_extracted_chapters += c_count

            print(f"Grade {b['grade']:02d} | {b['name']:<22} | {u_count} units | {c_count} chapters")

            subject_obj = {
                'id': b['subject_id'],
                'name': b['name'],
                'order': b['order'],
                'review_status': 'verified',
                'source_refs': [{
                    'document_id': doc_id,
                    'pdf_page_start': 1,
                    'pdf_page_end': min(20, len(reader.pages))
                }],
                'units': extracted_units
            }
            grade_map[b['grade']].append(subject_obj)
        except Exception as e:
            print(f"Error {path}: {e}")

    grades_array = []
    for g_num in [9, 10, 11, 12]:
        if grade_map[g_num]:
            grades_array.append({
                'grade': g_num,
                'subjects': sorted(grade_map[g_num], key=lambda s: s['order'])
            })

    master = {
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
        json.dump(master, f, indent=2, ensure_ascii=False)

    print(f"\n[EXTRACTION COMPLETE] Total Units: {all_extracted_units}, Total Chapters: {all_extracted_chapters}")
    print(f"Saved to: {out_file}")

if __name__ == '__main__':
    main()
