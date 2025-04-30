ALTER TABLE "fridge-stack_content" ALTER COLUMN "addedAt" SET DEFAULT '2025-04-30T16:42:59.944Z';--> statement-breakpoint
ALTER TABLE "fridge-stack_post" ALTER COLUMN "createdAt" SET DEFAULT '2025-04-30T16:42:59.943Z';--> statement-breakpoint
ALTER TABLE "fridge-stack_user" ALTER COLUMN "emailVerified" SET DEFAULT '2025-04-30T16:42:59.944Z';--> statement-breakpoint
ALTER TABLE "fridge-stack_content" ADD COLUMN "quantity" integer DEFAULT 1 NOT NULL;