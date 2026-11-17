# Matric Tracker — Security & Identity Specification

## 1. Security Architecture & Threat Model

Matric Tracker is designed as a secure, multi-tenant educational platform supporting both instant guest learners and authenticated permanent accounts.

### 1.1 Core Principles
1. **Multi-Tenant Data Isolation:** Every student's chapter progress, study planner sessions, notes, quiz attempts, and focus records are scoped by `userId`. All mutating and query operations strictly enforce ownership verification.
2. **Zero Client Secret Exposure:** The browser never receives database credentials, connection strings, or service-role keys.
3. **No Unverified Identities:** Real emails are entirely optional. The canonical login identifier is the unique username.
4. **Defense in Depth:** Rigorous server-side Zod validation on all mutating API endpoints (`/api/sync`), rate-limiting hooks, and strict dialog semantics on all interactive surfaces.

---

## 2. Authentication & Account Lifecycle

The authentication system is powered by **Better Auth** with the **Anonymous** and **Username** plugins. Supabase Auth is intentionally not used.

### 2.1 Guest Account Generation
When a student selects "Continue as Guest":
1. A cryptographically secure guest session is created.
2. A random, respectful human-readable nickname is generated using a curated prefix/noun algorithm (e.g., `QuietFalcon42`, `CuriousCheetah18`).
3. The guest account is granted full functional access to:
   - Study curriculum chapters
   - Record chapter notes and difficulty
   - Generate automated study schedules
   - Run focus timers with interruption tracking
   - Take chapter quizzes and earn mastery status
4. The guest session persists across browser restarts via secure HTTP-only cookies and local IndexedDB state.
5. The UI surfaces clear alerts reminding the student to convert their account before clearing browser storage.

### 2.2 The Internal RFC 2606 `.invalid` Domain Pattern
Better Auth's core account subsystem requires an email string for internal record indexing. To preserve the requirement of **username-only registration** without requiring students to own or expose an email address, the system generates a synthetic backend-only address:

$$\text{email}_{\text{internal}} = \text{account-} + \text{UUID} + \text{@internal.matric.invalid}$$

Key security constraints:
- **Server-Generated Only:** Created dynamically in server-side authentication handlers.
- **Never Displayed:** Never surfaced in the user interface or frontend state.
- **Never Used for Delivery:** `.invalid` is reserved by RFC 2606 for non-routable domains; no SMTP delivery is ever attempted.
- **Optional Contact Email:** If a student voluntarily provides an email for notification or contact purposes, it is stored in a separate `contactEmail` profile field and is not used as an identity verification token.

### 2.3 Zero-Loss Guest-to-Permanent Conversion
When a guest student decides to create permanent credentials:
1. The client prompts for a chosen `username` and `password`.
2. A transactional account conversion is executed:
   - The user record is updated from `isGuest = true` to `isGuest = false`.
   - The permanent username is verified for global uniqueness.
   - The password is hashed using argon2/scrypt through Better Auth.
   - All associated relational records (`studentChapterProgress`, `studySessions`, `focusSessions`, `quizAttempts`, `userPreferences`) retain their existing foreign key links to `userId`.
3. The operation is atomic and idempotent. No duplicate records are created, and no student progress is lost.

---

## 3. Privilege Escalation Prevention & Admin Bootstrapping

Public registration must **never** permit a user to assign themselves an administrative role.

### 3.1 Role Hierarchy
- `student`: Default role for all guests and standard accounts.
- `admin`: Restricted administrative role required to upload, publish, or modify the master curriculum JSON hierarchy via `/admin/curriculum`.

### 3.2 Secure Administrator Bootstrap CLI
The initial system administrator cannot be created through the public registration form or web UI. Instead, the first administrator is provisioned via an explicit server-side CLI script:

```bash
# Set secure bootstrap secret in server environment
export ADMIN_BOOTSTRAP_SECRET="your-high-entropy-secret"

# Execute bootstrap CLI
pnpm --filter @matric/database bootstrap-admin --username admin_master --password "StrongPassword123" --secret "your-high-entropy-secret"
```

The bootstrap CLI:
1. Validates `ADMIN_BOOTSTRAP_SECRET` against the environment variable.
2. Checks if an administrator already exists; if so, aborts immediately unless explicit override flags are supplied.
3. Directly writes the administrator account with `role = 'admin'`.

---

## 4. Cross-Browser Extension Security

The website blocking companion extension (`apps/extension`) runs in a sandboxed WebExtensions environment:

### 4.1 Declarative Net Request (DNR) Rules
- Uses `chrome.declarativeNetRequest` (Chromium) and `browser.declarativeNetRequest` (Firefox).
- Distraction URLs (`youtube.com`, `tiktok.com`, `instagram.com`, `reddit.com`, `twitter.com`, `facebook.com`) are redirected directly to a local, bundled `blocked.html` page.
- **No Keystroke Logging or Content Scraping:** The extension requests only `declarativeNetRequest` and `storage` permissions. It does **not** inject content scripts into unblocked web pages, does not inspect network payloads, and does not transmit browsing history to any remote server.

---

## 5. Secret Management & Production Hygiene

- **`.gitignore` Enforced:** All local environment files (`.env`, `.env.local`, `.env*.local`) and build artifacts are strictly excluded from git tracking.
- **`.env.example` Baseline:** The repository provides a clean `.env.example` containing only documentation and placeholders.
- **Database Connection Security:** Supabase pooled connections enforce SSL (`sslmode=require`) across all network boundaries.
