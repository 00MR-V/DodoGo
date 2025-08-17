// src/app/preferences-setup/page.tsx
import { db } from "@/db/drizzle";
import { preferences } from "@/db/prefs";
import PreferencesForm from "@/components/preferences-form";
import { eq, asc } from "drizzle-orm";
import { userNeedsPreferences } from "@/server/preferences";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PreferencesSetupPage() {
    // ✅ guard: if user already completed preferences, send them to dashboard
    const needsPrefs = await userNeedsPreferences();
    if (!needsPrefs) {
        redirect("/dashboard");
    }

    // fetch active preferences, sorted
    const rows = await db
        .select()
        .from(preferences)
        .where(eq(preferences.active, true))
        .orderBy(
            asc(preferences.category),
            asc(preferences.sortOrder),
            asc(preferences.label)
        );

    // group by category for nicer UI
    const grouped: Record<string, typeof rows> = {};
    for (const r of rows) {
        grouped[r.category] = grouped[r.category] || [];
        grouped[r.category].push(r);
    }

    return (
        <main className="mx-auto max-w-3xl p-6">
            <h1 className="text-2xl font-semibold">Choose your travel preferences</h1>
            <p className="text-sm text-muted-foreground mt-1">
                These help us tailor itineraries. You can change them later in your profile.
            </p>

            <div className="mt-6">
                <PreferencesForm grouped={grouped} />
            </div>
        </main>
    );
}
