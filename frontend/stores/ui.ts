import { create } from "zustand";

interface UiState {
  closeScanner: () => void;
  lastScannedStudentId: number | null;
  openScanner: () => void;
  scannerOpen: boolean;
  setLastScannedStudentId: (id: number | null) => void;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
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
}));
