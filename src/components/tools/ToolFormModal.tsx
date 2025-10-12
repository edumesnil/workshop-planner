import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Checkbox, Tabs, Tab, Card, CardBody, Spinner } from '@heroui/react'
import { useState, useEffect } from 'react'
import { ToolRow, ToolTemplateRow } from '@/types/database'
import { ToolCategory, TOOL_CATEGORY_LABELS } from '@/types/toolCategory'
import { useAuthStore } from '@/stores/authStore'
import { db } from '@/services/supabase'

interface ToolFormModalProps {
  isOpen: boolean
  tool?: ToolRow | null
  onClose: () => void
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

export function ToolFormModal({ isOpen, tool, onClose, onSuccess }: ToolFormModalProps) {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [templates, setTemplates] = useState<ToolTemplateRow[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Load templates on mount
  useEffect(() => {
    if (isOpen && !tool) {
      loadTemplates()
    }
  }, [isOpen, tool])

  // Load tool data into form when editing
  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        type: tool.type || '',
        category: tool.category,
        length: tool.dimensions.length.toString(),
        width: tool.dimensions.width.toString(),
        height: tool.dimensions.height.toString(),
        is_mobile: tool.is_mobile,
        front_clearance: tool.min_clearance.front.toString(),
        back_clearance: tool.min_clearance.back.toString(),
        left_clearance: tool.min_clearance.left.toString(),
        right_clearance: tool.min_clearance.right.toString(),
        top_clearance: tool.min_clearance.top.toString(),
        material_feed_length: tool.material_feed_length?.toString() || '',
        power_required: !!tool.power_requirement,
        voltage: tool.power_requirement?.voltage.toString() || '110',
        dust_collection: tool.dust_collection
      })
      setShowAdvanced(true) // Show advanced if editing
    } else {
      setFormData(initialFormData)
      setShowAdvanced(false)
    }
  }, [tool])

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
          amperage: 15, // Default for MVP
          phase: 1 // Default for MVP
        } : undefined,
        dust_collection: formData.dust_collection
      }

      if (tool) {
        // Update existing tool
        const { error } = await db.tools.update(tool.id, toolData)
        if (error) throw error
      } else {
        // Create new tool
        const { error } = await db.tools.create(toolData)
        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save tool. Check your connection and try again.")
      console.error('Failed to save tool:', err)
    } finally {
      setLoading(false)
    }
  }

  const categoryOptions = Object.entries(TOOL_CATEGORY_LABELS).map(([key, label]) => ({
    key,
    label
  }))

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size="3xl"
      backdrop="opaque"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {tool ? 'Edit Tool' : 'Add Tool to Library'}
            </ModalHeader>
            <ModalBody>
              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-4">
                  <p className="text-danger-800 text-sm">{error}</p>
                </div>
              )}

              {!tool && (
                <Tabs aria-label="Tool creation options" className="mb-4">
                  <Tab key="template" title="From Template">
                    <div className="py-4">
                      {templatesLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Spinner label="Loading templates..." />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                          {templates.map((template) => (
                            <Card
                              key={template.id}
                              isPressable
                              onPress={() => applyTemplate(template)}
                              className="border-2 hover:border-primary"
                            >
                              <CardBody className="p-4">
                                <h4 className="font-semibold mb-1">{template.name}</h4>
                                <p className="text-xs text-default-400">
                                  {template.dimensions.length}" × {template.dimensions.width}" × {template.dimensions.height}"
                                </p>
                                {template.is_mobile && (
                                  <p className="text-xs text-success mt-1">Mobile</p>
                                )}
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-default-500 mt-4">
                        Select a template above to pre-fill the form, then customize as needed.
                      </p>
                    </div>
                  </Tab>
                  <Tab key="custom" title="Custom Tool">
                    <p className="text-sm text-default-500 py-4">
                      Create a tool from scratch with your own specifications.
                    </p>
                  </Tab>
                </Tabs>
              )}

              {/* Tool Form */}
              <div className="flex flex-col gap-4">
                {/* Basic Information */}
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

                {/* Dimensions */}
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

                {/* Mobile checkbox */}
                <Checkbox
                  isSelected={formData.is_mobile}
                  onValueChange={(checked) => setFormData({ ...formData, is_mobile: checked })}
                >
                  Mobile tool (on casters or benchtop)
                </Checkbox>

                {/* Power and dust collection */}
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

                {/* Advanced options */}
                <Button
                  variant="light"
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
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={loading}
              >
                {tool ? 'Update Tool' : 'Add Tool'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
