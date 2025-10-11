# Phase 3A Implementation Plan

**Status:** Ready to Execute
**Created:** 2025-10-10
**Estimated Duration:** 1-2 days

## Executive Summary

This document provides step-by-step implementation guidance for Phase 3A: Workshop Management (CRUD). Focus is on clean CRUD operations with text-based constraint entry, HeroUI components, and UX copywriting frameworks.

---

## Prerequisites Checklist

✅ All prerequisites met:
- Phase 1 research data and constraint system complete
- Phase 2 auth, database, and onboarding complete
- HeroUI integrated (@heroui/react v2.8.5)
- Zustand stores configured (WorkshopStore, AuthStore)
- Supabase helpers in place (db.workshops, db.tools)
- Type definitions for Workshop, Tool, Layout

---

## Implementation Order

Execute in this order to maintain clean dependency flow and enable incremental testing:

### **Stage 1: Type Definitions** (Foundation)
1. Create constraint types (`src/types/constraints.ts`)
2. Update workshop types (`src/types/workshop.ts`)
3. Run typecheck to verify no regressions

### **Stage 2: Workshop Library** (Core CRUD - List/Create/Delete)
4. Create WorkshopsPage (replace stub)
5. Create WorkshopCard component
6. Create WorkshopGrid component
7. Create EmptyWorkshopsState component
8. Create WorkshopFormModal + WorkshopForm
9. Create DeleteConfirmModal
10. Update Navigation to link to workshops
11. Test: workshop list, create, delete workflows

### **Stage 3: Workshop Detail** (Read/Update)
12. Create WorkshopDetailPage with routing
13. Create WorkshopHeader component
14. Create WorkshopTabs component
15. Create OverviewTab component
16. Update routes in App.tsx
17. Test: navigation, detail view, breadcrumbs

### **Stage 4: Constraints Management** (Advanced CRUD)
18. Create ConstraintsTab component
19. Create WallConstraintForm component
20. Create ObstacleForm component
21. Create ConstraintsList component
22. Update WorkshopStore with constraint actions
23. Test: add/edit/delete walls and obstacles

### **Stage 5: UX Polish & Review**
24. Apply `/copy-review` agent to all interface text
25. Apply `/design-review` agent for accessibility and consistency
26. Final typecheck and testing
27. Commit to git

---

## Detailed Implementation Guide

### **Stage 1: Type Definitions**

#### File 1: `src/types/constraints.ts`

**Purpose:** Define WorkshopConstraints structure for walls and obstacles.

**Implementation:**

```typescript
// src/types/constraints.ts

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
  position: { x: number, y: number } // inches from origin (bottom-left)
  dimensions: {
    length: number // inches (X axis)
    width: number // inches (Y axis)
    height: number // inches (Z axis)
  }
  fixed: boolean // can optimization engine move it?
  notes?: string
}

export interface WorkshopConstraints {
  walls: WallConstraint[]
  obstacles: Obstacle[]
}
```

**Testing:**
- Run `npm run typecheck`
- Verify no errors

#### File 2: Update `src/types/workshop.ts`

**Changes:**

```typescript
// Add import at top
import { WorkshopConstraints } from './constraints'

// Update Workshop interface
export interface Workshop {
  id: string
  name: string
  description?: string // Add optional description field
  dimensions: Dimensions
  constraints: WorkshopConstraints // Changed from any[]
  createdAt: Date
  updatedAt: Date
}
```

**Testing:**
- Run `npm run typecheck`
- Fix any type errors in existing files

---

### **Stage 2: Workshop Library**

#### File 3: `src/pages/WorkshopsPage.tsx`

**Purpose:** Main workshop library page with grid view, create button, loading/error/empty states.

**Implementation:**

