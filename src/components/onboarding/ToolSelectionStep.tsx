import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Button, Checkbox, Spinner } from '@heroui/react'
import { supabase } from '@/services/supabase'

interface ToolTemplate {
  id: string
  name: string
  category: string
  dimensions: {
    length: number
    width: number
    height: number
  }
  is_mobile: boolean
}

interface ToolSelectionStepProps {
  onNext: (selectedToolIds: string[]) => void
  onBack: () => void
  onSkip: () => void
}

export function ToolSelectionStep({ onNext, onBack, onSkip }: ToolSelectionStepProps) {
  const [templates, setTemplates] = useState<ToolTemplate[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('tool_templates')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error

      setTemplates(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tool templates')
    } finally {
      setLoading(false)
    }
  }

  const toggleTool = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleNext = () => {
    onNext(Array.from(selectedIds))
  }

  // Group by category
  const groupedTools = templates.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {} as Record<string, ToolTemplate[]>)

  if (loading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardBody className="flex items-center justify-center p-12">
          <Spinner size="lg" />
        </CardBody>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl">
        <CardBody className="p-6">
          <p className="text-danger">{error}</p>
          <Button onPress={loadTemplates} className="mt-4">
            Retry
          </Button>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-col gap-1 px-6 pt-6">
        <h2 className="text-2xl font-bold">Select Your Tools</h2>
        <p className="text-sm text-default-500">
          Choose the tools you have or plan to use. You can add more later.
        </p>
      </CardHeader>
      <CardBody className="px-6 pb-6">
        <div className="flex flex-col gap-6">
          {/* Tool Categories */}
          {Object.entries(groupedTools).map(([category, tools]) => (
            <div key={category} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-default-600 uppercase">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tools.map((tool) => (
                  <Checkbox
                    key={tool.id}
                    isSelected={selectedIds.has(tool.id)}
                    onValueChange={() => toggleTool(tool.id)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{tool.name}</span>
                      <span className="text-xs text-default-400">
                        {(tool.dimensions.length / 12).toFixed(1)}' × {(tool.dimensions.width / 12).toFixed(1)}' × {(tool.dimensions.height / 12).toFixed(1)}'
                        {tool.is_mobile && ' • Mobile'}
                      </span>
                    </div>
                  </Checkbox>
                ))}
              </div>
            </div>
          ))}

          {/* Selection Summary */}
          <div className="p-3 bg-default-100 rounded-lg">
            <p className="text-sm text-default-600">
              {selectedIds.size === 0
                ? 'No tools selected'
                : `${selectedIds.size} tool${selectedIds.size === 1 ? '' : 's'} selected`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              <Button variant="light" onPress={onBack}>
                Back
              </Button>
              <Button variant="light" onPress={onSkip}>
                Skip for now
              </Button>
            </div>
            <Button
              color="primary"
              onPress={handleNext}
              isDisabled={selectedIds.size === 0}
            >
              Continue
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
