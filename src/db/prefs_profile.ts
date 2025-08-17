import { pgTable, text, jsonb, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const userPreferenceProfiles = pgTable("user_preference_profiles", {
    userId: text("user_id").primaryKey(),          // matches user.id
    summaryJson: jsonb("summary_json").notNull(),  // denormalized, LLM-ready JSON
    version: text("version").notNull().default("1"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
