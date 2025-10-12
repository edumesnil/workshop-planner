import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from '@heroui/react'
import { ToolRow } from '@/types/database'
import { TOOL_CATEGORY_LABELS } from '@/types/toolCategory'

interface ToolCardProps {
  tool: ToolRow
  onEdit: (tool: ToolRow) => void
  onDelete: (tool: ToolRow) => void
}

export function ToolCard({ tool, onEdit, onDelete }: ToolCardProps) {
  const categoryLabel = TOOL_CATEGORY_LABELS[tool.category] || tool.category
  const lastUpdated = new Date(tool.updated_at).toLocaleDateString()

  return (
    <Card>
      <div
        className="cursor-pointer"
        onClick={() => onEdit(tool)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onEdit(tool)
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Edit ${tool.name} tool`}
      >
        <CardHeader className="flex flex-col items-start gap-1 pb-0">
          <div className="flex items-center gap-2 w-full">
            <h3 className="text-lg font-semibold flex-1">{tool.name}</h3>
            {tool.is_mobile && (
              <Chip size="sm" color="success" variant="flat">
                Mobile
              </Chip>
            )}
          </div>
          {tool.type && (
            <p className="text-sm text-default-500">{tool.type}</p>
          )}
        </CardHeader>
        <CardBody className="pt-3">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-default-600">Category:</span>
              <Chip size="sm" variant="flat">
                {categoryLabel}
              </Chip>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-default-600">Dimensions:</span>
              <span className="font-medium">
                {tool.dimensions.length}" × {tool.dimensions.width}" × {tool.dimensions.height}"
              </span>
            </div>
            {tool.power_requirement && (
              <div className="flex items-center justify-between">
                <span className="text-default-600">Power:</span>
                <span className="font-medium">{tool.power_requirement.voltage}V</span>
              </div>
            )}
            {tool.dust_collection && (
              <div className="flex items-center justify-between">
                <span className="text-default-600">Dust Collection:</span>
                <Chip size="sm" color="primary" variant="flat">
                  Required
                </Chip>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-default-600">Last updated:</span>
              <span className="text-default-500">{lastUpdated}</span>
            </div>
          </div>
        </CardBody>
      </div>
      <CardFooter className="gap-2">
        <Button
          size="sm"
          variant="flat"
          className="flex-1"
          onPress={() => onEdit(tool)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          color="danger"
          variant="light"
          onPress={() => onDelete(tool)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
