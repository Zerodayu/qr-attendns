CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
ALTER TABLE "Attendance" ADD COLUMN "gender" "gender" NOT NULL;