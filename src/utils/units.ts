/**
 * Unit conversion utilities for workshop dimensions
 * Storage format: inches (matching database schema)
 */

export type LengthUnit = 'inches' | 'feet' | 'meters'

/**
 * Convert any length unit to inches (storage format)
 */
export function toInches(value: number, unit: LengthUnit): number {
  switch (unit) {
    case 'inches':
      return value
    case 'feet':
      return value * 12
    case 'meters':
      return value * 39.3701
  }
}

/**
 * Convert inches to any length unit (display format)
 */
export function fromInches(inches: number, unit: LengthUnit): number {
  switch (unit) {
    case 'inches':
      return inches
    case 'feet':
      return inches / 12
    case 'meters':
      return inches / 39.3701
  }
}

/**
 * Round to 2 decimal places for display
 */
export function roundTo2Decimals(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Format dimension for display with unit
 */
export function formatDimension(inches: number, unit: LengthUnit): string {
  const value = roundTo2Decimals(fromInches(inches, unit))
  const unitLabel = unit === 'inches' ? '"' : unit === 'feet' ? "'" : 'm'
  return `${value}${unitLabel}`
}

/**
 * Parse dimension input (handles various formats)
 * Examples: "10", "10'", "10ft", "3m", "120in"
 */
export function parseDimensionInput(input: string): { value: number; unit: LengthUnit } | null {
  const trimmed = input.trim().toLowerCase()

  // Extract number and unit
  const match = trimmed.match(/^([\d.]+)\s*([a-z'"]*)?$/)
  if (!match) return null

  const value = parseFloat(match[1])
  if (isNaN(value) || value <= 0) return null

  const unitStr = match[2] || ''

  // Determine unit from suffix
  let unit: LengthUnit = 'inches' // default
  if (unitStr.includes('m') && !unitStr.includes('i')) {
    unit = 'meters'
  } else if (unitStr.includes("'") || unitStr.includes('ft') || unitStr.includes('feet')) {
    unit = 'feet'
  } else if (unitStr.includes('"') || unitStr.includes('in')) {
    unit = 'inches'
  }

  return { value, unit }
}
