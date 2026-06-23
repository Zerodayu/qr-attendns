import { create } from "zustand"

export interface DataStore<T> {
  data: T | null
  loading: boolean
  error: string | null
  lastFetched: number | null
  fetch: (...args: unknown[]) => Promise<void>
  reset: () => void
  setData: (data: T) => void
}

interface Config<T> {
  fetcher: (...args: unknown[]) => Promise<T>
}

export function createDataStore<T>({ fetcher }: Config<T>) {
  return create<DataStore<T>>((set) => ({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,

    fetch: async (...args: unknown[]) => {
      set({ loading: true, error: null })
      try {
        const data = await fetcher(...args)
        set({ data, loading: false, lastFetched: Date.now() })
      } catch (e) {
        set({
          loading: false,
          error: e instanceof Error ? e.message : "Unknown error",
        })
      }
    },

    reset: () => {
      set({ data: null, loading: false, error: null, lastFetched: null })
    },

    setData: (data: T) => {
      set({ data, lastFetched: Date.now() })
    },
  }))
}
