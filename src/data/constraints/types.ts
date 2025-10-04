import { Layout } from '@/types/layout'
import { Workshop } from '@/types/workshop'

export enum ConstraintPriority {
  REQUIRED = 'REQUIRED',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface ConstraintEvaluation {
  satisfied: boolean
  score: number // 0-1, higher is better
  violations: string[]
  penalty: number // 0-1, higher is worse
}

export interface Constraint {
  id: string
  type: string
  priority: ConstraintPriority
  description: string
  evaluate: (layout: Layout, workshop: Workshop) => ConstraintEvaluation
}

export interface SafetyConstraintData {
  tool: string
  requirement_type: string
  measurements: {
    front: { min: number; ideal: number; unit: string }
    back: { min: number; ideal: number; unit: string }
    sides: { min: number; ideal: number; unit: string }
  }
  source_title: string
  source_url: string[]
  reasoning: string
  accident_reduction_percentage: number
  priority: ConstraintPriority
}

export interface WorkflowConstraintData {
  project_type: string
  primary_workflow: string
  tool_sequence: string[]
  adjacency_requirements: Array<{
    tools: string[]
    max_distance: { value: number; unit: string }
    reasoning: string
    time_penalty_percentage: number
    priority: ConstraintPriority
  }>
  distance_penalties: Array<{
    tool_pair: string[]
    ideal_distance: { value: number; unit: string }
    max_acceptable_distance: { value: number; unit: string }
    penalty_per_foot_over: number
    reasoning: string
  }>
}

export interface MobileToolConstraintData {
  tool_type: string
  mobility_advantages: {
    space_savings_percentage: { min: number; max: number }
    workflow_flexibility_improvement: string
    power_accessibility_benefit: string
  }
  deployment_constraints: {
    working_clearance: {
      front: { min: number; ideal: number; unit: string }
      back: { min: number; ideal: number; unit: string }
      sides: { min: number; ideal: number; unit: string }
    }
    stability_requirements: string
    power_cord_considerations: string
  }
  storage_constraints: {
    parked_clearance: {
      front: { min: number; ideal: number; unit: string }
      back: { min: number; ideal: number; unit: string }
      sides: { min: number; ideal: number; unit: string }
    }
    parking_zone_requirements: string
  }
  priority: ConstraintPriority
}
