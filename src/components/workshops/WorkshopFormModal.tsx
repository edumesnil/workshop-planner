import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react'
import { useState } from 'react'
import { Workshop } from '@/types/workshop'
import { WorkshopForm, WorkshopFormData } from './WorkshopForm'
import { useAuthStore } from '@/stores/authStore'
import { db } from '@/services/supabase'

interface WorkshopFormModalProps {
  isOpen: boolean
  workshop?: Workshop | null
  onClose: () => void
  onSuccess: () => void
}

export function WorkshopFormModal({ isOpen, workshop, onClose, onSuccess }: WorkshopFormModalProps) {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: WorkshopFormData) => {
    if (!user) return

    setLoading(true)

    try {
      if (workshop) {
        // Update existing workshop
        const { error } = await db.workshops.update(workshop.id, {
          name: data.name,
          description: data.description,
          dimensions: data.dimensions,
        })
        if (error) throw error
      } else {
        // Create new workshop
        const { error } = await db.workshops.create({
          user_id: user.id,
          name: data.name,
          description: data.description,
          dimensions: data.dimensions,
          constraints: { walls: [], obstacles: [] },
        })
        if (error) throw error
      }

      onSuccess()
    } catch (err) {
      console.error('Failed to save workshop:', err)
      // TODO: Show error toast/notification
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size="2xl"
      backdrop="opaque"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {workshop ? 'Edit Workshop' : 'Create Workshop'}
            </ModalHeader>
            <ModalBody className="pb-6">
              <WorkshopForm
                workshop={workshop}
                onSubmit={handleSubmit}
                onCancel={onClose}
                isLoading={loading}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
