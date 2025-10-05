import { Card, CardBody, CardHeader, Button } from '@heroui/react'
import { fromInches } from '@/utils/units'

interface SummaryStepProps {
  workshop: { length: number; width: number; height: number } | null
  toolCount: number
  onBack: () => void
  onComplete: () => void
}

export function SummaryStep({ workshop, toolCount, onBack, onComplete }: SummaryStepProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-col gap-1 px-6 pt-6">
        <h2 className="text-2xl font-bold">Ready to Optimize!</h2>
        <p className="text-sm text-default-500">
          Here's a summary of your workshop setup
        </p>
      </CardHeader>
      <CardBody className="px-6 pb-6">
        <div className="flex flex-col gap-6">
          {/* Workshop Summary */}
          <div className="p-4 bg-default-100 rounded-lg">
            <h3 className="font-semibold mb-3">Workshop Dimensions</h3>
            {workshop ? (
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-default-600">Length:</span>
                  <span className="font-medium">{fromInches(workshop.length, 'feet').toFixed(1)} ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Width:</span>
                  <span className="font-medium">{fromInches(workshop.width, 'feet').toFixed(1)} ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Height:</span>
                  <span className="font-medium">{fromInches(workshop.height, 'feet').toFixed(1)} ft</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-default-200">
                  <span className="text-default-600">Floor Area:</span>
                  <span className="font-medium">
                    {((workshop.length * workshop.width) / 144).toFixed(0)} sq ft
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-default-500">No dimensions set</p>
            )}
          </div>

          {/* Tools Summary */}
          <div className="p-4 bg-default-100 rounded-lg">
            <h3 className="font-semibold mb-3">Tools</h3>
            <p className="text-sm">
              {toolCount === 0 ? (
                <span className="text-default-500">No tools selected</span>
              ) : (
                <span className="font-medium">{toolCount} tool{toolCount === 1 ? '' : 's'} selected</span>
              )}
            </p>
            {toolCount > 0 && (
              <p className="text-xs text-default-500 mt-2">
                You can add more tools or edit them later
              </p>
            )}
          </div>

          {/* Next Steps */}
          <div className="p-4 border-2 border-primary-200 bg-primary-50 rounded-lg">
            <h3 className="font-semibold text-primary-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-primary-800 space-y-1">
              <li>• Access your workshop dashboard</li>
              <li>• Add or edit tools</li>
              <li>• Run layout optimizations</li>
              <li>• View 3D visualizations</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="light" onPress={onBack}>
              Back
            </Button>
            <Button color="primary" size="lg" onPress={onComplete}>
              Complete Setup
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
