import { Workshop } from '@/types/workshop'

interface RenderContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  workshop: Workshop
  scale: number // pixels per inch
  offset: { x: number; y: number }
  gridSize: number // inches
  selectedWall?: string | null
  selectedObstacle?: string | null
}

export function renderFloorPlan(context: RenderContext): void {
  const { canvas, ctx, workshop, scale, offset, gridSize, selectedWall, selectedObstacle } = context

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Save context state
  ctx.save()

  // Apply offset (centering)
  ctx.translate(offset.x, offset.y)

  // Draw components in order (back to front)
  drawGrid(ctx, workshop, scale, gridSize)
  drawWorkshopBoundary(ctx, workshop, scale)
  drawWallConstraints(ctx, workshop, scale, selectedWall)
  drawObstacles(ctx, workshop, scale, selectedObstacle)

  // Restore context state
  ctx.restore()
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  workshop: Workshop,
  scale: number,
  gridSize: number
): void {
  const { length, width } = workshop.dimensions
  const pixelWidth = length * scale
  const pixelHeight = width * scale

  ctx.strokeStyle = '#e4e4e7' // neutral-300
  ctx.lineWidth = 1

  // Vertical grid lines
  for (let x = 0; x <= length; x += gridSize) {
    const px = x * scale
    ctx.beginPath()
    ctx.moveTo(px, 0)
    ctx.lineTo(px, pixelHeight)
    ctx.stroke()
  }

  // Horizontal grid lines
  for (let y = 0; y <= width; y += gridSize) {
    const py = y * scale
    ctx.beginPath()
    ctx.moveTo(0, py)
    ctx.lineTo(pixelWidth, py)
    ctx.stroke()
  }

  // Draw grid labels (feet)
  ctx.fillStyle = '#71717a' // neutral-500
  ctx.font = '10px sans-serif'
  ctx.textAlign = 'center'

  // X-axis labels (bottom)
  for (let x = 0; x <= length; x += 12) {
    const px = x * scale
    const feet = Math.round(x / 12)
    ctx.fillText(`${feet}'`, px, pixelHeight + 15)
  }

  // Y-axis labels (right)
  ctx.textAlign = 'left'
  for (let y = 0; y <= width; y += 12) {
    const py = y * scale
    const feet = Math.round(y / 12)
    ctx.fillText(`${feet}'`, pixelWidth + 5, py + 3)
  }
}

function drawWorkshopBoundary(
  ctx: CanvasRenderingContext2D,
  workshop: Workshop,
  scale: number
): void {
  const { length, width } = workshop.dimensions
  const pixelWidth = length * scale
  const pixelHeight = width * scale

  // Fill background
  ctx.fillStyle = '#fafafa' // neutral-50
  ctx.fillRect(0, 0, pixelWidth, pixelHeight)

  // Draw border
  ctx.strokeStyle = '#404040' // neutral-700
  ctx.lineWidth = 2
  ctx.strokeRect(0, 0, pixelWidth, pixelHeight)

  // Draw subtle shadow for depth
  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  ctx.strokeRect(0, 0, pixelWidth, pixelHeight)
  ctx.restore()
}

function drawWallConstraints(
  ctx: CanvasRenderingContext2D,
  workshop: Workshop,
  scale: number,
  selectedWall?: string | null
): void {
  const { walls } = workshop.constraints
  const { length, width } = workshop.dimensions

  walls.forEach((wall) => {
    const isSelected = selectedWall === wall.id

    // Color by type
    const colors: Record<string, string> = {
      window: '#0ea5e9', // sky-500
      door: '#10b981', // green-500
      electrical: '#f59e0b', // amber-500
      utilities: '#ef4444', // red-500
      storage: '#9ca3af', // gray-400
      open: '#6b7280', // gray-500
    }

    const color = colors[wall.type] || '#6b7280'
    ctx.fillStyle = isSelected ? color : `${color}88` // Add transparency if not selected
    ctx.strokeStyle = color
    ctx.lineWidth = isSelected ? 3 : 2

    // Calculate position based on wall side
    let x = 0
    let y = 0
    let w = 0
    let h = 0

    const barThickness = 8 // pixels

    switch (wall.wall) {
      case 'north': // Top wall
        x = wall.position * scale
        y = -barThickness
        w = wall.width * scale
        h = barThickness
        break
      case 'south': // Bottom wall
        x = wall.position * scale
        y = width * scale
        w = wall.width * scale
        h = barThickness
        break
      case 'east': // Right wall
        x = length * scale
        y = wall.position * scale
        w = barThickness
        h = wall.width * scale
        break
      case 'west': // Left wall
        x = -barThickness
        y = wall.position * scale
        w = barThickness
        h = wall.width * scale
        break
    }

    // Draw wall constraint bar
    ctx.fillRect(x, y, w, h)
    ctx.strokeRect(x, y, w, h)

    // Draw clearance indicator if present
    if (wall.clearance > 0) {
      ctx.setLineDash([5, 5])
      ctx.strokeStyle = color
      ctx.lineWidth = 1

      const clearancePixels = wall.clearance * scale

      switch (wall.wall) {
        case 'north':
          ctx.strokeRect(x, 0, w, clearancePixels)
          break
        case 'south':
          ctx.strokeRect(x, width * scale - clearancePixels, w, clearancePixels)
          break
        case 'east':
          ctx.strokeRect(length * scale - clearancePixels, y, clearancePixels, h)
          break
        case 'west':
          ctx.strokeRect(0, y, clearancePixels, h)
          break
      }

      ctx.setLineDash([])
    }
  })
}

function drawObstacles(
  ctx: CanvasRenderingContext2D,
  workshop: Workshop,
  scale: number,
  selectedObstacle?: string | null
): void {
  const { obstacles } = workshop.constraints

  obstacles.forEach((obstacle) => {
    const isSelected = selectedObstacle === obstacle.id

    const x = obstacle.position.x * scale
    const y = obstacle.position.y * scale
    const w = obstacle.dimensions.length * scale
    const h = obstacle.dimensions.width * scale

    // Fill
    ctx.fillStyle = isSelected ? '#3b82f6' : '#93c5fd' // blue-500 : blue-300
    ctx.fillRect(x, y, w, h)

    // Border
    ctx.strokeStyle = isSelected ? '#1e40af' : '#3b82f6' // blue-800 : blue-500
    ctx.lineWidth = isSelected ? 3 : 2
    ctx.strokeRect(x, y, w, h)

    // Label
    ctx.fillStyle = isSelected ? '#1e40af' : '#1e3a8a' // blue-800 : blue-900
    ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(obstacle.name, x + w / 2, y + h / 2)
  })
}
