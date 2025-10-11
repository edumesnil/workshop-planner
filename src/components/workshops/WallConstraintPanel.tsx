import { useState } from 'react'
import { Button, Input, Select, SelectItem, Textarea, Card, CardHeader, CardBody } from '@heroui/react'
import { Workshop } from '@/types/workshop'
import { WallConstraint, WallSide, WallType } from '@/types/constraints'
import { db } from '@/services/supabase'

interface WallConstraintPanelProps {
  workshop: Workshop
  wallSide: WallSide
  onUpdate: (updates: Partial<Workshop>) => void
  onClearSelection: () => void
}

const wallTypeOptions = [
  { value: 'open', label: 'Open Wall' },
  { value: 'window', label: 'Window' },
  { value: 'door', label: 'Door' },
  { value: 'electrical', label: 'Electrical Outlet' },
  { value: 'utilities', label: 'Utilities (HVAC, Plumbing)' },
  { value: 'storage', label: 'Built-in Storage' },
]

export function WallConstraintPanel({
  workshop,
  wallSide,
  onUpdate,
  onClearSelection,
}: WallConstraintPanelProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state for new constraint
  const [type, setType] = useState<WallType>(WallType.WINDOW)
  const [position, setPosition] = useState('0')
  const [width, setWidth] = useState('36')
  const [clearance, setClearance] = useState('0')
  const [notes, setNotes] = useState('')

  // Get existing constraints for this wall
  const wallConstraints = workshop.constraints.walls.filter(w => w.wall === wallSide)

  const handleAddConstraint = async () => {
    setLoading(true)
    setError(null)

    try {
      const newConstraint: WallConstraint = {
        id: crypto.randomUUID(),
        wall: wallSide,
        type,
        position: parseFloat(position),
        width: parseFloat(width),
        clearance: parseFloat(clearance),
        notes: notes || undefined,
      }

      const updatedWalls = [...workshop.constraints.walls, newConstraint]
      const updatedConstraints = {
        ...workshop.constraints,
        walls: updatedWalls,
      }

      const { error: dbError } = await db.workshops.update(workshop.id, {
        constraints: updatedConstraints,
      })

      if (dbError) throw dbError

      onUpdate({ constraints: updatedConstraints })

      // Reset form
      setPosition('0')
      setWidth('36')
      setClearance('0')
      setNotes('')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add constraint. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConstraint = async (constraintId: string) => {
    setLoading(true)
    setError(null)

    try {
      const updatedWalls = workshop.constraints.walls.filter(w => w.id !== constraintId)
      const updatedConstraints = {
        ...workshop.constraints,
        walls: updatedWalls,
      }

      const { error: dbError } = await db.workshops.update(workshop.id, {
        constraints: updatedConstraints,
      })

      if (dbError) throw dbError

      onUpdate({ constraints: updatedConstraints })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete constraint. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const wallLabel = wallSide.charAt(0).toUpperCase() + wallSide.slice(1)

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{wallLabel} Wall</h3>
        <Button
          size="sm"
          variant="light"
          onPress={onClearSelection}
        >
          Clear Selection
        </Button>
      </div>

      {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
          <p className="text-danger-800 text-sm">{error}</p>
        </div>
      )}

      {/* Existing Constraints */}
      {wallConstraints.length > 0 && (
        <Card>
          <CardHeader>
            <h4 className="font-medium">Existing Constraints</h4>
          </CardHeader>
          <CardBody className="space-y-2">
            {wallConstraints.map(constraint => (
              <div
                key={constraint.id}
                className="flex items-start justify-between p-2 bg-default-100 rounded"
              >
                <div className="flex-1 text-sm">
                  <p className="font-medium capitalize">{constraint.type.replace('_', ' ')}</p>
                  <p className="text-xs text-default-600">
                    Position: {constraint.position}" | Width: {constraint.width}" | Clearance: {constraint.clearance}"
                  </p>
                </div>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => handleDeleteConstraint(constraint.id)}
                  isDisabled={loading}
                >
                  Remove
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Add New Constraint Form */}
      <Card>
        <CardHeader>
          <h4 className="font-medium">Add Constraint</h4>
        </CardHeader>
        <CardBody className="space-y-3">
          <Select
            label="Feature Type"
            selectedKeys={[type]}
            onSelectionChange={(keys) => setType(Array.from(keys)[0] as WallType)}
          >
            {wallTypeOptions.map(opt => (
              <SelectItem key={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </Select>

          <Input
            type="number"
            label="Position (inches)"
            description="Distance from start of wall"
            value={position}
            onValueChange={setPosition}
          />

          <Input
            type="number"
            label="Width (inches)"
            description="Feature width"
            value={width}
            onValueChange={setWidth}
          />

          <Input
            type="number"
            label="Clearance (inches)"
            description="Required space into room"
            value={clearance}
            onValueChange={setClearance}
          />

          <Textarea
            label="Notes (optional)"
            placeholder="Additional details..."
            value={notes}
            onValueChange={setNotes}
            minRows={2}
          />

          <Button
            color="primary"
            onPress={handleAddConstraint}
            isLoading={loading}
            fullWidth
          >
            Add Constraint
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
