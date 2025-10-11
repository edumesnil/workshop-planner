# Phase 4: Tool System

**Duration**: Week 4-5
**Status**: IN PROGRESS
**Updated**: 2025-10-11

## Overview

Build MVP tool management system with emphasis on mobile/stationary tool distinction and personal tool libraries. This phase establishes the tool data foundation required for Phase 5 optimization engine.

**Key Decisions:**
- MVP approach: 13 tool templates (not 50+)
- Category field architecture for clean organization
- Material feed length tracked separately from safety clearances
- Junction table pattern for workshop-tool association
- Modal-based tool addition in workshop builder

## Prerequisites from Previous Phases
- ✅ Database schema with tools and tool_templates tables (Phase 2)
- ✅ Workshop configuration system (Phase 3A, 3B, 3C)
- ✅ Research-based tool constraint data (Phase 1)

## Phase 4 Scope Decisions

### ✅ In Scope (MVP)
- 13 tool templates with size variants
- Tool category architecture
- Material feed length tracking
- Dedicated /tools page for library management
- In-builder tool addition via modal
- Workshop-tool association via junction table
- Simple power requirements (voltage only for MVP)

### ⏭️ Deferred to Later Phases
- Material feed length customization UI (Phase 5 UX)
- Workbench size recommendations (Phase 5 optimization intelligence)
- Advanced tool properties (weight, noise, vibration)
- Tool import/export functionality
- Hand tools and storage solutions
- Tool performance tracking
- Community template marketplace

## Database Schema Updates 📋 PENDING

### Migration Script Required
```sql
-- Phase 4: Tool System Schema Updates

-- 1. Add category field to tools and tool_templates
ALTER TABLE tools
  ADD COLUMN IF NOT EXISTS category VARCHAR(50);

ALTER TABLE tool_templates
  ADD COLUMN IF NOT EXISTS category VARCHAR(50),
  ADD COLUMN IF NOT EXISTS material_feed_length INTEGER;

-- 2. Add material_feed_length to tools
ALTER TABLE tools
  ADD COLUMN IF NOT EXISTS material_feed_length INTEGER;

-- 3. Create workshop_tools junction table
CREATE TABLE IF NOT EXISTS workshop_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workshop_id, tool_id)
);

CREATE INDEX IF NOT EXISTS idx_workshop_tools_workshop
  ON workshop_tools(workshop_id);

CREATE INDEX IF NOT EXISTS idx_workshop_tools_tool
  ON workshop_tools(tool_id);

-- 4. RLS policies for workshop_tools
ALTER TABLE workshop_tools ENABLE ROW LEVEL SECURITY;

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
```

## Tool Categories and Types 📋 PENDING

### Category Architecture
```typescript
enum ToolCategory {
  POWER_TOOLS = 'power_tools',
  WORK_SURFACES = 'work_surfaces',
  DUST_COLLECTION = 'dust_collection'
}

interface Tool {
  id: string
  user_id: string
  name: string                    // "Table Saw"
  type: string                    // Flexible string for specific type
  category: ToolCategory          // NEW: Enum for organization
  dimensions: Dimensions
  is_mobile: boolean              // HIGH PRIORITY
  power_requirement?: PowerSpec
  dust_collection: boolean
  min_clearance: ClearanceSpec    // Safety clearances from research
  material_feed_length?: number   // NEW: Max material length (separate from clearances)
  default_deployed_position?: Position  // User's preferred working position
  default_parked_position?: Position    // User's preferred storage position
}
```

### Clearance vs Material Feed Length

**Important Distinction:**

