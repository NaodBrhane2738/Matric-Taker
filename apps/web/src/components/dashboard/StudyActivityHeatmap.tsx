'use client';

import React, { useState, useMemo } from 'react';
import { Info } from 'lucide-react';

interface DayActivity {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  details: string;
}

interface StudyActivityHeatmapProps {
  activityData?: Record<string, { sessions: number; chapters: number; minutes: number }>;
  hasDemoData?: boolean;
}

export function StudyActivityHeatmap({
  activityData = {},
  hasDemoData = false,
}: StudyActivityHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Generate 52 weeks (364 days) leading up to current date
  const { weeks, monthLabels, totalActivities } = useMemo(() => {
    const today = new Date();
    const weeksList: DayActivity[][] = [];
    const monthsMap: { name: string; weekIndex: number }[] = [];
    let runningTotal = 0;

    // Start 52 weeks ago from previous Sunday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (52 * 7) + (7 - today.getDay()));

    let lastMonth = -1;

    for (let w = 0; w < 52; w++) {
      const currentWeek: DayActivity[] = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (w * 7) + d);
        const iso = currentDate.toISOString().split('T')[0];

        // Seed realistic study pattern matching uploaded image if empty
        const seededDayHash = (iso.charCodeAt(8) * 17 + iso.charCodeAt(9) * 31 + w * 13 + d * 7) % 100;
        let count = 0;
        let minutes = 0;
        let chapters = 0;

        if (activityData[iso]) {
          count = activityData[iso].sessions + activityData[iso].chapters;
          minutes = activityData[iso].minutes;
          chapters = activityData[iso].chapters;
        } else if (hasDemoData && w >= 14 && seededDayHash < 42) {
          // Generates activity clusters for demo preview if demo data is active
          count = (seededDayHash % 4) + 1;
          minutes = count * 35;
          chapters = Math.max(1, Math.floor(count / 2));
        }

        runningTotal += count;

        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (count >= 4) level = 4;
        else if (count === 3) level = 3;
        else if (count === 2) level = 2;
        else if (count === 1) level = 1;

        const month = currentDate.getMonth();
        if (d === 0 && month !== lastMonth && w < 50) {
          monthsMap.push({
            name: currentDate.toLocaleString('default', { month: 'short' }),
            weekIndex: w,
          });
          lastMonth = month;
        }

        const dateStr = currentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        currentWeek.push({
          date: iso,
          dayOfWeek: d,
          count,
          level,
          details:
            count > 0
              ? `${count} study sessions (${chapters} chapters, ${minutes}m focus) on ${dateStr}`
              : `No study activity on ${dateStr}`,
        });
      }
      weeksList.push(currentWeek);
    }

    return { weeks: weeksList, monthLabels: monthsMap, totalActivities: runningTotal };
  }, [activityData]);

  const getCellColor = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 1:
        return 'bg-[#0e4429] border-[#006d32]/30 dark:bg-[#0e4429] light:bg-[#9be9a8]';
      case 2:
        return 'bg-[#006d32] border-[#26a641]/30 dark:bg-[#006d32] light:bg-[#40c463]';
      case 3:
        return 'bg-[#26a641] border-[#39d353]/30 dark:bg-[#26a641] light:bg-[#30a14e]';
      case 4:
        return 'bg-[#39d353] border-[#39d353]/50 dark:bg-[#39d353] light:bg-[#216e39]';
      default:
        return 'bg-[#161b22] border-line/20 dark:bg-[#161b22] light:bg-[#ebedf0]';
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-5.5 shadow-xs transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-line/60 gap-2">
        <div>
          <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
            <span>Study Activity &amp; Consistency</span>
            <span className="rounded-full bg-green/10 text-green px-2 py-0.5 text-2xs font-medium">
              {totalActivities} study sessions logged in the last year
            </span>
          </h2>
          <p className="text-xs text-ink-3 mt-0.5">
            Continuous daily focus and chapter mastery leading to Ethiopian Matric Examination day.
          </p>
        </div>
      </div>

      {/* Heatmap Area - Large prominent grid */}
      <div className="mt-5 overflow-x-auto pb-3 select-none">
        <div className="min-w-[960px]">
          {/* Month Labels Header with ample clearance above grid */}
          <div className="flex text-3xs text-ink-3 pl-9 mb-4 h-6 relative font-medium">
            {monthLabels.map((m, idx) => (
              <span
                key={`${m.name}-${idx}`}
                className="absolute tracking-wide"
                style={{ left: `${m.weekIndex * 18 + 40}px` }}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* Grid with Day of Week Column */}
          <div className="flex items-start gap-1.5">
            {/* Day Labels */}
            <div className="flex flex-col gap-1 text-3xs text-ink-3 pr-2 w-8 font-mono pt-[2px]">
              <span className="h-3.5 leading-none"></span>
              <span className="h-3.5 leading-none font-medium">Mon</span>
              <span className="h-3.5 leading-none"></span>
              <span className="h-3.5 leading-none font-medium">Wed</span>
              <span className="h-3.5 leading-none"></span>
              <span className="h-3.5 leading-none font-medium">Fri</span>
              <span className="h-3.5 leading-none"></span>
            </div>

            {/* 52 Columns */}
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => (
                    <div
                      key={`${wIdx}-${dIdx}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
                        setHoveredDay(day);
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`h-3.5 w-3.5 rounded-[3px] border transition-transform duration-100 hover:scale-125 cursor-pointer ${getCellColor(
                        day.level
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info & Legend */}
      <div className="mt-4 flex items-center justify-between text-3xs text-ink-3 pt-3 border-t border-line/40">
        <button
          type="button"
          onClick={() => setShowInfoModal(true)}
          className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium transition-colors"
        >
          <Info className="h-3 w-3" />
          <span>Learn how we count daily study activity.</span>
        </button>

        <div className="flex items-center gap-1.5 font-medium">
          <span>Less</span>
          <span className="h-3.5 w-3.5 rounded-[3px] bg-[#161b22] border border-line/30" />
          <span className="h-3.5 w-3.5 rounded-[3px] bg-[#0e4429] border border-[#006d32]/30" />
          <span className="h-3.5 w-3.5 rounded-[3px] bg-[#006d32] border border-[#26a641]/30" />
          <span className="h-3.5 w-3.5 rounded-[3px] bg-[#26a641] border border-[#39d353]/30" />
          <span className="h-3.5 w-3.5 rounded-[3px] bg-[#39d353] border border-[#39d353]/50" />
          <span>More</span>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full rounded-lg bg-ink text-surface px-2.5 py-1.5 text-3xs font-medium shadow-lg border border-line animate-in fade-in zoom-in-95 duration-100"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          {hoveredDay.details}
        </div>
      )}

      {/* Info Dialog */}
      {showInfoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl border border-line">
            <h3 className="text-base font-semibold text-ink">How Study Activity is Counted</h3>
            <div className="mt-3 space-y-2.5 text-xs text-ink-2 leading-relaxed">
              <p>
                The Matric Tracker Activity Table records your daily learning commitment:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-ink-3 text-3xs">
                <li><strong className="text-ink">Chapter Study:</strong> Marking a textbook unit chapter as studied.</li>
                <li><strong className="text-ink">Focus Sessions:</strong> Completing a 1-hour Pomodoro or 2-hour Deep Work block.</li>
                <li><strong className="text-ink">Practice Quizzes:</strong> Taking assessments or JSON practice questions.</li>
                <li><strong className="text-ink">Scheduled Reviews:</strong> Executing planned study blocks on your calendar.</li>
              </ul>
              <p className="pt-1 text-3xs text-ink-3">
                Higher intensity levels indicate multiple completed learning milestones on the same calendar date.
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="rounded-xl bg-green px-4 py-2 text-xs font-medium text-white hover:bg-green-dark transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
