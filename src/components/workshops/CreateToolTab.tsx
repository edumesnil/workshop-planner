import { useState, useEffect } from 'react'
import { Button, Input, Select, SelectItem, Checkbox, Spinner, Card, CardBody } from '@heroui/react'
import { ToolTemplateRow } from '@/types/database'
import { ToolCategory, TOOL_CATEGORY_LABELS } from '@/types/toolCategory'
import { useAuthStore } from '@/stores/authStore'
import { db } from '@/services/supabase'

interface CreateToolTabProps {
  workshopId: string
  onSuccess: () => void
}

interface FormData {
  name: string
  type: string
  category: string
  length: string
  width: string
  height: string
  is_mobile: boolean
  front_clearance: string
  back_clearance: string
  left_clearance: string
  right_clearance: string
  top_clearance: string
  material_feed_length: string
  power_required: boolean
  voltage: string
  dust_collection: boolean
}

const initialFormData: FormData = {
  name: '',
  type: '',
  category: ToolCategory.POWER_TOOLS,
  length: '',
  width: '',
  height: '',
  is_mobile: false,
  front_clearance: '0',
  back_clearance: '0',
  left_clearance: '0',
  right_clearance: '0',
  top_clearance: '0',
  material_feed_length: '',
  power_required: false,
  voltage: '110',
  dust_collection: false
}

