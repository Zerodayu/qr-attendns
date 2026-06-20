import { db } from "../../drizzle";
import { student, section, parentStudent } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export class studentService {
  async createStudent(data: {
    name: string;
    gender: "male" | "female" | "other";
    sectionId: number;
    teacherId: number;
  }) {
    const found = await db.query.section.findFirst({
      where: and(eq(section.id, data.sectionId), eq(section.teacherId, data.teacherId)),
    });

    if (!found) {
      throw new Error("Section not found");
    }

    const [newStudent] = await db
      .insert(student)
      .values({
        name: data.name,
        gender: data.gender,
        sectionId: data.sectionId,
      })
      .returning();

    await db.insert(parentStudent).values({
      parentId: data.teacherId,
      studentId: newStudent.id,
    });

    return newStudent;
  }
}
