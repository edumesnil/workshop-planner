-- Phase 4: Tool System Schema Updates
-- Run Date: 2025-10-11
-- Description: Add category, material_feed_length, and workshop_tools junction table

-- ============================================
-- 1. Add category field to tools and tool_templates
-- ============================================
ALTER TABLE tools
  ADD COLUMN IF NOT EXISTS category VARCHAR(50);

ALTER TABLE tool_templates
  ADD COLUMN IF NOT EXISTS category VARCHAR(50),
  ADD COLUMN IF NOT EXISTS material_feed_length INTEGER;

-- ============================================
-- 2. Add material_feed_length to tools
-- ============================================
ALTER TABLE tools
  ADD COLUMN IF NOT EXISTS material_feed_length INTEGER;

-- ============================================
-- 3. Create workshop_tools junction table
-- ============================================
CREATE TABLE IF NOT EXISTS workshop_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workshop_id, tool_id)
);

-- ============================================
-- 4. Create indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_workshop_tools_workshop
  ON workshop_tools(workshop_id);

CREATE INDEX IF NOT EXISTS idx_workshop_tools_tool
  ON workshop_tools(tool_id);

-- ============================================
-- 5. Enable RLS on workshop_tools
-- ============================================
ALTER TABLE workshop_tools ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. RLS policies for workshop_tools
-- ============================================
CREATE POLICY "Users can view their workshop tools"
  ON workshop_tools FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workshops
      WHERE workshops.id = workshop_tools.workshop_id
      AND workshops.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add tools to their workshops"
  ON workshop_tools FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workshops
      WHERE workshops.id = workshop_tools.workshop_id
      AND workshops.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove tools from their workshops"
  ON workshop_tools FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workshops
      WHERE workshops.id = workshop_tools.workshop_id
      AND workshops.user_id = auth.uid()
    )
  );

-- ============================================
-- 7. Update existing tool_templates with categories
-- ============================================
-- Run after migration to categorize existing data
UPDATE tool_templates SET category = 'power_tools'
  WHERE name IN ('Table Saw', 'Bandsaw', 'Planer', 'Jointer', 'Router Table', 'Drill Press');

UPDATE tool_templates SET category = 'work_surfaces'
  WHERE name = 'Workbench';

UPDATE tool_templates SET category = 'dust_collection'
  WHERE name = 'Dust Collector';

-- ============================================
-- 8. Verification queries (comment out after running)
-- ============================================
-- SELECT * FROM tool_templates;
-- SELECT * FROM workshop_tools;
-- \d workshop_tools
