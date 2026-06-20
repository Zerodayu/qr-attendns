CREATE TABLE "Attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"studentName" text NOT NULL,
	"date" date NOT NULL,
	"timeIn" timestamp,
	"timeOut" timestamp
);
--> statement-breakpoint
CREATE TABLE "PushSubscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"endpoint" text NOT NULL,
	"keys" json NOT NULL,
	CONSTRAINT "PushSubscription_endpoint_unique" UNIQUE("endpoint")
);