```typescript
import { useEffect, useState } from 'react'
import { Button, Spinner } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useWorkshopStore } from '@/stores/workshopStore'
import { db } from '@/services/supabase'
import { WorkshopGrid } from '@/components/workshops/WorkshopGrid'
import { WorkshopFormModal } from '@/components/workshops/WorkshopFormModal'
import { EmptyWorkshopsState } from '@/components/workshops/EmptyWorkshopsState'

export function WorkshopsPage() {
  const { user } = useAuthStore()
  const { workshops, setWorkshops, setLoading } = useWorkshopStore()
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    loadWorkshops()
  }, [user])

  const loadWorkshops = async () => {
    if (!user) return

    setLoading('workshops', true)
    setError(null)

    try {
      const { data, error } = await db.workshops.getAll(user.id)
      if (error) throw error

      // Transform database rows to Workshop type
      const transformed = (data || []).map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        dimensions: row.dimensions,
        constraints: row.constraints || { walls: [], obstacles: [] },
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }))

      setWorkshops(transformed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workshops')
    } finally {
      setLoading('workshops', false)
    }
  }

  const loading = useWorkshopStore(state => state.loading.workshops)

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" label="Loading workshops..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p className="text-danger-800 font-medium">Unable to load workshops</p>
          <p className="text-danger-600 text-sm mt-1">{error}</p>
          <Button color="danger" variant="flat" size="sm" className="mt-3" onPress={loadWorkshops}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workshops</h1>
          <p className="text-default-500 mt-1">
            Manage your workshop spaces and configurations
          </p>
        </div>
        <Button color="primary" onPress={() => setIsFormOpen(true)}>
          Create Workshop
        </Button>
      </div>

      {workshops.length === 0 ? (
        <EmptyWorkshopsState onCreateClick={() => setIsFormOpen(true)} />
      ) : (
        <WorkshopGrid workshops={workshops} onRefresh={loadWorkshops} />
      )}

      <WorkshopFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false)
          loadWorkshops()
        }}
      />
    </div>
  )
}
```

**Dependencies:** WorkshopGrid, WorkshopFormModal, EmptyWorkshopsState (create next)

#### File 4: `src/components/workshops/EmptyWorkshopsState.tsx`

**Purpose:** Empty state guidance when user has no workshops yet.

**UX Copywriting:** Use VOICE method - Value-driven, Clear, Empathetic.

```typescript
import { Card, CardBody, Button } from '@heroui/react'

interface EmptyWorkshopsStateProps {
  onCreateClick: () => void
}

export function EmptyWorkshopsState({ onCreateClick }: EmptyWorkshopsStateProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardBody className="text-center p-12">
        <div className="mb-4">
          {/* Icon placeholder - could use heroicons or lucide-react */}
          <div className="w-16 h-16 mx-auto bg-default-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">🏗️</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Create Your First Workshop</h2>
        <p className="text-default-600 mb-6 max-w-md mx-auto">
          Define your workshop space to get started with layout optimization.
          Add dimensions, walls, and obstacles to generate efficient tool placements.
        </p>
        <Button color="primary" size="lg" onPress={onCreateClick}>
          Create Workshop
        </Button>
        <p className="text-sm text-default-400 mt-4">
          Takes less than 3 minutes to set up
        </p>
      </CardBody>
    </Card>
  )
}
```

**Copy Review:** Submit to `/copy-review` agent after implementation.

#### File 5: `src/components/workshops/WorkshopCard.tsx`

**Purpose:** Single workshop card in grid, shows key info and actions.

```typescript
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { Workshop } from '@/types/workshop'
import { fromInches } from '@/utils/units'

interface WorkshopCardProps {
  workshop: Workshop
  onEdit: (workshop: Workshop) => void
  onDelete: (workshop: Workshop) => void
}

export function WorkshopCard({ workshop, onEdit, onDelete }: WorkshopCardProps) {
  const navigate = useNavigate()

  const lengthFt = fromInches(workshop.dimensions.length, 'feet')
  const widthFt = fromInches(workshop.dimensions.width, 'feet')
  const heightFt = fromInches(workshop.dimensions.height, 'feet')

  const constraintCount =
    workshop.constraints.walls.length +
    workshop.constraints.obstacles.length

  const lastUpdated = new Date(workshop.updatedAt).toLocaleDateString()

  return (
    <Card isPressable onPress={() => navigate(`/workshops/${workshop.id}`)}>
      <CardHeader className="flex flex-col items-start gap-1 pb-0">
        <h3 className="text-lg font-semibold">{workshop.name}</h3>
        {workshop.description && (
          <p className="text-sm text-default-500 line-clamp-2">
            {workshop.description}
          </p>
        )}
      </CardHeader>
      <CardBody className="pt-3">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-default-600">Dimensions:</span>
            <span className="font-medium">
              {lengthFt.toFixed(1)}' × {widthFt.toFixed(1)}' × {heightFt.toFixed(1)}'
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-default-600">Constraints:</span>
            <Chip size="sm" variant="flat">
              {constraintCount}
            </Chip>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-default-600">Last updated:</span>
            <span className="text-default-500">{lastUpdated}</span>
          </div>
        </div>
      </CardBody>
      <CardFooter className="gap-2">
        <Button
          size="sm"
          variant="flat"
          className="flex-1"
          onPress={(e) => {
            e.stopPropagation()
            onEdit(workshop)
          }}
        >
          Edit
        </Button>
        <Button
          size="sm"
          color="danger"
          variant="light"
          onPress={(e) => {
            e.stopPropagation()
            onDelete(workshop)
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
```

