# Phase 3A: Workshop Management (CRUD)

**Duration**: Week 3-4
**Status**: IN PROGRESS

## Overview

Build the workshop CRUD system with text-based constraint entry. This phase establishes workshop data management foundation without complex visual editing. Phase 3B will add interactive 2D floor plan editor.

## Prerequisites from Previous Phases
- ✅ Database schema with workshops table (Phase 2)
- ✅ Authentication system (Phase 2)
- ✅ Research-based constraint data (Phase 1)
- ✅ HeroUI component library integrated (Phase 2)
- ✅ WorkshopStore with Zustand (Phase 2)
- ✅ Supabase database helpers (Phase 2)

## Scope Clarification

**Phase 3A (This Phase):**
- Workshop library and CRUD operations
- Text-based constraint forms
- Workshop detail page with tabs
- Type definitions for constraints
- **NO visual 2D editor** - deferred to Phase 3B

**Phase 3B (Separate Phase):**
- Canvas-based 2D floor plan renderer
- Interactive wall selection
- Drag-drop obstacle placement
- Zoom/pan controls

## Workshop Library & Management UI 📋 IN PROGRESS

### Workshop Library Page (`/workshops`)

**Components to Create:**
- `src/pages/WorkshopsPage.tsx` - Replace stub with full library
- `src/components/workshops/WorkshopCard.tsx` - Grid item for each workshop
- `src/components/workshops/WorkshopGrid.tsx` - Responsive grid layout
- `src/components/workshops/EmptyWorkshopsState.tsx` - First-time user state

**Features:**
- [ ] Fetch user workshops from Supabase on mount
- [ ] Grid display with workshop cards
  - Workshop name and description
  - Dimensions (L×W×H in feet)
  - Last updated timestamp
  - Constraint count (walls + obstacles)
  - Tool count (if associated)
- [ ] "Create Workshop" button → opens modal
- [ ] Edit/delete actions per workshop card
- [ ] Loading state with skeleton cards
- [ ] Empty state with helpful guidance
- [ ] Error handling with recovery options

**UX Copywriting:**
- Empty state: Use VOICE method (Value-driven, Clear, Empathetic)
- Error messages: 4 H's framework (Human, Helpful, Humble, Humorous when appropriate)
- Button labels: Action-oriented, max 2-3 words

### Workshop Form Modal

**Components to Create:**
- `src/components/workshops/WorkshopFormModal.tsx` - Create/edit modal
- `src/components/workshops/WorkshopForm.tsx` - Form component

