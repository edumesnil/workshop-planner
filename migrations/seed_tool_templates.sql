-- Seed tool templates
INSERT INTO tool_templates (name, category, dimensions, power_requirement, dust_collection, min_clearance, is_mobile, description, is_public)
VALUES
  (
    'Table Saw',
    'stationary_power_tools',
    '{"length": 84, "width": 48, "height": 34}'::jsonb,
    '{"voltage": 220, "amperage": 15, "phase": 1}'::jsonb,
    true,
    '{"front": 48, "back": 96, "left": 24, "right": 36, "top": 12}'::jsonb,
    false,
    'Full-size cabinet table saw with 52" fence and outfeed space',
    true
  ),
  (
    'Bandsaw',
    'stationary_power_tools',
    '{"length": 24, "width": 24, "height": 72}'::jsonb,
    '{"voltage": 110, "amperage": 10, "phase": 1}'::jsonb,
    true,
    '{"front": 36, "back": 18, "left": 18, "right": 18, "top": 12}'::jsonb,
    true,
    '14" bandsaw with mobile base - ideal for resawing and curved cuts',
    true
  ),
  (
    'Planer',
    'stationary_power_tools',
    '{"length": 36, "width": 24, "height": 18}'::jsonb,
    '{"voltage": 110, "amperage": 15, "phase": 1}'::jsonb,
    true,
    '{"front": 48, "back": 48, "left": 12, "right": 12, "top": 12}'::jsonb,
    true,
    '13" benchtop planer with mobile base - requires infeed/outfeed clearance',
    true
  ),
  (
    'Jointer',
    'stationary_power_tools',
    '{"length": 72, "width": 18, "height": 34}'::jsonb,
    '{"voltage": 110, "amperage": 12, "phase": 1}'::jsonb,
    true,
    '{"front": 48, "back": 48, "left": 18, "right": 18, "top": 12}'::jsonb,
    true,
    '6" jointer with mobile base - pairs with planer for milling lumber',
    true
  ),
  (
    'Router Table',
    'stationary_power_tools',
    '{"length": 32, "width": 24, "height": 34}'::jsonb,
    '{"voltage": 110, "amperage": 12, "phase": 1}'::jsonb,
    true,
    '{"front": 36, "back": 24, "left": 18, "right": 18, "top": 12}'::jsonb,
    true,
    'Router table with fence and dust collection - mobile for flexibility',
    true
  ),
  (
    'Drill Press',
    'stationary_power_tools',
    '{"length": 20, "width": 16, "height": 60}'::jsonb,
    '{"voltage": 110, "amperage": 8, "phase": 1}'::jsonb,
    false,
    '{"front": 30, "back": 12, "left": 12, "right": 12, "top": 12}'::jsonb,
    true,
    'Floor-standing drill press with mobile base',
    true
  ),
  (
    'Workbench',
    'workstation',
    '{"length": 96, "width": 24, "height": 34}'::jsonb,
    null,
    false,
    '{"front": 36, "back": 18, "left": 18, "right": 18, "top": 48}'::jsonb,
    false,
    '8-foot solid workbench with vises - central assembly station',
    true
  ),
  (
    'Dust Collector',
    'infrastructure',
    '{"length": 36, "width": 24, "height": 60}'::jsonb,
    '{"voltage": 110, "amperage": 12, "phase": 1}'::jsonb,
    false,
    '{"front": 24, "back": 18, "left": 18, "right": 18, "top": 12}'::jsonb,
    true,
    '2HP dust collector with mobile base for flexible positioning',
    true
  )
ON CONFLICT DO NOTHING;
