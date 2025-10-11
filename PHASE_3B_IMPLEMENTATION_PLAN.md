# Phase 3B Implementation Plan

**Status:** IN PROGRESS
**Created:** 2025-10-10
**Branch:** feature/phase-3b-2d-floor-plan
**Estimated Duration:** 3-4 days

## Executive Summary

Build interactive Canvas-based 2D floor plan editor for visual workshop constraint configuration. This phase enhances Phase 3A's text-based forms with drag-drop visual editing, providing intuitive spatial awareness for users.

---

## Prerequisites Checklist

✅ All prerequisites met:
- Phase 3A workshop CRUD complete
- Type definitions for constraints exist (`src/types/constraints.ts`)
- Workshop detail page with tabs functional
- WorkshopStore with constraint actions implemented
- HeroUI design system integrated
- Text-based constraint forms working as fallback

---

## Phase 3B Goals

### Primary Deliverables
1. **Dedicated workshop builder page** (canvas 75% + sidebar 25%)
2. Canvas-based 2D floor plan renderer with grid overlay
3. Click walls to add/edit constraints (sidebar form)
4. Drag-drop obstacles from sidebar palette to canvas
5. Context menu on elements (right-click: edit/delete)
6. Zoom/pan controls with 6" grid snapping
7. Simple undo/redo (20 snapshot stack)

### Success Metrics
- Floor plan renders in <100ms
- Smooth interactions at 60fps
- Grid snapping at 6" intervals
- Context menus on all interactive elements
- Undo/redo 20 states deep
- Changes persist to database on save

### Out of Scope (Post-MVP)
- Touch/mobile support (desktop-first)
- Rulers and measurement tools
- Angle snapping
- Advanced rendering optimizations

---

## Implementation Stages

### Stage 1: Workshop Builder Page & Canvas Foundation ✅ COMPLETE
**Goal:** Dedicated builder page with static workshop floor plan

Pages created:
1. `src/pages/WorkshopBuilderPage.tsx` - Main builder page with layout

Components created:
2. `src/components/workshops/FloorPlan2D.tsx` - Canvas component (75% width)
3. `src/components/workshops/BuilderSidebar.tsx` - Right sidebar (25% width)
4. `src/utils/floorPlanRenderer.ts` - Canvas drawing utilities
5. `src/hooks/useCanvasContext.ts` - Canvas setup hook
6. `src/components/workshops/FloorPlanControls.tsx` - Placeholder controls

