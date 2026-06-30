import { create } from "zustand";
import type { SessionData } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";

interface SessionStore {
  clear: () => void;
  error: string | null;
  fetch: () => Promise<void>;
  loading: boolean;
  session: SessionData | null;
  setSession: (session: SessionData) => void;
  signIn: (body: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (body: {
    name: string;
    email: string;
    password: string;
    role?: string[];
  }) => Promise<void>;
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    const { data, error } = await authClient.getSession();
    if (error) {
      set({ session: null, loading: false });
    } else {
      set({ session: data as SessionData, loading: false });
    }
  },

  async signIn(body) {
    set({ loading: true, error: null });
    const { error } = await authClient.signIn.email(body);
    if (error) {
      const message = error.message ?? "Sign in failed";
      set({ loading: false, error: message });
      return;
    }
    const { data } = await authClient.getSession();
    set({ session: data as SessionData, loading: false });
  },

  async signUp(body) {
    set({ loading: true, error: null });
    const { error } = await authClient.signUp.email(body);
    if (error) {
      const message = error.message ?? "Sign up failed";
      set({ loading: false, error: message });
      return;
    }
    const { data } = await authClient.getSession();
    set({ session: data as SessionData, loading: false });
  },

  signOut: async () => {
    await authClient.signOut();
    set({ session: null, error: null });
  },

  setSession: (session) => set({ session }),
  clear: () => set({ session: null, loading: false, error: null }),
}));
