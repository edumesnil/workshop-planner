# Phase 4 Implementation Plan

**Created**: 2025-10-11
**Status**: READY TO START
**Estimated Duration**: 3 days

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

### Phase 4A: Database & Types (Day 1, ~3-4 hours)

**Goal:** Database schema updated, TypeScript types in place, templates seeded

#### Tasks:

1. **Run Database Migration**
   - [ ] Copy migration script to Supabase SQL Editor
   - [ ] Execute migration
   - [ ] Verify tables created: `workshop_tools`
   - [ ] Verify columns added: `category`, `material_feed_length`
   - [ ] Test RLS policies with test user

2. **Create TypeScript Types**
   - [ ] Create `src/types/toolCategory.ts`:
     ```typescript
     export enum ToolCategory {
       POWER_TOOLS = 'power_tools',
       WORK_SURFACES = 'work_surfaces',
       DUST_COLLECTION = 'dust_collection'
     }
     ```
   - [ ] Update `src/types/database.ts`:
     - Add `category: string` to ToolRow/Insert/Update
     - Add `material_feed_length?: number` to ToolRow/Insert/Update
     - Add same fields to ToolTemplateRow/Insert/Update
     - Create `WorkshopToolRow` interface
   - [ ] Export from `src/types/index.ts`

3. **Seed Tool Templates**
   - [ ] Create SQL script with 13 tool INSERT statements
   - [ ] Include all fields: name, category, dimensions, clearances, material_feed_length, power, dust collection, is_mobile
   - [ ] Run in Supabase
   - [ ] Verify: `SELECT * FROM tool_templates`

4. **Testing**
   - [ ] TypeScript compiles: `npm run typecheck`
   - [ ] Query tool_templates from Supabase
   - [ ] Test junction table insert/delete

---

### Phase 4B: Service Layer (Day 1, ~2-3 hours)

**Goal:** Database helpers functional, stores updated

#### Tasks:

1. **Update Supabase Service** (`src/services/supabase.ts`)
   - [ ] Add `db.workshopTools` object:
     - `getForWorkshop(workshopId)` - JOIN tools with workshop_tools
     - `addToWorkshop(workshopId, toolId)` - INSERT
     - `removeFromWorkshop(workshopId, toolId)` - DELETE
     - `isInWorkshop(workshopId, toolId)` - EXISTS check
   - [ ] Add `db.tools` object:
     - `getAll(userId)` - fetch user's library
     - `create(tool)` - insert new tool
     - `update(id, updates)` - update existing
     - `delete(id)` - delete tool
   - [ ] Update `db.toolTemplates`:
     - `getByCategory(category)` - filter templates

2. **Create Tool Store** (`src/stores/toolStore.ts`)
   - [ ] State: `tools: Tool[]`, `loading: boolean`, `error: string | null`
   - [ ] Actions:
     - `fetchTools(userId)` - load user library
     - `createTool(tool)` - add to library
     - `updateTool(id, updates)` - edit tool
     - `deleteTool(id)` - remove tool
   - [ ] Use Zustand pattern like workshopStore

3. **Testing**
   - [ ] Test CRUD operations via browser console
   - [ ] Verify junction table operations
   - [ ] Test category filtering

---

### Phase 4C: /tools Page (Day 2, ~4-5 hours)

**Goal:** Dedicated tool library page functional

#### Tasks:

1. **Create Components**
   - [ ] `src/pages/ToolsPage.tsx` - Main page layout
   - [ ] `src/components/tools/ToolGrid.tsx` - Grid/list view toggle
   - [ ] `src/components/tools/ToolCard.tsx` - Individual tool card
   - [ ] `src/components/tools/ToolFormModal.tsx` - Create/edit modal
   - [ ] `src/components/tools/EmptyToolsState.tsx` - Empty state

2. **ToolsPage Features**
   - [ ] Header: "My Tools" + "Create Tool" button
   - [ ] Search input
   - [ ] Category filter dropdown
   - [ ] Grid/List view toggle
   - [ ] Empty state when no tools
   - [ ] Loading skeleton

3. **ToolCard Display**
   - [ ] Tool name (heading)
   - [ ] Dimensions (L×W×H in inches)
   - [ ] Category badge (HeroUI Chip)
   - [ ] Mobile status indicator (icon/badge)
   - [ ] Edit/Delete buttons
   - [ ] Click card → edit modal

