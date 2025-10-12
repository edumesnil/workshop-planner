import { Modal, ModalContent, ModalHeader, ModalBody, Tabs, Tab } from '@heroui/react'
import { MyToolsTab } from './MyToolsTab'
import { CreateToolTab } from './CreateToolTab'

interface AddToolModalProps {
  isOpen: boolean
  onClose: () => void
  workshopId: string
  onSuccess: () => void
}

export function AddToolModal({ isOpen, onClose, workshopId, onSuccess }: AddToolModalProps) {
  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size="3xl"
      backdrop="opaque"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              Add Tool to Workshop
            </ModalHeader>
            <ModalBody className="pb-6">
              <Tabs aria-label="Tool addition options">
                <Tab key="my-tools" title="My Tools">
                  <MyToolsTab workshopId={workshopId} onToolsChange={onSuccess} />
                </Tab>
                <Tab key="create" title="Create New Tool">
                  <CreateToolTab workshopId={workshopId} onSuccess={handleSuccess} />
                </Tab>
              </Tabs>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
