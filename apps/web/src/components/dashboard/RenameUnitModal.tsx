'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface RenameUnitModalProps {
  isOpen: boolean;
  unitId: string | null;
  currentTitle: string;
  onClose: () => void;
  onSave: (unitId: string, newTitle: string) => void;
}

export function RenameUnitModal({
  isOpen,
  unitId,
  currentTitle,
  onClose,
  onSave,
}: RenameUnitModalProps) {
  const [title, setTitle] = useState(currentTitle);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !unitId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(unitId, title.trim());
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rename-unit-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-surface p-6 shadow-xl border border-line animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-ink-3 hover:text-ink transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 id="rename-unit-title" className="text-xl font-semibold text-ink">
          Rename unit
        </h2>
        <p className="mt-1 text-sm text-ink-2">
          Keep your curriculum organized as your preparation grows.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="unit-title-input" className="block text-xs font-medium text-ink-2 mb-2">
              Unit title
            </label>
            <input
              id="unit-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              placeholder="e.g. Unit 1 Chemistry and Its Importance"
              autoFocus
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line bg-canvas px-4 py-2 text-xs font-medium text-ink hover:bg-surface-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-green px-5 py-2 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs"
            >
              Save title
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
