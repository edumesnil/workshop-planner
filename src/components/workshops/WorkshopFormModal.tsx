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
  onSuccess: (updates?: Partial<Workshop>) => void
}

export function WorkshopFormModal({ isOpen, workshop, onClose, onSuccess }: WorkshopFormModalProps) {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: WorkshopFormData) => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      if (workshop) {
        // Update existing workshop
        const updates = {
          name: data.name,
          description: data.description,
          dimensions: data.dimensions,
        }
        const { error } = await db.workshops.update(workshop.id, updates)
        if (error) throw error
        onSuccess(updates)
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
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workshop. Please try again.')
      console.error('Failed to save workshop:', err)
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
              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-4">
                  <p className="text-danger-800 text-sm">{error}</p>
                </div>
              )}
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
