'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Check,
  ChevronDown,
  ChevronRight,
  Edit2,
  BookOpen,
  Plus,
  GraduationCap,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';
import type { CurriculumRoot, GradeCurriculum, Subject, Unit, Chapter } from '@matric/curriculum-schema';
import type { StudentChapterProgress } from '@matric/shared-types';

interface AllUnitsViewProps {
  curriculum: CurriculumRoot | null;
  progressMap: Record<string, StudentChapterProgress>;
  filterMode?: 'all' | 'completed' | 'not_completed';
  initialGrade?: number | null;
  onToggleChapter?: (chapterId: string) => void;
  onToggleUnit?: (unitId: string) => void;
  onRenameUnit?: (unitId: string, currentTitle: string) => void;
  onAddUnit?: (subjectId: string) => void;
}

function formatUnitTitle(title: string, number?: string, index?: number): string {
  const num = number || String((index ?? 0) + 1);
  const cleaned = title.replace(/^Unit\s+\d+[\s:–-]+/i, '').trim();
  return `Unit ${num} - ${cleaned}`;
}

function formatChapterTitle(title: string, number?: string, unitNum?: string, index?: number): string {
  const num = number || `${unitNum || '1'}.${(index ?? 0) + 1}`;
  if (title.startsWith(num)) {
    return title;
  }
  const cleaned = title.replace(/^\d+\.\d+[\s:–-]+/, '').trim();
  return `${num} ${cleaned}`;
}

