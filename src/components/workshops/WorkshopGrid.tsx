import { useState } from 'react'
import { Workshop } from '@/types/workshop'
import { WorkshopCard } from './WorkshopCard'
import { WorkshopFormModal } from './WorkshopFormModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'

interface WorkshopGridProps {
  workshops: Workshop[]
  onRefresh: () => void
}

export function WorkshopGrid({ workshops, onRefresh }: WorkshopGridProps) {
  const [editWorkshop, setEditWorkshop] = useState<Workshop | null>(null)
  const [deleteWorkshop, setDeleteWorkshop] = useState<Workshop | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop) => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            onEdit={setEditWorkshop}
            onDelete={setDeleteWorkshop}
          />
        ))}
      </div>

      <WorkshopFormModal
        isOpen={!!editWorkshop}
        workshop={editWorkshop}
        onClose={() => setEditWorkshop(null)}
        onSuccess={() => {
          setEditWorkshop(null)
          onRefresh()
        }}
      />

      <DeleteConfirmModal
        isOpen={!!deleteWorkshop}
        workshop={deleteWorkshop}
        onClose={() => setDeleteWorkshop(null)}
        onSuccess={() => {
          setDeleteWorkshop(null)
          onRefresh()
        }}
      />
    </>
  )
}
