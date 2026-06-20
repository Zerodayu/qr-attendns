import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { genderEnum } from "./enums";
import { section } from "./section";

export const student = pgTable("Student", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gender: genderEnum("gender").notNull(),
  sectionId: integer("sectionId")
    .notNull()
    .references(() => section.id, { onDelete: "cascade" }),
});
