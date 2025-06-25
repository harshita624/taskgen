CREATE TYPE "public"."priority" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "priority" SET DATA TYPE "public"."priority" USING "priority"::"public"."priority";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "priority" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "priority" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "due" timestamp;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "tags" varchar(255)[];--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "category_id" integer;
ALTER TABLE tasks
ALTER COLUMN category_id TYPE INTEGER USING category_id::integer;