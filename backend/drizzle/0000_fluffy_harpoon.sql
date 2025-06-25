CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"done" boolean DEFAULT false,
	"completed" boolean DEFAULT false,
	"category" varchar(100),
	"priority" varchar(20) DEFAULT 'medium',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
