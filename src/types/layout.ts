import { Tool, Position, Orientation } from './workshop'

export interface Layout {
  id: string
  workshopId: string
  name: string
  toolPlacements: ToolPlacement[]
  score: OptimizationScore
  metadata: LayoutMetadata
  createdAt: Date
}

export interface ToolPlacement {
  toolId: string
  position: Position
  orientation: Orientation
  tool: Tool
}

export interface OptimizationScore {
  overall: number // 0-100
  workflow: number // efficiency of tool workflow
  safety: number // safety score based on clearances
  space: number // space utilization efficiency
  accessibility: number // ease of access to tools
}

export interface LayoutMetadata {
  optimizationTime: number // milliseconds
  algorithm: string
  iterations: number
  constraints: ConstraintResult[]
}

export interface ConstraintResult {
  constraintId: string
  satisfied: boolean
  score: number
  description: string
}