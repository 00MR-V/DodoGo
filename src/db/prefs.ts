// src/db/prefs.ts
import {
    pgTable,
    serial,
    text,
    varchar,
    integer,
    boolean,
    timestamp,
    primaryKey,
} from "drizzle-orm/pg-core";

/** Master list shown in the UI */
export const preferences = pgTable("preferences", {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 64 }).notNull().unique(),     // e.g. "tripType.beach"
    label: varchar("label", { length: 120 }).notNull(),         // e.g. "Beaches"
    category: varchar("category", { length: 64 }).notNull(),    // e.g. "tripType" | "activity" | "cuisine" | "season"
    description: text("description"),                           // optional helper text
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** Join table: which user selected which preference(s) */
export const userPreferences = pgTable(
    "user_preferences",
    {
        userId: text("user_id").notNull(),          // Better Auth user.id (text)
        preferenceId: integer("preference_id").notNull(), // references preferences.id
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.preferenceId] }), // one row per user+preference
    })
);
