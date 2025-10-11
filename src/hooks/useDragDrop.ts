import { useState, useCallback } from 'react'
import { Workshop } from '@/types/workshop'
import { WallSide, WallConstraint } from '@/types/constraints'

interface DragState {
  isDragging: boolean
  dragType: 'wall-constraint' | 'obstacle' | null
  dragId: string | null
  startPos: { x: number; y: number } // Workshop coordinates
  currentPos: { x: number; y: number } // Workshop coordinates (raw, unsnapped)
  offset: { x: number; y: number } // Offset from element origin to click point
  hoverWall?: WallSide // Wall being hovered over (for preview)
  animationScale?: number // Animation scale for pick/drop effects
}

interface SnapResult {
  position: { x: number; y: number }
  snappedToWall?: WallSide
  snappedToGrid: boolean
}

const GRID_SIZE = 6 // inches
const WALL_SNAP_THRESHOLD = 12 // inches - snap when within 12" of wall

export function useDragDrop(workshop: Workshop) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    dragId: null,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    hoverWall: undefined,
  })

  // Snap position to 6" grid
  const snapToGrid = useCallback((x: number, y: number): { x: number; y: number } => {
    return {
      x: Math.round(x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(y / GRID_SIZE) * GRID_SIZE,
    }
  }, [])

  // Check if position is near a wall and return snap position along wall
  const snapToWall = useCallback((
    x: number,
    y: number,
    elementWidth: number,
    elementHeight: number
  ): SnapResult | null => {
    const { length, width } = workshop.dimensions

    // North wall (top, y=0)
    if (y <= WALL_SNAP_THRESHOLD) {
      const snappedX = snapToGrid(x, 0).x
      return {
        position: { x: Math.max(0, Math.min(snappedX, length - elementWidth)), y: 0 },
        snappedToWall: WallSide.NORTH,
        snappedToGrid: true,
      }
    }

    // South wall (bottom, y=width)
    if (y >= width - WALL_SNAP_THRESHOLD) {
      const snappedX = snapToGrid(x, 0).x
      return {
        position: { x: Math.max(0, Math.min(snappedX, length - elementWidth)), y: width - elementHeight },
        snappedToWall: WallSide.SOUTH,
        snappedToGrid: true,
      }
    }

    // East wall (right, x=length)
    if (x >= length - WALL_SNAP_THRESHOLD) {
      const snappedY = snapToGrid(0, y).y
      return {
        position: { x: length - elementWidth, y: Math.max(0, Math.min(snappedY, width - elementHeight)) },
        snappedToWall: WallSide.EAST,
        snappedToGrid: true,
      }
    }

    // West wall (left, x=0)
    if (x <= WALL_SNAP_THRESHOLD) {
      const snappedY = snapToGrid(0, y).y
      return {
        position: { x: 0, y: Math.max(0, Math.min(snappedY, width - elementHeight)) },
        snappedToWall: WallSide.WEST,
        snappedToGrid: true,
      }
    }

    return null
  }, [workshop.dimensions, snapToGrid])

  // Start dragging a wall constraint
  const startDragWallConstraint = useCallback((
    constraintId: string,
    clickX: number, // Workshop coords
    clickY: number
  ) => {
    const constraint = workshop.constraints.walls.find(c => c.id === constraintId)
    if (!constraint) return

    // Calculate offset from constraint origin to click point
    const constraintPos = getWallConstraintPosition(constraint, workshop.dimensions)
    const offset = {
      x: clickX - constraintPos.x,
      y: clickY - constraintPos.y,
    }

    setDragState({
      isDragging: true,
      dragType: 'wall-constraint',
      dragId: constraintId,
      startPos: constraintPos,
      currentPos: constraintPos,
      offset,
    })
  }, [workshop])

  // Start dragging an obstacle
  const startDragObstacle = useCallback((
    obstacleId: string,
    clickX: number, // Workshop coords
    clickY: number
  ) => {
    const obstacle = workshop.constraints.obstacles.find(o => o.id === obstacleId)
    if (!obstacle) return

    const offset = {
      x: clickX - obstacle.position.x,
      y: clickY - obstacle.position.y,
    }

    setDragState({
      isDragging: true,
      dragType: 'obstacle',
      dragId: obstacleId,
      startPos: obstacle.position,
      currentPos: obstacle.position,
      offset,
    })
  }, [workshop])

  // Update drag position (called on mousemove) - NO SNAPPING during drag, just track raw position
  const updateDragPosition = useCallback((
    workshopX: number,
    workshopY: number
  ): WallSide | undefined => {
    if (!dragState.isDragging || !dragState.dragId) return undefined

    // Calculate new position accounting for offset (no snapping during drag)
    const rawX = workshopX - dragState.offset.x
    const rawY = workshopY - dragState.offset.y

    // Determine which wall (if any) we're hovering near for visual preview
    let hoverWall: WallSide | undefined
    if (dragState.dragType === 'wall-constraint') {
      const constraint = workshop.constraints.walls.find(c => c.id === dragState.dragId)
      if (constraint) {
        const wallSnap = snapToWall(rawX, rawY, constraint.width, 8)
        hoverWall = wallSnap?.snappedToWall
      }
    } else if (dragState.dragType === 'obstacle') {
      const obstacle = workshop.constraints.obstacles.find(o => o.id === dragState.dragId)
      if (obstacle) {
        const wallSnap = snapToWall(rawX, rawY, obstacle.dimensions.length, obstacle.dimensions.width)
        hoverWall = wallSnap?.snappedToWall
      }
    }

    setDragState(prev => ({
      ...prev,
      currentPos: { x: rawX, y: rawY },
      hoverWall,
    }))

    return hoverWall
  }, [dragState, workshop, snapToWall])

  // End drag and return final position WITH SNAPPING
  const endDrag = useCallback((): SnapResult | null => {
    if (!dragState.isDragging) return null

    const rawPosition = dragState.currentPos
    const finalId = dragState.dragId
    let snapResult: SnapResult | null = null

    // Apply snapping on release
    if (dragState.dragType === 'wall-constraint') {
      const constraint = workshop.constraints.walls.find(c => c.id === finalId)
      if (!constraint) return null

      // Try wall snap first
      snapResult = snapToWall(rawPosition.x, rawPosition.y, constraint.width, 8)

      // If no wall snap, snap to grid on current wall
      if (!snapResult) {
        const gridSnapped = snapToGrid(rawPosition.x, rawPosition.y)
        const pos = getWallConstraintPosition(constraint, workshop.dimensions)
        snapResult = {
          position: { x: gridSnapped.x, y: pos.y },
          snappedToWall: constraint.wall,
          snappedToGrid: true,
        }
      }
    } else if (dragState.dragType === 'obstacle') {
      const obstacle = workshop.constraints.obstacles.find(o => o.id === finalId)
      if (!obstacle) return null

      // Try wall snap first
      snapResult = snapToWall(
        rawPosition.x,
        rawPosition.y,
        obstacle.dimensions.length,
        obstacle.dimensions.width
      )

      // If no wall snap, snap to grid
      if (!snapResult) {
        const gridSnapped = snapToGrid(rawPosition.x, rawPosition.y)
        snapResult = {
          position: gridSnapped,
          snappedToGrid: true,
        }
      }
    }

    setDragState({
      isDragging: false,
      dragType: null,
      dragId: null,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      hoverWall: undefined,
    })

    return snapResult
  }, [dragState, workshop, snapToWall, snapToGrid])

  // Cancel drag (e.g., on Escape key)
  const cancelDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      dragType: null,
      dragId: null,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      hoverWall: undefined,
      animationScale: undefined,
    })
  }, [])

  // Update animation scale
  const setAnimationScale = useCallback((scale: number) => {
    setDragState(prev => ({ ...prev, animationScale: scale }))
  }, [])

  return {
    dragState,
    startDragWallConstraint,
    startDragObstacle,
    updateDragPosition,
    endDrag,
    cancelDrag,
    setAnimationScale,
  }
}

// Helper: Get wall constraint position in workshop coordinates
function getWallConstraintPosition(
  constraint: WallConstraint,
  dimensions: { length: number; width: number }
): { x: number; y: number } {
  switch (constraint.wall) {
    case WallSide.NORTH:
      return { x: constraint.position, y: 0 }
    case WallSide.SOUTH:
      return { x: constraint.position, y: dimensions.width }
    case WallSide.EAST:
      return { x: dimensions.length, y: constraint.position }
    case WallSide.WEST:
      return { x: 0, y: constraint.position }
    default:
      return { x: 0, y: 0 }
  }
}
