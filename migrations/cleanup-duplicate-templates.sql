-- Cleanup Duplicate and Old Tool Templates
-- Run Date: 2025-10-11
-- Description: Remove old templates and duplicates, keeping only 13 unique Phase 4 templates

-- ============================================
-- Current State Analysis
-- ============================================
-- Old templates (from earlier phases): Dust Collector, Bandsaw, Jointer, Planer, Router Table, Table Saw, Workbench
-- New templates (Phase 4): Table Saw - Cabinet, Table Saw - Contractor, Miter Saw variants, etc.
-- Issue: Mix of old templates (many duplicated) + new templates

-- ============================================
-- Step 1: Delete OLD templates (generic names without variants)
-- ============================================
DELETE FROM tool_templates
WHERE is_public = true
  AND name IN (
    'Dust Collector',
    'Bandsaw',
    'Drill Press',
    'Jointer',
    'Planer',
    'Router Table',
    'Table Saw',
    'Workbench'
  );

-- ============================================
-- Step 2: Keep only ONE of each Phase 4 template (remove duplicates)
-- ============================================
-- This uses a window function to identify duplicates and keep only the first one
WITH duplicates AS (
  SELECT
    id,
    name,
    ROW_NUMBER() OVER (PARTITION BY name, category ORDER BY created_at ASC) as rn
  FROM tool_templates
  WHERE is_public = true
)
DELETE FROM tool_templates
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- ============================================
-- Step 3: Verify we have exactly 13 unique templates
-- ============================================
SELECT
  name,
  category,
  is_mobile,
  material_feed_length,
  (dimensions->>'length')::int as length,
  (dimensions->>'width')::int as width,
  (dimensions->>'height')::int as height
FROM tool_templates
WHERE is_public = true
ORDER BY category, name;

-- Expected count: 13 rows
SELECT COUNT(*) as total_templates FROM tool_templates WHERE is_public = true;

-- ============================================
-- Step 4: If templates are missing, re-run seed
-- ============================================
-- If you see fewer than 13 templates after cleanup,
-- re-run migrations/seed-tool-templates.sql
