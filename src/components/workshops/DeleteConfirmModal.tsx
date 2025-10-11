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
      setError(err instanceof Error ? err.message : "Couldn't remove workshop. Check your connection and try again.")
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
            <ModalHeader>Remove Workshop</ModalHeader>
            <ModalBody>
              <p className="text-default-700">
                You're about to permanently remove <strong>{workshop.name}</strong>. This will delete all associated layouts, constraints, and workshop data.
              </p>
              {error && (
                <p className="text-danger text-sm mt-3">{error}</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={loading}>
                Keep Workshop
              </Button>
              <Button color="danger" onPress={handleDelete} isLoading={loading}>
                Remove Permanently
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
