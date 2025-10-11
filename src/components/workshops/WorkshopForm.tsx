import { Input, Textarea, Select, SelectItem, Button } from '@heroui/react'
import { useState, useEffect } from 'react'
import { Workshop, Dimensions } from '@/types/workshop'
import { WORKSHOP_PRESETS } from '@/data/workshopPresets'
import { toInches, fromInches } from '@/utils/units'

interface WorkshopFormProps {
  workshop?: Workshop | null
  onSubmit: (data: WorkshopFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export interface WorkshopFormData {
  name: string
  description: string
  dimensions: Dimensions
}

export function WorkshopForm({ workshop, onSubmit, onCancel, isLoading }: WorkshopFormProps) {
  const [name, setName] = useState(workshop?.name || '')
  const [description, setDescription] = useState(workshop?.description || '')
  const [presetId, setPresetId] = useState('custom')

  // Dimensions in feet for easier user input
  const [lengthFt, setLengthFt] = useState(
    workshop ? fromInches(workshop.dimensions.length, 'feet').toFixed(1) : ''
  )
  const [widthFt, setWidthFt] = useState(
    workshop ? fromInches(workshop.dimensions.width, 'feet').toFixed(1) : ''
  )
  const [heightFt, setHeightFt] = useState(
    workshop ? fromInches(workshop.dimensions.height, 'feet').toFixed(1) : '8'
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle preset selection
  useEffect(() => {
    if (presetId === 'custom') return

    const preset = WORKSHOP_PRESETS.find(p => p.id === presetId)
    if (preset) {
      setLengthFt(fromInches(preset.length, 'feet').toFixed(1))
      setWidthFt(fromInches(preset.width, 'feet').toFixed(1))
      setHeightFt(fromInches(preset.height, 'feet').toFixed(1))
    }
  }, [presetId])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Workshop name is required'
    } else if (name.length > 100) {
      newErrors.name = 'Name must be 100 characters or less'
    }

    const length = parseFloat(lengthFt)
    const width = parseFloat(widthFt)
    const height = parseFloat(heightFt)

    if (!lengthFt || isNaN(length) || length <= 0) {
      newErrors.length = 'Enter a valid length'
    } else if (length < 5) {
      newErrors.length = 'Length must be at least 5 feet'
    } else if (length > 100) {
      newErrors.length = 'Length cannot exceed 100 feet'
    }

    if (!widthFt || isNaN(width) || width <= 0) {
      newErrors.width = 'Enter a valid width'
    } else if (width < 5) {
      newErrors.width = 'Width must be at least 5 feet'
    } else if (width > 100) {
      newErrors.width = 'Width cannot exceed 100 feet'
    }

    if (!heightFt || isNaN(height) || height <= 0) {
      newErrors.height = 'Enter a valid height'
    } else if (height < 6) {
      newErrors.height = 'Height must be at least 6 feet'
    } else if (height > 20) {
      newErrors.height = 'Height cannot exceed 20 feet'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const dimensions: Dimensions = {
      length: toInches(parseFloat(lengthFt), 'feet'),
      width: toInches(parseFloat(widthFt), 'feet'),
      height: toInches(parseFloat(heightFt), 'feet'),
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      dimensions,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Workshop Name"
        placeholder="e.g., Main Workshop, Garage"
        value={name}
        onValueChange={setName}
        isRequired
        isInvalid={!!errors.name}
        errorMessage={errors.name}
        isDisabled={isLoading}
      />

      <Textarea
        label="Description"
        placeholder="Optional notes about this workshop"
        value={description}
        onValueChange={setDescription}
        isDisabled={isLoading}
        minRows={2}
      />

      {!workshop && (
        <Select
          label="Template"
          placeholder="Choose a preset or custom"
          selectedKeys={[presetId]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string
            setPresetId(selected)
          }}
          isDisabled={isLoading}
        >
          {WORKSHOP_PRESETS.map((preset) => (
            <SelectItem key={preset.id}>
              {preset.name} {preset.description && `- ${preset.description}`}
            </SelectItem>
          ))}
        </Select>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Length (feet)"
          placeholder="20"
          value={lengthFt}
          onValueChange={setLengthFt}
          type="number"
          step="0.1"
          isRequired
          isInvalid={!!errors.length}
          errorMessage={errors.length}
          isDisabled={isLoading}
        />
        <Input
          label="Width (feet)"
          placeholder="10"
          value={widthFt}
          onValueChange={setWidthFt}
          type="number"
          step="0.1"
          isRequired
          isInvalid={!!errors.width}
          errorMessage={errors.width}
          isDisabled={isLoading}
        />
        <Input
          label="Height (feet)"
          placeholder="8"
          value={heightFt}
          onValueChange={setHeightFt}
          type="number"
          step="0.1"
          isRequired
          isInvalid={!!errors.height}
          errorMessage={errors.height}
          isDisabled={isLoading}
        />
      </div>

      <div className="flex gap-2 justify-end mt-2">
        <Button variant="light" onPress={onCancel} isDisabled={isLoading}>
          Cancel
        </Button>
        <Button color="primary" type="submit" isLoading={isLoading}>
          {workshop ? 'Update Workshop' : 'Create Workshop'}
        </Button>
      </div>
    </form>
  )
}
