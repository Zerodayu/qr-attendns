import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  integer,
  date,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { student } from "./student";

// One row per student per day; timeOut gets filled in later via update.
export const attendance = pgTable(
  "Attendance",
  {
    id: serial("id").primaryKey(),
    studentId: integer("studentId")
      .notNull()
      .references(() => student.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    timeIn: timestamp("timeIn"),
    timeOut: timestamp("timeOut"),
  },
  (table) => [uniqueIndex("student_date_idx").on(table.studentId, table.date)],
);

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(student, {
    fields: [attendance.studentId],
    references: [student.id],
  }),
}));
