"use server"

import { post } from "@/lib/api"

export async function markTimeIn(studentId: number) {
  return post("/attendance/time-in", { studentId })
}

export async function markTimeOut(studentId: number) {
  return post("/attendance/time-out", { studentId })
}
