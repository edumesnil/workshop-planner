import { useEffect, useState } from 'react'
import { Button, Spinner } from '@heroui/react'
import { useAuthStore } from '@/stores/authStore'
import { useWorkshopStore } from '@/stores/workshopStore'
import { db } from '@/services/supabase'
import { WorkshopGrid } from '@/components/workshops/WorkshopGrid'
import { WorkshopFormModal } from '@/components/workshops/WorkshopFormModal'
import { EmptyWorkshopsState } from '@/components/workshops/EmptyWorkshopsState'

export function WorkshopsPage() {
  const { user } = useAuthStore()
  const { workshops, setWorkshops, setLoading } = useWorkshopStore()
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    loadWorkshops()
  }, [user])

  const loadWorkshops = async () => {
    if (!user) return

    setLoading('workshops', true)
    setError(null)

    try {
      const { data, error } = await db.workshops.getAll(user.id)
      if (error) throw error

      // Transform database rows to Workshop type
      const transformed = (data || []).map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        dimensions: row.dimensions,
        constraints: row.constraints || { walls: [], obstacles: [] },
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }))

      setWorkshops(transformed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workshops')
    } finally {
      setLoading('workshops', false)
    }
  }

  const loading = useWorkshopStore(state => state.loading.workshops)

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" label="Loading workshops..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p className="text-danger-800 font-medium">Unable to load workshops</p>
          <p className="text-danger-600 text-sm mt-1">{error}</p>
          <Button color="danger" variant="flat" size="sm" className="mt-3" onPress={loadWorkshops}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workshops</h1>
          <p className="text-default-500 mt-1">
            Manage your workshop spaces and configurations
          </p>
        </div>
        <Button color="primary" onPress={() => setIsFormOpen(true)}>
          Create Workshop
        </Button>
      </div>

      {workshops.length === 0 ? (
        <EmptyWorkshopsState onCreateClick={() => setIsFormOpen(true)} />
      ) : (
        <WorkshopGrid workshops={workshops} onRefresh={loadWorkshops} />
      )}

      <WorkshopFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false)
          loadWorkshops()
        }}
      />
    </div>
  )
}