**Note:** `fromInches` utility likely exists in `src/utils/units.ts` from Phase 2 onboarding.

#### File 6: `src/components/workshops/WorkshopGrid.tsx`

**Purpose:** Grid layout container with workshop cards and modals for edit/delete.

```typescript
import { useState } from 'react'
import { Workshop } from '@/types/workshop'
import { WorkshopCard } from './WorkshopCard'
import { WorkshopFormModal } from './WorkshopFormModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'

interface WorkshopGridProps {
  workshops: Workshop[]
  onRefresh: () => void
}

export function WorkshopGrid({ workshops, onRefresh }: WorkshopGridProps) {
  const [editWorkshop, setEditWorkshop] = useState<Workshop | null>(null)
  const [deleteWorkshop, setDeleteWorkshop] = useState<Workshop | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop) => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            onEdit={setEditWorkshop}
            onDelete={setDeleteWorkshop}
          />
        ))}
      </div>

      <WorkshopFormModal
        isOpen={!!editWorkshop}
        workshop={editWorkshop}
        onClose={() => setEditWorkshop(null)}
        onSuccess={() => {
          setEditWorkshop(null)
          onRefresh()
        }}
      />

      <DeleteConfirmModal
        isOpen={!!deleteWorkshop}
        workshop={deleteWorkshop}
        onClose={() => setDeleteWorkshop(null)}
        onSuccess={() => {
          setDeleteWorkshop(null)
          onRefresh()
        }}
      />
    </>
  )
}
```

#### Files 7 & 8: `WorkshopFormModal.tsx` and `WorkshopForm.tsx`

See [phase-3-workshop-management.md](phases/phase-3-workshop-management.md) for full specification. Key points:

- Modal wraps form component
- Form fields: name, description, dimensions (with template dropdown)
- Use HeroUI `Input`, `Textarea`, `Select`
- Validation: required name, positive dimensions
- Call `/copy-review` agent for form labels and error messages

#### File 9: `DeleteConfirmModal.tsx`

**Purpose:** Confirmation dialog for workshop deletion.

**UX Copywriting:** 4 H's framework - Human, Helpful (explain consequences), Humble (clear warning).

```typescript
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'
import { useState } from 'react'
import { Workshop } from '@/types/workshop'
import { useAuthStore } from '@/stores/authStore'
import { db } from '@/services/supabase'

interface DeleteConfirmModalProps {
  isOpen: boolean
  workshop: Workshop | null
  onClose: () => void
  onSuccess: () => void
}

export function DeleteConfirmModal({ isOpen, workshop, onClose, onSuccess }: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!workshop) return

    setLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await db.workshops.delete(workshop.id)
      if (deleteError) throw deleteError

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workshop')
    } finally {
      setLoading(false)
    }
  }

  if (!workshop) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Delete Workshop</ModalHeader>
        <ModalBody>
          <p className="text-default-700">
            Are you sure you want to delete <strong>{workshop.name}</strong>?
          </p>
          <p className="text-default-600 text-sm mt-2">
            This will permanently remove this workshop, including all wall constraints and obstacles.
            Any layouts generated for this workshop will also be deleted.
          </p>
          {error && (
            <p className="text-danger text-sm mt-3">{error}</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button color="danger" onPress={handleDelete} isLoading={loading}>
            Delete Workshop
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
```

**Testing Stage 2:**
- Navigate to `/workshops`
- See empty state if no workshops
- Click "Create Workshop"
- Fill form and save
- Verify workshop appears in grid
- Edit workshop
- Delete workshop with confirmation

---

### **Stage 3: Workshop Detail**

#### File 10: `src/pages/WorkshopDetailPage.tsx`

**Purpose:** Detail view for a single workshop with tabs (Overview, Constraints, Tools).

**Implementation:** See full spec in phase-3-workshop-management.md. Key structure:

```typescript
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Workshop } from '@/types/workshop'
import { db } from '@/services/supabase'
import { WorkshopHeader } from '@/components/workshops/WorkshopHeader'
import { WorkshopTabs } from '@/components/workshops/WorkshopTabs'

export function WorkshopDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadWorkshop()
  }, [id])

  const loadWorkshop = async () => {
    // Fetch workshop by ID from Supabase
    // Transform to Workshop type
    // Set loading/error states
  }

  if (loading) return <Spinner />
  if (error) return <ErrorDisplay />
  if (!workshop) return <NotFound />

  return (
    <div className="container mx-auto p-6">
      <WorkshopHeader workshop={workshop} onUpdate={loadWorkshop} />
      <WorkshopTabs workshop={workshop} onUpdate={loadWorkshop} />
    </div>
  )
}
```

