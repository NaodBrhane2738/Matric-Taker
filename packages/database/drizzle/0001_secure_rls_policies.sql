-- Security & Row Level Security (RLS) Hardening Migration
-- Enforces zero-trust database access across all public endpoints and Supabase publishable keys.

-- 1. Enable RLS on every table
ALTER TABLE IF EXISTS "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "verifications" ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS "curriculum_subjects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "curriculum_units" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "chapters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "subtopics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "source_documents" ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS "student_chapter_progress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "study_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "focus_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "quiz_attempts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "user_preferences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "exam_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "sync_audit_log" ENABLE ROW LEVEL SECURITY;

-- 2. Revoke default public/anon table access on sensitive user & progress data
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, public;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 3. Public Read Access: Verified Curriculum Data ONLY
GRANT SELECT ON "curriculum_subjects" TO anon, authenticated;
GRANT SELECT ON "curriculum_units" TO anon, authenticated;
GRANT SELECT ON "chapters" TO anon, authenticated;
GRANT SELECT ON "subtopics" TO anon, authenticated;
GRANT SELECT ON "source_documents" TO anon, authenticated;

CREATE POLICY "Public Read Curriculum Subjects" ON "curriculum_subjects"
  FOR SELECT USING (true);

CREATE POLICY "Public Read Curriculum Units" ON "curriculum_units"
  FOR SELECT USING (true);

CREATE POLICY "Public Read Chapters" ON "chapters"
  FOR SELECT USING (true);

CREATE POLICY "Public Read Subtopics" ON "subtopics"
  FOR SELECT USING (true);

CREATE POLICY "Public Read Source Documents" ON "source_documents"
  FOR SELECT USING (true);

-- 4. User Profile Security: Users can only read/edit their own profile
GRANT SELECT, UPDATE ON "users" TO authenticated;

CREATE POLICY "Users access own profile" ON "users"
  FOR ALL TO authenticated
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- 5. Student Progress, Sessions, and Notes: Strict Isolation by User ID
GRANT ALL ON "student_chapter_progress" TO authenticated;
GRANT ALL ON "study_sessions" TO authenticated;
GRANT ALL ON "focus_sessions" TO authenticated;
GRANT ALL ON "quiz_attempts" TO authenticated;
GRANT ALL ON "user_preferences" TO authenticated;
GRANT ALL ON "exam_sessions" TO authenticated;

CREATE POLICY "Users access own chapter progress" ON "student_chapter_progress"
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users access own study sessions" ON "study_sessions"
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users access own focus sessions" ON "focus_sessions"
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users access own quiz attempts" ON "quiz_attempts"
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users access own preferences" ON "user_preferences"
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users access own exam sessions" ON "exam_sessions"
  FOR ALL TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- 6. Service Role & Admin Bypass Policy: Authorized backend services have full access
CREATE POLICY "Service Role Full Access" ON "users"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service Role Progress Full Access" ON "student_chapter_progress"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service Role Sessions Full Access" ON "study_sessions"
  FOR ALL TO service_role USING (true) WITH CHECK (true);
