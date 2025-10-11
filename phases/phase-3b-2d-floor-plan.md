# Phase 3B: 2D Floor Plan Editor

**Duration**: Week 4
**Status**: PENDING

## Overview

Build interactive Canvas-based 2D floor plan editor for visual workshop constraint configuration. This phase replaces text-based constraint forms from Phase 3A with drag-drop visual editing.

## Prerequisites from Previous Phases
- ✅ Phase 3A: Workshop CRUD and text-based constraints
- ✅ Type definitions for walls and obstacles (`src/types/constraints.ts`)
- ✅ Workshop detail page structure with tabs
- ✅ WorkshopStore with constraint actions
- ✅ HeroUI design system integrated

## Scope Clarification

**Phase 3B (This Phase):**
- Canvas-based 2D floor plan renderer
- Interactive wall selection and configuration
- Drag-drop obstacle placement
- Zoom/pan controls
- Grid overlay for measurement
- Visual feedback and validation
- **Replaces** text forms from Phase 3A Constraints tab

**NOT in Scope:**
- 3D visualization (Phase 6)
- Tool placement (Phase 5)
- Layout optimization (Phase 5)
- Advanced rendering effects

## 2D Floor Plan Renderer 📋 PENDING

### Canvas Implementation

**Components to Create:**
- `src/components/workshops/FloorPlan2D.tsx` - Main Canvas component
- `src/utils/floorPlanRenderer.ts` - Canvas drawing utilities
- `src/hooks/useFloorPlanInteraction.ts` - Mouse/touch interaction hook
- `src/hooks/useFloorPlanZoom.ts` - Zoom/pan functionality

