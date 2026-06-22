import { db } from "@drizzle";
import { section, student, parentStudent } from "@drizzle/schema";
import { eq, and, inArray } from "drizzle-orm";

export class parentService {
  async getStudentsByClassCode(classCode: string) {
    const found = await db.query.section.findFirst({
      where: eq(section.classCode, classCode),
    });

    if (!found) {
      throw new Error("Section not found");
    }

    const students = await db.query.student.findMany({
      where: eq(student.sectionId, found.id),
    });

    return {
      sectionId: found.id,
      sectionName: found.name,
      students: students.map((s) => ({
        id: s.id,
        name: s.name,
        gender: s.gender,
      })),
    };
  }

  async linkStudents(parentId: number, studentIds: number[]) {
    const existing = await db.query.parentStudent.findMany({
      where: and(
        eq(parentStudent.parentId, parentId),
        inArray(parentStudent.studentId, studentIds),
      ),
    });

    const existingIds = new Set(existing.map((r) => r.studentId));
    const newIds = studentIds.filter((id) => !existingIds.has(id));

    if (newIds.length > 0) {
      await db.insert(parentStudent).values(
        newIds.map((studentId) => ({ parentId, studentId })),
      );
    }

    return { success: true, linked: newIds.length };
  }
}
