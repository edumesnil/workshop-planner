import { useState, useEffect, RefObject } from 'react'
import { Workshop } from '@/types/workshop'

interface CanvasContextReturn {
  ctx: CanvasRenderingContext2D | null
  scale: number
  offset: { x: number; y: number }
}

export function useCanvasContext(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  containerRef: RefObject<HTMLDivElement | null>,
  workshop: Workshop
): CanvasContextReturn {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Get 2D context
    const context = canvas.getContext('2d')
    if (!context) return

    // Handle HiDPI displays
    const dpr = window.devicePixelRatio || 1
    const rect = container.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    context.scale(dpr, dpr)
    setCtx(context)

    // Calculate scale to fit workshop in canvas with padding
    const padding = 40 // pixels
    const workshopWidthInches = workshop.dimensions.length
    const workshopHeightInches = workshop.dimensions.width

    const availableWidth = rect.width - padding * 2
    const availableHeight = rect.height - padding * 2

    const scaleX = availableWidth / workshopWidthInches
    const scaleY = availableHeight / workshopHeightInches
    const fitScale = Math.min(scaleX, scaleY)

    setScale(fitScale)

    // Center workshop
    const workshopPixelWidth = workshopWidthInches * fitScale
    const workshopPixelHeight = workshopHeightInches * fitScale
    setOffset({
      x: (rect.width - workshopPixelWidth) / 2,
      y: (rect.height - workshopPixelHeight) / 2,
    })

    // Handle resize
    const handleResize = () => {
      const newRect = container.getBoundingClientRect()
      canvas.width = newRect.width * dpr
      canvas.height = newRect.height * dpr
      canvas.style.width = `${newRect.width}px`
      canvas.style.height = `${newRect.height}px`
      context.scale(dpr, dpr)

      // Recalculate scale and offset
      const newAvailableWidth = newRect.width - padding * 2
      const newAvailableHeight = newRect.height - padding * 2
      const newScaleX = newAvailableWidth / workshopWidthInches
      const newScaleY = newAvailableHeight / workshopHeightInches
      const newFitScale = Math.min(newScaleX, newScaleY)

      setScale(newFitScale)

      const newWorkshopPixelWidth = workshopWidthInches * newFitScale
      const newWorkshopPixelHeight = workshopHeightInches * newFitScale
      setOffset({
        x: (newRect.width - newWorkshopPixelWidth) / 2,
        y: (newRect.height - newWorkshopPixelHeight) / 2,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [canvasRef, containerRef, workshop.dimensions])

  return { ctx, scale, offset }
}
