CREATE TABLE "user_preference_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"summary_json" jsonb NOT NULL,
	"version" text DEFAULT '1' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
