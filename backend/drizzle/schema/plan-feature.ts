import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const planFeature = pgTable(
  "plan_feature",
  {
    id: serial("id").primaryKey(),
    plan: text("plan").notNull(),
    featureKey: text("feature_key").notNull(),
    isEnabled: boolean("is_enabled").default(true).notNull(),
    config: jsonb("config").default({}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [uniqueIndex("plan_feature_plan_key_idx").on(t.plan, t.featureKey)],
);
