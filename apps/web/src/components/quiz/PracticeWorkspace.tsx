'use client';

import React, { useState } from 'react';
import {
  Award,
  Upload,
  Copy,
  Check,
  FileCode,
  FileUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { useCurriculum } from '../../context/CurriculumContext';
import confetti from 'canvas-confetti';

interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation?: string;
}

interface PracticeQuizPayload {
  title: string;
  grade: number;
  subject: string;
  chapterId?: string;
  questions: PracticeQuestion[];
}

export function PracticeWorkspace() {
  const { curriculum, updateChapterStatus } = useCurriculum();

  const [jsonInput, setJsonInput] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<PracticeQuizPayload | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const sampleJsonStructure = `{
  "title": "Grade 12 Biology: Unit 1 Practice Questions",
  "grade": 12,
  "subject": "Biology",
  "chapterId": "g12-bio-u01-c01",
  "questions": [
    {
      "id": "q1",
      "question": "Which of the following best defines biomimicry in technological applications?",
      "options": [
        "A. Imitating nature's designs and processes to solve human challenges",
        "B. Genetic cloning of endangered wild animal species",
        "C. Eradication of pests using high-concentration synthetic chemicals",
        "D. Agricultural monoculture in commercial farms"
      ],
      "correctAnswer": 0,
      "explanation": "Biomimicry is the practice of learning from and emulating natural forms, processes, and ecosystems to create more sustainable designs."
    },
    {
      "id": "q2",
      "question": "What is the primary role of conservation biology in Ethiopia?",
      "options": [
        "A. Converting natural reserves into commercial real estate",
        "B. Protecting biodiversity, endemic species, and fragile ecosystems",
        "C. Eliminating traditional community-based forest management practices",
        "D. Encouraging the introduction of invasive non-native plant species"
      ],
      "correctAnswer": 1,
      "explanation": "Conservation biology aims to protect endemic wildlife (such as Walia Ibex, Ethiopian Wolf) and sustain indigenous ecosystem management."
    }
  ]
}`;

  const agentPrompt = `Act as an expert Ethiopian National Secondary Curriculum examination educator.
Generate an authentic multiple-choice practice quiz JSON for Grade 12 National Exam preparation.
Return ONLY a valid raw JSON object conforming strictly to this format:

{
  "title": "Grade 12 [Subject] - [Unit/Chapter Title] Practice",
  "grade": 12,
  "subject": "[Subject Name]",
  "chapterId": "[Optional chapter ID, e.g. g12-bio-u01-c01]",
  "questions": [
    {
      "id": "q1",
      "question": "High-yield examination question text",
      "options": [
        "A. Option 1",
        "B. Option 2",
        "C. Option 3",
        "D. Option 4"
      ],
      "correctAnswer": 0,
      "explanation": "Clear educational explanation why this answer is correct."
    }
  ]
}

Ensure 4 distinct choices per question, exactly one correct answer (0-indexed 0, 1, 2, or 3), and rigorous alignment with official Ethiopian Ministry of Education textbooks. Do not include markdown code block backticks or commentary outside the JSON.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(agentPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const handleParseAndLoad = (rawText: string) => {
    setError(null);
    try {
      // Clean possible markdown code fences if student pasted with ```json ... ```
      let cleaned = rawText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '');
      }

      const parsed: PracticeQuizPayload = JSON.parse(cleaned);

      if (!parsed.title || !parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('JSON missing "title" or "questions" array.');
      }

      if (parsed.questions.length === 0) {
        throw new Error('The quiz must contain at least 1 question.');
      }

      for (const q of parsed.questions) {
        if (!q.id || !q.question || !Array.isArray(q.options) || q.options.length < 2) {
          throw new Error(`Question ${q.id || 'unnamed'} is missing required text or options.`);
        }
        if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
          throw new Error(`Question ${q.id} has invalid correctAnswer index (${q.correctAnswer}).`);
        }
      }

      setActiveQuiz(parsed);
      setUserAnswers({});
      setSubmitted(false);
      setQuizScore(null);
    } catch (err: any) {
      setError(err.message || 'Invalid practice JSON. Please verify the structure.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      handleParseAndLoad(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      handleParseAndLoad(content);
    };
    reader.readAsText(file);
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;

    let correctCount = 0;
    for (const q of activeQuiz.questions) {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    }

    const pct = Math.round((correctCount / activeQuiz.questions.length) * 100);
    setQuizScore(pct);
    setSubmitted(true);

    // If score >= 75%, unlock verified mastery on the chapter!
    if (pct >= 75) {
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {}

      if (activeQuiz.chapterId) {
        updateChapterStatus(activeQuiz.chapterId, 'mastered', pct);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-bold text-ink flex items-center gap-2">
            <Award className="h-5 w-5 text-green" />
            <span>Practice &amp; Verified Mastery</span>
          </h1>
          <p className="text-xs text-ink-3 mt-0.5">
            Test yourself with chapter quizzes. Scoring $\ge 75\%$ unlocks verified empirical mastery.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyPrompt}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-2 text-xs font-medium text-ink hover:bg-surface-2 transition-colors shadow-xs"
        >
          {copiedPrompt ? (
            <>
              <Check className="h-3.5 w-3.5 text-green" />
              <span className="text-green font-semibold">Prompt Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-ink-3" />
              <span>Copy Agent Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* If Active Quiz is Loaded */}
      {activeQuiz ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-line bg-surface p-5">
            <div>
              <span className="rounded-full bg-green/10 text-green px-2.5 py-0.5 text-3xs font-semibold uppercase tracking-wider">
                Active Assessment
              </span>
              <h2 className="text-base font-bold text-ink mt-1.5">{activeQuiz.title}</h2>
              <p className="text-xs text-ink-3 mt-0.5">
                {activeQuiz.subject} (Grade {activeQuiz.grade}) • {activeQuiz.questions.length} Questions
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveQuiz(null);
                setSubmitted(false);
                setQuizScore(null);
              }}
              className="inline-flex items-center gap-1 text-xs text-ink-3 hover:text-ink underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Load Another Quiz</span>
            </button>
          </div>

          {/* Results Banner */}
          {submitted && quizScore !== null && (
            <div
              className={`rounded-2xl border p-5 transition-all ${
                quizScore >= 75
                  ? 'border-green/40 bg-green/10 text-green'
                  : 'border-amber-300 bg-amber-50/70 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold">
                    {quizScore >= 75
                      ? 'Congratulations! Mastery Unlocked'
                      : 'Score Below Mastery Threshold (75%)'}
                  </h3>
                  <p className="text-xs mt-1">
                    Your Score: <strong className="font-mono text-sm">{quizScore}%</strong> (
                    {Object.values(userAnswers).filter(
                      (ans, i) => ans === activeQuiz.questions[i].correctAnswer
                    ).length}{' '}
                    of {activeQuiz.questions.length} correct)
                  </p>
                  <p className="text-3xs mt-1 opacity-80">
                    {quizScore >= 75
                      ? 'This chapter has officially been awarded verified empirical mastery in your curriculum records.'
                      : 'Review the chapter notes, study the explanations below, and try again to achieve >= 75%.'}
                  </p>
                </div>

                <div className="text-3xl font-bold font-mono">
                  {quizScore}%
                </div>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            {activeQuiz.questions.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              const isCorrect = selectedOpt === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-line bg-surface p-5 space-y-3.5 transition-all"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-surface-2 font-mono text-xs font-bold text-ink">
                      {qIndex + 1}
                    </span>
                    <p className="text-sm font-semibold text-ink leading-relaxed">
                      {q.question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-1 pl-8">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let optionClasses = 'border-line bg-canvas/60 hover:bg-surface-2 text-ink';

                      if (submitted) {
                        if (optIdx === q.correctAnswer) {
                          optionClasses = 'border-green bg-green/10 text-green font-medium';
                        } else if (isSelected && !isCorrect) {
                          optionClasses = 'border-red-300 bg-red-50 text-red-600 dark:bg-red-950/40';
                        }
                      } else if (isSelected) {
                        optionClasses = 'border-green bg-green/10 text-green font-medium ring-1 ring-green';
                      }

                      return (
                        <button
                          type="button"
                          key={optIdx}
                          disabled={submitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left rounded-xl border p-3 text-xs transition-colors flex items-center justify-between ${optionClasses}`}
                        >
                          <span>{opt}</span>
                          {submitted && optIdx === q.correctAnswer && (
                            <CheckCircle2 className="h-4 w-4 text-green shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submit */}
                  {submitted && q.explanation && (
                    <div className="ml-8 mt-2 rounded-xl border border-line/60 bg-surface-2/60 p-3 text-3xs text-ink-2 leading-relaxed">
                      <strong className="text-ink block mb-0.5">Explanation:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Bar */}
          {!submitted ? (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="rounded-xl bg-green px-8 py-3 text-xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs disabled:opacity-50"
              >
                Submit Practice Quiz
              </button>
            </div>
          ) : (
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setUserAnswers({});
                  setSubmitted(false);
                  setQuizScore(null);
                }}
                className="rounded-xl border border-line bg-surface px-5 py-2.5 text-xs font-medium text-ink hover:bg-surface-2 transition-colors"
              >
                Retake Quiz
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveQuiz(null);
                  setSubmitted(false);
                  setQuizScore(null);
                }}
                className="rounded-xl bg-green px-5 py-2.5 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs"
              >
                Done
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Loader Panel */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Schema Reference & Agent Prompt */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-green" />
                <h3 className="text-sm font-semibold text-ink">Required Practice JSON Structure</h3>
              </div>
              <p className="text-3xs text-ink-3 leading-relaxed">
                Provide this exact structure to your AI agents or paste generated quiz code below.
              </p>
              <pre className="rounded-xl bg-canvas p-3 font-mono text-3xs text-ink-2 overflow-x-auto border border-line leading-relaxed max-h-64">
                {sampleJsonStructure}
              </pre>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-accent" />
                  <span>Agent Prompt</span>
                </h3>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="text-3xs font-medium text-green hover:underline"
                >
                  {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>
              <p className="text-3xs text-ink-3 leading-relaxed">
                Copy this prompt and give it to Claude, ChatGPT, or Gemini along with your textbook topic to generate instant practice questions.
              </p>
              <div className="rounded-xl bg-canvas p-3 text-3xs text-ink-3 italic border border-line line-clamp-4">
                {agentPrompt}
              </div>
            </div>
          </div>

          {/* Right Column: Paste, Drag-and-Drop, or File Upload */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
              <h3 className="text-sm font-semibold text-ink">Load Practice Questions</h3>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50/70 p-3 text-xs text-red-600 dark:bg-red-950/40">
                  {error}
                </div>
              )}

              {/* Paste JSON Textarea */}
              <div>
                <label className="block text-2xs font-medium text-ink-2 mb-1.5">
                  Paste Practice JSON
                </label>
                <textarea
                  rows={8}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste raw JSON here..."
                  className="w-full rounded-xl border border-line bg-canvas p-3 text-xs font-mono text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="rounded-xl border-2 border-dashed border-line p-6 text-center hover:border-line-strong transition-colors cursor-pointer bg-canvas/30"
              >
                <Upload className="h-6 w-6 text-ink-3 mx-auto mb-2" />
                <p className="text-xs font-medium text-ink">
                  Drag and drop a <code className="text-3xs font-mono">.json</code> file here
                </p>
                <p className="text-3xs text-ink-3 mt-1">or select from your device</p>
                <label className="mt-3 inline-block cursor-pointer rounded-lg bg-surface border border-line px-3 py-1.5 text-2xs font-medium text-ink hover:bg-surface-2 transition-colors">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={() => handleParseAndLoad(jsonInput)}
                disabled={!jsonInput.trim()}
                className="w-full rounded-xl bg-green px-4 py-2.5 text-xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs disabled:opacity-50"
              >
                Load &amp; Start Practice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
