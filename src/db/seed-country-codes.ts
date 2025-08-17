// src/db/seed-country-codes.ts
import { db } from "./drizzle";
import { countryCodes } from "./country_codes";

// libs we use to get a complete, accurate, up-to-date list
import metadata from "libphonenumber-js/metadata.min.json" assert { type: "json" };
import { getCountries, getCountryCallingCode } from "libphonenumber-js/core";
import * as isoCountries from "i18n-iso-countries";

// ensure English names are available (Node has Intl, this maps ISO2 -> name/ISO3)
isoCountries.registerLocale(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("i18n-iso-countries/langs/en.json")
);

async function main() {
    // All ISO2 country codes known to libphonenumber-js metadata (≈ 249)
    const iso2List = getCountries(metadata);

    let inserted = 0;
    let priority = 0;

    for (const iso2 of iso2List) {
        // country name in English
        const name =
            isoCountries.getName(iso2, "en", { select: "official" }) ||
            isoCountries.getName(iso2, "en") ||
            iso2;

        // alpha-3 code
        const iso3 = isoCountries.alpha2ToAlpha3(iso2) || "";

        // E.164 calling code (number, no plus sign)
        const callingCode = Number(getCountryCallingCode(iso2, metadata));

        // Display string for your UI dropdown
        const display = `${name} (+${callingCode})`;

        await db
            .insert(countryCodes)
            .values({
                iso2,
                iso3,
                name,
                callingCode,
                display,
                priority: priority++,
            })
            .onConflictDoNothing({ target: countryCodes.iso2 });

        inserted++;
    }

    console.log(`✅ Seeded ${inserted} country codes (complete global set).`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