**Safety Clearances** (`min_clearance`):
- Front: Operator standing space (e.g., 96" for table saw)
- Back: Outfeed clearance space
- Sides: Movement and access space
- Based on OSHA/Canadian safety research

**Material Feed Length** (`material_feed_length`):
- Maximum material length tool can process
- Table saw: 96" (8-foot boards)
- Miter saw: 96" (studs/moulding support on sides)
- Affects optimization: tool placement must account for material direction

**Future Enhancement (Phase 5+):**
- UI to customize material feed length per user's typical projects
- Example: "I only make cutting boards" → 24" vs "I build cabinets" → 96"
- Optimization engine uses custom value if provided, defaults otherwise

## MVP Tool Template Library 📋 PENDING

### 13 Tool Templates (Research-Based Specifications)

**Power Tools (9 templates with variants):**

1. **Table Saw - Cabinet** (stationary)
   - Dimensions: 84" × 48" × 34" (includes outfeed and fence extension)
   - Clearances: Front 48", Back 96", Sides 36"
   - Material Feed: 96"
   - Power: 220V, 15A, 1-phase
   - Dust Collection: Yes

2. **Table Saw - Contractor** (mobile option)
   - Dimensions: 60" × 40" × 34"
   - Clearances: Front 48", Back 72", Sides 30"
   - Material Feed: 72"
   - Power: 110V, 15A, 1-phase
   - Mobile: Optional casters

3. **Miter Saw - 10" Compound Sliding**
   - Dimensions: 30" × 24" × 18" (benchtop)
   - Clearances: Front 36", Back 24", Sides 96" (material support)
   - Material Feed: 96" (long mouldings)
   - Power: 110V, 12A
   - Mobile: Yes (typically benchtop)

4. **Miter Saw - 12" Compound Sliding**
   - Dimensions: 36" × 28" × 20"
   - Clearances: Front 42", Back 30", Sides 96"
   - Material Feed: 120"
   - Power: 110V, 15A

5. **Router Table** (stationary)
   - Dimensions: 32" × 24" × 34"
   - Clearances: Front 36", Back 24", Sides 18"
   - Material Feed: 48"
   - Power: 110V, 12A
   - Dust Collection: Yes

6. **Bandsaw - 14"** (stationary)
   - Dimensions: 24" × 24" × 72"
   - Clearances: Front 36", Back 18", Sides 18"
   - Material Feed: 48"
   - Power: 110V, 10A
   - Dust Collection: Yes

7. **Benchtop Sander - Belt + Disc Combo**
   - Dimensions: 18" × 16" × 12" (benchtop)
   - Clearances: Front 36", Back 24", Sides 24"
   - Material Feed: 36"
   - Power: 110V, 8A
   - Mobile: Yes (benchtop)

8. **Scroll Saw - 16" Throat**
   - Dimensions: 24" × 18" × 18" (benchtop)
   - Clearances: Front 30", Back 18", Sides 18"
   - Material Feed: 24"
   - Power: 110V, 2A
   - Mobile: Yes (benchtop)

9. **Drill Press - Floor Standing**
   - Dimensions: 20" × 16" × 60"
   - Clearances: Front 30", Back 12", Sides 12"
   - Material Feed: N/A
   - Power: 110V, 8A
   - Mobile: Optional casters

**Work Surfaces (4 templates with size variants):**

10. **Workbench - 6-foot**
    - Dimensions: 72" × 24" × 34"
    - Clearances: Front 36", Back 18", Sides 18"
    - No power, no dust collection
    - Mobile: Optional casters
    - Note: Size customizable by user

11. **Workbench - 8-foot**
    - Dimensions: 96" × 24" × 34"
    - Clearances: Front 36", Back 18", Sides 18"
    - Mobile: Optional casters

12. **Assembly Table - 4' × 8'** (sheet goods)
    - Dimensions: 96" × 48" × 34"
    - Clearances: Front 48", Back 24", Sides 24"
    - Optimized for sheet goods assembly

13. **Assembly Table - 4' × 4'** (compact)
    - Dimensions: 48" × 48" × 34"
    - Clearances: Front 36", Back 18", Sides 18"
    - Space-efficient variant

**Template Notes:**
- All dimensions and clearances based on Phase 1 safety research
- Mobile status reflects typical use (benchtop tools = mobile)
- Power requirements simplified for MVP (voltage only)
- Future: Phase 5 optimizer can recommend workbench sizes based on workshop space

## Tool Creation and Editing Interface 📋 PENDING

### Tool Entry Form Fields

**Basic Information:**
- [ ] Tool name (text input, required)
- [ ] Category (dropdown: Power Tools, Work Surfaces, Dust Collection)
- [ ] Type (text input for specific model/variant)

**Dimensions:**
- [ ] Length (inches, required)
- [ ] Width (inches, required)
- [ ] Height (inches, required)

**Mobile/Stationary:**
- [ ] Is Mobile checkbox (HIGH PRIORITY)
- [ ] Tooltip: "Tools on casters or benchtop tools you can move around"

**Clearances:**
- [ ] Front clearance (inches)
- [ ] Back clearance (inches)
- [ ] Left clearance (inches)
- [ ] Right clearance (inches)
- [ ] Top clearance (inches)
- [ ] Helper text: "Safety space around operator based on OSHA standards"

**Material Feed Length:**
- [ ] Material feed length (inches, optional)
- [ ] Helper text: "Longest material this tool can process (e.g., 96\" for 8-foot boards)"

**Power & Dust Collection (Simplified for MVP):**
- [ ] Power required checkbox
- [ ] Voltage dropdown (110V, 220V) - if power required
- [ ] Dust collection required checkbox

**Mobile Tool Positions (Optional):**
- [ ] Default deployed position (X, Y coordinates)
- [ ] Default parked position (X, Y coordinates)
- [ ] Helper text: "Where you typically use/store this tool - optimizer uses these as starting points"

**Validation:**
- All dimension fields must be positive numbers
- Clearances default to 0 if not specified
- Mobile position coordinates must fit within workshop bounds

## Personal Tool Library Management 📋 PENDING

### Dedicated /tools Page

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ My Tools                      [+ Create Tool]   │
├─────────────────────────────────────────────────┤
│ [Search...] [All Categories ▼] [Grid/List]     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Table   │  │ Miter   │  │ Router  │        │
│  │ Saw     │  │ Saw     │  │ Table   │        │
│  │         │  │         │  │         │        │
│  │ 84×48×34│  │ 30×24×18│  │ 32×24×34│        │
│  │ Mobile: │  │ Mobile: │  │ Mobile: │        │
│  │ No      │  │ Yes     │  │ No      │        │
│  │         │  │         │  │         │        │
│  │ [Edit]  │  │ [Edit]  │  │ [Edit]  │        │
│  └─────────┘  └─────────┘  └─────────┘        │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Features:**
- [ ] Grid view (default) with tool cards
- [ ] List view (compact table)
- [ ] Search by tool name
- [ ] Filter by category
- [ ] Sort by: Name, Date Added, Category
- [ ] Empty state: "No tools yet. Create your first tool or choose from templates."

**Tool Card Display:**
- Tool name
- Dimensions (L×W×H)
- Category badge
- Mobile status indicator
- Edit/Delete actions
- Click card → opens edit modal

**Create Tool Flow:**
- [ ] "Create Tool" button → opens modal
- [ ] Modal has two tabs:
  - "From Template" - browse 13 templates, select to pre-fill form
  - "Custom Tool" - blank form
- [ ] Form validation before save
- [ ] Success: Tool appears in library
- [ ] Tool is automatically saved to user's global library

## Workshop-Tool Integration 📋 PENDING

### Workshop Tools Association Pattern

**Database Structure:**
```
workshops (user's workshops)
    ↓
workshop_tools (junction table)
    ↓
tools (user's tool library)
```

**User Flow:**
1. User creates/opens workshop
2. In builder, clicks "Add Tool to Workshop"
3. Modal shows: user's tool library + "Create New Tool" button
4. User selects tool → creates workshop_tools entry
5. Builder displays all tools for this workshop
6. Phase 5 optimization uses tools from workshop_tools junction

### In-Builder Tool Addition Modal 📋 PENDING

**Modal Layout:**
```
┌─────────────────────────────────────────────┐
│ Add Tool to Workshop                   [×]  │
├─────────────────────────────────────────────┤
│ [My Tools] [Create New Tool]                │
├─────────────────────────────────────────────┤
│                                             │
│ TAB 1: "My Tools"                           │
│ ┌─────────────────────────────────────────┐ │
│ │ [Search tools...]                       │ │
│ │ [Category: All ▼]                       │ │
│ │                                         │ │
│ │ ☑ Table Saw (84×48×34) - Stationary    │ │
│ │ ☐ Miter Saw (30×24×18) - Mobile        │ │
│ │ ☑ Router Table (32×24×34) - Stationary │ │
│ │ ☐ Workbench (72×24×34) - Mobile        │ │
│ │                                         │ │
│ │ ✓ = Already in workshop                │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ TAB 2: "Create New Tool"                    │
│ ┌─────────────────────────────────────────┐ │
│ │ [From Template ▼]                       │ │
│ │                                         │ │
│ │ Tool Name: [_________________]          │ │
│ │ Category:  [Power Tools      ▼]        │ │
│ │                                         │ │
│ │ Dimensions:                             │ │
│ │ Length: [___] Width: [___] Height: [__]│ │
│ │                                         │ │
│ │ ☐ Mobile tool                           │ │
│ │                                         │ │
│ │ [Advanced Options ▼]                    │ │
│ │   Clearances, Material Feed, Power...  │ │
│ │                                         │ │
│ │          [Cancel] [Save & Add to Shop] │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Modal Behavior:**
- Modal size: Large (min 600px width)
- Tab 1 (My Tools):
  - Checkboxes to select/deselect tools
  - Checked = already in workshop
  - Click checkbox → adds/removes from workshop_tools
  - Search and filter within modal
- Tab 2 (Create New Tool):
  - Same form as /tools page
  - "From Template" dropdown pre-fills with template data
  - Save → adds to user's library + workshop_tools
  - Cancel → closes modal without saving

**Technical Implementation:**
- Component: `src/components/workshops/AddToolModal.tsx`
- Tabs: HeroUI `Tabs` component
- Form: HeroUI `Input`, `Select`, `Checkbox` components
- State: Local state for form, updates workshopStore on save

## TypeScript Type Updates 📋 PENDING

### Updated Type Definitions

**Files to Update:**
- `src/types/database.ts` - Add category, material_feed_length to ToolRow/Insert/Update
- `src/types/workshop.ts` - Update Tool interface with new fields
- Create `src/types/toolCategory.ts` - Export ToolCategory enum

**New Types:**
```typescript
// src/types/toolCategory.ts
export enum ToolCategory {
  POWER_TOOLS = 'power_tools',
  WORK_SURFACES = 'work_surfaces',
  DUST_COLLECTION = 'dust_collection'
}

// src/types/database.ts updates
export interface ToolRow {
  // ... existing fields
  category: string  // Will store ToolCategory enum value
  material_feed_length?: number
}

export interface WorkshopToolRow {
  id: string
  workshop_id: string
  tool_id: string
  added_at: string
}
```

## Supabase Service Layer Updates 📋 PENDING

### New Database Helpers

**File: `src/services/supabase.ts`**

```typescript
// Workshop-Tool Association
export const db = {
  // ... existing helpers

  workshopTools: {
    async getForWorkshop(workshopId: string) {
      // Fetch all tools for a workshop with JOIN
    },

    async addToWorkshop(workshopId: string, toolId: string) {
      // Insert into workshop_tools junction table
    },

    async removeFromWorkshop(workshopId: string, toolId: string) {
      // Delete from workshop_tools
    },

    async isInWorkshop(workshopId: string, toolId: string) {
      // Check if tool already in workshop
    }
  },

  tools: {
    async getAll(userId: string) {
      // Fetch user's tool library
    },

    async create(tool: ToolInsert) {
      // Create new tool in library
    },

    async update(id: string, updates: ToolUpdate) {
      // Update existing tool
    },

    async delete(id: string) {
      // Delete tool (cascades to workshop_tools)
    }
  },

  toolTemplates: {
    async getAll() {
      // Fetch all public templates
    },

    async getByCategory(category: ToolCategory) {
      // Filter templates by category
    }
  }
}
```

## Implementation Checklist

### Phase 4A: Database & Types (Day 1) ✅ COMPLETE
- [x] Run database migration script in Supabase
- [x] Create `src/types/toolCategory.ts` with ToolCategory enum
- [x] Update `src/types/database.ts` with new fields
- [x] Update `src/types/index.ts` to export toolCategory
- [x] Seed 13 tool templates in database
- [x] Create cleanup scripts for duplicate templates
- [x] Test: Verify schema changes and RLS policies

### Phase 4B: Service Layer (Day 1) ✅ COMPLETE
- [x] Add `db.workshopTools` helpers to `src/services/supabase.ts`
- [x] `db.tools` CRUD operations (already existed)
- [x] Update `db.toolTemplates` with category filtering and sorting
- [x] Create `src/stores/toolStore.ts` for tool library state
- [x] Test: TypeScript compilation passes

### Phase 4C: /tools Page (Day 2)
- [ ] Create `src/pages/ToolsPage.tsx` - main library page
- [ ] Create `src/components/tools/ToolGrid.tsx` - grid view
- [ ] Create `src/components/tools/ToolCard.tsx` - individual tool display
- [ ] Create `src/components/tools/ToolFormModal.tsx` - create/edit modal
- [ ] Create `src/components/tools/EmptyToolsState.tsx` - first-time state
- [ ] Add route to `src/App.tsx`: `/tools`
- [ ] Test: Create, edit, delete tools from library

### Phase 4D: In-Builder Integration (Day 2-3)
- [ ] Create `src/components/workshops/AddToolModal.tsx` - dual-tab modal
- [ ] Create `src/components/workshops/MyToolsTab.tsx` - tool selection list
- [ ] Create `src/components/workshops/CreateToolTab.tsx` - tool creation form
- [ ] Update `src/pages/WorkshopBuilderPage.tsx` - add "Add Tool" button
- [ ] Create `src/components/workshops/WorkshopToolsList.tsx` - display tools in workshop
- [ ] Test: Add tools to workshop, create new tools from builder

### Phase 4E: Testing & Polish (Day 3)
- [ ] Run `npm run typecheck` - must pass
- [ ] Test tool creation flow from both contexts
- [ ] Test workshop-tool association persistence
- [ ] Verify mobile tool distinction displays correctly
- [ ] Test template selection and customization
- [ ] Verify empty states and error handling
- [ ] Test: Delete tool that's in multiple workshops

## Success Criteria

### Core Functionality
- [ ] Users can create and manage tools in personal library
- [ ] 13 tool templates available with accurate specifications
- [ ] Tool category system works for filtering and organization
- [ ] Material feed length tracked separately from clearances
- [ ] Mobile/stationary distinction clear in UI
- [ ] Tools can be added to workshops via modal
- [ ] Workshop-tool association persists correctly

### User Experience
- [ ] Tool creation takes <2 minutes with templates
- [ ] In-builder tool addition doesn't break flow (modal, not page change)
- [ ] Tool library is easy to browse and search
- [ ] Mobile tool status is clearly indicated
- [ ] Form validation provides helpful feedback

### Technical Quality
- [ ] TypeScript compiles without errors
- [ ] Database migration runs successfully
- [ ] Workshop_tools junction table handles associations correctly
- [ ] Tool data integrates cleanly with existing workshop system
- [ ] Ready for Phase 5 optimization engine consumption

## Dependencies for Phase 5

**Phase 5 will consume:**
- Tool library with category, dimensions, clearances
- Material feed length for workflow optimization
- Mobile/stationary distinction for dual-position optimization
- Workshop-tool associations (which tools to optimize)
- Tool specifications for constraint generation

**Phase 5 will add:**
- Material feed length customization UI
- Workbench size recommendations based on workshop/tools
- Actual layout optimization using tool data

## Key Performance Indicators

- Tool template library: 13 tools with accurate specifications ✓
- Tool entry efficiency: <2 minutes per tool average
- Template usage: 80% of tools created from templates
- Workshop-tool association: <500ms query time
- Zero data loss on tool updates/deletions
