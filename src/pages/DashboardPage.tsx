import { Card, CardBody, CardHeader, Button } from '@heroui/react'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">My Workshops</h3>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">
              View and manage your workshop spaces
            </p>
            <Button as={Link} to="/workshops" color="primary">
              View Workshops
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">My Tools</h3>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">
              Manage your tool collection
            </p>
            <Button as={Link} to="/tools" color="primary">
              View Tools
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Layout Optimizer</h3>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">
              Optimize your workshop layout
            </p>
            <Button as={Link} to="/workshops" color="primary">
              Get Started
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
