import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { useState } from 'react'
import { WallConstraint, WallSide, WallType } from '@/types/constraints'
import { v4 as uuidv4 } from 'uuid'

interface WallConstraintFormProps {
  isOpen: boolean
  wallConstraint?: WallConstraint | null
  onClose: () => void
  onSave: (wallConstraint: WallConstraint) => void
}

const WALL_SIDES = [
  { value: WallSide.NORTH, label: 'North' },
  { value: WallSide.SOUTH, label: 'South' },
  { value: WallSide.EAST, label: 'East' },
  { value: WallSide.WEST, label: 'West' },
]

const WALL_TYPES = [
  { value: WallType.OPEN, label: 'Open Wall', description: 'No obstructions' },
  { value: WallType.WINDOW, label: 'Window', description: 'Natural light source' },
  { value: WallType.DOOR, label: 'Door', description: 'Entry/exit point' },
  { value: WallType.ELECTRICAL, label: 'Electrical Outlet', description: 'Power source' },
  { value: WallType.UTILITIES, label: 'Utilities', description: 'Plumbing, gas, etc.' },
  { value: WallType.STORAGE, label: 'Built-in Storage', description: 'Cabinets, shelves' },
]

export function WallConstraintForm({ isOpen, wallConstraint, onClose, onSave }: WallConstraintFormProps) {
  const [formData, setFormData] = useState<Partial<WallConstraint>>(
    wallConstraint || {
      wall: WallSide.NORTH,
      type: WallType.OPEN,
      position: 0,
      width: 36,
      clearance: 0,
      notes: '',
    }
  )

  const handleSubmit = () => {
    const wall: WallConstraint = {
      id: wallConstraint?.id || uuidv4(),
      wall: formData.wall || WallSide.NORTH,
      type: formData.type || WallType.OPEN,
      position: Number(formData.position) || 0,
      width: Number(formData.width) || 36,
      clearance: Number(formData.clearance) || 0,
      notes: formData.notes || undefined,
    }
    onSave(wall)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} size="2xl" placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {wallConstraint ? 'Edit Wall Constraint' : 'Add Wall Constraint'}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Wall Side"
                    placeholder="Select wall"
                    selectedKeys={formData.wall ? [formData.wall] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as WallSide
                      setFormData({ ...formData, wall: selected })
                    }}
                  >
                    {WALL_SIDES.map((side) => (
                      <SelectItem key={side.value}>
                        {side.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Feature Type"
                    placeholder="Select type"
                    selectedKeys={formData.type ? [formData.type] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as WallType
                      setFormData({ ...formData, type: selected })
                    }}
                  >
                    {WALL_TYPES.map((type) => (
                      <SelectItem key={type.value} textValue={type.label}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-default-400">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    type="number"
                    label="Position (inches)"
                    placeholder="0"
                    description="Distance from start of wall"
                    value={String(formData.position || 0)}
                    onValueChange={(value) => setFormData({ ...formData, position: Number(value) })}
                  />

                  <Input
                    type="number"
                    label="Width (inches)"
                    placeholder="36"
                    description="Feature width"
                    value={String(formData.width || 36)}
                    onValueChange={(value) => setFormData({ ...formData, width: Number(value) })}
                  />

                  <Input
                    type="number"
                    label="Clearance (inches)"
                    placeholder="0"
                    description="Required space"
                    value={String(formData.clearance || 0)}
                    onValueChange={(value) => setFormData({ ...formData, clearance: Number(value) })}
                  />
                </div>

                <Textarea
                  label="Notes (optional)"
                  placeholder="Additional details about this wall feature"
                  value={formData.notes || ''}
                  onValueChange={(value) => setFormData({ ...formData, notes: value })}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                {wallConstraint ? 'Update' : 'Add'} Constraint
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
