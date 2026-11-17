# Vercel Production Deployment Guide

## 1. Overview

Matric Tracker is architected for deployment to Vercel's serverless edge infrastructure using Next.js 15 App Router.

---

## 2. Vercel Project Configuration

When importing the repository to Vercel:

1. **Framework Preset:** `Next.js`
2. **Root Directory:** Edit the root directory to `apps/web`.
3. **Include Files Outside Root Directory:** Ensure this toggle is **enabled** (required for `pnpm` workspaces to access `@matric/curriculum-schema`, `@matric/database`, `@matric/shared-types`, `@matric/shared-utils`, and `curriculum/`).
4. **Build & Development Settings:**
   - **Install Command:** `pnpm install`
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `.next`

---

## 3. Environment Variables Configuration

Configure the following environment variables in the Vercel Dashboard (**Settings $\rightarrow$ Environment Variables**):

| Variable Name | Environment | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Production, Preview | Supabase connection pooler URL (port 6543) |
| `DIRECT_URL` | Production, Preview | Direct / Session pooler URL (port 5432) |
| `BETTER_AUTH_SECRET` | Production, Preview | 32+ character random secret string |
| `BETTER_AUTH_URL` | Production, Preview | `https://your-production-domain.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Production, Preview | `https://your-production-domain.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | All | `https://vfxvkrrymlrtrxbctlza.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Public Supabase anonymous JWT key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Secret service role JWT key (server only) |
| `ADMIN_BOOTSTRAP_SECRET` | Production | High-entropy token for administrator CLI |

> [!IMPORTANT]
> Never set `DATABASE_URL` or `BETTER_AUTH_SECRET` with the `NEXT_PUBLIC_` prefix. They must remain strictly server-side.

---

## 4. Progressive Web App (PWA) Verification

Matric Tracker includes a web app manifest and offline Dexie database:
- **Manifest:** Configured at `/manifest.json` with standalone display mode.
- **Offline Strategy:** When offline, the application loads cached curriculum hierarchies and logs progress to IndexedDB `syncQueue`. When connectivity resumes, mutations sync automatically to `/api/sync`.
- **Installability:** Tested on Google Chrome and Microsoft Edge (Desktop & Android). The browser will display the "Install Matric Tracker" prompt in the address bar.
