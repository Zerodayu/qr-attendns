import { create } from "zustand"
import { get, post } from "@/lib/api"

interface User {
  id: number
  name: string
  email: string
  role: string[]
  plan: string
}

interface Session {
  user: User
  session: { token: string; expiresAt: string }
}

interface SessionStore {
  session: Session | null
  loading: boolean
  error: string | null
  fetch: () => Promise<void>
  signIn: (body: { email: string; password: string }) => Promise<void>
  signUp: (body: { name: string; email: string; password: string; role?: string[] }) => Promise<void>
  signOut: () => Promise<void>
  setSession: (session: Session) => void
  clear: () => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null })
    try {
      const session = await get<Session>("/auth/session")
      set({ session, loading: false })
    } catch {
      set({ session: null, loading: false })
    }
  },

  signIn: async (body) => {
    set({ loading: true, error: null })
    try {
      await post("/auth/sign-in", body)
      const session = await get<Session>("/auth/session")
      set({ session, loading: false })
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Sign in failed",
      })
      throw e
    }
  },

  signUp: async (body) => {
    set({ loading: true, error: null })
    try {
      await post("/auth/sign-up", body)
      const session = await get<Session>("/auth/session")
      set({ session, loading: false })
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Sign up failed",
      })
      throw e
    }
  },

  signOut: async () => {
    await post("/auth/sign-out")
    set({ session: null, error: null })
  },

  setSession: (session) => set({ session }),
  clear: () => set({ session: null, loading: false, error: null }),
}))
