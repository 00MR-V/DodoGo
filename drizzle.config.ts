import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
    schema: ["./src/db/schema.ts", "./src/db/prefs.ts", "./src/db/prefs_profile.ts", "./src/db/country_codes.ts",],
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
