"use server"

import { get, post } from "@/lib/api"

export async function createInvoice(plan: "essential" | "premium") {
  return post<{ checkoutUrl: string; linkId: string }>("/subscription/create-invoice", { plan })
}

export async function getStatus() {
  return get<{ plan: string; status: string; currentPeriodStart?: string; currentPeriodEnd?: string }>("/subscription/status")
}

export async function cancel() {
  return post("/subscription/cancel")
}
