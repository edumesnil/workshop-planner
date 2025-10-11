import { useRef, useEffect, useState } from 'react'
import { Workshop } from '@/types/workshop'
import { WallSide } from '@/types/constraints'
import { useCanvasContext } from '@/hooks/useCanvasContext'
import { renderFloorPlan } from '@/utils/floorPlanRenderer'
import { detectClick } from '@/hooks/useFloorPlanInteraction'
import { useDragDrop } from '@/hooks/useDragDrop'
import { ContextMenu } from './ContextMenu'
import { db } from '@/services/supabase'

interface FloorPlan2DProps {
  workshop: Workshop
  selectedWall: WallSide | null
  selectedObstacle: string | null
  onSelectWall: (wall: WallSide | null) => void
  onSelectObstacle: (obstacleId: string | null) => void
  onUpdateWorkshop: (updates: Partial<Workshop>) => void
}

interface ContextMenuState {
  show: boolean
  x: number
  y: number
  type: 'wall-constraint' | 'obstacle' | null
  targetId: string | null
}

export function FloorPlan2D({
  workshop,
  selectedWall,
  selectedObstacle,
  onSelectWall,
  onSelectObstacle,
  onUpdateWorkshop,
}: FloorPlan2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { ctx, scale, offset } = useCanvasContext(canvasRef, containerRef, workshop)

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    type: null,
    targetId: null,
  })

  const {
    dragState,
    startDragWallConstraint,
    startDragObstacle,
    updateDragPosition,
    endDrag,
    cancelDrag,
  } = useDragDrop(workshop)

  // Render loop
  useEffect(() => {
    if (!ctx || !canvasRef.current) return

    const canvas = canvasRef.current

    renderFloorPlan({
      canvas,
      ctx,
      workshop,
      scale,
      offset,
      gridSize: 6, // 6" grid
      selectedWall,
      selectedObstacle,
      dragState: dragState.isDragging ? dragState : undefined,
    })
  }, [ctx, workshop, scale, offset, selectedWall, selectedObstacle, dragState])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const clickResult = detectClick(x, y, workshop, scale, offset)

    // Convert to workshop coordinates
    const workshopX = (x - offset.x) / scale
    const workshopY = (y - offset.y) / scale

    if (clickResult.type === 'wall-constraint' && clickResult.constraintId) {
      startDragWallConstraint(clickResult.constraintId, workshopX, workshopY)
    } else if (clickResult.type === 'obstacle' && clickResult.obstacleId) {
      startDragObstacle(clickResult.obstacleId, workshopX, workshopY)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragState.isDragging) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const workshopX = (x - offset.x) / scale
    const workshopY = (y - offset.y) / scale

    updateDragPosition(workshopX, workshopY)
  }

  const handleMouseUp = async () => {
    if (!dragState.isDragging) return

    const snapResult = endDrag()
    if (!snapResult) return

    // Update database with new position
    if (dragState.dragType === 'wall-constraint' && dragState.dragId) {
      const constraint = workshop.constraints.walls.find(c => c.id === dragState.dragId)
      if (!constraint) return

      const updatedConstraint = {
        ...constraint,
        wall: snapResult.snappedToWall || constraint.wall,
        position: snapResult.snappedToWall
          ? snapResult.snappedToWall === WallSide.NORTH || snapResult.snappedToWall === WallSide.SOUTH
            ? snapResult.position.x
            : snapResult.position.y
          : constraint.position,
      }

      const updatedWalls = workshop.constraints.walls.map(c =>
        c.id === dragState.dragId ? updatedConstraint : c
      )

      const updatedConstraints = { ...workshop.constraints, walls: updatedWalls }
      const { error } = await db.workshops.update(workshop.id, { constraints: updatedConstraints })
      if (!error) {
        onUpdateWorkshop({ constraints: updatedConstraints })
      }
    } else if (dragState.dragType === 'obstacle' && dragState.dragId) {
      const updatedObstacles = workshop.constraints.obstacles.map(o =>
        o.id === dragState.dragId
          ? { ...o, position: snapResult.position }
          : o
      )

      const updatedConstraints = { ...workshop.constraints, obstacles: updatedObstacles }
      const { error } = await db.workshops.update(workshop.id, { constraints: updatedConstraints })
      if (!error) {
        onUpdateWorkshop({ constraints: updatedConstraints })
      }
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Only handle clicks if not dragging
    if (dragState.isDragging) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const clickResult = detectClick(x, y, workshop, scale, offset)

    if (clickResult.type === 'wall-constraint' && clickResult.constraintId) {
      // Wall constraint clicked - select its wall
      onSelectWall(clickResult.wallSide || null)
      onSelectObstacle(null)
    } else if (clickResult.type === 'wall' && clickResult.wallSide) {
      onSelectWall(clickResult.wallSide)
      onSelectObstacle(null)
    } else if (clickResult.type === 'obstacle' && clickResult.obstacleId) {
      onSelectObstacle(clickResult.obstacleId)
      onSelectWall(null)
    } else {
      onSelectWall(null)
      onSelectObstacle(null)
    }
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const clickResult = detectClick(x, y, workshop, scale, offset)

    if (clickResult.type === 'wall-constraint' && clickResult.constraintId) {
      setContextMenu({
        show: true,
        x: e.clientX,
        y: e.clientY,
        type: 'wall-constraint',
        targetId: clickResult.constraintId,
      })
    } else if (clickResult.type === 'obstacle' && clickResult.obstacleId) {
      setContextMenu({
        show: true,
        x: e.clientX,
        y: e.clientY,
        type: 'obstacle',
        targetId: clickResult.obstacleId,
      })
    }
  }

  const handleDeleteConstraint = async (constraintId: string) => {
    const updatedWalls = workshop.constraints.walls.filter(c => c.id !== constraintId)
    const updatedConstraints = { ...workshop.constraints, walls: updatedWalls }

    const { error } = await db.workshops.update(workshop.id, { constraints: updatedConstraints })
    if (!error) {
      onUpdateWorkshop({ constraints: updatedConstraints })
      onSelectWall(null)
    }
  }

  const handleDeleteObstacle = async (obstacleId: string) => {
    const updatedObstacles = workshop.constraints.obstacles.filter(o => o.id !== obstacleId)
    const updatedConstraints = { ...workshop.constraints, obstacles: updatedObstacles }

    const { error } = await db.workshops.update(workshop.id, { constraints: updatedConstraints })
    if (!error) {
      onUpdateWorkshop({ constraints: updatedConstraints })
      onSelectObstacle(null)
    }
  }

  // Handle Escape key to cancel drag
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dragState.isDragging) {
        cancelDrag()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dragState.isDragging, cancelDrag])

  return (
    <div ref={containerRef} className="w-full h-full bg-default-100">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        className={`w-full h-full ${dragState.isDragging ? 'cursor-grabbing' : 'cursor-crosshair'}`}
      />
      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onEdit={() => {
            if (contextMenu.type === 'wall-constraint' && contextMenu.targetId) {
              const constraint = workshop.constraints.walls.find(c => c.id === contextMenu.targetId)
              if (constraint) {
                onSelectWall(constraint.wall)
                onSelectObstacle(null)
              }
            } else if (contextMenu.type === 'obstacle' && contextMenu.targetId) {
              onSelectObstacle(contextMenu.targetId)
              onSelectWall(null)
            }
          }}
          onDelete={() => {
            if (contextMenu.type === 'wall-constraint' && contextMenu.targetId) {
              handleDeleteConstraint(contextMenu.targetId)
            } else if (contextMenu.type === 'obstacle' && contextMenu.targetId) {
              handleDeleteObstacle(contextMenu.targetId)
            }
          }}
          onClose={() => setContextMenu({ show: false, x: 0, y: 0, type: null, targetId: null })}
        />
      )}
    </div>
  )
}
