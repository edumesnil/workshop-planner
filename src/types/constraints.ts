export enum WallSide {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west'
}

export enum WallType {
  OPEN = 'open',
  WINDOW = 'window',
  DOOR = 'door',
  ELECTRICAL = 'electrical',
  UTILITIES = 'utilities',
  STORAGE = 'storage'
}

export interface WallConstraint {
  id: string
  wall: WallSide
  type: WallType
  position: number // inches from wall start
  width: number // inches along wall
  clearance: number // inches into room
  notes?: string
}

export interface Obstacle {
  id: string
  name: string
  position: { x: number, y: number } // inches from origin (bottom-left)
  dimensions: {
    length: number // inches (X axis)
    width: number // inches (Y axis)
    height: number // inches (Z axis)
  }
  fixed: boolean // can optimization engine move it?
  notes?: string
}

export interface WorkshopConstraints {
  walls: WallConstraint[]
  obstacles: Obstacle[]
}
