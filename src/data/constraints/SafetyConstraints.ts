import { ConstraintFactory } from './ConstraintFactory'
import { Constraint, SafetyConstraintData } from './types'
import safetyFindings from '../research/safety-constraints-findings.json'

/**
 * Safety constraints generated from research data
 * Covers OSHA/Canadian clearance requirements for all tools
 */
export class SafetyConstraints {
  private static constraints: Constraint[] | null = null

  /**
   * Get all safety constraints (lazy loaded)
   */
  static getAll(): Constraint[] {
    if (!this.constraints) {
      this.constraints = ConstraintFactory.generateSafetyConstraints(
        safetyFindings.safety_findings as SafetyConstraintData[]
      )
    }
    return this.constraints
  }

  /**
   * Get safety constraints for a specific tool type
   */
  static forTool(toolType: string): Constraint[] {
    return this.getAll().filter(c => c.id.includes(toolType.toLowerCase()))
  }

  /**
   * Get only REQUIRED priority safety constraints
   */
  static getRequired(): Constraint[] {
    return this.getAll().filter(c => c.priority === 'REQUIRED')
  }
}
