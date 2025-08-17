ALTER TABLE "user" ADD COLUMN "phone_e164" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone_country" char(2);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone_national" varchar(32);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_phone_e164_unique" UNIQUE("phone_e164");