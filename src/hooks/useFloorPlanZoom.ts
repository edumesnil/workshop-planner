import { useState, useCallback, RefObject } from 'react'
import { Workshop } from '@/types/workshop'

interface ZoomPanState {
  zoom: number
  panOffset: { x: number; y: number }
  isPanning: boolean
}

interface UseFloorPlanZoomReturn {
  zoom: number
  panOffset: { x: number; y: number }
  isPanning: boolean
  handleWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void
  handlePanStart: (e: React.MouseEvent<HTMLCanvasElement>) => void
  handlePanMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
  handlePanEnd: () => void
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
  fitToView: () => void
}

const MIN_ZOOM = 0.25
const MAX_ZOOM = 4.0
const ZOOM_STEP = 0.1

export function useFloorPlanZoom(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  _workshop: Workshop,
  baseScale: number,
  baseOffset: { x: number; y: number }
): UseFloorPlanZoomReturn {
  const [state, setState] = useState<ZoomPanState>({
    zoom: 1.0,
    panOffset: { x: 0, y: 0 },
    isPanning: false,
  })

  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null)

  // Mouse wheel zoom centered on cursor
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    setState((prev) => {
      // Calculate zoom delta (negative deltaY = zoom in)
      const delta = -e.deltaY * 0.001
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.zoom + delta))

      if (newZoom === prev.zoom) return prev

      // Zoom centered on mouse cursor
      // Point in canvas coords before zoom (relative to baseOffset + panOffset)
      const pointX = mouseX - baseOffset.x - prev.panOffset.x
      const pointY = mouseY - baseOffset.y - prev.panOffset.y

      // Scale factor change
      const zoomRatio = newZoom / prev.zoom

      // Adjust pan offset to keep the point under the cursor
      const newPanOffset = {
        x: prev.panOffset.x + pointX - pointX * zoomRatio,
        y: prev.panOffset.y + pointY - pointY * zoomRatio,
      }

      return {
        ...prev,
        zoom: newZoom,
        panOffset: newPanOffset,
      }
    })
  }, [canvasRef, baseScale, baseOffset])

  // Pan with middle-click or left-click (when spacebar is held)
  const handlePanStart = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Middle mouse button or left button (left button checked in parent with spacebar)
    if (e.button === 1 || e.button === 0) {
      e.preventDefault()
      setPanStart({ x: e.clientX, y: e.clientY })
      setState((prev) => ({ ...prev, isPanning: true }))
    }
  }, [])

  const handlePanMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!state.isPanning || !panStart) return

    const dx = e.clientX - panStart.x
    const dy = e.clientY - panStart.y

    setState((prev) => ({
      ...prev,
      panOffset: {
        x: prev.panOffset.x + dx,
        y: prev.panOffset.y + dy,
      },
    }))

    setPanStart({ x: e.clientX, y: e.clientY })
  }, [state.isPanning, panStart])

  const handlePanEnd = useCallback(() => {
    setState((prev) => ({ ...prev, isPanning: false }))
    setPanStart(null)
  }, [])

  // Zoom controls
  const zoomIn = useCallback(() => {
    setState((prev) => ({
      ...prev,
      zoom: Math.min(MAX_ZOOM, prev.zoom + ZOOM_STEP),
    }))
  }, [])

  const zoomOut = useCallback(() => {
    setState((prev) => ({
      ...prev,
      zoom: Math.max(MIN_ZOOM, prev.zoom - ZOOM_STEP),
    }))
  }, [])

  const resetView = useCallback(() => {
    setState({
      zoom: 1.0,
      panOffset: { x: 0, y: 0 },
      isPanning: false,
    })
  }, [])

  const fitToView = useCallback(() => {
    // Reset to base scale and center (same as initial view)
    setState({
      zoom: 1.0,
      panOffset: { x: 0, y: 0 },
      isPanning: false,
    })
  }, [])

  return {
    zoom: state.zoom,
    panOffset: state.panOffset,
    isPanning: state.isPanning,
    handleWheel,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    zoomIn,
    zoomOut,
    resetView,
    fitToView,
  }
}
