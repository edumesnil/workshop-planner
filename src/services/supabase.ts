import { createClient } from '@supabase/supabase-js'

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

    create: async (workshop: any) => {
      return await supabase
        .from('workshops')
        .insert(workshop)
        .select()
        .single()
    },

    update: async (id: string, updates: any) => {
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

    create: async (tool: any) => {
      return await supabase
        .from('tools')
        .insert(tool)
        .select()
        .single()
    },

    update: async (id: string, updates: any) => {
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

  layouts: {
    getByWorkshop: async (workshopId: string) => {
      return await supabase
        .from('layouts')
        .select('*')
        .eq('workshop_id', workshopId)
        .order('created_at', { ascending: false })
    },

    create: async (layout: any) => {
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