4. **ToolFormModal**
   - [ ] Two tabs: "From Template" | "Custom Tool"
   - [ ] Template tab: grid of 13 templates, click to pre-fill
   - [ ] Custom tab: full form
   - [ ] Form fields:
     - Name, Category, Type
     - Dimensions (L/W/H)
     - Mobile checkbox
     - Clearances (collapsible "Advanced")
     - Material feed length
     - Power (checkbox + voltage)
     - Dust collection (checkbox)
   - [ ] Validation
   - [ ] Save → toolStore.createTool() or updateTool()

5. **Add Route** (`src/App.tsx`)
   - [ ] `<Route path="/tools" element={<ProtectedRoute><ToolsPage /></ProtectedRoute>} />`

6. **Testing**
   - [ ] Create tool from template
   - [ ] Create custom tool
   - [ ] Edit existing tool
   - [ ] Delete tool
   - [ ] Search and filter
   - [ ] Empty state displays correctly

---

### Phase 4D: In-Builder Integration (Day 2-3, ~5-6 hours)

**Goal:** Workshop builder can add tools via modal

#### Tasks:

1. **Create Components**
   - [ ] `src/components/workshops/AddToolModal.tsx` - Main modal
   - [ ] `src/components/workshops/MyToolsTab.tsx` - Tool selection list
   - [ ] `src/components/workshops/CreateToolTab.tsx` - Tool creation form
   - [ ] `src/components/workshops/WorkshopToolsList.tsx` - Display tools in workshop

2. **AddToolModal Structure**
   - [ ] HeroUI Modal (large size, min 600px)
   - [ ] Two tabs: "My Tools" | "Create New Tool"
   - [ ] Header: "Add Tool to Workshop"

3. **MyToolsTab (Tab 1)**
   - [ ] Fetch user's tool library on mount
   - [ ] Display tools with checkboxes
   - [ ] Checked = tool in workshop (query workshop_tools)
   - [ ] Click checkbox:
     - If checked → `db.workshopTools.addToWorkshop()`
     - If unchecked → `db.workshopTools.removeFromWorkshop()`
   - [ ] Search/filter within tab
   - [ ] Loading state

4. **CreateToolTab (Tab 2)**
   - [ ] Reuse ToolFormModal content
   - [ ] "From Template" dropdown at top
   - [ ] Same form fields as /tools page
   - [ ] "Save & Add to Workshop" button:
     - Create tool → `db.tools.create()`
     - Add to workshop → `db.workshopTools.addToWorkshop()`
     - Close modal
     - Refresh workshop tools list

5. **WorkshopToolsList Component**
   - [ ] Display all tools for current workshop
   - [ ] Card layout with tool name, dimensions, mobile status
   - [ ] Remove button per tool
   - [ ] Empty state: "No tools in this workshop yet"

6. **Update WorkshopBuilderPage**
   - [ ] Add "Add Tool" button in header or sidebar
   - [ ] Button opens AddToolModal
   - [ ] Display WorkshopToolsList component
   - [ ] Pass workshop ID to components

7. **Testing**
   - [ ] Add existing tool to workshop
   - [ ] Create new tool from builder
   - [ ] Remove tool from workshop
   - [ ] Tool persists in library after adding to workshop
   - [ ] Multiple workshops can reference same tool

---

### Phase 4E: Testing & Polish (Day 3, ~2-3 hours)

**Goal:** All features tested, TypeScript clean, ready for Phase 5

#### Tasks:

1. **TypeScript Validation**
   - [ ] Run `npm run typecheck`
   - [ ] Fix all type errors
   - [ ] Verify no `any` types (except where necessary)

2. **End-to-End Testing**
   - [ ] Create tool from /tools page
   - [ ] Create tool from workshop builder
   - [ ] Edit tool from library
   - [ ] Delete tool that's in multiple workshops (verify cascade doesn't delete workshop_tools)
   - [ ] Search and filter tools
   - [ ] Add/remove tools from workshop
   - [ ] Verify workshop-tool associations persist after page reload

3. **UI/UX Polish**
   - [ ] Empty states have helpful text
   - [ ] Loading states display correctly
   - [ ] Error messages are user-friendly
   - [ ] Mobile tool indicator is clear
   - [ ] Form validation provides helpful feedback
   - [ ] Modal sizes are appropriate

4. **Data Validation**
   - [ ] Tool dimensions must be positive
   - [ ] Clearances default to 0 if not specified
   - [ ] Material feed length is optional
   - [ ] Category is required
   - [ ] Name is required

5. **Performance Check**
   - [ ] Tool library loads in <500ms
   - [ ] Workshop tools query is fast (<300ms)
   - [ ] No unnecessary re-renders

6. **Documentation**
   - [ ] Add JSDoc comments to service functions
   - [ ] Document tool category enum
   - [ ] Update README if needed

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