#### Files 11-13: `WorkshopHeader.tsx`, `WorkshopTabs.tsx`, `OverviewTab.tsx`

See phase-3-workshop-management.md for specifications. Key points:

- Header: Breadcrumb, workshop name, action buttons
- Tabs: HeroUI `Tabs` component with Overview/Constraints/Tools tabs
- OverviewTab: Display dimensions, description, statistics in cards

---

### **Stage 4: Constraints Management**

#### File 14: `src/components/workshops/ConstraintsTab.tsx`

**Purpose:** Container for wall and obstacle constraint forms.

**Implementation:** Two-column layout:
- Left: Wall constraint sections (accordion-style, one per wall)
- Right: Obstacle list with add/edit forms

Use HeroUI `Accordion` for walls, `Table` or `Card` list for obstacles.

#### Files 15-17: Constraint Forms

See phase-3-workshop-management.md for full specs. Key components:

- `WallConstraintForm.tsx` - Form for adding/editing wall constraints
- `ObstacleForm.tsx` - Form for adding/editing obstacles
- `ConstraintsList.tsx` - Read-only list view of all constraints

**UX Copy:** Use `/copy-review` agent for:
- Form field labels
- Help text (e.g., "Position is measured from the west wall in inches")
- Validation error messages (4 H's framework)

#### File 18: Update `src/stores/workshopStore.ts`

**Add Constraint Actions:**

```typescript
// Add to WorkshopStore interface
addWallConstraint: (workshopId: string, constraint: WallConstraint) => Promise<void>
removeWallConstraint: (workshopId: string, constraintId: string) => Promise<void>
addObstacle: (workshopId: string, obstacle: Obstacle) => Promise<void>
removeObstacle: (workshopId: string, obstacleId: string) => Promise<void>
updateConstraints: (workshopId: string, constraints: WorkshopConstraints) => Promise<void>
```

**Implementation:**
- Optimistic updates to local state
- Call `db.workshops.update(id, { constraints: newConstraints })`
- Rollback on error

---

### **Stage 5: UX Polish & Review**

#### Task 24: Apply `/copy-review` Agent

**Process:**
1. Collect all interface text into a document:
   - Button labels
   - Form labels and placeholders
   - Error messages
   - Empty state copy
   - Success messages
   - Modal headings
2. Execute: `/copy-review` with context
   - User situation: Managing workshop spaces for optimization
   - Task complexity: Medium (technical but guided)
   - Emotional state: Focused, goal-oriented
3. Apply recommendations
4. Re-review changed copy

**Frameworks to Apply:**
- **VOICE method:** Value-driven, Occasion-appropriate, Inclusive, Clear, Empathetic
- **4 H's for errors:** Human, Helpful, Humble, Humorous (where appropriate)
- **Button labels:** Action-oriented, specific (max 2-3 words)

#### Task 25: Apply `/design-review` Agent

**Process:**
1. Execute: `/design-review` on all new components
2. Review checklist:
   - HeroUI component usage consistency
   - WCAG 2.2 AA compliance (contrast, keyboard nav, focus states)
   - Interaction patterns (hover, active, loading states)
   - Typography hierarchy
   - Spacing (follows 4/8px grid)
3. Fix flagged issues
4. Re-review

#### Task 26: Final Testing

**Checklist:**
- [ ] `npm run typecheck` passes
- [ ] All CRUD operations work (create, read, update, delete)
- [ ] Constraints can be added, edited, deleted
- [ ] Form validation works correctly
- [ ] Error states show helpful messages
- [ ] Loading states display appropriately
- [ ] Empty states provide clear guidance
- [ ] Navigation works (breadcrumbs, links)
- [ ] Keyboard navigation functional
- [ ] Focus states visible

#### Task 27: Git Commit

**Commit Message:**

```
Implement Phase 3A: Workshop Management (CRUD)

- Add WorkshopConstraints type definitions
- Replace WorkshopsPage stub with full library
- Implement workshop CRUD (create, edit, delete, list)
- Add workshop detail page with tabs (overview, constraints, tools)
- Implement text-based constraint forms (walls and obstacles)
- Integrate HeroUI components and UX copywriting frameworks
- Apply accessibility requirements (WCAG 2.2 AA)

🤖 Generated with Claude Code (https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

Run:
```bash
npm run typecheck
git add .
git commit -m "..."
git push
```

---

## Testing Strategy

### Unit Tests (Optional for MVP, Recommended)
- Test constraint type transformations
- Test WorkshopStore actions
- Test form validation logic

### Integration Tests
- Test full CRUD workflows
- Test constraint management workflows
- Test navigation between pages

### Manual Testing Checklist
- [ ] Create workshop with template
- [ ] Create workshop with custom dimensions
- [ ] Edit workshop name and description
- [ ] Delete workshop with confirmation
- [ ] Add wall constraint (all 4 walls)
- [ ] Edit wall constraint
- [ ] Delete wall constraint
- [ ] Add obstacle
- [ ] Edit obstacle
- [ ] Delete obstacle
- [ ] Navigate between workshops
- [ ] Verify data persists across sessions
- [ ] Test error handling (network offline)
- [ ] Test empty states
- [ ] Test loading states

---

## Success Criteria Review

Before marking Phase 3A complete, verify:

### Core Functionality
- [x] Users can create workshops in <3 minutes
- [x] Users can add/edit/delete workshops successfully
- [x] Users can configure wall constraints via forms
- [x] Users can add obstacles with positions and dimensions
- [x] Data persists correctly across sessions
- [x] Workshop library displays all user workshops

### User Experience
- [x] Workshop creation flow is self-explanatory
- [x] Constraint forms are clear and validated
- [x] Error messages guide users to resolution
- [x] Empty states provide helpful next steps
- [x] Loading states prevent user confusion

### Technical Performance
- [x] TypeScript compiles without errors
- [x] Workshop list loads in <500ms
- [x] Workshop data stays within 5KB per workshop
- [x] Store actions complete without errors
- [x] Database operations handle failures gracefully

### Design Quality
- [x] HeroUI components used consistently
- [x] WCAG 2.2 AA compliance verified
- [x] UX copywriting frameworks applied
- [x] Desktop-optimized layout (tablet+ focus)
- [x] Clean, modern, architectural aesthetic

---

## File Manifest

**New Files Created (16 total):**
1. `src/types/constraints.ts`
2. `src/pages/WorkshopsPage.tsx`
3. `src/pages/WorkshopDetailPage.tsx`
4. `src/components/workshops/WorkshopCard.tsx`
5. `src/components/workshops/WorkshopGrid.tsx`
6. `src/components/workshops/WorkshopFormModal.tsx`
7. `src/components/workshops/WorkshopForm.tsx`
8. `src/components/workshops/DeleteConfirmModal.tsx`
9. `src/components/workshops/EmptyWorkshopsState.tsx`
10. `src/components/workshops/WorkshopHeader.tsx`
11. `src/components/workshops/WorkshopTabs.tsx`
12. `src/components/workshops/OverviewTab.tsx`
13. `src/components/workshops/ConstraintsTab.tsx`
14. `src/components/workshops/WallConstraintForm.tsx`
15. `src/components/workshops/ObstacleForm.tsx`
16. `src/components/workshops/ConstraintsList.tsx`

**Files Updated (4 total):**
1. `src/types/workshop.ts` - Update constraints type
2. `src/stores/workshopStore.ts` - Add constraint actions
3. `src/App.tsx` - Add /workshops routes
4. `src/components/Navigation.tsx` - Update navigation links

**Total Estimated LOC:** ~600-800 lines

---

## Common Pitfalls & Solutions

### Pitfall 1: Type Mismatches with Database
**Problem:** Supabase returns snake_case fields, TypeScript expects camelCase.

**Solution:** Transform in data layer:
```typescript
const transformed = data.map(row => ({
  id: row.id,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  // etc.
}))
```

### Pitfall 2: State Not Updating After Mutation
**Problem:** Created workshop doesn't appear in list.

**Solution:** Call `onRefresh()` or `loadWorkshops()` after successful create/update/delete.

### Pitfall 3: Forgetting to Handle Loading States
**Problem:** UI flashes or shows stale data.

**Solution:** Use `loading` state from WorkshopStore, show `<Spinner>` or skeleton.

### Pitfall 4: Error Messages Not User-Friendly
**Problem:** Raw database errors shown to user.

**Solution:** Apply 4 H's framework:
```typescript
catch (err) {
  setError('We couldn't save your workshop. Check your connection and try again.')
}
```

---

## Ready to Start

Phase 3A is now fully planned and ready for execution. Execute stages 1-5 in order, commit frequently, and apply design/copy review agents before final commit.

**Next Steps:**
1. Execute Stage 1 (types)
2. Execute Stage 2 (workshop library)
3. Execute Stage 3 (workshop detail)
4. Execute Stage 4 (constraints)
5. Execute Stage 5 (polish & review)
6. Mark Phase 3A complete
7. Decide: proceed to Phase 3B (2D editor) or Phase 4 (tools)
