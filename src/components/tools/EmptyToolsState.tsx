import { Card, CardBody, Button } from '@heroui/react'

interface EmptyToolsStateProps {
  onCreateClick: () => void
}

export function EmptyToolsState({ onCreateClick }: EmptyToolsStateProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardBody className="text-center p-12">
        <h2 className="text-2xl font-bold mb-2">Design Your Ideal Workshop</h2>
        <p className="text-default-600 mb-6 max-w-md mx-auto">
          Start by documenting your tools. We'll help you create an optimized layout using research-backed templates or your custom configurations.
        </p>
        <Button color="primary" size="lg" onPress={onCreateClick}>
          Get Started with Tool Profiles
        </Button>
        <p className="text-sm text-default-400 mt-4">
          Choose from 13 expert-validated tool templates
        </p>
      </CardBody>
    </Card>
  )
}
