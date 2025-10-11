import { useState, useCallback } from 'react'
import { Workshop } from '@/types/workshop'
import { WallSide, WallConstraint } from '@/types/constraints'

interface DragState {
  isDragging: boolean
  dragType: 'wall-constraint' | 'obstacle' | null
  dragId: string | null
  startPos: { x: number; y: number } // Workshop coordinates
  currentPos: { x: number; y: number } // Workshop coordinates
  offset: { x: number; y: number } // Offset from element origin to click point
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

  // Update drag position (called on mousemove)
  const updateDragPosition = useCallback((
    workshopX: number,
    workshopY: number
  ): SnapResult | null => {
    if (!dragState.isDragging || !dragState.dragId) return null

    // Calculate new position accounting for offset
    const rawX = workshopX - dragState.offset.x
    const rawY = workshopY - dragState.offset.y

    let snapResult: SnapResult | null = null

    if (dragState.dragType === 'obstacle') {
      const obstacle = workshop.constraints.obstacles.find(o => o.id === dragState.dragId)
      if (!obstacle) return null

      // Try wall snap first
      snapResult = snapToWall(rawX, rawY, obstacle.dimensions.length, obstacle.dimensions.width)

      // If no wall snap, snap to grid
      if (!snapResult) {
        const gridSnapped = snapToGrid(rawX, rawY)
        snapResult = {
          position: gridSnapped,
          snappedToGrid: true,
        }
      }
    } else if (dragState.dragType === 'wall-constraint') {
      const constraint = workshop.constraints.walls.find(c => c.id === dragState.dragId)
      if (!constraint) return null

      // Wall constraints can move along walls or switch to different walls
      snapResult = snapToWall(rawX, rawY, constraint.width, 8) // 8px bar thickness

      // If no wall snap, keep on current wall with grid-snapped position
      if (!snapResult) {
        const pos = getWallConstraintPosition(constraint, workshop.dimensions)
        const gridSnapped = snapToGrid(rawX, rawY)
        snapResult = {
          position: { x: gridSnapped.x, y: pos.y },
          snappedToWall: constraint.wall,
          snappedToGrid: true,
        }
      }
    }

    if (snapResult) {
      setDragState(prev => ({
        ...prev,
        currentPos: snapResult!.position,
      }))
    }

    return snapResult
  }, [dragState, workshop, snapToGrid, snapToWall])

  // End drag and return final position
  const endDrag = useCallback((): SnapResult | null => {
    if (!dragState.isDragging) return null

    const finalPosition = dragState.currentPos
    const finalId = dragState.dragId

    // Determine which wall (if any) the element snapped to
    let snappedWall: WallSide | undefined
    if (dragState.dragType === 'wall-constraint') {
      const constraint = workshop.constraints.walls.find(c => c.id === finalId)
      if (constraint) {
        const wallSnap = snapToWall(finalPosition.x, finalPosition.y, constraint.width, 8)
        snappedWall = wallSnap?.snappedToWall
      }
    } else if (dragState.dragType === 'obstacle') {
      const obstacle = workshop.constraints.obstacles.find(o => o.id === finalId)
      if (obstacle) {
        const wallSnap = snapToWall(
          finalPosition.x,
          finalPosition.y,
          obstacle.dimensions.length,
          obstacle.dimensions.width
        )
        snappedWall = wallSnap?.snappedToWall
      }
    }

    setDragState({
      isDragging: false,
      dragType: null,
      dragId: null,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
    })

    return {
      position: finalPosition,
      snappedToWall: snappedWall,
      snappedToGrid: true,
    }
  }, [dragState, workshop, snapToWall])

  // Cancel drag (e.g., on Escape key)
  const cancelDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      dragType: null,
      dragId: null,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
    })
  }, [])

  return {
    dragState,
    startDragWallConstraint,
    startDragObstacle,
    updateDragPosition,
    endDrag,
    cancelDrag,
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
