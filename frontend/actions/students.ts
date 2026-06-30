"use server";

import { post } from "@/lib/api";

export async function createStudent(
  sectionId: number,
  body: { name: string; gender: "male" | "female" | "other" }
) {
  return post(`/sections/${sectionId}/students`, body);
}
