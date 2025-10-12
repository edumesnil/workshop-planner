# Phase 4 Implementation Plan

**Created**: 2025-10-11
**Updated**: 2025-10-12 (Phase 4 Complete)
**Status**: ✅ COMPLETE - All phases finished with design & UX review
**Estimated Duration**: 3 days (completed)

## Overview

This document provides the detailed implementation plan for Phase 4: Tool System. All architectural decisions have been finalized based on project requirements and UX best practices.

## Architectural Decisions Summary

### ✅ Confirmed Decisions

1. **Tool Category Architecture**
   - Dedicated `category` field (enum) for clean organization
   - Separate from `type` field (flexible string for specific models)

2. **Clearance vs Material Feed**
   - `min_clearance`: Safety space (OSHA-based)
   - `material_feed_length`: Max material tool can process
   - These are distinct concepts that affect optimization differently

3. **Mobile Tool Position Storage**
   - Hybrid approach: `default_deployed_position` and `default_parked_position` on tool
   - Actual placements stored in layouts (tool_placements)
   - Optimizer uses defaults as hints, not requirements

4. **Tool-Workshop Association**
   - Junction table pattern (`workshop_tools`)
   - Clean, explicit, extensible
   - Supports future features (assignment notes, primary tool designation)

5. **Tool Addition UX**
   - Dedicated `/tools` page for library management
   - In-builder modal with two tabs (My Tools / Create New Tool)
   - Modal prevents context switching during workshop planning

6. **MVP Tool Templates**
   - 13 tool templates with size variants
   - Research-based dimensions and clearances
   - Power tools + work surfaces (no hand tools for MVP)

7. **Deferred Features**
   - Material feed length customization UI → Phase 5
   - Workbench size recommendations → Phase 5 optimizer
   - Tool import/export → Post-MVP
   - Advanced properties (weight, noise, vibration) → Post-MVP

## Database Migration Script

Save as: `migrations/phase4-tool-system.sql`

```sql
-- Phase 4: Tool System Schema Updates
-- Run Date: 2025-10-11
-- Description: Add category, material_feed_length, and workshop_tools junction table

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

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workshop_tools_workshop
  ON workshop_tools(workshop_id);

CREATE INDEX IF NOT EXISTS idx_workshop_tools_tool
  ON workshop_tools(tool_id);

-- 5. Enable RLS on workshop_tools
ALTER TABLE workshop_tools ENABLE ROW LEVEL SECURITY;

-- 6. RLS policies for workshop_tools
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

-- 7. Update existing tool_templates with categories (if any exist)
-- Run after migration to categorize existing data
-- UPDATE tool_templates SET category = 'power_tools'
--   WHERE name IN ('Table Saw', 'Bandsaw', 'Planer', 'Jointer', 'Router Table', 'Drill Press');
-- UPDATE tool_templates SET category = 'work_surfaces'
--   WHERE name = 'Workbench';
-- UPDATE tool_templates SET category = 'dust_collection'
--   WHERE name = 'Dust Collector';
```

## Implementation Phases

### Phase 4A: Database & Types (Day 1, ~3-4 hours) ✅ COMPLETE

**Goal:** Database schema updated, TypeScript types in place, templates seeded

#### Tasks:

1. **Run Database Migration** ✅
   - [x] Created `migrations/phase4-tool-system.sql`
   - [x] Executed migration in Supabase
   - [x] Verified tables created: `workshop_tools`
   - [x] Verified columns added: `category`, `material_feed_length`
   - [x] RLS policies configured and working

2. **Create TypeScript Types** ✅
   - [x] Created `src/types/toolCategory.ts` with ToolCategory enum + labels
   - [x] Updated `src/types/database.ts`:
     - Added `category: string` to ToolRow/Insert/Update
     - Added `material_feed_length?: number` to ToolRow/Insert/Update
     - Added same fields to ToolTemplateRow/Insert/Update
     - Created WorkshopToolRow/Insert/Update interfaces
     - Added workshop_tools to Database.public.Tables
   - [x] Exported from `src/types/index.ts`

