# Matric Tracker — Architecture Specification

## 1. Executive Summary

**Matric Tracker** is a production-grade Ethiopian Grade 12 National Examination preparation and Grade 9–12 curriculum study management web application with offline PWA support, a cross-browser website blocking companion extension, and a PostgreSQL persistence backend.

The platform is designed around three non-negotiable architectural tenets:
1. **Curriculum Faithfulness:** Built upon verified textbook extractions from official Ethiopian Ministry of Education Grade 9–12 curricula (Biology, Chemistry, Mathematics, Physics).
2. **Three-Dimensional Metric Independence:** Absolute separation between **Curriculum Coverage**, **Knowledge Mastery**, and **Examination Readiness**. Checkbox completion never unlocks mastery.
3. **Resilient Offline-First Synchronization:** First-class offline study via Dexie (IndexedDB), timestamp-derived study clocks immune to client background suspension, and conflict-resolved cloud synchronization.

---

## 2. Monorepo Topology

The codebase is organized as a unified `pnpm` monorepo:

```
matric-tracker/
├── apps/
│   ├── web/                     # Next.js 15 App Router web application & PWA
│   │   ├── public/              # Manifest, icons, static curriculum fallback
│   │   └── src/
│   │       ├── app/             # App router pages, routes (/api/curriculum, /api/sync)
│   │       ├── components/      # Formic-driven UI components
│   │       │   ├── dashboard/   # TopStatsBar, ProgressByGrade, CurriculumExplorer, RenameUnitModal
│   │       │   ├── planner/     # StudyPlannerWorkspace (Day/Week/Month, Ethiopian Cal)
│   │       │   ├── focus/       # FocusWorkspace (Pomodoro, Deep Work, Interruption tracking)
│   │       │   ├── quiz/        # QuizzesWorkspace (Chapter assessment & mastery unlock)
│   │       │   ├── analytics/   # AnalyticsWorkspace (3 independent curves & weak chapters)
│   │       │   ├── admin/       # AdminCurriculumWorkspace (JSON manager & validator)
│   │       │   └── auth/        # AuthModal (Guest, login, register, convert)
│   │       ├── context/         # Auth, Curriculum, Preferences context providers
│   │       ├── formic/          # Formic AI Design System tokens and primitives
│   │       └── lib/             # Dexie offline database and sync queue
│   └── extension/               # Cross-browser website blocking extension (MV3)
│       ├── manifest.chrome.json # Chromium & Edge manifest
│       ├── manifest.firefox.json# Firefox MV3 manifest
│       └── src/                 # DeclarativeNetRequest background service worker & popup
├── packages/
│   ├── curriculum-schema/       # Zod schema 1.0.0 and TypeScript definitions
│   ├── database/                # Drizzle ORM schema (19 tables), migrations, pooler client
│   ├── shared-types/            # Canonical shared interfaces across web, extension, db
│   └── shared-utils/            # Ethiopian calendar math, mastery scoring, deterministic scheduler
├── curriculum/
│   └── ethiopian_curriculum_master.json # 111 units, 378 chapters extracted from textbooks
├── docs/                        # Engineering, security, architecture, and deployment docs
└── schemas/
    └── curriculum.schema.json   # Machine-readable JSON Schema 1.0.0
```

---

## 3. The Three Independent Performance Dimensions

A fatal flaw of traditional study applications is conflating reading with learning. Matric Tracker formally isolates three independent dimensions:

### 3.1 Dimension 1: Curriculum Coverage ($C$)
Curriculum Coverage measures what fraction of the total curriculum has been studied or reviewed at least once. It indicates volume, not competence.

$$C = \frac{\text{Count of Units with All Chapters Studied or Mastered}}{\text{Total Curriculum Units}} \times 100$$

- **Initial Baseline:** 20 completed units out of 99 total units (or extracted 111 units) $\rightarrow 20\%$.

### 3.2 Dimension 2: Knowledge Mastery ($M$)
Knowledge Mastery measures verified empirical understanding. **A student CANNOT check a box to mark a unit or chapter as "Mastered".** 
Mastery is exclusively unlocked when:
1. The chapter has been marked as studied ($status = \text{"studied"}$).
2. An assessment quiz for that chapter has been completed with a score of $\ge 75\%$.
3. The chapter retention score hasn't decayed past the spaced review threshold.

$$M = \frac{\text{Count of Chapters with Verified Assessment Score} \ge 75\%}{\text{Total Curriculum Chapters}} \times 100$$

