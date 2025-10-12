import { useEffect, useState } from 'react'
import { Button, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react'
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
  const [deletingTool, setDeletingTool] = useState<ToolRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  const handleDelete = (tool: ToolRow) => {
    setDeletingTool(tool)
  }

  const handleConfirmDelete = async () => {
    if (!deletingTool) return

    setIsDeleting(true)
    setDeleteError(null)
    try {
      const { error } = await db.tools.delete(deletingTool.id)
      if (error) throw error
      await loadTools()
      setDeletingTool(null)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Unable to delete tool. Please try again.')
    } finally {
      setIsDeleting(false)
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
          <h1 className="text-3xl font-bold">Your Workshop Tool Library</h1>
          <p className="text-default-500 mt-1">
            Organize and optimize your tools for efficient workspace design
          </p>
        </div>
        <Button color="primary" onPress={() => setIsFormOpen(true)}>
          Create Tool Profile
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

      <Modal
        isOpen={!!deletingTool}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTool(null)
            setDeleteError(null)
          }
        }}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Remove Tool from Library
              </ModalHeader>
              <ModalBody>
                <p>
                  Remove <strong>{deletingTool?.name}</strong> from your workshop planning?
                </p>
                <p className="text-sm text-default-500 mt-2">
                  This tool will be deleted from your library and removed from all workshop layouts. This cannot be reversed.
                </p>
                {deleteError && (
                  <div className="mt-3 p-3 bg-danger-50 border border-danger-200 rounded-md">
                    <p className="text-sm text-danger-800 font-medium">Unable to delete tool</p>
                    <p className="text-sm text-danger-600 mt-1">{deleteError}</p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose} isDisabled={isDeleting}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  onPress={handleConfirmDelete}
                  isLoading={isDeleting}
                >
                  Delete Tool
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
