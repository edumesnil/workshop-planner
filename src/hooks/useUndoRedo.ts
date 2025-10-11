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
    setHistory((prev) => {
      // Remove any future states (if we're not at the end)
      const newHistory = prev.slice(0, currentIndex + 1)

      // Add new state
      newHistory.push(newState)

      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        return newHistory.slice(newHistory.length - MAX_HISTORY)
      }

      return newHistory
    })

    setCurrentIndex((prev) => {
      const newHistory = history.slice(0, prev + 1)
      newHistory.push(newState)

      // Adjust index if we're at max capacity
      if (newHistory.length > MAX_HISTORY) {
        return MAX_HISTORY - 1
      }

      return prev + 1
    })
  }, [currentIndex, history])

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, history.length])

  const clearHistory = useCallback(() => {
    setHistory([state])
    setCurrentIndex(0)
  }, [state])

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
