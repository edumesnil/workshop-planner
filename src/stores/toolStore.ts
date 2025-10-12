import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ToolRow, ToolTemplateRow } from '@/types/database'
import { db } from '@/services/supabase'
import type { ToolCategory } from '@/types'

interface ToolStore {
  // User's tool library
  tools: ToolRow[]

  // Tool templates (for creating new tools)
  templates: ToolTemplateRow[]

  // Loading states
  loading: {
    tools: boolean
    templates: boolean
  }

  // Error states
  error: {
    tools: string | null
    templates: string | null
  }

  // Actions - Tools
  setTools: (tools: ToolRow[]) => void
  addTool: (tool: ToolRow) => void
  updateTool: (id: string, updates: Partial<ToolRow>) => void
  deleteTool: (id: string) => void

  // Actions - Templates
  setTemplates: (templates: ToolTemplateRow[]) => void

  // Actions - Loading
  setLoading: (key: keyof ToolStore['loading'], value: boolean) => void

  // Actions - Error
  setError: (key: keyof ToolStore['error'], value: string | null) => void

  // Async Actions
  fetchTools: (userId: string) => Promise<void>
  fetchTemplates: () => Promise<void>
  fetchTemplatesByCategory: (category: ToolCategory) => Promise<void>
  createTool: (tool: any) => Promise<ToolRow | null>
  removeTool: (id: string) => Promise<void>
}

export const useToolStore = create<ToolStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      tools: [],
      templates: [],
      loading: {
        tools: false,
        templates: false,
      },
      error: {
        tools: null,
        templates: null,
      },

      // Sync Actions - Tools
      setTools: (tools) => set({ tools }),

      addTool: (tool) =>
        set((state) => ({
          tools: [...state.tools, tool],
        })),

      updateTool: (id, updates) =>
        set((state) => ({
          tools: state.tools.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTool: (id) =>
        set((state) => ({
          tools: state.tools.filter((t) => t.id !== id),
        })),

      // Sync Actions - Templates
      setTemplates: (templates) => set({ templates }),

      // Sync Actions - Loading
      setLoading: (key, value) =>
        set((state) => ({
          loading: { ...state.loading, [key]: value },
        })),

      // Sync Actions - Error
      setError: (key, value) =>
        set((state) => ({
          error: { ...state.error, [key]: value },
        })),

      // Async Actions
      fetchTools: async (userId: string) => {
        set((state) => ({
          loading: { ...state.loading, tools: true },
          error: { ...state.error, tools: null },
        }))

        const { data, error } = await db.tools.getAll(userId)

        if (error) {
          set((state) => ({
            loading: { ...state.loading, tools: false },
            error: { ...state.error, tools: error.message },
          }))
          return
        }

        set({
          tools: data || [],
          loading: { ...get().loading, tools: false },
        })
      },

      fetchTemplates: async () => {
        set((state) => ({
          loading: { ...state.loading, templates: true },
          error: { ...state.error, templates: null },
        }))

        const { data, error } = await db.toolTemplates.getAll()

        if (error) {
          set((state) => ({
            loading: { ...state.loading, templates: false },
            error: { ...state.error, templates: error.message },
          }))
          return
        }

        set({
          templates: data || [],
          loading: { ...get().loading, templates: false },
        })
      },

      fetchTemplatesByCategory: async (category: ToolCategory) => {
        set((state) => ({
          loading: { ...state.loading, templates: true },
          error: { ...state.error, templates: null },
        }))

        const { data, error } = await db.toolTemplates.getByCategory(category)

        if (error) {
          set((state) => ({
            loading: { ...state.loading, templates: false },
            error: { ...state.error, templates: error.message },
          }))
          return
        }

        set({
          templates: data || [],
          loading: { ...get().loading, templates: false },
        })
      },

      createTool: async (toolData: any) => {
        set((state) => ({
          loading: { ...state.loading, tools: true },
          error: { ...state.error, tools: null },
        }))

        const { data, error } = await db.tools.create(toolData)

        if (error) {
          set((state) => ({
            loading: { ...state.loading, tools: false },
            error: { ...state.error, tools: error.message },
          }))
          return null
        }

        if (data) {
          get().addTool(data)
        }

        set((state) => ({
          loading: { ...state.loading, tools: false },
        }))

        return data
      },

      removeTool: async (id: string) => {
        set((state) => ({
          loading: { ...state.loading, tools: true },
          error: { ...state.error, tools: null },
        }))

        const { error } = await db.tools.delete(id)

        if (error) {
          set((state) => ({
            loading: { ...state.loading, tools: false },
            error: { ...state.error, tools: error.message },
          }))
          return
        }

        get().deleteTool(id)

        set((state) => ({
          loading: { ...state.loading, tools: false },
        }))
      },
    }),
    {
      name: 'tool-store',
    }
  )
)
