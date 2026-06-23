"use server"

import { post, get } from "@/lib/api"

export async function signUp(body: { name: string; email: string; password: string; role?: string[] }) {
  return post("/auth/sign-up", body)
}

export async function signIn(body: { email: string; password: string }) {
  return post("/auth/sign-in", body)
}

export async function signOut() {
  return post("/auth/sign-out")
}

export async function getSession() {
  return get<{ user: { id: number; name: string; email: string; role: string[]; plan: string }; session: { token: string; expiresAt: string } }>("/auth/session")
}

export async function updateUser(body: { name?: string; image?: string }) {
  return post("/auth/update-user", body)
}

export async function changePassword(body: { currentPassword: string; newPassword: string }) {
  return post("/auth/change-password", body)
}

export async function forgotPassword(body: { email: string }) {
  return post("/auth/forget-password", body)
}

export async function resetPassword(body: { token: string; password: string }) {
  return post("/auth/reset-password", body)
}

export async function sendVerificationEmail() {
  return post("/auth/send-verification-email")
}

export async function verifyEmail(body: { token: string }) {
  return post("/auth/verify-email", body)
}
