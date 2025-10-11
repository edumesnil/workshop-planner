import { useEffect, useRef } from 'react'
import { Card, CardBody } from '@heroui/react'

interface ContextMenuProps {
  x: number // Screen coordinates
  y: number
  onEdit?: () => void
  onDelete?: () => void
  onClose: () => void
}

export function ContextMenu({ x, y, onEdit, onDelete, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="fixed z-50"
      style={{ left: x, top: y }}
    >
      <Card className="min-w-[150px] shadow-lg">
        <CardBody className="p-1">
          {onEdit && (
            <button
              onClick={() => {
                onEdit()
                onClose()
              }}
              className="w-full text-left px-3 py-2 hover:bg-default-100 rounded text-sm focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                onDelete()
                onClose()
              }}
              className="w-full text-left px-3 py-2 hover:bg-danger-50 text-danger rounded text-sm focus-visible:outline-2 focus-visible:outline-danger focus-visible:outline-offset-1"
            >
              Delete
            </button>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