### 3.3 Dimension 3: Examination Readiness ($R$)
Examination Readiness measures timed test endurance, coverage of high-yield Grade 12 National Exam chapters, and performance consistency. It incorporates:
- Overall curriculum coverage ($C \times 0.35$)
- Verified knowledge mastery ($M \times 0.45$)
- Timed focus consistency and recent study volume ($F \times 0.20$)

$$R = 0.35 C + 0.45 M + 0.20 F$$

---

## 4. Calendar Engine: Julian Day Number Conversions

Ethiopia utilizes the Ge'ez calendar, consisting of 12 months of 30 days plus a 13th month (*Pagumē*) of 5 days (6 days in a leap year). The calendar is approximately 7 to 8 years behind the Gregorian calendar, and the New Year (*Enkutatash*) begins on September 11 (or September 12 in Gregorian leap years).

### 4.1 Mathematical Formulation via Julian Day Number (JDN)

To eliminate timezone-shifting bugs and day-drift errors across client platforms, the calendar converter in `@matric/shared-utils` uses Julian Day Number (JDN) arithmetic:

1. **Gregorian to JDN:**
   Given year $Y$, month $M$, day $D$:
   $$a = \left\lfloor \frac{14 - M}{12} \right\rfloor$$
   $$y = Y + 4800 - a$$
   $$m = M + 12a - 3$$
   $$JDN = D + \left\lfloor \frac{153m + 2}{5} \right\rfloor + 365y + \left\lfloor \frac{y}{4} \right\rfloor - \left\lfloor \frac{y}{100} \right\rfloor + \left\lfloor \frac{y}{400} \right\rfloor - 32045$$

2. **JDN to Ethiopian Date:**
   Using the calibrated Ethiopian Epoch $JDN_{epoch} = 1724221$:
   $$r = (JDN - JDN_{epoch}) \pmod{1461}$$
   $$n = (r \pmod{365}) + 365 \times \left\lfloor \frac{r}{1460} \right\rfloor$$
   $$year = 4 \times \left\lfloor \frac{JDN - JDN_{epoch}}{1461} \right\rfloor + \left\lfloor \frac{r}{365} \right\rfloor - \left\lfloor \frac{r}{1460} \right\rfloor$$
   $$month = \left\lfloor \frac{n}{30} \right\rfloor + 1$$
   $$day = (n \pmod{30}) + 1$$

Both Gregorian-to-Ethiopian and Ethiopian-to-Gregorian transformations are verified by deterministic unit tests (`packages/shared-utils/src/__tests__/utils.test.ts`), including the 6-day Pagumē leap year boundary.

---

## 5. Offline Persistence & Sync Engine

### 5.1 Local Storage via Dexie
Client data is persisted to IndexedDB using Dexie v4:
- `curriculum`: Master curriculum cache indexed by schema version.
- `chapterProgress`: Student chapter statuses, notes, difficulty ratings, quiz scores.
- `studySessions`: Scheduled and completed study sessions.
- `focusSessions`: Completed focus intervals and interruption logs.
- `syncQueue`: Offline mutation log capturing operations (`CREATE`, `UPDATE`, `DELETE`) with monotonic client timestamps.

### 5.2 Conflict Resolution: Monotonic Last-Write-Wins (LWW)
When syncing with the cloud:
1. Each mutation generates an `operationId` (UUID) and a UTC client timestamp.
2. The server compares incoming `clientTimestamp` against the PostgreSQL record's `updatedAt`.
3. If the incoming payload is newer, the record updates and an acknowledgment is returned to the client to purge that entry from the local `syncQueue`.
4. If an assessment score is received, the server uses monotonic maximum score: a higher quiz score is never overwritten by an older or lower score.

---

## 6. Deterministic Focus Timer

Unlike naive `setInterval` countdown timers which pause when a browser tab is throttled or backgrounded, Matric Tracker's focus engine computes elapsed time from immutable timestamps:

```ts
const elapsedSeconds = Math.floor((Date.now() - sessionStartTimestamp - pausedDurationMs) / 1000);
```

### Page Visibility Interruption Tracking
When the student navigates away from the study workspace or switches browser tabs during an active focus block:
1. The `visibilitychange` event is detected (`document.visibilityState === 'hidden'`).
2. An interruption entry is recorded with timestamp and active duration.
3. The session interruption count increments, providing realistic study discipline analytics.
