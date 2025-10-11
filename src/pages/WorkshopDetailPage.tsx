import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Spinner, Button } from '@heroui/react'
import { Workshop } from '@/types/workshop'
import { db } from '@/services/supabase'
import { WorkshopHeader } from '@/components/workshops/WorkshopHeader'
import { WorkshopTabs } from '@/components/workshops/WorkshopTabs'

export function WorkshopDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    if (id) loadWorkshop()
  }, [id])

  const loadWorkshop = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await db.workshops.getById(id)
      if (error) throw error
      if (!data) throw new Error('Workshop not found')

      // Transform database row to Workshop type
      setWorkshop({
        id: data.id,
        name: data.name,
        description: data.description,
        dimensions: data.dimensions,
        constraints: data.constraints || { walls: [], obstacles: [] },
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workshop')
    } finally {
      setLoading(false)
    }
  }

  const updateWorkshop = (updates: Partial<Workshop>) => {
    if (!workshop) return
    setWorkshop({ ...workshop, ...updates })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" label="Loading workshop..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p className="text-danger-800 font-medium">Unable to load workshop</p>
          <p className="text-danger-600 text-sm mt-1">{error}</p>
          <div className="flex gap-2 mt-3">
            <Button color="danger" variant="flat" size="sm" onPress={loadWorkshop}>
              Try Again
            </Button>
            <Button variant="light" size="sm" onPress={() => navigate('/workshops')}>
              Back to Workshops
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!workshop) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <p className="text-warning-800 font-medium">Workshop not found</p>
          <Button variant="light" size="sm" className="mt-3" onPress={() => navigate('/workshops')}>
            Back to Workshops
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <WorkshopHeader workshop={workshop} onUpdate={updateWorkshop} />
      <WorkshopTabs
        workshop={workshop}
        onUpdate={updateWorkshop}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
    </div>
  )
}
