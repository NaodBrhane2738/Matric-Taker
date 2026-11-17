# Supabase PostgreSQL Setup & Migration Guide

## 1. Supabase Project Architecture

The database infrastructure for Matric Tracker utilizes Supabase PostgreSQL hosted in AWS region `eu-west-1` (Ireland).

- **Project Ref:** `vfxvkrrymlrtrxbctlza`
- **Dashboard URL:** `https://supabase.com/dashboard/project/vfxvkrrymlrtrxbctlza`

### 1.1 IPv4 Connection Pooler (Supavisor) Configuration
Direct hostname `db.vfxvkrrymlrtrxbctlza.supabase.co` resolves exclusively to IPv6 addresses on modern Supabase deployments. For global compatibility across Vercel serverless lambdas and IPv4 local development environments, always connect through Supavisor:

- **Pooler Host:** `aws-1-eu-west-1.pooler.supabase.com`
- **Username:** `postgres.vfxvkrrymlrtrxbctlza`
- **Port 6543 (Transaction Mode):** Used for standard application operations and serverless queries (`DATABASE_URL`).
- **Port 5432 (Session Mode):** Used for Drizzle migrations, schema pushes, and interactive Drizzle Studio (`DIRECT_URL`).

---

## 2. Environment Variables Configuration

In `.env.local` (or your Vercel Project Environment Variables), set:

```ini
# Supabase PostgreSQL Connection Pooler (Transaction Mode - port 6543)
DATABASE_URL=postgresql://postgres.vfxvkrrymlrtrxbctlza:YOUR_DB_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require

# Supabase PostgreSQL Direct / Session Connection (Session Mode for migrations - port 5432)
DIRECT_URL=postgresql://postgres.vfxvkrrymlrtrxbctlza:YOUR_DB_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require

# Better Auth Configuration
BETTER_AUTH_SECRET=generate-a-32-character-random-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Public Supabase API (Client-side / Storage)
NEXT_PUBLIC_SUPABASE_URL=https://vfxvkrrymlrtrxbctlza.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role (Server-side admin operations only)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Administrator Bootstrap Key (One-time secure setup)
ADMIN_BOOTSTRAP_SECRET=generate-a-secure-admin-bootstrap-secret
```

---

## 3. Applying Database Migrations

You have two options to apply the 19 relational tables to your Supabase PostgreSQL instance:

### Option A: Via Supabase SQL Editor (Instant & Zero Dependency)
1. Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/vfxvkrrymlrtrxbctlza/sql/new).
2. Open the generated migration file:
   [`packages/database/drizzle/0000_thankful_thor.sql`](file:///D:/CODING/Matric%20taker/packages/database/drizzle/0000_thankful_thor.sql)
3. Copy its entire contents, paste into the SQL Editor, and click **Run**.
4. All 19 tables, indexes, and foreign keys will be created immediately.

### Option B: Via Drizzle Kit CLI
With `DIRECT_URL` configured in your environment:
```bash
pnpm --filter @matric/database db:migrate
```
Or to synchronize the schema directly:
```bash
pnpm --filter @matric/database db:push
```

---

## 4. Bootstrapping the First Administrator

Once the database migration is complete, create your primary administrator account:

```bash
pnpm --filter @matric/database bootstrap-admin --username admin_master --password "YourStrongPasswordHere" --secret "YOUR_ADMIN_BOOTSTRAP_SECRET"
```

This ensures your administrator account has the `admin` role required to manage curriculum JSON hierarchies through the `/admin/curriculum` panel.
