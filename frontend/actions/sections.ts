"use server";

import { get, post } from "@/lib/api";

export interface Section {
  classCode: string;
  createdAt: string;
  id: number;
  name: string;
  students: Array<{
    id: number;
    name: string;
    gender: string;
    attendance: Array<{
      id: number;
      date: string;
      timeIn: string | null;
      timeOut: string | null;
    }>;
  }>;
  teacherId: number;
}

export async function getSections(date?: string) {
  const params = date ? `?date=${date}` : "";
  return get<Section[]>(`/sections${params}`);
}

export async function createSection(body: { name: string; classCode: string }) {
  return post<Section>("/sections", body);
}
