# Render Deployment Guide — Matric Tracker

This guide documents how to deploy **Matric Tracker** on [Render](https://render.com).

---

## Architecture on Render

- **Runtime**: Node.js 20+ / Next.js 15 Standalone
- **Monorepo Manager**: `pnpm` (Workspace)
- **Port**: Render assigns dynamic `$PORT` (default `10000`)
- **Host**: Binds to `0.0.0.0`
- **Database**: Supabase PostgreSQL (`postgresql://...`)
- **Offline/PWA**: Built-in Service Worker & Dexie IndexedDB

---

## Option 1: 1-Click Blueprint (Recommended)

Matric Tracker includes a pre-configured `render.yaml` blueprint.

1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** $\rightarrow$ **Blueprint**.
3. Select your connected GitHub repository (`Matric-Taker`).
4. Render will parse `render.yaml` and configure the Web Service automatically:
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Region**: Frankfurt (closest to Addis Ababa / East Africa)
5. Fill in the required environment variables prompted by the dashboard (see below).
6. Click **Apply**.

---

## Option 2: Manual Web Service Setup

If you prefer setting up manually without a blueprint:

1. Click **New +** $\rightarrow$ **Web Service**.
2. Connect your Git repository.
3. Configure the following settings:
   - **Name**: `matric-tracker`
   - **Region**: `Frankfurt (EU Central)` (Recommended for Ethiopian users)
   - **Branch**: `main`
   - **Root Directory**: leave blank (root of monorepo)
   - **Runtime**: `Node`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Plan**: `Free` or `Starter`
4. Under **Environment Variables**, add the variables listed in the section below.
5. Click **Create Web Service**.

---

## Required Environment Variables on Render

| Key | Example / Description |
|---|---|
| `NODE_VERSION` | `20.18.0` |
| `PNPM_VERSION` | `9.15.4` |
| `HOSTNAME` | `0.0.0.0` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vfxvkrrymlrtrxbctlza.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key |
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.vfxvkrrymlrtrxbctlza.supabase.co:5432/postgres?sslmode=require` |
| `DIRECT_URL` | `postgresql://postgres:[PASSWORD]@db.vfxvkrrymlrtrxbctlza.supabase.co:5432/postgres?sslmode=require` |
| `BETTER_AUTH_SECRET` | 32+ character random secret string |
| `BETTER_AUTH_URL` | `https://matric-tracker.onrender.com` (Your Render URL) |
| `NEXT_PUBLIC_APP_URL` | `https://matric-tracker.onrender.com` (Your Render URL) |

---

## Local Scripts Included

- **Windows Batch**: `start-local.bat` (Double-click in Windows Explorer to launch)
- **PowerShell**: `start-local.ps1` (`.\start-local.ps1`)
- **Bash**: `start-local.sh` (`./start-local.sh`)
- **Package script**: `pnpm start:local` or `pnpm dev`
