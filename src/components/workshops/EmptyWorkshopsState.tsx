import { Card, CardBody, Button } from '@heroui/react'

interface EmptyWorkshopsStateProps {
  onCreateClick: () => void
}

export function EmptyWorkshopsState({ onCreateClick }: EmptyWorkshopsStateProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardBody className="text-center p-12">
        <h2 className="text-2xl font-bold mb-2">Design Your Workshop</h2>
        <p className="text-default-600 mb-6 max-w-md mx-auto">
          Transform your workspace with smart layout planning. We'll guide you through mapping your ideal workshop in just a few steps.
        </p>
        <Button color="primary" size="lg" onPress={onCreateClick}>
          Start Workshop Design
        </Button>
        <p className="text-sm text-default-400 mt-4">
          Takes less than 3 minutes to set up
        </p>
      </CardBody>
    </Card>
  )
}
