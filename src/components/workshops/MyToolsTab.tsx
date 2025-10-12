import { useState, useEffect } from 'react'
import { Checkbox, Input, Spinner, Card, CardBody, Chip } from '@heroui/react'
import { ToolRow } from '@/types/database'
import { TOOL_CATEGORY_LABELS } from '@/types/toolCategory'
import { useAuthStore } from '@/stores/authStore'
import { db } from '@/services/supabase'

interface MyToolsTabProps {
  workshopId: string
  onToolsChange: () => void
}

export function MyToolsTab({ workshopId, onToolsChange }: MyToolsTabProps) {
  const { user } = useAuthStore()
  const [tools, setTools] = useState<ToolRow[]>([])
  const [workshopToolIds, setWorkshopToolIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user, workshopId])

  const loadData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Load user's tools
      const { data: toolsData, error: toolsError } = await db.tools.getAll(user.id)
      if (toolsError) throw toolsError
      setTools(toolsData || [])

      // Load workshop tools to know which are checked
      const { data: workshopToolsData, error: workshopToolsError } = await db.workshopTools.getForWorkshop(workshopId)
      if (workshopToolsError) throw workshopToolsError
      setWorkshopToolIds(new Set((workshopToolsData || []).map(t => t.id)))
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTool = async (toolId: string, isChecked: boolean) => {
    setToggling(toolId)
    try {
      if (isChecked) {
        const { error } = await db.workshopTools.addToWorkshop(workshopId, toolId)
        if (error) throw error
        setWorkshopToolIds(prev => new Set([...prev, toolId]))
      } else {
        const { error } = await db.workshopTools.removeFromWorkshop(workshopId, toolId)
        if (error) throw error
        setWorkshopToolIds(prev => {
          const next = new Set(prev)
          next.delete(toolId)
          return next
        })
      }
      onToolsChange()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update tool')
    } finally {
      setToggling(null)
    }
  }

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.type?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner label="Loading your tools..." />
      </div>
    )
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-default-500 mb-2">You don't have any tools in your library yet.</p>
        <p className="text-sm text-default-400">Switch to the "Create New Tool" tab to add one.</p>
      </div>
    )
  }

  return (
    <div className="py-4">
      <Input
        placeholder="Search your tools..."
        value={searchQuery}
        onValueChange={setSearchQuery}
        isClearable
        className="mb-4"
      />

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredTools.length === 0 ? (
          <p className="text-center text-default-500 py-8">No tools match your search.</p>
        ) : (
          filteredTools.map((tool) => {
            const isInWorkshop = workshopToolIds.has(tool.id)
            const isToggling = toggling === tool.id

            return (
              <Card key={tool.id} className="border border-default-200">
                <CardBody className="p-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      isSelected={isInWorkshop}
                      onValueChange={(checked) => handleToggleTool(tool.id, checked)}
                      isDisabled={isToggling}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{tool.name}</span>
                        {tool.is_mobile && (
                          <Chip size="sm" color="success" variant="flat">
                            Mobile
                          </Chip>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-default-600">
                        <Chip size="sm" variant="flat">
                          {TOOL_CATEGORY_LABELS[tool.category] || tool.category}
                        </Chip>
                        <span>
                          {tool.dimensions.length}" × {tool.dimensions.width}" × {tool.dimensions.height}"
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )
          })
        )}
      </div>

      <p className="text-xs text-default-400 mt-4 text-center">
        {workshopToolIds.size} {workshopToolIds.size === 1 ? 'tool' : 'tools'} in this workshop
      </p>
    </div>
  )
}
