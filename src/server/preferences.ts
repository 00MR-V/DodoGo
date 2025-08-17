// src/server/preferences.ts
"use server";

import { db } from "@/db/drizzle";
import { preferences, userPreferences } from "@/db/prefs";
import { userPreferenceProfiles } from "@/db/prefs_profile";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";

/**
 * Build an LLM-ready JSON profile for the user's preferences
 * and upsert it into user_preference_profiles.
 */
async function buildAndUpsertPreferenceProfile(userId: string) {
    // Fetch selected preference IDs
    const selected = await db
        .select({ preferenceId: userPreferences.preferenceId })
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId));

    const ids = selected.map((r) => r.preferenceId);

    // If none selected, upsert an empty profile
    if (ids.length === 0) {
        const summary = {
            selectedIds: [] as number[],
            byCategory: {} as Record<string, string[]>,
            flatKeys: [] as string[],
            flatLabels: [] as string[],
            generatedAt: new Date().toISOString(),
        };

        await db
            .insert(userPreferenceProfiles)
            .values({
                userId,
                summaryJson: summary as any,
                version: "1",
            })
            .onConflictDoUpdate({
                target: userPreferenceProfiles.userId,
                set: {
                    summaryJson: summary as any,
                    version: "1",
                    updatedAt: new Date(),
                },
            });

        return;
    }

    // Join to preferences table to resolve category/key/label
    const rows = await db
        .select({
            id: preferences.id,
            key: preferences.key,
            label: preferences.label,
            category: preferences.category,
        })
        .from(preferences)
        .where(inArray(preferences.id, ids));

    // Build compact summary
    const byCategory: Record<string, string[]> = {};
    const flatKeys: string[] = [];
    const flatLabels: string[] = [];

    for (const r of rows) {
        byCategory[r.category] ??= [];
        byCategory[r.category].push(r.key);
        flatKeys.push(r.key);
        flatLabels.push(r.label);
    }

    const summary = {
        selectedIds: ids,
        byCategory,
        flatKeys,
        flatLabels,
        generatedAt: new Date().toISOString(),
    };

    // Upsert
    await db
        .insert(userPreferenceProfiles)
        .values({
            userId,
            summaryJson: summary as any,
            version: "1",
        })
        .onConflictDoUpdate({
            target: userPreferenceProfiles.userId,
            set: {
                summaryJson: summary as any,
                version: "1",
                updatedAt: new Date(),
            },
        });
}

/**
 * Save selected preference IDs for the current user.
 * Replaces any previous selections, marks prefsCompleted = true,
 * and refreshes the cached JSON profile.
 */
export async function savePreferences(selectedIds: number[]) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(), // Next 15: headers() is async
        });
        const userId = session?.user?.id;

        if (!userId) {
            return { success: false, message: "Not authenticated." };
        }

        // Replace previous selections
        await db.delete(userPreferences).where(eq(userPreferences.userId, userId));

        if (selectedIds.length > 0) {
            await db.insert(userPreferences).values(
                selectedIds.map((preferenceId) => ({
                    userId,
                    preferenceId,
                }))
            );
        }

        // Mark preference setup as completed
        await db
            .update(user)
            .set({ prefsCompleted: true, updatedAt: new Date() })
            .where(eq(user.id, userId));

        // Refresh LLM-ready profile cache
        await buildAndUpsertPreferenceProfile(userId);

        return { success: true, message: "Preferences saved." };
    } catch (err: any) {
        return { success: false, message: err?.message ?? "Failed to save preferences." };
    }
}

/** Returns true if the signed-in user has NOT saved any preferences yet. */
export async function userNeedsPreferences() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const userId = session?.user?.id;
    if (!userId) return true;

    // Fast path: check flag
    const flagRow = await db
        .select({ flag: user.prefsCompleted })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

    if (flagRow[0]?.flag) return false;

    // Fallback: check join table (for older users)
    const rows = await db
        .select({ pid: userPreferences.preferenceId })
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId))
        .limit(1);

    const hasAny = rows.length > 0;

    // Optional: backfill flag if needed
    if (hasAny) {
        await db
            .update(user)
            .set({ prefsCompleted: true, updatedAt: new Date() })
            .where(eq(user.id, userId));
    }

    return !hasAny;
}

/** Returns the signed-in user's selected preference IDs (empty array if none). */
export async function getUserPreferenceIds(): Promise<number[]> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const userId = session?.user?.id;
    if (!userId) return [];

    const rows = await db
        .select({ pid: userPreferences.preferenceId })
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId));

    return rows.map((r) => r.pid);
}

/** Fetch the cached JSON profile for the current user (or null). */
export async function getUserPreferenceProfile() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const userId = session?.user?.id;
    if (!userId) return null;

    const rows = await db
        .select({
            summary: userPreferenceProfiles.summaryJson,
            version: userPreferenceProfiles.version,
            updatedAt: userPreferenceProfiles.updatedAt,
        })
        .from(userPreferenceProfiles)
        .where(eq(userPreferenceProfiles.userId, userId))
        .limit(1);

    return rows[0] ?? null;
}
