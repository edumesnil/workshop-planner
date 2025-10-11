import { useRef, useEffect, useState } from 'react'
import { Workshop } from '@/types/workshop'
import { WallSide } from '@/types/constraints'
import { useCanvasContext } from '@/hooks/useCanvasContext'
import { useFloorPlanZoom } from '@/hooks/useFloorPlanZoom'
import { renderFloorPlan } from '@/utils/floorPlanRenderer'
import { detectClick } from '@/hooks/useFloorPlanInteraction'
import { useDragDrop } from '@/hooks/useDragDrop'
import { ContextMenu } from './ContextMenu'
import { FloorPlanControls } from './FloorPlanControls'

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
  const { ctx, scale: baseScale, offset: baseOffset } = useCanvasContext(canvasRef, containerRef, workshop)

  const {
    zoom,
    panOffset,
    isPanning,
    handleWheel,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    zoomIn,
    zoomOut,
    resetView,
    fitToView,
  } = useFloorPlanZoom(canvasRef, workshop, baseScale, baseOffset)

  // Combined scale and offset (base + zoom/pan)
  const scale = baseScale * zoom
  const offset = {
    x: baseOffset.x + panOffset.x,
    y: baseOffset.y + panOffset.y,
  }

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    type: null,
    targetId: null,
  })

  const [dropAnimationId, setDropAnimationId] = useState<string | null>(null)
  const [dropAnimationScale, setDropAnimationScale] = useState<number>(1.0)
  const [spacePressed, setSpacePressed] = useState(false)

  const {
    dragState,
    startDragWallConstraint,
    startDragObstacle,
    updateDragPosition,
    endDrag,
    cancelDrag,
    setAnimationScale,
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
      dropAnimation: dropAnimationId ? { id: dropAnimationId, scale: dropAnimationScale } : null,
    })
  }, [ctx, workshop, scale, offset, selectedWall, selectedObstacle, dragState, dropAnimationId, dropAnimationScale])

  // Pick animation effect (scale up when grabbing)
  useEffect(() => {
    if (!dragState.isDragging) return

    const startTime = Date.now()
    const duration = 150 // ms - faster than drop
    let animationFrame: number

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out quad for smooth scale up
      const easeOutQuad = (t: number) => t * (2 - t)

      // Scale from 1.0 up to 1.1
      const animScale = 1 + (0.1 * easeOutQuad(progress))

      setAnimationScale(animScale)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        // Keep at final scale while dragging
        setAnimationScale(1.1)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [dragState.isDragging, dragState.dragId, setAnimationScale])

  // Drop animation effect (elastic bounce when releasing)
  useEffect(() => {
    if (!dropAnimationId) return

    const startTime = Date.now()
    const duration = 300 // ms
    let animationFrame: number

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Elastic ease-out for bounce effect
      const easeOutElastic = (t: number) => {
        const c4 = (2 * Math.PI) / 3
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
      }

      // Scale from 1.1 down to 1.0 with elastic bounce
      const animScale = 1 + (0.1 * (1 - easeOutElastic(progress)))

      setDropAnimationScale(animScale)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setDropAnimationId(null)
        setDropAnimationScale(1.0)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [dropAnimationId])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Handle pan start (middle button or left button with spacebar)
    if (e.button === 1 || (e.button === 0 && spacePressed)) {
      handlePanStart(e)
      return
    }

    // Don't start drag on right-click
    if (e.button !== 0) return

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
    // Handle panning
    if (isPanning) {
      handlePanMove(e)
      return
    }

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

  const handleMouseUp = () => {
    // End panning
    if (isPanning) {
      handlePanEnd()
      return
    }

    if (!dragState.isDragging) return

    const dragId = dragState.dragId
    const dragType = dragState.dragType

    const snapResult = endDrag()
    if (!snapResult) return

    // Update local state (optimistic update) - parent will handle database save
    if (dragType === 'wall-constraint' && dragId) {
      const constraint = workshop.constraints.walls.find(c => c.id === dragId)
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
        c.id === dragId ? updatedConstraint : c
      )

      const updatedConstraints = { ...workshop.constraints, walls: updatedWalls }

      // Update local state immediately
      onUpdateWorkshop({ constraints: updatedConstraints })

      // Start drop animation
      setDropAnimationId(dragId)
      setDropAnimationScale(1.1)
    } else if (dragType === 'obstacle' && dragId) {
      const updatedObstacles = workshop.constraints.obstacles.map(o =>
        o.id === dragId
          ? { ...o, position: snapResult.position }
          : o
      )

      const updatedConstraints = { ...workshop.constraints, obstacles: updatedObstacles }

      // Update local state immediately
      onUpdateWorkshop({ constraints: updatedConstraints })

      // Start drop animation
      setDropAnimationId(dragId)
      setDropAnimationScale(1.1)
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

  const handleDeleteConstraint = (constraintId: string) => {
    const updatedWalls = workshop.constraints.walls.filter(c => c.id !== constraintId)
    const updatedConstraints = { ...workshop.constraints, walls: updatedWalls }

    // Update local state - parent will handle database save
    onUpdateWorkshop({ constraints: updatedConstraints })
    onSelectWall(null)
  }

  const handleDeleteObstacle = (obstacleId: string) => {
    const updatedObstacles = workshop.constraints.obstacles.filter(o => o.id !== obstacleId)
    const updatedConstraints = { ...workshop.constraints, obstacles: updatedObstacles }

    // Update local state - parent will handle database save
    onUpdateWorkshop({ constraints: updatedConstraints })
    onSelectObstacle(null)
  }

  // Handle keyboard events (Escape, Space, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape: Cancel drag
      if (e.key === 'Escape' && dragState.isDragging) {
        cancelDrag()
      }

      // Space: Enable pan mode
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        setSpacePressed(true)
      }

      // Delete/Backspace: Delete selected element
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        if (selectedWall) {
          // Delete all constraints on selected wall
          const updatedWalls = workshop.constraints.walls.filter(c => c.wall !== selectedWall)
          const updatedConstraints = { ...workshop.constraints, walls: updatedWalls }
          onUpdateWorkshop({ constraints: updatedConstraints })
          onSelectWall(null)
        } else if (selectedObstacle) {
          // Delete selected obstacle
          handleDeleteObstacle(selectedObstacle)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        setSpacePressed(false)
        // End panning if space is released
        if (isPanning) {
          handlePanEnd()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [dragState.isDragging, isPanning, selectedWall, selectedObstacle, workshop.constraints, cancelDrag, handlePanEnd, onUpdateWorkshop, onSelectWall])

  // Prevent default wheel behavior on canvas to stop page scrolling
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const preventScroll = (e: WheelEvent) => {
      e.preventDefault()
    }

    // Use passive: false to allow preventDefault
    canvas.addEventListener('wheel', preventScroll, { passive: false })
    return () => canvas.removeEventListener('wheel', preventScroll)
  }, [canvasRef])

  return (
    <div ref={containerRef} className="w-full h-full bg-default-100 relative">
      {/* Zoom controls - positioned top-left */}
      <div className="absolute top-4 left-4 z-10">
        <FloorPlanControls
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFitToView={fitToView}
          onReset={resetView}
        />
      </div>

      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handlePanEnd}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
        className={`w-full h-full ${
          isPanning ? 'cursor-grabbing' :
          spacePressed ? 'cursor-grab' :
          dragState.isDragging ? 'cursor-grabbing' :
          'cursor-crosshair'
        }`}
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
