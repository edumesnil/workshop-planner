/**
 * Workshop dimension presets for onboarding
 * All dimensions stored in inches (database format)
 */

export interface WorkshopPreset {
  id: string
  name: string
  description: string
  length: number // inches
  width: number // inches
  height: number // inches (ceiling height)
  typical_use?: string
}

export const WORKSHOP_PRESETS: WorkshopPreset[] = [
  {
    id: 'small-garage',
    name: 'Small Garage',
    description: 'Single-car garage workspace',
    length: 240, // 20 feet
    width: 120, // 10 feet
    height: 96, // 8 feet
    typical_use: 'Hobby projects, small repairs'
  },
  {
    id: 'medium-garage',
    name: 'Medium Garage',
    description: 'Two-car garage with workspace',
    length: 288, // 24 feet
    width: 240, // 20 feet
    height: 108, // 9 feet
    typical_use: 'Furniture building, general woodworking'
  },
  {
    id: 'large-garage',
    name: 'Large Garage',
    description: 'Dedicated workshop space',
    length: 360, // 30 feet
    width: 288, // 24 feet
    height: 120, // 10 feet
    typical_use: 'Professional woodworking, cabinetry'
  },
  {
    id: 'basement-workshop',
    name: 'Basement Workshop',
    description: 'Eric\'s basement setup',
    length: 213, // 17.75 feet
    width: 103, // 8.58 feet
    height: 96, // 8 feet
    typical_use: 'Custom basement workshop'
  },
  {
    id: 'custom',
    name: 'Custom Dimensions',
    description: 'Enter your own dimensions',
    length: 0,
    width: 0,
    height: 96, // default 8ft ceiling
    typical_use: 'Custom workshop layout'
  }
]

export function getPresetById(id: string): WorkshopPreset | undefined {
  return WORKSHOP_PRESETS.find(p => p.id === id)
}