export function CreateToolTab({ workshopId, onSuccess }: CreateToolTabProps) {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [templates, setTemplates] = useState<ToolTemplateRow[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setTemplatesLoading(true)
    try {
      const { data, error } = await db.toolTemplates.getAll()
      if (error) throw error
      setTemplates(data || [])
    } catch (err) {
      console.error('Failed to load templates:', err)
    } finally {
      setTemplatesLoading(false)
    }
  }

  const applyTemplate = (template: ToolTemplateRow) => {
    setFormData({
      name: template.name,
      type: '',
      category: template.category || ToolCategory.POWER_TOOLS,
      length: template.dimensions.length.toString(),
      width: template.dimensions.width.toString(),
      height: template.dimensions.height.toString(),
      is_mobile: template.is_mobile,
      front_clearance: template.min_clearance.front.toString(),
      back_clearance: template.min_clearance.back.toString(),
      left_clearance: template.min_clearance.left.toString(),
      right_clearance: template.min_clearance.right.toString(),
      top_clearance: template.min_clearance.top.toString(),
      material_feed_length: template.material_feed_length?.toString() || '',
      power_required: !!template.power_requirement,
      voltage: template.power_requirement?.voltage.toString() || '110',
      dust_collection: template.dust_collection
    })
    setShowAdvanced(true)
  }

  const handleSubmit = async () => {
    if (!user) return

    // Validation
    if (!formData.name.trim()) {
      setError('Tool name is required')
      return
    }
    if (!formData.length || !formData.width || !formData.height) {
      setError('All dimensions are required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const toolData = {
        user_id: user.id,
        name: formData.name.trim(),
        type: formData.type.trim(),
        category: formData.category,
        dimensions: {
          length: parseFloat(formData.length),
          width: parseFloat(formData.width),
          height: parseFloat(formData.height)
        },
        is_mobile: formData.is_mobile,
        min_clearance: {
          front: parseFloat(formData.front_clearance) || 0,
          back: parseFloat(formData.back_clearance) || 0,
          left: parseFloat(formData.left_clearance) || 0,
          right: parseFloat(formData.right_clearance) || 0,
          top: parseFloat(formData.top_clearance) || 0
        },
        material_feed_length: formData.material_feed_length ? parseFloat(formData.material_feed_length) : undefined,
        power_requirement: formData.power_required ? {
          voltage: parseInt(formData.voltage),
          amperage: 15,
          phase: 1
        } : undefined,
        dust_collection: formData.dust_collection
      }

      // Create tool
      const { data: newTool, error: createError } = await db.tools.create(toolData)
      if (createError) throw createError
      if (!newTool || !newTool[0]) throw new Error('Failed to create tool')

      // Add to workshop
      const { error: addError } = await db.workshopTools.addToWorkshop(workshopId, newTool[0].id)
      if (addError) throw addError

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create tool. Check your connection and try again.")
      console.error('Failed to create tool:', err)
    } finally {
      setLoading(false)
    }
  }

  const categoryOptions = Object.entries(TOOL_CATEGORY_LABELS).map(([key, label]) => ({
    key,
    label
  }))

  return (
    <div className="py-4">
      {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-4">
          <p className="text-danger-800 text-sm">{error}</p>
        </div>
      )}

      {/* Template Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-2">Start from Template (Optional)</h4>
        {templatesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="sm" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
            {templates.map((template) => (
              <Card
                key={template.id}
                isPressable
                onPress={() => applyTemplate(template)}
                className="border hover:border-primary"
              >
                <CardBody className="p-3">
                  <p className="font-semibold text-sm">{template.name}</p>
                  <p className="text-xs text-default-400">
                    {template.dimensions.length}" × {template.dimensions.width}" × {template.dimensions.height}"
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Tool Form */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tool Name"
            placeholder="e.g., Table Saw"
            value={formData.name}
            onValueChange={(value) => setFormData({ ...formData, name: value })}
            isRequired
          />
          <Input
            label="Type / Model"
            placeholder="e.g., Cabinet Saw"
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          />
        </div>

        <Select
          label="Category"
          placeholder="Select category"
          selectedKeys={[formData.category]}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          isRequired
        >
          {categoryOptions.map((option) => (
            <SelectItem key={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        <div className="grid grid-cols-3 gap-4">
          <Input
            type="number"
            label="Length (inches)"
            placeholder="0"
            value={formData.length}
            onValueChange={(value) => setFormData({ ...formData, length: value })}
            isRequired
          />
          <Input
            type="number"
            label="Width (inches)"
            placeholder="0"
            value={formData.width}
            onValueChange={(value) => setFormData({ ...formData, width: value })}
            isRequired
          />
          <Input
            type="number"
            label="Height (inches)"
            placeholder="0"
            value={formData.height}
            onValueChange={(value) => setFormData({ ...formData, height: value })}
            isRequired
          />
        </div>

        <Checkbox
          isSelected={formData.is_mobile}
          onValueChange={(checked) => setFormData({ ...formData, is_mobile: checked })}
        >
          Mobile tool (on casters or benchtop)
        </Checkbox>

        <div className="flex gap-4">
          <Checkbox
            isSelected={formData.power_required}
            onValueChange={(checked) => setFormData({ ...formData, power_required: checked })}
          >
            Requires power
          </Checkbox>
          <Checkbox
            isSelected={formData.dust_collection}
            onValueChange={(checked) => setFormData({ ...formData, dust_collection: checked })}
          >
            Dust collection required
          </Checkbox>
        </div>

        {formData.power_required && (
          <Select
            label="Voltage"
            placeholder="Select voltage"
            selectedKeys={[formData.voltage]}
            onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
          >
            <SelectItem key="110">110V</SelectItem>
            <SelectItem key="220">220V</SelectItem>
          </Select>
        )}

        <Button
          variant="light"
          size="sm"
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </Button>

        {showAdvanced && (
          <div className="flex flex-col gap-4 p-4 bg-default-50 rounded-lg">
            <h4 className="font-semibold text-sm">Safety Clearances (inches)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Input
                type="number"
                label="Front"
                placeholder="0"
                value={formData.front_clearance}
                onValueChange={(value) => setFormData({ ...formData, front_clearance: value })}
              />
              <Input
                type="number"
                label="Back"
                placeholder="0"
                value={formData.back_clearance}
                onValueChange={(value) => setFormData({ ...formData, back_clearance: value })}
              />
              <Input
                type="number"
                label="Left"
                placeholder="0"
                value={formData.left_clearance}
                onValueChange={(value) => setFormData({ ...formData, left_clearance: value })}
              />
              <Input
                type="number"
                label="Right"
                placeholder="0"
                value={formData.right_clearance}
                onValueChange={(value) => setFormData({ ...formData, right_clearance: value })}
              />
              <Input
                type="number"
                label="Top"
                placeholder="0"
                value={formData.top_clearance}
                onValueChange={(value) => setFormData({ ...formData, top_clearance: value })}
              />
            </div>

            <Input
              type="number"
              label="Material Feed Length (inches)"
              placeholder="Optional"
              description="Maximum material length this tool can process"
              value={formData.material_feed_length}
              onValueChange={(value) => setFormData({ ...formData, material_feed_length: value })}
            />
          </div>
        )}

        <Button
          color="primary"
          onPress={handleSubmit}
          isLoading={loading}
          className="mt-4"
        >
          Save & Add to Workshop
        </Button>
      </div>
    </div>
  )
}
