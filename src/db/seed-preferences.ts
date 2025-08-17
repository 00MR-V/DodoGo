// src/db/seed-preferences.ts
import { db } from "./drizzle";
import { preferences } from "./prefs";

// Grouped + ordered cleanly for UI display
function buildSeed() {
    const items: Array<{
        key: string;
        label: string;
        category: string;
        description?: string;
        sortOrder?: number;
    }> = [
            // --- Trip Type ---
            { key: "tripType.city", label: "City Break", category: "tripType", description: "Museums, food, urban culture." },
            { key: "tripType.beach", label: "Beaches", category: "tripType", description: "Sun, sand, and sea." },
            { key: "tripType.mountain", label: "Mountains", category: "tripType", description: "Hiking and viewpoints." },
            { key: "tripType.roadtrip", label: "Road Trip", category: "tripType", description: "Flexible drives across regions." },

            // --- Activities ---
            { key: "activity.museums", label: "Museums & Galleries", category: "activity", description: "Art, history, science." },
            { key: "activity.foodtours", label: "Food Tours", category: "activity", description: "Street food and tastings." },
            { key: "activity.hiking", label: "Hiking", category: "activity", description: "Day hikes and short trails." },
            { key: "activity.nightlife", label: "Nightlife", category: "activity", description: "Bars, clubs, live music." },
            { key: "activity.watersports", label: "Water Sports", category: "activity", description: "Kayak, SUP, snorkel." },

            // --- Cuisine ---
            { key: "cuisine.local", label: "Local Cuisine", category: "cuisine", description: "Regional specialties." },
            { key: "cuisine.vegetarian", label: "Vegetarian-Friendly", category: "cuisine", description: "Plenty of veg options." },
            { key: "cuisine.streetfood", label: "Street Food", category: "cuisine", description: "Markets and hawkers." },
            { key: "cuisine.finedining", label: "Fine Dining", category: "cuisine", description: "Tasting menus and chef’s picks." },

            // --- Budget ---
            { key: "budget.value", label: "Best Value", category: "budget", description: "Good deals over frills." },
            { key: "budget.midrange", label: "Mid-range", category: "budget", description: "Balanced comfort and cost." },
            { key: "budget.luxury", label: "Luxury", category: "budget", description: "Premium experiences." },

            // --- Pace / Style ---
            { key: "pace.slow", label: "Slow & Relaxed", category: "pace", description: "Fewer stops, more time." },
            { key: "pace.balanced", label: "Balanced", category: "pace", description: "Mix of activity and downtime." },
        ];

    // Assign sortOrder within each category
    const counters: Record<string, number> = {};
    for (const item of items) {
        const c = item.category;
        counters[c] = (counters[c] ?? 0) + 1;
        item.sortOrder = counters[c];
    }
    return items;
}

async function main() {
    const seedData = buildSeed();

    for (const item of seedData) {
        await db
            .insert(preferences)
            .values({
                key: item.key,
                label: item.label,
                category: item.category,
                description: item.description ?? null,
                sortOrder: item.sortOrder!,
            })
            .onConflictDoNothing({ target: preferences.key });
    }

    console.log(`✅ Preferences seeded! Inserted/ensured ${seedData.length} items.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
