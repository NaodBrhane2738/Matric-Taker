import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'data', 'curriculum.json'),
      path.join(process.cwd(), 'curriculum', 'ethiopian_curriculum_master.json'),
      path.join(process.cwd(), '..', '..', 'curriculum', 'ethiopian_curriculum_master.json'),
      path.join(process.cwd(), 'samples', 'curriculum-example.json'),
      path.join(process.cwd(), '..', '..', 'samples', 'curriculum-example.json'),
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        const fileContent = fs.readFileSync(p, 'utf8');
        const data = JSON.parse(fileContent);
        return NextResponse.json(data);
      }
    }

    return NextResponse.json({ error: 'Curriculum data not found' }, { status: 404 });
  } catch (error) {
    console.error('Failed to load curriculum', error);
    return NextResponse.json({ error: 'Failed to load curriculum' }, { status: 500 });
  }
}
