import { useRef, useEffect } from 'react'
import { Workshop } from '@/types/workshop'
import { useCanvasContext } from '@/hooks/useCanvasContext'
import { renderFloorPlan } from '@/utils/floorPlanRenderer'

interface FloorPlan2DProps {
  workshop: Workshop
  selectedWall: string | null
  selectedObstacle: string | null
  onSelectWall: (wall: string | null) => void
  onSelectObstacle: (obstacleId: string | null) => void
  onUpdateWorkshop: (updates: Partial<Workshop>) => void
}

export function FloorPlan2D({
  workshop,
  selectedWall,
  selectedObstacle,
}: FloorPlan2DProps) {
  // TODO: Use these in Stage 2/3
  // onSelectWall, onSelectObstacle
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { ctx, scale, offset } = useCanvasContext(canvasRef, containerRef, workshop)

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
    })
  }, [ctx, workshop, scale, offset, selectedWall, selectedObstacle])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // TODO: Click detection logic (Stage 2)
    console.log('Canvas clicked at:', { x, y })
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    // TODO: Context menu logic (Stage 3)
    console.log('Right-click detected')
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-default-100">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onContextMenu={handleContextMenu}
        className="w-full h-full cursor-crosshair"
      />
    </div>
  )
}
