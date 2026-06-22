import { db } from "@drizzle";
import { section, student, attendance } from "@drizzle/schema";
import { eq, and, inArray } from "drizzle-orm";

export class sectionService {
  async createSection(data: {
    name: string;
    classCode: string;
    teacherId: number;
  }) {
    const [newSection] = await db
      .insert(section)
      .values({
        name: data.name,
        classCode: data.classCode,
        teacherId: data.teacherId,
      })
      .returning();

    return newSection;
  }

  async getTeacherSections(teacherId: number, date?: string) {
    const sections = await db.query.section.findMany({
      where: eq(section.teacherId, teacherId),
    });

    const sectionIds = sections.map((s) => s.id);

    const students = sectionIds.length > 0
      ? await db.query.student.findMany({
          where: inArray(student.sectionId, sectionIds),
        })
      : [];

    const studentIds = students.map((s) => s.id);
    const targetDate = date || new Date().toISOString().split("T")[0];

    const todayAttendance = studentIds.length > 0
      ? await db.query.attendance.findMany({
          where: and(
            inArray(attendance.studentId, studentIds),
            eq(attendance.date, targetDate),
          ),
        })
      : [];

    const attendanceByStudentId = new Map(
      todayAttendance.map((a) => [a.studentId, a]),
    );

    return sections.map((sec) => ({
      id: sec.id,
      name: sec.name,
      classCode: sec.classCode,
      createdAt: sec.createdAt,
      students: students
        .filter((s) => s.sectionId === sec.id)
        .map((s) => {
          const a = attendanceByStudentId.get(s.id);
          return {
            id: s.id,
            name: s.name,
            gender: s.gender,
            attendanceToday: a
              ? { timeIn: a.timeIn, timeOut: a.timeOut }
              : null,
          };
        }),
    }));
  }
}
