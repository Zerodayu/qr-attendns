import { pgTable, serial, text, json, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// Linked to the parent (user) who registered the device for web push.
export const pushSubscription = pgTable("PushSubscription", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").unique().notNull(),
  keys: json("keys").$type<{ p256dh: string; auth: string }>().notNull(),
  browserInfo: json("browserInfo")
    .$type<{
      userAgent: string;
      browser: string;
      version: string;
      os: string;
      deviceType?: string;
    }>()
    .default({ userAgent: "", browser: "", version: "", os: "" })
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
