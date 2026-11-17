'use client';

import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { useCurriculum } from '../../context/CurriculumContext';
import confetti from 'canvas-confetti';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'Which of the following is considered the central science linking physics with biology?',
    options: ['Geology', 'Chemistry', 'Astronomy', 'Meteorology'],
    correctIndex: 1,
    explanation: 'Chemistry is called the central science because it connects physical principles with biological and geological processes.',
  },
  {
    id: 'q2',
    question: 'What is the primary characteristic of an ionic bond?',
    options: [
      'Equal sharing of electrons',
      'Electrostatic attraction between oppositely charged ions',
      'Delocalized pool of valence electrons',
      'Overlap of unhybridized p orbitals',
    ],
    correctIndex: 1,
    explanation: 'An ionic bond is formed by complete transfer of electrons resulting in electrostatic attraction between cations and anions.',
  },
  {
    id: 'q3',
    question: 'In the Ethiopian secondary physics curriculum, what is the SI unit of work and energy?',
    options: ['Newton', 'Watt', 'Joule', 'Pascal'],
    correctIndex: 2,
    explanation: 'The SI unit of both work and energy is the Joule (J), equivalent to 1 N·m.',
  },
  {
    id: 'q4',
    question: 'Which periodic trend generally decreases as you move down a group in the periodic table?',
    options: ['Atomic radius', 'First ionization energy', 'Metallic character', 'Atomic number'],
    correctIndex: 1,
    explanation: 'First ionization energy decreases down a group because valence electrons are further from the nucleus and experience greater shielding.',
  },
];

export function QuizzesWorkspace() {
  const { updateChapterStatus } = useCurriculum();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const curQ = SAMPLE_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    if (idx === curQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < SAMPLE_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setQuizFinished(true);
      const scorePct = Math.round(((score + (selectedOption === curQ.correctIndex ? 1 : 0)) / SAMPLE_QUESTIONS.length) * 100);
      if (scorePct >= 75) {
        // Unlock verified mastery!
        updateChapterStatus('g09-chemistry-u01-c01', 'mastered', scorePct);
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch {}
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const finalScorePct = Math.round((score / SAMPLE_QUESTIONS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-line pb-4">
        <h2 className="text-xl font-semibold text-ink">Chapter Assessment & Knowledge Mastery</h2>
        <p className="text-xs text-ink-3 mt-0.5">
          Mastery is verified only through empirical assessment evidence (≥75% threshold).
        </p>
      </div>

      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-line bg-surface p-6 shadow-xs">
        {!quizFinished ? (
          <div className="space-y-5">
            {/* Question Progress */}
            <div className="flex items-center justify-between text-xs text-ink-3">
              <span>Question {currentIdx + 1} of {SAMPLE_QUESTIONS.length}</span>
              <span className="tabular-nums">Chapter: Chemistry 1.1</span>
            </div>

            {/* Question Prompt */}
            <h3 className="text-base font-semibold text-ink leading-relaxed">{curQ.question}</h3>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {curQ.options.map((opt, i) => {
                let btnStyle = 'border-line hover:border-line-strong hover:bg-surface-2';
                if (hasAnswered) {
                  if (i === curQ.correctIndex) {
                    btnStyle = 'border-green bg-green-50/70 text-green-900 font-medium dark:bg-green-950/40 dark:text-green-300';
                  } else if (i === selectedOption) {
                    btnStyle = 'border-red-400 bg-red-50/70 text-red-900 dark:bg-red-950/40 dark:text-red-300';
                  }
                }

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSelect(i)}
                    className={`w-full text-left rounded-xl border p-3.5 text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {hasAnswered && i === curQ.correctIndex && (
                      <CheckCircle2 className="h-4 w-4 text-green shrink-0" />
                    )}
                    {hasAnswered && i === selectedOption && i !== curQ.correctIndex && (
                      <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card */}
            {hasAnswered && (
              <div className="rounded-xl border border-line bg-canvas p-3.5 text-xs text-ink-2 space-y-1">
                <span className="font-semibold text-ink">Explanation:</span>
                <p>{curQ.explanation}</p>
              </div>
            )}

            {/* Next button */}
            {hasAnswered && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green px-4 py-2 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs"
                >
                  <span>{currentIdx + 1 < SAMPLE_QUESTIONS.length ? 'Next Question' : 'View Result'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-green">
              <Award className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-ink">Assessment Completed</h3>
              <p className="text-xs text-ink-3 mt-1">
                You scored <strong className="text-ink font-semibold">{score} out of {SAMPLE_QUESTIONS.length}</strong> ({finalScorePct}%)
              </p>
            </div>

            {finalScorePct >= 75 ? (
              <div className="mx-auto max-w-md rounded-xl border border-green-200 bg-green-50/70 p-3 text-xs text-green-900 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-300">
                🎉 Congratulations! Score qualifies for verified <strong>Knowledge Mastery</strong>. This chapter has officially unlocked to Mastered status.
              </div>
            ) : (
              <div className="mx-auto max-w-md rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                <div className="flex items-center justify-center gap-1.5 font-medium mb-0.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Mastery Not Yet Attained</span>
                </div>
                Mastery requires ≥75% score. Chapter remains in &quot;Practicing&quot; status until assessment threshold is met.
              </div>
            )}

            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2 text-xs font-medium text-ink hover:bg-surface-2 transition-colors shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retake Assessment</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
