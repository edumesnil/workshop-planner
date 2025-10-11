import { Button } from '@heroui/react'

interface FloorPlanControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFitToView: () => void
  onReset: () => void
}

export function FloorPlanControls({ zoom, onZoomIn, onZoomOut, onFitToView, onReset }: FloorPlanControlsProps) {
  const zoomPercent = Math.round(zoom * 100)

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 border rounded-lg px-2 py-1 bg-white shadow-sm">
        <Button
          size="sm"
          variant="light"
          isIconOnly
          onPress={onZoomOut}
          title="Zoom Out"
          isDisabled={zoom <= 0.25}
        >
          −
        </Button>
        <span className="text-xs text-default-600 min-w-[50px] text-center font-medium">
          {zoomPercent}%
        </span>
        <Button
          size="sm"
          variant="light"
          isIconOnly
          onPress={onZoomIn}
          title="Zoom In"
          isDisabled={zoom >= 4.0}
        >
          +
        </Button>
      </div>

      <Button
        size="sm"
        variant="light"
        onPress={onFitToView}
        title="Fit workshop to view"
      >
        Fit to View
      </Button>

      <Button
        size="sm"
        variant="light"
        onPress={onReset}
        title="Reset zoom and pan"
      >
        Reset
      </Button>
    </div>
  )
}
