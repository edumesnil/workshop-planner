import { useState } from 'react'
import { Card, CardBody, CardHeader, Button, RadioGroup, Radio, Input, Select, SelectItem } from '@heroui/react'
import { WORKSHOP_PRESETS } from '@/data/workshopPresets'
import { toInches, fromInches, type LengthUnit } from '@/utils/units'

interface WorkshopDimensionsStepProps {
  onNext: (dimensions: { length: number; width: number; height: number }) => void
  onSkip: () => void
}

export function WorkshopDimensionsStep({ onNext, onSkip }: WorkshopDimensionsStepProps) {
  const [selectedPreset, setSelectedPreset] = useState('basement-workshop')
  const [unit, setUnit] = useState<LengthUnit>('feet')

  // Custom dimensions (stored in inches, displayed in selected unit)
  const [customLength, setCustomLength] = useState('')
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('8')

  const preset = WORKSHOP_PRESETS.find(p => p.id === selectedPreset)

  const handleNext = () => {
    if (selectedPreset === 'custom') {
      const length = toInches(parseFloat(customLength) || 0, unit)
      const width = toInches(parseFloat(customWidth) || 0, unit)
      const height = toInches(parseFloat(customHeight) || 8, unit)

      if (length <= 0 || width <= 0 || height <= 0) {
        alert('Please enter valid dimensions')
        return
      }

      onNext({ length, width, height })
    } else if (preset) {
      onNext({
        length: preset.length,
        width: preset.width,
        height: preset.height,
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-col gap-1 px-6 pt-6">
        <h2 className="text-2xl font-bold">Workshop Dimensions</h2>
        <p className="text-sm text-default-500">
          Choose a preset or enter custom dimensions for your workshop
        </p>
      </CardHeader>
      <CardBody className="px-6 pb-6">
        <div className="flex flex-col gap-6">
          {/* Preset Selection */}
          <RadioGroup
            value={selectedPreset}
            onValueChange={setSelectedPreset}
            label="Select a preset"
          >
            {WORKSHOP_PRESETS.map((p) => (
              <Radio key={p.id} value={p.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-sm text-default-500">{p.description}</span>
                  {p.id !== 'custom' && (
                    <span className="text-xs text-default-400">
                      {fromInches(p.length, 'feet').toFixed(1)}' × {fromInches(p.width, 'feet').toFixed(1)}' × {fromInches(p.height, 'feet').toFixed(1)}'
                    </span>
                  )}
                </div>
              </Radio>
            ))}
          </RadioGroup>

          {/* Custom Dimensions */}
          {selectedPreset === 'custom' && (
            <div className="flex flex-col gap-4 p-4 bg-default-100 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Unit:</span>
                <Select
                  selectedKeys={[unit]}
                  onChange={(e) => setUnit(e.target.value as LengthUnit)}
                  className="w-32"
                  size="sm"
                  aria-label="Select unit"
                >
                  <SelectItem key="feet">Feet</SelectItem>
                  <SelectItem key="meters">Meters</SelectItem>
                  <SelectItem key="inches">Inches</SelectItem>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input
                  type="number"
                  label={`Length (${unit})`}
                  placeholder="0"
                  value={customLength}
                  onValueChange={setCustomLength}
                  min="0"
                  step="0.1"
                />
                <Input
                  type="number"
                  label={`Width (${unit})`}
                  placeholder="0"
                  value={customWidth}
                  onValueChange={setCustomWidth}
                  min="0"
                  step="0.1"
                />
                <Input
                  type="number"
                  label={`Height (${unit})`}
                  placeholder="8"
                  value={customHeight}
                  onValueChange={setCustomHeight}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="light" onPress={onSkip}>
              Skip for now
            </Button>
            <Button color="primary" onPress={handleNext}>
              Continue
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
