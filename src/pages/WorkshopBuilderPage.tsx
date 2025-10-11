import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spinner, Button } from '@heroui/react'
import { Workshop } from '@/types/workshop'
import { WallSide } from '@/types/constraints'
import { db } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import { FloorPlan2D } from '@/components/workshops/FloorPlan2D'
import { BuilderSidebar } from '@/components/workshops/BuilderSidebar'
import { FloorPlanControls } from '@/components/workshops/FloorPlanControls'
import { useDebouncedSave } from '@/hooks/useDebouncedSave'

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 10) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export function WorkshopBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedWall, setSelectedWall] = useState<WallSide | null>(null)
  const [selectedObstacle, setSelectedObstacle] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !id) return
    loadWorkshop()
  }, [user, id])

  const loadWorkshop = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await db.workshops.getById(id)
      if (error) throw error
      if (!data) throw new Error('Workshop not found')

      const transformed: Workshop = {
        id: data.id,
        name: data.name,
        description: data.description,
        dimensions: data.dimensions,
        constraints: data.constraints || { walls: [], obstacles: [] },
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      }

      setWorkshop(transformed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workshop')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateWorkshop = (updates: Partial<Workshop>) => {
    if (!workshop) return
    setWorkshop({ ...workshop, ...updates })
  }

  // Save function for debounced save hook
  const saveWorkshop = useCallback(async (workshopData: Workshop) => {
    await db.workshops.update(workshopData.id, {
      constraints: workshopData.constraints,
    })
  }, [])

  // Debounced save hook - auto-saves every 60 seconds (only when workshop is loaded)
  const { save, isSaving, hasUnsavedChanges, lastSavedAt } = useDebouncedSave({
    data: workshop!,
    onSave: saveWorkshop,
    autoSaveInterval: 60000, // 1 minute
  })

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" label="Loading workshop builder..." />
      </div>
    )
  }

  if (error || !workshop) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger text-lg mb-4">{error || 'Workshop not found'}</p>
          <button
            onClick={() => navigate('/workshops')}
            className="text-primary hover:underline"
          >
            Back to Workshops
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden bg-default-50">
      {/* Canvas Area - 75% */}
      <div className="flex-[3] relative flex flex-col">
        {/* Header Bar */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/workshops/${workshop.id}`)}
              className="text-default-600 hover:text-default-900"
            >
              ← Back
            </button>
            <h1 className="text-xl font-semibold">{workshop.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Save Status */}
            <div className="text-sm text-default-500">
              {isSaving ? (
                'Saving...'
              ) : hasUnsavedChanges ? (
                'Unsaved changes'
              ) : lastSavedAt ? (
                `Saved ${formatRelativeTime(lastSavedAt)}`
              ) : (
                'All changes saved'
              )}
            </div>

            {/* Manual Save Button */}
            <Button
              color="primary"
              size="sm"
              isDisabled={!hasUnsavedChanges || isSaving}
              isLoading={isSaving}
              onPress={save}
            >
              Save
            </Button>

            <FloorPlanControls />
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <FloorPlan2D
            workshop={workshop}
            selectedWall={selectedWall}
            selectedObstacle={selectedObstacle}
            onSelectWall={setSelectedWall}
            onSelectObstacle={setSelectedObstacle}
            onUpdateWorkshop={handleUpdateWorkshop}
          />
        </div>
      </div>

      {/* Sidebar - 25% */}
      <div className="flex-[1] border-l bg-white overflow-y-auto">
        <BuilderSidebar
          workshop={workshop}
          selectedWall={selectedWall}
          selectedObstacle={selectedObstacle}
          onUpdateWorkshop={handleUpdateWorkshop}
          onClearSelection={() => {
            setSelectedWall(null)
            setSelectedObstacle(null)
          }}
        />
      </div>
    </div>
  )
}
