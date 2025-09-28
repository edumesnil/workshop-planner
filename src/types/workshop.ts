export interface Workshop {
  id: string
  name: string
  dimensions: Dimensions
  constraints: any[] // Will be properly typed when constraint system is implemented
  createdAt: Date
  updatedAt: Date
}

export interface Dimensions {
  length: number // inches
  width: number  // inches
  height: number // inches
}

export interface Position {
  x: number
  y: number
  z: number
}

export interface Orientation {
  rotation: number // degrees
}

export interface Tool {
  id: string
  name: string
  type: ToolType
  dimensions: Dimensions
  powerRequirement?: PowerRequirement
  dustCollection: boolean
  minClearance: Clearance
  placement?: Placement
}

export enum ToolType {
  TABLE_SAW = 'table_saw',
  BANDSAW = 'bandsaw',
  PLANER = 'planer',
  JOINTER = 'jointer',
  ROUTER_TABLE = 'router_table',
  DRILL_PRESS = 'drill_press',
  WORKBENCH = 'workbench',
  STORAGE = 'storage',
  DUST_COLLECTOR = 'dust_collector'
}

export interface PowerRequirement {
  voltage: number // 110 or 220
  amperage: number
  phase: number // 1 or 3
}

export interface Clearance {
  front: number  // inches
  back: number   // inches
  left: number   // inches
  right: number  // inches
  top: number    // inches
}

export interface Placement {
  position: Position
  orientation: Orientation
  fixed: boolean // cannot be moved during optimization
}