CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('teacher', 'parent');--> statement-breakpoint
CREATE TABLE "Attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"studentId" integer NOT NULL,
	"date" date NOT NULL,
	"timeIn" timestamp,
	"timeOut" timestamp
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" serial NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" serial NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"username" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text DEFAULT 'parent' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" serial PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PushSubscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"endpoint" text NOT NULL,
	"keys" json NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "PushSubscription_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "ParentStudent" (
	"parentId" text NOT NULL,
	"studentId" integer NOT NULL,
	CONSTRAINT "ParentStudent_parentId_studentId_pk" PRIMARY KEY("parentId","studentId")
);
--> statement-breakpoint
CREATE TABLE "Section" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"classCode" text NOT NULL,
	"teacherId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Section_classCode_unique" UNIQUE("classCode")
);
--> statement-breakpoint
CREATE TABLE "Student" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"gender" "gender" NOT NULL,
	"sectionId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_Student_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_parentId_user_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_studentId_Student_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Section" ADD CONSTRAINT "Section_teacherId_user_id_fk" FOREIGN KEY ("teacherId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Student" ADD CONSTRAINT "Student_sectionId_Section_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."Section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "student_date_idx" ON "Attendance" USING btree ("studentId","date");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");