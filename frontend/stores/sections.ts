import { create } from "zustand";
import { get } from "@/lib/api";

interface Attendance {
  date: string;
  id: number;
  timeIn: string | null;
  timeOut: string | null;
}

interface Student {
  attendance: Attendance[];
  gender: string;
  id: number;
  name: string;
}

interface Section {
  classCode: string;
  createdAt: string;
  id: number;
  name: string;
  students: Student[];
  teacherId: number;
}

interface SectionsStore {
  error: string | null;
  fetch: (date?: string) => Promise<void>;
  lastFetched: number | null;
  loading: boolean;
  sections: Section[];
  setSections: (sections: Section[]) => void;
}

export const useSectionsStore = create<SectionsStore>((set) => ({
  sections: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetch: async (date?: string) => {
    set({ loading: true, error: null });
    try {
      const params = date ? `?date=${date}` : "";
      const sections = await get<Section[]>(`/sections${params}`);
      set({ sections, loading: false, lastFetched: Date.now() });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Failed to fetch sections",
      });
    }
  },

  setSections: (sections) => set({ sections, lastFetched: Date.now() }),
}));
