import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { Workshop } from '@/types/workshop'
import { fromInches } from '@/utils/units'

interface WorkshopCardProps {
  workshop: Workshop
  onEdit: (workshop: Workshop) => void
  onDelete: (workshop: Workshop) => void
}

export function WorkshopCard({ workshop, onEdit, onDelete }: WorkshopCardProps) {
  const navigate = useNavigate()

  const lengthFt = fromInches(workshop.dimensions.length, 'feet')
  const widthFt = fromInches(workshop.dimensions.width, 'feet')
  const heightFt = fromInches(workshop.dimensions.height, 'feet')

  const constraintCount =
    (workshop.constraints?.walls?.length || 0) +
    (workshop.constraints?.obstacles?.length || 0)

  const lastUpdated = new Date(workshop.updatedAt).toLocaleDateString()

  const handleCardClick = () => {
    navigate(`/workshops/${workshop.id}`)
  }

  const handleEdit = () => {
    onEdit(workshop)
  }

  const handleDelete = () => {
    onDelete(workshop)
  }

  return (
    <Card>
      <div className="cursor-pointer" onClick={handleCardClick}>
        <CardHeader className="flex flex-col items-start gap-1 pb-0">
          <h3 className="text-lg font-semibold">{workshop.name}</h3>
          {workshop.description && (
            <p className="text-sm text-default-500 line-clamp-2">
              {workshop.description}
            </p>
          )}
        </CardHeader>
        <CardBody className="pt-3">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-default-600">Dimensions:</span>
              <span className="font-medium">
                {lengthFt.toFixed(1)}' × {widthFt.toFixed(1)}' × {heightFt.toFixed(1)}'
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-default-600">Constraints:</span>
              <Chip size="sm" variant="flat">
                {constraintCount}
              </Chip>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-default-600">Last updated:</span>
              <span className="text-default-500">{lastUpdated}</span>
            </div>
          </div>
        </CardBody>
      </div>
      <CardFooter className="gap-2">
        <Button
          size="sm"
          variant="flat"
          className="flex-1"
          onPress={handleEdit}
        >
          Edit
        </Button>
        <Button
          size="sm"
          color="danger"
          variant="light"
          onPress={handleDelete}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