**Form Fields:**
- [ ] Workshop name (required, text input)
- [ ] Description (optional, textarea)
- [ ] Dimensions (length, width, height in inches - show feet conversion)
- [ ] Template selection (optional - auto-fill dimensions)
  - Small Garage (20' × 10')
  - Medium Garage (24' × 20')
  - Large Garage (30' × 24')
  - Basement Workshop (17.75' × 8.58' - Eric's default)
  - Custom

**Validation:**
- [ ] Name: Required, 1-100 characters
- [ ] Dimensions: Required, positive numbers, reasonable limits
  - Min: 60" (5 feet)
  - Max: 1200" (100 feet)
- [ ] Clear error messages with recovery guidance
- [ ] Real-time validation feedback

**HeroUI Components:**
- `Modal` for create/edit dialog
- `Input` for text fields
- `Textarea` for description
- `Select` for template selection
- `Button` for actions (Save, Cancel)

### Workshop Deletion

**Components to Create:**
- `src/components/workshops/DeleteConfirmModal.tsx` - Deletion confirmation

**Features:**
- [ ] Confirmation modal with clear warning
- [ ] Show workshop name being deleted
- [ ] Warn about associated data (tools, layouts)
- [ ] Two-button confirmation (Cancel, Delete)
- [ ] Destructive button styling (`color="danger"`)
- [ ] Success toast after deletion

**UX Copy:**
- Warning text: Clear, non-alarmist, explains consequences
- Button labels: "Cancel" vs "Delete Workshop" (specific action)

## Workshop Detail Page (`/workshops/:id`) 📋 IN PROGRESS

### Page Structure

**Components to Create:**
- `src/pages/WorkshopDetailPage.tsx` - Main detail view
- `src/components/workshops/WorkshopHeader.tsx` - Header with actions
- `src/components/workshops/WorkshopTabs.tsx` - Tabbed interface

**Route:**
- `/workshops/:id` - Dynamic route with workshop ID

**Header:**
- [ ] Workshop name (editable inline or via modal)
- [ ] Breadcrumb: Workshops > [Workshop Name]
- [ ] Action buttons:
  - Edit Workshop (opens form modal)
  - Delete Workshop (opens confirmation)
  - Generate Layout (disabled, Phase 5)

**Tabs:**
- [ ] Overview - Workshop details and statistics
- [ ] Constraints - Wall and obstacle configuration
- [ ] Tools - Associated tools (Phase 4 - placeholder for now)

### Overview Tab

**Components to Create:**
- `src/components/workshops/OverviewTab.tsx`

**Content:**
- [ ] Dimensions card (L×W×H with unit toggle)
- [ ] Description (if provided)
- [ ] Statistics:
  - Created date
  - Last updated
  - Constraint count
  - Tool count (0 for now)
  - Floor area (calculated from dimensions)
- [ ] Workshop metadata in cards using HeroUI `Card` component

### Constraints Tab

**Components to Create:**
- `src/components/workshops/ConstraintsTab.tsx`
- `src/components/workshops/WallConstraintForm.tsx`
- `src/components/workshops/ObstacleForm.tsx`
- `src/components/workshops/ConstraintsList.tsx`

**Wall Constraint Form:**
- [ ] Four wall sections (North, South, East, West)
- [ ] Per-wall configuration:
  - Wall type selector (dropdown)
    - Open (no constraints)
    - Window
    - Door/Entrance
    - Electrical Panel
    - Utilities (water heater, HVAC)
    - Storage/Shelving
  - Position along wall (inches from start)
  - Width (inches)
  - Clearance required (inches into room)
  - Notes (optional)
- [ ] Add/remove multiple items per wall
- [ ] Visual indicator of which wall (N/S/E/W label)

**Obstacle Form:**
- [ ] Obstacle list with add/edit/delete
- [ ] Per-obstacle fields:
  - Name (e.g., "Water Heater", "Support Post")
  - Position (x, y coordinates in inches)
  - Dimensions (length, width, height in inches)
  - Fixed (boolean - can optimizer move it?)
  - Notes (optional)
- [ ] Clear indication of position (coordinate system explanation)
- [ ] Validation: obstacles must fit within workshop dimensions

**UI Pattern:**
- Accordion-style sections for each wall
- Table or card list for obstacles
- Inline add/edit forms or modal forms
- Clear save state indication

## Type Definitions & Data Model 📋 IN PROGRESS

### Constraint Type Definitions

**File to Create:**
- `src/types/constraints.ts`

```typescript
export enum WallSide {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west'
}

export enum WallType {
  OPEN = 'open',
  WINDOW = 'window',
  DOOR = 'door',
  ELECTRICAL = 'electrical',
  UTILITIES = 'utilities',
  STORAGE = 'storage'
}

export interface WallConstraint {
  id: string
  wall: WallSide
  type: WallType
  position: number // inches from wall start
  width: number // inches along wall
  clearance: number // inches into room
  notes?: string
}

export interface Obstacle {
  id: string
  name: string
  position: { x: number, y: number } // inches
  dimensions: {
    length: number // inches
    width: number // inches
    height: number // inches
  }
  fixed: boolean // can optimization move it?
  notes?: string
}

export interface WorkshopConstraints {
  walls: WallConstraint[]
  obstacles: Obstacle[]
}
```

### Update Workshop Type

**File to Update:**
- `src/types/workshop.ts`

```typescript
import { WorkshopConstraints } from './constraints'

export interface Workshop {
  id: string
  name: string
  description?: string
  dimensions: Dimensions
  constraints: WorkshopConstraints // Changed from any[]
  createdAt: Date
  updatedAt: Date
}
```

### Database Schema Alignment

**Database Field:**
- `workshops.constraints` (JSONB in PostgreSQL)
- Stores `WorkshopConstraints` structure
- Default value: `{ walls: [], obstacles: [] }`

## Store Integration 📋 IN PROGRESS

### WorkshopStore Enhancements

**File to Update:**
- `src/stores/workshopStore.ts`

**New Actions:**
- [ ] `fetchWorkshops(userId: string)` - Load workshops from Supabase
- [ ] `createWorkshop(data: WorkshopInsert)` - Create new workshop
- [ ] `updateWorkshop(id: string, updates: WorkshopUpdate)` - Update existing
- [ ] `deleteWorkshop(id: string)` - Delete workshop
- [ ] `addWallConstraint(workshopId: string, constraint: WallConstraint)` - Add wall item
- [ ] `removeWallConstraint(workshopId: string, constraintId: string)` - Remove wall item
- [ ] `addObstacle(workshopId: string, obstacle: Obstacle)` - Add obstacle
- [ ] `removeObstacle(workshopId: string, obstacleId: string)` - Remove obstacle
- [ ] `updateConstraints(workshopId: string, constraints: WorkshopConstraints)` - Bulk update

**Integration Pattern:**
- Store calls Supabase via `db.workshops` helpers
- Optimistic updates for better UX
- Error handling with rollback on failure
- Loading states for async operations

## Navigation & Routing 📋 IN PROGRESS

### Route Updates

**File to Update:**
- `src/App.tsx`

**New Routes:**
```typescript
<Route path="/workshops" element={<ProtectedRoute><WorkshopsPage /></ProtectedRoute>} />
<Route path="/workshops/:id" element={<ProtectedRoute><WorkshopDetailPage /></ProtectedRoute>} />
```

### Navigation Links

**File to Update:**
- `src/components/Navigation.tsx`

**Updates:**
- [ ] Highlight active workshop in navigation
- [ ] "Workshops" link always visible
- [ ] Current workshop indicator (if selected)

## Design System Integration 📋 IN PROGRESS

### HeroUI Component Usage

**Components to Use:**
- `Card`, `CardHeader`, `CardBody` - Workshop cards and sections
- `Modal`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter` - Forms and confirmations
- `Tabs`, `Tab` - Workshop detail tabs
- `Input`, `Textarea`, `Select` - Form fields
- `Button` - Actions (primary, danger, default variants)
- `Table` - Obstacle lists
- `Accordion` - Wall sections
- `Chip` - Tags and labels
- `Divider` - Section separators
- `Spinner` - Loading states
- `Skeleton` - Loading skeletons

### UX Copywriting Integration

**Apply Frameworks:**
- **Empty States:** VOICE method - explain value, provide clear next action
- **Error Messages:** 4 H's framework
  - Human: "We couldn't save your workshop"
  - Helpful: "Check your connection and try again"
  - Humble: "This is on us" (when appropriate)
  - Humorous: Avoid in this phase (professional context)
- **Form Instructions:** Progressive disclosure, contextual help
- **Button Labels:** Action-oriented, specific ("Save Workshop" not "Submit")
- **Loading States:** Informative text ("Loading workshops...")

**Copy Review:**
- [ ] Use `/copy-review` agent for all interface text
- [ ] Provide context: user situation, task complexity, emotional state
- [ ] Test comprehension: 8th-grade reading level
- [ ] Accessibility: descriptive link text, ARIA labels

### Accessibility Requirements

**WCAG 2.2 AA Compliance:**
- [ ] Keyboard navigation for all interactions
- [ ] Focus states visible (2px outline, 2px offset)
- [ ] Color not sole indicator of information
- [ ] Form labels properly associated with inputs
- [ ] Error messages announced to screen readers
- [ ] 44px minimum touch targets
- [ ] 4.5:1 contrast ratio for text

**Screen Reader Support:**
- [ ] Semantic HTML (headings, landmarks, lists)
- [ ] ARIA labels for custom components
- [ ] Alternative text for icons
- [ ] Form validation announcements

## Testing & Validation 📋 PENDING

### Functional Testing
- [ ] Workshop CRUD operations work correctly
- [ ] Constraint add/edit/delete functions properly
- [ ] Form validation catches errors
- [ ] Data persists in Supabase
- [ ] Loading states display appropriately
- [ ] Error states show recovery guidance

### TypeScript Validation
- [ ] Run `npm run typecheck` - must pass
- [ ] No `any` types except where necessary
- [ ] Constraint types properly structured
- [ ] Database types match Supabase schema

### UX Testing
- [ ] Workshop creation time <3 minutes
- [ ] Constraint entry is intuitive
- [ ] Error messages are clear and helpful
- [ ] Empty states guide users effectively
- [ ] Navigation is logical and predictable

### Design Review
- [ ] Use `/design-review` agent for comprehensive review
- [ ] Verify HeroUI component usage consistency
- [ ] Check accessibility compliance
- [ ] Validate interaction patterns
- [ ] Test responsive behavior (desktop/tablet focus)

## Success Criteria

### Core Functionality
- [ ] Users can create workshops in <3 minutes
- [ ] Users can add/edit/delete workshops successfully
- [ ] Users can configure wall constraints via forms
- [ ] Users can add obstacles with positions and dimensions
- [ ] Data persists correctly across sessions
- [ ] Workshop library displays all user workshops

### User Experience
- [ ] Workshop creation flow is self-explanatory
- [ ] Constraint forms are clear and validated
- [ ] Error messages guide users to resolution
- [ ] Empty states provide helpful next steps
- [ ] Loading states prevent user confusion

### Technical Performance
- [ ] TypeScript compiles without errors
- [ ] Workshop list loads in <500ms
- [ ] Workshop data stays within 5KB per workshop
- [ ] Store actions complete without errors
- [ ] Database operations handle failures gracefully

### Design Quality
- [ ] HeroUI components used consistently
- [ ] WCAG 2.2 AA compliance verified
- [ ] UX copywriting frameworks applied
- [ ] Desktop-optimized layout (tablet+ focus)
- [ ] Clean, modern, architectural aesthetic

## Dependencies for Next Phase

**Phase 3B (2D Floor Plan Editor):**
- Workshop data models with constraints (from 3A)
- Constraint type definitions (from 3A)
- Workshop detail page structure (from 3A)
- Visual representation replaces text forms

**Phase 4 (Tool System):**
- Workshop data for tool associations
- Workshop dimensions for tool placement validation
- Workshop selection for tool assignment

**Phase 5 (Optimization Engine):**
- Workshop constraints for layout generation
- Wall and obstacle data for collision detection
- Workshop dimensions for boundary constraints

## Implementation Checklist

### File Creation
- [ ] `src/pages/WorkshopsPage.tsx`
- [ ] `src/pages/WorkshopDetailPage.tsx`
- [ ] `src/components/workshops/WorkshopCard.tsx`
- [ ] `src/components/workshops/WorkshopGrid.tsx`
- [ ] `src/components/workshops/WorkshopFormModal.tsx`
- [ ] `src/components/workshops/WorkshopForm.tsx`
- [ ] `src/components/workshops/DeleteConfirmModal.tsx`
- [ ] `src/components/workshops/EmptyWorkshopsState.tsx`
- [ ] `src/components/workshops/WorkshopHeader.tsx`
- [ ] `src/components/workshops/WorkshopTabs.tsx`
- [ ] `src/components/workshops/OverviewTab.tsx`
- [ ] `src/components/workshops/ConstraintsTab.tsx`
- [ ] `src/components/workshops/WallConstraintForm.tsx`
- [ ] `src/components/workshops/ObstacleForm.tsx`
- [ ] `src/components/workshops/ConstraintsList.tsx`
- [ ] `src/types/constraints.ts`

### File Updates
- [ ] `src/types/workshop.ts` - Update constraints type
- [ ] `src/stores/workshopStore.ts` - Add constraint actions
- [ ] `src/App.tsx` - Add routes
- [ ] `src/components/Navigation.tsx` - Update navigation

### Documentation
- [ ] Update README.md with Phase 3A completion
- [ ] Document constraint data model in comments
- [ ] Add UX copywriting decisions to documentation

## Estimated Effort

**Total Lines of Code:** ~600-800 lines
**Estimated Time:** 1-2 days focused work
**Components:** 15 new files + 4 file updates
**Complexity:** Medium (CRUD operations, forms, type definitions)

## Notes

- **Desktop-first:** Optimize for desktop/tablet, mobile not a priority
- **HeroUI defaults:** Use component library as-is, no custom theming yet
- **UX frameworks:** Apply copywriting frameworks via `/copy-review` agent
- **No 2D editor:** Text-based constraint entry only, visual editor in Phase 3B
- **Foundation focus:** Clean CRUD implementation for Phase 5 optimization engine
