"use server";

import { post } from "@/lib/api";

export async function joinSection(classCode: string) {
  return post<{
    section: { id: number; name: string };
    students: Array<{ id: number; name: string }>;
  }>("/parent/join", { classCode });
}

export async function linkStudents(studentIds: number[]) {
  return post("/parent/students", { studentIds });
}