3. **Seed Tool Templates** ✅
   - [x] Created `migrations/seed-tool-templates.sql` with 13 tools
   - [x] Ran seed script in Supabase
   - [x] Encountered duplicates, created `cleanup-duplicate-templates.sql`
   - [x] Created `add-missing-router-table.sql` to fix missing template
   - [x] Verified: 13 unique templates in database

4. **Testing** ✅
   - [x] TypeScript compiles: `npm run typecheck` passes
   - [x] All 13 templates queryable from tool_templates table
   - [x] Junction table ready for Phase 4C/4D

---

### Phase 4B: Service Layer (Day 1, ~2-3 hours) ✅ COMPLETE

**Goal:** Database helpers functional, stores updated

#### Tasks:

1. **Update Supabase Service** (`src/services/supabase.ts`) ✅
   - [x] Add `db.workshopTools` object:
     - `getForWorkshop(workshopId)` - JOIN tools with workshop_tools
     - `addToWorkshop(workshopId, toolId)` - INSERT
     - `removeFromWorkshop(workshopId, toolId)` - DELETE
     - `isInWorkshop(workshopId, toolId)` - EXISTS check
     - `getWorkshopsForTool(toolId)` - Find workshops using a tool
   - [x] `db.tools` object (already existed, verified)
   - [x] Update `db.toolTemplates`:
     - `getByCategory(category)` - filter templates
     - Improved sorting by name within categories

2. **Create Tool Store** (`src/stores/toolStore.ts`) ✅
   - [x] State: tools[], templates[], loading{}, error{}
   - [x] Async Actions:
     - `fetchTools(userId)` - load user library
     - `createTool(tool)` - add to library
     - `removeTool(id)` - delete tool
     - `fetchTemplates()` - load all templates
     - `fetchTemplatesByCategory(category)` - filter templates
   - [x] Sync Actions: setTools, addTool, updateTool, deleteTool
   - [x] Follows Zustand + devtools pattern

3. **Testing** ✅
   - [x] TypeScript compilation passes
   - [x] All types properly imported and exported

---

### Phase 4C: /tools Page (Day 2, ~4-5 hours) ✅ COMPLETE

**Goal:** Dedicated tool library page functional

#### Tasks:

1. **Create Components** ✅
   - [x] `src/pages/ToolsPage.tsx` - Main page layout
   - [x] `src/components/tools/ToolGrid.tsx` - Grid with search and category filtering
   - [x] `src/components/tools/ToolCard.tsx` - Individual tool card
   - [x] `src/components/tools/ToolFormModal.tsx` - Create/edit modal
   - [x] `src/components/tools/EmptyToolsState.tsx` - Empty state

2. **ToolsPage Features** ✅
   - [x] Header: "My Tools" + "Create Tool" button
   - [x] Search input
   - [x] Category filter dropdown
   - [x] Empty state when no tools
   - [x] Loading skeleton

3. **ToolCard Display** ✅
   - [x] Tool name (heading)
   - [x] Dimensions (L×W×H in inches)
   - [x] Category badge (HeroUI Chip)
   - [x] Mobile status indicator (green "Mobile" chip)
   - [x] Edit/Delete buttons
   - [x] Click card → edit modal

4. **ToolFormModal** ✅
   - [x] Two tabs: "From Template" | "Custom Tool"
   - [x] Template tab: grid of 13 templates, click to pre-fill
   - [x] Custom tab: full form
   - [x] Form fields:
     - Name, Category, Type
     - Dimensions (L/W/H)
     - Mobile checkbox
     - Clearances (collapsible "Advanced")
     - Material feed length
     - Power (checkbox + voltage)
     - Dust collection (checkbox)
   - [x] Validation
   - [x] Save → toolStore.createTool() or updateTool()

5. **Add Route** (`src/App.tsx`) ✅
   - [x] Route already existed, updated ToolsPage from placeholder to full implementation

6. **Testing** ✅
   - [x] Create tool from template
   - [x] Create custom tool
   - [x] Edit existing tool
   - [x] Delete tool
   - [x] Search and filter
   - [x] Empty state displays correctly
   - [x] Browser testing verified all functionality

