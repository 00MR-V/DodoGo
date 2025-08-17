// src/db/country_codes.ts
import { pgTable, varchar, integer, smallint } from "drizzle-orm/pg-core";

export const countryCodes = pgTable("country_codes", {
    // 2-letter ISO code (primary key)
    iso2: varchar("iso2", { length: 2 }).primaryKey(),

    // 3-letter ISO code
    iso3: varchar("iso3", { length: 3 }).notNull(),

    // English country name
    name: varchar("name", { length: 128 }).notNull(),

    // E.164 calling code (no plus sign), e.g. 1, 44, 230
    callingCode: integer("calling_code").notNull(),

    // Prebuilt display like: "Mauritius (+230)"
    display: varchar("display", { length: 160 }).notNull(),

    // Optional ordering hint
    priority: smallint("priority").notNull().default(0),
});

export type CountryCodeRow = typeof countryCodes.$inferSelect;
