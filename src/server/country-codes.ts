// src/server/country-codes.ts
"use server";

import { db } from "@/db/drizzle";
import { countryCodes } from "@/db/country_codes";
import { asc, ilike, or, eq } from "drizzle-orm";

/**
 * List country codes for a dropdown. Optional search filters by:
 * - country name (case-insensitive)
 * - ISO2 (e.g., "US")
 * - calling code digits (e.g., "1", "230")
 *
 * Returns up to 50 rows ordered by priority then name.
 */
export async function listCountryCodes(search?: string) {
    const baseSelect = db
        .select({
            iso2: countryCodes.iso2,
            name: countryCodes.name,
            callingCode: countryCodes.callingCode,
            display: countryCodes.display,
        })
        .from(countryCodes);

    // no search: just return in a nice order
    if (!search || !search.trim()) {
        return await baseSelect
            .orderBy(asc(countryCodes.priority), asc(countryCodes.name))
            .limit(50);
    }

    const q = search.trim();
    const numeric = /^\d+$/.test(q) ? Number(q) : null;

    // match name or iso2, and if numeric, match calling code too
    const where = numeric !== null
        ? or(
            ilike(countryCodes.name, `%${q}%`),
            ilike(countryCodes.iso2, `${q}%`),
            eq(countryCodes.callingCode, numeric)
        )
        : or(
            ilike(countryCodes.name, `%${q}%`),
            ilike(countryCodes.iso2, `${q}%`)
        );

    return await baseSelect
        .where(where)
        .orderBy(asc(countryCodes.priority), asc(countryCodes.name))
        .limit(50);
}
