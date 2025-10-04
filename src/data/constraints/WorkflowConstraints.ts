import { ConstraintFactory } from './ConstraintFactory'
import { Constraint, WorkflowConstraintData } from './types'
import projectPatterns from '../research/project-patterns-data-findings.json'

/**
 * Workflow constraints generated from project pattern research
 * Covers tool adjacency and distance requirements for different project types
 */
export class WorkflowConstraints {
  private static constraintCache: Map<string, Constraint[]> = new Map()

  /**
   * Get workflow constraints for a specific project type
   */
  static forProjectType(projectType: string): Constraint[] {
    const cacheKey = projectType.toLowerCase()

    if (this.constraintCache.has(cacheKey)) {
      return this.constraintCache.get(cacheKey)!
    }

    const projectData = this.findProjectData(projectType)
    if (!projectData) {
      return []
    }

    const workflowData = this.convertToWorkflowData(projectData)
    const constraints = ConstraintFactory.generateWorkflowConstraints([workflowData])

    this.constraintCache.set(cacheKey, constraints)
    return constraints
  }

  /**
   * Get all workflow constraints for MVP project types
   */
  static getAll(): Constraint[] {
    const mvpTypes = ['cabinetry', 'furniture', 'kitchen goods']
    const allConstraints: Constraint[] = []

    for (const type of mvpTypes) {
      allConstraints.push(...this.forProjectType(type))
    }

    return allConstraints
  }

  /**
   * Find project data from research findings
   */
  private static findProjectData(projectType: string): any {
    const normalized = projectType.toLowerCase()

    return projectPatterns.project_type_patterns.find(p => {
      const type = p.project_type.toLowerCase()
      return type.includes(normalized) || normalized.includes(type.split(' ')[0])
    })
  }

  /**
   * Convert project pattern data to workflow constraint data format
   */
  private static convertToWorkflowData(projectData: any): WorkflowConstraintData {
    const toolSequence = this.extractToolSequence(projectData.primary_tools_sequence)
    const adjacencyRequirements = this.extractAdjacencyRequirements(projectData)
    const distancePenalties = this.extractDistancePenalties(projectData)

    return {
      project_type: projectData.project_type,
      primary_workflow: projectData.primary_tools_sequence.join(' → '),
      tool_sequence: toolSequence,
      adjacency_requirements: adjacencyRequirements,
      distance_penalties: distancePenalties
    }
  }

  /**
   * Extract tool sequence from workflow steps
   */
  private static extractToolSequence(steps: string[]): string[] {
    const tools: string[] = []
    const toolKeywords = [
      'table_saw', 'miter_saw', 'band_saw', 'jointer', 'planer',
      'router_table', 'drill_press', 'assembly', 'sanding', 'finishing'
    ]

    for (const step of steps) {
      const stepLower = step.toLowerCase()
      for (const tool of toolKeywords) {
        if (stepLower.includes(tool.replace('_', ' ')) || stepLower.includes(tool.replace('_', ''))) {
          if (!tools.includes(tool)) {
            tools.push(tool)
          }
        }
      }
    }

    return tools
  }

  /**
   * Extract adjacency requirements from optimal tool arrangement
   */
  private static extractAdjacencyRequirements(projectData: any): any[] {
    const requirements = []
    const arrangement = projectData.optimal_tool_arrangement

    // Milling cell adjacency (jointer-planer-table_saw)
    if (arrangement.jointer_planer?.distance_to_table_saw) {
      const distStr = arrangement.jointer_planer.distance_to_table_saw
      const maxDist = this.parseDistance(distStr)

      requirements.push({
        tools: ['jointer', 'planer', 'table_saw'],
        max_distance: { value: maxDist, unit: 'in' },
        reasoning: 'Milling cell efficiency - minimize travel between rough mill and final cuts',
        time_penalty_percentage: 15,
        priority: 'HIGH'
      })
    }

    // Assembly to clamp rack adjacency
    if (arrangement.assembly_table) {
      requirements.push({
        tools: ['assembly', 'clamps'],
        max_distance: { value: 72, unit: 'in' },
        reasoning: 'Quick access to clamps during glue-up reduces setup time',
        time_penalty_percentage: 10,
        priority: 'MEDIUM'
      })
    }

    // Panel breakdown adjacency for cabinetry
    if (arrangement.panel_breakdown && arrangement.edgebanding) {
      requirements.push({
        tools: ['table_saw', 'router_table'],
        max_distance: { value: 96, unit: 'in' },
        reasoning: 'Sheet processing workflow - cut to edgeband in sequence',
        time_penalty_percentage: 12,
        priority: 'MEDIUM'
      })
    }

    return requirements
  }

  /**
   * Extract distance penalties from efficiency metrics
   */
  private static extractDistancePenalties(projectData: any): any[] {
    const penalties = []
    const arrangement = projectData.optimal_tool_arrangement

    // Table saw to material storage
    if (arrangement.lumber_rack) {
      penalties.push({
        tool_pair: ['table_saw', 'material_storage'],
        ideal_distance: { value: 120, unit: 'in' },
        max_acceptable_distance: { value: 240, unit: 'in' },
        penalty_per_foot_over: 0.05,
        reasoning: 'Minimize material handling distance from storage to breakdown'
      })
    }

    // Finishing separation
    if (arrangement.finishing?.separate_corner_or_room) {
      penalties.push({
        tool_pair: ['finishing', 'table_saw'],
        ideal_distance: { value: 144, unit: 'in' },
        max_acceptable_distance: { value: 360, unit: 'in' },
        penalty_per_foot_over: 0.03,
        reasoning: 'Separate finishing area from dust-generating machines'
      })
    }

    return penalties
  }

  /**
   * Parse distance string to inches
   */
  private static parseDistance(distStr: string): number {
    const match = distStr.match(/(\d+)\s*(ft|in|m)?/)
    if (!match) return 72 // default 6ft

    const value = parseInt(match[1])
    const unit = match[2] || 'ft'

    switch (unit) {
      case 'ft': return value * 12
      case 'in': return value
      case 'm': return value * 39.37
      default: return value * 12
    }
  }
}
