import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["teacher", "parent"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const userPlanEnum = pgEnum("user_plan", ["free", "essential", "premium"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "inactive",
  "cancelled",
  "expired",
  "trialing",
]);
