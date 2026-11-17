import os
import re
import json
from pypdf import PdfReader

OUTPUT_DIR = 'curriculum'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Normalized subject mapping
SUBJECT_MAP = {
    'biology': {'name': 'Biology', 'order': 1},
    'chemistry': {'name': 'Chemistry', 'order': 2},
    'mathematics': {'name': 'Mathematics', 'order': 3},
    'maths': {'name': 'Mathematics', 'order': 3},
    'physics': {'name': 'Physics', 'order': 4},
    'english': {'name': 'English', 'order': 5},
    'it': {'name': 'Information Technology', 'order': 6},
    'ict': {'name': 'Information Technology', 'order': 6},
}

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def parse_contents_text(text, grade_num, subject_key):
    lines = [clean_text(line) for line in text.split('\n') if clean_text(line)]
    units = []
    current_unit = None
    unit_order = 1
    chapter_order = 1

    unit_pattern = re.compile(r'^(?:unit\s*(\d+)[:\.\s-]*)(.+?)(?:\s+\d+)?$', re.IGNORECASE)
    chapter_pattern = re.compile(r'^(\d+\.\d+)[:\.\s-]*(.+?)(?:\s+\d+)?$')

    for line in lines:
        u_match = unit_pattern.match(line)
        if u_match:
            u_num = u_match.group(1).strip()
            u_title = clean_text(u_match.group(2))
            # Clean trailing page numbers or dots
            u_title = re.sub(r'[\.\s\d]+$', '', u_title).strip()
            
            unit_id = f"g{grade_num:02d}-{subject_key}-u{int(u_num):02d}"
            current_unit = {
                'id': unit_id,
                'number': u_num,
                'title': u_title or f"Unit {u_num}",
                'order': int(u_num),
                'review_status': 'verified',
                'source_refs': [],
                'chapters': []
            }
            units.append(current_unit)
            chapter_order = 1
            continue

        c_match = chapter_pattern.match(line)
        if c_match and current_unit:
            c_num = c_match.group(1).strip()
            c_title = clean_text(c_match.group(2))
            c_title = re.sub(r'[\.\s\d]+$', '', c_title).strip()
            
            # Extract chapter index after dot
            parts = c_num.split('.')
            c_idx = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else chapter_order
            chapter_id = f"{current_unit['id']}-c{c_idx:02d}"
            
            current_unit['chapters'].append({
                'id': chapter_id,
                'number': c_num,
                'title': c_title or f"Chapter {c_num}",
                'order': c_idx,
                'review_status': 'verified',
                'source_refs': [],
                'prerequisite_ids': [],
                'subtopics': []
            })
            chapter_order += 1

    return units

def extract_book(file_path, grade_num, subject_key):
    print(f"Extracting Grade {grade_num} {subject_key} from {os.path.basename(file_path)}...")
    reader = PdfReader(file_path)
    combined_toc = ""
    start_page = 1
    end_page = min(15, len(reader.pages))

    for p in range(len(reader.pages[:15])):
        txt = reader.pages[p].extract_text() or ""
        if 'content' in txt.lower() or 'unit' in txt.lower():
            combined_toc += "\n" + txt

    units = parse_contents_text(combined_toc, grade_num, subject_key)
    return units

print("Extraction script prepared.")
