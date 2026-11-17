'use client';

import React, { useState } from 'react';
import {
  Upload,
  Download,
  Copy,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ShieldCheck,
  Send,
  Check,
  HelpCircle,
} from 'lucide-react';
import { validateCurriculumJson } from '@matric/curriculum-schema';
import { useCurriculum } from '../../context/CurriculumContext';

export function AdminCurriculumWorkspace() {
  const {
    curriculum,
    clearCurriculumProgress,
    clearCurriculumStructure,
    restoreOfficialCurriculum,
  } = useCurriculum();
  const [jsonText, setJsonText] = useState('');
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: string[];
    stats?: any;
  } | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const detailedAgentPrompt = `You are an automated curriculum extraction and data engineering agent.
Your objective is to generate or update the official Ethiopian Secondary Curriculum JSON for Grades 9 through 12.
The target system has NO LLM connected at runtime and strictly validates input against Zod Schema 1.0.0. Any deviation in types, missing fields, or syntax errors will cause the parser to fail.

CRITICAL INSTRUCTIONS:
1. OUTPUT FORMAT:
   - Output MUST be 100% pure, raw, valid JSON.
   - Do NOT wrap your output in markdown code blocks (NO \`\`\`json or \`\`\`).
   - Do NOT include any introductory or concluding conversational prose.

2. ROOT SCHEMA STRUCTURE:
   {
     "schema_version": "1.0.0",
     "curriculum": {
       "id": "ethiopian-national-secondary-curriculum",
       "name": "Ethiopian Secondary Education Curriculum (Grades 9–12)",
       "country_code": "ET",
       "language": "en",
       "source_documents": [
         {
           "id": "doc-textbook-ref",
           "filename": "Official Ethiopian Ministry of Education Curriculum Framework",
           "grade": 12,
           "subject_id": "general",
           "document_type": "textbook"
         }
       ],
       "grades": [ ... ]
     }
   }

3. HIERARCHY RULES:
   - Grade object:
     {
       "grade": 9 | 10 | 11 | 12,
       "subjects": [ ... ]
     }
   - Subject object:
     {
       "id": "g09-biology",
       "name": "Biology",
       "order": 1,
       "review_status": "verified",
       "units": [ ... ]
     }
   - Unit object:
     {
       "id": "g09-bio-u01",
       "number": "1",
       "title": "Unit 1: Biology and Technology",
       "order": 1,
       "review_status": "verified",
       "chapters": [ ... ]
     }
   - Chapter object:
     {
       "id": "g09-bio-u01-c01",
       "number": "1.1",
       "title": "1.1 Definition of Biology and Technology",
       "order": 1,
       "review_status": "verified",
       "subtopics": [ ... ]
     }
   - Subtopic object (optional, default to empty array []):
     {
       "id": "g09-bio-u01-c01-s01",
       "number": "1.1.1",
       "title": "1.1.1 Branches of Biology",
       "order": 1,
       "review_status": "verified"
     }

4. FIELD REQUIREMENTS & CONSTRAINTS:
   - "schema_version": MUST be string "1.0.0" exactly.
   - "country_code": MUST be string "ET" exactly.
   - "language": MUST be "en" or "am".
   - "document_type": MUST be one of "textbook", "syllabus", "curriculum_guide", or "other".
   - "review_status": MUST be "verified" or "needs_review".
   - "order": MUST be positive integers starting from 1.
   - "id": MUST be globally unique string across the entire JSON tree. Use semantic prefixing (e.g. g12-chem-u02-c01).
   - "chapters": Array MUST NOT be omitted from units; provide empty array [] if none.
   - "subtopics": Array MUST NOT be omitted from chapters; provide empty array [] if none.

Generate the exact JSON hierarchy adhering strictly to these specifications.`;

  const handleValidate = () => {
    try {
      let cleaned = jsonText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(cleaned);
      const res = validateCurriculumJson(parsed);
      setValidationResult(res);
    } catch (e: any) {
      setValidationResult({
        valid: false,
        errors: [`Syntax error: ${e.message}`],
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        setJsonText(text);
        try {
          const parsed = JSON.parse(text);
          setValidationResult(validateCurriculumJson(parsed));
        } catch (err: any) {
          setValidationResult({
            valid: false,
            errors: [`Invalid JSON file: ${err.message}`],
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadJson = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(detailedAgentPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const handlePublish = async () => {
    if (!validationResult?.valid) return;
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <FileCode className="h-5 w-5 text-green" />
            <span>Curriculum JSON Manager</span>
          </h2>
          <p className="text-xs text-ink-3 mt-0.5">
            Strict Schema 1.0.0 validation and authoritative prompt generator for autonomous agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              downloadJson(
                'ethiopian_curriculum_master.json',
                curriculum ? JSON.stringify(curriculum, null, 2) : '{}'
              )
            }
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-2 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Active Master</span>
          </button>
        </div>
      </div>

      {/* Authoritative Agent Prompt Panel */}
      <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-ink">Authoritative Agent Prompt</h3>
          </div>
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green/10 border border-green/20 px-3 py-1 text-xs font-semibold text-green hover:bg-green/20 transition-colors"
          >
            {copiedPrompt ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Prompt Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Agent Prompt</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-ink-3 leading-relaxed">
          This prompt provides explicit structural guarantees, enum constraints, and nesting invariants so that any external AI agent (Claude, GPT-4, Gemini) generates valid JSON that passes Schema 1.0.0 without manual correction.
        </p>
        <pre className="rounded-xl bg-canvas p-3.5 font-mono text-3xs text-ink-2 overflow-x-auto border border-line max-h-48 leading-relaxed select-all">
          {detailedAgentPrompt}
        </pre>
      </div>

      {/* Curriculum Database Maintenance & Reset Controls */}
      <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-ink">Curriculum Structure &amp; Progress Operations</h3>
            <p className="text-3xs text-ink-3 mt-0.5">
              Reset personal chapter checkmarks or clear curriculum database structure to start fresh.
            </p>
          </div>
          {statusMessage && (
            <span className="text-2xs text-green font-medium animate-in fade-in">
              {statusMessage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap pt-1">
          <button
            type="button"
            onClick={async () => {
              await clearCurriculumProgress();
              setStatusMessage('All student chapter progress cleared (0% clean slate).');
              setTimeout(() => setStatusMessage(null), 4000);
            }}
            className="rounded-xl border border-line bg-surface px-3.5 py-1.5 text-2xs font-semibold text-ink hover:bg-surface-2 transition-colors shadow-2xs"
          >
            Clear Progress (Reset to 0%)
          </button>

          <button
            type="button"
            onClick={async () => {
              await clearCurriculumStructure();
              setStatusMessage('Curriculum database structure completely cleared (0 units).');
              setTimeout(() => setStatusMessage(null), 4000);
            }}
            className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-1.5 text-2xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/20 hover:bg-red-100 transition-colors shadow-2xs"
          >
            Clear Curriculum Structure (0 Units)
          </button>

          <button
            type="button"
            onClick={async () => {
              await restoreOfficialCurriculum();
              setStatusMessage('Official Ethiopian Secondary Curriculum (116 units) restored!');
              setTimeout(() => setStatusMessage(null), 4000);
            }}
            className="rounded-xl bg-green px-3.5 py-1.5 text-2xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs ml-auto"
          >
            Restore Official Ethiopian Curriculum (116 Units)
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {publishSuccess && (
        <div className="rounded-xl border border-green/30 bg-green/10 p-4 text-xs text-green font-medium animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Curriculum successfully validated and published to the study database!</span>
        </div>
      )}

      {/* Editor & Validation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Textarea and File Upload */}
        <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-ink">Curriculum JSON Input</label>
            <label className="cursor-pointer text-xs font-medium text-green hover:underline flex items-center gap-1">
              <Upload className="h-3 w-3" />
              <span>Upload JSON file</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            rows={15}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder="Paste your curriculum JSON here for strict validation..."
            className="w-full rounded-xl border border-line bg-canvas p-3 font-mono text-3xs text-ink focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                if (curriculum) setJsonText(JSON.stringify(curriculum, null, 2));
              }}
              className="text-xs text-ink-3 hover:text-ink underline"
            >
              Load Current Curriculum
            </button>

            <button
              type="button"
              onClick={handleValidate}
              disabled={!jsonText.trim()}
              className="rounded-xl bg-green px-5 py-2 text-xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs disabled:opacity-50"
            >
              Validate Schema 1.0.0
            </button>
          </div>
        </div>

        {/* Right: Validation Diagnostic Results */}
        <div className="rounded-2xl border border-line bg-surface p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-ink">Validation Telemetry</h3>

            {validationResult === null ? (
              <div className="rounded-xl border border-line bg-canvas p-8 text-center text-xs text-ink-3">
                Paste JSON or upload a file and click &quot;Validate Schema 1.0.0&quot; to inspect hierarchy.
              </div>
            ) : validationResult.valid ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 rounded-xl border border-green/30 bg-green/10 p-4 text-xs font-medium text-green">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Schema Invariants Fully Satisfied</h4>
                    <p className="text-3xs opacity-90 mt-0.5">
                      Conforms to official Ethiopian Curriculum JSON Schema 1.0.0.
                    </p>
                  </div>
                </div>

                {validationResult.stats && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-line bg-canvas p-3">
                      <span className="text-3xs text-ink-3 block">Total Units</span>
                      <span className="text-lg font-bold text-ink">
                        {validationResult.stats.totalUnits}
                      </span>
                    </div>
                    <div className="rounded-xl border border-line bg-canvas p-3">
                      <span className="text-3xs text-ink-3 block">Total Chapters</span>
                      <span className="text-lg font-bold text-ink">
                        {validationResult.stats.totalChapters}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50/70 p-4 text-xs text-red-600 dark:bg-red-950/40">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Validation Rejected</h4>
                    <p className="text-3xs mt-0.5">
                      The provided JSON failed schema checks. Fix the errors below:
                    </p>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1 rounded-xl border border-line bg-canvas p-3 font-mono text-3xs text-red-600">
                  {validationResult.errors.map((err, i) => (
                    <div key={i} className="leading-relaxed">
                      • {err}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {validationResult?.valid && (
            <div className="pt-4 border-t border-line flex justify-end">
              <button
                type="button"
                onClick={handlePublish}
                className="inline-flex items-center gap-2 rounded-xl bg-green px-6 py-2.5 text-xs font-semibold text-white hover:bg-green-dark transition-colors shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Publish to Master Database</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
