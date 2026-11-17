'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopStatsBar } from '../components/dashboard/TopStatsBar';
import { PreparationBanner } from '../components/dashboard/PreparationBanner';
import { ProgressByGrade } from '../components/dashboard/ProgressByGrade';
import { UpcomingSchedules } from '../components/dashboard/UpcomingSchedules';
import { StudyActivityHeatmap } from '../components/dashboard/StudyActivityHeatmap';
import { AllUnitsView } from '../components/curriculum/AllUnitsView';
import { RenameUnitModal } from '../components/dashboard/RenameUnitModal';
import { AddUnitModal } from '../components/dashboard/AddUnitModal';
import { StudyPlannerWorkspace } from '../components/planner/StudyPlannerWorkspace';
import { ScheduleStudyModal } from '../components/planner/ScheduleStudyModal';
import { ManageScheduleModal } from '../components/planner/ManageScheduleModal';
import { FocusWorkspace } from '../components/focus/FocusWorkspace';
import { PracticeWorkspace } from '../components/quiz/PracticeWorkspace';
import { AnalyticsWorkspace } from '../components/analytics/AnalyticsWorkspace';
import { AdminCurriculumWorkspace } from '../components/admin/AdminCurriculumWorkspace';
import { AuthModal } from '../components/auth/AuthModal';
import { FloatingGlassBar } from '../components/ui/GlassControls';
import { useCurriculum } from '../context/CurriculumContext';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';
import {
  Cloud,
  Shield,
  Menu,
  Sun,
  Moon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Layers,
} from 'lucide-react';
import type { StudySession } from '@matric/shared-types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScheduleStudyModalOpen, setIsScheduleStudyModalOpen] = useState(false);
  const [editingScheduleSession, setEditingScheduleSession] = useState<StudySession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const [renameModalState, setRenameModalState] = useState<{
    isOpen: boolean;
    unitId: string | null;
    title: string;
  }>({
    isOpen: false,
    unitId: null,
    title: '',
  });

  const [addUnitModalState, setAddUnitModalState] = useState<{
    isOpen: boolean;
    subjectId: string | null;
  }>({
    isOpen: false,
    subjectId: null,
  });

  const {
    curriculum,
    isDemoMode,
    removeDemoData,
    progressMap,
    totalUnitsCount,
    completedUnitsCount,
    remainingUnitsCount,
    totalChaptersCount,
    completedChaptersCount,
    overallProgressPercentage,
    toggleUnitProgress,
    updateChapterStatus,
    renameUnit,
    addUnitToSubject,
    studySessions,
    scheduleSession,
    updateSession,
    postponeSession,
    deleteSession,
    clearCurriculumProgress,
    clearCurriculumStructure,
    restoreOfficialCurriculum,
  } = useCurriculum();

  const realActivityData = useMemo(() => {
    const data: Record<string, { sessions: number; chapters: number; minutes: number }> = {};
    for (const prog of Object.values(progressMap)) {
      if (prog.status === 'studied' || prog.status === 'mastered' || prog.status === 'practicing') {
        const dateKey = (prog.lastStudiedAt || prog.updatedAt || new Date().toISOString()).split('T')[0];
        if (!data[dateKey]) {
          data[dateKey] = { sessions: 0, chapters: 0, minutes: 0 };
        }
        data[dateKey].chapters += 1;
        data[dateKey].sessions += 1;
        data[dateKey].minutes += 45;
      }
    }
    return data;
  }, [progressMap]);

  const { user } = useAuth();
  const { preferences, toggleTheme } = usePreferences();

  const handleOpenRename = (unitId: string, currentTitle: string) => {
    setRenameModalState({
      isOpen: true,
      unitId,
      title: currentTitle,
    });
  };

  const handleSaveRename = (unitId: string, newTitle: string) => {
    renameUnit(unitId, newTitle);
  };

  const handleOpenAddUnit = (subjectId: string) => {
    setAddUnitModalState({
      isOpen: true,
      subjectId,
    });
  };

  const handleSaveAddUnit = (subjectId: string, unitTitle: string) => {
    addUnitToSubject(subjectId, unitTitle);
  };

  const handleToggleChapter = (chapterId: string) => {
    const current = progressMap[chapterId]?.status;
    const nextStatus = current === 'studied' || current === 'mastered' ? 'not_started' : 'studied';
    updateChapterStatus(chapterId, nextStatus);
  };

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      {/* Pinned Constant Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        totalUnits={totalUnitsCount}
        completedUnits={completedUnitsCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 min-h-screen overflow-y-auto">
        {/* Top Minimal Bar */}
        <header className="sticky top-0 z-40 flex h-14 3xl:h-18 items-center justify-between border-b border-line bg-surface/80 px-4 sm:px-6 3xl:px-12 backdrop-blur-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg border border-line text-ink-2 hover:bg-surface-2 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="text-xs 3xl:text-sm font-semibold uppercase tracking-wider text-ink-3">
              {activeTab.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Action: Schedule Study */}
            <button
              type="button"
              onClick={() => setIsScheduleStudyModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-green/10 text-green border border-green/20 px-3 py-1 text-2xs 3xl:text-xs font-semibold hover:bg-green/20 transition-colors shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Schedule</span>
            </button>

            {/* Quick Clean Actions */}
            <button
              type="button"
              onClick={async () => {
                await clearCurriculumProgress();
                setToastNotification('Curriculum progress reset: all checkmarks cleared (0% clean slate).');
                setTimeout(() => setToastNotification(null), 3500);
              }}
              className="hidden xs:inline-flex items-center gap-1 rounded-xl border border-line bg-surface px-2.5 py-1 text-2xs 3xl:text-xs font-semibold text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors shadow-2xs"
              title="Reset all studied chapters to 0%"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Clear Progress</span>
            </button>

            {/* Functional Theme Switch at Top Right */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-xl border border-line bg-surface text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors shadow-xs"
              title={`Switch to ${preferences.theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle theme"
            >
              {preferences.theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
            </button>

            {/* Offline / Cloud Status */}
            <div className="hidden sm:flex items-center gap-1.5 text-2xs 3xl:text-xs text-ink-3">
              <Cloud className="h-3.5 w-3.5 text-green" />
              <span>Offline-Ready</span>
            </div>

            {/* User status & Auth button */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.isGuest && (
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="rounded-lg bg-green/10 border border-green/20 px-2.5 py-1 text-2xs font-semibold text-green hover:bg-green/20 transition-colors"
                  >
                    Save progress (Convert)
                  </button>
                )}
                {user.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-purple-500/10 text-purple-600 px-1.5 py-0.5 text-3xs font-semibold">
                    <Shield className="h-2.5 w-2.5" /> Admin
                  </span>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="rounded-lg bg-green px-3.5 py-1.5 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs"
              >
                Sign in / Guest
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <div className="p-3.5 xs:p-4 sm:p-6 md:p-8 2xl:p-10 3xl:p-14 max-w-6xl 2xl:max-w-7xl 3xl:max-w-[1920px] tv:max-w-[2400px] mx-auto space-y-6 sm:space-y-8 3xl:space-y-12">
          {/* Action Feedback Banner */}
          {toastNotification && (
            <div className="rounded-xl border border-green/30 bg-green/10 px-4 py-2.5 text-xs text-green font-medium animate-in fade-in flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{toastNotification}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastNotification(null)}
                className="text-xs text-green hover:underline ml-4"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Cleared Curriculum Structure Notice (If structure was completely emptied) */}
          {totalUnitsCount === 0 && (
            <div className="rounded-2xl border border-amber-300/80 bg-amber-50/90 p-4 dark:border-amber-800 dark:bg-amber-950/40 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <h3 className="text-xs font-semibold text-ink">Curriculum Structure Cleared</h3>
                  <p className="text-2xs text-ink-3">
                    0 units currently loaded. You can upload custom curriculum JSON or restore the official Ethiopian curriculum.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await restoreOfficialCurriculum();
                  setToastNotification('Official Ethiopian Secondary Curriculum (100 units) restored!');
                  setTimeout(() => setToastNotification(null), 3500);
                }}
                className="rounded-xl bg-green px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs"
              >
                Restore 100 Units
              </button>
            </div>
          )}

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <>
              {/* Top Statistics Row */}
              <TopStatsBar
                totalUnits={totalUnitsCount}
                completedUnits={completedUnitsCount}
                remainingUnits={remainingUnitsCount}
                totalChapters={totalChaptersCount}
                completedChapters={completedChaptersCount}
                overallProgress={overallProgressPercentage}
              />

              {/* Preparation Banner */}
              <PreparationBanner onStartStudy={() => setActiveTab('focus_mode')} />

              {/* Progress By Grade */}
              <ProgressByGrade
                curriculum={curriculum}
                progressMap={progressMap}
                onSelectGrade={(g) => setActiveTab(`grade_${g}`)}
              />

              {/* Upcoming Schedules Row */}
              <UpcomingSchedules
                sessions={studySessions}
                onStartSession={(sess) => setActiveTab('focus_mode')}
                onOpenPlanner={() => setActiveTab('study_planner')}
                onOpenScheduleModal={() => setIsScheduleStudyModalOpen(true)}
                onEditSession={(sess) => setEditingScheduleSession(sess)}
                onPostponeSession={postponeSession}
                onDeleteSession={deleteSession}
              />

              {/* GitHub-Like Activity Heatmap Table */}
              <StudyActivityHeatmap
                activityData={realActivityData}
                hasDemoData={false}
              />
            </>
          )}

          {/* Tab 2: All Units */}
          {activeTab === 'all_units' && (
            <AllUnitsView
              curriculum={curriculum}
              progressMap={progressMap}
              filterMode="all"
              onToggleChapter={handleToggleChapter}
              onToggleUnit={toggleUnitProgress}
              onRenameUnit={handleOpenRename}
              onAddUnit={handleOpenAddUnit}
            />
          )}

          {/* Tab 3: Completed Units */}
          {activeTab === 'completed' && (
            <AllUnitsView
              curriculum={curriculum}
              progressMap={progressMap}
              filterMode="completed"
              onToggleChapter={handleToggleChapter}
              onToggleUnit={toggleUnitProgress}
              onRenameUnit={handleOpenRename}
              onAddUnit={handleOpenAddUnit}
            />
          )}

          {/* Tab 4: Not Completed Units */}
          {activeTab === 'not_completed' && (
            <AllUnitsView
              curriculum={curriculum}
              progressMap={progressMap}
              filterMode="not_completed"
              onToggleChapter={handleToggleChapter}
              onToggleUnit={toggleUnitProgress}
              onRenameUnit={handleOpenRename}
              onAddUnit={handleOpenAddUnit}
            />
          )}

          {/* Quick Jump for Specific Grades */}
          {activeTab.startsWith('grade_') && (
            <AllUnitsView
              key={activeTab}
              curriculum={curriculum}
              progressMap={progressMap}
              filterMode="all"
              initialGrade={Number(activeTab.replace('grade_', ''))}
              onToggleChapter={handleToggleChapter}
              onToggleUnit={toggleUnitProgress}
              onRenameUnit={handleOpenRename}
              onAddUnit={handleOpenAddUnit}
            />
          )}

          {/* Tab 5: Study Planner */}
          {activeTab === 'study_planner' && (
            <StudyPlannerWorkspace
              onStartFocusSession={(title) => {
                setActiveTab('focus_mode');
              }}
            />
          )}

          {/* Tab 6: Focus Mode */}
          {activeTab === 'focus_mode' && <FocusWorkspace />}

          {/* Tab 7: Practice (Renamed from My Mastery) */}
          {(activeTab === 'practice' || activeTab === 'my_mastery') && (
            <PracticeWorkspace />
          )}

          {/* Tab 8: Analytics */}
          {activeTab === 'analytics' && <AnalyticsWorkspace />}

          {/* Tab 9: JSON Manager */}
          {activeTab === 'admin_curriculum' && <AdminCurriculumWorkspace />}
        </div>
      </main>

      {/* Builtin Custom Modal: Rename Unit */}
      <RenameUnitModal
        isOpen={renameModalState.isOpen}
        unitId={renameModalState.unitId}
        currentTitle={renameModalState.title}
        onClose={() => setRenameModalState({ isOpen: false, unitId: null, title: '' })}
        onSave={handleSaveRename}
      />

      {/* Builtin Custom Modal: Add Unit */}
      <AddUnitModal
        isOpen={addUnitModalState.isOpen}
        subjectId={addUnitModalState.subjectId}
        onClose={() => setAddUnitModalState({ isOpen: false, subjectId: null })}
        onAdd={handleSaveAddUnit}
      />

      {/* Schedule Study Modal */}
      <ScheduleStudyModal
        isOpen={isScheduleStudyModalOpen}
        curriculum={curriculum}
        onClose={() => setIsScheduleStudyModalOpen(false)}
        onSchedule={async (data) => {
          const startTime = `${data.scheduledDateTime}:00Z`;
          const endTime = new Date(new Date(data.scheduledDateTime).getTime() + data.durationMinutes * 60000).toISOString();
          await scheduleSession({
            title: `${data.subjectName} (Grade ${data.grade}): ${data.chapterRange}`,
            grade: data.grade as any,
            subjectId: data.subjectId,
            unitIds: [],
            chapterIds: [],
            startTime,
            endTime,
            plannedDurationMinutes: data.durationMinutes,
            studyMethod: data.focusModeEnforced ? 'active_recall' : 'reading',
            status: 'planned',
            sessionObjective: `Unit: ${data.unitTitle} | ${data.focusModeEnforced ? 'Focus mode enforced' : 'Standard study'}`,
          });
          setToastNotification(`Scheduled "${data.subjectName}" for ${data.scheduledDateTime.replace('T', ' at ')}`);
          setTimeout(() => setToastNotification(null), 4000);
        }}
      />

      {/* Manage/Edit Schedule Modal */}
      <ManageScheduleModal
        isOpen={!!editingScheduleSession}
        session={editingScheduleSession}
        curriculum={curriculum}
        onClose={() => setEditingScheduleSession(null)}
        onSave={async (sessionId, updates) => {
          await updateSession(sessionId, updates);
          setToastNotification('Schedule updated successfully.');
          setTimeout(() => setToastNotification(null), 3500);
        }}
        onPostpone={async (sessionId, minutes) => {
          await postponeSession(sessionId, minutes);
          const hrs = minutes >= 60 ? `${Math.round(minutes / 60)}h` : `${minutes}m`;
          setToastNotification(`Session postponed by ${hrs}.`);
          setTimeout(() => setToastNotification(null), 3500);
        }}
        onDelete={async (sessionId) => {
          await deleteSession(sessionId);
          setToastNotification('Schedule deleted.');
          setTimeout(() => setToastNotification(null), 3500);
        }}
        onStartFocus={(sess) => {
          setActiveTab('focus_mode');
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Floating Glass Control Pill with DialKit Live Tuning */}
      <FloatingGlassBar
        activeTab={activeTab}
        onOpenAllUnits={() => {
          setActiveTab('all_units');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onQuickFocus={() => {
          setActiveTab('focus_mode');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPlanner={() => {
          setActiveTab('study_planner');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPractice={() => {
          setActiveTab('practice');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
