import { Workshop } from '@/types/workshop'
import { WallSide } from '@/types/constraints'
import { WallConstraintPanel } from './WallConstraintPanel'
import { ObstaclePalette } from './ObstaclePalette'

interface BuilderSidebarProps {
  workshop: Workshop
  selectedWall: WallSide | null
  selectedObstacle: string | null
  onUpdateWorkshop: (updates: Partial<Workshop>) => void
  onClearSelection: () => void
  onAddObstacle: (name: string, dimensions: { length: number; width: number; height: number }) => void
}

export function BuilderSidebar({
  workshop,
  selectedWall,
  selectedObstacle,
  onUpdateWorkshop,
  onClearSelection,
  onAddObstacle,
}: BuilderSidebarProps) {
  // Show wall constraint panel if wall is selected
  if (selectedWall) {
    return (
      <WallConstraintPanel
        workshop={workshop}
        wallSide={selectedWall}
        onUpdate={onUpdateWorkshop}
        onClearSelection={onClearSelection}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Workshop Info */}
      <div className="p-4 border-b">
        <h3 className="font-semibold mb-3">Workshop Details</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-default-600">Dimensions:</span>
            <span className="ml-2 font-medium">
              {(workshop.dimensions.length / 12).toFixed(1)}' ×{' '}
              {(workshop.dimensions.width / 12).toFixed(1)}' ×{' '}
              {(workshop.dimensions.height / 12).toFixed(1)}'
            </span>
          </div>
          <div>
            <span className="text-default-600">Constraints:</span>
            <span className="ml-2 font-medium">{workshop.constraints.walls.length} walls</span>
          </div>
          <div>
            <span className="text-default-600">Obstacles:</span>
            <span className="ml-2 font-medium">{workshop.constraints.obstacles.length} items</span>
          </div>
        </div>
      </div>

      {selectedObstacle && (
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-3">Selected Obstacle</h3>
          <p className="text-sm text-default-600 mb-3">
            Drag to reposition, right-click for options
          </p>
          <button
            onClick={onClearSelection}
            className="text-sm text-primary hover:underline"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Obstacle Palette */}
      {!selectedWall && !selectedObstacle && (
        <ObstaclePalette
          onAddObstacle={(template) => {
            onAddObstacle(template.name, template.dimensions)
          }}
        />
      )}
    </div>
  )
}
