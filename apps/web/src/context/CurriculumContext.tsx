'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  CurriculumRoot,
  GradeCurriculum,
  Subject,
  Unit,
  Chapter,
} from '@matric/curriculum-schema';
import type {
  ChapterStudyStatus,
  DifficultyRating,
  StudentChapterProgress,
  PerformanceMetrics,
  StudySession,
} from '@matric/shared-types';
import {
  calculatePerformanceDimensions,
  canMarkMastered,
  identifyWeakChapters,
} from '@matric/shared-utils';
import { offlineDb } from '../lib/offline/db';
import { syncEngine } from '../lib/offline/sync';

interface CurriculumContextType {
  curriculum: CurriculumRoot | null;
  isLoading: boolean;
  isDemoMode: boolean;
  removeDemoData: () => Promise<void>;
  restoreDemoData: () => Promise<void>;
  progressMap: Record<string, StudentChapterProgress>;
  metrics: PerformanceMetrics;
  weakChapters: { chapterId: string; reason: string; severity: 'high' | 'medium' }[];
  toggleUnitProgress: (unitId: string) => void;
  updateChapterStatus: (chapterId: string, status: ChapterStudyStatus, score?: number) => void;
  saveChapterNotes: (chapterId: string, notes: string) => void;
  setChapterDifficulty: (chapterId: string, rating: DifficultyRating) => void;
  renameUnit: (unitId: string, newTitle: string) => void;
  addUnitToSubject: (subjectId: string, unitTitle: string) => void;
  totalUnitsCount: number;
  completedUnitsCount: number;
  remainingUnitsCount: number;
  totalChaptersCount: number;
  completedChaptersCount: number;
  overallProgressPercentage: number;
  // Study session scheduling & management
  studySessions: StudySession[];
  scheduleSession: (sessionData: Omit<StudySession, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
  updateSession: (sessionId: string, updates: Partial<StudySession>) => Promise<void>;
  postponeSession: (sessionId: string, minutes: number) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearAllSessions: () => Promise<void>;
  // Curriculum data clearing & restoration
  clearCurriculumProgress: () => Promise<void>;
  clearCurriculumStructure: () => Promise<void>;
  restoreOfficialCurriculum: () => Promise<void>;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export function CurriculumProvider({ children }: { children: React.ReactNode }) {
  const [curriculum, setCurriculum] = useState<CurriculumRoot | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, StudentChapterProgress>>({});
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    async function loadCurriculumData() {
      try {
        const demoCleared = typeof window !== 'undefined' && localStorage.getItem('matric_demo_cleared') !== 'false';
        setIsDemoMode(!demoCleared);

        // Fetch fresh curriculum from API first to ensure latest updates are applied
        try {
          const res = await fetch('/api/curriculum');
          if (res.ok) {
            const data: CurriculumRoot = await res.json();
            setCurriculum(data);
            await offlineDb.curriculum.put({
              id: 'master',
              version: data.schema_version,
              data,
              cachedAt: Date.now(),
            });
          } else {
            throw new Error('API fetch failed');
          }
        } catch {
          // Fall back to offline IndexedDB if network is unavailable
          const cached = await offlineDb.curriculum.get('master');
          if (cached && cached.data) {
            setCurriculum(cached.data);
          }
        }

        // Load progress from IndexedDB
        const localProgress = await offlineDb.chapterProgress.toArray();
        const map: Record<string, StudentChapterProgress> = {};
        for (const item of localProgress) {
          map[item.chapterId] = item;
        }

        if (demoCleared) {
          setProgressMap(map);
        } else if (localProgress.length === 0) {
          setProgressMap({});
        } else {
          setProgressMap(map);
        }

        // Load study sessions from IndexedDB, filtering out old mock sessions
        const localSessions = await offlineDb.studySessions.toArray();
        const realSessions = localSessions.filter(
          (s) => !['sched-1', 'sched-2', 'sched-3', 'sess-1', 'sess-2'].includes(s.id)
        );
        setStudySessions(realSessions);
      } catch (e) {
        console.error('Error loading curriculum', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadCurriculumData();

    const handleLogoutPrivacyClear = () => {
      setProgressMap({});
      setStudySessions([]);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('matric:logout', handleLogoutPrivacyClear);
      return () => window.removeEventListener('matric:logout', handleLogoutPrivacyClear);
    }
  }, []);

  const removeDemoData = async () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('matric_demo_cleared', 'true');
    }
    setIsDemoMode(false);
    await offlineDb.chapterProgress.clear();
    await offlineDb.studySessions.clear();
    setProgressMap({});
    setStudySessions([]);
    try {
      const res = await fetch('/api/curriculum');
      if (res.ok) {
        const data = await res.json();
        setCurriculum(data);
      }
    } catch {
      // ignore
    }
  };

  const restoreDemoData = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('matric_demo_cleared');
    }
    setIsDemoMode(true);
    await offlineDb.chapterProgress.clear();
    setProgressMap({});
  };

  // Compute unit and chapter metrics dynamically from current progress
  let totalUnitsCount = 0;
  let completedUnitsCount = 0;
  let totalChaptersCount = 0;
  let completedChaptersCount = 0;

  if (curriculum) {
    const grades = curriculum.curriculum ? curriculum.curriculum.grades : (curriculum as any).grades || [];
    for (const g of grades) {
      for (const s of g.subjects) {
        for (const u of s.units) {
          totalUnitsCount++;
          const unitChapters = u.chapters || [];
          let unitChaptersDone = 0;

          for (const c of unitChapters) {
            totalChaptersCount++;
            const status = progressMap[c.id]?.status;
            if (status === 'studied' || status === 'practicing' || status === 'mastered') {
              completedChaptersCount++;
              unitChaptersDone++;
            }
          }

          // A unit is completed if all its chapters are studied/mastered
          const isComplete =
            unitChapters.length > 0 && unitChaptersDone === unitChapters.length;
          if (isComplete) {
            completedUnitsCount++;
          }
        }
      }
    }
  }

  // Pure real metrics without artificial mock baseline
  const displayTotalUnits = totalUnitsCount;
  const displayCompletedUnits = completedUnitsCount;
  const remainingUnitsCount = Math.max(0, displayTotalUnits - displayCompletedUnits);

  // Individual subtopics/chapters completed add up directly to the percentage!
  const rawProgressPercentage =
    totalChaptersCount > 0
      ? (completedChaptersCount / totalChaptersCount) * 100
      : displayTotalUnits > 0
      ? (displayCompletedUnits / displayTotalUnits) * 100
      : 0;

  // For high precision when starting out, show 1 decimal place if below 1%
  const overallProgressPercentage =
    completedChaptersCount === 0
      ? 0
      : rawProgressPercentage < 1
      ? Number(rawProgressPercentage.toFixed(1))
      : Math.round(rawProgressPercentage);

  // Compute performance dimensions
  const allChaptersList: Chapter[] = [];
  if (curriculum) {
    const grades = curriculum.curriculum ? curriculum.curriculum.grades : (curriculum as any).grades || [];
    for (const g of grades) {
      for (const s of g.subjects) {
        for (const u of s.units) {
          allChaptersList.push(...u.chapters);
        }
      }
    }
  }

  const progressArray = Object.values(progressMap);
  const metrics = calculatePerformanceDimensions(allChaptersList.length || 378, progressArray);
  const weakChapters = identifyWeakChapters(progressArray);

  const updateChapterStatus = async (
    chapterId: string,
    status: ChapterStudyStatus,
    score?: number
  ) => {
    const existing = progressMap[chapterId] || {
      id: `prog-${chapterId}`,
      userId: 'local-user',
      chapterId,
      status: 'not_started',
      revisionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Enforce assessment check for mastery
    if (status === 'mastered' && !canMarkMastered(status, score || existing.assessmentScoreAverage, 1)) {
      alert('Mastery requires passing chapter assessment evidence (minimum 75%).');
      return;
    }

    const updated: StudentChapterProgress = {
      ...existing,
      status,
      lastStudiedAt: new Date().toISOString(),
      masteredAt: status === 'mastered' ? new Date().toISOString() : existing.masteredAt,
      assessmentScoreAverage: score !== undefined ? score : existing.assessmentScoreAverage,
      updatedAt: new Date().toISOString(),
    };

    setProgressMap((prev) => ({ ...prev, [chapterId]: updated }));
    await offlineDb.chapterProgress.put(updated);
    await syncEngine.queueOperation('chapter_progress', 'UPDATE', chapterId, updated as any);
  };

  const toggleUnitProgress = (unitId: string) => {
    if (!curriculum) return;
    const grades = curriculum.curriculum ? curriculum.curriculum.grades : (curriculum as any).grades || [];
    for (const g of grades) {
      for (const s of g.subjects) {
        for (const u of s.units) {
          if (u.id === unitId) {
            const allDone = u.chapters.every((c: any) => {
              const st = progressMap[c.id]?.status;
              return st === 'studied' || st === 'mastered';
            });
            const nextStatus: ChapterStudyStatus = allDone ? 'not_started' : 'studied';
            for (const c of u.chapters) {
              updateChapterStatus(c.id, nextStatus);
            }
            return;
          }
        }
      }
    }
  };

  const saveChapterNotes = async (chapterId: string, notes: string) => {
    const existing = progressMap[chapterId];
    if (existing) {
      const updated = { ...existing, personalNotes: notes, updatedAt: new Date().toISOString() };
      setProgressMap((prev) => ({ ...prev, [chapterId]: updated }));
      await offlineDb.chapterProgress.put(updated);
      await syncEngine.queueOperation('chapter_progress', 'UPDATE', chapterId, updated as any);
    }
  };

  const setChapterDifficulty = async (chapterId: string, rating: DifficultyRating) => {
    const existing = progressMap[chapterId];
    if (existing) {
      const updated = { ...existing, difficultyRating: rating, updatedAt: new Date().toISOString() };
      setProgressMap((prev) => ({ ...prev, [chapterId]: updated }));
      await offlineDb.chapterProgress.put(updated);
      await syncEngine.queueOperation('chapter_progress', 'UPDATE', chapterId, updated as any);
    }
  };

  const renameUnit = (unitId: string, newTitle: string) => {
    if (!curriculum) return;
    const cloned = JSON.parse(JSON.stringify(curriculum)) as CurriculumRoot;
    for (const g of cloned.curriculum.grades) {
      for (const s of g.subjects) {
        for (const u of s.units) {
          if (u.id === unitId) {
            u.title = newTitle;
            setCurriculum(cloned);
            offlineDb.curriculum.put({
              id: 'master',
              version: cloned.schema_version,
              data: cloned,
              cachedAt: Date.now(),
            });
            return;
          }
        }
      }
    }
  };

  const addUnitToSubject = (subjectId: string, unitTitle: string) => {
    if (!curriculum) return;
    const cloned = JSON.parse(JSON.stringify(curriculum)) as CurriculumRoot;
    for (const g of cloned.curriculum.grades) {
      for (const s of g.subjects) {
        if (s.id === subjectId) {
          const nextOrder = s.units.length + 1;
          const newUnit: Unit = {
            id: `${subjectId}-u${nextOrder.toString().padStart(2, '0')}`,
            number: nextOrder.toString(),
            title: unitTitle,
            order: nextOrder,
            review_status: 'verified',
            chapters: [
              {
                id: `${subjectId}-u${nextOrder.toString().padStart(2, '0')}-c01`,
                number: `${nextOrder}.1`,
                title: `${unitTitle} - Core Concepts`,
                order: 1,
                review_status: 'verified',
                prerequisite_ids: [],
                subtopics: [],
              },
            ],
          };
          s.units.push(newUnit);
          setCurriculum(cloned);
          offlineDb.curriculum.put({
            id: 'master',
            version: cloned.schema_version,
            data: cloned,
            cachedAt: Date.now(),
          });
          return;
        }
      }
    }
  };

  // Study Sessions Management
  const scheduleSession = async (
    sessionData: Omit<StudySession, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    const newSession: StudySession = {
      id: sessionData.id || `sess-${Date.now()}`,
      userId: 'local-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...sessionData,
    };
    await offlineDb.studySessions.put(newSession);
    setStudySessions((prev) => [newSession, ...prev]);
  };

  const updateSession = async (sessionId: string, updates: Partial<StudySession>) => {
    const existing = studySessions.find((s) => s.id === sessionId);
    if (!existing) return;
    const updated: StudySession = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await offlineDb.studySessions.put(updated);
    setStudySessions((prev) => prev.map((s) => (s.id === sessionId ? updated : s)));
  };

  const postponeSession = async (sessionId: string, minutes: number) => {
    const existing = studySessions.find((s) => s.id === sessionId);
    if (!existing) return;
    const currStart = new Date(existing.startTime).getTime();
    const newStart = new Date(currStart + minutes * 60000).toISOString();
    const currEnd = new Date(existing.endTime).getTime();
    const newEnd = new Date(currEnd + minutes * 60000).toISOString();
    const updated: StudySession = {
      ...existing,
      startTime: newStart,
      endTime: newEnd,
      status: 'rescheduled',
      updatedAt: new Date().toISOString(),
    };
    await offlineDb.studySessions.put(updated);
    setStudySessions((prev) => prev.map((s) => (s.id === sessionId ? updated : s)));
  };

  const deleteSession = async (sessionId: string) => {
    await offlineDb.studySessions.delete(sessionId);
    setStudySessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const clearAllSessions = async () => {
    await offlineDb.studySessions.clear();
    setStudySessions([]);
  };

  // Curriculum Data Management
  const clearCurriculumProgress = async () => {
    await offlineDb.chapterProgress.clear();
    setProgressMap({});
    if (typeof window !== 'undefined') {
      localStorage.setItem('matric_demo_cleared', 'true');
    }
  };

  const clearCurriculumStructure = async () => {
    await offlineDb.chapterProgress.clear();
    await offlineDb.curriculum.clear();
    setProgressMap({});
    setCurriculum({
      schema_version: '1.0.0',
      curriculum: {
        id: 'empty',
        name: 'Empty Curriculum',
        country_code: 'ET',
        language: 'en',
        source_documents: [],
        grades: [],
      },
    });
  };

  const restoreOfficialCurriculum = async () => {
    try {
      const res = await fetch('/api/curriculum');
      if (res.ok) {
        const data = await res.json();
        setCurriculum(data);
        await offlineDb.curriculum.put({
          id: 'master',
          version: data.schema_version,
          data,
          cachedAt: Date.now(),
        });
      }
    } catch (e) {
      console.error('Failed to restore official curriculum', e);
    }
  };

  return (
    <CurriculumContext.Provider
      value={{
        curriculum,
        isLoading,
        isDemoMode,
        removeDemoData,
        restoreDemoData,
        progressMap,
        metrics,
        weakChapters,
        toggleUnitProgress,
        updateChapterStatus,
        saveChapterNotes,
        setChapterDifficulty,
        renameUnit,
        addUnitToSubject,
        totalUnitsCount: displayTotalUnits,
        completedUnitsCount: displayCompletedUnits,
        remainingUnitsCount,
        totalChaptersCount,
        completedChaptersCount,
        overallProgressPercentage,
        studySessions,
        scheduleSession,
        updateSession,
        postponeSession,
        deleteSession,
        clearAllSessions,
        clearCurriculumProgress,
        clearCurriculumStructure,
        restoreOfficialCurriculum,
      }}
    >
      {children}
    </CurriculumContext.Provider>
  );
}

export function useCurriculum() {
  const context = useContext(CurriculumContext);
  if (!context) {
    throw new Error('useCurriculum must be used within CurriculumProvider');
  }
  return context;
}
