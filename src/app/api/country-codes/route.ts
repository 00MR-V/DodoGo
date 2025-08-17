// src/app/api/country-codes/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { countryCodes } from "@/db/country_codes";
import { asc, ilike, or, eq } from "drizzle-orm";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();

    try {
        if (q.length > 0) {
            const isDigits = /^\d+$/.test(q);

            const rows = await db
                .select()
                .from(countryCodes)
                .where(
                    isDigits
                        ? or(
                            ilike(countryCodes.name, `%${q}%`),
                            ilike(countryCodes.iso2, `${q.toUpperCase()}%`),
                            eq(countryCodes.callingCode, Number(q))
                        )
                        : or(
                            ilike(countryCodes.name, `%${q}%`),
                            ilike(countryCodes.iso2, `${q.toUpperCase()}%`)
                        )
                )
                .orderBy(asc(countryCodes.priority), asc(countryCodes.name))
                .limit(50);

            return NextResponse.json(rows);
        }

        // no query -> default list
        const rows = await db
            .select()
            .from(countryCodes)
            .orderBy(asc(countryCodes.priority), asc(countryCodes.name))
            .limit(250);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching country codes:", error);
        return NextResponse.json(
            { error: "Failed to fetch country codes" },
            { status: 500 }
        );
    }
}
