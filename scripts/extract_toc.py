import os
import glob
import re
import json
import pypdf

books = {
    # Grade 9
    (9, 'Biology'): 'books/Grade 9/ethiopian-grade-9-biology-student-text-book.pdf',
    (9, 'Chemistry'): 'books/Grade 9/ethiopian-grade-9-chemistry-student-text-book.pdf',
    (9, 'Mathematics'): 'books/Grade 9/ethiopian-grade-9-mathematics-student-text-book.pdf',
    (9, 'Physics'): 'books/Grade 9/ethiopian-grade-9-physics-student-text-book.pdf',
    (9, 'English'): 'books/Grade 9/ethiopian-grade-9-english-student-text-book.pdf',
    (9, 'Information Technology'): 'books/Grade 9/ethiopian-grade-9-it-student-text-book.pdf',

    # Grade 10
    (10, 'Biology'): 'books/Grade 10/ethiopian-grade-10-biology-student-text-book.pdf',
    (10, 'Chemistry'): 'books/Grade 10/ethiopian-grade-10-chemistry-student-text-book.pdf',
    (10, 'Mathematics'): 'books/Grade 10/ethiopian-grade-10-maths-student-text-book.pdf',
    (10, 'Physics'): 'books/Grade 10/ethiopian-grade-10-physics-student-text-book.pdf',
    (10, 'English'): 'books/Grade 10/ethiopian-grade-10-english-student-text-book.pdf',
    (10, 'Information Technology'): 'books/Grade 10/ethiopian-grade-10-ict-student-text-book.pdf',

    # Grade 11
    (11, 'Biology'): 'books/G12-Biology-STB-2023-web.pdf', # We will check Grade 11 Biology
    (11, 'Chemistry'): 'books/G11-Chemistry-STB-2023-web.pdf',
    (11, 'Mathematics'): 'books/G11-Mathematics-STB-2023-web.pdf',
    (11, 'Physics'): 'books/G11-Physics-STB-2023-web.pdf',
    (11, 'English'): 'books/G11-English-STB-2023-web.pdf',
    (11, 'Information Technology'): 'books/G11-IT-STB-2023-web.pdf',

    # Grade 12
    (12, 'Biology'): 'books/G12-Biology-STB-2023-web.pdf',
    (12, 'Chemistry'): 'books/G12-Chemistry-STB-2023-web.pdf',
    (12, 'Mathematics'): 'books/G12-Mathematics-STB-2023-web.pdf',
    (12, 'Physics'): 'books/G12-Physics-STB-2023-web.pdf',
    (12, 'English'): 'books/G12-English-STB-2023-web.pdf',
    (12, 'Information Technology'): 'books/G12-IT-STB-2023-web.pdf',
}

results = {}

for (grade, subj), path in books.items():
    if not os.path.exists(path):
        print(f"Missing {path}")
        continue
    try:
        reader = pypdf.PdfReader(path)
        toc_text = []
        for i in range(1, min(14, len(reader.pages))):
            txt = reader.pages[i].extract_text() or ""
            if any(k in txt.lower() for k in ["content", "unit 1", "unit 2", "table of"]):
                toc_text.append(f"--- P.{i+1} ---\n" + txt)
        results[f"G{grade}_{subj}"] = "\n".join(toc_text)
        print(f"Extracted G{grade}_{subj}: {len(results[f'G{grade}_{subj}'])} chars")
    except Exception as e:
        print(f"Error extracting {grade} {subj}: {e}")

with open("scripts/extracted_tocs.txt", "w", encoding="utf-8") as f:
    for k, v in results.items():
        f.write(f"\n==================== {k} ====================\n")
        f.write(v)

print("Saved to scripts/extracted_tocs.txt")
