import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,
      initialized: false,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),

      initialize: async () => {
        if (get().initialized) return

        set({ loading: true })

        try {
          // Get current session
          const { data: { session } } = await supabase.auth.getSession()

          set({
            user: session?.user ?? null,
            session,
            initialized: true,
            loading: false,
          })

          // Listen for auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            set({
              user: session?.user ?? null,
              session,
            })
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({ loading: false, initialized: true })
        }
      },

      signOut: async () => {
        try {
          await supabase.auth.signOut()
          set({ user: null, session: null })
        } catch (error) {
          console.error('Sign out error:', error)
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: () => ({
        // Don't persist anything - always initialize fresh
      }),
    }
  )
)
