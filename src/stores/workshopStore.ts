import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Workshop, Tool, Layout } from '@/types'

interface WorkshopStore {
  // Current workshop
  currentWorkshop: Workshop | null
  workshops: Workshop[]
  
  // Tools
  availableTools: Tool[]
  selectedTools: Tool[]
  
  // Layouts
  layouts: Layout[]
  currentLayout: Layout | null
  
  // Loading states
  loading: {
    workshops: boolean
    tools: boolean
    layouts: boolean
    optimization: boolean
  }
  
  // Actions
  setCurrentWorkshop: (workshop: Workshop | null) => void
  setWorkshops: (workshops: Workshop[]) => void
  addWorkshop: (workshop: Workshop) => void
  updateWorkshop: (id: string, updates: Partial<Workshop>) => void
  deleteWorkshop: (id: string) => void
  
  setAvailableTools: (tools: Tool[]) => void
  setSelectedTools: (tools: Tool[]) => void
  addTool: (tool: Tool) => void
  removeTool: (toolId: string) => void
  
  setLayouts: (layouts: Layout[]) => void
  setCurrentLayout: (layout: Layout | null) => void
  addLayout: (layout: Layout) => void
  
  setLoading: (key: keyof WorkshopStore['loading'], value: boolean) => void
}

export const useWorkshopStore = create<WorkshopStore>()(
  devtools(
    (set) => ({
      // Initial state
      currentWorkshop: null,
      workshops: [],
      availableTools: [],
      selectedTools: [],
      layouts: [],
      currentLayout: null,
      loading: {
        workshops: false,
        tools: false,
        layouts: false,
        optimization: false,
      },
      
      // Actions
      setCurrentWorkshop: (workshop) => set({ currentWorkshop: workshop }),
      
      setWorkshops: (workshops) => set({ workshops }),
      
      addWorkshop: (workshop) =>
        set((state) => ({ workshops: [...state.workshops, workshop] })),
      
      updateWorkshop: (id, updates) =>
        set((state) => ({
          workshops: state.workshops.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
          currentWorkshop:
            state.currentWorkshop?.id === id
              ? { ...state.currentWorkshop, ...updates }
              : state.currentWorkshop,
        })),
      
      deleteWorkshop: (id) =>
        set((state) => ({
          workshops: state.workshops.filter((w) => w.id !== id),
          currentWorkshop:
            state.currentWorkshop?.id === id ? null : state.currentWorkshop,
        })),
      
      setAvailableTools: (tools) => set({ availableTools: tools }),
      
      setSelectedTools: (tools) => set({ selectedTools: tools }),
      
      addTool: (tool) =>
        set((state) => ({
          availableTools: [...state.availableTools, tool],
        })),
      
      removeTool: (toolId) =>
        set((state) => ({
          availableTools: state.availableTools.filter((t) => t.id !== toolId),
          selectedTools: state.selectedTools.filter((t) => t.id !== toolId),
        })),
      
      setLayouts: (layouts) => set({ layouts }),
      
      setCurrentLayout: (layout) => set({ currentLayout: layout }),
      
      addLayout: (layout) =>
        set((state) => ({ layouts: [layout, ...state.layouts] })),
      
      setLoading: (key, value) =>
        set((state) => ({
          loading: { ...state.loading, [key]: value },
        })),
    }),
    {
      name: 'workshop-store',
    }
  )
)