export function AllUnitsView({
  curriculum,
  progressMap,
  filterMode = 'all',
  initialGrade = null,
  onToggleChapter,
  onToggleUnit,
  onRenameUnit,
  onAddUnit,
}: AllUnitsViewProps) {
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>(initialGrade || 'all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  const gradesList: GradeCurriculum[] = useMemo(() => {
    if (!curriculum) return [];
    if (curriculum.curriculum && curriculum.curriculum.grades) {
      return curriculum.curriculum.grades;
    }
    return (curriculum as any).grades || [];
  }, [curriculum]);

  // Toggle unit expansion
  const toggleUnit = (uId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [uId]: !prev[uId] }));
  };

  // Toggle subject expansion
  const toggleSubject = (sId: string) => {
    setExpandedSubjects((prev) => ({ ...prev, [sId]: !prev[sId] }));
  };

  // Filtered grades & subjects & units
  const filteredData = useMemo(() => {
    return gradesList
      .filter((g) => (selectedGrade === 'all' ? true : g.grade === Number(selectedGrade)))
      .map((g) => {
        const filteredSubjects = g.subjects
          .filter((s) => (selectedSubject === 'all' ? true : s.id === selectedSubject || s.name.toLowerCase() === selectedSubject.toLowerCase()))
          .map((s) => {
            const filteredUnits = s.units.filter((u) => {
              // Search query filter
              const matchesSearch =
                !searchQuery ||
                u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.chapters.some((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

              if (!matchesSearch) return false;

              // Filter mode: all, completed, not_completed
              const isUnitCompleted =
                u.chapters.length > 0 &&
                u.chapters.every((c) => {
                  const st = progressMap[c.id]?.status;
                  return st === 'studied' || st === 'mastered';
                });

              if (filterMode === 'completed') return isUnitCompleted;
              if (filterMode === 'not_completed') return !isUnitCompleted;
              return true;
            });

            return { ...s, units: filteredUnits };
          })
          .filter((s) => s.units.length > 0);

        return { ...g, subjects: filteredSubjects };
      })
      .filter((g) => g.subjects.length > 0);
  }, [gradesList, selectedGrade, selectedSubject, searchQuery, filterMode, progressMap]);

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-lg font-bold text-ink flex items-center gap-2">
            <Layers className="h-5 w-5 text-green" />
            <span>
              {filterMode === 'completed'
                ? 'Completed Units & Chapters'
                : filterMode === 'not_completed'
                ? 'Units to Complete'
                : 'All Units & Curriculum Chapters'}
            </span>
          </h1>
          <p className="text-xs text-ink-3 mt-0.5">
            Full hierarchical breakdown of official Ethiopian Grades 9–12 subjects, units, and chapters.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={(e) =>
              setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Grades</option>
            <option value={9}>Grade 9</option>
            <option value={10}>Grade 10</option>
            <option value={11}>Grade 11</option>
            <option value={12}>Grade 12 (National)</option>
          </select>

          {/* Search bar */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters or units..."
              className="w-full rounded-xl border border-line bg-surface pl-9 pr-3 py-1.5 text-xs text-ink placeholder:text-ink-3 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Quick Expand / Collapse All */}
          <button
            type="button"
            onClick={() => {
              const allUnitIds = filteredData.flatMap((g) =>
                g.subjects.flatMap((s) => s.units.map((u) => u.id))
              );
              const anyCollapsed = allUnitIds.some((id) => expandedUnits[id] === false);
              const nextState: Record<string, boolean> = {};
              allUnitIds.forEach((id) => {
                nextState[id] = anyCollapsed;
              });
              setExpandedUnits(nextState);
            }}
            className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
          >
            Toggle Expand All
          </button>
        </div>
      </div>

      {/* Curriculum Hierarchy Render */}
      {filteredData.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-12 text-center">
          <BookOpen className="h-8 w-8 mx-auto text-ink-3 mb-3" />
          <h3 className="text-sm font-semibold text-ink">
            {filterMode === 'completed'
              ? 'No Completed Units Found'
              : filterMode === 'not_completed'
              ? 'All Units Completed!'
              : 'No matching units found'}
          </h3>
          <p className="mt-1 text-xs text-ink-3">
            {filterMode === 'completed'
              ? 'Mark units and chapters as studied or take practice quizzes to view them here.'
              : 'Try clearing your search query or adjusting the grade filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredData.map((gradeGroup) => (
            <div key={gradeGroup.grade} className="space-y-4">
              {/* Grade Header */}
              <div className="flex items-center gap-2 border-b border-line/70 pb-2">
                <GraduationCap className="h-4 w-4 text-green" />
                <h2 className="text-sm font-bold text-ink">Grade {gradeGroup.grade}</h2>
                <span className="text-3xs font-medium text-ink-3">
                  ({gradeGroup.subjects.length} subjects)
                </span>
              </div>

              {/* Subject Blocks */}
              <div className="space-y-4 pl-1">
                {gradeGroup.subjects.map((subj) => (
                  <div
                    key={subj.id}
                    className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs transition-all"
                  >
                    {/* Subject Header */}
                    <div className="flex items-center justify-between p-4 bg-surface-2/30 border-b border-line/50">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-green/10 text-green font-bold text-xs">
                          {subj.name[0]}
                        </span>
                        <h3 className="text-sm font-semibold text-ink">{subj.name}</h3>
                        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-3xs text-ink-3">
                          {subj.units.length} units
                        </span>
                      </div>

                      {onAddUnit && (
                        <button
                          type="button"
                          onClick={() => onAddUnit(subj.id)}
                          className="flex items-center gap-1 text-3xs font-medium text-green hover:underline"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Unit</span>
                        </button>
                      )}
                    </div>

                    {/* Units & Chapters List */}
                    <div className="divide-y divide-line/40">
                      {subj.units.map((unit, uIdx) => {
                        const isUnitCompleted =
                          unit.chapters.length > 0 &&
                          unit.chapters.every((c) => {
                            const st = progressMap[c.id]?.status;
                            return st === 'studied' || st === 'mastered';
                          });

                        const isUnitExpanded =
                          expandedUnits[unit.id] !== undefined
                            ? expandedUnits[unit.id]
                            : true; // Default open for clear chapter overview

                        const unitDisplayTitle = formatUnitTitle(unit.title, unit.number, uIdx);

                        return (
                          <div key={unit.id} className="p-4 space-y-2.5">
                            {/* Unit Line */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Unit Completed Checkbox */}
                                <button
                                  type="button"
                                  onClick={() => onToggleUnit?.(unit.id)}
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border transition-colors ${
                                    isUnitCompleted
                                      ? 'bg-green border-green text-white'
                                      : 'border-line-strong bg-surface hover:border-green'
                                  }`}
                                  title="Toggle Unit completion"
                                >
                                  {isUnitCompleted && <Check className="h-3 w-3 stroke-[3]" />}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleUnit(unit.id)}
                                  className="text-left font-semibold text-xs text-ink hover:text-green transition-colors truncate flex items-center gap-1.5"
                                >
                                  <span>{unitDisplayTitle}</span>
                                  <ChevronDown
                                    className={`h-3 w-3 text-ink-3 shrink-0 transition-transform duration-200 ${
                                      isUnitExpanded ? 'rotate-0' : '-rotate-90'
                                    }`}
                                  />
                                </button>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span
                                  className={`text-3xs font-medium ${
                                    isUnitCompleted ? 'text-green' : 'text-ink-3'
                                  }`}
                                >
                                  {isUnitCompleted ? 'Completed' : 'Not started'}
                                </span>

                                {onRenameUnit && (
                                  <button
                                    type="button"
                                    onClick={() => onRenameUnit(unit.id, unit.title)}
                                    className="p-1 text-ink-3 hover:text-ink transition-colors"
                                    title="Rename unit"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Chapters Within Unit with Smooth Expanding/Collapsing Animation */}
                            <div
                              className={`grid transition-all duration-300 ease-in-out ${
                                isUnitExpanded
                                  ? 'grid-rows-[1fr] opacity-100'
                                  : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                              }`}
                            >
                              <div className="overflow-hidden">
                                <div className="ml-7 pl-4 border-l-2 border-line/60 space-y-2 pt-1 pb-1">
                                  {unit.chapters.map((chap, cIdx) => {
                                    const chapProgress = progressMap[chap.id];
                                    const isChapStudied =
                                      chapProgress?.status === 'studied' ||
                                      chapProgress?.status === 'mastered';
                                    const isChapMastered = chapProgress?.status === 'mastered';
                                    const chapDisplayTitle = formatChapterTitle(
                                      chap.title,
                                      chap.number,
                                      unit.number,
                                      cIdx
                                    );

                                    return (
                                      <div
                                        key={chap.id}
                                        className="flex items-center justify-between text-xs py-1 group/chap"
                                      >
                                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                          <button
                                            type="button"
                                            onClick={() => onToggleChapter?.(chap.id)}
                                            className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                                              isChapStudied
                                                ? 'bg-green/80 border-green text-white'
                                                : 'border-line-strong hover:border-green'
                                            }`}
                                            title="Toggle Chapter status"
                                          >
                                            {isChapStudied && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                          </button>

                                          <span
                                            className={`truncate text-xs ${
                                              isChapStudied
                                                ? 'text-ink font-medium'
                                                : 'text-ink-2'
                                            }`}
                                          >
                                            {chapDisplayTitle}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                          {isChapMastered && (
                                            <span className="rounded-full bg-accent/15 px-1.5 py-0.2 text-3xs font-semibold text-accent">
                                              Mastered
                                            </span>
                                          )}
                                          {chapProgress?.assessmentScoreAverage !== undefined && (
                                            <span className="text-3xs font-mono text-ink-3">
                                              {Math.round(chapProgress.assessmentScoreAverage)}%
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
