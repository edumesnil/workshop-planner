import { Button } from '@heroui/react'

export function FloorPlanControls() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 border rounded-lg px-2 py-1 bg-white">
        <Button
          size="sm"
          variant="light"
          isIconOnly
          onPress={() => console.log('Zoom out - Stage 4')}
          title="Zoom Out"
        >
          −
        </Button>
        <span className="text-xs text-default-600 min-w-[50px] text-center">100%</span>
        <Button
          size="sm"
          variant="light"
          isIconOnly
          onPress={() => console.log('Zoom in - Stage 4')}
          title="Zoom In"
        >
          +
        </Button>
      </div>

      <Button
        size="sm"
        variant="light"
        onPress={() => console.log('Fit to view - Stage 4')}
      >
        Fit
      </Button>

      <Button
        size="sm"
        variant="light"
        onPress={() => console.log('Reset view - Stage 4')}
      >
        Reset
      </Button>
    </div>
  )
}
