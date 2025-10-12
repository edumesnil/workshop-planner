-- Seed 13 MVP Tool Templates
-- Run Date: 2025-10-11
-- Description: Insert 13 research-based tool templates with accurate dimensions and clearances

-- ============================================
-- Clear existing templates (optional - uncomment if reseeding)
-- ============================================
-- DELETE FROM tool_templates WHERE is_public = true;

-- ============================================
-- POWER TOOLS (9 templates)
-- ============================================

-- 1. Table Saw - Cabinet (stationary)
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Table Saw - Cabinet',
  'power_tools',
  '{"length": 84, "width": 48, "height": 34}'::jsonb,
  '{"front": 48, "back": 96, "left": 36, "right": 36, "top": 12}'::jsonb,
  96,
  '{"voltage": 220, "amperage": 15, "phase": 1}'::jsonb,
  true,
  false,
  'Cabinet table saw with outfeed and fence extension. Professional-grade stationary saw.',
  true
);

-- 2. Table Saw - Contractor (mobile option)
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Table Saw - Contractor',
  'power_tools',
  '{"length": 60, "width": 40, "height": 34}'::jsonb,
  '{"front": 48, "back": 72, "left": 30, "right": 30, "top": 12}'::jsonb,
  72,
  '{"voltage": 110, "amperage": 15, "phase": 1}'::jsonb,
  true,
  true,
  'Contractor table saw, compact footprint with optional mobile base.',
  true
);

-- 3. Miter Saw - 10" Compound Sliding
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Miter Saw - 10" Compound Sliding',
  'power_tools',
  '{"length": 30, "width": 24, "height": 18}'::jsonb,
  '{"front": 36, "back": 24, "left": 96, "right": 96, "top": 12}'::jsonb,
  96,
  '{"voltage": 110, "amperage": 12, "phase": 1}'::jsonb,
  true,
  true,
  'Benchtop 10" compound miter saw with sliding feature for wider cuts.',
  true
);

-- 4. Miter Saw - 12" Compound Sliding
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Miter Saw - 12" Compound Sliding',
  'power_tools',
  '{"length": 36, "width": 28, "height": 20}'::jsonb,
  '{"front": 42, "back": 30, "left": 96, "right": 96, "top": 12}'::jsonb,
  120,
  '{"voltage": 110, "amperage": 15, "phase": 1}'::jsonb,
  true,
  true,
  'Larger 12" compound miter saw for cutting wider stock and crown molding.',
  true
);

-- 5. Router Table
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
);

-- 6. Bandsaw - 14"
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Bandsaw - 14"',
  'power_tools',
  '{"length": 24, "width": 24, "height": 72}'::jsonb,
  '{"front": 36, "back": 18, "left": 18, "right": 18, "top": 12}'::jsonb,
  48,
  '{"voltage": 110, "amperage": 10, "phase": 1}'::jsonb,
  true,
  false,
  'Standard 14" bandsaw for resawing and curved cuts.',
  true
);

-- 7. Benchtop Sander - Belt + Disc Combo
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Benchtop Sander - Belt + Disc',
  'power_tools',
  '{"length": 18, "width": 16, "height": 12}'::jsonb,
  '{"front": 36, "back": 24, "left": 24, "right": 24, "top": 12}'::jsonb,
  36,
  '{"voltage": 110, "amperage": 8, "phase": 1}'::jsonb,
  true,
  true,
  'Combination belt and disc sander for stock preparation and edge work.',
  true
);

-- 8. Scroll Saw - 16" Throat
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Scroll Saw - 16" Throat',
  'power_tools',
  '{"length": 24, "width": 18, "height": 18}'::jsonb,
  '{"front": 30, "back": 18, "left": 18, "right": 18, "top": 12}'::jsonb,
  24,
  '{"voltage": 110, "amperage": 2, "phase": 1}'::jsonb,
  false,
  true,
  'Benchtop scroll saw for intricate curves and detailed work.',
  true
);

-- 9. Drill Press - Floor Standing
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Drill Press - Floor Standing',
  'power_tools',
  '{"length": 20, "width": 16, "height": 60}'::jsonb,
  '{"front": 30, "back": 12, "left": 12, "right": 12, "top": 12}'::jsonb,
  NULL,
  '{"voltage": 110, "amperage": 8, "phase": 1}'::jsonb,
  false,
  false,
  'Floor-standing drill press with optional mobile base for precision drilling.',
  true
);

-- ============================================
-- WORK SURFACES (4 templates)
-- ============================================

-- 10. Workbench - 6-foot
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Workbench - 6-foot',
  'work_surfaces',
  '{"length": 72, "width": 24, "height": 34}'::jsonb,
  '{"front": 36, "back": 18, "left": 18, "right": 18, "top": 48}'::jsonb,
  NULL,
  NULL,
  false,
  true,
  '6-foot workbench with optional casters. Standard height for hand tool work.',
  true
);

-- 11. Workbench - 8-foot
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Workbench - 8-foot',
  'work_surfaces',
  '{"length": 96, "width": 24, "height": 34}'::jsonb,
  '{"front": 36, "back": 18, "left": 18, "right": 18, "top": 48}'::jsonb,
  NULL,
  NULL,
  false,
  true,
  '8-foot workbench for larger projects. Optional mobile base available.',
  true
);

-- 12. Assembly Table - 4' × 8'
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Assembly Table - 4'' × 8''',
  'work_surfaces',
  '{"length": 96, "width": 48, "height": 34}'::jsonb,
  '{"front": 48, "back": 24, "left": 24, "right": 24, "top": 12}'::jsonb,
  NULL,
  NULL,
  false,
  false,
  'Full sheet goods assembly table for cabinet and furniture work.',
  true
);

-- 13. Assembly Table - 4' × 4'
INSERT INTO tool_templates (
  name, category, dimensions, min_clearance, material_feed_length,
  power_requirement, dust_collection, is_mobile, description, is_public
) VALUES (
  'Assembly Table - 4'' × 4''',
  'work_surfaces',
  '{"length": 48, "width": 48, "height": 34}'::jsonb,
  '{"front": 36, "back": 18, "left": 18, "right": 18, "top": 12}'::jsonb,
  NULL,
  NULL,
  false,
  false,
  'Compact assembly table for smaller workshops and projects.',
  true
);

-- ============================================
-- Verification
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
