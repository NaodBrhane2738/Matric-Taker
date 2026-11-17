'use client';

import React from 'react';
import { ArrowUpRight, GraduationCap } from 'lucide-react';
import { useCurriculum } from '../../context/CurriculumContext';
import type { CurriculumRoot } from '@matric/curriculum-schema';
import type { StudentChapterProgress } from '@matric/shared-types';

interface ProgressByGradeProps {
  curriculum?: CurriculumRoot | null;
  progressMap?: Record<string, StudentChapterProgress>;
  onSelectGrade?: (grade: number) => void;
}

export function ProgressByGrade({
  curriculum: propCurriculum,
  progressMap: propProgressMap,
  onSelectGrade,
}: ProgressByGradeProps) {
  const context = useCurriculum();
  const curriculum = propCurriculum ?? context.curriculum;
  const progressMap = propProgressMap ?? context.progressMap;
  const isDemoMode = context.isDemoMode;

  // If no curriculum and in demo mode, show standard fallback matching Screenshot 1
  const defaultGradeStats: Record<
    number,
    { subjects: number; units: number; completed: number; pct: number }
  > = {
    9: { subjects: 4, units: 26, completed: 9, pct: 35 },
    10: { subjects: 4, units: 25, completed: 3, pct: 12 },
    11: { subjects: 4, units: 27, completed: 3, pct: 11 },
    12: { subjects: 4, units: 21, completed: 5, pct: 24 },
  };

  const grades = [9, 10, 11, 12];

  const cards = grades.map((gNum) => {
    if (!curriculum) {
      const def = defaultGradeStats[gNum];
      const completed = isDemoMode ? def.completed : 0;
      const pct = isDemoMode ? def.pct : 0;
      return {
        grade: gNum,
        subjectsCount: def.subjects,
        unitsCount: def.units,
        completedCount: completed,
        remainingCount: def.units - completed,
        pct,
      };
    }

    const gradesList = curriculum.curriculum ? curriculum.curriculum.grades : (curriculum as any).grades;
    const gObj = gradesList?.find((g: any) => g.grade === gNum);
    if (!gObj) {
      return {
        grade: gNum,
        subjectsCount: 0,
        unitsCount: 0,
        completedCount: 0,
        remainingCount: 0,
        pct: 0,
      };
    }

    let unitsTotal = 0;
    let unitsDone = 0;

    for (const s of gObj.subjects) {
      unitsTotal += s.units.length;
      for (const u of s.units) {
        const isUnitDone =
          u.chapters.length > 0 &&
          u.chapters.every((c: any) => {
            const st = progressMap[c.id]?.status;
            return st === 'studied' || st === 'mastered';
          });
        if (isUnitDone) unitsDone++;
      }
    }

    const pct = unitsTotal > 0 ? Math.round((unitsDone / unitsTotal) * 100) : 0;

    return {
      grade: gNum,
      subjectsCount: gObj.subjects.length,
      unitsCount: unitsTotal,
      completedCount: unitsDone,
      remainingCount: Math.max(0, unitsTotal - unitsDone),
      pct,
    };
  });

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">Progress by grade</h2>
          <p className="text-xs text-ink-3">A strong foundation, from Grade 9 to Grade 12.</p>
        </div>
        <span className="text-xs font-medium text-ink-3">4 grades</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <button
            type="button"
            key={c.grade}
            onClick={() => onSelectGrade?.(c.grade)}
            className="group relative text-left cursor-pointer rounded-2xl border border-line bg-surface p-5 transition-all hover:border-line-strong hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-ink-2">
                <GraduationCap className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-ink">Grade {c.grade}</h3>
              <p className="text-xs text-ink-3 mt-0.5">
                {c.subjectsCount} subjects • {c.unitsCount} units
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-ink-2 mb-1.5">
                <span className="font-medium text-ink">{c.pct}% complete</span>
                <span className="tabular-nums text-ink-3">
                  {c.completedCount}/{c.unitsCount}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full bg-green rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${c.pct}%` }}
                />
              </div>
            </div>

            <div className="mt-3.5 flex items-center justify-between border-t border-line/60 pt-3 text-3xs text-ink-3">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green" />
                {c.completedCount} completed
              </span>
              <span>{c.remainingCount} remaining</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
