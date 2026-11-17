'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  FlaskConical,
  Sprout,
  Sigma,
  Atom,
  BookOpen,
  Laptop,
} from 'lucide-react';
import type { CurriculumRoot, Subject, Unit } from '@matric/curriculum-schema';
import type { StudentChapterProgress } from '@matric/shared-types';

interface CurriculumExplorerProps {
  curriculum: CurriculumRoot | null;
  progressMap: Record<string, StudentChapterProgress>;
  onToggleUnit: (unitId: string) => void;
  onRenameUnit: (unitId: string, currentTitle: string) => void;
  onAddUnit: (subjectId: string) => void;
}

export function CurriculumExplorer({
  curriculum,
  progressMap,
  onToggleUnit,
  onRenameUnit,
  onAddUnit,
}: CurriculumExplorerProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Track expanded subjects (default expand first few)
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({
    'g09-biology': true,
    'g09-chemistry': true,
  });

  const toggleSubject = (subjId: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjId]: !prev[subjId],
    }));
  };

  const getSubjectIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('bio')) return <Sprout className="h-4 w-4 text-subject-bio" />;
    if (n.includes('chem')) return <FlaskConical className="h-4 w-4 text-subject-chem" />;
    if (n.includes('math')) return <Sigma className="h-4 w-4 text-subject-math" />;
    if (n.includes('phys')) return <Atom className="h-4 w-4 text-subject-physics" />;
    if (n.includes('it') || n.includes('ict')) return <Laptop className="h-4 w-4 text-subject-it" />;
    return <BookOpen className="h-4 w-4 text-subject-english" />;
  };

  // Filter logic
  const filteredGrades = useMemo(() => {
    if (!curriculum) return [];

    return curriculum.curriculum.grades
      .filter((g) => {
        if (selectedGrade !== 'all' && g.grade !== parseInt(selectedGrade)) return false;
        return true;
      })
      .map((g) => {
        const filteredSubjects = g.subjects
          .filter((s) => {
            if (selectedSubject !== 'all' && s.id !== selectedSubject) return false;
            return true;
          })
          .map((s) => {
            const filteredUnits = s.units.filter((u) => {
              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchTitle = u.title.toLowerCase().includes(q);
                const matchNum = u.number.includes(q);
                if (!matchTitle && !matchNum) return false;
              }

              if (selectedStatus !== 'all') {
                const isUnitCompleted =
                  u.chapters.length > 0 &&
                  u.chapters.every((c) => {
                    const st = progressMap[c.id]?.status;
                    return st === 'studied' || st === 'mastered';
                  });
                if (selectedStatus === 'completed' && !isUnitCompleted) return false;
                if (selectedStatus === 'not_started' && isUnitCompleted) return false;
              }

              return true;
            });

            return { ...s, units: filteredUnits };
          })
          .filter((s) => s.units.length > 0 || !searchQuery.trim());

        return { ...g, subjects: filteredSubjects };
      })
      .filter((g) => g.subjects.length > 0);
  }, [curriculum, selectedGrade, selectedSubject, selectedStatus, searchQuery, progressMap]);

  return (
    <div className="space-y-4">
      {/* Header and Add Subject */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">Your curriculum</h2>
          <p className="text-xs text-ink-3">One subject, one unit, one step at a time.</p>
        </div>
        <button
          type="button"
          onClick={() => alert('New subject addition modal is ready. You can also import curriculum JSON via Admin.')}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-2 transition-colors shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add subject</span>
        </button>
      </div>

      {/* Filter Bar matching screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>

          {/* Subject filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All subjects</option>
            <option value="g09-biology">Biology</option>
            <option value="g09-chemistry">Chemistry</option>
            <option value="g09-mathematics">Mathematics</option>
            <option value="g09-physics">Physics</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="not_started">Not started</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search units..."
            className="w-full rounded-lg border border-line bg-canvas pl-9 pr-3 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-ink-3"
          />
        </div>
      </div>

      {/* Curriculum Lists by Grade */}
      <div className="space-y-6">
        {filteredGrades.map((g) => (
          <div key={g.grade} className="space-y-3">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-ink">Grade {g.grade}</span>
              </div>
              <span className="text-xs text-ink-3">{g.subjects.length} subjects</span>
            </div>

            <div className="space-y-3">
              {g.subjects.map((s) => {
                const isExpanded = !!expandedSubjects[s.id];

                // Calculate subject completion
                const totalU = s.units.length;
                let doneU = 0;
                for (const u of s.units) {
                  const done =
                    u.chapters.length > 0 &&
                    u.chapters.every((c) => {
                      const st = progressMap[c.id]?.status;
                      return st === 'studied' || st === 'mastered';
                    });
                  if (done) doneU++;
                }
                const pct = totalU > 0 ? Math.round((doneU / totalU) * 100) : 0;

                return (
                  <div
                    key={s.id}
                    className="overflow-hidden rounded-2xl border border-line bg-surface transition-all"
                  >
                    {/* Subject Header Row */}
                    <div className="flex items-center justify-between p-4 hover:bg-surface-2/40 transition-colors">
                      <button
                        type="button"
                        onClick={() => toggleSubject(s.id)}
                        aria-expanded={isExpanded}
                        className="text-left flex items-center gap-3 flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-accent rounded-lg p-0.5"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-2 border border-line/60">
                          {getSubjectIcon(s.name)}
                        </div>
                        <span className="text-sm font-medium text-ink truncate">{s.name}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-ink-3" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-ink-3" />
                        )}
                      </button>

                      {/* Right stats & Actions */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-ink-3 tabular-nums">
                            {doneU} / {totalU} units
                          </span>
                          <div className="hidden sm:block h-1.5 w-24 overflow-hidden rounded-full bg-surface-2">
                            <div
                              className="h-full bg-green rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-ink tabular-nums w-8 text-right">
                            {pct}%
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddUnit(s.id);
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors"
                          title="Add Unit"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Units List */}
                    {isExpanded && (
                      <div className="border-t border-line/60 divide-y divide-line/40 bg-canvas/30">
                        {s.units.map((u) => {
                          const isCompleted =
                            u.chapters.length > 0 &&
                            u.chapters.every((c) => {
                              const st = progressMap[c.id]?.status;
                              return st === 'studied' || st === 'mastered';
                            });

                          return (
                            <div
                              key={u.id}
                              className="flex items-center justify-between px-5 py-3 hover:bg-surface transition-colors group"
                            >
                              <button
                                type="button"
                                onClick={() => onToggleUnit(u.id)}
                                className="text-left flex items-center gap-3.5 cursor-pointer flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-accent rounded-sm"
                              >
                                {/* Green filled checkbox matching screenshot */}
                                <div
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border transition-colors ${
                                    isCompleted
                                      ? 'bg-green border-green text-white'
                                      : 'border-line-strong bg-surface hover:border-green'
                                  }`}
                                >
                                  {isCompleted && <Check className="h-3 w-3 stroke-[3]" />}
                                </div>

                                <span
                                  className={`text-xs truncate ${
                                    isCompleted ? 'text-ink font-medium' : 'text-ink-2'
                                  }`}
                                >
                                  {u.title}
                                </span>
                              </button>

                              <div className="flex items-center gap-3 shrink-0">
                                <span
                                  className={`text-xs ${
                                    isCompleted ? 'text-green font-medium' : 'text-ink-3'
                                  }`}
                                >
                                  {isCompleted ? 'Completed' : 'Not started'}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => onRenameUnit(u.id, u.title)}
                                  className="text-ink-3 hover:text-ink p-1 transition-colors"
                                  title="Rename unit"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => alert(`Remove ${u.title}`)}
                                  className="text-ink-3 hover:text-red-500 p-1 transition-colors"
                                  title="Delete unit"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Add unit footer row */}
                        <div className="p-3 bg-surface-2/20">
                          <button
                            type="button"
                            onClick={() => onAddUnit(s.id)}
                            className="inline-flex items-center gap-1.5 text-xs text-ink-3 hover:text-ink transition-colors font-medium pl-2"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add unit</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
