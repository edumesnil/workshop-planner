import { Constraint, ConstraintEvaluation, ConstraintPriority, SafetyConstraintData, WorkflowConstraintData, MobileToolConstraintData } from './types'
import { Layout } from '@/types/layout'
import { Workshop } from '@/types/workshop'

export class ConstraintFactory {
  /**
   * Generate safety clearance constraints from research data
   */
  static generateSafetyConstraints(data: SafetyConstraintData[]): Constraint[] {
    return data
      .filter(d => d.requirement_type === 'clearance')
      .map(d => ({
        id: `safety_clearance_${d.tool}`,
        type: 'safety_clearance',
        priority: d.priority,
        description: `${d.tool}: ${d.reasoning}`,
        evaluate: (layout: Layout, workshop: Workshop): ConstraintEvaluation => {
          const toolPlacement = layout.toolPlacements.find((tp: any) => tp.tool.type.toLowerCase() === d.tool)
          if (!toolPlacement) {
            return {
              satisfied: true,
              score: 1,
              violations: [],
              penalty: 0
            }
          }

          const violations: string[] = []
          let totalPenalty = 0
          const { position } = toolPlacement
          const tool = toolPlacement.tool

          // Check front clearance
          const frontSpace = workshop.dimensions.length - position.x - tool.dimensions.length
          if (frontSpace < d.measurements.front.min) {
            violations.push(`${tool.name} front clearance ${frontSpace}" < required ${d.measurements.front.min}"`)
            totalPenalty += (d.measurements.front.min - frontSpace) / d.measurements.front.min
          }

          // Check back clearance
          if (position.x < d.measurements.back.min) {
            violations.push(`${tool.name} back clearance ${position.x}" < required ${d.measurements.back.min}"`)
            totalPenalty += (d.measurements.back.min - position.x) / d.measurements.back.min
          }

          // Check side clearances
          const leftSpace = position.y
          const rightSpace = workshop.dimensions.width - position.y - tool.dimensions.width

          if (leftSpace < d.measurements.sides.min) {
            violations.push(`${tool.name} left clearance ${leftSpace}" < required ${d.measurements.sides.min}"`)
            totalPenalty += (d.measurements.sides.min - leftSpace) / d.measurements.sides.min
          }

          if (rightSpace < d.measurements.sides.min) {
            violations.push(`${tool.name} right clearance ${rightSpace}" < required ${d.measurements.sides.min}"`)
            totalPenalty += (d.measurements.sides.min - rightSpace) / d.measurements.sides.min
          }

          const satisfied = violations.length === 0
          const score = satisfied ? 1 : Math.max(0, 1 - totalPenalty)

          return {
            satisfied,
            score,
            violations,
            penalty: Math.min(1, totalPenalty)
          }
        }
      }))
  }

