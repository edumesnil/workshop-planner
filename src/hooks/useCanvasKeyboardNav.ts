import { useState, useCallback } from 'react'
import { Workshop } from '@/types/workshop'
import { WallSide } from '@/types/constraints'

type ElementType = 'wall' | 'obstacle'

interface FocusedElement {
  type: ElementType
  id: string // wall side or obstacle id
}

interface KeyboardNavState {
  focusedElement: FocusedElement | null
  moveIncrement: number // 1" or 12" (with Shift)
}

interface UseCanvasKeyboardNavReturn {
  focusedElement: FocusedElement | null
  handleCanvasKeyDown: (e: React.KeyboardEvent<HTMLCanvasElement>) => void
  setFocusedElement: (element: FocusedElement | null) => void
  moveFocusedElement: (dx: number, dy: number) => void
  selectFocusedElement: () => void
  deleteFocusedElement: () => void
}

export function useCanvasKeyboardNav(
  workshop: Workshop,
  onSelectWall: (wall: WallSide | null) => void,
  onSelectObstacle: (id: string | null) => void,
  onMoveObstacle: (id: string, dx: number, dy: number) => void,
  onDeleteElement: (type: ElementType, id: string) => void
): UseCanvasKeyboardNavReturn {
  const [state, setState] = useState<KeyboardNavState>({
    focusedElement: null,
    moveIncrement: 1, // inches
  })

  // Get all focusable elements in order
  const getFocusableElements = useCallback((): FocusedElement[] => {
    const elements: FocusedElement[] = []

    // Add walls in order: North, East, South, West
    const walls: WallSide[] = [WallSide.NORTH, WallSide.EAST, WallSide.SOUTH, WallSide.WEST]
    walls.forEach(wall => {
      elements.push({ type: 'wall', id: wall })
    })

    // Add obstacles
    workshop.constraints.obstacles.forEach(obstacle => {
      elements.push({ type: 'obstacle', id: obstacle.id })
    })

    return elements
  }, [workshop.constraints.obstacles])

  const setFocusedElement = useCallback((element: FocusedElement | null) => {
    setState(prev => ({ ...prev, focusedElement: element }))
  }, [])

  const cycleFocus = useCallback((direction: 'next' | 'prev') => {
    const elements = getFocusableElements()
    if (elements.length === 0) return

    setState(prev => {
      const currentIndex = prev.focusedElement
        ? elements.findIndex(el => el.type === prev.focusedElement?.type && el.id === prev.focusedElement?.id)
        : -1

      let nextIndex: number
      if (direction === 'next') {
        nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1
      }

      return { ...prev, focusedElement: elements[nextIndex] }
    })
  }, [getFocusableElements])

  const moveFocusedElement = useCallback((dx: number, dy: number) => {
    if (!state.focusedElement || state.focusedElement.type !== 'obstacle') return
    onMoveObstacle(state.focusedElement.id, dx, dy)
  }, [state.focusedElement, onMoveObstacle])

  const selectFocusedElement = useCallback(() => {
    if (!state.focusedElement) return

    if (state.focusedElement.type === 'wall') {
      onSelectWall(state.focusedElement.id as WallSide)
      onSelectObstacle(null)
    } else if (state.focusedElement.type === 'obstacle') {
      onSelectObstacle(state.focusedElement.id)
      onSelectWall(null)
    }
  }, [state.focusedElement, onSelectWall, onSelectObstacle])

  const deleteFocusedElement = useCallback(() => {
    if (!state.focusedElement) return
    onDeleteElement(state.focusedElement.type, state.focusedElement.id)
  }, [state.focusedElement, onDeleteElement])

  const handleCanvasKeyDown = useCallback((e: React.KeyboardEvent<HTMLCanvasElement>) => {
    // Update move increment based on Shift key
    const increment = e.shiftKey ? 12 : 1
    setState(prev => ({ ...prev, moveIncrement: increment }))

    switch (e.key) {
      case 'Tab':
        e.preventDefault()
        cycleFocus(e.shiftKey ? 'prev' : 'next')
        break

      case 'ArrowUp':
        e.preventDefault()
        moveFocusedElement(0, increment)
        break

      case 'ArrowDown':
        e.preventDefault()
        moveFocusedElement(0, -increment)
        break

      case 'ArrowLeft':
        e.preventDefault()
        moveFocusedElement(-increment, 0)
        break

      case 'ArrowRight':
        e.preventDefault()
        moveFocusedElement(increment, 0)
        break

      case 'Enter':
      case ' ':
        e.preventDefault()
        selectFocusedElement()
        break

      case 'Delete':
      case 'Backspace':
        e.preventDefault()
        deleteFocusedElement()
        break

      case 'Escape':
        e.preventDefault()
        setFocusedElement(null)
        onSelectWall(null)
        onSelectObstacle(null)
        break
    }
  }, [cycleFocus, moveFocusedElement, selectFocusedElement, deleteFocusedElement, setFocusedElement, onSelectWall, onSelectObstacle])

  return {
    focusedElement: state.focusedElement,
    handleCanvasKeyDown,
    setFocusedElement,
    moveFocusedElement,
    selectFocusedElement,
    deleteFocusedElement,
  }
}
