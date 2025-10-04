import { ConstraintFactory } from './ConstraintFactory'
import { Constraint, MobileToolConstraintData, ConstraintPriority } from './types'

/**
 * Mobile tool constraints generated from research data
 * Covers dual-position optimization (deployed vs parked)
 */
export class MobileToolConstraints {
  private static constraints: Constraint[] | null = null

  /**
   * Get all mobile tool constraints (lazy loaded)
   */
  static getAll(): Constraint[] {
    if (!this.constraints) {
      const mobileData = this.extractMobileConstraintData()
      this.constraints = ConstraintFactory.generateMobileToolConstraints(mobileData)
    }
    return this.constraints
  }

  /**
   * Get constraints for a specific mobile tool type
   */
  static forTool(toolType: string): Constraint[] {
    return this.getAll().filter(c => c.id.includes(toolType.toLowerCase()))
  }

  /**
   * Extract mobile tool constraint data from research findings
   */
  private static extractMobileConstraintData(): MobileToolConstraintData[] {
    const data: MobileToolConstraintData[] = []

    // Common mobile tools based on research
    const mobileTools = [
      'table_saw',
      'band_saw',
      'planer',
      'jointer',
      'router_table',
      'drill_press'
    ]

    for (const tool of mobileTools) {
      data.push({
        tool_type: tool,
        mobility_advantages: {
          space_savings_percentage: { min: 30, max: 50 },
          workflow_flexibility_improvement: 'Reconfiguration in ~30 seconds for optimal clearances',
          power_accessibility_benefit: 'Position near outlets without permanent placement constraints'
        },
        deployment_constraints: {
          working_clearance: this.getDeployedClearance(tool),
          stability_requirements: 'Total-lock casters engaged on all 4 wheels; level surface required',
          power_cord_considerations: 'Maintain slack for 24-36" repositioning; avoid trip hazards'
        },
        storage_constraints: {
          parked_clearance: this.getParkedClearance(tool),
          parking_zone_requirements: 'Wall-adjacent or corner parking; grouped with similar-height tools'
        },
        priority: ConstraintPriority.HIGH
      })
    }

    return data
  }

  /**
   * Get deployed (working) clearance requirements for tool
   */
  private static getDeployedClearance(tool: string): any {
    // Based on safety research - mobile tools need same working clearances
    const clearances: Record<string, any> = {
      table_saw: {
        front: { min: 96, ideal: 120, unit: 'in' },
        back: { min: 96, ideal: 120, unit: 'in' },
        sides: { min: 36, ideal: 48, unit: 'in' }
      },
      band_saw: {
        front: { min: 36, ideal: 48, unit: 'in' },
        back: { min: 24, ideal: 36, unit: 'in' },
        sides: { min: 24, ideal: 36, unit: 'in' }
      },
      planer: {
        front: { min: 48, ideal: 72, unit: 'in' },
        back: { min: 48, ideal: 72, unit: 'in' },
        sides: { min: 18, ideal: 24, unit: 'in' }
      },
      jointer: {
        front: { min: 60, ideal: 84, unit: 'in' },
        back: { min: 60, ideal: 84, unit: 'in' },
        sides: { min: 18, ideal: 24, unit: 'in' }
      },
      router_table: {
        front: { min: 36, ideal: 48, unit: 'in' },
        back: { min: 36, ideal: 48, unit: 'in' },
        sides: { min: 24, ideal: 36, unit: 'in' }
      },
      drill_press: {
        front: { min: 24, ideal: 36, unit: 'in' },
        back: { min: 18, ideal: 24, unit: 'in' },
        sides: { min: 18, ideal: 24, unit: 'in' }
      }
    }

    return clearances[tool] || clearances.band_saw
  }

  /**
   * Get parked (storage) clearance requirements for tool
   * Parked tools have minimal clearance needs (30-50% space savings)
   */
  private static getParkedClearance(_tool: string): any {
    return {
      front: { min: 12, ideal: 18, unit: 'in' },
      back: { min: 0, ideal: 6, unit: 'in' }, // Can be against wall
      sides: { min: 6, ideal: 12, unit: 'in' }
    }
  }

  /**
   * Calculate space savings percentage for mobile tool layout
   */
  static calculateSpaceSavings(
    _toolCount: number,
    mobileCount: number,
    workshopArea: number
  ): number {
    const toolCount = _toolCount
    if (mobileCount === 0) return 0

    // Research shows 30-50% space savings with mobile tools
    const savingsPerTool = 0.4 // 40% average
    const ratio = mobileCount / toolCount
    const potentialSavings = workshopArea * savingsPerTool * ratio

    return Math.min(50, potentialSavings / workshopArea * 100)
  }
}
