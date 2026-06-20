import {
  timestamp,
  pgTable,
  text,
  json,
  serial,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";

export const pushSubscription = pgTable("PushSubscription", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").unique().notNull(),
  keys: json("keys").$type<{ p256dh: string; auth: string }>().notNull(),
});

export const genderEnum = pgEnum("gender", ["male", "female"]);

export const attendance = pgTable("Attendance", {
  id: serial("id").primaryKey(),
  studentName: text("studentName").notNull(),
  gender: genderEnum("gender").notNull(),
  date: date("date").notNull(),
  timeIn: timestamp("timeIn"),
  timeOut: timestamp("timeOut"),
});