**Additional Work:**
- [x] Created `migrations/fix-tool-category-required.sql` to make category NOT NULL with default
- [x] Added TOOL_CATEGORY_LABELS to `src/types/toolCategory.ts` for string-key access

---

### Phase 4D: In-Builder Integration (Day 2-3, ~5-6 hours) ✅ COMPLETE

**Goal:** Workshop builder can add tools via modal

#### Tasks:

1. **Create Components** ✅
   - [x] `src/components/workshops/AddToolModal.tsx` - Main modal
   - [x] `src/components/workshops/MyToolsTab.tsx` - Tool selection list
   - [x] `src/components/workshops/CreateToolTab.tsx` - Tool creation form
   - [x] `src/components/workshops/WorkshopToolsList.tsx` - Display tools in workshop

2. **AddToolModal Structure** ✅
   - [x] HeroUI Modal (3xl size)
   - [x] Two tabs: "My Tools" | "Create New Tool"
   - [x] Header: "Add Tool to Workshop"

3. **MyToolsTab (Tab 1)** ✅
   - [x] Fetch user's tool library on mount
   - [x] Display tools with checkboxes
   - [x] Checked = tool in workshop (query workshop_tools)
   - [x] Click checkbox:
     - If checked → `db.workshopTools.addToWorkshop()`
     - If unchecked → `db.workshopTools.removeFromWorkshop()`
   - [x] Search/filter within tab
   - [x] Loading state
   - [x] Shows count: "X tools in this workshop"

4. **CreateToolTab (Tab 2)** ✅
   - [x] Template grid at top with all 13 templates
   - [x] Same form fields as /tools page
   - [x] "Save & Add to Workshop" button:
     - Create tool → `db.tools.create()`
     - Add to workshop → `db.workshopTools.addToWorkshop()`
     - Close modal
     - Refresh workshop tools list

5. **WorkshopToolsList Component** ✅
   - [x] Display all tools for current workshop
   - [x] Card layout with tool name, dimensions, mobile status, category
   - [x] Remove button per tool
   - [x] Empty state: "No tools in this workshop yet"
   - [x] Proper handling of nested Supabase query results

6. **Update WorkshopBuilderPage** ✅
   - [x] Add "Add Tool" button in sidebar tools section
   - [x] Button opens AddToolModal
   - [x] Display WorkshopToolsList component
   - [x] Pass workshop ID to components
   - [x] Refresh key pattern for updating after changes

7. **Testing** ✅
   - [x] Add existing tool to workshop
   - [x] Create new tool from builder
   - [x] Remove tool from workshop
   - [x] Tool persists in library after adding to workshop
   - [x] Multiple workshops can reference same tool
   - [x] Browser testing verified all functionality

**Technical Fixes:**
- [x] Fixed nested Supabase query data extraction: `.map(item => item.tool).flat().filter(Boolean)`
- [x] Fixed unused parameter in AddToolModal render function
- [x] TypeScript compilation verified

---

### Phase 4E: Testing & Polish (Day 3, ~2-3 hours) ✅ COMPLETE

**Goal:** All features tested, TypeScript clean, ready for Phase 5

#### Tasks:

1. **TypeScript Validation** ✅
   - [x] Run `npm run typecheck`
   - [x] Fix all type errors
   - [x] Verify no `any` types (except where necessary)

2. **End-to-End Testing** ✅
   - [x] Create tool from /tools page
   - [x] Create tool from workshop builder
   - [x] Edit tool from library
   - [x] Delete tool functionality verified
   - [x] Search and filter tools
   - [x] Add/remove tools from workshop
   - [x] Browser testing completed

3. **UI/UX Polish** ✅
   - [x] Empty states updated with value-driven copy
   - [x] Loading states display correctly
   - [x] Error messages use proper modals (no alert())
   - [x] Mobile tool indicator is clear
   - [x] Form validation working
   - [x] Modal sizes appropriate

4. **Data Validation** ✅
   - [x] Tool dimensions validation working
   - [x] Clearances default to 0
   - [x] Material feed length optional
   - [x] Category required with default
   - [x] Name required

5. **Performance Check** ✅
   - [x] Tool library loads quickly
   - [x] Workshop tools query optimized
   - [x] No unnecessary re-renders

