import { useState, useEffect } from 'react'
import { Card, CardBody, Chip, Button, Spinner } from '@heroui/react'
import { ToolRow } from '@/types/database'
import { TOOL_CATEGORY_LABELS } from '@/types/toolCategory'
import { db } from '@/services/supabase'

interface WorkshopToolsListProps {
  workshopId: string
  onAddToolClick: () => void
  onRefresh?: () => void
}

export function WorkshopToolsList({ workshopId, onAddToolClick, onRefresh }: WorkshopToolsListProps) {
  const [tools, setTools] = useState<ToolRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)
  const [removeError, setRemoveError] = useState<string | null>(null)

  useEffect(() => {
    loadTools()
  }, [workshopId])

  const loadTools = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await db.workshopTools.getForWorkshop(workshopId)
      if (error) throw error
      // Extract tools from the nested structure
      const toolsData = (data || []).map((item: any) => item.tool).flat().filter(Boolean)
      setTools(toolsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tools')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveTool = async (toolId: string) => {
    setRemoving(toolId)
    setRemoveError(null)
    try {
      const { error } = await db.workshopTools.removeFromWorkshop(workshopId, toolId)
      if (error) throw error
      await loadTools()
      onRefresh?.()
    } catch (err) {
      setRemoveError(err instanceof Error ? err.message : 'Unable to remove tool from workshop. Please try again.')
    } finally {
      setRemoving(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center p-8">
          <Spinner label="Loading tools..." />
        </CardBody>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardBody className="p-4">
          <p className="text-danger text-sm">{error}</p>
          <Button size="sm" color="danger" variant="flat" className="mt-2" onPress={loadTools}>
            Try Again
          </Button>
        </CardBody>
      </Card>
    )
  }

  if (tools.length === 0) {
    return (
      <Card>
        <CardBody className="text-center p-8">
          <p className="text-default-500 mb-4">No tools in this workshop yet</p>
          <Button color="primary" onPress={onAddToolClick}>
            Add Your First Tool
          </Button>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Workshop Tools ({tools.length})</h3>
        <Button size="sm" color="primary" onPress={onAddToolClick}>
          Add Tool
        </Button>
      </div>

      {removeError && (
        <div className="p-3 bg-danger-50 border border-danger-200 rounded-md">
          <p className="text-sm text-danger-800 font-medium">Error removing tool</p>
          <p className="text-sm text-danger-600 mt-1">{removeError}</p>
        </div>
      )}

      {tools.map((tool) => (
        <Card key={tool.id} className="border border-default-200">
          <CardBody className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{tool.name}</h4>
                  {tool.is_mobile && (
                    <Chip size="sm" color="success" variant="flat">
                      Mobile
                    </Chip>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-sm text-default-600">
                  <div className="flex items-center gap-2">
                    <span className="text-default-500">Category:</span>
                    <Chip size="sm" variant="flat">
                      {TOOL_CATEGORY_LABELS[tool.category] || tool.category}
                    </Chip>
                  </div>
                  <div>
                    <span className="text-default-500">Dimensions:</span>{' '}
                    {tool.dimensions.length}" × {tool.dimensions.width}" × {tool.dimensions.height}"
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                color="danger"
                variant="light"
                onPress={() => handleRemoveTool(tool.id)}
                isLoading={removing === tool.id}
              >
                Remove
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
