import { Workshop } from '@/types/workshop'
import { WallSide } from '@/types/constraints'

interface ClickResult {
  type: 'wall' | 'obstacle' | 'wall-constraint' | 'empty'
  wallSide?: WallSide
  obstacleId?: string
  constraintId?: string
}

export function detectClick(
  x: number,
  y: number,
  workshop: Workshop,
  scale: number,
  offset: { x: number; y: number }
): ClickResult {
  // Convert screen coordinates to workshop coordinates
  const workshopX = (x - offset.x) / scale
  const workshopY = (y - offset.y) / scale

  const { length, width } = workshop.dimensions
  const wallClickMargin = 15 / scale // 15 pixels tolerance in workshop units

  // Check if click is on a wall constraint first (higher priority than wall boundary)
  const barThickness = 8 / scale // Convert pixels to workshop units
  const touchMargin = 10 / scale // Extra margin for easier clicking

  for (const constraint of workshop.constraints.walls) {
    let x = 0
    let y = 0
    let w = 0
    let h = 0

    switch (constraint.wall) {
      case WallSide.NORTH:
        x = constraint.position - touchMargin
        y = -barThickness - touchMargin
        w = constraint.width + (touchMargin * 2)
        h = barThickness + (touchMargin * 2)
        break
      case WallSide.SOUTH:
        x = constraint.position - touchMargin
        y = width - touchMargin
        w = constraint.width + (touchMargin * 2)
        h = barThickness + (touchMargin * 2)
        break
      case WallSide.EAST:
        x = length - touchMargin
        y = constraint.position - touchMargin
        w = barThickness + (touchMargin * 2)
        h = constraint.width + (touchMargin * 2)
        break
      case WallSide.WEST:
        x = -barThickness - touchMargin
        y = constraint.position - touchMargin
        w = barThickness + (touchMargin * 2)
        h = constraint.width + (touchMargin * 2)
        break
    }

    if (
      workshopX >= x &&
      workshopX <= x + w &&
      workshopY >= y &&
      workshopY <= y + h
    ) {
      return { type: 'wall-constraint', constraintId: constraint.id, wallSide: constraint.wall }
    }
  }

  // Check if click is on a wall (outside workshop boundary but within margin)
  // North wall (top)
  if (
    workshopX >= -wallClickMargin &&
    workshopX <= length + wallClickMargin &&
    workshopY >= -wallClickMargin &&
    workshopY <= 0
  ) {
    return { type: 'wall', wallSide: WallSide.NORTH }
  }

  // South wall (bottom)
  if (
    workshopX >= -wallClickMargin &&
    workshopX <= length + wallClickMargin &&
    workshopY >= width &&
    workshopY <= width + wallClickMargin
  ) {
    return { type: 'wall', wallSide: WallSide.SOUTH }
  }

  // East wall (right)
  if (
    workshopX >= length &&
    workshopX <= length + wallClickMargin &&
    workshopY >= -wallClickMargin &&
    workshopY <= width + wallClickMargin
  ) {
    return { type: 'wall', wallSide: WallSide.EAST }
  }

  // West wall (left)
  if (
    workshopX >= -wallClickMargin &&
    workshopX <= 0 &&
    workshopY >= -wallClickMargin &&
    workshopY <= width + wallClickMargin
  ) {
    return { type: 'wall', wallSide: WallSide.WEST }
  }

  // Check if click is on an obstacle
  for (const obstacle of workshop.constraints.obstacles) {
    const obsX = obstacle.position.x
    const obsY = obstacle.position.y
    const obsW = obstacle.dimensions.length
    const obsH = obstacle.dimensions.width

    if (
      workshopX >= obsX &&
      workshopX <= obsX + obsW &&
      workshopY >= obsY &&
      workshopY <= obsY + obsH
    ) {
      return { type: 'obstacle', obstacleId: obstacle.id }
    }
  }

  return { type: 'empty' }
}
