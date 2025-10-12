-- Add Missing Router Table Template
-- Run Date: 2025-10-11
-- Description: Insert the Router Table template that's missing from the database

-- First, verify it's actually missing
SELECT COUNT(*) as router_table_count
FROM tool_templates
WHERE name = 'Router Table' AND is_public = true;
-- Expected: 0

-- Insert Router Table
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Router Table',
  'power_tools',
  '{"length": 32, "width": 24, "height": 34}'::jsonb,
  '{"front": 36, "back": 24, "left": 18, "right": 18, "top": 12}'::jsonb,
  48,
  '{"voltage": 110, "amperage": 12, "phase": 1}'::jsonb,
  true,
  false,
  'Stationary router table for edge profiling and joinery work.',
  true
)
ON CONFLICT DO NOTHING;  -- Prevents error if it already exists

-- Verify it was inserted
SELECT
  name,
  category,
  is_mobile,
  material_feed_length,
  (dimensions->>'length')::int as length,
  (dimensions->>'width')::int as width,
  (dimensions->>'height')::int as height
FROM tool_templates
WHERE name = 'Router Table' AND is_public = true;

-- Final count - should be 13
SELECT COUNT(*) as total_templates
FROM tool_templates
WHERE is_public = true;
