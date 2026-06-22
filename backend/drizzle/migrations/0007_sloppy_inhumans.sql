ALTER TABLE "subscription" RENAME COLUMN "xendit_subscription_id" TO "provider";--> statement-breakpoint
ALTER TABLE "subscription" RENAME COLUMN "xendit_invoice_id" TO "provider_link_id";--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "provider_payment_id" text;