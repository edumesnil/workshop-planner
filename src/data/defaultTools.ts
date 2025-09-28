import { Tool, ToolType } from '@/types'

export const defaultTools: Omit<Tool, 'id' | 'placement'>[] = [
  {
    name: 'Table Saw',
    type: ToolType.TABLE_SAW,
    dimensions: {
      length: 84, // 7 feet including outfeed
      width: 48,  // 4 feet including fence extension
      height: 34
    },
    powerRequirement: {
      voltage: 220,
      amperage: 15,
      phase: 1
    },
    dustCollection: true,
    minClearance: {
      front: 48, // For loading long boards
      back: 96,  // Outfeed clearance
      left: 24,
      right: 36, // Fence extension clearance
      top: 12
    }
  },
  {
    name: 'Bandsaw',
    type: ToolType.BANDSAW,
    dimensions: {
      length: 24,
      width: 24,
      height: 72
    },
    powerRequirement: {
      voltage: 110,
      amperage: 10,
      phase: 1
    },
    dustCollection: true,
    minClearance: {
      front: 36,
      back: 18,
      left: 18,
      right: 18,
      top: 12
    }
  },
  {
    name: 'Planer',
    type: ToolType.PLANER,
    dimensions: {
      length: 36,
      width: 24,
      height: 18
    },
    powerRequirement: {
      voltage: 110,
      amperage: 15,
      phase: 1
    },
    dustCollection: true,
    minClearance: {
      front: 48, // Infeed clearance
      back: 48,  // Outfeed clearance
      left: 12,
      right: 12,
      top: 12
    }
  },
  {
    name: 'Jointer',
    type: ToolType.JOINTER,
    dimensions: {
      length: 72, // 6-inch jointer with tables
      width: 18,
      height: 34
    },
    powerRequirement: {
      voltage: 110,
      amperage: 12,
      phase: 1
    },
    dustCollection: true,
    minClearance: {
      front: 48,
      back: 48,
      left: 18,
      right: 18,
      top: 12
    }
  },
  {
    name: 'Router Table',
    type: ToolType.ROUTER_TABLE,
    dimensions: {
      length: 32,
      width: 24,
      height: 34
    },
    powerRequirement: {
      voltage: 110,
      amperage: 12,
      phase: 1
    },
    dustCollection: true,
    minClearance: {
      front: 36,
      back: 24,
      left: 18,
      right: 18,
      top: 12
    }
  },
  {
    name: 'Drill Press',
    type: ToolType.DRILL_PRESS,
    dimensions: {
      length: 20,
      width: 16,
      height: 60
    },
    powerRequirement: {
      voltage: 110,
      amperage: 8,
      phase: 1
    },
    dustCollection: false,
    minClearance: {
      front: 30,
      back: 12,
      left: 12,
      right: 12,
      top: 12
    }
  },
  {
    name: 'Workbench',
    type: ToolType.WORKBENCH,
    dimensions: {
      length: 96, // 8-foot bench
      width: 24,
      height: 34
    },
    dustCollection: false,
    minClearance: {
      front: 36,
      back: 18,
      left: 18,
      right: 18,
      top: 48 // Hand tool storage above
    }
  },
  {
    name: 'Dust Collector',
    type: ToolType.DUST_COLLECTOR,
    dimensions: {
      length: 36,
      width: 24,
      height: 60
    },
    powerRequirement: {
      voltage: 110,
      amperage: 12,
      phase: 1
    },
    dustCollection: false, // It IS the dust collection
    minClearance: {
      front: 24,
      back: 18,
      left: 18,
      right: 18,
      top: 12
    }
  }
]