  /**
   * Generate workflow adjacency constraints from research data
   */
  static generateWorkflowConstraints(data: WorkflowConstraintData[]): Constraint[] {
    const constraints: Constraint[] = []

    for (const workflow of data) {
      // Generate adjacency constraints
      for (const adj of workflow.adjacency_requirements) {
        constraints.push({
          id: `workflow_adjacency_${workflow.project_type}_${adj.tools.join('_')}`,
          type: 'workflow_adjacency',
          priority: adj.priority,
          description: `${workflow.project_type}: ${adj.reasoning}`,
          evaluate: (layout: Layout, _workshop: Workshop): ConstraintEvaluation => {
            const placements = adj.tools.map(toolType =>
              layout.toolPlacements.find((tp: any) => tp.tool.type.toLowerCase() === toolType.toLowerCase())
            ).filter(Boolean)

            if (placements.length < 2) {
              return { satisfied: true, score: 1, violations: [], penalty: 0 }
            }

            const violations: string[] = []
            let totalPenalty = 0
            const maxDistInches = adj.max_distance.value

            for (let i = 0; i < placements.length - 1; i++) {
              for (let j = i + 1; j < placements.length; j++) {
                const p1 = placements[i] as any
                const p2 = placements[j] as any

                const dx = p2.position.x - p1.position.x
                const dy = p2.position.y - p1.position.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance > maxDistInches) {
                  const excess = distance - maxDistInches
                  violations.push(`${p1.tool.name} to ${p2.tool.name}: ${distance.toFixed(1)}" > ${maxDistInches}"`)
                  totalPenalty += (excess / maxDistInches) * (adj.time_penalty_percentage / 100)
                }
              }
            }

            const satisfied = violations.length === 0
            const score = satisfied ? 1 : Math.max(0, 1 - totalPenalty)

            return {
              satisfied,
              score,
              violations,
              penalty: Math.min(1, totalPenalty)
            }
          }
        })
      }

      // Generate distance penalty constraints
      for (const dist of workflow.distance_penalties) {
        constraints.push({
          id: `workflow_distance_${workflow.project_type}_${dist.tool_pair.join('_')}`,
          type: 'workflow_distance',
          priority: ConstraintPriority.MEDIUM,
          description: `${workflow.project_type}: ${dist.reasoning}`,
          evaluate: (layout: Layout, _workshop: Workshop): ConstraintEvaluation => {
            const [tool1Type, tool2Type] = dist.tool_pair
            const p1 = layout.toolPlacements.find((tp: any) => tp.tool.type.toLowerCase() === tool1Type.toLowerCase())
            const p2 = layout.toolPlacements.find((tp: any) => tp.tool.type.toLowerCase() === tool2Type.toLowerCase())

            if (!p1 || !p2) {
              return { satisfied: true, score: 1, violations: [], penalty: 0 }
            }

            const dx = p2.position.x - p1.position.x
            const dy = p2.position.y - p1.position.y
            const distanceInches = Math.sqrt(dx * dx + dy * dy)
            const distanceFeet = distanceInches / 12

            const idealFeet = dist.ideal_distance.value / 12
            const maxFeet = dist.max_acceptable_distance.value / 12

            const violations: string[] = []
            let penalty = 0

            if (distanceFeet > maxFeet) {
              const excessFeet = distanceFeet - maxFeet
              penalty = excessFeet * dist.penalty_per_foot_over
              violations.push(`${(p1 as any).tool.name} to ${(p2 as any).tool.name}: ${distanceFeet.toFixed(1)}' > ${maxFeet}' max`)
            } else if (distanceFeet > idealFeet) {
              const excessFeet = distanceFeet - idealFeet
              penalty = excessFeet * dist.penalty_per_foot_over * 0.5 // Softer penalty for non-ideal
            }

            const satisfied = distanceFeet <= maxFeet
            const score = Math.max(0, 1 - penalty)

            return {
              satisfied,
              score,
              violations,
              penalty: Math.min(1, penalty)
            }
          }
        })
      }
    }

