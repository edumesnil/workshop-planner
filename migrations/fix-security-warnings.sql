-- Fix Supabase Security Warnings
-- Date: 2025-10-20
-- Description: Address security warnings from Supabase dashboard

-- ============================================
-- 1. Fix function search_path mutable warning
-- ============================================
-- Drop and recreate the function with SECURITY DEFINER and search_path set
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate triggers that were dropped with CASCADE
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at
  BEFORE UPDATE ON workshops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. Fix Auth RLS Initialization Plan warnings
-- ============================================
-- The warnings indicate RLS policies use current_setting() and auth.<function>()
-- which should be replaced with more explicit checks

-- Drop existing RLS policies that have initialization issues
DROP POLICY IF EXISTS "Users can view their workshop tools" ON workshop_tools;
DROP POLICY IF EXISTS "Users can add tools to their workshops" ON workshop_tools;
DROP POLICY IF EXISTS "Users can remove tools from their workshops" ON workshop_tools;

DROP POLICY IF EXISTS "Users can view own workshops" ON workshops;
DROP POLICY IF EXISTS "Users can create own workshops" ON workshops;
DROP POLICY IF EXISTS "Users can update own workshops" ON workshops;
DROP POLICY IF EXISTS "Users can delete own workshops" ON workshops;

DROP POLICY IF EXISTS "Users can view own tools" ON tools;
DROP POLICY IF EXISTS "Users can create own tools" ON tools;
DROP POLICY IF EXISTS "Users can update own tools" ON tools;
DROP POLICY IF EXISTS "Users can delete own tools" ON tools;

DROP POLICY IF EXISTS "Users can view own layouts" ON layouts;
DROP POLICY IF EXISTS "Users can create own layouts" ON layouts;
DROP POLICY IF EXISTS "Users can update own layouts" ON layouts;
DROP POLICY IF EXISTS "Users can delete own layouts" ON layouts;

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Recreate with (select auth.uid()) to prevent re-evaluation per row
-- Workshops
CREATE POLICY "Users can view own workshops"
  ON workshops FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own workshops"
  ON workshops FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own workshops"
  ON workshops FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own workshops"
  ON workshops FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Tools
CREATE POLICY "Users can view own tools"
  ON tools FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own tools"
  ON tools FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own tools"
  ON tools FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own tools"
  ON tools FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Layouts
CREATE POLICY "Users can view own layouts"
  ON layouts FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own layouts"
  ON layouts FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid()) AND
    EXISTS (SELECT 1 FROM workshops WHERE id = layouts.workshop_id AND user_id = (select auth.uid()))
  );

CREATE POLICY "Users can update own layouts"
  ON layouts FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own layouts"
  ON layouts FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Workshop Tools (junction table)
CREATE POLICY "Users can view their workshop tools"
  ON workshop_tools FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workshops
      WHERE workshops.id = workshop_tools.workshop_id
      AND workshops.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can add tools to their workshops"
  ON workshop_tools FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workshops
      WHERE workshops.id = workshop_tools.workshop_id
      AND workshops.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can remove tools from their workshops"
  ON workshop_tools FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workshops
      WHERE workshops.id = workshop_tools.workshop_id
      AND workshops.user_id = (select auth.uid())
    )
  );

-- User Profiles
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- ============================================
-- 3. Drop unused indexes
-- ============================================
-- Drop indexes that have never been used and don't cover foreign keys
DROP INDEX IF EXISTS idx_user_profiles_onboarding;
DROP INDEX IF EXISTS idx_tools_type;
DROP INDEX IF EXISTS idx_tools_is_mobile;
DROP INDEX IF EXISTS idx_tool_templates_category;
DROP INDEX IF EXISTS idx_tool_templates_is_public;
DROP INDEX IF EXISTS idx_workshops_created_at;
DROP INDEX IF EXISTS idx_layouts_created_at;
DROP INDEX IF EXISTS idx_workshop_tools_workshop;

-- Note: Foreign key indexes (idx_workshops_user_id, idx_tools_user_id, etc.)
-- are retained despite showing as "unused" - they're important for FK performance

-- ============================================
-- 4. Verification queries
-- ============================================
-- Uncomment to verify after migration

-- Check function search_path is set
-- SELECT proname, prosecdef, proconfig
-- FROM pg_proc
-- WHERE proname = 'update_updated_at_column';

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, roles, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public';

-- Check for unused indexes
-- SELECT schemaname, tablename, indexname, idx_scan
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public' AND idx_scan = 0
-- ORDER BY tablename, indexname;
