import { Card, CardBody, Button } from '@heroui/react'
import { useState } from 'react'
import { Workshop } from '@/types/workshop'
import { WallConstraint, Obstacle } from '@/types/constraints'
import { WallConstraintForm } from './WallConstraintForm'
import { ObstacleForm } from './ObstacleForm'
import { db } from '@/services/supabase'

interface ConstraintsTabProps {
  workshop: Workshop
  onUpdate: (updates: Partial<Workshop>) => void
}

export function ConstraintsTab({ workshop, onUpdate }: ConstraintsTabProps) {
  const [editingWall, setEditingWall] = useState<WallConstraint | null>(null)
  const [editingObstacle, setEditingObstacle] = useState<Obstacle | null>(null)
  const [showWallForm, setShowWallForm] = useState(false)
  const [showObstacleForm, setShowObstacleForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const walls = workshop.constraints?.walls || []
  const obstacles = workshop.constraints?.obstacles || []

  const handleSaveWall = async (wall: WallConstraint) => {
    setLoading(true)
    try {
      const updatedWalls = editingWall
        ? walls.map((w) => (w.id === wall.id ? wall : w))
        : [...walls, wall]

      const updatedConstraints = {
        walls: updatedWalls,
        obstacles,
      }

      const { error } = await db.workshops.update(workshop.id, {
        constraints: updatedConstraints,
      })

      if (error) throw error

      onUpdate({ constraints: updatedConstraints })
      setEditingWall(null)
      setShowWallForm(false)
    } catch (err) {
      console.error('Failed to save wall constraint:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWall = async (wallId: string) => {
    setLoading(true)
    try {
      const updatedWalls = walls.filter((w) => w.id !== wallId)
      const updatedConstraints = {
        walls: updatedWalls,
        obstacles,
      }

      const { error } = await db.workshops.update(workshop.id, {
        constraints: updatedConstraints,
      })

      if (error) throw error
      onUpdate({ constraints: updatedConstraints })
    } catch (err) {
      console.error('Failed to delete wall constraint:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveObstacle = async (obstacle: Obstacle) => {
    setLoading(true)
    try {
      const updatedObstacles = editingObstacle
        ? obstacles.map((o) => (o.id === obstacle.id ? obstacle : o))
        : [...obstacles, obstacle]

      const updatedConstraints = {
        walls,
        obstacles: updatedObstacles,
      }

      const { error } = await db.workshops.update(workshop.id, {
        constraints: updatedConstraints,
      })

      if (error) throw error
      onUpdate({ constraints: updatedConstraints })
      setEditingObstacle(null)
      setShowObstacleForm(false)
    } catch (err) {
      console.error('Failed to save obstacle:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteObstacle = async (obstacleId: string) => {
    setLoading(true)
    try {
      const updatedObstacles = obstacles.filter((o) => o.id !== obstacleId)
      const updatedConstraints = {
        walls,
        obstacles: updatedObstacles,
      }

      const { error} = await db.workshops.update(workshop.id, {
        constraints: updatedConstraints,
      })

      if (error) throw error
      onUpdate({ constraints: updatedConstraints })
    } catch (err) {
      console.error('Failed to delete obstacle:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Wall Constraints Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Wall Constraints</h3>
            <p className="text-sm text-default-500">
              Define features like doors, windows, and electrical outlets
            </p>
          </div>
          <Button color="primary" onPress={() => setShowWallForm(true)}>
            Add Wall Constraint
          </Button>
        </div>

        {walls.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-center text-default-500 py-8">
                No wall constraints defined. Add features like doors, windows, or electrical outlets to improve layout optimization.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-3">
            {walls.map((wall) => (
              <Card key={wall.id}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        setEditingWall(wall)
                        setShowWallForm(true)
                      }}
                    >
                      <div className="font-medium capitalize">{wall.wall} Wall - {wall.type}</div>
                      <div className="text-sm text-default-500">
                        Position: {wall.position}" | Width: {wall.width}" | Clearance: {wall.clearance}"
                      </div>
                      {wall.notes && (
                        <div className="text-sm text-default-400 mt-1">{wall.notes}</div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteWall(wall.id)
                      }}
                      isLoading={loading}
                    >
                      Remove
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Obstacle Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Obstacles</h3>
            <p className="text-sm text-default-500">
              Mark fixed elements like pillars, HVAC units, or built-in furniture
            </p>
          </div>
          <Button color="primary" onPress={() => setShowObstacleForm(true)}>
            Add Obstacle
          </Button>
        </div>

        {obstacles.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-center text-default-500 py-8">
                No obstacles defined. Add fixed elements that tools must work around.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-3">
            {obstacles.map((obstacle) => (
              <Card key={obstacle.id}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        setEditingObstacle(obstacle)
                        setShowObstacleForm(true)
                      }}
                    >
                      <div className="font-medium">{obstacle.name}</div>
                      <div className="text-sm text-default-500">
                        Position: ({obstacle.position.x}", {obstacle.position.y}") |
                        Size: {obstacle.dimensions.length}" × {obstacle.dimensions.width}" × {obstacle.dimensions.height}"
                        {obstacle.fixed && <span className="ml-2 text-warning">Fixed</span>}
                      </div>
                      {obstacle.notes && (
                        <div className="text-sm text-default-400 mt-1">{obstacle.notes}</div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteObstacle(obstacle.id)
                      }}
                      isLoading={loading}
                    >
                      Remove
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <WallConstraintForm
        isOpen={showWallForm}
        wallConstraint={editingWall}
        onClose={() => {
          setShowWallForm(false)
          setEditingWall(null)
        }}
        onSave={handleSaveWall}
      />

      <ObstacleForm
        isOpen={showObstacleForm}
        obstacle={editingObstacle}
        onClose={() => {
          setShowObstacleForm(false)
          setEditingObstacle(null)
        }}
        onSave={handleSaveObstacle}
      />
    </div>
  )
}