**Core Features:**
- [ ] HTML Canvas element with proper sizing
- [ ] Workshop boundary rendering (scaled rectangle)
- [ ] Grid overlay (12" increments, configurable)
- [ ] Coordinate system: origin at bottom-left (workshop standard)
- [ ] Responsive canvas (fits container, maintains aspect ratio)
- [ ] High DPI support (retina displays)

**Rendering Pipeline:**
```typescript
interface RenderContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  workshop: Workshop
  scale: number // pixels per inch
  offset: { x: number, y: number } // pan offset
  gridSize: number // inches
}

function renderFloorPlan(context: RenderContext): void {
  clearCanvas()
  applyTransform() // scale + pan
  drawGrid()
  drawWorkshopBoundary()
  drawWallConstraints()
  drawObstacles()
  drawSelectionIndicators()
  drawMeasurements()
}
```

### Visual Elements

**Workshop Boundary:**
- [ ] Outer rectangle representing workshop dimensions
- [ ] Stroke: 2px, neutral-700 color
- [ ] Fill: neutral-50 background
- [ ] Drop shadow for depth (z1 elevation)

**Grid Overlay:**
- [ ] Major grid lines: 12" intervals (1 foot)
- [ ] Minor grid lines: 6" intervals (optional, toggle)
- [ ] Grid color: neutral-300, 1px strokes
- [ ] Grid labels: show feet along edges

**Wall Constraints:**
- [ ] Colored bars along walls indicating constraints
- [ ] Color by type:
  - Window: sky-blue
  - Door: green
  - Electrical: amber (warning color)
  - Utilities: red (danger color)
  - Storage: neutral-400
- [ ] Width bar shows physical width along wall
- [ ] Clearance indicator: dashed line into room
- [ ] Label with constraint type and dimensions

**Obstacles:**
- [ ] Filled rectangles at position
- [ ] Color by fixed status:
  - Fixed: red-200 fill (cannot move)
  - Moveable: blue-200 fill (optimizer can reposition)
- [ ] Border: 2px stroke, darker shade
- [ ] Label with obstacle name
- [ ] Dimension annotations (L×W)

**Selection Indicators:**
- [ ] Selected element: 3px primary-500 border
- [ ] Hover state: 2px primary-300 border
- [ ] Control handles for resize (8px squares at corners)
- [ ] Transform indicator for rotation (future)

## Interactive Controls 📋 PENDING

### Mouse/Touch Interaction

**Interaction Modes:**
- [ ] **Select Mode** (default): Click to select walls/obstacles
- [ ] **Pan Mode** (space key held): Drag to pan view
- [ ] **Add Obstacle Mode** (button toggle): Click to place new obstacle
- [ ] **Edit Mode** (selected element): Drag to reposition, resize handles

**Click Detection:**
- [ ] Ray casting for element selection
- [ ] Bounding box collision detection
- [ ] Z-index ordering (walls → obstacles → selection)
- [ ] Double-click to edit (opens property panel)

**Drag Operations:**
- [ ] Drag obstacle to reposition
- [ ] Snap to grid (configurable, default: 6" increments)
- [ ] Boundary validation: prevent dragging outside workshop
- [ ] Live preview while dragging
- [ ] Collision detection with other obstacles (optional warning)

**Keyboard Shortcuts:**
- [ ] `Space` + drag: Pan view
- [ ] `Delete`/`Backspace`: Delete selected element
- [ ] `Escape`: Cancel current operation, clear selection
- [ ] `Ctrl/Cmd + Z`: Undo (constraint operation)
- [ ] `Ctrl/Cmd + Shift + Z`: Redo
- [ ] Arrow keys: Nudge selected obstacle (1" increments)

### Zoom & Pan Controls

**Zoom Implementation:**
- [ ] Mouse wheel zoom centered on cursor
- [ ] Pinch-to-zoom on touch devices
- [ ] Zoom limits: 0.5x to 5x
- [ ] Zoom UI controls (+ / - buttons)
- [ ] Fit-to-view button (reset zoom/pan)

**Pan Implementation:**
- [ ] Click-and-drag panning (space key held)
- [ ] Touch drag panning (two-finger)
- [ ] Pan limits: constrain to workshop bounds
- [ ] Smooth pan animation (easing)
- [ ] Mini-map indicator (optional, shows viewport in context)

**UI Controls Component:**
- `src/components/workshops/FloorPlanControls.tsx`
- [ ] Zoom in/out buttons
- [ ] Fit to view button
- [ ] Grid toggle
- [ ] Measurement units toggle (feet/inches/meters)
- [ ] Snap to grid toggle
- [ ] Mode selector (Select / Add Obstacle)

## Wall Constraint Visual Editor 📋 PENDING

### Wall Selection

**Components to Create:**
- `src/components/workshops/WallPanel.tsx` - Side panel for wall editing

**Interaction:**
- [ ] Click on wall edge to select
- [ ] Highlight selected wall (thicker stroke, primary color)
- [ ] Open wall panel showing existing constraints
- [ ] Add constraint button per wall

**Wall Panel Content:**
- [ ] Wall identifier (North/South/East/West)
- [ ] List of constraints on this wall
- [ ] Add constraint button
- [ ] Constraint cards with:
  - Type (icon + label)
  - Position and width
  - Clearance distance
  - Edit/delete buttons

### Constraint Placement

**Placement Flow:**
- [ ] Select wall
- [ ] Click "Add Constraint" → opens constraint form
- [ ] Form fields:
  - Type (dropdown: Window, Door, Electrical, Utilities, Storage)
  - Position along wall (slider or numeric input)
  - Width (numeric input with validation)
  - Clearance into room (numeric input)
  - Notes (optional)
- [ ] Live preview on canvas while editing
- [ ] Save button updates canvas + database
- [ ] Cancel button discards changes

**Visual Feedback:**
- [ ] Constraint bar appears on canvas in real-time
- [ ] Clearance dashed line shows required space
- [ ] Validation indicators:
  - Red outline: constraint overlaps with another
  - Amber outline: clearance exceeds half room width (warning)
  - Green checkmark: valid placement

### Constraint Editing

**Edit Interactions:**
- [ ] Click constraint bar on canvas → selects and opens panel
- [ ] Drag constraint along wall to reposition
- [ ] Drag constraint width handles to resize
- [ ] Delete button in panel or `Delete` key
- [ ] Real-time validation during drag
- [ ] Undo/redo support

## Obstacle Visual Editor 📋 PENDING

### Obstacle Placement

**Placement Flow:**
- [ ] Click "Add Obstacle" button → enters placement mode
- [ ] Cursor shows obstacle preview (rectangle outline)
- [ ] Click on canvas to place obstacle
- [ ] Opens obstacle property panel with:
  - Name (text input)
  - Position (X, Y - auto-filled from click)
  - Dimensions (Length, Width, Height)
  - Fixed checkbox (optimizer can move?)
  - Notes (optional)
- [ ] Save creates obstacle on canvas + database
- [ ] Cancel discards placement

**Default Obstacle Templates:**
- [ ] Water Heater (30" × 30" × 60")
- [ ] Electrical Panel (20" × 6" × 40")
- [ ] Support Post (6" × 6" × 96")
- [ ] Workbench (72" × 24" × 36")
- [ ] Custom (user-defined dimensions)

**Visual Representation:**
- [ ] Rectangle with dimensions
- [ ] Color coding by fixed status
- [ ] Name label centered
- [ ] Resize handles when selected
- [ ] Rotation handle (future enhancement)

### Obstacle Editing

**Edit Interactions:**
- [ ] Click obstacle → selects and opens property panel
- [ ] Drag to reposition (with snap-to-grid)
- [ ] Drag corner handles to resize
- [ ] Property panel updates position/size in real-time
- [ ] Delete button or `Delete` key
- [ ] Duplicate button (copy obstacle)
- [ ] Collision warnings (overlap with other obstacles)

**Validation:**
- [ ] Position must be within workshop bounds
- [ ] Dimensions must be positive
- [ ] Clearance check against wall constraints
- [ ] Warning (not error) on obstacle overlaps
- [ ] Max obstacles: 50 per workshop (prevent performance issues)

## Measurements & Annotations 📋 PENDING

### Measurement Tools

**Components to Create:**
- `src/components/workshops/MeasurementOverlay.tsx` - Dimension annotations

**Features:**
- [ ] Show dimensions on selected elements:
  - Workshop: L × W along edges
  - Obstacles: L × W on hover
  - Wall constraints: width label
  - Clearances: distance annotation
- [ ] Distance ruler tool (click two points → shows distance)
- [ ] Area calculator (show workshop floor area, usable area)
- [ ] Coordinate display (cursor position in inches)

**Annotation Styles:**
- [ ] Dimension lines: thin lines with arrows
- [ ] Text labels: readable font, high contrast background
- [ ] Units: toggle between feet, inches, meters
- [ ] Precision: configurable decimal places

### Grid & Guides

**Grid System:**
- [ ] Major grid: 12" (1 foot)
- [ ] Minor grid: 6" or 3" (toggle)
- [ ] Grid color: neutral-300
- [ ] Grid opacity: 0.5 (adjustable)
- [ ] Axis labels: show feet along X and Y

**Snap-to-Grid:**
- [ ] Configurable snap distance (3", 6", 12")
- [ ] Visual feedback when snapping (subtle highlight)
- [ ] Toggle on/off via checkbox
- [ ] Smart snap: prioritize wall edges and other obstacles

**Guidelines (Optional Enhancement):**
- [ ] Center guides (show workshop center)
- [ ] Alignment guides (when dragging, snap to other element edges)
- [ ] Distance guides (show equal spacing)

## Property Panels & Forms 📋 PENDING

### Side Panel Layout

**Components to Create:**
- `src/components/workshops/FloorPlanSidebar.tsx` - Container for panels
- `src/components/workshops/WallPropertiesPanel.tsx` - Wall constraint editor
- `src/components/workshops/ObstaclePropertiesPanel.tsx` - Obstacle editor
- `src/components/workshops/FloorPlanSettings.tsx` - View settings

**Panel Structure:**
- [ ] Collapsible sidebar (right side of canvas)
- [ ] Tab-based navigation:
  - Selected Element (wall or obstacle properties)
  - All Constraints (list view)
  - Settings (grid, units, snap)
- [ ] Floating panel option (draggable, resizable)
- [ ] Panel width: 320px default

### Form Components

**Wall Constraint Form:**
- [ ] Type select dropdown with icons
- [ ] Position slider (0 to wall length)
- [ ] Width numeric input with unit label
- [ ] Clearance numeric input with unit label
- [ ] Notes textarea
- [ ] Save/Cancel buttons
- [ ] Delete button (if editing existing)

**Obstacle Form:**
- [ ] Name text input
- [ ] Template select (with custom option)
- [ ] Position X/Y numeric inputs (linked to canvas drag)
- [ ] Dimensions: Length, Width, Height inputs
- [ ] Fixed checkbox with explanation tooltip
- [ ] Color picker (future: custom obstacle colors)
- [ ] Notes textarea
- [ ] Save/Cancel/Delete buttons

**Real-time Sync:**
- [ ] Form changes update canvas preview immediately
- [ ] Canvas drag updates form values
- [ ] Validation feedback in both form and canvas

## Performance & Optimization 📋 PENDING

### Rendering Performance

**Optimization Strategies:**
- [ ] Canvas layering: separate static and dynamic layers
  - Background layer: workshop + grid (re-render only on zoom/pan)
  - Elements layer: walls + obstacles (re-render on changes)
  - Interaction layer: selection, hover, drag preview
- [ ] Dirty rectangle optimization (redraw only changed regions)
- [ ] RequestAnimationFrame for smooth animations
- [ ] Throttle/debounce on mouse move events
- [ ] Object pooling for frequent allocations

**Target Performance:**
- [ ] 60fps during pan/zoom operations
- [ ] <16ms render time per frame
- [ ] <100ms response to user interactions
- [ ] Smooth drag operations without jank

**Scalability:**
- [ ] Support up to 50 obstacles without performance degradation
- [ ] Efficient hit detection (spatial partitioning if needed)
- [ ] Lazy rendering: only render visible elements at extreme zoom

### Memory Management

**Best Practices:**
- [ ] Clean up event listeners on component unmount
- [ ] Clear canvas contexts properly
- [ ] Avoid memory leaks in drag handlers
- [ ] Optimize image/icon caching
- [ ] Profile with React DevTools and Chrome Performance

## State Management 📋 PENDING

### Canvas State

**State to Track:**
- [ ] Zoom level (scale factor)
- [ ] Pan offset (x, y)
- [ ] Selected element (wall, obstacle, or null)
- [ ] Hover element (for hover effects)
- [ ] Drag state (is dragging, drag start position, drag target)
- [ ] Grid settings (visible, major size, minor size)
- [ ] Snap settings (enabled, snap distance)
- [ ] Measurement units (feet, inches, meters)

**State Storage:**
- [ ] Local component state (zoom, pan, selection)
- [ ] WorkshopStore for persistent data (constraints, obstacles)
- [ ] LocalStorage for view preferences (grid, snap settings)

### Undo/Redo System

**Implementation:**
- [ ] Command pattern for all constraint/obstacle operations
- [ ] History stack (max 50 operations)
- [ ] Undo/redo actions in WorkshopStore
- [ ] Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- [ ] UI buttons for undo/redo

**Commands:**
- [ ] AddObstacleCommand
- [ ] MoveObstacleCommand
- [ ] ResizeObstacleCommand
- [ ] DeleteObstacleCommand
- [ ] AddWallConstraintCommand
- [ ] EditWallConstraintCommand
- [ ] DeleteWallConstraintCommand

## Integration with Phase 3A 📋 PENDING

### Replacing Text Forms

**Migration Path:**
- [ ] Phase 3A Constraints tab gets updated:
  - Remove text-based forms
  - Add FloorPlan2D component
  - Add FloorPlanSidebar component
  - Keep ability to view constraint list (read-only table)
- [ ] Data format remains compatible (same types)
- [ ] Users can switch between phases (backward compatible)

**Hybrid Approach (Optional):**
- [ ] Toggle between "Visual Editor" and "List View"
- [ ] List view shows table of all constraints
- [ ] Edit buttons in list open visual editor focused on element
- [ ] Power users can prefer list view, visual users prefer canvas

### Data Persistence

**Save Strategy:**
- [ ] Auto-save on every constraint/obstacle change (debounced)
- [ ] Optimistic updates (immediate UI, background save)
- [ ] Conflict resolution: last-write-wins
- [ ] Save indicator in UI ("Saving...", "Saved", "Error saving")

**Error Handling:**
- [ ] Network errors: queue changes, retry on reconnection
- [ ] Validation errors: show inline, prevent save
- [ ] Recovery: reload from server if local state corrupt

## Accessibility 📋 PENDING

### Canvas Accessibility

**Challenges:**
- Canvas is not inherently accessible to screen readers
- Must provide alternative navigation and editing

**Solutions:**
- [ ] ARIA live region for canvas state announcements
  - "Obstacle 'Water Heater' selected"
  - "Moved obstacle to position (120, 45)"
  - "Validation error: Obstacle overlaps with wall"
- [ ] Keyboard-only navigation:
  - Tab to cycle through obstacles
  - Arrow keys to move selected obstacle
  - Enter to edit properties
  - Delete to remove
- [ ] Alternative list view (accessible table) as fallback
- [ ] Form-based editing as primary interaction (canvas as preview)

**WCAG 2.2 AA Compliance:**
- [ ] Color not sole indicator (use patterns + labels)
- [ ] Focus indicators visible on sidebar forms
- [ ] Sufficient contrast for text labels
- [ ] Alternative text for icons
- [ ] Semantic HTML in sidebar panels

## Testing & Validation 📋 PENDING

### Functional Testing
- [ ] Canvas renders correctly at various zoom levels
- [ ] Drag-drop operations work smoothly
- [ ] Wall constraints can be added, edited, deleted
- [ ] Obstacles can be placed, moved, resized, deleted
- [ ] Grid and measurements display accurately
- [ ] Undo/redo functions correctly
- [ ] Data saves to Supabase without errors
- [ ] Keyboard shortcuts work as expected

### Visual Testing
- [ ] Canvas scales properly on different screen sizes
- [ ] High DPI displays render crisply
- [ ] Colors match HeroUI semantic colors
- [ ] Labels are readable at all zoom levels
- [ ] Selection indicators are clear and visible
- [ ] Hover effects provide good feedback

### Performance Testing
- [ ] 60fps during pan/zoom operations
- [ ] No lag during drag operations
- [ ] Memory usage stable over extended sessions
- [ ] No memory leaks detected
- [ ] Handles 50 obstacles without slowdown

### Accessibility Testing
- [ ] Keyboard-only navigation works completely
- [ ] Screen reader announces state changes
- [ ] Alternative list view is fully functional
- [ ] Focus management is logical and predictable

## Success Criteria

### Core Functionality
- [ ] Users can visually configure workshop constraints via 2D editor
- [ ] Wall constraints can be added/edited/deleted on canvas
- [ ] Obstacles can be placed, repositioned, and resized via drag-drop
- [ ] Zoom/pan controls provide smooth navigation
- [ ] Changes persist to Supabase correctly
- [ ] Canvas renders accurately at all zoom levels

### User Experience
- [ ] Visual editing is more intuitive than text forms
- [ ] Drag-drop operations feel responsive (60fps)
- [ ] Validation feedback is clear and helpful
- [ ] Grid and measurements aid spatial understanding
- [ ] Undo/redo provides safety for experimentation

### Technical Quality
- [ ] 60fps rendering performance maintained
- [ ] TypeScript compiles without errors
- [ ] Canvas component is reusable and well-documented
- [ ] State management is clean and predictable
- [ ] Memory usage is stable (no leaks)

### Design Quality
- [ ] Visual style matches HeroUI aesthetic
- [ ] Accessibility requirements met (WCAG 2.2 AA)
- [ ] Desktop-optimized layout
- [ ] Professional, architectural feel
- [ ] Clear visual hierarchy

## Dependencies for Next Phase

**Phase 4 (Tool System):**
- Workshop dimensions from Phase 3A
- Constraint data for tool placement validation
- 2D renderer can show tool previews (future)

**Phase 5 (Optimization Engine):**
- Wall and obstacle constraints from Phase 3A/3B
- Visual editor can display optimization results
- Constraint data drives placement algorithm

**Phase 6 (3D Visualization):**
- 2D floor plan as base for 3D extrusion
- Same constraint data used for 3D rendering
- Coordinate system alignment (2D → 3D)

## Implementation Checklist

### File Creation
- [ ] `src/components/workshops/FloorPlan2D.tsx`
- [ ] `src/components/workshops/FloorPlanControls.tsx`
- [ ] `src/components/workshops/FloorPlanSidebar.tsx`
- [ ] `src/components/workshops/WallPanel.tsx`
- [ ] `src/components/workshops/WallPropertiesPanel.tsx`
- [ ] `src/components/workshops/ObstaclePropertiesPanel.tsx`
- [ ] `src/components/workshops/FloorPlanSettings.tsx`
- [ ] `src/components/workshops/MeasurementOverlay.tsx`
- [ ] `src/utils/floorPlanRenderer.ts`
- [ ] `src/utils/canvasHelpers.ts`
- [ ] `src/hooks/useFloorPlanInteraction.ts`
- [ ] `src/hooks/useFloorPlanZoom.ts`
- [ ] `src/hooks/useCanvasResize.ts`

### File Updates
- [ ] `src/pages/WorkshopDetailPage.tsx` - Update Constraints tab
- [ ] `src/components/workshops/ConstraintsTab.tsx` - Replace forms with FloorPlan2D
- [ ] `src/stores/workshopStore.ts` - Add undo/redo support

### Documentation
- [ ] Document canvas rendering pipeline
- [ ] Add JSDoc for canvas utility functions
- [ ] Explain coordinate system (origin, axes, units)
- [ ] Document interaction patterns

## Estimated Effort

**Total Lines of Code:** ~1,200-1,500 lines
**Estimated Time:** 3-4 days focused work
**Components:** 13 new files + 3 file updates
**Complexity:** High (Canvas API, mouse interaction, performance optimization)

## Notes

- **Optional Phase:** Can skip and proceed to Phase 5 with text-based constraints
- **Canvas-heavy:** Significant custom rendering code, not just HeroUI components
- **Performance-critical:** Must maintain 60fps for good UX
- **Accessibility challenge:** Canvas requires extra work for screen readers
- **Desktop-first:** Complex interactions suited for mouse/keyboard
- **Foundation for 3D:** Coordinate system and data model align with Phase 6
