/**
 * Tool category enumeration for organizing tools in the library
 * and filtering tool templates.
 */
export enum ToolCategory {
  POWER_TOOLS = 'power_tools',
  WORK_SURFACES = 'work_surfaces',
  DUST_COLLECTION = 'dust_collection'
}

/**
 * Human-readable labels for tool categories
 */
export const ToolCategoryLabels: Record<ToolCategory, string> = {
  [ToolCategory.POWER_TOOLS]: 'Power Tools',
  [ToolCategory.WORK_SURFACES]: 'Work Surfaces',
  [ToolCategory.DUST_COLLECTION]: 'Dust Collection'
}
