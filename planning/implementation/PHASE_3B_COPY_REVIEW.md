# Phase 3B UX Copywriting Review

**Date:** 2025-10-11
**Status:** Review Complete - Improvements Planned for Phase 3C
**Reviewer:** UX Copy Review Agent
**Framework:** VOICE Method + 4 H's Error Framework

## Executive Summary

Phase 3B copy is functional but generic. Opportunities exist to make the interface more helpful, professional, and confidence-building through strategic copy improvements. Focus areas: error messages (4 H's), empty states, and progressive disclosure.

---

## Copy Improvements by Component

### 1. Obstacle Palette (ObstaclePalette.tsx)

**Current:**
```
"Add Obstacles"
"Click an obstacle to add it to the center of your workshop"
```

**Recommended:**
```
"Workshop Obstacles"
"Select a template to quickly add common workshop elements"
```

**Rationale:**
- **Value-driven:** "Quickly add" emphasizes speed benefit
- **Clear:** "Template" and "elements" are more precise than generic "obstacle"
- **Occasion-appropriate:** Professional tone fits technical context
- Follows VOICE method

**File:** `src/components/workshops/ObstaclePalette.tsx`
**Priority:** Medium

---

### 2. Context Menu (ContextMenu.tsx)

**Current:**
```tsx
<button>Edit</button>
<button>Delete</button>
```

**Recommended:**
```tsx
<button>Edit Details</button>
<button>Remove Item</button>
```

**Rationale:**
- **More descriptive:** Users know what "Edit" will do
- **Less destructive language:** "Remove" feels more reversible than "Delete"
- **Action-oriented:** Follows CLEAR method
- Reduces cognitive load

**File:** `src/components/workshops/ContextMenu.tsx` (lines 47-66)
**Priority:** Low

---

### 3. Floor Plan Controls (FloorPlanControls.tsx)

**Current:**
```tsx
<Button>Fit to View</Button>
<Button>Reset</Button>
<span>100%</span>
```

**Recommended:**
```tsx
<Button title="Center workshop in view">Fit to View</Button>
<Button title="Reset zoom and pan to default">Reset View</Button>
<span title="Current zoom level (100% is default)">100%</span>
```

**Additional Enhancement:**
```tsx
// Show zoom level with context
<span className="text-xs text-default-600">
  {zoomPercent}% {zoom === 1.0 && '(Default)'}
</span>
```

**Rationale:**
- **Tooltips provide progressive disclosure** without cluttering UI
- **"Reset View"** is more specific than just "Reset"
- **Context helps users understand** what 100% means
- Follows progressive disclosure principle (Lines 35-40 in ux-copywriting.md)

**File:** `src/components/workshops/FloorPlanControls.tsx` (lines 42-58)
**Priority:** Medium

---

### 4. Wall Constraint Panel Error Messages (WallConstraintPanel.tsx)

#### 4A. Generic Add Error

**Current:**
```tsx
setError('Couldn't add constraint. Try again.')
```

**Recommended (4 H's Framework):**
```tsx
setError(
  `We couldn't save this wall feature right now.\n\n` +
  `• Check that all fields are filled in correctly\n` +
  `• Ensure width and clearance are positive numbers\n` +
  `• If the problem continues, try refreshing the page`
)
```

**Rationale:**
- **Human:** "We" instead of system language
- **Helpful:** Specific recovery steps, not just "try again"
- **Humble:** Takes shared responsibility ("We couldn't...")
- **Non-humorous:** Serious problem, professional tone
- Follows 4 H's framework (Lines 81-87 in ux-copywriting.md)

**File:** `src/components/workshops/WallConstraintPanel.tsx` (line 77)
**Priority:** HIGH

---

#### 4B. Generic Delete Error

**Current:**
```tsx
console.error('Failed to delete constraint:', err)
alert('Couldn't delete constraint. Try again.')
```

**Recommended:**
```tsx
toast.error(
  `We couldn't remove this wall feature.\n\n` +
  `This might happen if:\n` +
  `• The workshop was modified elsewhere\n` +
  `• You've lost connection\n\n` +
  `Try refreshing the page to see the latest version.`
)
```

**Rationale:**
- **Human:** Conversational explanation
- **Helpful:** Explains possible causes + action
- **Humble:** Doesn't blame user
- Uses toast instead of alert for better UX
- Provides context for understanding the failure

**File:** `src/components/workshops/WallConstraintPanel.tsx` (line 102)
**Priority:** HIGH

---

### 5. Builder Sidebar (BuilderSidebar.tsx)

**Current:**
```tsx
<h3>Add Obstacles</h3>
<Button>Clear Selection</Button>
```

**Recommended:**
```tsx
<h3>Workshop Elements</h3>
<Button variant="light" size="sm">Clear Selection (Esc)</Button>
```

**Rationale:**
- **"Workshop Elements"** is more professional than "Add Obstacles"
- **Keyboard shortcut in label** teaches users faster method
- **Progressive disclosure:** Shows power users a shortcut
- Follows educational content principles (Lines 141-146 in ux-copywriting.md)

**File:** `src/components/workshops/BuilderSidebar.tsx` (lines 36, 66-72)
**Priority:** Low

---

### 6. Empty States (Missing - Should Add)

#### 6A. Wall with No Constraints

**Current:**
```tsx
// No message shown when wall has no constraints
```

**Recommended:**
```tsx
{selectedWall && wallConstraints.length === 0 && (
  <div className="p-4 text-center text-default-500">
    <p className="mb-2">No features on this wall yet</p>
    <p className="text-sm">
      Add doors, windows, electrical outlets, or other
      wall-mounted elements to help optimize your layout.
    </p>
  </div>
)}
```

**Rationale:**
- **Transform empty states into guidance** (Lines 95-100)
- **Explain value:** Why add constraints
- **Suggest actions:** What types of features to add
- Reduces user confusion about what to do next

**File:** `src/components/workshops/WallConstraintPanel.tsx` (after line 136)
**Priority:** Medium

---

#### 6B. No Obstacles in Workshop

**Current:**
```tsx
// Sidebar shows palette but no guidance when workspace empty
```

**Recommended:**
```tsx
{workshop.constraints.obstacles.length === 0 && (
  <div className="p-4 mb-4 bg-primary-50 border border-primary-200 rounded-lg">
    <p className="text-sm text-primary-800">
      <strong>Start by adding fixed elements:</strong><br/>
      Columns, HVAC units, stairs, and other immovable items
      help the optimizer plan your tool placement.
    </p>
  </div>
)}
```

**Rationale:**
- **Educational:** Explains why obstacles matter
- **Actionable:** Clear next step
- **Value-driven:** Shows benefit (optimization)
- Follows progressive commitment (Lines 142-146)

**File:** `src/components/workshops/ObstaclePalette.tsx` (before line 36)
**Priority:** Medium

---

### 7. Workshop Builder Page (WorkshopBuilderPage.tsx)

#### 7A. Loading State

**Current:**
```tsx
<Spinner size="lg" label="Loading workshop builder..." />
```

**Recommended:**
```tsx
<Spinner size="lg" label="Loading your workshop..." />
```

**Rationale:**
- **User-focused:** "your workshop" vs system-focused "workshop builder"
- **More personal:** Builds connection to user's project
- Minor but important tone shift

**File:** `src/pages/WorkshopBuilderPage.tsx` (line 109)
**Priority:** Nitpick

---

#### 7B. Error State

**Current:**
```tsx
<p className="text-danger text-lg mb-4">
  {error || 'Workshop not found'}
</p>
<button>Back to Workshops</button>
```

**Recommended:**
```tsx
<div className="text-center max-w-md">
  <p className="text-lg font-semibold mb-2">
    Workshop Unavailable
  </p>
  <p className="text-default-600 mb-4">
    This workshop might have been deleted or you've lost access to it.
  </p>
  <Button color="primary" onPress={() => navigate('/workshops')}>
    Return to Workshop List
  </Button>
</div>
```

**Rationale:**
- **Human:** Explains situation conversationally
- **Helpful:** Suggests possible causes
- **Humble:** Doesn't blame user
- **Clear next action:** Primary button with action-oriented label
- Follows 4 H's framework for error states

**File:** `src/pages/WorkshopBuilderPage.tsx` (lines 114-127)
**Priority:** Medium

---

#### 7C. Save Status Messages

**Current:**
```tsx
{isSaving ? 'Saving...' :
 hasUnsavedChanges ? 'Unsaved changes' :
 lastSavedAt ? `Saved ${formatRelativeTime(lastSavedAt)}` :
 'All changes saved'}
```

**Recommended:**
```tsx
{isSaving ? 'Saving changes...' :
 hasUnsavedChanges ? 'You have unsaved changes' :
 lastSavedAt ? `Last saved ${formatRelativeTime(lastSavedAt)}` :
 'All changes saved'}
```

**Rationale:**
- **More specific:** "Saving changes" vs just "Saving"
- **More personal:** "You have" vs system statement
- **Clearer timestamp:** "Last saved" provides context
- Small improvements in clarity

**File:** `src/pages/WorkshopBuilderPage.tsx` (lines 148-157)
**Priority:** Low

---

### 8. Interactive Guidance (Missing - Should Add)

#### 8A. Canvas Instructions

**Current:**
```tsx
// No instructions visible on canvas
```

**Recommended:**
```tsx
<div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-sm text-xs text-default-600 max-w-xs">
  <p className="font-semibold mb-1">Quick Tips:</p>
  <ul className="space-y-1">
    <li>• Click walls to add features</li>
    <li>• Drag obstacles to position them</li>
    <li>• Hold Space + drag to pan</li>
    <li>• Scroll to zoom in/out</li>
    <li>• Right-click for options</li>
  </ul>
  <button className="text-primary text-xs mt-2">Dismiss</button>
</div>
```

**Rationale:**
- **Progressive disclosure:** Show on first visit, then dismissible
- **Multiple learning styles:** Visual + text instructions
- **Reduces friction:** Users don't need to discover shortcuts
- Follows contextual tutorials (Lines 136-139)

**File:** `src/components/workshops/FloorPlan2D.tsx` (as overlay)
**Priority:** Medium - Could be deferred to Phase 3C

---

## Summary of Changes by Priority

### HIGH Priority (Error Messages - 4 H's Framework)
1. ✅ Wall constraint add error - Provide specific guidance
2. ✅ Wall constraint delete error - Explain causes and recovery
3. ✅ Workshop not found error - Humanize and guide next steps

### MEDIUM Priority (Clarity & Guidance)
4. ✅ Empty state for walls with no constraints
5. ✅ Empty state for workshop with no obstacles
6. ✅ Obstacle palette header and instructions
7. ✅ Zoom control tooltips
8. ✅ Interactive canvas guidance overlay

### LOW Priority (Polish)
9. ✅ Context menu button labels
10. ✅ Builder sidebar headers
11. ✅ Save status message refinement
12. ✅ Loading state personalization

### NITPICKS
- Keyboard shortcuts in button labels
- Minor tone adjustments

---

## Implementation Strategy

### Phase 3C (Error Handling Focus)
1. Implement all HIGH priority error message improvements
2. Replace `alert()` with toast notifications
3. Add error recovery guidance throughout

### Phase 3D (Guidance & Polish)
4. Add empty states with actionable guidance
5. Implement tooltips for progressive disclosure
6. Add dismissible quick tips overlay for first-time users
7. Refine all copy per MEDIUM/LOW recommendations

---

## Copy Patterns Established

### Error Message Template (4 H's)
```
We couldn't [action] right now.

• [Specific check 1]
• [Specific check 2]
• [Fallback action]
```

### Empty State Template
```
[Friendly status]
[1-2 sentence explanation of value]
[Suggested action or benefit]
```

### Button Label Pattern
```
[Action Verb] [Object] [(Optional shortcut)]
Examples: "Edit Details", "Remove Item", "Clear Selection (Esc)"
```

---

## VOICE Method Application

All copy improvements follow the VOICE framework:
- **V**alue-driven: Focus on user benefits
- **O**ccasion-appropriate: Professional but approachable tone
- **I**nclusive: Accessible language, no jargon
- **C**lear: Specific, actionable, unambiguous
- **E**mpathetic: Acknowledges user goals and challenges

---

## References

- UX Copywriting Guide: `/Users/ericdumesnil/.claude/context/ux-copywriting.md`
- VOICE Method: Lines 180-186
- 4 H's Framework: Lines 81-87
- Progressive Disclosure: Lines 35-47
- Empty States: Lines 95-100
