CREATE TABLE "country_codes" (
	"iso2" varchar(2) PRIMARY KEY NOT NULL,
	"iso3" varchar(3) NOT NULL,
	"name" varchar(100) NOT NULL,
	"calling_code" integer NOT NULL,
	"display" text NOT NULL,
	"priority" integer DEFAULT 999 NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
