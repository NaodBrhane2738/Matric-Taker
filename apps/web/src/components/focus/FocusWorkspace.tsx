'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  EyeOff,
  CheckCircle2,
  Settings2,
  Flame,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function FocusWorkspace() {
  const [mode, setMode] = useState<'pomodoro' | 'deep_work' | 'custom'>('pomodoro');
  const [pomodoroDefaultMins, setPomodoroDefaultMins] = useState(60); // 1H default
  const [deepWorkDefaultMins, setDeepWorkDefaultMins] = useState(120); // 2H default
  const [customDefaultMins, setCustomDefaultMins] = useState(45);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [plannedMinutes, setPlannedMinutes] = useState(60);
  const [secondsRemaining, setSecondsRemaining] = useState(60 * 60);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [interruptionCount, setInterruptionCount] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('Grade 12 Biology: 1.1 Application of Biology');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Correct timestamp-based timer derivation
  const targetTimeRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number>(60 * 60);

  const getMinsForMode = (m: 'pomodoro' | 'deep_work' | 'custom') => {
    if (m === 'pomodoro') return pomodoroDefaultMins;
    if (m === 'deep_work') return deepWorkDefaultMins;
    return customDefaultMins;
  };

  const setTimerMode = (m: 'pomodoro' | 'deep_work' | 'custom') => {
    setMode(m);
    setIsRunning(false);
    setIsPaused(false);
    const mins = getMinsForMode(m);
    setPlannedMinutes(mins);
    setSecondsRemaining(mins * 60);
    pausedRemainingRef.current = mins * 60;
    targetTimeRef.current = null;
  };

  const handleAdjustDuration = (delta: number) => {
    if (isRunning) return;
    const newMins = Math.max(5, plannedMinutes + delta);
    setPlannedMinutes(newMins);
    setSecondsRemaining(newMins * 60);
    pausedRemainingRef.current = newMins * 60;

    if (mode === 'pomodoro') setPomodoroDefaultMins(newMins);
    else if (mode === 'deep_work') setDeepWorkDefaultMins(newMins);
    else setCustomDefaultMins(newMins);
  };

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      targetTimeRef.current = Date.now() + pausedRemainingRef.current * 1000;
    }
  };

  const handlePause = () => {
    if (isRunning && !isPaused && targetTimeRef.current) {
      const remaining = Math.max(0, Math.round((targetTimeRef.current - Date.now()) / 1000));
      pausedRemainingRef.current = remaining;
      setSecondsRemaining(remaining);
      setIsPaused(true);
      setIsRunning(false);
      targetTimeRef.current = null;
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSecondsRemaining(plannedMinutes * 60);
    pausedRemainingRef.current = plannedMinutes * 60;
    targetTimeRef.current = null;
  };

  const handleComplete = () => {
    setIsRunning(false);
    setIsPaused(false);
    targetTimeRef.current = null;
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } catch {}
    setShowCompleteModal(true);
  };

  // Clock tick with requestAnimationFrame / setInterval derived from timestamp
  useEffect(() => {
    if (!isRunning || !targetTimeRef.current) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((targetTimeRef.current! - Date.now()) / 1000));
      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleComplete();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Page Visibility API interruption tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        setInterruptionCount((prev) => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const progressPercent = Math.min(
    100,
    Math.round(((plannedMinutes * 60 - secondsRemaining) / (plannedMinutes * 60)) * 100)
  );

  return (
    <div
      className={`space-y-6 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 bg-canvas p-8 overflow-y-auto' : ''
      }`}
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-semibold text-ink flex items-center gap-2">
            <Flame className="h-5 w-5 text-accent" />
            <span>Focus Mode</span>
          </h2>
          <p className="text-xs text-ink-3 mt-0.5">
            Distraction-free deep work. Tab switches and backgrounding are logged as interruptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-1.5 rounded-xl border border-line px-3 py-1.5 text-xs font-medium transition-colors ${
              showSettings ? 'bg-surface-2 text-ink' : 'bg-surface text-ink-3 hover:text-ink'
            }`}
            title="Adjust default durations"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-3 hover:text-ink transition-colors"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Zen Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Switchers */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setTimerMode('pomodoro')}
          className={`rounded-xl px-5 py-2 text-xs font-medium transition-all ${
            mode === 'pomodoro'
              ? 'bg-green text-white shadow-xs'
              : 'border border-line bg-surface text-ink-2 hover:bg-surface-2'
          }`}
        >
          Pomodoro ({pomodoroDefaultMins}m / 1H)
        </button>
        <button
          type="button"
          onClick={() => setTimerMode('deep_work')}
          className={`rounded-xl px-5 py-2 text-xs font-medium transition-all ${
            mode === 'deep_work'
              ? 'bg-green text-white shadow-xs'
              : 'border border-line bg-surface text-ink-2 hover:bg-surface-2'
          }`}
        >
          Deep Work ({deepWorkDefaultMins}m / 2H)
        </button>
        <button
          type="button"
          onClick={() => setTimerMode('custom')}
          className={`rounded-xl px-5 py-2 text-xs font-medium transition-all ${
            mode === 'custom'
              ? 'bg-green text-white shadow-xs'
              : 'border border-line bg-surface text-ink-2 hover:bg-surface-2'
          }`}
        >
          Custom ({customDefaultMins}m)
        </button>
      </div>

      {/* Settings Panel to Adjust Defaults */}
      {showSettings && (
        <div className="rounded-2xl border border-line bg-surface p-4 max-w-md mx-auto space-y-3 animate-in fade-in">
          <h4 className="text-xs font-semibold text-ink">Adjust Default Session Durations</h4>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-3xs text-ink-3 mb-1">Pomodoro (mins)</label>
              <input
                type="number"
                min={10}
                max={180}
                value={pomodoroDefaultMins}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPomodoroDefaultMins(val);
                  if (mode === 'pomodoro') {
                    setPlannedMinutes(val);
                    setSecondsRemaining(val * 60);
                  }
                }}
                className="w-full rounded-lg border border-line bg-canvas p-1.5 text-xs text-ink"
              />
            </div>
            <div>
              <label className="block text-3xs text-ink-3 mb-1">Deep Work (mins)</label>
              <input
                type="number"
                min={30}
                max={300}
                value={deepWorkDefaultMins}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDeepWorkDefaultMins(val);
                  if (mode === 'deep_work') {
                    setPlannedMinutes(val);
                    setSecondsRemaining(val * 60);
                  }
                }}
                className="w-full rounded-lg border border-line bg-canvas p-1.5 text-xs text-ink"
              />
            </div>
            <div>
              <label className="block text-3xs text-ink-3 mb-1">Custom (mins)</label>
              <input
                type="number"
                min={5}
                max={240}
                value={customDefaultMins}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCustomDefaultMins(val);
                  if (mode === 'custom') {
                    setPlannedMinutes(val);
                    setSecondsRemaining(val * 60);
                  }
                }}
                className="w-full rounded-lg border border-line bg-canvas p-1.5 text-xs text-ink"
              />
            </div>
          </div>
        </div>
      )}

      {/* Big Scholarly Timer Display */}
      <div className="flex flex-col items-center justify-center rounded-3xl border border-line bg-surface p-10 shadow-xs max-w-2xl mx-auto text-center space-y-6">
        {/* Subject Label */}
        <div className="rounded-full bg-surface-2 px-4 py-1 text-xs text-ink font-medium border border-line/50">
          Target: {selectedSubject}
        </div>

        {/* Big Countdown */}
        <div className="relative flex items-center justify-center">
          <span className="font-mono text-7xl font-bold tracking-tight text-ink tabular-nums sm:text-8xl">
            {timeFormatted}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full bg-green rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-3xs text-ink-3">
            <span>{progressPercent}% elapsed</span>
            <span>{plannedMinutes} minutes total</span>
          </div>
        </div>

        {/* Adjust Buttons (-5m / +5m) */}
        {!isRunning && (
          <div className="flex items-center gap-2 pt-1 text-xs text-ink-3">
            <span>Tweak:</span>
            <button
              type="button"
              onClick={() => handleAdjustDuration(-5)}
              className="rounded-lg border border-line bg-canvas px-2.5 py-1 text-2xs hover:bg-surface-2 transition-colors"
            >
              -5m
            </button>
            <button
              type="button"
              onClick={() => handleAdjustDuration(5)}
              className="rounded-lg border border-line bg-canvas px-2.5 py-1 text-2xs hover:bg-surface-2 transition-colors"
            >
              +5m
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-4 pt-2">
          {!isRunning ? (
            <button
              type="button"
              onClick={handleStart}
              className="flex items-center gap-2 rounded-2xl bg-green px-8 py-3.5 text-sm font-semibold text-white hover:bg-green-dark transition-all shadow-md active:scale-95"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>{isPaused ? 'Resume Session' : 'Start Focus'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="flex items-center gap-2 rounded-2xl bg-amber-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-amber-700 transition-all shadow-md active:scale-95"
            >
              <Pause className="h-5 w-5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl border border-line bg-canvas p-3.5 text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Interruption tracker badge */}
        <div className="flex items-center gap-2 text-xs text-ink-3 pt-2">
          <EyeOff className="h-3.5 w-3.5 text-amber-500" />
          <span>
            Interruptions logged: <strong className="text-ink">{interruptionCount}</strong>
          </span>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl border border-line text-center animate-in fade-in zoom-in-95">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green/10 text-green mb-3">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-ink">Focus Session Completed!</h3>
            <p className="mt-1.5 text-xs text-ink-3 leading-relaxed">
              Great job! You maintained focus on <strong className="text-ink">{selectedSubject}</strong> for {plannedMinutes} minutes.
            </p>
            <div className="mt-4 rounded-xl border border-line bg-canvas p-3 text-3xs text-ink-3 flex justify-around">
              <div>
                <span className="block font-semibold text-ink text-xs">{plannedMinutes}m</span>
                <span>Focus Time</span>
              </div>
              <div className="border-r border-line" />
              <div>
                <span className="block font-semibold text-ink text-xs">{interruptionCount}</span>
                <span>Interruptions</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowCompleteModal(false);
                handleReset();
              }}
              className="mt-5 w-full rounded-xl bg-green px-4 py-2.5 text-xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs"
            >
              Continue to Study Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
