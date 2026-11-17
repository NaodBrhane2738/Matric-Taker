export type TimerMode = 'pomodoro' | 'deep_work' | 'custom';

export interface FocusSession {
  id: string;
  userId: string;
  chapterId?: string;
  grade?: number;
  subjectId?: string;
  mode: TimerMode;
  plannedSeconds: number;
  actualFocusedSeconds: number;
  breakSeconds: number;
  interruptionCount: number;
  tabSwitchCount: number;
  completed: boolean;
  xpEarned: number;
  startedAt: string;
  endedAt?: string;
  notes?: string;
}

export interface FocusTimerState {
  sessionId: string | null;
  mode: TimerMode;
  status: 'idle' | 'running' | 'paused' | 'break' | 'completed';
  plannedSeconds: number;
  elapsedSeconds: number;
  startTimestamp: number | null; // Date.now() timestamp
  pauseTimestamp: number | null;
  accumulatedSeconds: number;
  chapterId?: string;
}
