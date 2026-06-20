import { relations } from "drizzle-orm";
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { genderEnum } from "./enums";
import { section } from "./section";
import { attendance } from "./attendance";
import { parentStudent } from "./parent-student";

export const student = pgTable("Student", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gender: genderEnum("gender").notNull(),
  sectionId: integer("sectionId")
    .notNull()
    .references(() => section.id, { onDelete: "cascade" }),
});

export const studentRelations = relations(student, ({ one, many }) => ({
  section: one(section, {
    fields: [student.sectionId],
    references: [section.id],
  }),
  attendance: many(attendance),
  parentLinks: many(parentStudent),
}));
