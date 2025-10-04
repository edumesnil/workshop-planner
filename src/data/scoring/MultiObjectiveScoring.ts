import { Layout } from '@/types/layout'
import { Workshop } from '@/types/workshop'
import { Constraint } from '../constraints/types'

/**
 * Multi-objective scoring system: 40% safety, 25% workflow, 20% space, 15% accessibility
 * Based on research-validated weights and MCDA methodology
 */
export class MultiObjectiveScoring {
  private static readonly WEIGHTS = {
    safety: 0.40,
    workflow: 0.25,
    space: 0.20,
    accessibility: 0.15
  }

  /**
   * Calculate overall layout score (0-100)
   */
  static calculateScore(
    layout: Layout,
    workshop: Workshop,
    constraints: Constraint[]
  ): LayoutScore {
    const categoryScores = {
      safety: this.calculateSafetyScore(layout, workshop, constraints),
      workflow: this.calculateWorkflowScore(layout, workshop, constraints),
      space: this.calculateSpaceScore(layout, workshop),
      accessibility: this.calculateAccessibilityScore(layout, workshop)
    }

    const weightedScore =
      categoryScores.safety * this.WEIGHTS.safety +
      categoryScores.workflow * this.WEIGHTS.workflow +
      categoryScores.space * this.WEIGHTS.space +
      categoryScores.accessibility * this.WEIGHTS.accessibility

    return {
      overall: Math.round(weightedScore),
      categories: categoryScores,
      violations: this.collectViolations(constraints, layout, workshop),
      penalties: this.calculatePenalties(layout, workshop, constraints)
    }
  }

  /**
   * Safety score (40% weight)
   * Based on clearance compliance, exit access, and accident reduction
   */
  private static calculateSafetyScore(
    layout: Layout,
    workshop: Workshop,
    constraints: Constraint[]
  ): number {
    const safetyConstraints = constraints.filter(c =>
      c.type === 'safety_clearance' || c.priority === 'REQUIRED'
    )

    if (safetyConstraints.length === 0) return 100

    let totalScore = 0
    let totalWeight = 0

    for (const constraint of safetyConstraints) {
      const evaluation = constraint.evaluate(layout, workshop)
      const weight = this.getPriorityWeight(constraint.priority)

      totalScore += evaluation.score * weight
      totalWeight += weight
    }

    const baseScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 100

    // Penalty for clearance violations
    const clearancePenalty = this.calculateClearancePenalty(layout, workshop)

    return Math.max(0, baseScore - clearancePenalty)
  }

  /**
   * Workflow score (25% weight)
   * Based on adjacency compliance and material travel distance
   */
  private static calculateWorkflowScore(
    layout: Layout,
    workshop: Workshop,
    constraints: Constraint[]
  ): number {
    const workflowConstraints = constraints.filter(c =>
      c.type === 'workflow_adjacency' || c.type === 'workflow_distance'
    )

    if (workflowConstraints.length === 0) return 100

    let totalScore = 0
    let totalWeight = 0

    for (const constraint of workflowConstraints) {
      const evaluation = constraint.evaluate(layout, workshop)
      const weight = this.getPriorityWeight(constraint.priority)

      totalScore += evaluation.score * weight
      totalWeight += weight
    }

    const baseScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 100

    // Bonus for mobile tools (workflow flexibility)
    const mobileBonus = this.calculateMobileBonus(layout)

    return Math.min(100, baseScore + mobileBonus)
  }

  /**
   * Space utilization score (20% weight)
   * Optimal: 70% floor usage, with flexibility for reconfiguration
   */
  private static calculateSpaceScore(layout: Layout, workshop: Workshop): number {
    const workshopArea = workshop.dimensions.length * workshop.dimensions.width
    const usedArea = this.calculateUsedArea(layout)
    const usagePercent = (usedArea / workshopArea) * 100

    // Peak curve: optimal at 70%, tolerance ±20%
    const optimal = 70
    const deviation = Math.abs(usagePercent - optimal)
    const baseScore = Math.max(0, 100 - (deviation * 2))

    // Bonus for mobile tools (30-50% space savings potential)
    const mobileCount = layout.toolPlacements.filter((tp: any) => tp.tool.isMobile).length
    const mobileBonus = (mobileCount / layout.toolPlacements.length) * 15

    return Math.min(100, baseScore + mobileBonus)
  }

