ALTER TABLE "country_codes" ALTER COLUMN "name" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "country_codes" ALTER COLUMN "display" SET DATA TYPE varchar(160);--> statement-breakpoint
ALTER TABLE "country_codes" ALTER COLUMN "priority" SET DATA TYPE smallint;--> statement-breakpoint
ALTER TABLE "country_codes" DROP COLUMN "active";