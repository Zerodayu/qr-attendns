import { db } from "../../drizzle";
import { attendance, student } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { sendPushToParent } from "./push-sender";

export class attendanceService {
  async markTimeIn(studentId: number, teacherId: number) {
    const stud = await db.query.student.findFirst({
      where: eq(student.id, studentId),
      with: { section: true },
    });

    if (!stud) throw new Error("Student not found");
    if (stud.section.teacherId !== teacherId) throw new Error("Not your student");

    const today = new Date().toISOString().split("T")[0];

    const existing = await db.query.attendance.findFirst({
      where: and(eq(attendance.studentId, studentId), eq(attendance.date, today)),
    });

    let record;
    if (existing) {
      [record] = await db
        .update(attendance)
        .set({ timeIn: new Date() })
        .where(eq(attendance.id, existing.id))
        .returning();
    } else {
      [record] = await db
        .insert(attendance)
        .values({ studentId, date: today, timeIn: new Date() })
        .returning();
    }

    await sendPushToParent(studentId, stud.name, "in");
    return record;
  }

  async markTimeOut(studentId: number, teacherId: number) {
    const stud = await db.query.student.findFirst({
      where: eq(student.id, studentId),
      with: { section: true },
    });

    if (!stud) throw new Error("Student not found");
    if (stud.section.teacherId !== teacherId) throw new Error("Not your student");

    const today = new Date().toISOString().split("T")[0];

    const existing = await db.query.attendance.findFirst({
      where: and(eq(attendance.studentId, studentId), eq(attendance.date, today)),
    });

    if (!existing || !existing.timeIn) throw new Error("Student has not checked in today");

    const [record] = await db
      .update(attendance)
      .set({ timeOut: new Date() })
      .where(eq(attendance.id, existing.id))
      .returning();

    await sendPushToParent(studentId, stud.name, "out");
    return record;
  }
}
