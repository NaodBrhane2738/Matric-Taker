'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, BookOpen } from 'lucide-react';

interface AddUnitModalProps {
  isOpen: boolean;
  subjectId: string | null;
  onClose: () => void;
  onAdd: (subjectId: string, unitTitle: string) => void;
}

export function AddUnitModal({ isOpen, subjectId, onClose, onAdd }: AddUnitModalProps) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !subjectId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(subjectId, title.trim());
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-unit-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 xs:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-surface p-4 sm:p-6 shadow-xl border border-line animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-ink-3 hover:text-ink transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green/10 text-green">
            <Plus className="h-4 w-4" />
          </div>
          <h2 id="add-unit-title" className="text-base font-semibold text-ink">
            Add New Curriculum Unit
          </h2>
        </div>
        <p className="text-xs text-ink-3">
          Expand your curriculum with new topics and chapters.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="new-unit-input" className="block text-xs font-medium text-ink-2 mb-1.5">
              Unit Title
            </label>
            <input
              id="new-unit-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit 7: Cellular Biotechnology"
              className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2 text-xs text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              autoFocus
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line bg-canvas px-4 py-2 text-xs font-medium text-ink hover:bg-surface-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-green px-4 py-2 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs"
            >
              Add Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
