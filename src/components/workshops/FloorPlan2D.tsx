import { useRef, useEffect } from 'react'
import { Workshop } from '@/types/workshop'
import { WallSide } from '@/types/constraints'
import { useCanvasContext } from '@/hooks/useCanvasContext'
import { renderFloorPlan } from '@/utils/floorPlanRenderer'
import { detectClick } from '@/hooks/useFloorPlanInteraction'

interface FloorPlan2DProps {
  workshop: Workshop
  selectedWall: WallSide | null
  selectedObstacle: string | null
  onSelectWall: (wall: WallSide | null) => void
  onSelectObstacle: (obstacleId: string | null) => void
  onUpdateWorkshop: (updates: Partial<Workshop>) => void
}

export function FloorPlan2D({
  workshop,
  selectedWall,
  selectedObstacle,
  onSelectWall,
  onSelectObstacle,
}: FloorPlan2DProps) {
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

    const clickResult = detectClick(x, y, workshop, scale, offset)

    if (clickResult.type === 'wall' && clickResult.wallSide) {
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
