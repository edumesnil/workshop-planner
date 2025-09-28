// Database schema types for Supabase

export interface Database {
  public: {
    Tables: {
      workshops: {
        Row: WorkshopRow
        Insert: WorkshopInsert
        Update: WorkshopUpdate
      }
      tools: {
        Row: ToolRow
        Insert: ToolInsert
        Update: ToolUpdate
      }
      layouts: {
        Row: LayoutRow
        Insert: LayoutInsert
        Update: LayoutUpdate
      }
      user_profiles: {
        Row: UserProfileRow
        Insert: UserProfileInsert
        Update: UserProfileUpdate
      }
    }
  }
}

export interface WorkshopRow {
  id: string
  user_id: string
  name: string
  dimensions: {
    length: number
    width: number
    height: number
  }
  constraints: any[]
  created_at: string
  updated_at: string
}

export interface WorkshopInsert {
  id?: string
  user_id: string
  name: string
  dimensions: {
    length: number
    width: number
    height: number
  }
  constraints?: any[]
  created_at?: string
  updated_at?: string
}

export interface WorkshopUpdate {
  name?: string
  dimensions?: {
    length: number
    width: number
    height: number
  }
  constraints?: any[]
  updated_at?: string
}

export interface ToolRow {
  id: string
  user_id: string
  name: string
  type: string
  dimensions: {
    length: number
    width: number
    height: number
  }
  power_requirement?: {
    voltage: number
    amperage: number
    phase: number
  }
  dust_collection: boolean
  min_clearance: {
    front: number
    back: number
    left: number
    right: number
    top: number
  }
  created_at: string
  updated_at: string
}

export interface ToolInsert {
  id?: string
  user_id: string
  name: string
  type: string
  dimensions: {
    length: number
    width: number
    height: number
  }
  power_requirement?: {
    voltage: number
    amperage: number
    phase: number
  }
  dust_collection?: boolean
  min_clearance: {
    front: number
    back: number
    left: number
    right: number
    top: number
  }
  created_at?: string
  updated_at?: string
}

export interface ToolUpdate {
  name?: string
  type?: string
  dimensions?: {
    length: number
    width: number
    height: number
  }
  power_requirement?: {
    voltage: number
    amperage: number
    phase: number
  }
  dust_collection?: boolean
  min_clearance?: {
    front: number
    back: number
    left: number
    right: number
    top: number
  }
  updated_at?: string
}

export interface LayoutRow {
  id: string
  workshop_id: string
  user_id: string
  name: string
  tool_placements: any[]
  score: {
    overall: number
    workflow: number
    safety: number
    space: number
    accessibility: number
  }
  metadata: {
    optimizationTime: number
    algorithm: string
    iterations: number
    constraints: any[]
  }
  created_at: string
}

export interface LayoutInsert {
  id?: string
  workshop_id: string
  user_id: string
  name: string
  tool_placements: any[]
  score: {
    overall: number
    workflow: number
    safety: number
    space: number
    accessibility: number
  }
  metadata: {
    optimizationTime: number
    algorithm: string
    iterations: number
    constraints: any[]
  }
  created_at?: string
}

export interface LayoutUpdate {
  name?: string
  tool_placements?: any[]
  score?: {
    overall: number
    workflow: number
    safety: number
    space: number
    accessibility: number
  }
  metadata?: {
    optimizationTime: number
    algorithm: string
    iterations: number
    constraints: any[]
  }
}

export interface UserProfileRow {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  preferences: {
    units: 'imperial' | 'metric'
    defaultAlgorithm: string
    defaultWeights: {
      workflow: number
      safety: number
      space: number
      accessibility: number
    }
  }
  created_at: string
  updated_at: string
}

export interface UserProfileInsert {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  preferences?: {
    units: 'imperial' | 'metric'
    defaultAlgorithm: string
    defaultWeights: {
      workflow: number
      safety: number
      space: number
      accessibility: number
    }
  }
  created_at?: string
  updated_at?: string
}

export interface UserProfileUpdate {
  email?: string
  full_name?: string
  avatar_url?: string
  preferences?: {
    units: 'imperial' | 'metric'
    defaultAlgorithm: string
    defaultWeights: {
      workflow: number
      safety: number
      space: number
      accessibility: number
    }
  }
  updated_at?: string
}