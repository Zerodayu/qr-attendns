import { create } from "zustand"
import { post } from "@/lib/api"

interface AttendanceRecord {
  id: number
  studentId: number
  studentName: string
  date: string
  timeIn: string | null
  timeOut: string | null
}

interface AttendanceStore {
  marked: AttendanceRecord[]
  marking: Set<number>
  error: string | null
  timeIn: (studentId: number) => Promise<void>
  timeOut: (studentId: number) => Promise<void>
  clearMarked: () => void
  clearError: () => void
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  marked: [],
  marking: new Set(),
  error: null,

  timeIn: async (studentId) => {
    if (get().marking.has(studentId)) return
    set({ marking: new Set([...get().marking, studentId]), error: null })
    try {
      const record = await post<AttendanceRecord>("/attendance/time-in", { studentId })
      set({
        marked: [...get().marked, { ...record, studentName: record.studentName }],
        marking: new Set([...get().marking].filter((id) => id !== studentId)),
      })
    } catch (e) {
      set({
        marking: new Set([...get().marking].filter((id) => id !== studentId)),
        error: e instanceof Error ? e.message : "Failed to mark time-in",
      })
    }
  },

  timeOut: async (studentId) => {
    if (get().marking.has(studentId)) return
    set({ marking: new Set([...get().marking, studentId]), error: null })
    try {
      const record = await post<AttendanceRecord>("/attendance/time-out", { studentId })
      set({
        marked: get().marked.map((m) =>
          m.studentId === studentId ? { ...m, ...record } : m,
        ),
        marking: new Set([...get().marking].filter((id) => id !== studentId)),
      })
    } catch (e) {
      set({
        marking: new Set([...get().marking].filter((id) => id !== studentId)),
        error: e instanceof Error ? e.message : "Failed to mark time-out",
      })
    }
  },

  clearMarked: () => set({ marked: [], error: null }),
  clearError: () => set({ error: null }),
}))
