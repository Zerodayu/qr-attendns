import { pgTable, text, integer, primaryKey } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { student } from "./student";

// Many-to-many: a parent can have multiple children, a student can have
// multiple guardians linked to the same record.
export const parentStudent = pgTable(
  "ParentStudent",
  {
    parentId: text("parentId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    studentId: integer("studentId")
      .notNull()
      .references(() => student.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.parentId, table.studentId] }),
  }),
);
