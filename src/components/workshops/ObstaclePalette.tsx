import { Card, CardBody } from '@heroui/react'

interface ObstacleTemplate {
  id: string
  name: string
  dimensions: {
    length: number // inches
    width: number // inches
    height: number // inches
  }
  description: string
}

const OBSTACLE_TEMPLATES: ObstacleTemplate[] = [
  {
    id: 'column-6x6',
    name: 'Support Column (6"×6")',
    dimensions: { length: 6, width: 6, height: 96 },
    description: 'Standard structural support column',
  },
  {
    id: 'column-8x8',
    name: 'Support Column (8"×8")',
    dimensions: { length: 8, width: 8, height: 96 },
    description: 'Heavy-duty structural support column',
  },
  {
    id: 'furnace-24x24',
    name: 'Furnace (24"×24")',
    dimensions: { length: 24, width: 24, height: 60 },
    description: 'HVAC furnace unit',
  },
  {
    id: 'water-heater-22x22',
    name: 'Water Heater (22"×22")',
    dimensions: { length: 22, width: 22, height: 48 },
    description: 'Standard water heater',
  },
  {
    id: 'stairs-36x120',
    name: 'Stairs (36"×120")',
    dimensions: { length: 120, width: 36, height: 108 },
    description: 'Standard basement staircase',
  },
  {
    id: 'electrical-panel-18x6',
    name: 'Electrical Panel (18"×6")',
    dimensions: { length: 18, width: 6, height: 60 },
    description: 'Main electrical service panel',
  },
]

interface ObstaclePaletteProps {
  onAddObstacle: (template: ObstacleTemplate) => void
  hasObstacles?: boolean
}

export function ObstaclePalette({ onAddObstacle, hasObstacles = false }: ObstaclePaletteProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">Add Obstacles</h3>

      {!hasObstacles ? (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-primary-900 font-medium mb-1">
            Start mapping your workshop
          </p>
          <p className="text-xs text-primary-800">
            Add obstacles like columns, stairs, or utilities to create an accurate layout
          </p>
        </div>
      ) : (
        <p className="text-sm text-default-700 mb-4">
          Click to add obstacles to your workshop
        </p>
      )}

      <div className="space-y-2">
        {OBSTACLE_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            isPressable
            onPress={() => onAddObstacle(template)}
            className="hover:border-primary transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            <CardBody className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-default-700 mt-0.5">
                    {template.dimensions.length}" × {template.dimensions.width}" × {template.dimensions.height}"
                  </p>
                  <p className="text-xs text-default-600 mt-1">{template.description}</p>
                </div>
                <div className="flex-shrink-0 text-primary text-xl">+</div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-4 p-3 bg-default-100 rounded-lg">
        <p className="text-xs text-default-600">
          <strong>Tip:</strong> After adding, drag obstacles to position them accurately.
          Right-click for options.
        </p>
      </div>
    </div>
  )
}
