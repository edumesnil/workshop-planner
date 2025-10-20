-- Add Foreign Key Indexes
-- Date: 2025-10-20
-- Description: Add indexes to cover foreign key constraints for optimal query performance

-- These indexes were previously flagged as "unused" but are actually important
-- for foreign key constraint performance. They were removed in the previous
-- migration but should be retained to avoid unindexed foreign key warnings.

-- Workshops table
CREATE INDEX IF NOT EXISTS idx_workshops_user_id ON workshops(user_id);

-- Tools table
CREATE INDEX IF NOT EXISTS idx_tools_user_id ON tools(user_id);

-- Layouts table
CREATE INDEX IF NOT EXISTS idx_layouts_user_id ON layouts(user_id);
CREATE INDEX IF NOT EXISTS idx_layouts_workshop_id ON layouts(workshop_id);

-- Workshop Tools junction table
CREATE INDEX IF NOT EXISTS idx_workshop_tools_tool_id ON workshop_tools(tool_id);

-- Note: workshop_tools already has idx_workshop_tools_workshop_tool_unique which
-- covers workshop_id, so no additional index needed for workshop_id foreign key