  /**
   * Accessibility & ergonomics score (15% weight)
   * Based on tool reachability and ergonomic placement
   */
  private static calculateAccessibilityScore(layout: Layout, _workshop: Workshop): number {
    let score = 100

    // Check tool reachability (within reasonable distance)
    const reachability = this.calculateReachability(layout)
    score = reachability * 100

    // Penalty for ergonomic issues
    const ergoPenalty = this.calculateErgonomicPenalty(layout)

    return Math.max(0, score - ergoPenalty)
  }

  /**
   * Get constraint priority weight
   */
  private static getPriorityWeight(priority: string): number {
    const weights: Record<string, number> = {
      REQUIRED: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1
    }
    return weights[priority] || 1
  }

  /**
   * Calculate clearance penalty (exponential for severe violations)
   */
  private static calculateClearancePenalty(layout: Layout, workshop: Workshop): number {
    let penalty = 0
    const minClearance = 28 // inches, legal minimum

    for (const placement of layout.toolPlacements) {
      const { position } = placement
      const tool = (placement as any).tool
      const clearances = {
        front: workshop.dimensions.length - position.x - tool.dimensions.length,
        back: position.x,
        left: position.y,
        right: workshop.dimensions.width - position.y - tool.dimensions.width
      }

      for (const clearance of Object.values(clearances)) {
        if (clearance < minClearance) {
          const deficit = minClearance - clearance
          penalty += 10 * Math.pow(2, deficit) // Exponential penalty
        }
      }
    }

    return Math.min(100, penalty)
  }

  /**
   * Calculate mobile tool bonus (flexibility + space savings)
   */
  private static calculateMobileBonus(layout: Layout): number {
    const mobileCount = layout.toolPlacements.filter((tp: any) => tp.tool.isMobile).length
    const totalCount = layout.toolPlacements.length

    if (totalCount === 0) return 0

    const mobileRatio = mobileCount / totalCount

    // 5 point bonus at 50% mobile, 10 points at 100% mobile
    return mobileRatio * 10
  }

  /**
   * Calculate used floor area (tools + clearances)
   */
  private static calculateUsedArea(layout: Layout): number {
    let area = 0

    for (const placement of layout.toolPlacements) {
      const tool = (placement as any).tool
      const toolArea = tool.dimensions.length * tool.dimensions.width
      const clearanceArea = this.estimateClearanceArea(tool)
      area += toolArea + clearanceArea
    }

    return area
  }

  /**
   * Estimate clearance area for tool
   */
  private static estimateClearanceArea(tool: any): number {
    const avgClearance =
      (tool.minClearance.front +
       tool.minClearance.back +
       tool.minClearance.left +
       tool.minClearance.right) / 4

    return avgClearance * (tool.dimensions.length + tool.dimensions.width)
  }

  /**
   * Calculate tool reachability score (0-1)
   */
  private static calculateReachability(layout: Layout): number {
    if (layout.toolPlacements.length === 0) return 1

    let reachableCount = 0
    const maxReachDistance = 120 // 10 feet

    for (let i = 0; i < layout.toolPlacements.length; i++) {
      const p1 = layout.toolPlacements[i]

      for (let j = i + 1; j < layout.toolPlacements.length; j++) {
        const p2 = layout.toolPlacements[j]

        const dx = p2.position.x - p1.position.x
        const dy = p2.position.y - p1.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance <= maxReachDistance) {
          reachableCount++
        }
      }
    }

    const maxPairs = (layout.toolPlacements.length * (layout.toolPlacements.length - 1)) / 2
    return maxPairs > 0 ? reachableCount / maxPairs : 1
  }

  /**
   * Calculate ergonomic penalty
   */
  private static calculateErgonomicPenalty(_layout: Layout): number {
    // Placeholder: would check for heavy items at wrong heights, etc.
    return 0
  }

  /**
   * Collect all constraint violations
   */
  private static collectViolations(
    constraints: Constraint[],
    layout: Layout,
    workshop: Workshop
  ): string[] {
    const violations: string[] = []

    for (const constraint of constraints) {
      const evaluation = constraint.evaluate(layout, workshop)
      violations.push(...evaluation.violations)
    }

    return violations
  }

  /**
   * Calculate total penalties
   */
  private static calculatePenalties(
    layout: Layout,
    workshop: Workshop,
    constraints: Constraint[]
  ): number {
    let totalPenalty = 0

    for (const constraint of constraints) {
      const evaluation = constraint.evaluate(layout, workshop)
      if (!evaluation.satisfied) {
        totalPenalty += evaluation.penalty * this.getPriorityWeight(constraint.priority)
      }
    }

    return totalPenalty
  }
}

export interface LayoutScore {
  overall: number // 0-100
  categories: {
    safety: number
    workflow: number
    space: number
    accessibility: number
  }
  violations: string[]
  penalties: number
}
