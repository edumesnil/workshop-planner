import { Card, CardBody, Button } from '@heroui/react'

interface EmptyToolsStateProps {
  onCreateClick: () => void
}

export function EmptyToolsState({ onCreateClick }: EmptyToolsStateProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardBody className="text-center p-12">
        <h2 className="text-2xl font-bold mb-2">Build Your Tool Library</h2>
        <p className="text-default-600 mb-6 max-w-md mx-auto">
          Create a library of your woodworking tools to optimize workshop layouts. Choose from research-based templates or add custom tools.
        </p>
        <Button color="primary" size="lg" onPress={onCreateClick}>
          Add Your First Tool
        </Button>
        <p className="text-sm text-default-400 mt-4">
          13 research-based templates available
        </p>
      </CardBody>
    </Card>
  )
}
