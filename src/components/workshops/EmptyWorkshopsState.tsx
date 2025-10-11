import { Card, CardBody, Button } from '@heroui/react'

interface EmptyWorkshopsStateProps {
  onCreateClick: () => void
}

export function EmptyWorkshopsState({ onCreateClick }: EmptyWorkshopsStateProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardBody className="text-center p-12">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-default-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">🏗️</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Create Your First Workshop</h2>
        <p className="text-default-600 mb-6 max-w-md mx-auto">
          Define your workshop space to get started with layout optimization.
          Add dimensions, walls, and obstacles to generate efficient tool placements.
        </p>
        <Button color="primary" size="lg" onPress={onCreateClick}>
          Create Workshop
        </Button>
        <p className="text-sm text-default-400 mt-4">
          Takes less than 3 minutes to set up
        </p>
      </CardBody>
    </Card>
  )
}
