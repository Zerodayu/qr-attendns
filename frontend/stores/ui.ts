import { create } from "zustand"

interface UiState {
  sidebarOpen: boolean
  scannerOpen: boolean
  lastScannedStudentId: number | null
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openScanner: () => void
  closeScanner: () => void
  setLastScannedStudentId: (id: number | null) => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  scannerOpen: false,
  lastScannedStudentId: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openScanner: () => set({ scannerOpen: true, lastScannedStudentId: null }),
  closeScanner: () => set({ scannerOpen: false }),
  setLastScannedStudentId: (id) => set({ lastScannedStudentId: id }),
}))
