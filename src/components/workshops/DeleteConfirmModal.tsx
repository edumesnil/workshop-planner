import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'
import { useState } from 'react'
import { Workshop } from '@/types/workshop'
import { db } from '@/services/supabase'

interface DeleteConfirmModalProps {
  isOpen: boolean
  workshop: Workshop | null
  onClose: () => void
  onSuccess: () => void
}

export function DeleteConfirmModal({ isOpen, workshop, onClose, onSuccess }: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!workshop) return

    setLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await db.workshops.delete(workshop.id)
      if (deleteError) throw deleteError

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workshop')
    } finally {
      setLoading(false)
    }
  }

  if (!workshop) return null

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      backdrop="opaque"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Delete Workshop</ModalHeader>
            <ModalBody>
              <p className="text-default-700">
                Are you sure you want to delete <strong>{workshop.name}</strong>?
              </p>
              <p className="text-default-600 text-sm mt-2">
                This will permanently remove this workshop, including all wall constraints and obstacles.
                Any layouts generated for this workshop will also be deleted.
              </p>
              {error && (
                <p className="text-danger text-sm mt-3">{error}</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={loading}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleDelete} isLoading={loading}>
                Delete Workshop
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
