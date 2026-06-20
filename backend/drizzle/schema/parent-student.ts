import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  primaryKey,
  serial,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { student } from "./student";

// Many-to-many: a parent can have multiple children, a student can have
// multiple guardians linked to the same record.
export const parentStudent = pgTable(
  "ParentStudent",
  {
    parentId: serial("parentId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    studentId: serial("studentId")
      .notNull()
      .references(() => student.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.parentId, table.studentId] }),
  }),
);

export const parentStudentRelations = relations(parentStudent, ({ one }) => ({
  parent: one(user, {
    fields: [parentStudent.parentId],
    references: [user.id],
  }),
  student: one(student, {
    fields: [parentStudent.studentId],
    references: [student.id],
  }),
}));
