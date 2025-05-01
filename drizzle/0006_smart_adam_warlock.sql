ALTER TABLE "fridge-stack_content" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "fridge-stack_content" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "fridge-stack_content" ALTER COLUMN "addedAt" SET DEFAULT '2025-04-30T22:18:09.596Z';--> statement-breakpoint
ALTER TABLE "fridge-stack_post" ALTER COLUMN "createdAt" SET DEFAULT '2025-04-30T22:18:09.596Z';--> statement-breakpoint
ALTER TABLE "fridge-stack_user" ALTER COLUMN "emailVerified" SET DEFAULT '2025-04-30T22:18:09.597Z';