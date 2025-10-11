import { Workshop } from '@/types/workshop'
import { WallSide } from '@/types/constraints'

interface ClickResult {
  type: 'wall' | 'obstacle' | 'empty'
  wallSide?: WallSide
  obstacleId?: string
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