    return constraints
  }

  /**
   * Generate mobile tool constraints from research data
   */
  static generateMobileToolConstraints(data: MobileToolConstraintData[]): Constraint[] {
    const constraints: Constraint[] = []

    for (const mobileData of data) {
      // Deployment (working) clearance constraint
      constraints.push({
        id: `mobile_deployed_${mobileData.tool_type}`,
        type: 'mobile_deployed_clearance',
        priority: mobileData.priority,
        description: `${mobileData.tool_type} deployed: ${mobileData.deployment_constraints.stability_requirements}`,
        evaluate: (layout: Layout, workshop: Workshop): ConstraintEvaluation => {
          const toolPlacement = layout.toolPlacements.find((tp: any) =>
            tp.tool.type.toLowerCase() === mobileData.tool_type.toLowerCase() &&
            (tp.tool as any).isMobile === true
          )

          if (!toolPlacement) {
            return { satisfied: true, score: 1, violations: [], penalty: 0 }
          }

          const violations: string[] = []
          let totalPenalty = 0
          const { position } = toolPlacement
          const tool = (toolPlacement as any).tool
          const req = mobileData.deployment_constraints.working_clearance

          // Front clearance
          const frontSpace = workshop.dimensions.length - position.x - tool.dimensions.length
          if (frontSpace < req.front.min) {
            violations.push(`${tool.name} deployed front ${frontSpace}" < ${req.front.min}"`)
            totalPenalty += (req.front.min - frontSpace) / req.front.min
          }

          // Back clearance
          if (position.x < req.back.min) {
            violations.push(`${tool.name} deployed back ${position.x}" < ${req.back.min}"`)
            totalPenalty += (req.back.min - position.x) / req.back.min
          }

          // Side clearances
          const leftSpace = position.y
          const rightSpace = workshop.dimensions.width - position.y - tool.dimensions.width

          if (leftSpace < req.sides.min) {
            violations.push(`${tool.name} deployed left ${leftSpace}" < ${req.sides.min}"`)
            totalPenalty += (req.sides.min - leftSpace) / req.sides.min
          }

          if (rightSpace < req.sides.min) {
            violations.push(`${tool.name} deployed right ${rightSpace}" < ${req.sides.min}"`)
            totalPenalty += (req.sides.min - rightSpace) / req.sides.min
          }

          const satisfied = violations.length === 0
          const score = satisfied ? 1 : Math.max(0, 1 - totalPenalty)

          return {
            satisfied,
            score,
            violations,
            penalty: Math.min(1, totalPenalty)
          }
        }
      })

      // Storage (parked) clearance constraint
      constraints.push({
        id: `mobile_parked_${mobileData.tool_type}`,
        type: 'mobile_parked_clearance',
        priority: ConstraintPriority.MEDIUM,
        description: `${mobileData.tool_type} parked: ${mobileData.storage_constraints.parking_zone_requirements}`,
        evaluate: (layout: Layout, workshop: Workshop): ConstraintEvaluation => {
          const toolPlacement = layout.toolPlacements.find((tp: any) =>
            tp.tool.type.toLowerCase() === mobileData.tool_type.toLowerCase() &&
            (tp.tool as any).isMobile === true
          )

          if (!toolPlacement || !(toolPlacement as any).parkedPosition) {
            return { satisfied: true, score: 1, violations: [], penalty: 0 }
          }

          const violations: string[] = []
          let totalPenalty = 0
          const position = (toolPlacement as any).parkedPosition
          const tool = (toolPlacement as any).tool
          const req = mobileData.storage_constraints.parked_clearance

          // Parked position clearance checks (reduced requirements)
          const frontSpace = workshop.dimensions.length - position.x - tool.dimensions.length
          if (frontSpace < req.front.min) {
            violations.push(`${tool.name} parked front ${frontSpace}" < ${req.front.min}"`)
            totalPenalty += (req.front.min - frontSpace) / req.front.min * 0.5 // Lower penalty
          }

          const satisfied = violations.length === 0
          const score = satisfied ? 1 : Math.max(0, 1 - totalPenalty)

          return {
            satisfied,
            score,
            violations,
            penalty: Math.min(1, totalPenalty)
          }
        }
      })
    }

    return constraints
  }

  /**
   * Combine all constraint types with priority-based ordering
   */
  static buildConstraintSet(
    safetyData: SafetyConstraintData[],
    workflowData: WorkflowConstraintData[],
    mobileData: MobileToolConstraintData[]
  ): Constraint[] {
    const constraints = [
      ...this.generateSafetyConstraints(safetyData),
      ...this.generateWorkflowConstraints(workflowData),
      ...this.generateMobileToolConstraints(mobileData)
    ]

    // Sort by priority: REQUIRED > HIGH > MEDIUM > LOW
    const priorityOrder = {
      [ConstraintPriority.REQUIRED]: 0,
      [ConstraintPriority.HIGH]: 1,
      [ConstraintPriority.MEDIUM]: 2,
      [ConstraintPriority.LOW]: 3
    }

    return constraints.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }
}
