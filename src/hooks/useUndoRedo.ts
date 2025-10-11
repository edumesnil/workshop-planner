import { useState, useCallback } from 'react'

interface UseUndoRedoReturn<T> {
  state: T
  setState: (newState: T) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  clearHistory: () => void
}

const MAX_HISTORY = 20

export function useUndoRedo<T>(initialState: T): UseUndoRedoReturn<T> {
  const [history, setHistory] = useState<T[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  const state = history[currentIndex]

  const setState = useCallback((newState: T) => {
    setCurrentIndex((prevIndex) => {
      setHistory((prevHistory) => {
        // Remove any future states (if we're not at the end)
        const newHistory = prevHistory.slice(0, prevIndex + 1)

        // Add new state
        newHistory.push(newState)

        // Limit history size
        if (newHistory.length > MAX_HISTORY) {
          return newHistory.slice(newHistory.length - MAX_HISTORY)
        }

        return newHistory
      })

      // Return new index (account for MAX_HISTORY limit)
      const newLength = Math.min(prevIndex + 2, MAX_HISTORY)
      return newLength - 1
    })
  }, [])

  const undo = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }, [])

  const redo = useCallback(() => {
    setHistory((prevHistory) => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < prevHistory.length - 1) {
          return prevIndex + 1
        }
        return prevIndex
      })
      return prevHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory((prevHistory) => {
      setCurrentIndex(0)
      return [prevHistory[prevHistory.length - 1] || initialState]
    })
  }, [initialState])

  return {
    state,
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    clearHistory,
  }
}
