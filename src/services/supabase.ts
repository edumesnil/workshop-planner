import { createClient } from '@supabase/supabase-js'
import type {
  WorkshopInsert,
  WorkshopUpdate,
  ToolInsert,
  ToolUpdate,
  LayoutInsert,
  UserProfileInsert,
  UserProfileUpdate,
  WorkshopToolInsert
} from '@/types/database'
import type { ToolCategory } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration is missing. Please check your environment variables.')
}

export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'dummy-key'
)

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    })
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  getUser: async () => {
    return await supabase.auth.getUser()
  },

  getSession: async () => {
    return await supabase.auth.getSession()
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  workshops: {
    getAll: async (userId: string) => {
      return await supabase
        .from('workshops')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
    },

    getById: async (id: string) => {
      return await supabase
        .from('workshops')
        .select('*')
        .eq('id', id)
        .single()
    },

    create: async (workshop: WorkshopInsert) => {
      return await supabase
        .from('workshops')
        .insert(workshop)
        .select()
        .single()
    },

    update: async (id: string, updates: WorkshopUpdate) => {
      return await supabase
        .from('workshops')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    },

    delete: async (id: string) => {
      return await supabase
        .from('workshops')
        .delete()
        .eq('id', id)
    }
  },

  tools: {
    getAll: async (userId: string) => {
      return await supabase
        .from('tools')
        .select('*')
        .eq('user_id', userId)
        .order('name')
    },

    create: async (tool: ToolInsert) => {
      return await supabase
        .from('tools')
        .insert(tool)
        .select()
        .single()
    },

    update: async (id: string, updates: ToolUpdate) => {
      return await supabase
        .from('tools')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    },

    delete: async (id: string) => {
      return await supabase
        .from('tools')
        .delete()
        .eq('id', id)
    }
  },

  toolTemplates: {
    getAll: async () => {
      return await supabase
        .from('tool_templates')
        .select('*')
        .eq('is_public', true)
        .order('category', { ascending: true })
        .then(result => {
          if (result.data) {
            // Sort by name within each category
            result.data.sort((a, b) => a.name.localeCompare(b.name))
          }
          return result
        })
    },

    getByCategory: async (category: ToolCategory) => {
      return await supabase
        .from('tool_templates')
        .select('*')
        .eq('is_public', true)
        .eq('category', category)
        .order('name', { ascending: true })
    }
  },

  workshopTools: {
    /**
     * Get all tools for a specific workshop with full tool details
     */
    getForWorkshop: async (workshopId: string) => {
      return await supabase
        .from('workshop_tools')
        .select(`
          id,
          added_at,
          tool:tools (*)
        `)
        .eq('workshop_id', workshopId)
        .order('added_at', { ascending: false })
    },

    /**
     * Add a tool to a workshop
     */
    addToWorkshop: async (workshopId: string, toolId: string) => {
      const insert: WorkshopToolInsert = {
        workshop_id: workshopId,
        tool_id: toolId
      }
      return await supabase
        .from('workshop_tools')
        .insert(insert)
        .select()
        .single()
    },

    /**
     * Remove a tool from a workshop
     */
    removeFromWorkshop: async (workshopId: string, toolId: string) => {
      return await supabase
        .from('workshop_tools')
        .delete()
        .eq('workshop_id', workshopId)
        .eq('tool_id', toolId)
    },

    /**
     * Check if a tool is already in a workshop
     */
    isInWorkshop: async (workshopId: string, toolId: string) => {
      const { data, error } = await supabase
        .from('workshop_tools')
        .select('id')
        .eq('workshop_id', workshopId)
        .eq('tool_id', toolId)
        .maybeSingle()

      if (error) return { exists: false, error }
      return { exists: !!data, error: null }
    },

    /**
     * Get all workshops that use a specific tool
     */
    getWorkshopsForTool: async (toolId: string) => {
      return await supabase
        .from('workshop_tools')
        .select(`
          id,
          added_at,
          workshop:workshops (*)
        `)
        .eq('tool_id', toolId)
        .order('added_at', { ascending: false })
    }
  },

  userProfiles: {
    get: async (userId: string) => {
      return await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
    },

    create: async (profile: UserProfileInsert) => {
      return await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single()
    },

    update: async (userId: string, updates: UserProfileUpdate) => {
      return await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
    }
  },

  layouts: {
    getByWorkshop: async (workshopId: string) => {
      return await supabase
        .from('layouts')
        .select('*')
        .eq('workshop_id', workshopId)
        .order('created_at', { ascending: false })
    },

    create: async (layout: LayoutInsert) => {
      return await supabase
        .from('layouts')
        .insert(layout)
        .select()
        .single()
    },

    delete: async (id: string) => {
      return await supabase
        .from('layouts')
        .delete()
        .eq('id', id)
    }
  }
}