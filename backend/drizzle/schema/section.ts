import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// Tenant boundary: every student/attendance row traces back to a section,
// and every section traces back to exactly one teacher.
export const section = pgTable("Section", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g. "Grade 3 - Sampaguita"
  classCode: text("classCode").unique().notNull(), // parents use this to join
  teacherId: text("teacherId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
