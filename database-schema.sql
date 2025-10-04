-- Workshop Planner - Supabase Database Schema
-- Reconciled with TypeScript types and Phase 1 research integration

-- =============================================================================
-- USER PROFILES
-- =============================================================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  preferences JSONB DEFAULT jsonb_build_object(
    'units', 'imperial',
    'defaultAlgorithm', 'multi_objective',
    'defaultWeights', jsonb_build_object(
      'safety', 40,
      'workflow', 25,
      'space', 20,
      'accessibility', 15
    )
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- WORKSHOPS
-- =============================================================================

CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,

  -- Dimensions stored as JSONB to match TypeScript Dimensions interface
  dimensions JSONB NOT NULL DEFAULT jsonb_build_object(
    'length', 213,
    'width', 103,
    'height', 96
  ),

  -- Constraints array (wall positions, obstacles, fixed zones)
  constraints JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Validation constraints
  CONSTRAINT valid_dimensions CHECK (
    (dimensions->>'length')::numeric > 0 AND
    (dimensions->>'width')::numeric > 0 AND
    (dimensions->>'height')::numeric > 0
  )
);

-- =============================================================================
-- TOOLS
-- =============================================================================

CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,

  -- Dimensions stored as JSONB to match TypeScript Dimensions interface
  dimensions JSONB NOT NULL,

  -- Power requirement (optional) - matches PowerRequirement interface
  power_requirement JSONB,

  -- Dust collection boolean
  dust_collection BOOLEAN DEFAULT false,

  -- Clearance requirements - matches Clearance interface
  min_clearance JSONB NOT NULL,

  -- Phase 1 integration: Mobile tool support (HIGH PRIORITY)
  is_mobile BOOLEAN DEFAULT false,

  -- Mobile tool dual-position system
  -- deployed_position: working position with full clearances
  -- parked_position: storage position with minimal clearances
  deployed_position JSONB,
  parked_position JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Validation constraints
  CONSTRAINT valid_dimensions CHECK (
    (dimensions->>'length')::numeric > 0 AND
    (dimensions->>'width')::numeric > 0 AND
    (dimensions->>'height')::numeric > 0
  ),
  CONSTRAINT valid_clearance CHECK (
    (min_clearance->>'front')::numeric >= 0 AND
    (min_clearance->>'back')::numeric >= 0 AND
    (min_clearance->>'left')::numeric >= 0 AND
    (min_clearance->>'right')::numeric >= 0 AND
    (min_clearance->>'top')::numeric >= 0
  ),
  CONSTRAINT valid_power_requirement CHECK (
    power_requirement IS NULL OR (
      (power_requirement->>'voltage')::numeric IN (110, 220) AND
      (power_requirement->>'amperage')::numeric > 0 AND
      (power_requirement->>'phase')::numeric IN (1, 3)
    )
  )
);

-- =============================================================================
-- TOOL TEMPLATES (Public library of common tools)
-- =============================================================================

CREATE TABLE tool_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,

  -- Dimensions
  dimensions JSONB NOT NULL,

  -- Power and clearance
  power_requirement JSONB,
  dust_collection BOOLEAN DEFAULT false,
  min_clearance JSONB NOT NULL,

  -- Mobile tool properties
  is_mobile BOOLEAN DEFAULT false,

  -- Metadata
  description TEXT,
  is_public BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Validation constraints (same as tools table)
  CONSTRAINT valid_template_dimensions CHECK (
    (dimensions->>'length')::numeric > 0 AND
    (dimensions->>'width')::numeric > 0 AND
    (dimensions->>'height')::numeric > 0
  ),
  CONSTRAINT valid_template_clearance CHECK (
    (min_clearance->>'front')::numeric >= 0 AND
    (min_clearance->>'back')::numeric >= 0 AND
    (min_clearance->>'left')::numeric >= 0 AND
    (min_clearance->>'right')::numeric >= 0 AND
    (min_clearance->>'top')::numeric >= 0
  )
);

-- =============================================================================
-- LAYOUTS
-- =============================================================================

