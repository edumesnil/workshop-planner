import { useCallback, useEffect, useRef, useState } from 'react'

interface UseDebouncedSaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  autoSaveInterval?: number // milliseconds, default 60000 (1 minute)
}

export function useDebouncedSave<T>({
  data,
  onSave,
  autoSaveInterval = 60000, // 1 minute default
}: UseDebouncedSaveOptions<T>) {
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  const savedDataRef = useRef<T>(data)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pendingDataRef = useRef<T>(data)

  // Track when data changes
  useEffect(() => {
    const hasChanged = JSON.stringify(data) !== JSON.stringify(savedDataRef.current)
    setHasUnsavedChanges(hasChanged)
    pendingDataRef.current = data
  }, [data])

  // Auto-save timer
  useEffect(() => {
    if (!hasUnsavedChanges) return

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Set new timer
    autoSaveTimerRef.current = setTimeout(async () => {
      await performSave()
    }, autoSaveInterval)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [hasUnsavedChanges, autoSaveInterval])

  const performSave = useCallback(async () => {
    if (isSaving) return

    setIsSaving(true)
    try {
      await onSave(pendingDataRef.current)
      savedDataRef.current = pendingDataRef.current
      setHasUnsavedChanges(false)
      setLastSavedAt(new Date())
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }, [onSave, isSaving])

  // Manual save
  const save = useCallback(async () => {
    if (!hasUnsavedChanges || isSaving) return
    await performSave()
  }, [hasUnsavedChanges, isSaving, performSave])

  return {
    save,
    isSaving,
    hasUnsavedChanges,
    lastSavedAt,
  }
}
