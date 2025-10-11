import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Textarea } from '@heroui/react'
import { useState } from 'react'
import { Obstacle } from '@/types/constraints'
import { v4 as uuidv4 } from 'uuid'

interface ObstacleFormProps {
  isOpen: boolean
  obstacle?: Obstacle | null
  onClose: () => void
  onSave: (obstacle: Obstacle) => void
}

export function ObstacleForm({ isOpen, obstacle, onClose, onSave }: ObstacleFormProps) {
  const [formData, setFormData] = useState<Partial<Obstacle>>(
    obstacle || {
      name: '',
      position: { x: 0, y: 0 },
      dimensions: { length: 24, width: 24, height: 36 },
      fixed: true,
      notes: '',
    }
  )

  const handleSubmit = () => {
    if (!formData.name) {
      return // Name is required
    }

    const newObstacle: Obstacle = {
      id: obstacle?.id || uuidv4(),
      name: formData.name,
      position: formData.position || { x: 0, y: 0 },
      dimensions: formData.dimensions || { length: 24, width: 24, height: 36 },
      fixed: formData.fixed !== undefined ? formData.fixed : true,
      notes: formData.notes || undefined,
    }
    onSave(newObstacle)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} size="2xl" placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {obstacle ? 'Edit Obstacle' : 'Add Obstacle'}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Obstacle Name"
                  placeholder="e.g., Support Column, HVAC Unit, Water Heater"
                  isRequired
                  value={formData.name || ''}
                  onValueChange={(value) => setFormData({ ...formData, name: value })}
                />

                <div>
                  <p className="text-sm font-medium mb-2">Position (inches from origin)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      label="X Position"
                      placeholder="0"
                      value={String(formData.position?.x || 0)}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          position: { ...formData.position!, x: Number(value) },
                        })
                      }
                    />
                    <Input
                      type="number"
                      label="Y Position"
                      placeholder="0"
                      value={String(formData.position?.y || 0)}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          position: { ...formData.position!, y: Number(value) },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Dimensions (inches)</p>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      type="number"
                      label="Length"
                      placeholder="24"
                      value={String(formData.dimensions?.length || 24)}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions!, length: Number(value) },
                        })
                      }
                    />
                    <Input
                      type="number"
                      label="Width"
                      placeholder="24"
                      value={String(formData.dimensions?.width || 24)}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions!, width: Number(value) },
                        })
                      }
                    />
                    <Input
                      type="number"
                      label="Height"
                      placeholder="36"
                      value={String(formData.dimensions?.height || 36)}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions!, height: Number(value) },
                        })
                      }
                    />
                  </div>
                </div>

                <Checkbox
                  isSelected={formData.fixed !== undefined ? formData.fixed : true}
                  onValueChange={(checked) => setFormData({ ...formData, fixed: checked })}
                >
                  Fixed (cannot be moved during optimization)
                </Checkbox>

                <Textarea
                  label="Notes (optional)"
                  placeholder="Additional details about this obstacle"
                  value={formData.notes || ''}
                  onValueChange={(value) => setFormData({ ...formData, notes: value })}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit} isDisabled={!formData.name}>
                {obstacle ? 'Update' : 'Add'} Obstacle
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