6. **Documentation** ✅
   - [x] Added JSDoc comments to service functions
   - [x] Documented tool category enum
   - [x] Service methods documented

7. **Design & UX Review** ✅
   - [x] Ran comprehensive design review agent
   - [x] Ran UX copywriting review agent
   - [x] Fixed all critical blockers:
     - Replaced 3 alert() calls with proper error displays
     - Made ToolCard keyboard accessible (Enter/Space)
     - Added ARIA labels to all search inputs
   - [x] Applied UX copy improvements:
     - Updated page titles and descriptions
     - Improved modal headers
     - Enhanced empty state messaging
     - Better error message copy
   - [x] Browser tested all improvements

---

## File Structure (New Files)

```
src/
├── types/
│   └── toolCategory.ts                    # NEW: ToolCategory enum
├── stores/
│   └── toolStore.ts                       # NEW: Tool library state management
├── pages/
│   └── ToolsPage.tsx                      # NEW: /tools page
├── components/
│   ├── tools/                             # NEW: Tool library components
│   │   ├── ToolGrid.tsx
│   │   ├── ToolCard.tsx
│   │   ├── ToolFormModal.tsx
│   │   └── EmptyToolsState.tsx
│   └── workshops/                         # EXISTING: Workshop components
│       ├── AddToolModal.tsx               # NEW: In-builder tool modal
│       ├── MyToolsTab.tsx                 # NEW: Tool selection tab
│       ├── CreateToolTab.tsx              # NEW: Tool creation tab
│       └── WorkshopToolsList.tsx          # NEW: Display workshop tools
└── services/
    └── supabase.ts                        # UPDATE: Add tool & workshop_tools helpers
```

## Files to Update

```
src/
├── types/
│   ├── database.ts                        # UPDATE: Add category, material_feed_length, WorkshopToolRow
│   └── index.ts                           # UPDATE: Export toolCategory
├── services/
│   └── supabase.ts                        # UPDATE: Add db.tools, db.workshopTools helpers
├── pages/
│   └── WorkshopBuilderPage.tsx            # UPDATE: Add "Add Tool" button, WorkshopToolsList
└── App.tsx                                # UPDATE: Add /tools route
```

## Testing Checklist

### Database
- [ ] Migration runs without errors
- [ ] workshop_tools table created
- [ ] RLS policies work (users can only see their own data)
- [ ] Cascade deletes work (delete workshop → deletes workshop_tools)

### Tool Library (/tools)
- [ ] Empty state displays when no tools
- [ ] Create tool from template
- [ ] Create custom tool
- [ ] Edit existing tool
- [ ] Delete tool
- [ ] Search tools by name
- [ ] Filter tools by category
- [ ] Grid/list view toggle

### Workshop Builder
- [ ] "Add Tool" modal opens
- [ ] Tab 1: See existing tools
- [ ] Tab 1: Add tool to workshop (checkbox)
- [ ] Tab 1: Remove tool from workshop (uncheck)
- [ ] Tab 2: Create new tool
- [ ] Tab 2: Tool added to library + workshop
- [ ] WorkshopToolsList displays tools
- [ ] Remove tool from workshop works

### Data Persistence
- [ ] Tools persist in library
- [ ] Workshop-tool associations persist
- [ ] Tool edits reflect everywhere
- [ ] Deleting tool removes from workshops (or prevents deletion if in use - TBD)

### TypeScript
- [ ] `npm run typecheck` passes
- [ ] No type errors in IDE
- [ ] Enum values autocomplete

## Success Metrics

- [ ] 13 tool templates seeded in database
- [ ] Users can create tools in <2 minutes
- [ ] Tool library loads in <500ms
- [ ] Workshop-tool queries <300ms
- [ ] Zero TypeScript errors
- [ ] All UI flows tested and working

## Next Steps (Phase 5 Preparation)

After Phase 4 completion, Phase 5 will:
- Consume tool data from workshop_tools junction
- Use clearances for safety constraints
- Use material_feed_length for workflow optimization
- Respect mobile/stationary distinction for placement
- Generate optimized layouts based on tool specifications

Phase 4 ensures all tool data is ready for optimization engine.
