import { Workshop } from '@/types/workshop'
import { WallSide } from '@/types/constraints'
import { Card, CardBody, CardHeader } from '@heroui/react'
import { WallConstraintPanel } from './WallConstraintPanel'

interface BuilderSidebarProps {
  workshop: Workshop
  selectedWall: WallSide | null
  selectedObstacle: string | null
  onUpdateWorkshop: (updates: Partial<Workshop>) => void
  onClearSelection: () => void
}

export function BuilderSidebar({
  workshop,
  selectedWall,
  selectedObstacle,
  onUpdateWorkshop,
  onClearSelection,
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
    <div className="p-4 space-y-4">
      {/* Workshop Info */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Workshop Details</h3>
        </CardHeader>
        <CardBody>
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
              <span className="text-default-600">Walls:</span>
              <span className="ml-2 font-medium">{workshop.constraints.walls.length}</span>
            </div>
            <div>
              <span className="text-default-600">Obstacles:</span>
              <span className="ml-2 font-medium">{workshop.constraints.obstacles.length}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {selectedObstacle && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Selected Obstacle</h3>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-600">
              Obstacle editing will be implemented in Stage 3
            </p>
            <button
              onClick={onClearSelection}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Clear Selection
            </button>
          </CardBody>
        </Card>
      )}

      {/* Empty State */}
      {!selectedWall && !selectedObstacle && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Getting Started</h3>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-600">
              Click on a wall or obstacle to edit it. Right-click for more options.
            </p>
            <div className="mt-4 space-y-2 text-xs text-default-500">
              <p>• Click walls to add constraints</p>
              <p>• Drag obstacles from palette (Stage 3)</p>
              <p>• Use mouse wheel to zoom</p>
              <p>• Middle-click to pan</p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