CREATE TABLE layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,

  -- Tool placements array - matches ToolPlacement[] interface
  -- Each placement contains: { toolId, position, orientation, tool }
  tool_placements JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Multi-objective optimization scores - matches OptimizationScore interface
  score JSONB NOT NULL DEFAULT jsonb_build_object(
    'overall', 0,
    'workflow', 0,
    'safety', 0,
    'space', 0,
    'accessibility', 0
  ),

  -- Layout metadata - matches LayoutMetadata interface
  metadata JSONB NOT NULL DEFAULT jsonb_build_object(
    'optimizationTime', 0,
    'algorithm', 'multi_objective',
    'iterations', 0,
    'constraints', '[]'::jsonb
  ),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Validation constraints
  CONSTRAINT valid_score CHECK (
    (score->>'overall')::numeric BETWEEN 0 AND 100 AND
    (score->>'workflow')::numeric BETWEEN 0 AND 100 AND
    (score->>'safety')::numeric BETWEEN 0 AND 100 AND
    (score->>'space')::numeric BETWEEN 0 AND 100 AND
    (score->>'accessibility')::numeric BETWEEN 0 AND 100
  )
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- User-based queries
CREATE INDEX idx_workshops_user_id ON workshops(user_id);
CREATE INDEX idx_tools_user_id ON tools(user_id);
CREATE INDEX idx_layouts_user_id ON layouts(user_id);
CREATE INDEX idx_layouts_workshop_id ON layouts(workshop_id);

-- Tool queries
CREATE INDEX idx_tools_type ON tools(type);
CREATE INDEX idx_tools_is_mobile ON tools(is_mobile);
CREATE INDEX idx_tool_templates_category ON tool_templates(category);
CREATE INDEX idx_tool_templates_is_public ON tool_templates(is_public) WHERE is_public = true;

-- Timestamp-based queries
CREATE INDEX idx_workshops_created_at ON workshops(created_at DESC);
CREATE INDEX idx_layouts_created_at ON layouts(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE layouts ENABLE ROW LEVEL SECURITY;

-- User Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Workshops: Users can only manage their own workshops
CREATE POLICY "Users can view own workshops" ON workshops
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workshops" ON workshops
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workshops" ON workshops
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workshops" ON workshops
  FOR DELETE USING (auth.uid() = user_id);

-- Tools: Users can only manage their own tools
CREATE POLICY "Users can view own tools" ON tools
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tools" ON tools
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tools" ON tools
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tools" ON tools
  FOR DELETE USING (auth.uid() = user_id);

-- Tool Templates: Public templates viewable by all, only admins can modify
CREATE POLICY "Anyone can view public templates" ON tool_templates
  FOR SELECT USING (is_public = true);

-- Note: Admin-only policies for INSERT/UPDATE/DELETE would be handled via service role

-- Layouts: Users can only manage layouts for their own workshops
CREATE POLICY "Users can view own layouts" ON layouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own layouts" ON layouts
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM workshops WHERE id = workshop_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update own layouts" ON layouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own layouts" ON layouts
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- INITIAL DATA: Default Tool Templates
-- =============================================================================

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
  );

-- =============================================================================
-- NOTES
-- =============================================================================

-- Data Size Optimization:
-- - JSONB used for complex nested structures (matches TypeScript interfaces)
-- - Selective indexing on frequently queried columns
-- - RLS policies prevent unauthorized data access
-- - Expected data size per user: ~18KB (well within Supabase free tier)
--
-- Mobile Tool Implementation:
-- - is_mobile: boolean flag (HIGH PRIORITY per Phase 1)
-- - deployed_position: working position with full clearances
-- - parked_position: storage position when not in use
-- - Enables 30-50% space savings per research findings
--
-- Multi-Objective Scoring:
-- - Safety: 40% (REQUIRED constraints)
-- - Workflow: 25% (HIGH priority adjacency)
-- - Space: 20% (efficiency optimization)
-- - Accessibility: 15% (ease of movement)
