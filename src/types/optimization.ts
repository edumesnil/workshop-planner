import { Tool, Workshop } from './workshop'
import { Layout } from './layout'

export interface OptimizationConfig {
  maxIterations: number
  timeLimit: number // milliseconds
  algorithm: OptimizationAlgorithm
  weights: OptimizationWeights
  constraints: Constraint[]
}

export enum OptimizationAlgorithm {
  CONSTRAINT_SATISFACTION = 'constraint_satisfaction',
  GENETIC_ALGORITHM = 'genetic_algorithm',
  SIMULATED_ANNEALING = 'simulated_annealing'
}

export interface OptimizationWeights {
  workflow: number     // 0-1, importance of workflow efficiency
  safety: number       // 0-1, importance of safety clearances
  space: number        // 0-1, importance of space utilization
  accessibility: number // 0-1, importance of tool accessibility
}

export interface Constraint {
  id: string
  type: ConstraintType
  priority: ConstraintPriority
  description: string
  parameters: ConstraintParameters
  evaluate: (layout: Layout, workshop: Workshop) => ConstraintEvaluation
}

export enum ConstraintType {
  CLEARANCE = 'clearance',
  WORKFLOW = 'workflow',
  POWER = 'power',
  DUST_COLLECTION = 'dust_collection',
  STRUCTURAL = 'structural',
  ACCESSIBILITY = 'accessibility'
}

export enum ConstraintPriority {
  REQUIRED = 'required',     // Must be satisfied
  HIGH = 'high',            // Strong preference
  MEDIUM = 'medium',        // Moderate preference
  LOW = 'low'              // Weak preference
}

export interface ConstraintParameters {
  [key: string]: any
}

export interface ConstraintEvaluation {
  satisfied: boolean
  score: number // 0-1, higher is better
  violations: string[]
}

export interface OptimizationRequest {
  workshop: Workshop
  tools: Tool[]
  config: OptimizationConfig
}

export interface OptimizationResult {
  layouts: Layout[]
  bestLayout: Layout
  statistics: OptimizationStatistics
}

export interface OptimizationStatistics {
  totalTime: number
  iterations: number
  convergence: ConvergenceData[]
  constraintSatisfaction: ConstraintSatisfactionStats
}

export interface ConvergenceData {
  iteration: number
  score: number
  time: number
}

export interface ConstraintSatisfactionStats {
  total: number
  satisfied: number
  violatedRequired: number
  violatedHigh: number
  violatedMedium: number
  violatedLow: number
}