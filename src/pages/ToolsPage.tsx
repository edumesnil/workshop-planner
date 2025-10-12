import { useEffect, useState } from 'react'
import { Button, Spinner } from '@heroui/react'
import { useAuthStore } from '@/stores/authStore'
import { useToolStore } from '@/stores/toolStore'
import { ToolRow } from '@/types/database'
import { db } from '@/services/supabase'
import { ToolGrid } from '@/components/tools/ToolGrid'
import { ToolFormModal } from '@/components/tools/ToolFormModal'
import { EmptyToolsState } from '@/components/tools/EmptyToolsState'

export function ToolsPage() {
  const { user } = useAuthStore()
  const { tools, setTools, loading, setLoading, error, setError } = useToolStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<ToolRow | null>(null)

  useEffect(() => {
    if (!user) return
    loadTools()
  }, [user])

  const loadTools = async () => {
    if (!user) return

    setLoading('tools', true)
    setError('tools', null)

    try {
      const { data, error } = await db.tools.getAll(user.id)
      if (error) throw error
      setTools(data || [])
    } catch (err) {
      setError('tools', err instanceof Error ? err.message : 'Failed to load tools')
    } finally {
      setLoading('tools', false)
    }
  }

  const handleEdit = (tool: ToolRow) => {
    setEditingTool(tool)
    setIsFormOpen(true)
  }

  const handleDelete = async (tool: ToolRow) => {
    if (!confirm(`Delete ${tool.name}? This cannot be undone.`)) return

    try {
      const { error } = await db.tools.delete(tool.id)
      if (error) throw error
      await loadTools()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete tool')
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingTool(null)
  }

  const handleFormSuccess = () => {
    loadTools()
    handleFormClose()
  }

  if (loading.tools) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" label="Loading tools..." />
      </div>
    )
  }

  if (error.tools) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p className="text-danger-800 font-medium">Unable to load tools</p>
          <p className="text-danger-600 text-sm mt-1">{error.tools}</p>
          <Button color="danger" variant="flat" size="sm" className="mt-3" onPress={loadTools}>
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
          <h1 className="text-3xl font-bold">My Tools</h1>
          <p className="text-default-500 mt-1">
            Manage your tool library for workshop planning
          </p>
        </div>
        <Button color="primary" onPress={() => setIsFormOpen(true)}>
          Add Tool
        </Button>
      </div>

      {tools.length === 0 ? (
        <EmptyToolsState onCreateClick={() => setIsFormOpen(true)} />
      ) : (
        <ToolGrid
          tools={tools}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateClick={() => setIsFormOpen(true)}
        />
      )}

      <ToolFormModal
        isOpen={isFormOpen}
        tool={editingTool}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
