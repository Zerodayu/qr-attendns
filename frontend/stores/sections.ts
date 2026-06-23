import { create } from "zustand"
import { get } from "@/lib/api"

interface Attendance {
  id: number
  date: string
  timeIn: string | null
  timeOut: string | null
}

interface Student {
  id: number
  name: string
  gender: string
  attendance: Attendance[]
}

interface Section {
  id: number
  name: string
  classCode: string
  teacherId: number
  createdAt: string
  students: Student[]
}

interface SectionsStore {
  sections: Section[]
  loading: boolean
  error: string | null
  lastFetched: number | null
  fetch: (date?: string) => Promise<void>
  setSections: (sections: Section[]) => void
}

export const useSectionsStore = create<SectionsStore>((set) => ({
  sections: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetch: async (date?: string) => {
    set({ loading: true, error: null })
    try {
      const params = date ? `?date=${date}` : ""
      const sections = await get<Section[]>(`/sections${params}`)
      set({ sections, loading: false, lastFetched: Date.now() })
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Failed to fetch sections",
      })
    }
  },

  setSections: (sections) => set({ sections, lastFetched: Date.now() }),
}))
