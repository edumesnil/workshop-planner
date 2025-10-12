-- Fix: Make tool category required with default values
-- Run Date: 2025-10-12
-- Description: Set default category for existing tools and make field NOT NULL

-- 1. Set default category for any existing tools without category
UPDATE tools
SET category = 'power_tools'
WHERE category IS NULL;

-- 2. Set default category for any existing tool_templates without category
UPDATE tool_templates
SET category = 'power_tools'
WHERE category IS NULL;

-- 3. Make category NOT NULL on tools table
ALTER TABLE tools
  ALTER COLUMN category SET NOT NULL,
  ALTER COLUMN category SET DEFAULT 'power_tools';

-- 4. Make category NOT NULL on tool_templates table
ALTER TABLE tool_templates
  ALTER COLUMN category SET NOT NULL,
  ALTER COLUMN category SET DEFAULT 'power_tools';

-- 5. Verify: Check if any records still have null categories
-- SELECT COUNT(*) FROM tools WHERE category IS NULL;
-- SELECT COUNT(*) FROM tool_templates WHERE category IS NULL;
