'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <span className="text-xs font-semibold tracking-wider text-red-600 dark:text-red-400 uppercase">
          Application Error
        </span>
        <h1 className="mt-2 text-xl font-bold text-ink">Something went wrong</h1>
        <p className="mt-2 text-xs text-ink-3 leading-relaxed">
          {error.message || 'An unexpected error occurred while rendering your study workspace.'}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-green px-4 py-2 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-canvas px-4 py-2 text-xs font-medium text-ink hover:bg-surface-2 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
