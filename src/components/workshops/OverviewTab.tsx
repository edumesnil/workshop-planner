import { Card, CardBody, CardHeader } from '@heroui/react'
import { Workshop } from '@/types/workshop'
import { fromInches } from '@/utils/units'

interface OverviewTabProps {
  workshop: Workshop
}

export function OverviewTab({ workshop }: OverviewTabProps) {
  const lengthFt = fromInches(workshop.dimensions.length, 'feet')
  const widthFt = fromInches(workshop.dimensions.width, 'feet')
  const heightFt = fromInches(workshop.dimensions.height, 'feet')
  const areaFt = lengthFt * widthFt

  const constraintCount = (workshop.constraints?.walls?.length || 0) + (workshop.constraints?.obstacles?.length || 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Dimensions</h3>
        </CardHeader>
        <CardBody className="flex flex-col gap-3">
          <div className="flex justify-between">
            <span className="text-default-600">Length:</span>
            <span className="font-medium">{lengthFt.toFixed(1)} ft ({workshop.dimensions.length} in)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-default-600">Width:</span>
            <span className="font-medium">{widthFt.toFixed(1)} ft ({workshop.dimensions.width} in)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-default-600">Height:</span>
            <span className="font-medium">{heightFt.toFixed(1)} ft ({workshop.dimensions.height} in)</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-default-200">
            <span className="text-default-600">Floor Area:</span>
            <span className="font-medium">{areaFt.toFixed(1)} sq ft</span>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Details</h3>
        </CardHeader>
        <CardBody className="flex flex-col gap-3">
          {workshop.description && (
            <div>
              <span className="text-default-600 block mb-1">Description:</span>
              <p className="text-sm">{workshop.description}</p>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-default-600">Constraints:</span>
            <span className="font-medium">{constraintCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-default-600">Wall Features:</span>
            <span className="font-medium">{workshop.constraints?.walls?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-default-600">Obstacles:</span>
            <span className="font-medium">{workshop.constraints?.obstacles?.length || 0}</span>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Timeline</h3>
        </CardHeader>
        <CardBody className="flex flex-col gap-3">
          <div className="flex justify-between">
            <span className="text-default-600">Created:</span>
            <span className="font-medium">
              {new Date(workshop.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-default-600">Last Updated:</span>
            <span className="font-medium">
              {new Date(workshop.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
