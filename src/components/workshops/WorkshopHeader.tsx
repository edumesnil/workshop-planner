import { Button, Breadcrumbs, BreadcrumbItem } from '@heroui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Workshop } from '@/types/workshop'
import { WorkshopFormModal } from './WorkshopFormModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'

interface WorkshopHeaderProps {
  workshop: Workshop
  onUpdate: (updates: Partial<Workshop>) => void
}

export function WorkshopHeader({ workshop, onUpdate }: WorkshopHeaderProps) {
  const navigate = useNavigate()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleEditSuccess = (updates?: Partial<Workshop>) => {
    setIsEditOpen(false)
    if (updates) {
      onUpdate(updates)
    }
  }

  const handleDeleteSuccess = () => {
    setIsDeleteOpen(false)
    navigate('/workshops')
  }

  return (
    <>
      <div className="mb-6">
        <Breadcrumbs className="mb-4">
          <BreadcrumbItem onPress={() => navigate('/workshops')}>
            Workshops
          </BreadcrumbItem>
          <BreadcrumbItem>{workshop.name}</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{workshop.name}</h1>
            {workshop.description && (
              <p className="text-default-600 mt-2">{workshop.description}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="flat" onPress={() => setIsEditOpen(true)}>
              Edit Workshop
            </Button>
            <Button color="danger" variant="light" onPress={() => setIsDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <WorkshopFormModal
        isOpen={isEditOpen}
        workshop={workshop}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        workshop={workshop}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