Features:
- ✅ Workshop builder page with 75/25 split layout
- ✅ HTML Canvas with responsive sizing
- ✅ Workshop boundary rendering
- ✅ Grid overlay (6" increments)
- ✅ Coordinate system (origin bottom-left, transform Y in render)
- ✅ High DPI support (retina displays)
- ✅ Wall constraint visualization (colored bars)
- ✅ Obstacle rendering with labels

### Stage 2: Interactive Walls with Sidebar Forms ✅ COMPLETE
**Goal:** Click walls to edit constraints in sidebar

Components created:
7. `src/hooks/useFloorPlanInteraction.ts` - Click detection logic
8. `src/components/workshops/WallConstraintPanel.tsx` - Sidebar form for wall editing

Features:
- ✅ Click detection on wall boundaries
- ✅ Highlight selected wall on canvas (blue border)
- ✅ Constraint visualization (colored bars by type)
- ✅ Sidebar panel shows form for selected wall
- ✅ Add new constraints with type/position/width/clearance/notes
- ✅ Display existing constraints for selected wall
- ✅ Delete constraints with optimistic UI updates
- ✅ Save updates to database and re-render canvas

**UX Refinement Note:** Currently clicking wall *boundary* selects the wall and shows all its constraints. Future enhancement: click individual constraint bars on canvas to edit just that constraint (more direct manipulation).

### Stage 3: Obstacle Drag-Drop with Context Menu (Day 2-3)
**Goal:** Drag obstacles from sidebar to canvas with context menus

Components to create:
8. `src/components/workshops/ObstaclePalette.tsx` - Sidebar obstacle templates
9. `src/components/workshops/ContextMenu.tsx` - Right-click menu component
10. `src/hooks/useDragDrop.ts` - Drag-drop logic with grid snapping

Features:
- [ ] Obstacle palette in sidebar (common items: column, furnace, etc.)
- [ ] Drag from sidebar palette to canvas
- [ ] Grid snapping (6" intervals)
- [ ] Right-click obstacle → context menu (Edit/Delete)
- [ ] Edit opens obstacle form in sidebar
- [ ] Delete removes from canvas and constraints
- [ ] Collision detection (warn on overlap)

### Stage 4: Zoom & Pan Controls (Day 3)
**Goal:** Navigate large workshops

Components to create:
11. `src/hooks/useFloorPlanZoom.ts` - Zoom/pan functionality
12. `src/components/workshops/FloorPlanControls.tsx` - Zoom UI buttons

Features:
- [ ] Mouse wheel zoom (centered on cursor)
- [ ] Pan with middle-click drag or spacebar+drag
- [ ] Zoom controls: +/- buttons, Fit to View, Reset
- [ ] Grid scales with zoom level
- [ ] Min/max zoom limits (25% - 400%)
- [ ] No touch gestures (desktop-only)

### Stage 5: Undo/Redo & Testing (Day 4)
**Goal:** Production-ready experience

Tasks:
- [ ] Undo/redo system (simple snapshot stack, 20 states)
- [ ] Keyboard shortcuts (Del, Ctrl+Z, Ctrl+Y)
- [ ] Performance profiling (ensure 60fps)
- [ ] Apply `/design-review` agent
- [ ] Apply `/copy-review` agent
- [ ] Manual testing (user will perform)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Save button persists to database

**Manual Testing Checklist (User):**
1. Click each wall → verify constraint form appears in sidebar
2. Drag obstacle from palette → verify grid snapping at 6"
3. Right-click obstacle → verify context menu shows
4. Click Edit in context menu → verify form in sidebar
5. Click Delete in context menu → verify obstacle removes
6. Zoom in/out → verify canvas scales correctly
7. Pan → verify grid moves with canvas
8. Press Ctrl+Z → verify undo works
9. Press Ctrl+Y → verify redo works
10. Click Save → verify database persists changes

---

## Technical Specifications

### Canvas Rendering Pipeline

```typescript
interface RenderContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  workshop: Workshop
  scale: number // pixels per inch
  offset: { x: number; y: number } // pan offset
  gridSize: number // inches (default: 12)
  selectedWall?: WallSide
  selectedObstacle?: string // obstacle ID
}

function renderFloorPlan(context: RenderContext): void {
  clearCanvas(context)
  applyTransform(context) // scale + pan
  drawGrid(context)
  drawWorkshopBoundary(context)
  drawWallConstraints(context)
  drawObstacles(context)
  drawSelectionIndicators(context)
  drawMeasurements(context)
}
```

### Performance Requirements

- **Frame Rate:** 60fps during interactions
- **Render Time:** <100ms initial render
- **Memory:** <50MB canvas memory
- **Touch Latency:** <16ms

### Accessibility Requirements

- Keyboard navigation for all interactions
- Screen reader announcements for state changes
- High contrast mode support
- Focus indicators on interactive elements
- Alternative text-based workflow (Phase 3A forms)

---

## Component Architecture

### FloorPlan2D Component

```typescript
interface FloorPlan2DProps {
  workshop: Workshop
  onUpdateConstraints: (constraints: WorkshopConstraints) => void
  mode?: 'view' | 'edit'
  showGrid?: boolean
  gridSize?: number
}

export function FloorPlan2D(props: FloorPlan2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { ctx, scale, offset } = useCanvasContext(canvasRef, props.workshop)
  const { selectedWall, selectedObstacle, handleClick } = useFloorPlanInteraction()
  const { zoom, pan } = useFloorPlanZoom()

  // Render loop with requestAnimationFrame
  useEffect(() => {
    const animate = () => {
      renderFloorPlan({ ctx, workshop, scale, offset, selectedWall })
      requestAnimationFrame(animate)
    }
    animate()
  }, [ctx, workshop, scale, offset, selectedWall])

  return (
    <div className="floor-plan-container">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onWheel={zoom}
        onMouseDown={pan}
      />
      <FloorPlanControls />
      {selectedWall && <WallEditor wall={selectedWall} />}
    </div>
  )
}
```

---

## Integration with Phase 3A

### Workshop Detail Page Update

Add "Open Builder" button to navigate to dedicated builder page:

```typescript
// In WorkshopDetailPage.tsx or WorkshopHeader.tsx
<Button
  color="primary"
  onPress={() => navigate(`/workshops/${workshop.id}/builder`)}
>
  Open Builder
</Button>
```

### Routes Update

Add route for dedicated builder page:

```typescript
// In App.tsx
<Route path="/workshops/:id/builder" element={<WorkshopBuilderPage />} />
```

### Builder Page Layout

```typescript
// WorkshopBuilderPage.tsx structure
<div className="builder-page h-screen flex">
  {/* Canvas - 75% width */}
  <div className="flex-[3] relative">
    <FloorPlan2D workshop={workshop} />
    <FloorPlanControls />
  </div>

  {/* Sidebar - 25% width */}
  <div className="flex-[1] border-l overflow-y-auto">
    <BuilderSidebar
      workshop={workshop}
      selectedWall={selectedWall}
      selectedObstacle={selectedObstacle}
    />
  </div>
</div>
```

Phase 3A text forms remain available in workshop detail page tabs as fallback.

---

## Testing Strategy

### Unit Tests
- Canvas rendering functions
- Coordinate transformations
- Collision detection
- Grid snapping logic

### Integration Tests
- Full edit workflow (add wall, add obstacle, save)
- Zoom/pan state management
- Undo/redo system
- Keyboard shortcuts

### Manual Testing Checklist
- [ ] Render workshop boundary correctly
- [ ] Grid scales with zoom
- [ ] Click wall to edit constraint
- [ ] Drag obstacle from palette
- [ ] Snap obstacle to grid
- [ ] Resize obstacle with handles
- [ ] Delete obstacle with Delete key
- [ ] Zoom in/out with mouse wheel
- [ ] Pan with click-drag
- [ ] Reset view button works
- [ ] Changes persist to database
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes
- [ ] High contrast mode visible

### Performance Testing
- [ ] 60fps during pan/zoom
- [ ] No memory leaks after 5min usage
- [ ] Canvas renders in <100ms
- [ ] Smooth on 4K displays

---

## File Manifest

### New Files (14 total)

**Pages:**
1. `src/pages/WorkshopBuilderPage.tsx` - Dedicated builder page with 75/25 layout

**Components:**
2. `src/components/workshops/FloorPlan2D.tsx` - Canvas component
3. `src/components/workshops/BuilderSidebar.tsx` - Right sidebar container
4. `src/components/workshops/WallConstraintPanel.tsx` - Wall editing form in sidebar
5. `src/components/workshops/ObstaclePalette.tsx` - Obstacle templates in sidebar
6. `src/components/workshops/ObstaclePanel.tsx` - Obstacle editing form in sidebar
7. `src/components/workshops/ContextMenu.tsx` - Right-click menu
8. `src/components/workshops/FloorPlanControls.tsx` - Zoom/pan UI controls

**Utilities:**
9. `src/utils/floorPlanRenderer.ts` - Canvas drawing functions
10. `src/utils/canvasHelpers.ts` - Canvas setup and transform utilities
11. `src/utils/gridSnapping.ts` - Grid snapping logic
12. `src/utils/undoRedo.ts` - Undo/redo snapshot stack

**Hooks:**
13. `src/hooks/useCanvasContext.ts` - Canvas setup and HiDPI handling
14. `src/hooks/useFloorPlanInteraction.ts` - Click detection and selection
15. `src/hooks/useFloorPlanZoom.ts` - Zoom/pan state management
16. `src/hooks/useDragDrop.ts` - Drag-drop logic
17. `src/hooks/useUndoRedo.ts` - Undo/redo state management

### Files Updated (3 total)

1. `src/App.tsx` - Add /workshops/:id/builder route
2. `src/components/workshops/WorkshopHeader.tsx` - Add "Open Builder" button
3. `src/types/workshop.ts` - Add Canvas-specific types if needed

**Total Estimated LOC:** ~1,500-1,800 lines

---

## Common Pitfalls & Solutions

### Pitfall 1: Canvas Coordinate System
**Problem:** Canvas Y-axis is top-down, workshop coordinates are bottom-up.

**Solution:** Transform Y coordinates in rendering:
```typescript
const canvasY = canvas.height - (workshopY * scale + offset.y)
```

### Pitfall 2: High DPI Scaling
**Problem:** Blurry canvas on retina displays.

**Solution:** Use devicePixelRatio:
```typescript
const dpr = window.devicePixelRatio || 1
canvas.width = containerWidth * dpr
canvas.height = containerHeight * dpr
ctx.scale(dpr, dpr)
```

### Pitfall 3: Performance Degradation
**Problem:** Canvas re-renders on every state change.

**Solution:** Use requestAnimationFrame and dirty rectangles:
```typescript
let isDirty = true
const render = () => {
  if (isDirty) {
    renderFloorPlan()
    isDirty = false
  }
  requestAnimationFrame(render)
}
```

### Pitfall 4: State Management Complexity
**Problem:** Canvas state (zoom, selection) mixed with workshop data.

**Solution:** Keep canvas state local in component:
```typescript
// Local state - UI only
const [zoom, setZoom] = useState(1)
const [selectedWall, setSelectedWall] = useState<WallSide | null>(null)

// Workshop data - persist to store
const handleSaveConstraints = () => {
  workshopStore.updateConstraints(workshopId, constraints)
}
```

---

## Success Criteria

### Core Functionality
- [ ] Floor plan renders workshop accurately
- [ ] Users can click walls to edit constraints
- [ ] Users can drag obstacles from palette
- [ ] Grid snapping provides precise placement
- [ ] Zoom/pan enables navigation
- [ ] Changes save to database correctly

### Performance
- [ ] 60fps during interactions
- [ ] <100ms initial render
- [ ] No memory leaks after extended use
- [ ] Smooth on desktop (Chrome, Firefox, Safari)

### User Experience
- [ ] Context menus appear on right-click
- [ ] Grid snapping provides precision
- [ ] Undo/redo works reliably
- [ ] Save persists changes to database
- [ ] Phase 3A text forms remain as fallback

### Design Quality
- [ ] Clean, modern visual style
- [ ] Consistent with HeroUI design system
- [ ] Clear visual hierarchy
- [ ] Intuitive interaction patterns
- [ ] Professional grid overlay

---

## Ready to Start Phase 3B

Branch created: `feature/phase-3b-2d-floor-plan`

Execute stages 1-5 in order, commit frequently, test thoroughly.
