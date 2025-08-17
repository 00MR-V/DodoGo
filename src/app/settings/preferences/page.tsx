// src/app/settings/preferences/page.tsx
import { db } from "@/db/drizzle";
import { preferences } from "@/db/prefs";
import PreferencesForm from "@/components/preferences-form";
import { getUserPreferenceIds } from "@/server/preferences";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ManagePreferencesPage() {
    // get all active prefs (sorted)
    const rows = await db
        .select()
        .from(preferences)
        .where(eq(preferences.active, true))
        .orderBy(
            asc(preferences.category),
            asc(preferences.sortOrder),
            asc(preferences.label)
        );

    // group by category for the form
    const grouped: Record<string, typeof rows> = {};
    for (const r of rows) {
        (grouped[r.category] ??= []).push(r);
    }

    // pre-fill with the user’s saved preference ids
    const selectedIds = await getUserPreferenceIds();

    return (
        <main className="mx-auto max-w-3xl p-6">
            <h1 className="text-2xl font-semibold">Manage your preferences</h1>
            <p className="text-sm text-muted-foreground mt-1">
                Update your travel interests anytime. These guide your itinerary suggestions.
            </p>

            <div className="mt-6">
                <PreferencesForm grouped={grouped} initialSelected={selectedIds} />
            </div>
        </main>
    );
}
