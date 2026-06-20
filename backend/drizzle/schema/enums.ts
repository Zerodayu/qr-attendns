import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["teacher", "parent"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
